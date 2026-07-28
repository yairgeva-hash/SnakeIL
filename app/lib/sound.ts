"use client";

export type GameSound = "tap" | "open" | "clue" | "success" | "complete" | "achievement";

const notes: Record<GameSound, Array<[number, number, number]>> = {
  tap: [[520, .04, .045]],
  open: [[260, .05, .06], [390, .07, .08]],
  clue: [[440, .04, .05], [660, .06, .07]],
  success: [[523, .05, .06], [659, .05, .06], [784, .09, .09]],
  complete: [[392, .05, .07], [523, .06, .08], [659, .07, .09], [784, .14, .12]],
  achievement: [[659, .05, .08], [784, .06, .08], [988, .16, .14]],
};

export function playGameSound(kind: GameSound) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    let cursor = context.currentTime;
    notes[kind].forEach(([frequency, delay, duration]) => {
      cursor += delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, cursor);
      gain.gain.setValueAtTime(.0001, cursor);
      gain.gain.exponentialRampToValueAtTime(.09, cursor + .01);
      gain.gain.exponentialRampToValueAtTime(.0001, cursor + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(cursor);
      oscillator.stop(cursor + duration + .02);
    });
    window.setTimeout(() => context.close(), 900);
  } catch {
    // Sound is enhancement only; gameplay must never depend on it.
  }
}
