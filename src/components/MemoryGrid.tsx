import { MAX_ANSWER_LENGTH } from '../utils/limits';
import React, { useRef, useEffect } from 'react';
import { Check, X, AlertTriangle, ArrowRightLeft, HelpCircle } from 'lucide-react';
import { GridItem, GridSize, GamePhase, SlotEvaluation } from '../types/game';

interface MemoryGridProps {
  phase: GamePhase;
  gridSize: GridSize;
  items: GridItem[];
  userInputs: string[];
  evaluations: SlotEvaluation[];
  onInputChange: (index: number, value: string) => void;
  onSubmit: () => void;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({
  phase,
  gridSize,
  items,
  userInputs,
  evaluations,
  onInputChange,
  onSubmit,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty input when entering recall phase
  useEffect(() => {
    if (phase === 'recall') {
      const firstEmptyIndex = userInputs.findIndex((val) => !val.trim());
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      setTimeout(() => {
        inputRefs.current[targetIndex]?.focus();
      }, 50);
    }
  }, [phase]);

  // Determine grid column layout based on item count
  const getGridColsClass = () => {
    switch (gridSize) {
      case 4:
        return 'grid-cols-2 max-w-xl';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 max-w-3xl';
      case 8:
        return 'grid-cols-2 sm:grid-cols-4 max-w-4xl';
      case 9:
        return 'grid-cols-2 sm:grid-cols-3 max-w-3xl';
      case 12:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-4xl';
      default:
        return 'grid-cols-2 sm:grid-cols-3 max-w-3xl';
    }
  };

  // Keyboard navigation across boxes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    const isSm = typeof window !== 'undefined' ? window.innerWidth >= 640 : true;
    const isMd = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    const cols =
      gridSize === 4
        ? 2
        : gridSize === 9
        ? (isSm ? 3 : 2)
        : gridSize === 6
        ? (isSm ? 3 : 2)
        : gridSize === 8
        ? (isSm ? 4 : 2)
        : gridSize === 12
        ? (isMd ? 4 : isSm ? 3 : 2)
        : 2;

    if (e.key === 'Enter') {
      e.preventDefault();
      // If last item or all filled, submit
      const allFilled = userInputs.every((v, idx) => idx === currentIndex ? !!e.currentTarget.value.trim() : !!v.trim());
      if (allFilled || currentIndex === gridSize - 1) {
        onSubmit();
      } else {
        nextIndex = (currentIndex + 1) % gridSize;
      }
    } else if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % gridSize;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + gridSize) % gridSize;
    } else if (e.key === 'ArrowDown') {
      if (currentIndex + cols < gridSize) {
        nextIndex = currentIndex + cols;
      }
    } else if (e.key === 'ArrowUp') {
      if (currentIndex - cols >= 0) {
        nextIndex = currentIndex - cols;
      }
    }

    if (nextIndex !== null && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`w-full mx-auto grid gap-2.5 sm:gap-4 ${getGridColsClass()}`}>
      {items.map((item, index) => {
        const userInput = userInputs[index] || '';
        const evaluation = evaluations[index];

        return (
          <div
            key={item.id || index}
            className={`relative rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center min-h-[125px] sm:min-h-[160px] p-2.5 sm:p-4 text-center overflow-hidden ${
              phase === 'preview'
                ? 'bg-slate-900/90 border-slate-700/80 shadow-lg shadow-black/40 hover:border-amber-500/50 hover:bg-slate-800/80'
                : phase === 'recall'
                ? 'bg-slate-900/70 border-slate-800 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
                : evaluation?.matchType === 'exact'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                : evaluation?.matchType === 'close'
                ? 'bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-950/50'
                : evaluation?.matchType === 'misplaced'
                ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/50'
                : 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            }`}
          >
            {/* Box Position Badge */}
            <div className="absolute top-2 left-2.5 sm:top-2.5 sm:left-3 flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                #{index + 1}
              </span>
            </div>

            {/* Content per phase */}

            {/* 1. PREVIEW PHASE: Show distinct item & clear word */}
            {phase === 'preview' && (
              <div className="flex flex-col items-center justify-center animate-fade-in select-none w-full px-1">
                <span className="text-3xl sm:text-5xl mb-1 sm:mb-2 filter drop-shadow-md transform transition-transform hover:scale-110">
                  {item.emoji}
                </span>
                <span className="font-display font-bold text-base sm:text-xl text-white tracking-tight break-words max-w-full">
                  {item.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 capitalize mt-0.5 truncate max-w-full">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* 2. RECALL PHASE: Input field for remembering this box */}
            {phase === 'recall' && (
              <div className="w-full flex flex-col items-center justify-center pt-1.5 sm:pt-2 px-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-2 sm:mb-3 text-base sm:text-lg font-mono">
                  ?
                </div>
                <div className="w-full max-w-[200px]">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={MAX_ANSWER_LENGTH}
                    value={userInput}
                    onChange={(e) => onInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="Type item..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-center text-sm sm:text-base font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-slate-900 transition-all font-sans"
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 sm:mt-2 font-mono">
                  Tab / Enter for next
                </span>
              </div>
            )}

            {/* 3. EVALUATION / RESULTS PHASE: Comparison card */}
            {(phase === 'evaluating' || phase === 'results') && evaluation && (
              <div className="w-full flex flex-col items-center justify-center pt-1 sm:pt-2 px-1 animate-fade-in">
                {/* Visual actual emoji */}
                <span className="text-2xl sm:text-4xl mb-0.5 sm:mb-1 filter drop-shadow-sm">
                  {item.emoji}
                </span>

                {/* Actual word */}
                <div className="font-display font-bold text-sm sm:text-lg text-white break-words max-w-full">
                  {item.name}
                </div>

                {/* User input display */}
                <div className="mt-1 text-[11px] sm:text-xs font-medium text-slate-300 flex flex-wrap items-center justify-center gap-1">
                  <span className="text-slate-400">Typed:</span>
                  <span
                    className={`font-semibold px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs truncate max-w-[120px] sm:max-w-[180px] ${
                      evaluation.matchType === 'exact'
                        ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/50'
                        : evaluation.matchType === 'close'
                        ? 'text-sky-300 bg-sky-950/60 border border-sky-800/50'
                        : evaluation.matchType === 'misplaced'
                        ? 'text-amber-300 bg-amber-950/60 border border-amber-800/50'
                        : 'text-rose-300 bg-rose-950/60 border border-rose-800/50'
                    }`}
                  >
                    {evaluation.userInput || '(blank)'}
                  </span>
                </div>

                {/* Match Status Tag */}
                <div className="mt-1.5 sm:mt-2.5">
                  {evaluation.matchType === 'exact' && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      Exact +{evaluation.score}
                    </span>
                  )}
                  {evaluation.matchType === 'close' && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-sky-500/30" title="Close spelling!">
                      <AlertTriangle className="w-3 h-3" />
                      Close +{evaluation.score}
                    </span>
                  )}
                  {evaluation.matchType === 'misplaced' && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-500/30"
                      title={`Belongs in Box #${(evaluation.misplacedTargetIndex ?? 0) + 1}`}
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Box #{(evaluation.misplacedTargetIndex ?? 0) + 1} +{evaluation.score}
                    </span>
                  )}
                  {evaluation.matchType === 'missed' && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-rose-500/30">
                      <X className="w-3 h-3" />
                      Missed (0)
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};
