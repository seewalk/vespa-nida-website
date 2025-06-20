// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp;
let adminDb;

try {
  // Check if admin app already exists
  adminApp = getApps().find(app => app.name === 'admin');
  
  if (!adminApp) {
    // Initialize Firebase Admin with minimal config for Vercel
    const firebaseAdminConfig = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vespa-nida',
    };
    
    console.log('Initializing Firebase Admin with project:', firebaseAdminConfig.projectId);
    
    adminApp = initializeApp(firebaseAdminConfig, 'admin');
  }
  
  adminDb = getFirestore(adminApp);
  
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  
  // Fallback: try without named app
  try {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vespa-nida',
      });
    } else {
      adminApp = getApps()[0];
    }
    
    adminDb = getFirestore(adminApp);
    
  } catch (fallbackError) {
    console.error('Firebase Admin fallback error:', fallbackError);
    throw fallbackError;
  }
}

export { adminDb };