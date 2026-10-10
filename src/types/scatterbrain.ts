import { shuffle } from '../utils/random';

export type ScatterGameState = 'lobby' | 'countdown' | 'playing' | 'evaluating' | 'results';

export type ScatterDifficulty = 'easy' | 'medium' | 'hard';

export interface ScatterDifficultySetting {
  id: ScatterDifficulty;
  label: string;
  duration: number;
  categoryCount: number;
  description: string;
  color: string;
}

export const SCATTER_DIFFICULTY_SETTINGS: Record<ScatterDifficulty, ScatterDifficultySetting> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    duration: 90,
    categoryCount: 4,
    description: 'Relaxed 90s timer, everyday categories',
    color: 'bg-emerald-500',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    duration: 60,
    categoryCount: 5,
    description: 'Standard 60s timer, mixed categories',
    color: 'bg-indigo-500',
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    duration: 45,
    categoryCount: 6,
    description: 'Blitz 45s timer, challenging categories',
    color: 'bg-rose-500',
  },
};

export interface ScatterCategory {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  difficulty: ScatterDifficulty;
}

export interface ScatterRoundAnswers {
  [categoryId: string]: string;
}

export interface ScatterValidationResult {
  categoryId: string;
  isValid: boolean;
  score: number;
  message: string;
  correctedSpelling?: string | null;
  correctAnswer?: string | null;
}

export interface ScatterPlayerStats {
  gamesPlayed: number;
  totalScore: number;
  highScore: number;
  currentStreak: number;
  bestStreak: number;
  totalWordsAccepted: number;
}

export const CATEGORY_POOL: ScatterCategory[] = [
  // Easy
  { id: 'country', label: 'Country', icon: '🌍', placeholder: 'Name a nation', difficulty: 'easy' },
  { id: 'animal', label: 'Animal', icon: '🦁', placeholder: 'Name a wild creature', difficulty: 'easy' },
  { id: 'fruit', label: 'Fruit', icon: '🍎', placeholder: 'Pick a tasty fruit', difficulty: 'easy' },
  { id: 'color', label: 'Color', icon: '🎨', placeholder: 'Find a vivid hue', difficulty: 'easy' },
  { id: 'body_part', label: 'Body Part', icon: '👀', placeholder: 'List a body part', difficulty: 'easy' },
  { id: 'sport', label: 'Sport', icon: '⚽', placeholder: 'Name a sport or game', difficulty: 'easy' },
  { id: 'food', label: 'Food or Dish', icon: '🍕', placeholder: 'Name a food or dish', difficulty: 'easy' },

  // Medium
  { id: 'vegetable', label: 'Vegetable', icon: '🥦', placeholder: 'Pick a fresh vegetable', difficulty: 'medium' },
  { id: 'flower', label: 'Flower', icon: '🌸', placeholder: 'Name a beautiful bloom', difficulty: 'medium' },
  { id: 'profession', label: 'Job/Profession', icon: '💼', placeholder: 'Enter a job title', difficulty: 'medium' },
  { id: 'instrument', label: 'Musical Instrument', icon: '🎸', placeholder: 'Name an instrument', difficulty: 'medium' },
  { id: 'bird', label: 'Bird', icon: '🦜', placeholder: 'Name a feathered creature', difficulty: 'medium' },
  { id: 'clothing', label: 'Clothing Item', icon: '👕', placeholder: 'Article of clothing', difficulty: 'medium' },

  // Hard
  { id: 'capital', label: 'Capital City', icon: '🏛️', placeholder: 'Name a world capital', difficulty: 'hard' },
  { id: 'element', label: 'Chemical Element', icon: '⚗️', placeholder: 'Periodic element', difficulty: 'hard' },
  { id: 'famous_person', label: 'Famous Person', icon: '👤', placeholder: 'Name a celebrity or icon', difficulty: 'hard' },
  { id: 'river', label: 'River or Sea', icon: '🌊', placeholder: 'Name a major body of water', difficulty: 'hard' },
  { id: 'videogame', label: 'Video Game', icon: '🎮', placeholder: 'Title of a video game', difficulty: 'hard' },
];

export const getRandomCategories = (count: number, difficulty: ScatterDifficulty): ScatterCategory[] => {
  let pool = CATEGORY_POOL;
  if (difficulty === 'easy') {
    pool = CATEGORY_POOL.filter((c) => c.difficulty === 'easy');
  } else if (difficulty === 'medium') {
    pool = CATEGORY_POOL.filter((c) => c.difficulty === 'easy' || c.difficulty === 'medium');
  }

  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
