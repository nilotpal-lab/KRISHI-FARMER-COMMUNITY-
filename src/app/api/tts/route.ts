import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'kn';

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text query parameter is required' }, { status: 400 });
  }

  // Google Translate TTS accepts chunks up to ~200 characters cleanly
  const cleanText = text
    .replace(/[#*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    cleanText
  )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

  try {
    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch TTS audio stream' }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
