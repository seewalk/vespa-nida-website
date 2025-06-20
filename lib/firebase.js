// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyDbPcaKySLPQzTO7k2DznT00-fUAK7ByuM",
  authDomain: "vespa-nida.firebaseapp.com",
  databaseURL: "https://vespa-nida-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vespa-nida",
  storageBucket: "vespa-nida.firebasestorage.app",
  messagingSenderId: "735443149001",
  appId: "1:735443149001:web:2df54f6fe8796a715b2d18",
  measurementId: "G-76RBQ479FM"
};

// Validate configuration
const requiredConfig = ['apiKey', 'authDomain', 'projectId'];
for (const key of requiredConfig) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing required Firebase config: ${key}`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Security: Connect to emulators only in development
if (process.env.NODE_ENV === 'development' && 
    process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Export app
export default app;