import { randomId } from './random';
import { MAX_ANSWER_LENGTH } from './limits';
import { GridItem, SlotEvaluation, RoundResult, GridSize, GameMode } from '../types/game';

// Compute Levenshtein distance for typo forgiveness
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.trim().toLowerCase().slice(0, MAX_ANSWER_LENGTH);
  const s2 = b.trim().toLowerCase().slice(0, MAX_ANSWER_LENGTH);
  const dp: number[][] = Array.from({ length: s1.length + 1 }, () =>
    Array(s2.length + 1).fill(0)
  );

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[s1.length][s2.length];
}

export function normalizeText(text: string): string {
  return text.slice(0, 200).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function calculateStreakMultiplier(streak: number): number {
  const rawMultiplier = 1.0 + Math.min(6, Math.max(0, streak)) * 0.15;
  return Math.round(rawMultiplier * 100) / 100;
}

export function evaluateRound(
  items: GridItem[],
  userInputs: string[],
  options: {
    mode: GameMode;
    level: number;
    gridSize: GridSize;
    previewTimeLimit: number;
    previewTimeUsed: number;
    recallDuration: number;
    streak: number;
  }
): RoundResult {
  const evaluations: SlotEvaluation[] = [];
  const claimedActualIndices = new Set<number>();

  const BASE_EXACT_POINTS = 200;
  const BASE_CLOSE_POINTS = 160;
  const BASE_MISPLACED_POINTS = 110;

  let exactMatches = 0;
  let closeMatches = 0;
  let misplacedMatches = 0;
  let baseScore = 0;

  // Pass 1: Check exact or close matches in the same slot
  items.forEach((item, slotIndex) => {
    const rawInput = userInputs[slotIndex] || '';
    const normInput = normalizeText(rawInput);
    const normActual = normalizeText(item.name);

    if (!normInput) {
      evaluations[slotIndex] = {
        slotIndex,
        actualItem: item,
        userInput: rawInput,
        matchType: 'missed',
        score: 0,
      };
      return;
    }

    if (normInput === normActual) {
      claimedActualIndices.add(slotIndex);
      exactMatches++;
      baseScore += BASE_EXACT_POINTS;
      evaluations[slotIndex] = {
        slotIndex,
        actualItem: item,
        userInput: rawInput,
        matchType: 'exact',
        score: BASE_EXACT_POINTS,
      };
      return;
    }

    // Check close typo in same slot (distance <= 1 for 4+ char, or distance <= 2 for 7+ char)
    const dist = levenshteinDistance(normInput, normActual);
    const isClose = (normActual.length >= 4 && dist <= 1) || (normActual.length >= 7 && dist <= 2);

    if (isClose) {
      claimedActualIndices.add(slotIndex);
      closeMatches++;
      baseScore += BASE_CLOSE_POINTS;
      evaluations[slotIndex] = {
        slotIndex,
        actualItem: item,
        userInput: rawInput,
        matchType: 'close',
        score: BASE_CLOSE_POINTS,
      };
      return;
    }

    // Default to missed for now, Pass 2 will evaluate if it belongs elsewhere
    evaluations[slotIndex] = {
      slotIndex,
      actualItem: item,
      userInput: rawInput,
      matchType: 'missed',
      score: 0,
    };
  });

  // Pass 2: Check if inputs that missed this slot matched an item from another slot (misplaced item bonus)
  evaluations.forEach((evalItem, slotIndex) => {
    if (evalItem.matchType !== 'missed') return;

    const rawInput = userInputs[slotIndex] || '';
    const normInput = normalizeText(rawInput);
    if (!normInput) return;

    // Search across other slots
    for (let otherIdx = 0; otherIdx < items.length; otherIdx++) {
      if (otherIdx === slotIndex || claimedActualIndices.has(otherIdx)) continue;

      const normOther = normalizeText(items[otherIdx].name);
      const isExactOther = normInput === normOther;
      const distOther = levenshteinDistance(normInput, normOther);
      const isCloseOther = (normOther.length >= 4 && distOther <= 1) || (normOther.length >= 7 && distOther <= 2);

      if (isExactOther || isCloseOther) {
        claimedActualIndices.add(otherIdx);
        misplacedMatches++;
        baseScore += BASE_MISPLACED_POINTS;
        evalItem.matchType = 'misplaced';
        evalItem.score = BASE_MISPLACED_POINTS;
        evalItem.misplacedTargetIndex = otherIdx;
        break;
      }
    }
  });

  // Calculate Accuracy Percentage
  // Exact = 100%, Close = 80%, Misplaced = 55%
  const maxPossiblePoints = items.length * BASE_EXACT_POINTS;
  const weightedPoints = (exactMatches * 1.0 + closeMatches * 0.8 + misplacedMatches * 0.55) * BASE_EXACT_POINTS;
  const accuracyPercent = Math.round((weightedPoints / maxPossiblePoints) * 100);

  // Preview Speed Bonus: if user finished viewing early
  const previewTimeSaved = Math.max(0, options.previewTimeLimit - options.previewTimeUsed);
  const previewSpeedBonus = Math.round(previewTimeSaved * 40); // 40 pts per second saved

  // Recall Speed Bonus: par time = 3.5 seconds per item
  const parRecallTime = items.length * 3.5;
  let recallSpeedBonus = 0;
  if (options.recallDuration < parRecallTime && (exactMatches + closeMatches + misplacedMatches) > 0) {
    const timeAhead = parRecallTime - options.recallDuration;
    // Scale speed bonus with accuracy so users don't get points just for hitting submit instantly on blank inputs
    const accuracyFactor = weightedPoints / maxPossiblePoints;
    recallSpeedBonus = Math.round((timeAhead / parRecallTime) * 450 * accuracyFactor);
  }

  // Streak Multiplier: streak increases by 0.15 per consecutive successful round up to 2.0x
  const rawMultiplier = 1.0 + Math.min(6, Math.max(0, options.streak)) * 0.15;
  const streakMultiplier = Math.round(rawMultiplier * 100) / 100;

  const totalScore = Math.round((baseScore + previewSpeedBonus + recallSpeedBonus) * streakMultiplier);

  // Determine Letter Grade
  let grade: RoundResult['grade'] = 'D';
  if (accuracyPercent >= 98 && recallSpeedBonus > 150) {
    grade = 'S+';
  } else if (accuracyPercent >= 90) {
    grade = 'S';
  } else if (accuracyPercent >= 75) {
    grade = 'A';
  } else if (accuracyPercent >= 55) {
    grade = 'B';
  } else if (accuracyPercent >= 35) {
    grade = 'C';
  } else {
    grade = 'D';
  }

  return {
    roundId: randomId(),
    mode: options.mode,
    level: options.level,
    gridSize: options.gridSize,
    evaluations,
    accuracyPercent,
    exactMatches,
    closeMatches,
    misplacedMatches,
    baseScore,
    previewSpeedBonus,
    recallSpeedBonus,
    streakMultiplier,
    totalScore,
    previewTimeLimit: options.previewTimeLimit,
    previewTimeUsed: Math.round(options.previewTimeUsed * 10) / 10,
    recallDuration: Math.round(options.recallDuration * 10) / 10,
    grade,
  };
}
