# Firebase Schema

## Collections

### `users/{uid}`
- `id`
- `email`
- `displayName`
- `photoURL`
- `role`
- `createdAt`
- `updatedAt`

### `communities/{communityId}`
- `id`
- `name`
- `slug`
- `description`
- `avatarUrl`
- `coverUrl`
- `ownerId`
- `ownerName`
- `memberCount`
- `postCount`
- `announcementCount`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

### `communityMembers/{communityId_userId}`
- `id`
- `communityId`
- `userId`
- `userName`
- `userEmail`
- `role`
- `joinedAt`
- `createdAt`
- `updatedAt`

### `posts/{postId}`
- `id`
- `communityId`
- `title`
- `content`
- `type`
- `pinned`
- `imageUrl`
- `authorId`
- `authorName`
- `authorEmail`
- `commentCount`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

### `comments/{commentId}`
- `id`
- `communityId`
- `postId`
- `content`
- `authorId`
- `authorName`
- `authorEmail`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

## Suggested Composite Indexes

1. `posts`: `communityId ASC`, `createdAt DESC`
2. `comments`: `postId ASC`, `createdAt ASC`
3. `communities`: `slug ASC`
