import React from 'react';
import { Play, Sparkles, Grid3X3, Clock, Layers } from 'lucide-react';
import { GridSize, ItemCategory } from '../types/game';

interface CustomModeSetupProps {
  gridSize: GridSize;
  onChangeGridSize: (size: GridSize) => void;
  previewSeconds: number;
  onChangePreviewSeconds: (seconds: number) => void;
  category: ItemCategory;
  onChangeCategory: (cat: ItemCategory) => void;
  onStartGame: () => void;
}

export const CustomModeSetup: React.FC<CustomModeSetupProps> = ({
  gridSize,
  onChangeGridSize,
  previewSeconds,
  onChangePreviewSeconds,
  category,
  onChangeCategory,
  onStartGame,
}) => {
  const GRID_SIZES: { size: GridSize; label: string; layout: string }[] = [
    { size: 4, label: '4 Boxes', layout: '2 × 2' },
    { size: 6, label: '6 Boxes', layout: '3 × 2' },
    { size: 8, label: '8 Boxes', layout: '4 × 2' },
    { size: 9, label: '9 Boxes', layout: '3 × 3' },
    { size: 12, label: '12 Boxes', layout: '4 × 3' },
  ];

  const TIME_OPTIONS = [
    { sec: 3, label: '3s (Blitz)' },
    { sec: 5, label: '5s (Fast)' },
    { sec: 7, label: '7s (Standard)' },
    { sec: 10, label: '10s (Relaxed)' },
    { sec: 15, label: '15s (Training)' },
  ];

  const CATEGORIES: { id: ItemCategory; label: string; icon: string; desc: string }[] = [
    { id: 'mixed', label: 'Mixed Diverse Types', icon: '✨', desc: 'Guaranteed mix of animals, food, tools, shapes & numbers' },
    { id: 'objects', label: 'Everyday Objects', icon: '📷', desc: 'Camera, guitar, clock, bicycle, key...' },
    { id: 'animals', label: 'Animals & Nature', icon: '🦁', desc: 'Lion, dolphin, panda, eagle, wolf...' },
    { id: 'food', label: 'Food & Fruit', icon: '🍕', desc: 'Pizza, apple, sushi, burger, donut...' },
    { id: 'colors_shapes', label: 'Colors & Shapes', icon: '⭐', desc: 'Red square, gold star, blue circle...' },
    { id: 'numbers', label: 'Numbers & Digits', icon: '🔢', desc: '12, 42, 77, 108, 256, 777...' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Custom Grid Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure box count, memorization countdown, and items pool.
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        
        {/* 1. Grid Size Picker */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 sm:mb-3">
            <Grid3X3 className="w-4 h-4 text-amber-400" />
            1. Number of Boxes ({gridSize} items)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
            {GRID_SIZES.map((opt) => (
              <button
                key={opt.size}
                type="button"
                onClick={() => onChangeGridSize(opt.size)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  gridSize === opt.size
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-display font-bold text-base sm:text-lg text-white">{opt.label}</div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5">{opt.layout}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Memorization Time Limit */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 sm:mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            2. Preview Time Limit ({previewSeconds}s)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.sec}
                type="button"
                onClick={() => onChangePreviewSeconds(opt.sec)}
                className={`py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                  previewSeconds === opt.sec
                    ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Category Selector */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 sm:mb-3">
            <Layers className="w-4 h-4 text-amber-400" />
            3. Item Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChangeCategory(cat.id)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  category === cat.id
                    ? 'bg-amber-500/15 border-amber-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-xl sm:text-2xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-white truncate">
                    {cat.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                    {cat.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Start Button */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-800 flex justify-end">
        <button
          onClick={onStartGame}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-sans"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Memory Challenge</span>
        </button>
      </div>

    </div>
  );
};
