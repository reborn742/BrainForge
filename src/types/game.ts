export type GameMode = 'arcade' | 'custom' | 'rush';

export type GamePhase = 
  | 'idle'         // Menu / selecting mode
  | 'preview'      // Items visible with countdown
  | 'recall'       // User typing what was in the boxes
  | 'evaluating'   // Calculating results & flipping cards
  | 'results';     // Scorecard & breakdown

export type ItemCategory = 
  | 'mixed'
  | 'objects'
  | 'animals'
  | 'food'
  | 'colors_shapes'
  | 'numbers';

export interface GridItem {
  id: string;
  name: string;
  category: ItemCategory;
  emoji: string;
  hint?: string;
  color?: string;
}

export type GridSize = 4 | 6 | 8 | 9 | 12;

export interface SlotEvaluation {
  slotIndex: number;
  actualItem: GridItem;
  userInput: string;
  matchType: 'exact' | 'close' | 'misplaced' | 'missed';
  score: number;
  misplacedTargetIndex?: number;
}

export interface RoundResult {
  roundId: string;
  mode: GameMode;
  level: number;
  gridSize: GridSize;
  evaluations: SlotEvaluation[];
  accuracyPercent: number;
  exactMatches: number;
  closeMatches: number;
  misplacedMatches: number;
  baseScore: number;
  previewSpeedBonus: number;
  recallSpeedBonus: number;
  streakMultiplier: number;
  totalScore: number;
  previewTimeLimit: number;
  previewTimeUsed: number;
  recallDuration: number;
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface ArcadeLevelConfig {
  level: number;
  gridSize: GridSize;
  previewSeconds: number;
  category: ItemCategory;
  title: string;
  description: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
  highestArcadeLevel: number;
  bestAccuracy: number;
  fastestRecallPerItem: number;
  totalItemsRecalled: number;
  perfectRounds: number;
}
