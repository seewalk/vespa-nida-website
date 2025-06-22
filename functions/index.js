const {onDocumentCreated, onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// ✅ CORRECT n8n webhook URL
const N8N_WEBHOOK_URL = 'https://seewalk.app.n8n.cloud/webhook/booking-automation';

// Simple test function - PUBLIC ACCESS
exports.helloWorld = onRequest({
  cors: true,
  region: 'us-central1'
}, (request, response) => {
  response.send('Hello from Firebase Functions v2!');
});

// Test webhook function - PUBLIC ACCESS
exports.testWebhook = onRequest({
  cors: true,
  region: 'us-central1'
}, async (request, response) => {
  try {
    const testData = {
      event: 'test',
      message: 'Test from Firebase Functions v2',
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

// Booking created trigger - FIXED
exports.onBookingCreated = onDocumentCreated({
  document: 'bookings/{bookingId}',
  region: 'us-central1'
}, async (event) => {
  console.log('🔥 onBookingCreated function triggered');
  
  const booking = event.data?.data();
  const bookingId = event.params?.bookingId;

  console.log('📋 Booking ID:', bookingId);
  console.log('📋 Booking data:', JSON.stringify(booking, null, 2));

  if (!booking || !bookingId) {
    console.error('❌ Missing booking data or ID');
    return null;
  }

  // Clean webhook payload for n8n Switch node
  const webhookPayload = {
    event: 'booking_created',  // ← This is what your Switch node should check
    bookingId: bookingId,
    status: booking.status || 'pending_confirmation',
    
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
    confirmationEmailSent: booking.workflow?.confirmationEmailSent || false,
    
    // Metadata
    language: booking.metadata?.language || 'lt',
    source: booking.metadata?.source || 'website_booking_form',
    
    timestamp: new Date().toISOString(),
  };

  console.log('🚀 Sending to n8n webhook:', N8N_WEBHOOK_URL);
  console.log('📤 Payload:', JSON.stringify(webhookPayload, null, 2));

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
    return null;
  } catch (error) {
    console.error('❌ Error sending booking to n8n:', error.message);
    if (error.response) {
      console.error('❌ Response data:', error.response.data);
      console.error('❌ Response status:', error.response.status);
    }
    return null;
  }
});

// Booking updated trigger - FIXED
exports.onBookingUpdated = onDocumentUpdated({
  document: 'bookings/{bookingId}',
  region: 'us-central1'
}, async (event) => {
  const beforeData = event.data?.before?.data();
  const afterData = event.data?.after?.data();
  const bookingId = event.params?.bookingId;

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

// Function to store email logs (called by n8n)
exports.logEmailStatus = onRequest({
  cors: true,
  region: 'us-central1'
}, async (request, response) => {
  try {
    console.log('📧 Logging email status:', JSON.stringify(request.body, null, 2));
    
    const { bookingId, emailType, status, error, timestamp } = request.body;
    
    if (!bookingId || !emailType || !status) {
      return response.status(400).json({ 
        error: 'Missing required fields: bookingId, emailType, status' 
      });
    }

    const db = admin.firestore();
    
    // Store email log in Firestore
    const emailLogData = {
      bookingId,
      emailType,
      status, // 'success' or 'failed'
      error: error || null,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('email_logs').add(emailLogData);
    
    console.log('✅ Email log stored with ID:', docRef.id);
    
    response.json({
      success: true,
      logId: docRef.id,
      message: 'Email status logged successfully'
    });

  } catch (error) {
    console.error('❌ Error logging email status:', error);
    response.status(500).json({
      error: 'Failed to log email status',
      message: error.message
    });
  }
});

// Function to retrieve email logs (called by your frontend)
exports.getEmailLogs = onRequest({
  cors: true,
  region: 'us-central1'
}, async (request, response) => {
  try {
    const bookingId = request.query.bookingId;
    
    if (!bookingId) {
      return response.status(400).json({ 
        error: 'Missing bookingId parameter' 
      });
    }

    console.log('📧 Fetching email logs for booking:', bookingId);

    const db = admin.firestore();
    
    // Get email logs for this booking
    const emailLogsRef = db.collection('email_logs')
      .where('bookingId', '==', bookingId)
      .orderBy('createdAt', 'desc')
      .limit(50);
    
    const snapshot = await emailLogsRef.get();
    
    const logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        bookingId: data.bookingId,
        emailType: data.emailType,
        status: data.status,
        error: data.error,
        timestamp: data.timestamp,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.timestamp
      });
    });

    console.log(`✅ Found ${logs.length} email logs for booking ${bookingId}`);

    response.json({
      success: true,
      bookingId: bookingId,
      logs: logs
    });

  } catch (error) {
    console.error('❌ Error fetching email logs:', error);
    response.status(500).json({
      error: 'Failed to fetch email logs',
      message: error.message
    });
  }
});