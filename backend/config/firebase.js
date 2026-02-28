import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let firebaseAdmin;

try {
  // Check if critical variables are present
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing FIREBASE_PROJECT_ID or FIREBASE_PRIVATE_KEY');
  }

  // Initialize Firebase Admin SDK
  // Download service account JSON from Firebase Console
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    
  };

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️ Firebase initialization failed:', error.message);
  console.warn('⚠️ OTP and Google Sign-In features will be disabled.');
  firebaseAdmin = null;
}

export { firebaseAdmin as admin };
