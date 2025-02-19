import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Read the config from the environment variable
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

// Initialize Firebase app
if (!firebase.apps.length) {firebase.initializeApp(firebaseConfig);}

// Get the auth instance
const auth = firebase.auth();

// If you need the Auth emulator in development:
if (process.env.REACT_APP_EMULATOR_AUTH_URL) {
  auth.useEmulator(process.env.REACT_APP_EMULATOR_AUTH_URL);
  console.log('Using Emulator with Auth URL:', process.env.REACT_APP_EMULATOR_AUTH_URL);
}

export { auth, firebase };