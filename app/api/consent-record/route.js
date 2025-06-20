import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map();

export async function POST(request) {
  console.log('🚀 === CONSENT API CALLED ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌍 Environment:', process.env.NODE_ENV);
  
  try {
    // 1. Check request origin - Development friendly
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    console.log('📍 Request Details:');
    console.log('  - Origin:', origin);
    console.log('  - Host:', host);
    console.log('  - User-Agent:', request.headers.get('user-agent')?.substring(0, 100));
    
    const allowedOrigins = [
      'https://vespanida.lt',
      'https://www.vespanida.lt',
      'https://en.vespanida.lt',
      'https://de.vespanida.lt', 
      'https://pl.vespanida.lt',
      'https://www.en.vespanida.lt',
      'https://www.de.vespanida.lt',
      'https://www.pl.vespanida.lt',  
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    ].filter(Boolean);
    
    console.log('✅ Allowed origins:', allowedOrigins);
    
    // Skip origin check in development, enforce in production
    if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
      console.log('❌ Origin validation failed - Blocked origin:', origin);
      return NextResponse.json({ error: 'Forbidden origin', origin: origin }, { status: 403 });
    }
    
    console.log('✅ Origin validation passed');

    // 2. Environment variables check
    console.log('🔧 Environment Variables Check:');
    console.log('  - Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING');
    console.log('  - Firebase API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    
    // 3. Firebase Admin DB check
    console.log('🔥 Firebase Admin Check:');
    try {
      console.log('  - Admin DB object exists:', !!adminDb);
      console.log('  - Admin DB type:', typeof adminDb);
    } catch (dbError) {
      console.error('❌ Firebase Admin DB Error:', dbError);
      throw new Error('Firebase Admin DB initialization failed: ' + dbError.message);
    }

    // 4. Get and validate IP
    const clientIP = getClientIP(request);
    const hashedIP = clientIP !== 'unknown' ? await hashString(clientIP) : 'unknown';
    
    console.log('🌐 Client IP processed:', clientIP !== 'unknown' ? 'YES' : 'NO');

    // 5. Rate limiting (relaxed for development)
    const maxRequests = process.env.NODE_ENV === 'development' ? 50 : 10;
    if (await isRateLimited(clientIP, maxRequests)) {
      console.log('❌ Rate limited:', clientIP);
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    console.log('✅ Rate limiting passed');

    // 6. Validate request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 2048) {
      console.log('❌ Request too large:', contentLength);
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }
    
    console.log('✅ Request size validation passed');

    // 7. Parse and validate consent data
    console.log('📄 Parsing consent data...');
    const consentData = await request.json();
    console.log('📄 Raw consent data:', consentData);
    
    if (!consentData || typeof consentData !== 'object') {
      console.log('❌ Invalid consent data type');
      return NextResponse.json({ error: 'Invalid consent data' }, { status: 400 });
    }

    if (!isValidConsentData(consentData)) {
      console.log('❌ Missing required fields in consent data');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log('✅ Consent data validation passed');
    
    // 8. Sanitize and validate data
    const sanitizedData = {
      necessary: Boolean(consentData.necessary),
      analytics: Boolean(consentData.analytics),
      marketing: Boolean(consentData.marketing),
      preferences: Boolean(consentData.preferences),
      consentMethod: sanitizeString(consentData.consentMethod, 50),
      userAgent: sanitizeString(consentData.userAgent, 500),
      url: isValidUrl(consentData.url) ? consentData.url : '',
      referrer: isValidUrl(consentData.referrer) ? consentData.referrer : ''
    };
    
    console.log('📋 Sanitized data:', sanitizedData);
    
    // 9. Create consent record for GDPR compliance
    const consentRecord = {
      ...sanitizedData,
      ipHash: hashedIP,
      timestamp: new Date(),
      source: 'website',
      version: '1.0'
    };
    
    console.log('💾 Final consent record to save:', consentRecord);
    
    // 10. Store in Firebase using Admin SDK
    console.log('🔥 Attempting to save to Firebase...');
    console.log('🔥 Admin DB collection method exists:', typeof adminDb.collection);
    
    const docRef = await adminDb.collection('consent-records').add(consentRecord);
    
    console.log('✅ SUCCESS! Consent saved with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ === DETAILED ERROR ANALYSIS ===');
    console.error('❌ Error occurred at:', new Date().toISOString());
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack (first 10 lines):');
    if (error.stack) {
      error.stack.split('\n').slice(0, 10).forEach((line, i) => {
        console.error(`❌   ${i + 1}: ${line}`);
      });
    }
    console.error('❌ Full error object:', error);
    console.error('❌ Error constructor:', error.constructor.name);
    
    // Specific Firebase error handling
    if (error.code) {
      console.error('🔥 Firebase-specific error code:', error.code);
      
      if (error.code === 'permission-denied') {
        console.error('🔥 Permission denied - check Firebase rules');
        return NextResponse.json({ 
          error: 'Database access denied', 
          details: error.message,
          code: error.code,
          suggestion: 'Check Firebase security rules'
        }, { status: 403 });
      }
      
      if (error.code === 'unavailable') {
        console.error('🔥 Firebase unavailable');
        return NextResponse.json({ 
          error: 'Database temporarily unavailable', 
          details: error.message,
          code: error.code
        }, { status: 503 });
      }
    }
    
    // Admin SDK specific errors
    if (error.message?.includes('firebase-admin')) {
      console.error('🔥 Firebase Admin SDK error detected');
      return NextResponse.json({ 
        error: 'Firebase Admin SDK error', 
        details: error.message,
        suggestion: 'Check Firebase Admin initialization'
      }, { status: 500 });
    }
    
    // Network/connection errors
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('timeout')) {
      console.error('🌐 Network connectivity error');
      return NextResponse.json({ 
        error: 'Network connectivity error', 
        details: error.message
      }, { status: 503 });
    }
    
    // Return comprehensive error info
    return NextResponse.json({ 
      error: 'Failed to record consent',
      details: error.message,
      errorName: error.name,
      errorCode: error.code || 'unknown',
      timestamp: new Date().toISOString(),
      suggestion: 'Check server logs for detailed error information'
    }, { status: 500 });
  }
}

// Helper function to get client IP
function getClientIP(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  return 'localhost';
}

// Rate limiting function
async function isRateLimited(ip, maxRequests = 10) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  
  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return true;
  }
  
  rateLimitMap.set(ip, [...recentRequests, now]);
  return false;
}

// Validate consent data structure
function isValidConsentData(data) {
  const requiredFields = ['necessary', 'analytics', 'marketing', 'preferences', 'consentMethod'];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    console.log('❌ Missing required fields:', missingFields);
    return false;
  }
  
  return true;
}

// Sanitize string input
function sanitizeString(str, maxLength = 100) {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .substring(0, maxLength)
    .replace(/[<>]/g, '')
    .replace(/\0/g, '')
    .trim();
}

// Validate URL
function isValidUrl(string) {
  if (!string || typeof string !== 'string') return false;
  
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Hash string for privacy
async function hashString(str) {
  if (!str || typeof str !== 'string') return 'unknown';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Enhanced test endpoint
export async function GET() {
  console.log('🔍 GET request to consent API');
  
  try {
    // Test Firebase Admin connection
    console.log('🧪 Testing Firebase Admin connection...');
    const testQuery = adminDb.collection('consent-records').limit(1);
    await testQuery.get();
    console.log('✅ Firebase Admin connection successful');
    
    return NextResponse.json({ 
      message: 'Consent API is working with Firebase Admin!',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      firebaseTest: 'SUCCESS'
    });
    
  } catch (error) {
    console.error('❌ GET endpoint Firebase test failed:', error);
    
    return NextResponse.json({ 
      message: 'API endpoint working but Firebase connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      firebaseTest: 'FAILED'
    }, { status: 500 });
  }
}