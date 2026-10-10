import React, { useState } from 'react';
import { X, Eye, Zap, Award, CheckCircle2, ArrowRightLeft, Sparkles, Brain, Check, Clock } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'flashrecall' | 'scatterbrain';
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'flashrecall',
}) => {
  const [tab, setTab] = useState<'flashrecall' | 'scatterbrain'>(defaultTab);

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

        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pr-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">BrainForge Rules & Mechanics</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Master guide for both training arenas</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => setTab('flashrecall')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'flashrecall'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>FlashRecall</span>
          </button>

          <button
            onClick={() => setTab('scatterbrain')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'scatterbrain'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>ScatterBrain</span>
          </button>
        </div>

        {/* TAB 1: FlashRecall */}
        {tab === 'flashrecall' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Memorize the Grid
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Items appear in 4, 6, 8, 9, or 12 numbered boxes. Commit each item and its slot position to memory before the preview expires.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Items Vanish & Early Skip Bonus
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Boxes become blank input slots. Click <strong className="text-amber-300">"Ready Now"</strong> early if you're done memorizing to claim early speed bonus points!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Type & Recall
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Type what was in each box. Exact slot match earns <strong className="text-emerald-400">+200 pts</strong>, close typos earn <strong className="text-sky-400">+160 pts</strong>, and right item in another box earns <strong className="text-amber-400">+110 pts</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ScatterBrain */}
        {tab === 'scatterbrain' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Beat the Clock
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A target letter (A-Z) is randomly chosen. You must enter a word starting with that exact letter for each category before time expires.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  AI Validation & Scoring
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our smart AI judge verifies your answers: <strong className="text-emerald-400">+10 pts</strong> for valid answers matching category and letter. Minor phonetic misspellings are forgivingly accepted!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  Difficulty Levels
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose Easy (90s, 4 categories), Medium (60s, 5 categories), or Hard (45s, 6 categories). Build your win streak!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer font-sans"
          >
            Ready to Play
          </button>
        </div>

      </div>
    </div>
  );
};
