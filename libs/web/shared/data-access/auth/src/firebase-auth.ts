import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

// Conditionally connect to the emulator if in development mode
if (process.env.NEXT_PUBLIC_EMULATOR_AUTH_URL) {
  connectAuthEmulator(firebaseAuth, process.env.NEXT_PUBLIC_EMULATOR_AUTH_URL);
  console.log('Using Emulator with Auth URL:', process.env.NEXT_PUBLIC_EMULATOR_AUTH_URL);
}

export { firebaseAuth };
