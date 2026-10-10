import { ScatterCategory, ScatterRoundAnswers, ScatterValidationResult } from '../types/scatterbrain';
import { verifyCategoryAnswer } from '../data/categoryDictionary';
import { MAX_ANSWER_LENGTH } from '../utils/limits';

const REQUEST_TIMEOUT_MS = 7500;
const MAX_SCORE = 10;

const hasOwn = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);

function clampScore(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return MAX_SCORE;
  return Math.min(MAX_SCORE, Math.max(1, Math.round(value)));
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export async function validateScatterAnswers(
  letter: string,
  answers: ScatterRoundAnswers,
  categories: ScatterCategory[]
): Promise<ScatterValidationResult[]> {
  // Never send more than the server accepts; send only category ids.
  const safeAnswers: Record<string, string> = {};
  for (const cat of categories) {
    safeAnswers[cat.id] = clip(hasOwn(answers, cat.id) ? answers[cat.id] : '', MAX_ANSWER_LENGTH);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        letter,
        answers: safeAnswers,
        categories: categories.map((c) => ({ id: c.id })),
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const data: unknown = await response.json();
      const raw =
        typeof data === 'object' && data !== null ? (data as { results?: unknown }).results : null;
      if (Array.isArray(raw)) {
        return normalizeServerResults(raw, letter, safeAnswers, categories);
      }
    }
  } catch (err) {
    console.warn('Backend validation unreachable, using built-in evaluator.', err instanceof Error ? err.name : 'error');
  } finally {
    clearTimeout(timeoutId);
  }

  return runClientSideValidation(letter, safeAnswers, categories);
}

/**
 * The server response is still treated as untrusted input: scores are derived
 * from isValid (never taken from the payload), strings are length-capped, and
 * anything missing/malformed falls back to the local evaluator.
 */
function normalizeServerResults(
  raw: unknown[],
  letter: string,
  answers: Record<string, string>,
  categories: ScatterCategory[]
): ScatterValidationResult[] {
  const byId = new Map<string, Record<string, unknown>>();
  for (const item of raw) {
    if (typeof item === 'object' && item !== null) {
      const rec = item as Record<string, unknown>;
      if (typeof rec.categoryId === 'string' && !byId.has(rec.categoryId)) byId.set(rec.categoryId, rec);
    }
  }

  return categories.map((cat) => {
    const rec = byId.get(cat.id);
    if (!rec || typeof rec.isValid !== 'boolean' || typeof rec.message !== 'string') {
      return localResult(cat, answers[cat.id] ?? '', letter);
    }
    const corrected = typeof rec.correctedSpelling === 'string' ? clip(rec.correctedSpelling, MAX_ANSWER_LENGTH) : '';
    const suggested = typeof rec.correctAnswer === 'string' ? clip(rec.correctAnswer, MAX_ANSWER_LENGTH) : '';
    return {
      categoryId: cat.id,
      isValid: rec.isValid,
      score: rec.isValid ? clampScore(rec.score) : 0,
      message: clip(rec.message, 200),
      correctedSpelling: corrected || null,
      correctAnswer: !rec.isValid && suggested ? suggested : null,
    };
  });
}

function localResult(cat: ScatterCategory, rawVal: string, letter: string): ScatterValidationResult {
  const verification = verifyCategoryAnswer(cat.id, rawVal.trim(), letter);
  return {
    categoryId: cat.id,
    isValid: verification.isValid,
    score: verification.isValid ? clampScore(verification.score) : 0,
    message: verification.message,
    correctedSpelling: verification.correctedSpelling || null,
    correctAnswer: verification.correctAnswer || null,
  };
}

function runClientSideValidation(
  letter: string,
  answers: Record<string, string>,
  categories: ScatterCategory[]
): ScatterValidationResult[] {
  return categories.map((cat) => localResult(cat, answers[cat.id] ?? '', letter));
}
