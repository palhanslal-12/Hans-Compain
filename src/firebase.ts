import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export interface LocalActivityLog {
  id: string;
  feature: string;
  topic: string;
  summary: string;
  scorePercent: number;
  createdAt: string;
}

const LOCAL_ACTIVITY_KEY = 'hans_compain_activity_stream_v1';

export function getLocalActivities(): LocalActivityLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read local activities', e);
  }
  return [];
}

export async function recordStudyActivity(
  feature: string,
  topic: string,
  summary: string,
  scorePercent = 90
) {
  const cleanFeature = feature.slice(0, 60);
  const cleanTopic = topic.slice(0, 200);
  const cleanSummary = summary.slice(0, 1000);
  const cleanScore = Math.max(0, Math.min(100, Math.round(scorePercent)));
  const nowIso = new Date().toISOString();
  const actId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const newEntry: LocalActivityLog = {
    id: actId,
    feature: cleanFeature,
    topic: cleanTopic,
    summary: cleanSummary,
    scorePercent: cleanScore,
    createdAt: nowIso
  };

  try {
    const existing = getLocalActivities();
    const updated = [newEntry, ...existing].slice(0, 30);
    localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hans-activity-updated'));
  } catch (e) {
    console.warn('Local activity save error:', e);
  }

  // Ping backend for 24-hour auto-email inactivity monitor
  fetch('/api/user/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: auth.currentUser?.uid || 'hans_student',
      email: auth.currentUser?.email || 'student@hanscompain.in',
      displayName: auth.currentUser?.displayName || 'Hans Student',
      lastTopic: cleanTopic
    })
  }).catch(() => {});

  // Persist to Firestore if authenticated
  if (auth.currentUser && auth.currentUser.emailVerified) {
    const uid = auth.currentUser.uid;
    try {
      await setDoc(doc(db, 'activities', actId), {
        userId: uid,
        feature: cleanFeature,
        topic: cleanTopic,
        summary: cleanSummary,
        scorePercent: cleanScore,
        createdAt: nowIso
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `activities/${actId}`);
    }
  }
}

export async function syncRegisteredUserProfile(targetExam = 'SSC & Steno 2026') {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return null;

  const userPath = `users/${user.uid}`;
  const nowIso = new Date().toISOString();
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const existingData = snap.data();
      const updated = {
        uid: user.uid,
        displayName: (user.displayName || existingData.displayName || 'Hans Student').slice(0, 100),
        email: (user.email || existingData.email || 'student@hanscompain.in').slice(0, 150),
        targetExam: (targetExam || existingData.targetExam || 'SSC & Steno 2026').slice(0, 100),
        streakDays: typeof existingData.streakDays === 'number' ? existingData.streakDays : 4,
        xpCoins: typeof existingData.xpCoins === 'number' ? existingData.xpCoins + 10 : 250,
        lastActiveAt: nowIso,
        autoEmailEnabled: true
      };
      await setDoc(doc(db, 'users', user.uid), updated);
      return updated;
    } else {
      const freshProfile = {
        uid: user.uid,
        displayName: (user.displayName || 'Hans Student').slice(0, 100),
        email: (user.email || 'student@hanscompain.in').slice(0, 150),
        targetExam: targetExam.slice(0, 100),
        streakDays: 4,
        xpCoins: 250,
        lastActiveAt: nowIso,
        autoEmailEnabled: true
      };
      await setDoc(doc(db, 'users', user.uid), freshProfile);
      return freshProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
    return null;
  }
}

export async function signInWithGoogle(targetExam = 'SSC & Steno 2026') {
  const res = await signInWithPopup(auth, googleProvider);
  if (res.user) {
    await syncRegisteredUserProfile(targetExam);
    fetch('/api/user/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        lastTopic: 'Registered & Logged In'
      })
    }).catch(() => {});
  }
  return res.user;
}

export async function logoutUser() {
  await signOut(auth);
}
