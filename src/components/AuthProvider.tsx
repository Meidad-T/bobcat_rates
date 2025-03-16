'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, AuthUser, transformFirebaseUser } from '@/lib/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BASIC_FEATURES } from '@/lib/types';
import { toast } from 'react-hot-toast';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get or create user document
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // Create initial user document
            const now = new Date();
            await setDoc(userRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: now.toISOString(),
              isPro: false,
              role: 'basic',
              features: BASIC_FEATURES,
              ratings: {},
              lastRatingReset: now.toISOString(),
              dailyRatingsUsed: 0,
              dailyRatingsLeft: BASIC_FEATURES.dailyRatingLimit,
            });
          } else {
            // Check if we need to reset daily ratings
            const userData = userDoc.data();
            const lastReset = userData.lastRatingReset ? new Date(userData.lastRatingReset) : new Date(0);
            const now = new Date();
            const lastMidnight = new Date(now);
            lastMidnight.setHours(0, 0, 0, 0);

            if (lastReset < lastMidnight) {
              // Reset daily ratings at midnight
              const ratingLimit = userData.isPro ? 10 : 5;
              await setDoc(userRef, {
                lastRatingReset: now.toISOString(),
                dailyRatingsUsed: 0,
                dailyRatingsLeft: ratingLimit
              }, { merge: true });
            }
          }
          
          // Fetch the user data again (either existing or newly created)
          const userData = (await getDoc(userRef)).data();
          const transformedUser = transformFirebaseUser(firebaseUser, undefined, userData);
          setUser(transformedUser);
        } catch (error) {
          console.error('Error fetching/creating user data:', error);
          toast.error('Error loading user data. Please refresh the page.');
          return;
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create initial user document if it doesn't exist
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const now = new Date();
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: now.toISOString(),
          isPro: false,
          role: 'basic',
          features: BASIC_FEATURES,
          ratings: {},
          lastRatingReset: now.toISOString(),
          dailyRatingsUsed: 0,
          dailyRatingsLeft: BASIC_FEATURES.dailyRatingLimit,
        });
      } else {
        // Check if we need to reset daily ratings
        const userData = userDoc.data();
        const lastReset = userData.lastRatingReset ? new Date(userData.lastRatingReset) : new Date(0);
        const now = new Date();
        const lastMidnight = new Date(now);
        lastMidnight.setHours(0, 0, 0, 0);

        if (lastReset < lastMidnight) {
          // Reset daily ratings at midnight
          const ratingLimit = userData.isPro ? 10 : 5;
          await setDoc(userRef, {
            lastRatingReset: now.toISOString(),
            dailyRatingsUsed: 0,
            dailyRatingsLeft: ratingLimit
          }, { merge: true });
        }
      }

      const userData = (await getDoc(userRef)).data();
      const transformedUser = transformFirebaseUser(result.user, undefined, userData);
      setUser(transformedUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
} 