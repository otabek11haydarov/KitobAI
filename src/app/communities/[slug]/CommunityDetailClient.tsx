'use client';

import Link from 'next/link';
import { FormEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Megaphone, MessageSquare, Pin, Trash2, UserPlus, Users } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/hooks/useCommunity';
import { usePostComments } from '@/hooks/usePostComments';
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
  updatePost,
} from '@/services/community-service';
import { uploadFile } from '@/services/storage-service';
import type { CommunityPost, PostComment, PostKind, UserProfile } from '@/types/models';

type CommunityPostCardProps = {
  canManageCommunity: boolean;
  canPost: boolean;
  currentUserId?: string;
  onDeleteComment: (comment: PostComment) => Promise<void>;
  onDeletePost: (post: CommunityPost) => Promise<void>;
  onStartEditing: (post: CommunityPost) => void;
  post: CommunityPost;
  profile: UserProfile | null;
};

const CommunityPostCard = memo(function CommunityPostCard({
  canManageCommunity,
  canPost,
  currentUserId,
  onDeleteComment,
  onDeletePost,
  onStartEditing,
  post,
  profile,
}: CommunityPostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { comments, isLoading, error } = usePostComments(post.id, isCommentsOpen);

  const canModeratePost = Boolean(currentUserId && (currentUserId === post.authorId || canManageCommunity));

  const handleCommentSubmit = async () => {
    if (!profile || !commentDraft.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    try {
      await addComment(post, { content: commentDraft }, profile);
      setCommentDraft('');
      if (!isCommentsOpen) {
        setIsCommentsOpen(true);
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <article className="card border-0 shadow-sm rounded-5 p-4 p-md-5">
      <div className="d-flex justify-content-between gap-3 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">{post.type}</span>
            {post.pinned ? (
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill">
                <Pin size={12} className="me-1" />
                Pinned
              </span>
            ) : null}
          </div>
          <h2 className="h4 fw-bold text-dark mb-1">{post.title}</h2>
          <p className="small text-secondary mb-0">
            {post.authorName} · {new Date(post.createdAt).toLocaleString('uz-UZ')}
          </p>
        </div>
        {canModeratePost ? (
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light rounded-pill border border-light-subtle" onClick={() => onStartEditing(post)}>
              Edit
            </button>
            <button type="button" className="btn btn-light rounded-pill border border-light-subtle text-danger" onClick={() => onDeletePost(post)}>
              <Trash2 size={16} />
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-secondary mb-3">{post.content}</p>

      {post.imageUrl ? (
        <div className="rounded-4 overflow-hidden mb-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-100 h-100 object-fit-cover"
            style={{ maxHeight: '340px' }}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="border-top border-light-subtle pt-4">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
          <h3 className="h6 fw-bold text-dark mb-0">Comments ({post.commentCount})</h3>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-pill border border-light-subtle fw-bold"
            onClick={() => setIsCommentsOpen((current) => !current)}
          >
            {isCommentsOpen ? 'Hide thread' : 'Open thread'}
          </button>
        </div>

        {isCommentsOpen ? (
          <>
            <div className="d-flex flex-column gap-3 mb-3">
              {isLoading ? (
                <div className="rounded-4 bg-light p-4 border border-light-subtle">
                  <div className="placeholder-glow d-flex flex-column gap-2">
                    <span className="placeholder rounded-3 col-4" style={{ height: '14px' }}></span>
                    <span className="placeholder rounded-3 col-12" style={{ height: '14px' }}></span>
                    <span className="placeholder rounded-3 col-10" style={{ height: '14px' }}></span>
                  </div>
                </div>
              ) : null}

              {!isLoading && error ? <p className="text-danger mb-0">{error}</p> : null}

              {!isLoading && !error && comments.length === 0 ? (
                <p className="text-secondary mb-0">No comments yet. Start the discussion.</p>
              ) : null}

              {!isLoading &&
                !error &&
                comments.map((comment) => {
                  const canDeleteCurrentComment = Boolean(currentUserId && (currentUserId === comment.authorId || canManageCommunity));

                  return (
                    <div key={comment.id} className="rounded-4 bg-light p-3 border border-light-subtle">
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <p className="fw-bold text-dark mb-1">{comment.authorName}</p>
                          <p className="small text-secondary mb-2">{new Date(comment.createdAt).toLocaleString('uz-UZ')}</p>
                        </div>
                        {canDeleteCurrentComment ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-light rounded-pill text-danger border border-light-subtle"
                            onClick={() => onDeleteComment(comment)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                      <p className="text-secondary mb-0">{comment.content}</p>
                    </div>
                  );
                })}
            </div>

            <div className="input-group">
              <input
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                className="form-control rounded-start-pill py-3"
                placeholder={canPost ? 'Leave a comment...' : 'Join the community to comment'}
                disabled={!canPost || isSubmittingComment}
              />
              <button
                type="button"
                className="btn btn-primary rounded-end-pill px-4"
                onClick={handleCommentSubmit}
                disabled={!canPost || isSubmittingComment || !commentDraft.trim()}
              >
                {isSubmittingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
});

export default function CommunityDetailClient({ slug }: { slug: string }) {
  const { profile } = useAuth();
  const { community, membership, posts, announcements, isLoading, error } = useCommunity(slug);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostKind>('discussion');
  const [postPinned, setPostPinned] = useState(false);
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingCommunity, setIsEditingCommunity] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [communityAvatarUrl, setCommunityAvatarUrl] = useState('');
  const [communityCoverUrl, setCommunityCoverUrl] = useState('');

  useEffect(() => {
    if (!community) {
      return;
    }

    setCommunityName(community.name);
    setCommunityDescription(community.description);
    setCommunityAvatarUrl(community.avatarUrl ?? '');
    setCommunityCoverUrl(community.coverUrl ?? '');
  }, [community]);

  const membershipRole = membership?.role ?? null;
  const canManageCommunity = Boolean(profile && (membershipRole === 'owner' || membershipRole === 'admin' || profile.role === 'admin'));
  const canPost = Boolean(profile && membership);
  const visibleFeed = useMemo(() => posts, [posts]);

  const resetPostForm = useCallback(() => {
    setPostTitle('');
    setPostContent('');
    setPostType('discussion');
    setPostPinned(false);
    setPostImageUrl('');
    setPostImageFile(null);
    setEditingPostId(null);
  }, []);

  const startEditingPost = useCallback((post: CommunityPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostType(post.type);
    setPostPinned(post.pinned);
    setPostImageUrl(post.imageUrl ?? '');
    setPostImageFile(null);
    setStatusMessage(null);
    setErrorMessage(null);
  }, []);

  const handleJoinLeave = async () => {
    if (!profile || !community) {
      setErrorMessage('Sign in to join this community.');
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);

    try {
      if (membership) {
        await leaveCommunity(community.id, profile);
        setStatusMessage('You left the community.');
      } else {
        await joinCommunity(community.id, profile);
        setStatusMessage('You joined the community.');
      }
    } catch (actionError) {
      setErrorMessage(actionError instanceof Error ? actionError.message : 'Action failed.');
    }
  };

  const handlePostSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !community || !membership) {
      setErrorMessage('Join the community before creating a post.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const uploadedImage = postImageFile
        ? await uploadFile(`posts/${community.id}-${Date.now()}-${postImageFile.name}`, postImageFile)
        : postImageUrl;

      if (editingPostId) {
        await updatePost(
          editingPostId,
          {
            title: postTitle,
            content: postContent,
            pinned: postPinned,
            type: postType,
            imageUrl: uploadedImage,
          },
          profile,
        );
        setStatusMessage('Post updated.');
      } else {
        await createPost(
          community.id,
          {
            title: postTitle,
            content: postContent,
            type: postType,
            pinned: postPinned,
            imageUrl: uploadedImage,
          },
          profile,
        );
        setStatusMessage('Post created.');
      }

      resetPostForm();
    } catch (submitError) {
      setErrorMessage(submitError instanceof Error ? submitError.message : 'Post could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = useCallback(
    async (comment: PostComment) => {
      if (!profile) return;

      try {
        await deleteComment(comment, profile);
        setStatusMessage('Comment deleted.');
        setErrorMessage(null);
      } catch (actionError) {
        setErrorMessage(actionError instanceof Error ? actionError.message : 'Comment could not be deleted.');
      }
    },
    [profile],
  );

  const handleDeletePost = useCallback(
    async (post: CommunityPost) => {
      if (!profile) return;

      try {
        await deletePost(post, profile);
        setStatusMessage('Post deleted.');
        setErrorMessage(null);
        if (editingPostId === post.id) {
          resetPostForm();
        }
      } catch (actionError) {
        setErrorMessage(actionError instanceof Error ? actionError.message : 'Post could not be deleted.');
      }
    },
    [editingPostId, profile, resetPostForm],
  );

  const handleCommunitySave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !community) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await updateCommunity(
        community.id,
        {
          name: communityName,
          description: communityDescription,
          avatarUrl: communityAvatarUrl,
          coverUrl: communityCoverUrl,
        },
        profile,
      );
      setStatusMessage('Community details updated.');
      setIsEditingCommunity(false);
    } catch (submitError) {
      setErrorMessage(submitError instanceof Error ? submitError.message : 'Community could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="spinner-border text-primary" aria-hidden="true"></div>
      </main>
    );
  }

  if (!community) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="card border-0 shadow-sm rounded-5 p-5 text-center" style={{ maxWidth: '520px' }}>
          <h1 className="h4 fw-bold text-dark mb-3">Community not found</h1>
          <p className="text-secondary mb-4">{error ?? 'The community you requested does not exist or was removed.'}</p>
          <Link href="/communities" className="btn btn-primary rounded-pill fw-bold px-4">
            Back to communities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-vh-100 bg-body-tertiary py-5">
      <div className="container py-5">
        <div className="mb-4">
          <Link href="/communities" className="btn btn-link text-decoration-none fw-bold px-0">
            Back to all communities
          </Link>
        </div>

        <div className="card border-0 shadow-sm rounded-5 overflow-hidden mb-4">
          {community.coverUrl ? (
            <div style={{ height: '260px' }}>
              <img src={community.coverUrl} alt={community.name} className="w-100 h-100 object-fit-cover" loading="eager" decoding="async" />
            </div>
          ) : null}
          <div className="p-4 p-md-5">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
              <div className="d-flex gap-3">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '72px', height: '72px', fontSize: '24px' }}>
                  {community.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <h1 className="display-6 fw-bold text-dark mb-0">{community.name}</h1>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">/{community.slug}</span>
                  </div>
                  <p className="text-secondary mb-3">{community.description}</p>
                  <div className="d-flex flex-wrap gap-3 small text-secondary">
                    <span className="d-inline-flex align-items-center gap-2"><Users size={14} /> {community.memberCount} members</span>
                    <span className="d-inline-flex align-items-center gap-2"><MessageSquare size={14} /> {community.postCount} posts</span>
                    <span className="d-inline-flex align-items-center gap-2"><Megaphone size={14} /> {community.announcementCount} announcements</span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 align-items-start">
                <button type="button" className="btn btn-primary rounded-pill fw-bold px-4" onClick={handleJoinLeave}>
                  <UserPlus size={16} className="me-2" />
                  {membership ? 'Leave community' : 'Join community'}
                </button>
                {canManageCommunity ? (
                  <button type="button" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle" onClick={() => setIsEditingCommunity((current) => !current)}>
                    Community settings
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {isEditingCommunity && canManageCommunity ? (
          <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
            <form onSubmit={handleCommunitySave} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="edit-community-name">Name</label>
                <input id="edit-community-name" value={communityName} onChange={(event) => setCommunityName(event.target.value)} className="form-control rounded-4 py-3" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="edit-community-avatar">Avatar URL</label>
                <input id="edit-community-avatar" value={communityAvatarUrl} onChange={(event) => setCommunityAvatarUrl(event.target.value)} className="form-control rounded-4 py-3" />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-dark" htmlFor="edit-community-description">Description</label>
                <textarea id="edit-community-description" value={communityDescription} onChange={(event) => setCommunityDescription(event.target.value)} className="form-control rounded-4 py-3" rows={4} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-dark" htmlFor="edit-community-cover">Cover URL</label>
                <input id="edit-community-cover" value={communityCoverUrl} onChange={(event) => setCommunityCoverUrl(event.target.value)} className="form-control rounded-4 py-3" />
              </div>
              <div className="col-12 d-flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary rounded-pill fw-bold px-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>
                <button type="button" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle" onClick={() => setIsEditingCommunity(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {statusMessage || errorMessage ? (
          <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} rounded-4 border-0 shadow-sm`} role="status">
            {errorMessage ?? statusMessage}
          </div>
        ) : null}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
              <h2 className="h4 fw-bold text-dark mb-3">Announcements</h2>
              {announcements.length === 0 ? (
                <p className="text-secondary mb-0">No pinned or announcement posts yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {announcements.map((post) => (
                    <div key={post.id} className="rounded-4 border border-light-subtle bg-light p-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {post.pinned ? <Pin size={14} className="text-primary" /> : null}
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">{post.type}</span>
                      </div>
                      <h3 className="h6 fw-bold text-dark mb-1">{post.title}</h3>
                      <p className="small text-secondary mb-0">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5">
              <h2 className="h4 fw-bold text-dark mb-3">Create post</h2>
              {!canPost ? <p className="text-secondary">Join the community before posting.</p> : null}
              <form onSubmit={handlePostSubmit} className="d-flex flex-column gap-3">
                <input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} className="form-control rounded-4 py-3" placeholder="Post title" disabled={!canPost} required />
                <textarea value={postContent} onChange={(event) => setPostContent(event.target.value)} className="form-control rounded-4 py-3" rows={5} placeholder="What would you like to discuss?" disabled={!canPost} required />
                <div className="row g-3">
                  <div className="col-md-6">
                    <select value={postType} onChange={(event) => setPostType(event.target.value as PostKind)} className="form-select rounded-4 py-3" disabled={!canPost}>
                      <option value="discussion">Discussion</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input value={postImageUrl} onChange={(event) => setPostImageUrl(event.target.value)} className="form-control rounded-4 py-3" placeholder="Image URL (optional)" disabled={!canPost} />
                  </div>
                  <div className="col-12">
                    <input type="file" accept="image/*" onChange={(event) => setPostImageFile(event.target.files?.[0] ?? null)} className="form-control rounded-4 py-3" disabled={!canPost} />
                  </div>
                </div>
                <div className="form-check">
                  <input id="post-pinned" className="form-check-input" type="checkbox" checked={postPinned} onChange={(event) => setPostPinned(event.target.checked)} disabled={!canManageCommunity} />
                  <label className="form-check-label text-secondary" htmlFor="post-pinned">
                    Pin this post
                  </label>
                </div>
                <div className="d-flex flex-wrap gap-3">
                  <button type="submit" className="btn btn-primary rounded-pill fw-bold px-4" disabled={!canPost || isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingPostId ? 'Update post' : 'Publish post'}
                  </button>
                  {editingPostId ? (
                    <button type="button" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle" onClick={resetPostForm}>
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              {visibleFeed.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-5 p-5 text-center">
                  <h2 className="h4 fw-bold text-dark mb-2">No posts yet</h2>
                  <p className="text-secondary mb-0">Start the first discussion or announcement for this community.</p>
                </div>
              ) : null}

              {visibleFeed.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  canManageCommunity={canManageCommunity}
                  canPost={canPost}
                  currentUserId={profile?.id}
                  onDeleteComment={handleDeleteComment}
                  onDeletePost={handleDeletePost}
                  onStartEditing={startEditingPost}
                  post={post}
                  profile={profile}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
