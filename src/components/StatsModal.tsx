import React, { useState } from 'react';
import { X, Trophy, Target, Zap, Flame, RotateCcw, Award, Brain, Hash } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { ScatterPlayerStats } from '../types/scatterbrain';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashStats: PlayerStats;
  scatterStats: ScatterPlayerStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  flashStats,
  scatterStats,
  onResetStats,
}) => {
  const [activeTab, setActiveTab] = useState<'flash' | 'scatter'>('flash');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 pr-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">BrainForge Records</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Lifetime cognitive statistics</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('flash')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'flash'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>FlashRecall Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('scatter')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'scatter'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>ScatterBrain Stats</span>
          </button>
        </div>

        {/* FlashRecall Stats Tab */}
        {activeTab === 'flash' && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                High Score
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {flashStats.highScore.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Best Accuracy
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {flashStats.bestAccuracy}%
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                Games Played
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {flashStats.gamesPlayed}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Highest Stage
              </div>
              <div className="text-2xl font-black font-mono text-orange-400">
                Stage {flashStats.highestArcadeLevel}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center col-span-2">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Total Items Correctly Recalled
              </div>
              <div className="text-2xl font-black font-mono text-purple-400">
                {flashStats.totalItemsRecalled}
              </div>
            </div>
          </div>
        )}

        {/* ScatterBrain Stats Tab */}
        {activeTab === 'scatter' && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                High Score
              </div>
              <div className="text-2xl font-black font-mono text-indigo-400">
                {scatterStats.highScore}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Current Streak
              </div>
              <div className="text-2xl font-black font-mono text-orange-400">
                {scatterStats.currentStreak}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Hash className="w-3.5 h-3.5 text-sky-400" />
                Games Played
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {scatterStats.gamesPlayed}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Best Streak
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {scatterStats.bestStreak}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-center col-span-2">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                Total Words Accepted
              </div>
              <div className="text-2xl font-black font-mono text-purple-400">
                {scatterStats.totalWordsAccepted}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              if (window.confirm('Reset all lifetime stats and high scores for both games?')) {
                onResetStats();
              }
            }}
            className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Stats</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
