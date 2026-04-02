import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, bookName } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite-preview-02-05:free';

    if (!apiKey || apiKey.includes('placeholder')) {
       // Fallback for demo if API key is not yet set up
       return NextResponse.json({ 
         error: 'missing_key', 
         text: "AI API kaliti sozlanmagan. Iltimos, .env.local fayliga o'zingizning sk-or-v1-... kalitingizni kiriting." 
       });
    }

    // Prepare system instruction for context
    const systemPrompt = {
      role: 'system',
      content: `Siz KitobAI platformasining intellektual yordamchisiz.
      Siz foydalanuvchiga "${bookName || 'kitoblar'}" asari bo'yicha yordam beryapsiz. 
      Sizning maqsadingiz - asarning mazmuni, personajlari va g'oyalari bo'yicha chuqur va aniq tahlil berish.
      Doimo o'zbek tilida so'zlashuvchan va samimiy uslubda javob bering.`
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://kitob-ai.com",
        "X-Title": "KitobAI Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [systemPrompt, ...messages]
      })
    });

    if (!response.ok) {
       const errorText = await response.text();
       console.error("OPENROUTER API ERROR LOG:", errorText);
       throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
       return NextResponse.json({ text: data.choices[0].message.content });
    }

    // Handle potential data structure errors
    console.error("Unexpected OpenRouter Response Structure:", JSON.stringify(data));
    throw new Error('Invalid response structure from AI provider');

  } catch (error: any) {
    console.error("SERVER-SIDE CHAT ERROR:", error.message);
    return NextResponse.json({ error: 'server_error', text: "Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi." }, { status: 500 });
  }
}
