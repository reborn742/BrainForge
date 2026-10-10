import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, ArrowRight, Trophy, Flame } from 'lucide-react';
import { ScatterCategory, ScatterRoundAnswers, ScatterValidationResult } from '../../types/scatterbrain';

interface ResultsViewProps {
  letter: string;
  userAnswers: ScatterRoundAnswers;
  validationResults: ScatterValidationResult[];
  activeCategories: ScatterCategory[];
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
  isNewHighScore?: boolean;
  currentStreak: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  letter,
  userAnswers,
  validationResults,
  activeCategories,
  onPlayAgain,
  onReturnToLobby,
  isNewHighScore,
  currentStreak,
}) => {
  const totalScore = validationResults.reduce((acc, curr) => acc + curr.score, 0);
  const maxScore = activeCategories.length * 10;
  const isPerfect = totalScore === maxScore && maxScore > 0;
  const [displayedScore, setDisplayedScore] = useState(0);

  // Animate score counting up
  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = totalScore;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalScore]);

  // Confetti trigger
  useEffect(() => {
    if (isNewHighScore || isPerfect) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
        });
        if (isPerfect) {
          setTimeout(() => {
            confetti({
              particleCount: 60,
              angle: 60,
              spread: 60,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 60,
              angle: 120,
              spread: 60,
              origin: { x: 1 },
            });
          }, 250);
        }
      } catch {
        // Fallback
      }
    }
  }, [isNewHighScore, isPerfect]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Score Summary Box */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          {isNewHighScore && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 animate-pulse">
              <Trophy className="w-3.5 h-3.5" />
              New Personal Best!
            </span>
          )}
          {currentStreak > 1 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/40">
              <Flame className="w-3.5 h-3.5" />
              Streak x{currentStreak}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
            Target Letter: <span className="text-indigo-400 font-bold text-sm">"{letter}"</span>
          </span>
          <div className="text-5xl sm:text-6xl font-black text-indigo-400 drop-shadow-lg font-mono tabular-nums">
            {displayedScore}
            <span className="text-xl sm:text-2xl text-slate-500 font-normal">/{maxScore}</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 font-medium px-2">
            {isPerfect
              ? '🔥 Flawless Victory! Every category accepted!'
              : totalScore >= maxScore * 0.7
              ? '⚡ Sharp reflexes! Great word association!'
              : 'Keep pushing your vocabulary speed!'}
          </span>
        </div>
      </div>

      {/* Categorized Breakdown */}
      <div className="space-y-2.5 sm:space-y-3">
        {activeCategories.map((category) => {
          const answer = userAnswers[category.id];
          const rawResult = validationResults.find((r) => r.categoryId === category.id);

          const result = rawResult || {
            categoryId: category.id,
            isValid: false,
            score: 0,
            message: answer
              ? "Hmm, couldn't quite verify this answer!"
              : "Mind went blank? It happens to the best of us!",
            correctAnswer: null,
            correctedSpelling: null,
          };

          const isExact = result.score === 10;
          const isSpellingPartial = result.score > 0 && result.score < 10;
          const isInvalid = result.score === 0;

          return (
            <div
              key={category.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isExact
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm'
                  : isSpellingPartial
                  ? 'bg-amber-950/30 border-amber-500/40 shadow-sm'
                  : 'bg-rose-950/30 border-rose-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="mt-1 shrink-0">
                  {isExact ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  ) : isSpellingPartial ? (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-base sm:text-lg">{category.icon}</span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-200">{category.label}</h3>
                  </div>

                  <div className="text-sm sm:text-base font-semibold text-white break-words">
                    {answer || <span className="text-slate-500 italic text-xs sm:text-sm">(Blank)</span>}
                  </div>

                  {result.correctedSpelling && (
                    <p className="text-amber-300 text-[11px] sm:text-xs flex items-center gap-1.5 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Spelling correction: <strong className="text-amber-200">{result.correctedSpelling}</strong>
                        {result.score < 10 && result.score > 0 && (
                          <span className="text-amber-400 font-semibold ml-1">
                            ({result.score}/10 pts considering spelling)
                          </span>
                        )}
                      </span>
                    </p>
                  )}

                  {!result.isValid && result.correctAnswer && (
                    <p className="text-indigo-300 text-[11px] sm:text-xs flex items-center gap-1.5 mt-1.5 font-medium bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-500/20 w-fit">
                      <span className="text-slate-400 font-normal">Correct answer:</span>
                      <strong className="text-indigo-200 font-bold">{result.correctAnswer}</strong>
                    </p>
                  )}

                  <p
                    className={`mt-1 text-[11px] sm:text-xs ${
                      isExact
                        ? 'text-emerald-300/80'
                        : isSpellingPartial
                        ? 'text-amber-300/80'
                        : 'text-rose-300/80'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-base sm:text-lg font-mono font-bold ${
                      isExact
                        ? 'text-emerald-400'
                        : isSpellingPartial
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    +{result.score}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pb-8">
        <button
          onClick={onReturnToLobby}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Change Difficulty / Lobby</span>
        </button>

        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-bold shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
        >
          <span>Play Next Letter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
