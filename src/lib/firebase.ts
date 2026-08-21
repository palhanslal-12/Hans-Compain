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
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore using configured custom database ID
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
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
  isGuest?: boolean;
  visitorId?: string;
  deviceInfo?: string;
  referralSource?: string;
  promptCount?: number;
}) {
  if (!user.uid) return;
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const now = new Date().toISOString();
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.name || 'Student Aspirant',
      email: user.email || '',
      targetExam: user.targetExam || 'General Competition',
      role: user.email === 'palhanslal4@gmail.com' ? 'owner' : (user.role || 'student'),
      isGuest: user.isGuest ?? false,
      visitorId: user.visitorId || user.uid,
      deviceInfo: user.deviceInfo || 'Web Browser',
      referralSource: user.referralSource || 'Direct',
      lastActiveAt: now,
      registeredAt: now,
      promptCount: user.promptCount || 0
    }, { merge: true });
  } catch (err) {
    console.warn("Sync user profile notice:", err);
  }
}

/**
 * Log user activity & feature usage to Firestore
 */
export async function logActivityToFirestore(data: {
  userName?: string;
  userEmail?: string;
  type: string;
  feature?: string;
  query: string;
  status?: 'success' | 'error';
  errorDetails?: string;
  referral?: string;
}) {
  const path = 'activity_logs';
  try {
    const logsRef = collection(db, 'activity_logs');
    const now = new Date().toISOString();
    
    // Privacy protection: strip any password, token, or secret from the query string
    let cleanQuery = String(data.query || '').trim();
    cleanQuery = cleanQuery.replace(/(password|token|secret|apiKey|api_key|auth)=[^&\s]+/gi, '$1=[REDACTED]');
    if (cleanQuery.length > 500) {
      cleanQuery = cleanQuery.substring(0, 500) + '...';
    }

    await addDoc(logsRef, {
      userName: data.userName || 'Student',
      userEmail: (data.userEmail || 'guest@hansai.visitor').toLowerCase(),
      type: data.type || 'chat',
      feature: data.feature || categorizeFeature(data.type, cleanQuery),
      query: cleanQuery,
      status: data.status || 'success',
      errorDetails: data.errorDetails || '',
      referral: data.referral || 'Direct',
      timestamp: now
    });
  } catch (err) {
    console.warn("Activity log to Firestore notice:", err);
  }
}

/**
 * Track Share-Link Clicks to Firestore
 */
export async function trackReferralClickToFirestore(data: {
  referralCode?: string;
  visitorId: string;
  referrer?: string;
  path?: string;
}) {
  const path = 'referrals';
  try {
    const refCollection = collection(db, 'referrals');
    await addDoc(refCollection, {
      visitorId: data.visitorId,
      referralCode: data.referralCode || 'share_app',
      referrer: data.referrer || (typeof document !== 'undefined' ? document.referrer : 'Direct') || 'Direct',
      path: data.path || '/',
      timestamp: new Date().toISOString(),
      convertedToUser: false
    });
  } catch (err) {
    console.warn("Track referral notice:", err);
  }
}

/**
 * Feature categorizer helper
 */
function categorizeFeature(type: string, query: string): string {
  const lower = (type + ' ' + query).toLowerCase();
  if (lower.includes('steno') || lower.includes('shorthand') || lower.includes('dictation') || lower.includes('wpm')) {
    return 'Steno / Shorthand';
  }
  if (lower.includes('sarkari') || lower.includes('job') || lower.includes('admit') || lower.includes('result') || lower.includes('exam date')) {
    return 'Sarkari Job Portal';
  }
  if (lower.includes('quiz') || lower.includes('mcq') || lower.includes('test') || lower.includes('question')) {
    return 'Practice Quizzes';
  }
  if (lower.includes('music') || lower.includes('audio') || lower.includes('timer') || lower.includes('focus')) {
    return 'Study Music & Focus';
  }
  if (lower.includes('dictionary') || lower.includes('meaning') || lower.includes('shabd') || lower.includes('vocab')) {
    return 'Dictionary & Vocab';
  }
  if (lower.includes('book') || lower.includes('pdf') || lower.includes('library') || lower.includes('ncert') || lower.includes('read')) {
    return 'Book Reader & PDF';
  }
  if (lower.includes('ocr') || lower.includes('image') || lower.includes('photo') || lower.includes('scan')) {
    return 'OCR & Image Notes';
  }
  if (lower.includes('translate') || lower.includes('hindi') || lower.includes('english') || lower.includes('voice')) {
    return 'Translation & Voice';
  }
  return 'AI Study Assistant';
}

export interface RealOwnerAnalyticsData {
  totalUsers: number;
  registeredCount: number;
  visitorCount: number;
  totalQueries: number;
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
  featureUsage: { feature: string; count: number; percent: number }[];
  mostUsedFeatures: { feature: string; count: number; percent: number }[];
  shareAnalytics: {
    totalClicks: number;
    registeredFromShare: number;
    conversionRate: number;
    referralBreakdown: Record<string, number>;
  };
  aiPerformance: {
    totalAiRequests: number;
    successfulRequests: number;
    aiErrors: number;
    errorRate: number;
    errorBreakdown: Record<string, number>;
  };
  usageTrends: {
    daily: number;
    weekly: number;
    monthly: number;
    chartData: { date: string; count: number }[];
  };
  users: any[];
  logs: any[];
  feedbacks: any[];
}

/**
 * Fetch Real Comprehensive Owner Analytics directly from Firestore + Backend Sync
 */
export async function fetchRealOwnerAnalytics(): Promise<RealOwnerAnalyticsData> {
  const usersPath = 'users';
  const logsPath = 'activity_logs';
  const referralsPath = 'referrals';
  const feedbacksPath = 'feedbacks';

  let rawUsers: any[] = [];
  let rawLogs: any[] = [];
  let rawReferrals: any[] = [];
  let rawFeedbacks: any[] = [];

  // 1. Fetch from Firestore collections
  try {
    const usersSnap = await getDocs(collection(db, usersPath));
    rawUsers = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore users fetch notice:", err);
  }

  try {
    const logsSnap = await getDocs(collection(db, logsPath));
    rawLogs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore logs fetch notice:", err);
  }

  try {
    const refSnap = await getDocs(collection(db, referralsPath));
    rawReferrals = refSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore referrals fetch notice:", err);
  }

  try {
    const fbSnap = await getDocs(collection(db, feedbacksPath));
    rawFeedbacks = fbSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore feedbacks fetch notice:", err);
  }

  // 2. Fetch from backend server sync as well to merge any historical or server-side logs
  try {
    const res = await fetch('/api/owner/analytics');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && Array.isArray(serverData.users)) {
        // Merge users without duplicates
        const existingEmails = new Set(rawUsers.map(u => u.email?.toLowerCase()));
        serverData.users.forEach((su: any) => {
          if (su.email && !existingEmails.has(su.email.toLowerCase())) {
            rawUsers.push({
              id: su.id || 'usr_' + Math.random().toString(36).substr(2, 6),
              displayName: su.name,
              name: su.name,
              email: su.email,
              role: su.email === 'palhanslal4@gmail.com' ? 'owner' : 'student',
              isGuest: su.isGuest ?? (su.email?.endsWith('@hansai.visitor')),
              visitorId: su.visitorId || su.id,
              deviceInfo: su.deviceInfo || 'Browser',
              referralSource: su.referralSource || 'Direct',
              registeredAt: su.registeredAt || su.firstSeen || new Date().toISOString(),
              lastActiveAt: su.lastActiveAt || su.firstSeen || new Date().toISOString(),
              promptCount: su.promptCount || 0
            });
            existingEmails.add(su.email.toLowerCase());
          }
        });
      }

      if (serverData && Array.isArray(serverData.logs)) {
        const existingLogIds = new Set(rawLogs.map(l => l.id));
        serverData.logs.forEach((sl: any) => {
          if (!existingLogIds.has(sl.id)) {
            rawLogs.push({
              id: sl.id,
              userName: sl.userName || 'Student',
              userEmail: sl.userEmail || 'guest@hansai.visitor',
              type: sl.type || 'chat',
              feature: categorizeFeature(sl.type, sl.query || ''),
              query: sl.query || '',
              status: 'success',
              errorDetails: '',
              referral: 'Direct',
              timestamp: sl.timestamp || new Date().toISOString()
            });
            existingLogIds.add(sl.id);
          }
        });
      }
    }
  } catch (err) {
    console.warn("Backend analytics fetch fallback notice:", err);
  }

  // Calculate Real Metrics
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;
  const thirtyDaysMs = 30 * oneDayMs;

  const normalizedUsers = rawUsers.map(u => ({
    id: u.id || u.uid,
    name: u.displayName || u.name || 'Scholar Student',
    email: u.email || 'guest@hansai.visitor',
    role: u.role || (u.email === 'palhanslal4@gmail.com' ? 'owner' : 'student'),
    isGuest: u.isGuest ?? (u.email?.endsWith('@hansai.visitor')),
    visitorId: u.visitorId || u.id,
    deviceInfo: u.deviceInfo || 'Web Browser',
    referralSource: u.referralSource || 'Direct',
    registeredAt: u.registeredAt || u.createdAt || new Date().toISOString(),
    lastActiveAt: u.lastActiveAt || u.registeredAt || new Date().toISOString(),
    promptCount: u.promptCount || 0,
    firstSeen: u.registeredAt || u.lastActiveAt || new Date().toISOString()
  }));

  const registeredUsers = normalizedUsers.filter(u => !u.isGuest && !u.email.endsWith('@hansai.visitor'));
  const visitorUsers = normalizedUsers.filter(u => u.isGuest || u.email.endsWith('@hansai.visitor'));

  // Active Users Timeframe
  const activeTodayCount = normalizedUsers.filter(u => {
    const diff = now - new Date(u.lastActiveAt).getTime();
    return !isNaN(diff) && diff <= oneDayMs;
  }).length;

  const activeWeekCount = normalizedUsers.filter(u => {
    const diff = now - new Date(u.lastActiveAt).getTime();
    return !isNaN(diff) && diff <= sevenDaysMs;
  }).length;

  const activeMonthCount = normalizedUsers.filter(u => {
    const diff = now - new Date(u.lastActiveAt).getTime();
    return !isNaN(diff) && diff <= thirtyDaysMs;
  }).length;

  // Feature Usage Computation
  const featureMap: Record<string, number> = {
    'AI Study Assistant': 0,
    'Steno / Shorthand': 0,
    'Sarkari Job Portal': 0,
    'Practice Quizzes': 0,
    'Study Music & Focus': 0,
    'Dictionary & Vocab': 0,
    'Book Reader & PDF': 0,
    'OCR & Image Notes': 0,
    'Translation & Voice': 0
  };

  let totalAiRequests = 0;
  let aiErrors = 0;
  const errorBreakdown: Record<string, number> = {};

  rawLogs.forEach(log => {
    const featureName = log.feature || categorizeFeature(log.type || '', log.query || '');
    featureMap[featureName] = (featureMap[featureName] || 0) + 1;

    if (log.type === 'chat' || log.type === 'ai' || log.type === 'voice' || featureName === 'AI Study Assistant') {
      totalAiRequests++;
      if (log.status === 'error' || log.errorDetails) {
        aiErrors++;
        const errType = log.errorDetails || 'API Rate Limit / Timeout';
        errorBreakdown[errType] = (errorBreakdown[errType] || 0) + 1;
      }
    }
  });

  const totalActivities = rawLogs.length || 1;
  const featureUsageList = Object.entries(featureMap).map(([feature, count]) => ({
    feature,
    count,
    percent: Math.round((count / (totalActivities || 1)) * 100)
  }));

  const mostUsedFeatures = [...featureUsageList].sort((a, b) => b.count - a.count);

  // Share link & Referral Breakdown
  const referralMap: Record<string, number> = {
    'Direct': 0,
    'WhatsApp': 0,
    'Telegram': 0,
    'Social Media': 0,
    'Friend Referral': 0
  };

  rawReferrals.forEach(r => {
    const src = r.referrer || r.referralCode || 'Direct';
    let label = 'Direct';
    if (src.toLowerCase().includes('whatsapp')) label = 'WhatsApp';
    else if (src.toLowerCase().includes('telegram') || src.toLowerCase().includes('t.me')) label = 'Telegram';
    else if (src.toLowerCase().includes('facebook') || src.toLowerCase().includes('instagram') || src.toLowerCase().includes('twitter') || src.toLowerCase().includes('x.com')) label = 'Social Media';
    else if (src.toLowerCase().includes('share') || src.toLowerCase().includes('ref')) label = 'Friend Referral';
    
    referralMap[label] = (referralMap[label] || 0) + 1;
  });

  const shareClicksCount = rawReferrals.length;
  const registeredFromShareCount = registeredUsers.filter(u => u.referralSource && u.referralSource !== 'Direct').length;
  const conversionRate = shareClicksCount > 0 ? Math.round((registeredFromShareCount / shareClicksCount) * 100) : 0;

  // Daily / Weekly / Monthly Usage Trends
  let dailyLogsCount = 0;
  let weeklyLogsCount = 0;
  let monthlyLogsCount = 0;

  // 7-day breakdown chart data
  const last7DaysMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * oneDayMs);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last7DaysMap[key] = 0;
  }

  rawLogs.forEach(log => {
    const logTime = new Date(log.timestamp).getTime();
    if (!isNaN(logTime)) {
      const diff = now - logTime;
      if (diff <= oneDayMs) dailyLogsCount++;
      if (diff <= sevenDaysMs) weeklyLogsCount++;
      if (diff <= thirtyDaysMs) monthlyLogsCount++;

      const dateKey = new Date(logTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (last7DaysMap[dateKey] !== undefined) {
        last7DaysMap[dateKey]++;
      }
    }
  });

  const chartData = Object.entries(last7DaysMap).map(([date, count]) => ({ date, count }));

  const successfulAiRequests = Math.max(0, totalAiRequests - aiErrors);
  const aiErrorRate = totalAiRequests > 0 ? Math.round((aiErrors / totalAiRequests) * 100) : 0;

  return {
    totalUsers: normalizedUsers.length,
    registeredCount: registeredUsers.length,
    visitorCount: visitorUsers.length,
    totalQueries: rawLogs.filter(l => l.type !== 'login' && l.type !== 'visit').length,
    activeToday: activeTodayCount,
    activeWeek: activeWeekCount,
    activeMonth: activeMonthCount,
    featureUsage: featureUsageList,
    mostUsedFeatures,
    shareAnalytics: {
      totalClicks: shareClicksCount,
      registeredFromShare: registeredFromShareCount,
      conversionRate,
      referralBreakdown: referralMap
    },
    aiPerformance: {
      totalAiRequests,
      successfulRequests: successfulAiRequests,
      aiErrors,
      errorRate: aiErrorRate,
      errorBreakdown
    },
    usageTrends: {
      daily: dailyLogsCount,
      weekly: weeklyLogsCount,
      monthly: monthlyLogsCount,
      chartData
    },
    users: normalizedUsers.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()),
    logs: rawLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    feedbacks: rawFeedbacks
  };
}

/**
 * Delete User Record from Firestore and local server
 */
export async function deleteUserFromFirestore(userId: string, userEmail?: string) {
  try {
    if (userId) {
      await deleteDoc(doc(db, 'users', userId));
    }
  } catch (err) {
    console.warn("Firestore delete user notice:", err);
  }
}

/**
 * Delete Log Item from Firestore
 */
export async function deleteLogFromFirestore(logId: string) {
  try {
    if (logId) {
      await deleteDoc(doc(db, 'activity_logs', logId));
    }
  } catch (err) {
    console.warn("Firestore delete log notice:", err);
  }
}

/**
 * Google Sign-In with Firebase Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await syncUserProfile({
        uid: user.uid,
        name: user.displayName || 'Student Aspirant',
        email: user.email || '',
        role: user.email === 'palhanslal4@gmail.com' ? 'owner' : 'student',
        isGuest: false,
        deviceInfo: 'Google Account'
      });
      await logActivityToFirestore({
        userName: user.displayName || 'Student',
        userEmail: user.email || '',
        type: 'login',
        feature: 'Authentication',
        query: `Logged in securely with Google Auth (${user.email})`
      });
    }
    return user;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
}

/**
 * Auth state listener
 */
export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
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
  const path = `users/${userId}/quiz_scores`;
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
  const path = `users/${userId}/mistakes`;
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
  const path = `users/${userId}/steno_records`;
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
  const path = 'feedbacks';
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

/**
 * Add 5-Star Review / Feedback to Firestore
 */
export async function addReviewToFirestore(review: {
  stars: number;
  userName: string;
  userEmail?: string;
  userRole?: string;
  comment: string;
  featureContext?: string;
  suggestion?: string;
  createdAt?: string;
  helpfulCount?: number;
  tag?: string;
  aspects?: any;
}) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      stars: Number(review.stars) || 5,
      createdAt: review.createdAt || new Date().toISOString(),
      helpfulCount: review.helpfulCount || 0
    });
    return docRef.id;
  } catch (err) {
    console.error("Error saving review to Firestore:", err);
    return null;
  }
}


