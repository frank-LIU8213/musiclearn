import { synthEngine } from './synth';
import type { ChordDef, NoteName } from '../../types';

/**
 * Play a chord using the synth engine.
 */
export function playChord(chord: ChordDef, duration: number = 0.5): void {
  synthEngine.playChord(chord.notes, duration);
}

/**
 * Play a single note.
 */
export function playNote(note: NoteName, duration: number = 0.5): void {
  synthEngine.playNote(note, duration);
}

/**
 * Play a chord progression at a given BPM.
 */
export async function playProgression(
  chords: ChordDef[],
  bpm: number = 120
): Promise<void> {
  const beatDuration = 60 / bpm;
  const chordDuration = beatDuration * 2; // Each chord lasts 2 beats by default

  for (const chord of chords) {
    synthEngine.playChord(chord.notes, chordDuration);
    await new Promise((resolve) => setTimeout(resolve, chordDuration * 1000));
  }
}

/**
 * Initialize the audio engine.
 */
export async function initAudio(): Promise<void> {
  await synthEngine.initialize();
}

/**
 * Check if audio is ready.
 */
export function isAudioReady(): boolean {
  return synthEngine.ready;
}

/**
 * Stop all playback.
 */
export function stopPlayback(): void {
  synthEngine.stopAll();
}
