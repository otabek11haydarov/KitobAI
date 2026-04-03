'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { isFirebaseConfigured } from '@/lib/firebase';
import { db } from '@/lib/firebase-firestore';
import type {
  Community,
  CommunityMember,
  CommunityPost,
  CommunityRole,
  CreateCommentInput,
  CreateCommunityInput,
  CreatePostInput,
  PostComment,
  UpdateCommunityInput,
  UpdatePostInput,
  UserProfile,
} from '@/types/models';

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase konfiguratsiyasi topilmadi. Community funksiyalari uchun .env.local sozlang.');
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function memberDocId(communityId: string, userId: string) {
  return `${communityId}_${userId}`;
}

function mapDoc<T>(value: Record<string, unknown>, id: string) {
  return { id, ...(value as T) };
}

const COMMUNITY_LIST_CACHE_TTL_MS = 60_000;
let cachedCommunities: Community[] | null = null;
let cachedCommunitiesAt = 0;

function setCommunitiesCache(communities: Community[]) {
  cachedCommunities = communities;
  cachedCommunitiesAt = Date.now();
}

function clearCommunitiesCache() {
  cachedCommunities = null;
  cachedCommunitiesAt = 0;
}

async function resolveUniqueSlug(rawSlug: string) {
  assertFirebaseConfigured();

  const baseSlug = slugify(rawSlug);
  const start = baseSlug || 'community';
  let attempt = start;
  let counter = 1;

  while (true) {
    const slugSnapshot = await getDocs(query(collection(db, 'communities'), where('slug', '==', attempt), limit(1)));
    if (slugSnapshot.empty) {
      return attempt;
    }

    counter += 1;
    attempt = `${start}-${counter}`;
  }
}

async function getMembershipOrThrow(communityId: string, userId: string) {
  const memberRef = doc(db, 'communityMembers', memberDocId(communityId, userId));
  const snapshot = await getDoc(memberRef);

  if (!snapshot.exists()) {
    throw new Error('Bu amal uchun hamjamiyat aʼzosi boʼlishingiz kerak.');
  }

  return snapshot.data() as CommunityMember;
}

function canManageCommunity(profile: UserProfile, memberRole?: CommunityRole | null) {
  return profile.role === 'admin' || memberRole === 'owner' || memberRole === 'admin';
}

function canManagePost(profile: UserProfile, post: CommunityPost, memberRole?: CommunityRole | null) {
  return canManageCommunity(profile, memberRole) || post.authorId === profile.id;
}

export async function createCommunity(input: CreateCommunityInput, profile: UserProfile) {
  assertFirebaseConfigured();

  const now = Date.now();
  const communityRef = doc(collection(db, 'communities'));
  const slug = await resolveUniqueSlug(input.slug || input.name);
  const memberRef = doc(db, 'communityMembers', memberDocId(communityRef.id, profile.id));

  const community: Community = {
    id: communityRef.id,
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    avatarUrl: input.avatarUrl?.trim() || null,
    coverUrl: input.coverUrl?.trim() || null,
    ownerId: profile.id,
    ownerName: profile.displayName,
    memberCount: 1,
    postCount: 0,
    announcementCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: profile.id,
    updatedBy: profile.id,
  };

  const member: CommunityMember = {
    id: memberRef.id,
    communityId: communityRef.id,
    userId: profile.id,
    userName: profile.displayName,
    userEmail: profile.email,
    role: 'owner',
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await runTransaction(db, async (transaction) => {
    transaction.set(communityRef, community);
    transaction.set(memberRef, member);
  });

  clearCommunitiesCache();
  return community;
}

export async function updateCommunity(communityId: string, input: UpdateCommunityInput, profile: UserProfile) {
  assertFirebaseConfigured();

  const membership = await getMembershipOrThrow(communityId, profile.id);
  if (!canManageCommunity(profile, membership.role)) {
    throw new Error('Hamjamiyatni faqat admin yoki owner tahrir qilishi mumkin.');
  }

  const communityRef = doc(db, 'communities', communityId);
  await updateDoc(communityRef, {
    name: input.name.trim(),
    description: input.description.trim(),
    avatarUrl: input.avatarUrl?.trim() || null,
    coverUrl: input.coverUrl?.trim() || null,
    updatedAt: Date.now(),
    updatedBy: profile.id,
  });

  clearCommunitiesCache();
}

export async function joinCommunity(communityId: string, profile: UserProfile) {
  assertFirebaseConfigured();

  const now = Date.now();
  const communityRef = doc(db, 'communities', communityId);
  const memberRef = doc(db, 'communityMembers', memberDocId(communityId, profile.id));

  await runTransaction(db, async (transaction) => {
    const [communitySnapshot, memberSnapshot] = await Promise.all([
      transaction.get(communityRef),
      transaction.get(memberRef),
    ]);

    if (!communitySnapshot.exists()) {
      throw new Error('Hamjamiyat topilmadi.');
    }

    if (memberSnapshot.exists()) {
      return;
    }

    const member: CommunityMember = {
      id: memberRef.id,
      communityId,
      userId: profile.id,
      userName: profile.displayName,
      userEmail: profile.email,
      role: 'member',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    transaction.set(memberRef, member);
    transaction.update(communityRef, {
      memberCount: increment(1),
      updatedAt: now,
      updatedBy: profile.id,
    });
  });

  clearCommunitiesCache();
}

export async function leaveCommunity(communityId: string, profile: UserProfile) {
  assertFirebaseConfigured();

  const communityRef = doc(db, 'communities', communityId);
  const memberRef = doc(db, 'communityMembers', memberDocId(communityId, profile.id));

  await runTransaction(db, async (transaction) => {
    const [communitySnapshot, memberSnapshot] = await Promise.all([
      transaction.get(communityRef),
      transaction.get(memberRef),
    ]);

    if (!communitySnapshot.exists() || !memberSnapshot.exists()) {
      return;
    }

    const member = memberSnapshot.data() as CommunityMember;
    if (member.role === 'owner') {
      throw new Error('Owner hamjamiyatni tark eta olmaydi. Avval ownership ni boshqa aʼzoga bering.');
    }

    transaction.delete(memberRef);
    transaction.update(communityRef, {
      memberCount: increment(-1),
      updatedAt: Date.now(),
      updatedBy: profile.id,
    });
  });

  clearCommunitiesCache();
}

export async function createPost(communityId: string, input: CreatePostInput, profile: UserProfile) {
  assertFirebaseConfigured();

  const membership = await getMembershipOrThrow(communityId, profile.id);
  if (input.type === 'announcement' && !canManageCommunity(profile, membership.role)) {
    throw new Error('Announcement postini faqat admin yoki owner yaratishi mumkin.');
  }

  const now = Date.now();
  const postRef = doc(collection(db, 'posts'));
  const communityRef = doc(db, 'communities', communityId);

  const post: CommunityPost = {
    id: postRef.id,
    communityId,
    title: input.title.trim(),
    content: input.content.trim(),
    type: input.type,
    pinned: Boolean(input.pinned) && canManageCommunity(profile, membership.role),
    imageUrl: input.imageUrl?.trim() || null,
    authorId: profile.id,
    authorName: profile.displayName,
    authorEmail: profile.email,
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: profile.id,
    updatedBy: profile.id,
  };

  await runTransaction(db, async (transaction) => {
    transaction.set(postRef, post);
    transaction.update(communityRef, {
      postCount: increment(1),
      announcementCount: input.type === 'announcement' ? increment(1) : increment(0),
      updatedAt: now,
      updatedBy: profile.id,
    });
  });

  clearCommunitiesCache();
  return post;
}

export async function updatePost(postId: string, input: UpdatePostInput, profile: UserProfile) {
  assertFirebaseConfigured();

  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) {
    throw new Error('Post topilmadi.');
  }

  const post = postSnapshot.data() as CommunityPost;
  const membership = await getMembershipOrThrow(post.communityId, profile.id);

  if (!canManagePost(profile, post, membership.role)) {
    throw new Error('Bu postni faqat muallif yoki admin tahrir qila oladi.');
  }

  const nextType = input.type;
  if (nextType === 'announcement' && !canManageCommunity(profile, membership.role)) {
    throw new Error('Announcement postini faqat admin yoki owner boshqara oladi.');
  }

  const nextPinned = canManageCommunity(profile, membership.role) ? input.pinned : post.pinned;
  const communityRef = doc(db, 'communities', post.communityId);

  await runTransaction(db, async (transaction) => {
    transaction.update(postRef, {
      title: input.title.trim(),
      content: input.content.trim(),
      type: nextType,
      pinned: nextPinned,
      imageUrl: input.imageUrl?.trim() || null,
      updatedAt: Date.now(),
      updatedBy: profile.id,
    });

    if (post.type !== nextType) {
      transaction.update(communityRef, {
        announcementCount: increment(nextType === 'announcement' ? 1 : -1),
        updatedAt: Date.now(),
        updatedBy: profile.id,
      });
    }
  });

  clearCommunitiesCache();
}

export async function deletePost(post: CommunityPost, profile: UserProfile) {
  assertFirebaseConfigured();

  const membership = await getMembershipOrThrow(post.communityId, profile.id);
  if (!canManagePost(profile, post, membership.role)) {
    throw new Error('Bu postni oʼchirishga ruxsat yoʼq.');
  }

  const communityRef = doc(db, 'communities', post.communityId);
  const postRef = doc(db, 'posts', post.id);
  const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('postId', '==', post.id)));
  const batch = writeBatch(db);

  commentsSnapshot.forEach((commentDoc) => {
    batch.delete(commentDoc.ref);
  });

  batch.delete(postRef);
  batch.update(communityRef, {
    postCount: increment(-1),
    announcementCount: post.type === 'announcement' ? increment(-1) : increment(0),
    updatedAt: Date.now(),
    updatedBy: profile.id,
  });

  await batch.commit();
  clearCommunitiesCache();
}

export async function addComment(post: CommunityPost, input: CreateCommentInput, profile: UserProfile) {
  assertFirebaseConfigured();
  await getMembershipOrThrow(post.communityId, profile.id);

  const now = Date.now();
  const commentRef = doc(collection(db, 'comments'));
  const postRef = doc(db, 'posts', post.id);

  const comment: PostComment = {
    id: commentRef.id,
    communityId: post.communityId,
    postId: post.id,
    content: input.content.trim(),
    authorId: profile.id,
    authorName: profile.displayName,
    authorEmail: profile.email,
    createdAt: now,
    updatedAt: now,
    createdBy: profile.id,
    updatedBy: profile.id,
  };

  await runTransaction(db, async (transaction) => {
    transaction.set(commentRef, comment);
    transaction.update(postRef, {
      commentCount: increment(1),
      updatedAt: now,
      updatedBy: profile.id,
    });
  });

  return comment;
}

export async function deleteComment(comment: PostComment, profile: UserProfile) {
  assertFirebaseConfigured();

  const membership = await getMembershipOrThrow(comment.communityId, profile.id);
  const canDelete = canManageCommunity(profile, membership.role) || comment.authorId === profile.id;

  if (!canDelete) {
    throw new Error('Bu izohni oʼchirishga ruxsat yoʼq.');
  }

  const batch = writeBatch(db);
  batch.delete(doc(db, 'comments', comment.id));
  batch.update(doc(db, 'posts', comment.postId), {
    commentCount: increment(-1),
    updatedAt: Date.now(),
    updatedBy: profile.id,
  });
  await batch.commit();
}

export async function listCommunities(): Promise<Community[]> {
  if (!isFirebaseConfigured) {
    return [];
  }

  const isFresh = cachedCommunities && cachedCommunitiesAt + COMMUNITY_LIST_CACHE_TTL_MS > Date.now();
  if (isFresh) {
    return cachedCommunities ?? [];
  }

  const communitiesQuery = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(communitiesQuery);
  const communities = snapshot.docs.map((item) => mapDoc<Community>(item.data(), item.id));
  setCommunitiesCache(communities);
  return communities;
}

export function subscribeCommunities(callback: (communities: Community[]) => void, onError: (error: Error) => void) {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => undefined;
  }

  const communitiesQuery = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    communitiesQuery,
    (snapshot) => {
      const communities = snapshot.docs.map((item) => mapDoc<Community>(item.data(), item.id));
      setCommunitiesCache(communities);
      callback(communities);
    },
    (error) => onError(error as Error),
  );
}

export function subscribeCommunityBySlug(
  slug: string,
  callback: (community: Community | null) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => undefined;
  }

  const communityQuery = query(collection(db, 'communities'), where('slug', '==', slug), limit(1));
  return onSnapshot(
    communityQuery,
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const item = snapshot.docs[0];
      callback(mapDoc<Community>(item.data(), item.id));
    },
    (error) => onError(error as Error),
  );
}

export function subscribeCommunityMembership(
  communityId: string,
  userId: string,
  callback: (member: CommunityMember | null) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured || !userId) {
    callback(null);
    return () => undefined;
  }

  const memberRef = doc(db, 'communityMembers', memberDocId(communityId, userId));
  return onSnapshot(
    memberRef,
    (snapshot) => callback(snapshot.exists() ? ((snapshot.data() as CommunityMember) ?? null) : null),
    (error) => onError(error as Error),
  );
}

export function subscribeCommunityPosts(
  communityId: string,
  callback: (posts: CommunityPost[]) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => undefined;
  }

  const postsQuery = query(collection(db, 'posts'), where('communityId', '==', communityId), orderBy('createdAt', 'desc'));
  return onSnapshot(
    postsQuery,
    (snapshot) => {
      const posts = snapshot.docs
        .map((item) => mapDoc<CommunityPost>(item.data(), item.id))
        .sort((left, right) => Number(right.pinned) - Number(left.pinned) || right.createdAt - left.createdAt);

      callback(posts);
    },
    (error) => onError(error as Error),
  );
}

export function subscribePostComments(
  postId: string,
  callback: (comments: PostComment[]) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => undefined;
  }

  const commentsQuery = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
  return onSnapshot(
    commentsQuery,
    (snapshot) => callback(snapshot.docs.map((item) => mapDoc<PostComment>(item.data(), item.id))),
    (error) => onError(error as Error),
  );
}
