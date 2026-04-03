'use client';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { isFirebaseConfigured } from '@/lib/firebase';
import { storage } from '@/lib/firebase-storage';

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase konfiguratsiyasi topilmadi. Kerakli NEXT_PUBLIC_FIREBASE_* qiymatlarini kiriting.');
  }
}

export async function uploadFile(path: string, file: File) {
  assertFirebaseConfigured();

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
