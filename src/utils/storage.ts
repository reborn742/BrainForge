import { PlayerStats } from '../types/game';
import { ScatterPlayerStats } from '../types/scatterbrain';

/**
 * Hardened localStorage access.
 *  - Every access is wrapped: storage can throw (Safari private mode, blocked
 *    cookies, quota) and an uncaught throw here used to white-screen the app.
 *  - Everything read back is treated as untrusted: parsed defensively, shape
 *    checked, numbers clamped. A tampered/corrupted value can no longer crash
 *    the UI (e.g. `"null"` -> `prev.gamesPlayed` TypeError) or inject NaN/huge
 *    numbers into the stats.
 */

const KEYS = {
  flash: 'flashrecall_player_stats',
  scatter: 'scatterbrain_player_stats',
  muted: 'brainforge_muted',
  legacyMuted: 'flashrecall_muted',
} as const;

const MAX_RAW_LENGTH = 4096;
const HUGE = 1_000_000_000;

interface NumSpec {
  min: number;
  max: number;
  int: boolean;
}
type Spec<T> = { [K in keyof T]: NumSpec };

export const DEFAULT_FLASH_STATS: PlayerStats = {
  gamesPlayed: 0,
  highScore: 0,
  totalScore: 0,
  highestArcadeLevel: 1,
  bestAccuracy: 0,
  fastestRecallPerItem: 999,
  totalItemsRecalled: 0,
  perfectRounds: 0,
};

export const DEFAULT_SCATTER_STATS: ScatterPlayerStats = {
  gamesPlayed: 0,
  totalScore: 0,
  highScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalWordsAccepted: 0,
};

const FLASH_SPEC: Spec<PlayerStats> = {
  gamesPlayed: { min: 0, max: HUGE, int: true },
  highScore: { min: 0, max: HUGE, int: true },
  totalScore: { min: 0, max: HUGE, int: true },
  highestArcadeLevel: { min: 1, max: 100, int: true },
  bestAccuracy: { min: 0, max: 100, int: false },
  fastestRecallPerItem: { min: 0, max: 999, int: false },
  totalItemsRecalled: { min: 0, max: HUGE, int: true },
  perfectRounds: { min: 0, max: HUGE, int: true },
};

const SCATTER_SPEC: Spec<ScatterPlayerStats> = {
  gamesPlayed: { min: 0, max: HUGE, int: true },
  totalScore: { min: 0, max: HUGE, int: true },
  highScore: { min: 0, max: HUGE, int: true },
  currentStreak: { min: 0, max: HUGE, int: true },
  bestStreak: { min: 0, max: HUGE, int: true },
  totalWordsAccepted: { min: 0, max: HUGE, int: true },
};

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function clampNumber(value: unknown, spec: NumSpec, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const clamped = Math.min(spec.max, Math.max(spec.min, value));
  return spec.int ? Math.round(clamped) : Math.round(clamped * 100) / 100;
}

function loadStats<T extends object>(key: string, defaults: T, spec: Spec<T>): T {
  const result: T = { ...defaults };
  const raw = safeGet(key);
  if (!raw || raw.length > MAX_RAW_LENGTH) return result;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return result;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return result;

  const source = parsed as Record<string, unknown>;
  for (const field of Object.keys(defaults) as (keyof T & string)[]) {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      (result as Record<string, number>)[field] = clampNumber(
        source[field],
        spec[field],
        defaults[field] as number
      );
    }
  }
  return result;
}

function saveStats<T extends object>(key: string, stats: T, defaults: T, spec: Spec<T>): void {
  // Re-sanitise on the way out so we never persist NaN/Infinity.
  const clean: Record<string, number> = {};
  for (const field of Object.keys(defaults) as (keyof T & string)[]) {
    clean[field] = clampNumber(stats[field], spec[field], defaults[field] as number);
  }
  safeSet(key, JSON.stringify(clean));
}

export const loadFlashStats = (): PlayerStats =>
  loadStats(KEYS.flash, DEFAULT_FLASH_STATS, FLASH_SPEC);
export const saveFlashStats = (s: PlayerStats): void =>
  saveStats(KEYS.flash, s, DEFAULT_FLASH_STATS, FLASH_SPEC);

export const loadScatterStats = (): ScatterPlayerStats =>
  loadStats(KEYS.scatter, DEFAULT_SCATTER_STATS, SCATTER_SPEC);
export const saveScatterStats = (s: ScatterPlayerStats): void =>
  saveStats(KEYS.scatter, s, DEFAULT_SCATTER_STATS, SCATTER_SPEC);

export function clearAllStats(): void {
  safeRemove(KEYS.flash);
  safeRemove(KEYS.scatter);
}

export function loadMuted(): boolean {
  return (safeGet(KEYS.muted) ?? safeGet(KEYS.legacyMuted)) === 'true';
}

export function saveMuted(muted: boolean): void {
  safeSet(KEYS.muted, String(muted));
  safeSet(KEYS.legacyMuted, String(muted));
}
