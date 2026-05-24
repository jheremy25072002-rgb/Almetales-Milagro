import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBLr8khL7Hz2hxgonXoVOf6vR_sPDFZQPE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'almetales-milagro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'almetales-milagro',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'almetales-milagro.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '378893125593',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:378893125593:web:44213aa5d5057cab537bc8',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => key !== 'measurementId' && !value)
  .map(([key]) => key);

if (missingKeys.length) {
  throw new Error(`Faltan variables Firebase del cliente: ${missingKeys.join(', ')}`);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}
