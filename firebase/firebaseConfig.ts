
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARponsq8waZ3_kBge9V4pZ97paJbRAGIU",
  authDomain: "piyush-7086c.firebaseapp.com",
  projectId: "piyush-7086c",
  storageBucket: "piyush-7086c.firebasestorage.app",
  messagingSenderId: "786052869781",
  appId: "1:786052869781:web:02787754fb2d8949adb59c",
  measurementId: "G-4YPEHQ24J7"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);