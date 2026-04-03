'use client';

import { User, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth } from '@/lib/firebase-auth';
import { db } from '@/lib/firebase-firestore';
import { isFirebaseConfigured } from '@/lib/firebase';
import type { AppRole, UserProfile } from '@/types/models';

const adminEmails = new Set(
  (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

function fallbackName(email: string) {
  return email.split('@')[0] || 'KitobAI foydalanuvchisi';
}

function resolveRole(email: string, existingRole?: AppRole): AppRole {
  if (existingRole) {
    return existingRole;
  }

  return adminEmails.has(email.toLowerCase()) ? 'admin' : 'user';
}

export async function syncUserProfile(user: User, preferredDisplayName?: string) {
  if (!isFirebaseConfigured) {
    const now = Date.now();

    return {
      id: user.uid,
      email: user.email ?? '',
      displayName: preferredDisplayName ?? user.displayName ?? fallbackName(user.email ?? 'user'),
      photoURL: user.photoURL ?? null,
      role: 'user' as const,
      createdAt: now,
      updatedAt: now,
    } satisfies UserProfile;
  }

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  const existing = snapshot.exists() ? (snapshot.data() as Partial<UserProfile>) : undefined;
  const now = Date.now();
  const email = user.email ?? existing?.email ?? '';
  const displayName = preferredDisplayName ?? user.displayName ?? existing?.displayName ?? fallbackName(email);

  if (user.displayName !== displayName) {
    await updateProfile(user, { displayName });
  }

  const profile: UserProfile = {
    id: user.uid,
    email,
    displayName,
    photoURL: user.photoURL ?? existing?.photoURL ?? null,
    role: resolveRole(email, existing?.role),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await setDoc(userRef, profile, { merge: true });
  return profile;
}

export async function getUserProfile(uid: string) {
  if (!isFirebaseConfigured) {
    return null;
  }

  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function updateCurrentUserDisplayName(displayName: string) {
  if (!auth.currentUser) {
    throw new Error('Foydalanuvchi topilmadi.');
  }

  await updateProfile(auth.currentUser, { displayName });
  return syncUserProfile(auth.currentUser, displayName);
}
