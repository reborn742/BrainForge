import React from 'react';
import { Brain, Zap, Trophy, Flame, Play, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { ScatterPlayerStats } from '../types/scatterbrain';

interface HubViewProps {
  onSelectGame: (game: 'flashrecall' | 'scatterbrain') => void;
  flashStats: PlayerStats;
  scatterStats: ScatterPlayerStats;
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
}

export const HubView: React.FC<HubViewProps> = ({
  onSelectGame,
  flashStats,
  scatterStats,
  onOpenStats,
  onOpenHowToPlay,
}) => {
  const totalCombinedGames = flashStats.gamesPlayed + scatterStats.gamesPlayed;
  const brainForgeLevel = Math.max(1, Math.floor(totalCombinedGames / 3) + 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3.5 sm:space-y-4 max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>BrainForge Arena</span>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400">Level {brainForgeLevel} Mind</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Forge Your Working Memory & Word Velocity
        </h1>

        <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
          Two premier cognitive training challenges built to test your perceptual recall, spatial mapping, and rapid-fire verbal agility.
        </p>
      </div>

      {/* Game Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Game 1: FlashRecall */}
        <div className="group relative bg-slate-900/80 hover:bg-slate-900/95 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl sm:text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="text-right">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                  Visual Buffer
                </span>
                <span className="text-xs font-bold text-amber-400">4 to 12 Boxes</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                FlashRecall
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Memorize dynamic item grids before they disappear, then type each item back into its slot under countdown pressure.
              </p>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">High Score</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-400">
                  {flashStats.highScore.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">Best Acc.</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                  {flashStats.bestAccuracy}%
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">Stage</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white">
                  Lvl {flashStats.highestArcadeLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 sm:pt-6">
            <button
              onClick={() => onSelectGame('flashrecall')}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-sans"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play FlashRecall</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>

        {/* Game 2: ScatterBrain */}
        <div className="group relative bg-slate-900/80 hover:bg-slate-900/95 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 sm:p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                🧠
              </div>
              <div className="text-right">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                  Verbal Rush
                </span>
                <span className="text-xs font-bold text-indigo-400">AI Judged</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-indigo-300 transition-colors">
                ScatterBrain
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                A random letter is given. Race against the timer to type words matching each category, validated instantly by AI.
              </p>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">High Score</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400">
                  {scatterStats.highScore}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">Words Found</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-purple-400">
                  {scatterStats.totalWordsAccepted}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">Streak</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-orange-400">
                  {scatterStats.currentStreak}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 sm:pt-6">
            <button
              onClick={() => onSelectGame('scatterbrain')}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-sans"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play ScatterBrain</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>

      </div>

      {/* Arena Badges / Highlights */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Combined BrainForge Record</h3>
            <p className="text-xs text-slate-400">
              {totalCombinedGames} sessions played across both memory and verbal speed modes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenStats}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Lifetime Stats
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            How to Play
          </button>
        </div>
      </div>

    </div>
  );
};
