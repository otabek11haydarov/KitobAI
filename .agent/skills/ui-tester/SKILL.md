---
name: ui-tester
category: testing
description: Tests UI behavior, responsiveness, and user flows.
activates_when:
  - Verifying a new page or component works correctly
  - Regression testing after UI changes
  - Accessibility or responsive design checks
  - Testing user flows end-to-end (auth → chat → response)
---

# UI Tester Skill

## Role
You are a **Senior UI QA Engineer**. You verify that KitobAI's interface works correctly for real users — across devices, states, and edge cases.

## Core User Flows to Test (KitobAI)

### Flow 1: Landing → Sign Up → Dashboard
```
1. Visit http://localhost:3000
2. Click "Sign Up" button
3. Fill email + password
4. Submit → verify redirect to /dashboard
5. Check: user name shown in nav
6. Refresh → verify session persists
```

### Flow 2: Browse Books → Start Chat
```
1. Navigate to /ai (AI Assistant page)
2. Click "Create New Chat" card
3. Select a book from the list
4. Verify: chat page opens with book title in header
5. Type a message and send
6. Verify: user message appears immediately
7. Verify: AI response streams in (typing effect)
8. Verify: conversation persists after page refresh
```

### Flow 3: Chat History
```
1. Complete Flow 2
2. Navigate away to /dashboard
3. Return to /ai
4. Verify: previous chat session appears in the grid
5. Click the session → verify messages are restored
```

## Component State Checklist

### Chat Input Component
- [ ] Send button disabled when input is empty
- [ ] Send button disabled while AI is responding
- [ ] Enter key submits message
- [ ] Input clears after submit
- [ ] Long messages display correctly (no overflow)

### Book Card Component
- [ ] Hover effect is smooth
- [ ] Cover image loads (no broken image)
- [ ] Title and author display correctly
- [ ] Clicking navigates to correct URL

### Auth Modal
- [ ] Opens on "Sign In" click
- [ ] Closes on backdrop click or X button
- [ ] Form validates before submit (empty fields)
- [ ] Error message shows on wrong password
- [ ] Loading state shown during auth request

## Responsive Testing
Test every new page at these widths:
| Width | Breakpoint | Expectation |
|-------|-----------|-------------|
| 375px | Mobile S  | Single column, stacked nav |
| 768px | Tablet    | 2-column grid, collapsible sidebar |
| 1280px | Desktop  | 3-column grid, persistent sidebar |
| 1920px | Wide     | Max-width container centered |

## Accessibility Checks
- [ ] All images have `alt` text
- [ ] Buttons have descriptive `aria-label` if icon-only
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Focus indicators are visible (not hidden by CSS)
- [ ] Color is not the only way information is conveyed
