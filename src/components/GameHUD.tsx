import React from 'react';
import { Timer, Zap, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { GameMode, GamePhase, GridSize } from '../types/game';

interface GameHUDProps {
  phase: GamePhase;
  mode: GameMode;
  level: number;
  stageTitle?: string;
  gridSize: GridSize;
  streak: number;
  currentScore: number;
  // Preview Phase Timer
  previewSecondsLeft: number;
  previewTotalSeconds: number;
  onSkipPreview: () => void;
  // Recall Phase Metrics
  recallElapsedSeconds: number;
  filledCount: number;
  onSubmitRecall: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  phase,
  mode,
  level,
  stageTitle,
  gridSize,
  streak,
  currentScore,
  previewSecondsLeft,
  previewTotalSeconds,
  onSkipPreview,
  recallElapsedSeconds,
  filledCount,
  onSubmitRecall,
}) => {
  const previewProgress = Math.max(0, Math.min(100, (previewSecondsLeft / previewTotalSeconds) * 100));

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Mode / Level info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-display font-bold text-amber-400 text-lg">
            {gridSize}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {mode === 'arcade' ? `Stage ${level}` : mode === 'rush' ? `Rush Round ${level}/3` : 'Custom Match'}
              </span>
              {streak > 0 && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all duration-500 ${
                    streak >= 5
                      ? 'text-rose-300 bg-rose-500/15 border-rose-500/30 animate-pulse'
                      : streak >= 3
                      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                      : 'text-teal-300 bg-teal-500/15 border-teal-500/30'
                  }`}
                >
                  <Flame
                    className={`w-3.5 h-3.5 ${
                      streak >= 5
                        ? 'text-rose-400 fill-rose-400/30'
                        : streak >= 3
                        ? 'text-amber-400 fill-amber-400/30'
                        : 'text-teal-400'
                    }`}
                  />
                  <span>Streak {streak} {streak >= 5 ? '· Blaze' : streak >= 3 ? '· Warming' : '· Rising'}</span>
                </div>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {stageTitle || `${gridSize} Memory Boxes`}
            </h2>
          </div>
        </div>

        {/* Center / Right: Phase-specific interactive control & timer */}
        {phase === 'preview' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:max-w-md md:justify-end">
            <div className="w-full sm:w-44">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <Timer className="w-3.5 h-3.5" />
                  Memorize!
                </span>
                <span className="font-mono tabular-nums font-bold text-white">
                  {previewSecondsLeft.toFixed(1)}s
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 rounded-full ${
                    previewSecondsLeft <= 2 ? 'bg-red-500' : previewSecondsLeft <= 4 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${previewProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={onSkipPreview}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Ready Now (+Bonus)</span>
            </button>
          </div>
        )}

        {phase === 'recall' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:max-w-md md:justify-end">
            <div className="flex items-center justify-between sm:justify-start gap-4 bg-slate-950/40 sm:bg-transparent p-2 sm:p-0 rounded-xl">
              <div className="text-left sm:text-right">
                <span className="block text-[10px] sm:text-[11px] uppercase font-semibold text-slate-400">Recall Time</span>
                <span className="font-mono tabular-nums font-bold text-amber-400 text-sm">
                  {recallElapsedSeconds.toFixed(1)}s
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-right">
                <span className="block text-[10px] sm:text-[11px] uppercase font-semibold text-slate-400">Filled</span>
                <span className="font-mono tabular-nums font-bold text-white text-sm">
                  {filledCount} / {gridSize}
                </span>
              </div>
            </div>

            <button
              onClick={onSubmitRecall}
              className="px-4 py-2.5 sm:py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap font-sans"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Recall</span>
            </button>
          </div>
        )}

        {(phase === 'evaluating' || phase === 'results') && (
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
            <div className="text-left sm:text-right">
              <span className="block text-[10px] sm:text-[11px] uppercase font-semibold text-slate-400">Current Score</span>
              <span className="font-mono tabular-nums font-bold text-amber-400 text-lg">
                {currentScore.toLocaleString()}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
