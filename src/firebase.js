import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Read the config from the environment variable
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Conditionally connect to the emulator if in development mode
if (process.env.REACT_APP_EMULATOR_AUTH_URL) {
  connectAuthEmulator(auth, process.env.REACT_APP_EMULATOR_AUTH_URL);
  console.log('Using Emulator with Auth URL:', process.env.REACT_APP_EMULATOR_AUTH_URL)
}


export { auth };
