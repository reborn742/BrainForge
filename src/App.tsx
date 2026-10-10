import React, { useState, useEffect, useRef } from 'react';
import { Header, ActiveAppView } from './components/Header';
import { GameHUD } from './components/GameHUD';
import { MemoryGrid } from './components/MemoryGrid';
import { ScoreBoard } from './components/ScoreBoard';
import { CustomModeSetup } from './components/CustomModeSetup';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { AnimatedStreakBackground } from './components/AnimatedStreakBackground';
import { HubView } from './components/HubView';
import { ScatterBrainGame } from './components/scatterbrain/ScatterBrainGame';
import { ARCADE_LEVELS, getRandomItems } from './data/categories';
import { sound } from './utils/sound';
import {
  DEFAULT_FLASH_STATS,
  DEFAULT_SCATTER_STATS,
  clearAllStats,
  loadFlashStats,
  loadScatterStats,
  saveFlashStats,
} from './utils/storage';
import { evaluateRound } from './utils/scoring';
import {
  GameMode,
  GamePhase,
  GridSize,
  GridItem,
  RoundResult,
  PlayerStats,
  ItemCategory,
} from './types/game';
import { ScatterPlayerStats } from './types/scatterbrain';
import { Play, Flame, Trophy, Sparkles, Brain, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';

export default function App() {
  // Master Game Arena Selection
  const [activeGame, setActiveGame] = useState<ActiveAppView>('hub');

  // FlashRecall State
  const [mode, setMode] = useState<GameMode>('arcade');
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [arcadeLevel, setArcadeLevel] = useState<number>(1);
  const [rushRound, setRushRound] = useState<number>(1);

  // Custom Mode State
  const [customGridSize, setCustomGridSize] = useState<GridSize>(6);
  const [customPreviewSeconds, setCustomPreviewSeconds] = useState<number>(5);
  const [customCategory, setCustomCategory] = useState<ItemCategory>('mixed');

  // Active Grid Data
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [items, setItems] = useState<GridItem[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [stageTitle, setStageTitle] = useState<string>('');

  // Timers & Metrics
  const [previewTotalSeconds, setPreviewTotalSeconds] = useState<number>(5);
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState<number>(5);
  const [previewStartTime, setPreviewStartTime] = useState<number>(0);
  const [previewTimeUsed, setPreviewTimeUsed] = useState<number>(0);
  const [recallStartTime, setRecallStartTime] = useState<number>(0);
  const [recallElapsedSeconds, setRecallElapsedSeconds] = useState<number>(0);

  // Score & Streak
  const [streak, setStreak] = useState<number>(0);
  const [cumulativeScore, setCumulativeScore] = useState<number>(0);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  // Audio & Modals
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  // Player Stats from LocalStorage for both games
  const [stats, setStats] = useState<PlayerStats>(loadFlashStats);
  const [scatterStats, setScatterStats] = useState<ScatterPlayerStats>(loadScatterStats);

  // Keep scatterStats synced whenever returning to hub or opening modal
  const refreshScatterStats = () => setScatterStats(loadScatterStats());

  useEffect(() => {
    if (activeGame === 'hub' || isStatsOpen) {
      refreshScatterStats();
    }
  }, [activeGame, isStatsOpen]);

  // Interval Refs
  const previewTimerRef = useRef<number | null>(null);
  const recallTimerRef = useRef<number | null>(null);

  // Save Stats
  const updateStats = (newResult: RoundResult) => {
    const prev = stats;
    const updated: PlayerStats = {
      gamesPlayed: prev.gamesPlayed + 1,
      highScore: Math.max(prev.highScore, newResult.totalScore),
      totalScore: prev.totalScore + newResult.totalScore,
      highestArcadeLevel:
        mode === 'arcade' && newResult.accuracyPercent >= 60
          ? Math.max(prev.highestArcadeLevel, arcadeLevel + 1)
          : prev.highestArcadeLevel,
      bestAccuracy: Math.max(prev.bestAccuracy, newResult.accuracyPercent),
      fastestRecallPerItem: Math.min(
        prev.fastestRecallPerItem,
        Math.round((newResult.recallDuration / newResult.gridSize) * 10) / 10
      ),
      totalItemsRecalled: prev.totalItemsRecalled + newResult.exactMatches + newResult.closeMatches,
      perfectRounds: prev.perfectRounds + (newResult.accuracyPercent === 100 ? 1 : 0),
    };
    setStats(updated);
    saveFlashStats(updated);
  };

  const handleResetStats = () => {
    clearAllStats();
    setStats(DEFAULT_FLASH_STATS);
    setScatterStats(DEFAULT_SCATTER_STATS);
  };

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Start Round function for FlashRecall
  const startRound = (
    chosenGridSize: GridSize,
    seconds: number,
    cat: ItemCategory,
    titleText: string
  ) => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    if (recallTimerRef.current) clearInterval(recallTimerRef.current);

    const generatedItems = getRandomItems(cat, chosenGridSize);
    setGridSize(chosenGridSize);
    setItems(generatedItems);
    setUserInputs(Array(chosenGridSize).fill(''));
    setStageTitle(titleText);
    setRoundResult(null);

    setPreviewTotalSeconds(seconds);
    setPreviewSecondsLeft(seconds);
    const now = Date.now();
    setPreviewStartTime(now);
    setPhase('preview');

    sound.flash.playStart();

    let lastTickInt = Math.ceil(seconds);
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - now) / 1000;
      const remaining = Math.max(0, seconds - elapsed);
      setPreviewSecondsLeft(remaining);

      const currentInt = Math.ceil(remaining);
      if (currentInt <= 3 && currentInt !== lastTickInt && remaining > 0) {
        sound.flash.playTick(750 + (3 - currentInt) * 180);
        lastTickInt = currentInt;
      }

      if (remaining <= 0) {
        clearInterval(interval);
        transitionToRecall(seconds);
      }
    }, 50);

    previewTimerRef.current = interval;
  };

  // Transition from Preview -> Recall
  const transitionToRecall = (usedTime: number) => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    previewTimerRef.current = null;

    setPreviewTimeUsed(usedTime);
    sound.flash.playVanish();
    setPhase('recall');

    const recallStart = Date.now();
    setRecallStartTime(recallStart);
    setRecallElapsedSeconds(0);

    recallTimerRef.current = window.setInterval(() => {
      setRecallElapsedSeconds((Date.now() - recallStart) / 1000);
    }, 100);
  };

  // User clicked "Ready Early" during preview
  const handleSkipPreview = () => {
    if (phase !== 'preview') return;
    const timeUsed = (Date.now() - previewStartTime) / 1000;
    transitionToRecall(timeUsed);
  };

  // Handle Box Input changes
  const handleInputChange = (index: number, value: string) => {
    setUserInputs((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Submit User Recall
  const handleSubmitRecall = () => {
    if (phase !== 'recall') return;
    if (recallTimerRef.current) clearInterval(recallTimerRef.current);
    recallTimerRef.current = null;

    const totalRecallTime = (Date.now() - recallStartTime) / 1000;
    setRecallElapsedSeconds(totalRecallTime);
    setPhase('evaluating');

    const result = evaluateRound(items, userInputs, {
      mode,
      level: mode === 'arcade' ? arcadeLevel : rushRound,
      gridSize,
      previewTimeLimit: previewTotalSeconds,
      previewTimeUsed,
      recallDuration: totalRecallTime,
      streak,
    });

    setRoundResult(result);
    setCumulativeScore((prev) => prev + result.totalScore);

    if (result.accuracyPercent >= 50) {
      setStreak((prev) => prev + 1);
      sound.flash.playVictoryFanfare();
    } else {
      setStreak(0);
      sound.flash.playSlotRevealed(false, false);
    }

    updateStats(result);

    setTimeout(() => {
      setPhase('results');
    }, 400);
  };

  // Launch Arcade Mode
  const launchArcadeLevel = (lvlIndex: number) => {
    const config = ARCADE_LEVELS[lvlIndex - 1] || ARCADE_LEVELS[0];
    setArcadeLevel(config.level);
    startRound(config.gridSize, config.previewSeconds, config.category, config.title);
  };

  // Launch Custom Match
  const launchCustomGame = () => {
    startRound(
      customGridSize,
      customPreviewSeconds,
      customCategory,
      `Custom Grid (${customGridSize} Boxes)`
    );
  };

  // Launch Daily Rush
  const launchRushRound = (roundNum: number) => {
    setRushRound(roundNum);
    const size: GridSize = roundNum === 1 ? 4 : roundNum === 2 ? 6 : 8;
    const time = roundNum === 1 ? 4.5 : roundNum === 2 ? 6.0 : 7.0;
    startRound(size, time, 'mixed', `Rush Round ${roundNum}/3`);
  };

  const handleNextStage = () => {
    if (mode === 'arcade') {
      if (arcadeLevel < ARCADE_LEVELS.length) {
        launchArcadeLevel(arcadeLevel + 1);
      } else {
        setPhase('idle');
      }
    } else if (mode === 'rush') {
      if (rushRound < 3) {
        launchRushRound(rushRound + 1);
      } else {
        setPhase('idle');
      }
    } else {
      launchCustomGame();
    }
  };

  const handleRetry = () => {
    if (mode === 'arcade') {
      launchArcadeLevel(arcadeLevel);
    } else if (mode === 'rush') {
      launchRushRound(rushRound);
    } else {
      launchCustomGame();
    }
  };

  const handleBackToMenu = () => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    if (recallTimerRef.current) clearInterval(recallTimerRef.current);
    setPhase('idle');
    setRoundResult(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
      if (recallTimerRef.current) clearInterval(recallTimerRef.current);
    };
  }, []);

  const filledCount = userInputs.filter((t) => t.trim().length > 0).length;
  const isFlashPlaying =
    activeGame === 'flashrecall' &&
    (phase === 'preview' || phase === 'recall' || phase === 'evaluating');

  // Background streak binding
  const effectiveStreak =
    activeGame === 'flashrecall' ? streak : activeGame === 'scatterbrain' ? scatterStats.currentStreak : 0;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-300 overflow-x-hidden">
      
      {/* Dynamic Animated Background reacting to current active streak */}
      <AnimatedStreakBackground streak={effectiveStreak} />

      {/* Top Bar Header for BrainForge */}
      <Header
        activeView={activeGame}
        onSelectView={(view) => {
          if (activeGame === 'flashrecall' && isFlashPlaying) {
            if (!window.confirm('Leave active round and return to menu?')) return;
          }
          setActiveGame(view);
          if (view === 'flashrecall') {
            setPhase('idle');
          }
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        isPlaying={isFlashPlaying}
      />

      {/* Main Arena Workspace */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col items-center justify-start">
        
        {/* VIEW A: BRAINFORGE ARENA HUB */}
        {activeGame === 'hub' && (
          <HubView
            onSelectGame={(selected) => setActiveGame(selected)}
            flashStats={stats}
            scatterStats={scatterStats}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />
        )}

        {/* VIEW B: SCATTERBRAIN GAME */}
        {activeGame === 'scatterbrain' && (
          <ScatterBrainGame
            isMuted={isMuted}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onBackToHub={() => setActiveGame('hub')}
          />
        )}

        {/* VIEW C: FLASHRECALL GAME */}
        {activeGame === 'flashrecall' && (
          <div className="w-full flex flex-col items-center">
            
            {/* FlashRecall Sub-Header Bar (when in idle state) */}
            {phase === 'idle' && (
              <div className="w-full max-w-3xl mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setActiveGame('hub')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Arena Hub</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
                  <button
                    onClick={() => setMode('arcade')}
                    className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                      mode === 'arcade'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Arcade Stages
                  </button>
                  <button
                    onClick={() => setMode('custom')}
                    className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                      mode === 'custom'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom Grid
                  </button>
                  <button
                    onClick={() => setMode('rush')}
                    className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                      mode === 'rush'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Daily Rush
                  </button>
                </div>
              </div>
            )}

            {/* FlashRecall IDLE MENU */}
            {phase === 'idle' && (
              <div className="w-full max-w-3xl my-auto animate-fade-in flex flex-col items-center text-center">
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/20 text-slate-950 mb-5 sm:mb-6 transform hover:rotate-3 transition-transform">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 max-w-xl">
                  FlashRecall <span className="text-amber-400">Grid Sprint</span>
                </h1>

                <p className="text-slate-400 text-xs sm:text-base max-w-lg mb-6 sm:mb-8 leading-relaxed px-2">
                  Memorize random items in a 4, 6, 8, 9, or 12-box grid before they disappear. Then recall what was in each box to score accuracy and rapid recall points.
                </p>

                {mode === 'arcade' && (
                  <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-8 backdrop-blur-xl mb-6 shadow-xl text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Campaign Mode
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
                          Stage {arcadeLevel}: {ARCADE_LEVELS[arcadeLevel - 1]?.title || 'Memory Trial'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                          {ARCADE_LEVELS[arcadeLevel - 1]?.description}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">Boxes / Preview</span>
                        <span className="text-base sm:text-lg font-mono font-bold text-white">
                          {ARCADE_LEVELS[arcadeLevel - 1]?.gridSize} Boxes · {ARCADE_LEVELS[arcadeLevel - 1]?.previewSeconds}s
                        </span>
                      </div>
                    </div>

                    <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>Best: {stats.highScore.toLocaleString()} pts</span>
                        <span>·</span>
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>Stage {stats.highestArcadeLevel}</span>
                      </div>

                      <button
                        onClick={() => launchArcadeLevel(arcadeLevel)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start Stage {arcadeLevel}</span>
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'custom' && (
                  <CustomModeSetup
                    gridSize={customGridSize}
                    onChangeGridSize={setCustomGridSize}
                    previewSeconds={customPreviewSeconds}
                    onChangePreviewSeconds={setCustomPreviewSeconds}
                    category={customCategory}
                    onChangeCategory={setCustomCategory}
                    onStartGame={launchCustomGame}
                  />
                )}

                {mode === 'rush' && (
                  <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-8 backdrop-blur-xl mb-6 shadow-xl text-left">
                    <div className="pb-5 sm:pb-6 border-b border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Daily Rush Sprint
                      </span>
                      <h3 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
                        3 Consecutive Speed Rounds
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Complete Round 1 (4 boxes), Round 2 (6 boxes), and Round 3 (8 boxes) back-to-back. Build an escalating combo multiplier!
                      </p>
                    </div>

                    <div className="pt-5 sm:pt-6 flex justify-end">
                      <button
                        onClick={() => launchRushRound(1)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Launch Rush Challenge</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* FlashRecall ACTIVE PLAY (PREVIEW, RECALL, EVALUATING, OR RESULTS) */}
            {phase !== 'idle' && (
              <div className="w-full flex flex-col items-center">
                <GameHUD
                  phase={phase}
                  mode={mode}
                  level={mode === 'arcade' ? arcadeLevel : rushRound}
                  stageTitle={stageTitle}
                  gridSize={gridSize}
                  streak={streak}
                  currentScore={cumulativeScore}
                  previewSecondsLeft={previewSecondsLeft}
                  previewTotalSeconds={previewTotalSeconds}
                  onSkipPreview={handleSkipPreview}
                  recallElapsedSeconds={recallElapsedSeconds}
                  filledCount={filledCount}
                  onSubmitRecall={handleSubmitRecall}
                />

                <MemoryGrid
                  phase={phase}
                  gridSize={gridSize}
                  items={items}
                  userInputs={userInputs}
                  evaluations={roundResult?.evaluations || []}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmitRecall}
                />

                {phase === 'results' && roundResult && (
                  <ScoreBoard
                    result={roundResult}
                    onNextStage={handleNextStage}
                    onRetry={handleRetry}
                    onBackToMenu={handleBackToMenu}
                    hasNextStage={
                      mode === 'arcade'
                        ? arcadeLevel < ARCADE_LEVELS.length
                        : mode === 'rush'
                        ? rushRound < 3
                        : true
                    }
                    isHighScore={roundResult.totalScore > stats.highScore}
                  />
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-sm py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BrainForge · Dual Cognitive Memory & Verbal Training Arena</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Game Rules
            </button>
            <span>·</span>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Lifetime Records
            </button>
          </div>
        </div>
      </footer>

      {/* Unified Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        defaultTab={activeGame === 'scatterbrain' ? 'scatterbrain' : 'flashrecall'}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        flashStats={stats}
        scatterStats={scatterStats}
        onResetStats={handleResetStats}
      />

    </div>
  );
}
