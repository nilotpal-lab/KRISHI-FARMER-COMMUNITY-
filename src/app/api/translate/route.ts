import { NextRequest, NextResponse } from 'next/server';

const LANG_MAP: Record<string, string> = {
  en: 'English',
  kn: 'Kannada',
  hi: 'Hindi',
};

export async function POST(req: NextRequest) {
  try {
    const { text, from, to } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 503 });
    }

    const fromLang = LANG_MAP[from] || from || 'auto';
    const toLang = LANG_MAP[to] || to || 'English';

    const systemPrompt = `You are a translator for an Indian agricultural app named Krishi used by farmers.
Translate the following user text from ${fromLang} to ${toLang}.
Translate faithfully, keep agricultural terms natural for farmers (use everyday farming terms an Indian farmer speaks in their field), and return ONLY the translated text without any commentary, markdown wrappers, quotes, notes, or explanations.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nText:\n${text}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
      },
    };

    // Use documented Gemini Flash models with graceful fallback for demand spikes
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    let lastError = '';

    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const translatedText = candidate?.trim();

          if (translatedText) {
            return NextResponse.json({ translatedText });
          }
        } else {
          lastError = `Status ${res.status}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error';
      }
    }

    console.warn('Gemini translate API failed across candidate models:', lastError);
    return NextResponse.json({ error: 'Translation service unavailable' }, { status: 503 });
  } catch (error) {
    console.warn('Translate route handler exception:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 503 });
  }
}
