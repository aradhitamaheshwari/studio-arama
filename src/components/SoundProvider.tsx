"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMode, type Mode } from "./ModeProvider";

/**
 * SOUND
 *
 * Atmosphere, not music. A low pad, a quiet filtered air bed and the occasional
 * small digital event. Day is warmer and more open. Night is lower, narrower
 * and stranger.
 *
 * Rules held here:
 *   Nothing plays until the visitor asks for it. There is no autoplay.
 *   Levels stay low enough to sit under the page rather than over it.
 *   Everything fades. Nothing starts or stops abruptly.
 *
 * The bed is synthesised rather than loaded, so the site ships no audio files.
 * To move to recorded atmospheres later, replace `startBed` with a buffer
 * source into `master`. Nothing else in the app needs to change.
 */

const CHORDS: Record<Mode, number[]> = {
  // Open fifth with a soft third above. Warm, bright, editorial.
  day: [110, 164.81, 220, 329.63],
  // Lower, tighter, with a minor second rubbing underneath. Nocturnal.
  night: [82.41, 98, 123.47, 164.81],
};

/**
 * The figure that plays over the pad. Sixteen steps, mostly rests, so it
 * suggests a rhythm rather than keeping time. Numbers index the chord, and
 * null is a step that stays quiet.
 *
 * Day skips upward and lands on the octave. Night hangs back and syncopates.
 */
const PATTERNS: Record<Mode, (number | null)[]> = {
  day: [2, null, 3, null, null, 2, null, 4, null, null, 3, null, 4, null, 2, null],
  night: [null, 2, null, null, 3, null, null, 2, null, 4, null, null, 2, null, null, 3],
};

/** Milliseconds per step. Quick enough to feel alive, slow enough to sit under. */
const STEP_MS = 250;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private noise: AudioBufferSourceNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private blipTimer: number | null = null;
  private stepTimer: number | null = null;
  private step = 0;
  private mode: Mode = "day";

  get running() {
    return this.ctx !== null;
  }

  async start(mode: Mode) {
    this.mode = mode;
    if (this.ctx) {
      await this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    this.startBed(mode);

    // Ease in over two seconds. The visitor should notice the room change,
    // not the moment it switched on.
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2);
    this.runSequence();
    this.scheduleBlip();
  }

  /**
   * A short plucked note. Fast attack, quick decay, gone before it can nag.
   * This is what gives the atmosphere a pulse instead of a drone.
   */
  private pluck(freq: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const tone = ctx.createBiquadFilter();

    osc.type = this.mode === "night" ? "triangle" : "sine";
    osc.frequency.value = freq;
    // A little detune each time, so repeats never sound machine stamped.
    osc.detune.value = (Math.random() - 0.5) * 14;

    tone.type = "lowpass";
    tone.frequency.setValueAtTime(this.mode === "night" ? 1600 : 2600, t);
    tone.frequency.exponentialRampToValueAtTime(600, t + 0.3);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.055, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);

    osc.connect(tone).connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  /** Walks the pattern. Rests stay silent, so the figure keeps moving. */
  private runSequence() {
    if (typeof window === "undefined") return;
    this.stepTimer = window.setInterval(() => {
      const pattern = PATTERNS[this.mode];
      const slot = pattern[this.step % pattern.length];
      this.step++;
      if (slot === null) return;
      const chord = CHORDS[this.mode];
      const base = chord[Math.min(slot, chord.length - 1)];
      // Every so often it lifts an octave. Small surprise, no drama.
      this.pluck(Math.random() < 0.18 ? base * 2 : base);
    }, STEP_MS);
  }

  private startBed(mode: Mode) {
    const ctx = this.ctx!;
    const master = this.master!;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = mode === "night" ? 420 : 700;
    filter.Q.value = 2;
    filter.connect(master);
    this.filter = filter;

    // Sweep across the filter so the bed keeps moving under the figure.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.14;
    lfoGain.gain.value = mode === "night" ? 220 : 340;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;

    CHORDS[mode].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      // Slight detune keeps the pad from sounding synthetic and static.
      osc.detune.value = (i - 1.5) * 6;
      gain.gain.value = 0.16 / (i + 1.4);
      osc.connect(gain).connect(filter);
      osc.start();
      this.voices.push({ osc, gain });
    });

    // Air. Two seconds of noise, looped, heavily filtered, barely there.
    const frames = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = mode === "night" ? 0.05 : 0.03;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = mode === "night" ? 900 : 1600;
    noiseFilter.Q.value = 0.7;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();
    this.noise = noise;
  }

  /** A small, quiet digital event. Rare enough to stay interesting. */
  blip(strength = 1) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const base = this.mode === "night" ? 880 : 1320;
    osc.type = "sine";
    osc.frequency.setValueAtTime(base * (0.75 + Math.random() * 0.7), t);
    osc.frequency.exponentialRampToValueAtTime(base * 0.5, t + 0.22);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05 * strength, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  private scheduleBlip() {
    if (typeof window === "undefined") return;
    const wait = 4000 + Math.random() * 8000;
    this.blipTimer = window.setTimeout(() => {
      this.blip(0.6);
      this.scheduleBlip();
    }, wait);
  }

  setMode(mode: Mode) {
    this.mode = mode;
    const ctx = this.ctx;
    if (!ctx || !this.filter) return;
    const t = ctx.currentTime;
    // Move the room rather than rebuild it. The figure follows on its own,
    // since it reads the mode fresh on every step.
    this.step = 0;
    this.filter.frequency.linearRampToValueAtTime(mode === "night" ? 420 : 700, t + 1.2);
    CHORDS[mode].forEach((freq, i) => {
      const voice = this.voices[i];
      if (voice) voice.osc.frequency.linearRampToValueAtTime(freq, t + 1.2);
    });
  }

  async stop() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    if (this.blipTimer) window.clearTimeout(this.blipTimer);
    this.blipTimer = null;
    if (this.stepTimer) window.clearInterval(this.stepTimer);
    this.stepTimer = null;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    window.setTimeout(() => this.dispose(), 700);
  }

  private dispose() {
    this.voices.forEach((v) => {
      try {
        v.osc.stop();
      } catch {
        // Already stopped.
      }
    });
    this.voices = [];
    try {
      this.noise?.stop();
      this.lfo?.stop();
    } catch {
      // Already stopped.
    }
    this.noise = null;
    this.lfo = null;
    this.filter = null;
    this.master = null;
    this.ctx?.close();
    this.ctx = null;
  }
}

type SoundContext = { enabled: boolean; toggle: () => void; blip: (s?: number) => void };

const Ctx = createContext<SoundContext>({ enabled: false, toggle: () => {}, blip: () => {} });

export const useSound = () => useContext(Ctx);

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const engine = useRef<AudioEngine | null>(null);
  const { mode } = useMode();

  /**
   * Built on first use rather than on render. Nobody who never touches the
   * sound control pays for an AudioContext, and rendering stays free of side
   * effects.
   */
  const getEngine = useCallback(() => {
    engine.current ??= new AudioEngine();
    return engine.current;
  }, []);

  const toggle = useCallback(() => {
    const e = getEngine();
    setEnabled((on) => {
      if (on) {
        void e.stop();
        return false;
      }
      // Called straight from a click, which is what unlocks audio on iOS.
      void e.start(mode);
      return true;
    });
  }, [mode, getEngine]);

  useEffect(() => {
    if (enabled) engine.current?.setMode(mode);
  }, [mode, enabled]);

  // Leaving the tab should not leave a drone playing behind it.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && enabled) {
        void engine.current?.stop();
        setEnabled(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  const blip = useCallback((s = 1) => {
    engine.current?.blip(s);
  }, []);

  return <Ctx.Provider value={{ enabled, toggle, blip }}>{children}</Ctx.Provider>;
}
