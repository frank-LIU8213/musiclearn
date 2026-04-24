import * as Tone from 'tone';
import type { NoteName } from '../../types';

/**
 * Singleton synth engine using Tone.js PolySynth.
 * Creates a polyphonic synthesizer with a pleasant piano-like envelope.
 */
class SynthEngine {
  private synth: Tone.PolySynth | null = null;
  private isInitialized = false;

  /**
   * Initialize the audio context and synth.
   * Must be called after a user gesture due to browser autoplay policies.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
      volume: -8,
    }).toDestination();

    this.isInitialized = true;
  }

  /**
   * Play a single note.
   */
  playNote(note: NoteName, duration: number = 0.5): void {
    if (!this.synth) {
      console.warn('Synth not initialized. Call initialize() first.');
      return;
    }

    this.synth.triggerAttackRelease(note, duration);
  }

  /**
   * Play a chord (multiple notes simultaneously).
   */
  playChord(notes: NoteName[], duration: number = 0.5): void {
    if (!this.synth) {
      console.warn('Synth not initialized. Call initialize() first.');
      return;
    }

    this.synth.triggerAttackRelease(notes, duration);
  }

  /**
   * Play a sequence of notes with a delay between each.
   */
  async playSequence(
    notes: NoteName[],
    noteDuration: number = 0.3,
    gap: number = 0.1
  ): Promise<void> {
    if (!this.synth) {
      console.warn('Synth not initialized. Call initialize() first.');
      return;
    }

    for (let i = 0; i < notes.length; i++) {
      this.synth.triggerAttackRelease(notes[i], noteDuration);
      if (i < notes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, (noteDuration + gap) * 1000));
      }
    }
  }

  /**
   * Stop all currently playing notes.
   */
  stopAll(): void {
    if (this.synth) {
      this.synth.releaseAll();
    }
  }

  /**
   * Set master volume in decibels.
   */
  setVolume(db: number): void {
    if (this.synth) {
      this.synth.volume.value = db;
    }
  }

  /**
   * Check if the synth is ready to play.
   */
  get ready(): boolean {
    return this.isInitialized && this.synth !== null;
  }
}

export const synthEngine = new SynthEngine();
