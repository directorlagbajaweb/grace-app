import { SCRIPTURES, THEMES, type Scripture, type Theme } from '@/constants/scriptures';

export type AIResponse = {
  scripture: string;
  reference: string;
  prayer: string;
};

type Message = { role: 'system' | 'user'; content: string };

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// llama3-8b-8192 was retired by Groq on 2025-08-30; this is its replacement.
const MODEL = 'openai/gpt-oss-20b';
const TIMEOUT_MS = 15000;
const MAX_PRAYER_SENTENCES = 5;

const FALLBACK: AIResponse = {
  scripture: 'casting all your worries on him, because he cares for you.',
  reference: '1 Peter 5:7',
  prayer: 'Lord, meet me here in what I cannot carry. Amen.',
};

const THEME_PROMPT = `You are a theme classifier. Read the text and return exactly one word from this list: ${THEMES.join(', ')}.

Do not explain. Do not add punctuation. Do not return any other word.
Reply with only this JSON and nothing else: {"theme": "<word from list>"}`;

const prayerPrompt = (verse: Scripture) => `You are a gentle Christian companion. The user has written privately about how they feel.

Write a short prayer for them that draws on this verse and matches the tone of what they wrote:
${verse.reference}: "${verse.text}"

Rules:
- First person ("I", "me"), warm and simple.
- 3 to 5 sentences, no longer.
- Do not quote other verses, lecture, diagnose or give advice.
- End with "Amen."

Reply with only this JSON and nothing else: {"prayer": "<prayer text>"}`;

async function groqChat(messages: Message[], temperature: number): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing Groq API key');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Groq request failed: ${res.status}`);

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Empty Groq response');
    }
    return content.trim();
  } finally {
    clearTimeout(timeout);
  }
}

// Parses the first {...} object in the model's reply, tolerating code fences or
// stray text around it. Returns null instead of throwing if it isn't valid JSON.
function parseJsonObject(content: string): Record<string, unknown> | null {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(content.slice(start, end + 1));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

const isTheme = (value: string): value is Theme =>
  (THEMES as readonly string[]).includes(value);

async function detectTheme(text: string): Promise<Theme> {
  const content = await groqChat(
    [
      { role: 'system', content: THEME_PROMPT },
      { role: 'user', content: text },
    ],
    0
  );

  const theme = String(parseJsonObject(content)?.theme ?? '').trim().toLowerCase();
  if (isTheme(theme)) return theme;

  // Parsing failed: accept the reply only if it names exactly one theme.
  const mentioned = THEMES.filter((t) => new RegExp(`\\b${t}\\b`, 'i').test(content));
  if (mentioned.length === 1) return mentioned[0];

  throw new Error('Unrecognised theme');
}

function pickVerse(theme: Theme): Scripture {
  const matches = SCRIPTURES.filter((s) => s.themes.includes(theme));
  if (matches.length === 0) throw new Error('No verse for theme');
  return matches[Math.floor(Math.random() * matches.length)];
}

async function writePrayer(text: string, verse: Scripture): Promise<string> {
  const content = await groqChat(
    [
      { role: 'system', content: prayerPrompt(verse) },
      { role: 'user', content: text },
    ],
    0.7
  );

  const prayer = parseJsonObject(content)?.prayer;
  if (typeof prayer !== 'string') throw new Error('Could not parse prayer');

  // Strip wrapping quotes and any closing "Amen", then enforce length and re-add it.
  const body = prayer
    .trim()
    .replace(/^["“]|["”]$/g, '')
    .replace(/\s*Amen[.!]?\s*$/i, '')
    .trim();
  const sentences = body.match(/[^.!?]+[.!?]+/g) ?? [];
  if (!body || sentences.length > MAX_PRAYER_SENTENCES) {
    throw new Error('Prayer out of bounds');
  }
  return `${/[.!?]$/.test(body) ? body : body + '.'} Amen.`;
}

export async function generateResponse(text: string): Promise<AIResponse> {
  if (!text.trim()) return FALLBACK;

  try {
    const theme = await detectTheme(text);
    const verse = pickVerse(theme);
    const prayer = await writePrayer(text, verse);
    return { scripture: verse.text, reference: verse.reference, prayer };
  } catch {
    // Deliberately no logging: errors could carry the user's text.
    return FALLBACK;
  }
}
