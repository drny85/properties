// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import {
   collection,
   CollectionReference,
   DocumentData,
   getFirestore,
} from 'firebase/firestore'
import { getApp, getApps, initializeApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

export const createCollection = <T = DocumentData>(collectionName: string) => {
   return collection(db, collectionName) as CollectionReference<T>
}

// Initialize Firebase
export const app =
   getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
export const initFirebase = () => app
