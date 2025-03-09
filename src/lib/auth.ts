'use client';

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { isAdminEmail, getDailyRatingLimit } from './admin_accounts';

export interface AuthUser {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
  isAdmin: boolean;
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

export function transformFirebaseUser(user: User, dailyRatingsLeft: number = MAX_DAILY_RATINGS): AuthUser {
  const isAdmin = isAdminEmail(user.email);
  return {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    isAdmin,
    // For admins, always return Infinity as ratings left
    dailyRatingsLeft: isAdmin ? Infinity : dailyRatingsLeft,
    adminLabel: isAdmin ? 'ADMIN' : undefined,
  };
} 