import React from 'react';
import { Volume2, VolumeX, BarChart3, HelpCircle, Brain, Zap, LayoutGrid } from 'lucide-react';

export type ActiveAppView = 'hub' | 'flashrecall' | 'scatterbrain';

interface HeaderProps {
  activeView: ActiveAppView;
  onSelectView: (view: ActiveAppView) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  isMuted,
  onToggleMute,
  onOpenStats,
  onOpenHowToPlay,
  isPlaying,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-4">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onSelectView('hub')}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group text-left shrink-0"
          title="Return to BrainForge Hub"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10 text-white font-black text-xs sm:text-sm group-hover:scale-105 transition-transform">
            BF
          </div>
          <span className="font-display text-sm sm:text-lg md:text-xl font-bold tracking-tight text-white hidden sm:flex items-center gap-1 sm:gap-1.5">
            BrainForge
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          </span>
        </button>

        {/* Zone 2: Primary Game Switcher Navigation */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 p-0.5 sm:p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => onSelectView('hub')}
            disabled={isPlaying}
            title="BrainForge Arena Hub"
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
              activeView === 'hub'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span><span className="hidden md:inline">Arena </span>Hub</span>
          </button>

          <button
            onClick={() => onSelectView('flashrecall')}
            disabled={isPlaying}
            title="FlashRecall: Working Memory Grid Challenge"
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
              activeView === 'flashrecall'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span><span className="hidden sm:inline">Flash</span>Recall</span>
          </button>

          <button
            onClick={() => onSelectView('scatterbrain')}
            disabled={isPlaying}
            title="ScatterBrain: Fast-Paced Category Word Rush"
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
              activeView === 'scatterbrain'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            <Brain className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span><span className="hidden sm:inline">Scatter</span>Brain</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Affordances */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio & SFX' : 'Mute Audio & SFX'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />}
          </button>

          <button
            onClick={onOpenStats}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
            title="BrainForge Stats & Records"
            aria-label="Statistics"
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
            title="Game Guides & Rules"
            aria-label="Help"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </button>
        </div>

      </div>
    </header>
  );
};
