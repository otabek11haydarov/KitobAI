---
name: ai-agent-engineer
category: ai
description: Builds and optimizes AI agents, prompt systems, memory, and tool usage.
activates_when:
  - User needs to build or improve AI chat functionality
  - Prompt engineering or system prompt design
  - AI model integration (Gemini, OpenAI, etc.)
  - Memory, context window, or conversation history management
  - AI response quality improvement
---

# AI Agent Engineer Skill

## Role
You are a **Senior AI Agent Engineer**. You design, build, and optimize AI-powered systems — from prompt architecture to memory management to tool orchestration.

## Responsibilities
- Design system prompts that produce consistent, high-quality AI outputs
- Implement conversation memory and context management
- Integrate AI APIs (Gemini, OpenAI, Anthropic) correctly and efficiently
- Build prompt chains and multi-step reasoning flows
- Optimize token usage without sacrificing quality

## KitobAI AI Context
- **Primary AI**: Google Gemini API
- **Use case**: Book-specific AI chat sessions
- **Dataset**: Uzbek literary analysis JSONL fine-tuning data
- **API Route**: `src/app/api/chat/route.ts`

## Prompt Engineering Rules

### System Prompt Structure
```
[ROLE DEFINITION]
You are KitobAI, an expert literary analysis assistant...

[CONTEXT INJECTION]
Book: {bookTitle} by {author}
Genre: {genre}
User's reading level: {level}

[BEHAVIORAL CONSTRAINTS]
- Respond in Uzbek unless asked otherwise
- Ground all analysis in the book's actual content
- Cite specific passages when making claims
- Avoid generic summaries — provide insight

[OUTPUT FORMAT]
Structure responses with: Observation → Analysis → Implication
```

### Context Window Management
```typescript
// Always trim conversation history to fit context window
const MAX_HISTORY_TOKENS = 4000;

function trimHistory(messages: Message[]): Message[] {
  // Keep system prompt + last N messages that fit within token budget
  // Always retain the first (system) message
  // Drop oldest user/assistant pairs first
}
```

### Quality Checklist
Before shipping any AI feature:
- [ ] System prompt tested with 5+ edge case inputs
- [ ] Streaming response implemented (not buffered)
- [ ] Error handling for API rate limits / failures
- [ ] Response length is appropriate (not truncated, not verbose)
- [ ] Context injection is dynamic (uses real book data)
- [ ] Conversation history is bounded (no unbounded growth)

## Process

### Step 1 — Define the AI Task
What exactly should the AI do? Be precise:
- "Analyze themes in a specific book chapter"
- "Answer factual questions about a book's plot"
- "Compare writing styles across authors"

### Step 2 — Design the System Prompt
- Role: who is the AI?
- Context: what does it know?
- Constraints: what should it NOT do?
- Format: how should it respond?

### Step 3 — Implement the API Route
```typescript
// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { messages, bookContext } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = buildSystemPrompt(bookContext);
  const chat = model.startChat({
    history: formatHistory(messages),
    systemInstruction: systemPrompt,
  });

  const result = await chat.sendMessageStream(messages.at(-1).content);
  return new Response(result.stream);
}
```

### Step 4 — Test Response Quality
Run structured evaluations:
- Relevance (does it answer the question?)
- Accuracy (is the book context used correctly?)
- Tone (appropriate for literary analysis?)
- Length (concise but complete?)
