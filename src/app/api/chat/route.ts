import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system' | 'ai';
  text?: string;
  content?: string;
};

const RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_CONTEXT_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 700;

const responseCache = new Map<string, { text: string; expiresAt: number }>();
const inFlightRequests = new Map<string, Promise<string>>();

function normalizeMessages(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const role = (item as ChatMessage).role;
      const content = (item as ChatMessage).text ?? (item as ChatMessage).content;

      if (!role || !content || typeof content !== 'string') {
        return null;
      }

      return {
        role: role === 'ai' ? 'assistant' : role,
        content: content.trim().replace(/\s+/g, ' ').slice(0, MAX_MESSAGE_LENGTH),
      };
    })
    .filter(Boolean)
    .slice(-MAX_CONTEXT_MESSAGES);
}

function createCacheKey(bookName: string, messages: ReturnType<typeof normalizeMessages>) {
  return JSON.stringify({
    bookName,
    messages,
  });
}

function createTextStream(text: string) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

function jsonError(text: string, status: number, error: string) {
  return NextResponse.json({ error, text }, { status });
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOpenRouter(messages: ReturnType<typeof normalizeMessages>, bookName: string, apiKey: string, model: string) {
  const siteUrl = process.env.OPENROUTER_SITE_URL || 'https://kitob-ai.com';
  const siteName = process.env.OPENROUTER_SITE_NAME || 'KitobAI Assistant';

  const systemPrompt = {
    role: 'system',
    content: `Siz KitobAI platformasining premium reading assistantisiz.
Foydalanuvchi bilan foydali, ishonchli va tezkor ohangda gaplashing.
Siz ayniqsa "${bookName}" yoki shu mavzuga yaqin kitoblar bo'yicha yordam beryapsiz.
Summary, theme, character analysis, discussion savollari, reading guidance va o'xshash kitoblar tavsiyasida kuchli bo'ling.
Doimo imkon qadar o'zbek tilida javob bering.
Faktlarga ehtiyotkor bo'ling, bilmasangiz buni ochiq ayting.`,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 700,
          stream: true,
          messages: [systemPrompt, ...messages],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if ((response.status >= 500 || response.status === 429) && attempt === 0) {
        await wait(250);
        continue;
      }

      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error instanceof Error ? error : new Error('Unknown provider error');

      if (attempt === 0) {
        await wait(250);
        continue;
      }
    }
  }

  throw lastError ?? new Error('OpenRouter request failed');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = normalizeMessages(body?.messages);
    const bookName = typeof body?.bookName === 'string' ? body.bookName : 'kitoblar';
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4.1-mini';

    if (!messages.length) {
      return jsonError('Chat uchun kamida bitta xabar yuborilishi kerak.', 400, 'invalid_messages');
    }

    if (!apiKey || apiKey.includes('placeholder')) {
      return jsonError("AI API kaliti sozlanmagan. .env.local fayliga OPENROUTER_API_KEY va OPENROUTER_MODEL qiymatlarini kiriting.", 503, 'missing_key');
    }

    const cacheKey = createCacheKey(bookName, messages);
    const cachedResponse = responseCache.get(cacheKey);

    if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
      return new Response(createTextStream(cachedResponse.text), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Response-Source': 'cache',
        },
      });
    }

    if (inFlightRequests.has(cacheKey)) {
      const text = await inFlightRequests.get(cacheKey)!;
      return new Response(createTextStream(text), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Response-Source': 'deduped',
        },
      });
    }

    const upstreamResponse = await fetchOpenRouter(messages, bookName, apiKey, model);

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error('OPENROUTER API ERROR:', errorText);
      return jsonError("AI xizmati hozir javob bermayapti. Birozdan keyin qayta urinib ko'ring.", upstreamResponse.status, 'provider_error');
    }

    if (!upstreamResponse.body) {
      return jsonError("AI javobi bo'sh keldi. Qayta urinib ko'ring.", 502, 'empty_provider_response');
    }

    let resolveRequest!: (text: string) => void;
    let rejectRequest!: (error: Error) => void;
    const requestPromise = new Promise<string>((resolve, reject) => {
      resolveRequest = resolve;
      rejectRequest = reject;
    });
    inFlightRequests.set(cacheKey, requestPromise);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = upstreamResponse.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) {
                continue;
              }

              const data = trimmed.slice(5).trim();
              if (!data || data === '[DONE]') {
                continue;
              }

              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content;

              if (typeof delta === 'string' && delta.length > 0) {
                fullText += delta;
                controller.enqueue(encoder.encode(delta));
              }
            }
          }

          if (!fullText.trim()) {
            throw new Error('Empty streamed response');
          }

          responseCache.set(cacheKey, {
            text: fullText,
            expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
          });
          resolveRequest(fullText);
          controller.close();
        } catch (error) {
          rejectRequest(error instanceof Error ? error : new Error('Unknown stream error'));
          controller.error(error);
        } finally {
          inFlightRequests.delete(cacheKey);
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Response-Source': 'stream',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return jsonError('AI javobi juda sekin keldi. Iltimos, qayta urinib ko‘ring.', 504, 'timeout');
    }

    console.error('SERVER-SIDE CHAT ERROR:', error);
    return jsonError("Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi.", 500, 'server_error');
  }
}
