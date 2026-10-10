import { loadMuted, saveMuted } from './storage';

// Web Audio API Synthesizer with two completely distinct sound personalities:
// 1. FlashRecall: Crystalline Memory Chimes & Resonant Glass Harps (Ethereal, pure, zen)
// 2. ScatterBrain: Electric Pop Arcade & Bouncy Synth Jam (Punchy, energetic, playful)

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = loadMuted();
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      saveMuted(this.isMuted);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // =========================================================================
  // FLASHRECALL SOUND SUITE: "Crystalline Memory Chimes & Zen Glass Marimba"
  // =========================================================================
  public flash = {
    // Shimmering celestial triad opening a mental memory palace
    playStart: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const chord = [659.25, 830.61, 987.77]; // E5, G#5, B5 luminous crystal chord
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        const startTime = this.ctx!.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    },

    // Gentle wooden marimba / water droplet click
    playTick: (frequency = 900) => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, this.ctx.currentTime + 0.035);

        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch {}
    },

    // Ethereal resonant sweep when items dissolve into memory
    playVanish: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } catch {}
    },

    // Light glass ping on box focus or tap
    playCardFlip: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch {}
    },

    // Revealing slot score feedback (musical bell, warm vibraphone, or soft felt mallet)
    playSlotRevealed: (isMatch: boolean, isMisplaced: boolean) => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (isMatch) {
          // Exact Match: Crystal glockenspiel chime (C6 + G6 harmony)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1046.5, this.ctx.currentTime);
          osc.frequency.setValueAtTime(1567.98, this.ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
        } else if (isMisplaced) {
          // Misplaced: Warm vibraphone minor third
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(783.99, this.ctx.currentTime);
          osc.frequency.setValueAtTime(987.77, this.ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);
        } else {
          // Missed: Soft felt-mallet low woodblock (NOT a harsh buzzer, very gentle)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch {}
    },

    // Ascending 5-note crystalline harp cascade
    playVictoryFanfare: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const cascade = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
        cascade.forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const start = this.ctx!.currentTime + i * 0.07;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(start);
          osc.stop(start + 0.35);
        });
      } catch {}
    },
  };

  // =========================================================================
  // SCATTERBRAIN SOUND SUITE: "Electric Pop Arcade & Bouncy Synth Jam"
  // =========================================================================
  public scatter = {
    // Fast, punchy 4-step electric synth run
    playStart: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const run = [293.66, 369.99, 440.0, 587.33]; // D4, F#4, A4, D5
      run.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const start = this.ctx!.currentTime + idx * 0.04;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.15);
      });
    },

    // Bubbly ascending electric pop during countdown (3, 2, 1)
    playCountdownTick: (count: number) => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = count === 3 ? 440 : count === 2 ? 554.37 : 659.25;
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch {}
    },

    // Snappy electric synth blip during the game timer
    playTimerTick: (isUrgent: boolean = false) => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isUrgent ? 'sawtooth' : 'triangle';
        const freq = isUrgent ? 880 : 520;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(isUrgent ? 0.04 : 0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + (isUrgent ? 0.05 : 0.03));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch {}
    },

    // Satisfying electric punch chord when submitting answers
    playSubmit: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const chord = [392.0, 493.88, 587.33]; // G4, B4, D5 punch chord
        chord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

          gain.gain.setValueAtTime(0.07, this.ctx!.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.16);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start();
          osc.stop(this.ctx!.currentTime + 0.16);
        });
      } catch {}
    },

    // Playful item validation feedback (upbeat powerup blip or warm playful wah)
    playResult: (score: number) => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (score > 0) {
          // Upbeat powerup coin blip
          osc.type = 'square';
          osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
        } else {
          // Gentle comic wah drop (friendly, NOT foul or abrasive)
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(329.63, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(261.63, this.ctx.currentTime + 0.14);
          gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
      } catch {}
    },

    // Upbeat 80s arcade victory fanfare
    playVictoryFanfare: () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const notes = [
          { f: 440.0, t: 0 },
          { f: 554.37, t: 0.08 },
          { f: 659.25, t: 0.16 },
          { f: 880.0, t: 0.26 },
        ];

        notes.forEach(({ f, t }) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const start = this.ctx!.currentTime + t;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, start);

          gain.gain.setValueAtTime(0.09, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(start);
          osc.stop(start + 0.22);
        });
      } catch {}
    },
  };

  // =========================================================================
  // BACKWARD-COMPATIBLE ALIASES FOR DIRECT CALLS (Defaults to FlashRecall)
  // =========================================================================
  public playStart() {
    this.flash.playStart();
  }

  public playTick(frequency?: number) {
    this.flash.playTick(frequency);
  }

  public playCardFlip() {
    this.flash.playCardFlip();
  }

  public playVanish() {
    this.flash.playVanish();
  }

  public playSlotRevealed(isMatch: boolean, isMisplaced: boolean) {
    this.flash.playSlotRevealed(isMatch, isMisplaced);
  }

  public playVictoryFanfare() {
    this.flash.playVictoryFanfare();
  }
}

export const sound = new SoundManager();
