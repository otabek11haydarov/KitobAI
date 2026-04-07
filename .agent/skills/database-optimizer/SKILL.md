---
name: database-optimizer
category: engineering
description: Optimizes database schema, queries, indexing, and performance.
activates_when:
  - Designing Firestore collection structure
  - Slow queries or missing indexes
  - Data modeling for new features
  - Migration of data structures
  - Read/write cost optimization
---

# Database Optimizer Skill

## Role
You are a **Senior Database Engineer** specializing in Firebase Firestore. You design schemas that are efficient to query, cheap to read, and easy to evolve.

## KitobAI Data Model (Firestore)

### Collection Structure
```
/users/{userId}
  - email: string
  - displayName: string
  - createdAt: Timestamp
  - preferences: { language: string, theme: string }

/chatSessions/{sessionId}
  - userId: string          ← for security rules
  - bookId: string
  - bookTitle: string       ← denormalized for display
  - createdAt: Timestamp
  - lastMessageAt: Timestamp
  - messageCount: number

/chatSessions/{sessionId}/messages/{messageId}
  - role: 'user' | 'assistant'
  - content: string
  - createdAt: Timestamp
```

### Denormalization Strategy
Firestore is NoSQL — denormalize for read performance:
```
❌ Avoid: Joining chatSession + books collection on every list render
✅ Do:    Store bookTitle + bookCover in chatSession document
```

## Firestore Query Patterns

### Efficient Queries
```typescript
// List user's recent chat sessions (indexed by userId + lastMessageAt)
const sessionsQuery = query(
  collection(db, 'chatSessions'),
  where('userId', '==', currentUser.uid),
  orderBy('lastMessageAt', 'desc'),
  limit(20)
);

// Get messages for a session (sub-collection, automatically ordered)
const messagesQuery = query(
  collection(db, 'chatSessions', sessionId, 'messages'),
  orderBy('createdAt', 'asc')
);
```

### Index Requirements
Always declare composite indexes for:
- `where + orderBy` on different fields
- Multiple `where` clauses
- `orderBy` on a field other than `__name__`

```
Index needed: chatSessions (userId ASC, lastMessageAt DESC)
```

## Performance Rules
1. **Paginate everything** — never `getDocs` without `limit()`
2. **Cache aggressively** — use Firestore's offline persistence
3. **Batch writes** — use `writeBatch()` for multiple updates
4. **Avoid deep nesting** — max 3 levels of sub-collections
5. **Count with counters** — never count by reading all docs

## Security Rules Template
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    // Chat sessions owned by the user
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      match /messages/{messageId} {
        allow read, write: if request.auth.uid == get(/databases/$(database)/documents/chatSessions/$(sessionId)).data.userId;
      }
    }
  }
}
```
