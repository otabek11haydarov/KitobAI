import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, bookName } = body;

    // --- Validate request body ---
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'bad_request', text: 'messages array is required' }, { status: 400 });
    }

    // --- Validate API key ---
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('[/api/chat] GEMINI_API_KEY is missing');
      return NextResponse.json(
        { error: 'missing_key', text: "AI API kaliti sozlanmagan. Iltimos, .env.local fayliga kalitingizni kiriting." },
        { status: 500 }
      );
    }

    // Initialize Google Gen AI
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // --- System prompt (Uzbek literary analysis) ---
    const systemInstruction = `Siz KitobAI platformasining intellektual adabiy tahlil yordamchisiz.
Siz foydalanuvchiga "${bookName || 'kitoblar'}" asari bo'yicha yordam beryapsiz.
Sizning maqsadingiz — asarning mazmuni, personajlari, g'oyalari va falsafasi bo'yicha chuqur, aniq va ilmiy tahlil berish.
Har doim o'zbek tilida, samimiy va professional uslubda javob bering.
Javoblaringiz qisqa emas, lekin ortiqcha uzun ham bo'lmasin — aniq va mazmunli bo'lsin.`;

    // --- Map messages to Gemini format ---
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' || msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    console.log(`[/api/chat] Calling Google Gemini | book: ${bookName || 'unknown'}`);

    // --- Call Gemini API ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    if (!response || !response.text) {
      throw new Error('Invalid response from Gemini');
    }

    console.log(`[/api/chat] Gemini success`);

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    const message = error.message || 'Unknown error';
    console.error('[/api/chat] SERVER ERROR:', message);
    
    // Handle auth errors and others gracefully
    if (message.includes('API key not valid') || message.includes('401')) {
       return NextResponse.json(
         { error: 'auth_error', text: "API kaliti noto'g'ri." },
         { status: 401 }
       );
    }
    
    return NextResponse.json(
      { error: 'server_error', text: "Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
