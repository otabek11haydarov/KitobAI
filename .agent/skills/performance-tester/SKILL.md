---
name: performance-tester
category: testing
description: Analyzes performance, latency, and scalability.
activates_when:
  - Page feels slow or unresponsive
  - Large bundle size warnings in build output
  - AI response latency is too high
  - Lighthouse score needs improvement
  - Scaling concerns for more users/data
---

# Performance Tester Skill

## Role
You are a **Senior Performance Engineer**. You measure, diagnose, and improve the speed of KitobAI — from initial page load to AI response time.

## Performance Targets (KitobAI)

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Total Blocking Time (TBT) | < 200ms | Lighthouse |
| First Load JS | < 150kB per page | `npm run build` |
| AI Response First Token | < 2s | Manual timing |
| Chat message render | < 16ms | React DevTools |

## Measuring Bundle Size
```bash
npm run build
# Review .next/analyze/ or the build output table
# Flag: any page > 150kB First Load JS
```

Enable bundle analyzer:
```javascript
// next.config.mjs
import { withBundleAnalyzer } from '@next/bundle-analyzer';
const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default withAnalyzer(nextConfig);
```
```bash
ANALYZE=true npm run build
```

## Common Performance Issues & Fixes

### Issue: Large JS Bundle
```
❌ Symptom: First Load JS > 300kB
✅ Fix: Dynamic import heavy components
```
```typescript
import dynamic from 'next/dynamic';
const ChatWindow = dynamic(() => import('@/components/ChatWindow'), {
  loading: () => <ChatSkeleton />,
});
```

### Issue: Slow AI Response
```
❌ Symptom: User waits 5+ seconds before seeing response
✅ Fix: Implement streaming (ReadableStream)
```
```typescript
// Stream Gemini response directly to client
const stream = result.stream;
return new Response(stream, {
  headers: { 'Content-Type': 'text/event-stream' },
});
```

### Issue: Unnecessary Re-renders
```
❌ Symptom: React DevTools shows component re-rendering on every keystroke
✅ Fix: Memoize expensive components and callbacks
```
```typescript
const MemoizedBookCard = memo(BookCard);
const handleSelect = useCallback((id: string) => { ... }, [dependency]);
```

### Issue: Slow Image Loading
```
❌ Symptom: Book cover images cause layout shift
✅ Fix: Use next/image with explicit dimensions
```
```typescript
import Image from 'next/image';
<Image src={book.cover} alt={book.title} width={200} height={300} priority />
```

## Lighthouse Audit Process
1. Open Chrome DevTools → Lighthouse tab
2. Run audit on: Landing page, /ai, /ai/[sessionId]
3. Target: > 90 Performance, > 90 Accessibility
4. Document scores before and after changes
5. Fix top 3 opportunities shown in report

## AI Latency Profiling
```typescript
// Add timing to API route
const start = performance.now();
const result = await model.generateContent(prompt);
const duration = performance.now() - start;
console.log(`[AI] Response time: ${duration.toFixed(0)}ms`);
```
Target: < 2000ms for first token with streaming.
