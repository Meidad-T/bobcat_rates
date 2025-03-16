'use client';

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { isAdminEmail, getDailyRatingLimit } from './admin_accounts';
import { UserRole, ProFeatures, PRO_FEATURES, BASIC_FEATURES } from './types';

export interface AuthUser {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
  isAdmin: boolean;
  isPro: boolean;
  role: UserRole;
  features: ProFeatures;
  dailyRatingsLeft: number;
  adminLabel?: string;  // Optional label to display for admins
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const MAX_DAILY_RATINGS = 5;

export function transformFirebaseUser(user: User, dailyRatingsLeft: number = MAX_DAILY_RATINGS, userData?: any): AuthUser {
  const isAdmin = isAdminEmail(user.email);
  const isPro = userData?.isPro || false;
  const role: UserRole = isAdmin ? 'admin' : isPro ? 'pro' : 'basic';
  const features = isAdmin ? PRO_FEATURES : isPro ? PRO_FEATURES : BASIC_FEATURES;
  
  // Use the actual dailyRatingsLeft from Firestore if available
  const actualRatingsLeft = userData?.dailyRatingsLeft !== undefined ? userData.dailyRatingsLeft : 
                           isAdmin ? Infinity : 
                           isPro ? PRO_FEATURES.dailyRatingLimit : 
                           BASIC_FEATURES.dailyRatingLimit;
  
  return {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    isAdmin,
    isPro,
    role,
    features,
    dailyRatingsLeft: actualRatingsLeft,
    adminLabel: isAdmin ? 'ADMIN' : undefined,
  };
} 