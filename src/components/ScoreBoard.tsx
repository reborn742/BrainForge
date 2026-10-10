import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Target, Flame, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { RoundResult, GameMode } from '../types/game';

interface ScoreBoardProps {
  result: RoundResult;
  onNextStage: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
  hasNextStage: boolean;
  isHighScore: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  result,
  onNextStage,
  onRetry,
  onBackToMenu,
  hasNextStage,
  isHighScore,
}) => {
  // Fire celebration confetti if high performance, with an explosive cannon burst on 100% accuracy
  useEffect(() => {
    if (result.accuracyPercent === 100) {
      try {
        // High-velocity dual blast for 100% perfect recall
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fbbf24', '#f59e0b', '#10b981'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#38bdf8', '#818cf8', '#f472b6'],
          });
        }, 200);
      } catch {
        // Safe fallback
      }
    } else if (result.grade === 'S+' || result.grade === 'S' || result.accuracyPercent >= 80) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result.grade, result.accuracyPercent]);

  const getGradeColor = (grade: RoundResult['grade']) => {
    switch (grade) {
      case 'S+':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'S':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'A':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'B':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'C':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl mt-6">
      
      {/* Header with Grade & Score */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-5 sm:pb-6 border-b border-slate-800 gap-4 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Round Complete
            </span>
            {isHighScore && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Trophy className="w-3 h-3" />
                New Best!
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {result.totalScore.toLocaleString()}{' '}
            <span className="text-xs sm:text-sm font-normal text-slate-400">PTS</span>
          </h2>
        </div>

        {/* Grade Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-400">Performance</div>
            <div className="text-sm font-bold text-slate-200">
              {result.accuracyPercent >= 90 ? 'Eidetic Master' : result.accuracyPercent >= 70 ? 'Sharp Recall' : 'Keep Practicing'}
            </div>
          </div>
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-display font-black text-xl sm:text-2xl shadow-lg ${getGradeColor(result.grade)}`}>
            {result.grade}
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-4 sm:py-6">
        
        {/* Accuracy */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] sm:text-xs font-medium mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Accuracy
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-400">
            {result.accuracyPercent}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            {result.exactMatches} of {result.gridSize} perfect
          </div>
        </div>

        {/* Recall Speed */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] sm:text-xs font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Recall Time
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-amber-400">
            {result.recallDuration}s
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            + {result.recallSpeedBonus} speed pts
          </div>
        </div>

        {/* Preview Time Saved */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] sm:text-xs font-medium mb-1">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            Early Bonus
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-sky-400">
            +{result.previewSpeedBonus}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            saved {Math.max(0, result.previewTimeLimit - result.previewTimeUsed).toFixed(1)}s
          </div>
        </div>

        {/* Streak Multiplier */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] sm:text-xs font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Multiplier
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-orange-400">
            {result.streakMultiplier.toFixed(2)}x
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            streak bonus
          </div>
        </div>

      </div>

      {/* Details Table & Scoring Notes */}
      <div className="bg-slate-950/40 rounded-xl p-3 sm:p-3.5 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-slate-800/50 mb-6">
        <div>
          <span className="text-slate-300 font-semibold">Breakdown: </span>
          <span>{result.exactMatches} exact (+{result.exactMatches * 200})</span>
          {result.closeMatches > 0 && <span> · {result.closeMatches} typo (+{result.closeMatches * 160})</span>}
          {result.misplacedMatches > 0 && <span> · {result.misplacedMatches} misplaced (+{result.misplacedMatches * 110})</span>}
        </div>
        <div className="text-slate-400 font-medium">
          Base: {result.baseScore} pts
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
        <button
          onClick={onBackToMenu}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
        >
          Menu & Settings
        </button>

        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/70 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Play Again</span>
        </button>

        {hasNextStage && result.accuracyPercent >= 50 && (
          <button
            onClick={onNextStage}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans text-center"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
