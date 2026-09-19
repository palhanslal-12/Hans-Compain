/**
 * Target Exam Manager & Instant Caching Module for HANS COMPAIN
 * Provides 0ms instant dashboard rendering with background Firestore synchronization.
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type TargetExamType = 'steno' | 'board_10th' | 'board_12th' | 'general';

export interface UserExamProfile {
  userId: string;
  targetExam: TargetExamType;
  updatedAt: string;
  stream?: 'board' | 'steno' | 'competitive';
  classGrade?: string;
}

const CACHE_KEY_PREFIX = 'hans_target_exam_';
const PROFILE_CACHE_KEY = 'hans_user_profile_cache';

/**
 * 1. Save onboarding exam focus selection to LocalStorage & Sync
 */
export async function saveTargetExamSelection(
  userId: string,
  targetExam: TargetExamType,
  additionalDetails: Record<string, any> = {}
): Promise<UserExamProfile> {
  const profile: UserExamProfile = {
    userId,
    targetExam,
    updatedAt: new Date().toISOString(),
    ...additionalDetails,
  };

  try {
    // Save to LocalStorage immediately
    localStorage.setItem(`${CACHE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));

    // Async background update to Firestore if user is logged in
    if (userId && userId !== 'guest' && db) {
      const userRef = doc(db, 'users', userId);
      updateDoc(userRef, {
        targetExam,
        'studentGoalProfile.targetExam': targetExam,
        updatedAt: profile.updatedAt,
        ...additionalDetails,
      }).catch((err) => {
        console.warn('[TargetExamCache] Background Firestore save error:', err);
      });
    }
  } catch (error) {
    console.error('[TargetExamCache] Failed to save local exam target:', error);
  }

  return profile;
}

/**
 * 2. Instant Dashboard Render - Reads target_exam from LocalStorage synchronously
 */
export function getInstantTargetExam(userId?: string): TargetExamType {
  try {
    const key = userId ? `${CACHE_KEY_PREFIX}${userId}` : PROFILE_CACHE_KEY;
    const cached = localStorage.getItem(key) || localStorage.getItem(PROFILE_CACHE_KEY);

    if (cached) {
      const profile: UserExamProfile = JSON.parse(cached);
      return profile.targetExam || 'general';
    }
  } catch (error) {
    console.error('[TargetExamCache] LocalStorage read error:', error);
  }

  return 'general';
}

/**
 * 3. Background Sync - Silently fetches latest profile data from Firestore
 */
export async function syncTargetExamProfileInBackground(userId: string): Promise<UserExamProfile | null> {
  if (!userId || userId === 'guest' || !db) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const firestoreTarget = data.targetExam || data.studentGoalProfile?.targetExam || 'general';

      const updatedProfile: UserExamProfile = {
        userId,
        targetExam: firestoreTarget as TargetExamType,
        updatedAt: new Date().toISOString(),
        stream: data.studentGoalProfile?.stream,
        classGrade: data.studentGoalProfile?.boardDetails?.classGrade,
      };

      // Update LocalStorage cache silently
      localStorage.setItem(`${CACHE_KEY_PREFIX}${userId}`, JSON.stringify(updatedProfile));
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(updatedProfile));

      return updatedProfile;
    }
  } catch (error) {
    console.warn('[TargetExamCache] Background sync failed (offline or network error):', error);
  }

  return null;
}
