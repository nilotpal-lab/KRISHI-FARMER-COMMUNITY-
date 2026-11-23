import { NextRequest, NextResponse } from 'next/server';

const LANG_MAP: Record<string, string> = {
  en: 'English',
  kn: 'Kannada',
  hi: 'Hindi',
};

export async function POST(req: NextRequest) {
  try {
    const { message, locale = 'en', userProfile } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 503 });
    }

    const langName = LANG_MAP[locale] || 'English';
    const stateInfo = userProfile?.state ? `State: ${userProfile.state}` : '';
    const districtInfo = userProfile?.district ? `District: ${userProfile.district}` : '';
    const cropsInfo = userProfile?.crops?.length ? `Crops grown: ${userProfile.crops.join(', ')}` : '';

    const systemPrompt = `You are "Kisan Mitra", a warm, empathetic, and knowledgeable agricultural advisor assisting Indian farmers.
Language Requirement: You MUST reply entirely in ${langName}. Use natural, everyday spoken farming language that a rural farmer comfortably understands. Avoid high Sanskritized academic jargon.

FARMER SAFETY DIRECTIVE (ABSOLUTE & UNCOMPROMISING):
1. NEVER prescribe specific chemical pesticide or herbicide brand names or numerical chemical dosages (no ml/L, g/L, or ppm concentrations).
2. For pests, weeds, or crop diseases, suggest SAFE non-toxic cultural, physical, or biological practices (crop sanitation, pheromone traps, yellow sticky cards, neem oil extract, deep summer ploughing, crop rotation).
3. Always include this referral in ${langName}: For chemical pesticide selection and exact application dosage tailored to your field, consult your local Krishi Vigyan Kendra (KVK), Raitha Samparka Kendra, or call the national Kisan Call Centre at toll-free 1800-180-1551.
4. Keep replies clear, actionable, and structured in 3-4 bullet points.
${stateInfo}
${districtInfo}
${cropsInfo}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nFarmer's Question: ${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    };

    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
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
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          lastError = `Status ${res.status}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error';
      }
    }

    return NextResponse.json({ error: 'Chat service unavailable', details: lastError }, { status: 503 });
  } catch (error) {
    console.warn('Chat route handler error:', error);
    return NextResponse.json({ error: 'Internal chat failure' }, { status: 500 });
  }
}
