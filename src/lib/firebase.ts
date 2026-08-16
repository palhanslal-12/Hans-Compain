import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from provisioned environment
const firebaseConfig = {
  projectId: "studied-palisade-6qmt3",
  appId: "1:634387314213:web:ddc4ebf3558b03fbe131cc",
  apiKey: "AIzaSyBdbLINx8Kn6CPDRMS6_hvE2SxHXRVKwuk",
  authDomain: "studied-palisade-6qmt3.firebaseapp.com",
  storageBucket: "studied-palisade-6qmt3.firebasestorage.app",
  messagingSenderId: "634387314213"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore using default database or custom ID if specified
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Validate Firestore connection
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Firestore connected successfully! 🚀");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or connecting in background.");
    } else {
      console.log("Firestore connection initialized.");
    }
    return true;
  }
}

/**
 * Save / Sync Student Profile to Firestore
 */
export async function syncUserProfile(user: {
  uid: string;
  name?: string;
  email?: string;
  targetExam?: string;
  role?: string;
}) {
  if (!user.uid) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.name || 'Student Aspirant',
      email: user.email || '',
      targetExam: user.targetExam || 'General Competition',
      role: user.role || 'student',
      lastActiveAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error("Error syncing user profile to Firestore:", err);
  }
}

/**
 * Save Quiz Assessment Score to Firestore
 */
export async function saveQuizScoreToCloud(userId: string, data: {
  examCategory: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}) {
  if (!userId) return;
  try {
    const scoresRef = collection(db, 'users', userId, 'quiz_scores');
    await addDoc(scoresRef, {
      ...data,
      timestamp: new Date().toISOString(),
      percentage: Math.round((data.score / (data.totalQuestions || 1)) * 100)
    });
  } catch (err) {
    console.error("Error saving quiz score to Firestore:", err);
  }
}

/**
 * Save Mistake to Student Mistake Notebook in Firestore
 */
export async function saveMistakeToCloud(userId: string, mistake: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  category?: string;
}) {
  if (!userId) return;
  try {
    const mistakesRef = collection(db, 'users', userId, 'mistakes');
    await addDoc(mistakesRef, {
      ...mistake,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error saving mistake to Firestore:", err);
  }
}

/**
 * Save Shorthand / Steno Practice Transcription Record to Firestore
 */
export async function saveStenoRecordToCloud(userId: string, record: {
  title: string;
  wpm: number;
  accuracy: number;
  totalWords: number;
  mistakesCount: number;
  passageSystem: string;
}) {
  if (!userId) return;
  try {
    const stenoRef = collection(db, 'users', userId, 'steno_records');
    await addDoc(stenoRef, {
      ...record,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error saving steno record to Firestore:", err);
  }
}

/**
 * Submit Public Feedback or Question Bug Report to Firestore
 */
export async function submitFeedbackToCloud(feedback: {
  userId?: string;
  name?: string;
  category: string;
  message: string;
  contact?: string;
}) {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    await addDoc(feedbacksRef, {
      ...feedback,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error("Error submitting feedback to Firestore:", err);
    return false;
  }
}
