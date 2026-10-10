import React, { useMemo } from 'react';

interface AnimatedStreakBackgroundProps {
  streak: number;
}

interface StreakTheme {
  name: string;
  orb1Color: string;
  orb2Color: string;
  orb3Color: string;
  corePulseColor: string;
  ambientTint: string;
  isPulsing: boolean;
  pulseIntensity: string;
}

export const AnimatedStreakBackground: React.FC<AnimatedStreakBackgroundProps> = ({ streak }) => {
  const theme: StreakTheme = useMemo(() => {
    if (streak === 0) {
      return {
        name: 'Cool Slate',
        orb1Color: 'rgba(30, 58, 138, 0.22)',      // deep blue
        orb2Color: 'rgba(51, 65, 85, 0.28)',      // slate
        orb3Color: 'rgba(79, 70, 229, 0.16)',     // indigo
        corePulseColor: 'rgba(30, 41, 59, 0.12)', // subtle cool center
        ambientTint: 'rgba(15, 23, 42, 0.85)',
        isPulsing: false,
        pulseIntensity: 'opacity-20',
      };
    } else if (streak === 1) {
      return {
        name: 'Ocean Cyan',
        orb1Color: 'rgba(14, 116, 144, 0.26)',    // cyan
        orb2Color: 'rgba(30, 58, 138, 0.24)',     // deep blue
        orb3Color: 'rgba(6, 182, 212, 0.18)',     // azure
        corePulseColor: 'rgba(14, 165, 233, 0.18)',
        ambientTint: 'rgba(12, 25, 44, 0.85)',
        isPulsing: false,
        pulseIntensity: 'opacity-25',
      };
    } else if (streak === 2) {
      return {
        name: 'Emerald Aurora',
        orb1Color: 'rgba(13, 148, 136, 0.28)',    // teal
        orb2Color: 'rgba(16, 185, 129, 0.22)',    // emerald
        orb3Color: 'rgba(14, 116, 144, 0.22)',    // cyan
        corePulseColor: 'rgba(20, 184, 166, 0.22)',
        ambientTint: 'rgba(10, 28, 38, 0.85)',
        isPulsing: true,
        pulseIntensity: 'opacity-30',
      };
    } else if (streak === 3 || streak === 4) {
      return {
        name: 'Golden Amber',
        orb1Color: 'rgba(217, 119, 6, 0.32)',     // amber
        orb2Color: 'rgba(245, 158, 11, 0.25)',    // warm gold
        orb3Color: 'rgba(180, 83, 9, 0.24)',      // honey
        corePulseColor: 'rgba(245, 158, 11, 0.28)',
        ambientTint: 'rgba(28, 20, 12, 0.85)',
        isPulsing: true,
        pulseIntensity: 'opacity-40',
      };
    } else {
      // Streak 5+: On Fire! Warm Radiant Blaze
      return {
        name: 'Blaze Fury',
        orb1Color: 'rgba(234, 88, 12, 0.38)',     // bright orange flame
        orb2Color: 'rgba(225, 29, 72, 0.32)',     // crimson coral
        orb3Color: 'rgba(245, 158, 11, 0.34)',    // fiery gold
        corePulseColor: 'rgba(239, 68, 68, 0.35)',// pulsing heat core
        ambientTint: 'rgba(35, 16, 16, 0.85)',
        isPulsing: true,
        pulseIntensity: 'opacity-55',
      };
    }
  }, [streak]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-colors duration-1000 ease-out"
    >
      {/* Background base tone with smooth streak-reactive gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.corePulseColor} 0%, rgba(2, 6, 23, 0.98) 75%)`,
        }}
      />

      {/* Subtle micro-grid dots for spatial depth */}
      <div
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Floating Animated Gradient Orb 1 (Top-Right / Center-Right) */}
      <div
        className={`absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 ease-out animate-float-slow`}
        style={{
          backgroundColor: theme.orb1Color,
        }}
      />

      {/* Floating Animated Gradient Orb 2 (Bottom-Left / Center-Left) */}
      <div
        className={`absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full blur-[130px] transition-all duration-1000 ease-out animate-float-reverse`}
        style={{
          backgroundColor: theme.orb2Color,
        }}
      />

      {/* Floating Animated Gradient Orb 3 (Top-Left Accent) */}
      <div
        className={`absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ease-out`}
        style={{
          backgroundColor: theme.orb3Color,
        }}
      />

      {/* Central Heartbeat / Heat-Pulse Core behind the active game area */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] rounded-full blur-[140px] transition-all duration-1000 ease-out ${
          theme.isPulsing ? 'animate-heat-pulse' : 'opacity-25'
        }`}
        style={{
          backgroundColor: theme.corePulseColor,
        }}
      />

      {/* Subtle vignette border scrim */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
};
