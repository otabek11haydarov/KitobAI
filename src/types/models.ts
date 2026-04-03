export type AppRole = 'admin' | 'user';

export type CommunityRole = 'owner' | 'admin' | 'member';

export type PostKind = 'discussion' | 'announcement';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: AppRole;
  createdAt: number;
  updatedAt: number;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  postCount: number;
  announcementCount: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: CommunityRole;
  joinedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  title: string;
  content: string;
  type: PostKind;
  pinned: boolean;
  imageUrl: string | null;
  authorId: string;
  authorName: string;
  authorEmail: string;
  commentCount: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
}

export interface PostComment {
  id: string;
  communityId: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
}

export interface CreateCommunityInput {
  name: string;
  slug?: string;
  description: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}

export interface UpdateCommunityInput {
  name: string;
  description: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}

export interface CreatePostInput {
  title: string;
  content: string;
  type: PostKind;
  pinned?: boolean;
  imageUrl?: string | null;
}

export interface UpdatePostInput {
  title: string;
  content: string;
  pinned: boolean;
  type: PostKind;
  imageUrl?: string | null;
}

export interface CreateCommentInput {
  content: string;
}
