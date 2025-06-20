import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin'; // ← Use Admin SDK instead

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map();

export async function POST(request) {
  try {
    // 1. Check request origin - Development friendly
    const origin = request.headers.get('origin');
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
    
    // Skip origin check in development, enforce in production
    if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
      console.log('❌ Blocked origin:', origin);
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Consent request received');
      console.log('📍 Origin:', origin);
    }

    // 2. Get and validate IP
    const clientIP = getClientIP(request);
    const hashedIP = clientIP !== 'unknown' ? await hashString(clientIP) : 'unknown';

    // 3. Rate limiting (relaxed for development)
    const maxRequests = process.env.NODE_ENV === 'development' ? 50 : 10;
    if (await isRateLimited(clientIP, maxRequests)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // 4. Validate request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 2048) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    // 5. Parse and validate consent data
    const consentData = await request.json();
    
    if (!consentData || typeof consentData !== 'object') {
      return NextResponse.json({ error: 'Invalid consent data' }, { status: 400 });
    }

    if (!isValidConsentData(consentData)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // 6. Sanitize and validate data
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
    
    // 7. Create consent record for GDPR compliance
    const consentRecord = {
      ...sanitizedData,
      ipHash: hashedIP,
      timestamp: new Date(), // ← Use regular Date instead of serverTimestamp()
      source: 'website',
      version: '1.0'
    };
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Saving consent record:', consentRecord);
    }
    
    // 8. Store in Firebase using Admin SDK
    const docRef = await adminDb.collection('consent-records').add(consentRecord);
    
    // Success logging
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Consent saved with ID:', docRef.id);
    }
    
    return NextResponse.json({ success: true, id: docRef.id });
    
  } catch (error) {
    console.error('❌ Consent recording error:', error);
    
    // More specific error handling
    if (error.code === 'permission-denied') {
      return NextResponse.json({ error: 'Database access denied' }, { status: 403 });
    }
    
    if (error.code === 'unavailable') {
      return NextResponse.json({ error: 'Database temporarily unavailable' }, { status: 503 });
    }
    
    return NextResponse.json({ error: 'Failed to record consent' }, { status: 500 });
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
  return requiredFields.every(field => field in data);
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

// Test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Consent API is working with Firebase Admin!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
}