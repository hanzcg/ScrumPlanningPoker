import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics: any = null;

// Initialize Analytics asynchronously to prevent blocking or crashing in unsupported environments
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics is not supported in this environment:", err);
    });
}

/**
 * Log a custom event to Firebase Analytics.
 * @param eventName Name of the event to track.
 * @param eventParams Optional key-value parameters to include with the event.
 */
export function logAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    } else if (import.meta.env.DEV) {
      console.log(`[Firebase Analytics (Dev)] Event: ${eventName}`, eventParams);
    }
  } catch (error) {
    console.error("Error logging analytics event:", error);
  }
}
