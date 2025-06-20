// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Initialize Firebase Admin
const app = getApps().find(app => app.name === 'admin') || 
           initializeApp(firebaseAdminConfig, 'admin');

export const adminDb = getFirestore(app);