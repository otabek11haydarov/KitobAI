'use client';

import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

import { auth } from '@/lib/firebase-auth';
import { isFirebaseConfigured } from '@/lib/firebase';
import type { UserProfile } from '@/types/models';

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (displayName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
type SyncUserProfile = typeof import('@/services/user-service')['syncUserProfile'];

function assertConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase auth ishlashi uchun .env.local fayliga NEXT_PUBLIC_FIREBASE_* qiymatlarini kiriting.');
  }
}

async function syncProfile(...args: Parameters<SyncUserProfile>) {
  const { syncUserProfile } = await import('@/services/user-service');
  return syncUserProfile(...args);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch(() => undefined);

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const syncedProfile = await syncProfile(nextUser);
        setProfile(syncedProfile);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isConfigured: isFirebaseConfigured,
      signIn: async (email, password) => {
        assertConfigured();
        setIsLoading(true);
        try {
          await setPersistence(auth, browserLocalPersistence);
          const credential = await signInWithEmailAndPassword(auth, email, password);
          const syncedProfile = await syncProfile(credential.user);
          setProfile(syncedProfile);
        } finally {
          setIsLoading(false);
        }
      },
      signUp: async (displayName, email, password) => {
        assertConfigured();
        setIsLoading(true);
        try {
          await setPersistence(auth, browserLocalPersistence);
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          const syncedProfile = await syncProfile(credential.user, displayName);
          setProfile(syncedProfile);
        } finally {
          setIsLoading(false);
        }
      },
      signOut: async () => {
        if (!isFirebaseConfigured) {
          setUser(null);
          setProfile(null);
          return;
        }

        await firebaseSignOut(auth);
        setProfile(null);
      },
      resetPassword: async (email) => {
        assertConfigured();
        await sendPasswordResetEmail(auth, email);
      },
      refreshProfile: async () => {
        if (!auth.currentUser) {
          return;
        }

        const syncedProfile = await syncProfile(auth.currentUser);
        setProfile(syncedProfile);
      },
    }),
    [isLoading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
