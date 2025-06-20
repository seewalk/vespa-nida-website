const {onDocumentCreated, onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// ✅ CORRECT n8n webhook URL
const N8N_WEBHOOK_URL = 'https://seewalk.app.n8n.cloud/webhook-test/booking-automation';

// Simple test function - PUBLIC ACCESS
exports.helloWorld = onRequest({
  cors: true
}, (request, response) => {
  response.send('Hello from Firebase Functions v6!');
});

// Test webhook function - PUBLIC ACCESS
exports.testWebhook = onRequest({
  cors: true
}, async (request, response) => {
  try {
    const testData = {
      event: 'test',
      message: 'Test from Firebase Functions v6',
      timestamp: new Date().toISOString(),
    };

    console.log('Sending test webhook to:', N8N_WEBHOOK_URL);
    
    const result = await axios.post(N8N_WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    response.json({
      success: true,
      message: 'Test webhook sent successfully',
      status: result.status,
      sentData: testData
    });
  } catch (error) {
    console.error('Test webhook error:', error.message);
    response.status(500).json({
      success: false,
      error: error.message,
      url: N8N_WEBHOOK_URL,
    });
  }
});

// Booking created trigger with clean data structure
exports.onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  console.log('🔥 onBookingCreated function triggered');
  
  const booking = event.data && event.data.data ? event.data.data() : null;
  const bookingId = event.params && event.params.bookingId ? event.params.bookingId : null;

  console.log('📋 Booking ID:', bookingId);
  console.log('📋 Booking data:', JSON.stringify(booking, null, 2));

  if (!booking || !bookingId) {
    console.error('❌ Missing booking data or ID');
    return null;
  }

  // Clean webhook payload - flatten structure for easier n8n access
  const webhookPayload = {
    event: 'booking_created',  // ← Root level event for Switch node
    bookingId: bookingId,
    
    // Flatten customer data
    customerName: booking.customer?.name || '',
    customerEmail: booking.customer?.email || '',
    customerPhone: booking.customer?.phone || '',
    customerAge: booking.customer?.age || '',
    customerDrivingLicense: booking.customer?.drivingLicense || '',
    
    // Flatten booking data
    bookingReference: booking.bookingReference || '',
    vespaModel: booking.booking?.vespaModel || '',
    startDate: booking.booking?.startDate || '',
    endDate: booking.booking?.endDate || '',
    rentalType: booking.booking?.rentalType || '',
    route: booking.booking?.route || '',
    additionalHelmet: booking.booking?.additionalHelmet || false,
    message: booking.booking?.message || '',
    
    // Flatten pricing data
    basePrice: booking.pricing?.basePrice || 0,
    helmetPrice: booking.pricing?.helmetPrice || 0,
    subtotal: booking.pricing?.subtotal || 0,
    securityDeposit: booking.pricing?.securityDeposit || 0,
    totalAmount: booking.pricing?.totalAmount || 0,
    
    // Status and workflow
    status: booking.status || 'pending_confirmation',
    confirmationEmailSent: booking.workflow?.confirmationEmailSent || false,
    
    // Metadata
    language: booking.metadata?.language || 'lt',
    source: booking.metadata?.source || 'website_booking_form',
    
    // Keep original nested structure for backward compatibility
    booking: booking,
    
    timestamp: new Date().toISOString(),
  };

  console.log('🚀 Sending to n8n webhook:', N8N_WEBHOOK_URL);
  console.log('📤 Clean payload structure created');

  // Send to n8n webhook
  try {
    const response = await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('✅ Successfully sent booking to n8n');
    console.log('📊 Response status:', response.status);
  } catch (error) {
    console.error('❌ Error sending booking to n8n:', error.message);
  }

  return null;
});

// Booking updated trigger with clean data structure
exports.onBookingUpdated = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  const beforeData = event.data && event.data.before && event.data.before.data ? 
    event.data.before.data() : null;
  const afterData = event.data && event.data.after && event.data.after.data ? 
    event.data.after.data() : null;
  const bookingId = event.params && event.params.bookingId ? event.params.bookingId : null;

  console.log('📝 Booking updated:', bookingId);

  if (!beforeData || !afterData || !bookingId) {
    console.error('❌ Missing booking data');
    return null;
  }

  // Only trigger if status changed
  if (beforeData.status !== afterData.status) {
    console.log('🔄 Booking status changed:', bookingId, 
        beforeData.status, '->', afterData.status);

    // Clean webhook payload for status changes
    const webhookPayload = {
      event: 'booking_status_changed',  // ← Root level event for Switch node
      bookingId: bookingId,
      oldStatus: beforeData.status,
      newStatus: afterData.status,
      
      // Flatten customer data
      customerName: afterData.customer?.name || '',
      customerEmail: afterData.customer?.email || '',
      customerPhone: afterData.customer?.phone || '',
      
      // Flatten booking data
      bookingReference: afterData.bookingReference || '',
      vespaModel: afterData.booking?.vespaModel || '',
      startDate: afterData.booking?.startDate || '',
      rentalType: afterData.booking?.rentalType || '',
      totalAmount: afterData.pricing?.totalAmount || 0,
      
      // Keep original nested structure for backward compatibility
      booking: afterData,
      
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('✅ Successfully sent status change to n8n:', response.status);
    } catch (error) {
      console.error('❌ Error sending status change to n8n:', error.message);
    }
  }

  return null;
});

const functions = require('firebase-functions');
const jwt = require('jsonwebtoken');

const privateKey = functions.config().jwt.private_key;
const clientEmail = functions.config().jwt.client_email;

exports.generateFirebaseToken = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const now = Math.floor(Date.now() / 1000);

      const payload = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/datastore",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      };

      const signedJWT = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

      res.json({
        jwt: signedJWT,
        expires: new Date((now + 3600) * 1000).toISOString()
      });
    } catch (err) {
      console.error('❌ JWT generation error:', err.message);
      res.status(500).json({ error: 'JWT signing failed' });
    }
  }
);