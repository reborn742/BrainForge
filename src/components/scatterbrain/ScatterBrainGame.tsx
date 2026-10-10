import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ScatterDifficulty,
  ScatterGameState,
  ScatterCategory,
  ScatterRoundAnswers,
  ScatterValidationResult,
  ScatterPlayerStats,
  SCATTER_DIFFICULTY_SETTINGS,
  getRandomCategories,
} from '../../types/scatterbrain';
import { validateScatterAnswers } from '../../services/scatterbrainValidator';
import { ResultsView } from './ResultsView';
import { sound } from '../../utils/sound';
import { loadScatterStats, saveScatterStats } from '../../utils/storage';
import { secureRandomInt } from '../../utils/random';
import { MAX_ANSWER_LENGTH } from '../../utils/limits';
import {
  Brain,
  Play,
  Gauge,
  Flame,
  Trophy,
  Activity,
  Hash,
  Sparkles,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPRSTUVW';

interface ScatterBrainGameProps {
  isMuted: boolean;
  onOpenHowToPlay: () => void;
  onBackToHub: () => void;
}

export const ScatterBrainGame: React.FC<ScatterBrainGameProps> = ({
  isMuted,
  onOpenHowToPlay,
  onBackToHub,
}) => {
  const [gameState, setGameState] = useState<ScatterGameState>('lobby');
  const [difficulty, setDifficulty] = useState<ScatterDifficulty>('medium');
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [activeCategories, setActiveCategories] = useState<ScatterCategory[]>([]);
  const [answers, setAnswers] = useState<ScatterRoundAnswers>({});
  const [validationResults, setValidationResults] = useState<ScatterValidationResult[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isQuitConfirmOpen, setIsQuitConfirmOpen] = useState<boolean>(false);

  const [stats, setStats] = useState<ScatterPlayerStats>(loadScatterStats);
  const statsRef = useRef<ScatterPlayerStats>(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);
  // Prevents timer-expiry + Enter + click from submitting (and billing) twice.
  const submitLockRef = useRef(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  // Text-to-speech announcement
  const speak = useCallback(
    (text: string) => {
      if (isMuted || !synthRef.current) return;
      try {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        synthRef.current.speak(utterance);
      } catch {
        // Fallback
      }
    },
    [isMuted]
  );

  // Start new round countdown
  const startRound = useCallback(() => {
    const settings = SCATTER_DIFFICULTY_SETTINGS[difficulty];
    const categories = getRandomCategories(settings.categoryCount, difficulty);
    const letter = ALPHABET[secureRandomInt(ALPHABET.length)];

    submitLockRef.current = false;
    setActiveCategories(categories);
    setCurrentLetter(letter);

    const initialAnswers: ScatterRoundAnswers = {};
    categories.forEach((cat) => {
      initialAnswers[cat.id] = '';
    });
    setAnswers(initialAnswers);

    setTimeLeft(settings.duration);
    setCountdown(3);
    setGameState('countdown');
  }, [difficulty]);

  // Countdown timer loop
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      sound.scatter.playCountdownTick(countdown);
      const timer = setTimeout(() => setCountdown((c) => c - 1), 900);
      return () => clearTimeout(timer);
    } else {
      sound.scatter.playStart();
      setGameState('playing');
      speak(`The letter is ${currentLetter}`);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [gameState, countdown, currentLetter, speak]);

  // Main game timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        sound.scatter.playTimerTick(t <= 6);
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Handle Input Changes
  const handleInputChange = (catId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [catId]: value.slice(0, MAX_ANSWER_LENGTH) }));
  };

  // Submit and evaluate
  const handleFinalSubmit = useCallback(async () => {
    if (gameState !== 'playing' || submitLockRef.current) return;
    submitLockRef.current = true;

    sound.scatter.playSubmit();
    setGameState('evaluating');

    try {
      const results = await validateScatterAnswers(currentLetter, answers, activeCategories);
      setValidationResults(results);

      const roundScore = results.reduce((acc, curr) => acc + curr.score, 0);
      const acceptedCount = results.filter((r) => r.isValid).length;

      const prev = statsRef.current;
      const nextStreak = roundScore > 0 ? prev.currentStreak + 1 : 0;
      const updated: ScatterPlayerStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        totalScore: prev.totalScore + roundScore,
        highScore: Math.max(prev.highScore, roundScore),
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        totalWordsAccepted: prev.totalWordsAccepted + acceptedCount,
      };

      statsRef.current = updated;
      setIsNewHighScore(roundScore > prev.highScore);
      setStats(updated);
      saveScatterStats(updated);

      sound.scatter.playResult(roundScore);
      if (roundScore >= activeCategories.length * 7) {
        sound.scatter.playVictoryFanfare();
      }

      setGameState('results');
    } catch {
      // Never leave the player stuck on the evaluating screen.
      setGameState('lobby');
    } finally {
      submitLockRef.current = false;
    }
  }, [gameState, currentLetter, answers, activeCategories]);

  // Handle keyboard Enter to cycle to next category input
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < activeCategories.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleFinalSubmit();
      }
    }
  };

  // Timer Color logic
  const getTimerColorClass = () => {
    if (timeLeft > 25) return 'text-emerald-400';
    if (timeLeft > 10) return 'text-amber-400';
    return 'text-rose-500 animate-pulse';
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. LOBBY VIEW */}
      {gameState === 'lobby' && (
        <div className="w-full max-w-3xl my-auto animate-fade-in flex flex-col items-center text-center">
          
          {/* Logo badge */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 text-white transform hover:rotate-3 transition-transform">
              <Brain className="w-10 h-10" />
            </div>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            ScatterBrain <span className="text-indigo-400">Word Rush</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-base max-w-lg mb-6 sm:mb-8 leading-relaxed">
            Race against the clock to type words that fit each category and start with the assigned random letter. Powered by smart AI judging!
          </p>

          {/* Player Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-2xl mb-6 sm:mb-8">
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl text-center">
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase flex items-center justify-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5" /> Games
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white">{stats.gamesPlayed}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl text-center">
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase flex items-center justify-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> High Score
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400">{stats.highScore}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl text-center">
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase flex items-center justify-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Words Found
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                {stats.totalWordsAccepted}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl text-center">
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase flex items-center justify-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Streak
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-orange-400">
                {stats.currentStreak}
              </div>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-7 mb-6 sm:mb-8 text-left shadow-xl">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4 text-slate-300">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Select Difficulty</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {(
                Object.entries(SCATTER_DIFFICULTY_SETTINGS) as [
                  ScatterDifficulty,
                  typeof SCATTER_DIFFICULTY_SETTINGS['medium']
                ][]
              ).map(([key, setting]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDifficulty(key)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    difficulty === key
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm sm:text-base text-white">{setting.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 sm:mt-1 font-mono">
                    {setting.duration}s · {setting.categoryCount} Categories
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 sm:mt-1">{setting.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={startRound}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 font-sans"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start ScatterBrain</span>
            </button>

            <button
              onClick={onBackToHub}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer text-center"
            >
              Back to Arena Hub
            </button>
          </div>

        </div>
      )}

      {/* 2. COUNTDOWN OVERLAY */}
      {gameState === 'countdown' && (
        <div className="my-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center animate-fade-in py-12 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Get Ready!
          </span>
          <div className="text-7xl sm:text-9xl font-black text-white font-mono transition-transform duration-300 scale-125">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
          {countdown === 0 && (
            <div className="text-3xl sm:text-5xl font-black text-indigo-400 animate-bounce font-display">
              Letter: {currentLetter}
            </div>
          )}
        </div>
      )}

      {/* 3. PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-28 sm:pb-24">
          
          {/* Top In-Game Bar */}
          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex items-center justify-between backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-display font-black text-xl sm:text-2xl text-indigo-400 shrink-0">
                {currentLetter}
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Target Letter
                </span>
                <div className="text-xs sm:text-sm font-bold text-white">Starts with "{currentLetter}"</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="text-right">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Time Left
                </span>
                <span className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${getTimerColorClass()}`}>
                  {timeLeft}s
                </span>
              </div>

              <button
                onClick={() => setIsQuitConfirmOpen(true)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Quit current round"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Category Input Slots */}
          <div className="space-y-3 sm:space-y-3.5">
            {activeCategories.map((category, idx) => (
              <div
                key={category.id}
                className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                    {category.label}
                  </span>
                </div>

                <div className="relative">
                  <input
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={MAX_ANSWER_LENGTH}
                    value={answers[category.id] || ''}
                    onChange={(e) => handleInputChange(category.id, e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(e, idx)}
                    placeholder={`Type a ${category.label.toLowerCase()} starting with "${currentLetter}"...`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white text-base font-semibold placeholder:text-slate-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:border-indigo-400 focus:bg-slate-900 transition-all font-sans"
                  />
                  {answers[category.id]?.trim() && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {answers[category.id].trim().toUpperCase().startsWith(currentLetter) ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span title="Check starting letter!">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Submit Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 z-30 pb-safe">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Press Enter to cycle next · Auto-validates with AI
              </span>
              <button
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto ml-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans text-center"
              >
                Submit Answers
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. EVALUATING STATE */}
      {gameState === 'evaluating' && (
        <div className="my-auto flex flex-col items-center justify-center space-y-5 text-center animate-fade-in py-20">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full animate-pulse" />
            <div className="w-20 h-20 rounded-3xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 relative z-10 animate-spin">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            AI Judge is Evaluating Your Answers...
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Verifying spelling, checking category taxonomy, and calculating round scores.
          </p>
        </div>
      )}

      {/* 5. RESULTS STATE */}
      {gameState === 'results' && (
        <ResultsView
          letter={currentLetter}
          userAnswers={answers}
          validationResults={validationResults}
          activeCategories={activeCategories}
          onPlayAgain={startRound}
          onReturnToLobby={() => setGameState('lobby')}
          isNewHighScore={isNewHighScore}
          currentStreak={stats.currentStreak}
        />
      )}

      {/* Quit Current Round Confirmation Modal */}
      {isQuitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display mb-2">
              Quit Current Round?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to exit? Your answers for this round will not be saved and your streak will reset.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsQuitConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setIsQuitConfirmOpen(false);
                  setGameState('lobby');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
              >
                Quit to Lobby
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
