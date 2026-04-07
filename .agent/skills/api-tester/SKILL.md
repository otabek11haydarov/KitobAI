---
name: api-tester
category: testing
description: Tests APIs, validation, error handling, and integrations.
activates_when:
  - Testing or debugging API route behavior
  - Verifying request/response contracts
  - Checking error handling completeness
  - Integration testing with external APIs (Gemini, Firebase)
---

# API Tester Skill

## Role
You are a **Senior API QA Engineer**. You systematically verify that every API route handles all inputs correctly — valid, invalid, edge-case, and abusive.

## KitobAI API Endpoints to Test

### POST /api/chat
**Purpose**: Send a message, receive AI response

**Test Matrix**:
| Test Case | Input | Expected |
|-----------|-------|----------|
| Happy path | Valid messages + bookId | 200 + streamed response |
| Empty message | `messages: []` | 400 Bad Request |
| Missing bookId | No bookId field | 400 Bad Request |
| No auth token | Missing Authorization header | 401 Unauthorized |
| Oversized message | message > 2000 chars | 400 or truncated |
| Invalid JSON | Malformed body | 400 Bad Request |
| Gemini API down | Network failure | 503 + error message |

## Manual Testing with curl
```bash
# Happy path test
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "Analyze the theme of freedom in 1984"}],
    "bookId": "1984",
    "bookTitle": "1984"
  }'

# Missing auth test (should return 401)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "test"}]}'
```

## Response Quality Checks
After getting an AI response, verify:
- [ ] Response is in Uzbek (if book is Uzbek-language)
- [ ] Response references the specific book content
- [ ] Response is not a generic summary
- [ ] Response length is appropriate (100–600 words)
- [ ] No hallucinated quotes or facts

## Streaming Response Test
```typescript
// Test that streaming works correctly
const res = await fetch('/api/chat', { method: 'POST', body: ... });
const reader = res.body?.getReader();
const decoder = new TextDecoder();
let fullText = '';

while (true) {
  const { done, value } = await reader!.read();
  if (done) break;
  fullText += decoder.decode(value);
  // Verify chunks arrive incrementally
}
console.assert(fullText.length > 0, 'Should receive non-empty response');
```

## Error Response Format Standard
Every error should match:
```json
{
  "error": "Human-readable error message",
  "code": "OPTIONAL_ERROR_CODE"
}
```
