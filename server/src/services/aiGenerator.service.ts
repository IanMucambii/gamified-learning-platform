import { IQuestion} from "../models/Quiz";
import { IPuzzlePair } from "../models/Puzzle";
import { env } from "../env";

//To connect with some ai API
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';
const REQUEST_TIMEOUT_MS = 20_000;

interface GroqChoice {
  message: { role: string; content: string };
}
interface GroqResponse {
  choices: GroqChoice[];
  error?: { message: string; type?: string };
}

async function callGroq<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  if (!env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in .env');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    // Use native fetch (Node 18+) — avoids node-fetch v3 ESM/CJS interop issues
    res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Groq request timed out after ${REQUEST_TIMEOUT_MS}ms — check network/API key/firewall`);
    }
    throw new Error(`Groq request failed: ${(err as Error).message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as GroqResponse;

  if (data.error) {
    throw new Error(`Groq API error: ${data.error.message}`);
  }

  const raw = data.choices?.[0]?.message?.content ?? '{}';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Groq returned non-JSON content: ${raw.slice(0, 200)}`);
  }
}

// ---- Quiz ----
export async function generateQuiz(materialText: string, numQuestions = 5): Promise<IQuestion[]> {
  const system =
    'You are a careful assistant that generates gentle memory-recall quizzes for elderly dementia patients. Always respond with valid JSON only, matching the exact shape requested.';
  const user = `Based on the text below, generate exactly ${numQuestions} simple multiple-choice questions to help an elderly patient recall it.
Respond ONLY with a JSON object in this exact shape:
{"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..."}]}
Keep language simple, short sentences, warm and non-condescending tone.
TEXT:
${materialText}`;

  const result = await callGroq<{ questions: IQuestion[] }>(system, user);
  return result.questions;
}

// ---- Puzzle ----
export async function generatePuzzle(
  materialText: string
): Promise<{ puzzleType: string; pairs: IPuzzlePair[] }> {
  const system =
    'You are a careful assistant that generates simple memory-matching puzzles for elderly dementia patients. Always respond with valid JSON only, matching the exact shape requested.';
  const user = `Based on the text below, generate a simple matching puzzle (pairs of related short items — e.g. a name and a fact, or an object and its use) to help an elderly patient practice recall.
Respond ONLY with a JSON object in this exact shape:
{"puzzleType": "matching", "pairs": [{"left": "...", "right": "..."}]}
Generate between 4 and 6 pairs. Keep each item short (a few words).
TEXT:
${materialText}`;

  return callGroq<{ puzzleType: string; pairs: IPuzzlePair[] }>(system, user);
}

// ---- Phrases ----
export async function generatePhrases(materialText: string): Promise<string[]> {
  const system =
    'You are a careful assistant that writes short, gentle recall prompts for elderly dementia patients. Always respond with valid JSON only, matching the exact shape requested.';
  const user = `Based on the text below, write between 1 and 4 short encouraging phrases (a sentence each) to show the patient right before they start an activity based on this material — to gently remind them what it's about. Respond ONLY with a JSON object in this exact shape: {"phrases": ["...", "..."]} Keep each phrase warm, simple, and short (one sentence). TEXT: ${materialText}`;

  const result = await callGroq<{ phrases: string[] }>(system, user);
  return result.phrases;
}

