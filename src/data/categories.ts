import { shuffle } from '../utils/random';
import { GridItem, ItemCategory, ArcadeLevelConfig } from '../types/game';

export const OBJECT_ITEMS: GridItem[] = [
  { id: 'obj-camera', name: 'Camera', category: 'objects', emoji: '📷', color: '#38bdf8' },
  { id: 'obj-guitar', name: 'Guitar', category: 'objects', emoji: '🎸', color: '#fb923c' },
  { id: 'obj-clock', name: 'Clock', category: 'objects', emoji: '⏰', color: '#facc15' },
  { id: 'obj-bicycle', name: 'Bicycle', category: 'objects', emoji: '🚲', color: '#4ade80' },
  { id: 'obj-book', name: 'Book', category: 'objects', emoji: '📖', color: '#a78bfa' },
  { id: 'obj-backpack', name: 'Backpack', category: 'objects', emoji: '🎒', color: '#f43f5e' },
  { id: 'obj-umbrella', name: 'Umbrella', category: 'objects', emoji: '☂️', color: '#2dd4bf' },
  { id: 'obj-telescope', name: 'Telescope', category: 'objects', emoji: '🔭', color: '#60a5fa' },
  { id: 'obj-compass', name: 'Compass', category: 'objects', emoji: '🧭', color: '#fbbf24' },
  { id: 'obj-key', name: 'Key', category: 'objects', emoji: '🔑', color: '#eab308' },
  { id: 'obj-crown', name: 'Crown', category: 'objects', emoji: '👑', color: '#f59e0b' },
  { id: 'obj-lamp', name: 'Lamp', category: 'objects', emoji: '💡', color: '#fde047' },
  { id: 'obj-scissors', name: 'Scissors', category: 'objects', emoji: '✂️', color: '#94a3b8' },
  { id: 'obj-anchor', name: 'Anchor', category: 'objects', emoji: '땪', color: '#0284c7' },
  { id: 'obj-diamond', name: 'Diamond', category: 'objects', emoji: '💎', color: '#38bdf8' },
  { id: 'obj-trophy', name: 'Trophy', category: 'objects', emoji: '🏆', color: '#fbbf24' },
  { id: 'obj-rocket', name: 'Rocket', category: 'objects', emoji: '🚀', color: '#f97316' },
  { id: 'obj-bell', name: 'Bell', category: 'objects', emoji: '🔔', color: '#eab308' },
  { id: 'obj-magnet', name: 'Magnet', category: 'objects', emoji: '🧲', color: '#ef4444' },
  { id: 'obj-microscope', name: 'Microscope', category: 'objects', emoji: '🔬', color: '#06b6d4' },
];

export const ANIMAL_ITEMS: GridItem[] = [
  { id: 'ani-lion', name: 'Lion', category: 'animals', emoji: '🦁', color: '#f59e0b' },
  { id: 'ani-tiger', name: 'Tiger', category: 'animals', emoji: '🐯', color: '#f97316' },
  { id: 'ani-dolphin', name: 'Dolphin', category: 'animals', emoji: '🐬', color: '#38bdf8' },
  { id: 'ani-panda', name: 'Panda', category: 'animals', emoji: '🐼', color: '#e2e8f0' },
  { id: 'ani-eagle', name: 'Eagle', category: 'animals', emoji: '🦅', color: '#b45309' },
  { id: 'ani-elephant', name: 'Elephant', category: 'animals', emoji: '🐘', color: '#94a3b8' },
  { id: 'ani-fox', name: 'Fox', category: 'animals', emoji: '🦊', color: '#ea580c' },
  { id: 'ani-owl', name: 'Owl', category: 'animals', emoji: '🦉', color: '#ca8a04' },
  { id: 'ani-penguin', name: 'Penguin', category: 'animals', emoji: '🐧', color: '#0284c7' },
  { id: 'ani-wolf', name: 'Wolf', category: 'animals', emoji: '🐺', color: '#64748b' },
  { id: 'ani-koala', name: 'Koala', category: 'animals', emoji: '🐨', color: '#cbd5e1' },
  { id: 'ani-giraffe', name: 'Giraffe', category: 'animals', emoji: '🦒', color: '#eab308' },
  { id: 'ani-zebra', name: 'Zebra', category: 'animals', emoji: '🦓', color: '#f8fafc' },
  { id: 'ani-otter', name: 'Otter', category: 'animals', emoji: '🦦', color: '#854d0e' },
  { id: 'ani-kangaroo', name: 'Kangaroo', category: 'animals', emoji: '🦘', color: '#d97706' },
  { id: 'ani-frog', name: 'Frog', category: 'animals', emoji: '🐸', color: '#22c55e' },
  { id: 'ani-whale', name: 'Whale', category: 'animals', emoji: '🐋', color: '#0ea5e9' },
  { id: 'ani-rabbit', name: 'Rabbit', category: 'animals', emoji: '🐰', color: '#fda4af' },
];

export const FOOD_ITEMS: GridItem[] = [
  { id: 'food-apple', name: 'Apple', category: 'food', emoji: '🍎', color: '#ef4444' },
  { id: 'food-pizza', name: 'Pizza', category: 'food', emoji: '🍕', color: '#f59e0b' },
  { id: 'food-burger', name: 'Burger', category: 'food', emoji: '🍔', color: '#b45309' },
  { id: 'food-avocado', name: 'Avocado', category: 'food', emoji: '🥑', color: '#4ade80' },
  { id: 'food-banana', name: 'Banana', category: 'food', emoji: '🍌', color: '#facc15' },
  { id: 'food-cherry', name: 'Cherry', category: 'food', emoji: '🍒', color: '#dc2626' },
  { id: 'food-donut', name: 'Donut', category: 'food', emoji: '🍩', color: '#ec4899' },
  { id: 'food-coffee', name: 'Coffee', category: 'food', emoji: '☕', color: '#78350f' },
  { id: 'food-sushi', name: 'Sushi', category: 'food', emoji: '🍣', color: '#f43f5e' },
  { id: 'food-strawberry', name: 'Strawberry', category: 'food', emoji: '🍓', color: '#e11d48' },
  { id: 'food-cookie', name: 'Cookie', category: 'food', emoji: '🍪', color: '#d97706' },
  { id: 'food-taco', name: 'Taco', category: 'food', emoji: '🌮', color: '#eab308' },
  { id: 'food-pineapple', name: 'Pineapple', category: 'food', emoji: '🍍', color: '#ca8a04' },
  { id: 'food-cheese', name: 'Cheese', category: 'food', emoji: '🧀', color: '#facc15' },
  { id: 'food-croissant', name: 'Croissant', category: 'food', emoji: '🥐', color: '#b45309' },
  { id: 'food-watermelon', name: 'Watermelon', category: 'food', emoji: '🍉', color: '#10b981' },
];

export const COLORS_SHAPES_ITEMS: GridItem[] = [
  { id: 'cs-red-square', name: 'Red Square', category: 'colors_shapes', emoji: '🟥', color: '#ef4444' },
  { id: 'cs-blue-circle', name: 'Blue Circle', category: 'colors_shapes', emoji: '🔵', color: '#3b82f6' },
  { id: 'cs-gold-star', name: 'Gold Star', category: 'colors_shapes', emoji: '⭐', color: '#eab308' },
  { id: 'cs-green-triangle', name: 'Green Triangle', category: 'colors_shapes', emoji: '▲', color: '#22c55e' },
  { id: 'cs-purple-diamond', name: 'Purple Diamond', category: 'colors_shapes', emoji: '🔷', color: '#a855f7' },
  { id: 'cs-orange-hexagon', name: 'Orange Hexagon', category: 'colors_shapes', emoji: '⬢', color: '#f97316' },
  { id: 'cs-pink-heart', name: 'Pink Heart', category: 'colors_shapes', emoji: '💖', color: '#ec4899' },
  { id: 'cs-white-cross', name: 'White Cross', category: 'colors_shapes', emoji: '➕', color: '#f8fafc' },
  { id: 'cs-yellow-sun', name: 'Yellow Sun', category: 'colors_shapes', emoji: '☀️', color: '#facc15' },
  { id: 'cs-teal-ring', name: 'Teal Ring', category: 'colors_shapes', emoji: '⭕', color: '#14b8a6' },
  { id: 'cs-silver-cube', name: 'Silver Cube', category: 'colors_shapes', emoji: '🧊', color: '#94a3b8' },
  { id: 'cs-black-spade', name: 'Black Spade', category: 'colors_shapes', emoji: '♠️', color: '#64748b' },
];

export const NUMBER_ITEMS: GridItem[] = [
  { id: 'num-12', name: '12', category: 'numbers', emoji: '🔢', color: '#38bdf8' },
  { id: 'num-24', name: '24', category: 'numbers', emoji: '🔢', color: '#34d399' },
  { id: 'num-37', name: '37', category: 'numbers', emoji: '🔢', color: '#f472b6' },
  { id: 'num-42', name: '42', category: 'numbers', emoji: '🔢', color: '#fb923c' },
  { id: 'num-58', name: '58', category: 'numbers', emoji: '🔢', color: '#a78bfa' },
  { id: 'num-64', name: '64', category: 'numbers', emoji: '🔢', color: '#facc15' },
  { id: 'num-77', name: '77', category: 'numbers', emoji: '🔢', color: '#2dd4bf' },
  { id: 'num-89', name: '89', category: 'numbers', emoji: '🔢', color: '#f87171' },
  { id: 'num-95', name: '95', category: 'numbers', emoji: '🔢', color: '#818cf8' },
  { id: 'num-108', name: '108', category: 'numbers', emoji: '🔢', color: '#fbbf24' },
  { id: 'num-256', name: '256', category: 'numbers', emoji: '🔢', color: '#4ade80' },
  { id: 'num-314', name: '314', category: 'numbers', emoji: '🔢', color: '#c084fc' },
  { id: 'num-500', name: '500', category: 'numbers', emoji: '🔢', color: '#38bdf8' },
  { id: 'num-777', name: '777', category: 'numbers', emoji: '🔢', color: '#f59e0b' },
  { id: 'num-999', name: '999', category: 'numbers', emoji: '🔢', color: '#e11d48' },
];

export const ARCADE_LEVELS: ArcadeLevelConfig[] = [
  {
    level: 1,
    gridSize: 4,
    previewSeconds: 6,
    category: 'mixed',
    title: 'Stage 1: Diverse Quad',
    description: '4 totally different items (animal, food, object, shape). Warm up your memory buffer.'
  },
  {
    level: 2,
    gridSize: 4,
    previewSeconds: 4.5,
    category: 'mixed',
    title: 'Stage 2: Rapid Prism',
    description: '4 mixed items with faster 4.5s countdown. Focus your spatial gaze.'
  },
  {
    level: 3,
    gridSize: 6,
    previewSeconds: 7,
    category: 'mixed',
    title: 'Stage 3: Hexa Mosaic',
    description: '6 distinct mixed items across multiple categories. Form a mental journey.'
  },
  {
    level: 4,
    gridSize: 6,
    previewSeconds: 5.5,
    category: 'mixed',
    title: 'Stage 4: Rapid Crossfire',
    description: '6 mixed items with a tight 5.5s countdown. Test your instant recall.'
  },
  {
    level: 5,
    gridSize: 8,
    previewSeconds: 8,
    category: 'mixed',
    title: 'Stage 5: Octo Spectrum',
    description: '8 boxes with animals, tools, foods, and shapes across two balanced rows.'
  },
  {
    level: 6,
    gridSize: 8,
    previewSeconds: 6.5,
    category: 'mixed',
    title: 'Stage 6: Sensory Overdrive',
    description: '8 assorted items, rapid 6.5s limit. Pure working memory agility.'
  },
  {
    level: 7,
    gridSize: 9,
    previewSeconds: 8.5,
    category: 'mixed',
    title: 'Stage 7: Matrix Enigma',
    description: '3x3 grid (9 mixed boxes). Remember both distinct identities and positions.'
  },
  {
    level: 8,
    gridSize: 9,
    previewSeconds: 7,
    category: 'mixed',
    title: 'Stage 8: Precision Recall',
    description: '9 distinct items, tight 7.0s timer. Every fraction of a second counts.'
  },
  {
    level: 9,
    gridSize: 12,
    previewSeconds: 10,
    category: 'mixed',
    title: 'Stage 9: Grandmaster Vault',
    description: '12 boxes (4x3) across animals, objects, shapes, numbers, and foods.'
  },
  {
    level: 10,
    gridSize: 12,
    previewSeconds: 8,
    category: 'mixed',
    title: 'Stage 10: Eidetic Summit',
    description: 'The ultimate memory trial. 12 diverse boxes, 8 seconds.'
  }
];

// Helper to shuffle an array
function shuffleArray<T>(arr: T[]): T[] {
  return shuffle(arr);
}

// Guaranteed mixed heterogeneous item picker so NO round is ever 4 foods or 4 animals
export function getDiverseMixedItems(count: number): GridItem[] {
  const pools = [
    shuffleArray(OBJECT_ITEMS),
    shuffleArray(ANIMAL_ITEMS),
    shuffleArray(FOOD_ITEMS),
    shuffleArray(COLORS_SHAPES_ITEMS),
    shuffleArray(NUMBER_ITEMS),
  ];

  // Randomize pool order so first picks vary
  const poolOrder = shuffleArray([0, 1, 2, 3, 4]);
  const selected: GridItem[] = [];
  const poolPointers = [0, 0, 0, 0, 0];

  // Round-robin pick from different pools to guarantee maximum category diversity
  let orderIndex = 0;
  while (selected.length < count) {
    const poolIdx = poolOrder[orderIndex % poolOrder.length];
    const currentPool = pools[poolIdx];
    const ptr = poolPointers[poolIdx];

    if (ptr < currentPool.length) {
      selected.push(currentPool[ptr]);
      poolPointers[poolIdx] = ptr + 1;
    }
    orderIndex++;
  }

  // Shuffle the final selected items so the grid slots are randomly mixed
  return shuffleArray(selected);
}

export function getRandomItems(category: ItemCategory, count: number): GridItem[] {
  if (category === 'mixed') {
    return getDiverseMixedItems(count);
  }

  let pool: GridItem[] = [];
  switch (category) {
    case 'objects':
      pool = [...OBJECT_ITEMS];
      break;
    case 'animals':
      pool = [...ANIMAL_ITEMS];
      break;
    case 'food':
      pool = [...FOOD_ITEMS];
      break;
    case 'colors_shapes':
      pool = [...COLORS_SHAPES_ITEMS];
      break;
    case 'numbers':
      pool = [...NUMBER_ITEMS];
      break;
    default:
      return getDiverseMixedItems(count);
  }

  return shuffleArray(pool).slice(0, count);
}
