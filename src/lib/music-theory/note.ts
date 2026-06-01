import type { NoteName, MidiNumber } from '../../types';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

interface ParsedNote {
  baseNote: string;
  accidental: string;
  octave: number;
  midi: MidiNumber;
}

/**
 * Parse a note name into its components and MIDI number.
 * Supports formats: C4, F#5, Bb3, E#4
 */
export function parseNote(noteName: NoteName): ParsedNote {
  const match = noteName.match(/^([A-G])(#|b)?(\d+)$/);
  if (!match) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  const [, baseNote, accidental = '', octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const fullNote = baseNote + accidental;
  const semitone = NOTE_TO_SEMITONE[fullNote];

  if (semitone === undefined) {
    throw new Error(`Unknown note: ${fullNote}`);
  }

  const midi = (octave + 1) * 12 + semitone;

  return {
    baseNote,
    accidental,
    octave,
    midi,
  };
}

/**
 * Convert a note name to its MIDI number.
 */
export function noteToMidi(noteName: NoteName): MidiNumber {
  return parseNote(noteName).midi;
}

/**
 * Convert a MIDI number to a note name (using sharps for black keys).
 */
export function midiToNote(midi: MidiNumber): NoteName {
  if (midi < 0 || midi > 127) {
    throw new Error(`MIDI number out of range: ${midi}`);
  }

  const octave = Math.floor(midi / 12) - 1;
  const semitone = midi % 12;
  return `${NOTE_NAMES[semitone]}${octave}`;
}

/**
 * Transpose a note by a number of semitones.
 * Positive = up, negative = down.
 */
export function transpose(noteName: NoteName, semitones: number): NoteName {
  const midi = noteToMidi(noteName);
  const newMidi = midi + semitones;

  if (newMidi < 0 || newMidi > 127) {
    throw new Error(`Transposed note out of range: ${newMidi}`);
  }

  return midiToNote(newMidi);
}

/**
 * Change the octave of a note.
 * Positive = up octaves, negative = down octaves.
 */
export function changeOctave(noteName: NoteName, octaves: number): NoteName {
  const parsed = parseNote(noteName);
  const newOctave = parsed.octave + octaves;

  if (newOctave < -1 || newOctave > 9) {
    throw new Error(`Octave out of range: ${newOctave}`);
  }

  return `${parsed.baseNote}${parsed.accidental}${newOctave}`;
}

/**
 * Sort note names by their MIDI pitch (ascending).
 */
export function sortNotes(noteNames: NoteName[]): NoteName[] {
  return [...noteNames].sort((a, b) => noteToMidi(a) - noteToMidi(b));
}

/**
 * Get the distance in semitones between two notes.
 * Positive if noteB is higher than noteA.
 */
export function getNoteDistance(noteA: NoteName, noteB: NoteName): number {
  return noteToMidi(noteB) - noteToMidi(noteA);
}

/**
 * Get all note names in a range [startNote, endNote].
 */
export function getNoteRange(startNote: NoteName, endNote: NoteName): NoteName[] {
  const startMidi = noteToMidi(startNote);
  const endMidi = noteToMidi(endNote);

  const notes: NoteName[] = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    notes.push(midiToNote(midi));
  }

  return notes;
}

/**
 * Strip the octave number from a note name.
 * e.g. 'C4' -> 'C', 'F#5' -> 'F#', 'Bb3' -> 'Bb'
 */
export function getNoteNameWithoutOctave(noteName: NoteName): string {
  return noteName.replace(/\d+$/, '');
}

/**
 * Check if a note name is valid.
 */
export function isValidNote(noteName: string): noteName is NoteName {
  try {
    parseNote(noteName);
    return true;
  } catch {
    return false;
  }
}
