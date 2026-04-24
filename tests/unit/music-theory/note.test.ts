import { describe, it, expect } from 'vitest';
import {
  parseNote,
  noteToMidi,
  midiToNote,
  transpose,
  changeOctave,
  sortNotes,
  getNoteDistance,
  getNoteRange,
  isValidNote,
} from '../../../src/lib/music-theory/note';

describe('parseNote', () => {
  it('parses C4 correctly', () => {
    const result = parseNote('C4');
    expect(result.baseNote).toBe('C');
    expect(result.accidental).toBe('');
    expect(result.octave).toBe(4);
    expect(result.midi).toBe(60);
  });

  it('parses F#5 correctly', () => {
    const result = parseNote('F#5');
    expect(result.baseNote).toBe('F');
    expect(result.accidental).toBe('#');
    expect(result.octave).toBe(5);
    expect(result.midi).toBe(78);
  });

  it('parses Bb3 correctly', () => {
    const result = parseNote('Bb3');
    expect(result.baseNote).toBe('B');
    expect(result.accidental).toBe('b');
    expect(result.octave).toBe(3);
    expect(result.midi).toBe(58);
  });

  it('throws on invalid note', () => {
    expect(() => parseNote('H4')).toThrow('Invalid note name');
    expect(() => parseNote('C')).toThrow('Invalid note name');
  });
});

describe('noteToMidi', () => {
  it('converts common notes to MIDI', () => {
    expect(noteToMidi('C4')).toBe(60);
    expect(noteToMidi('A4')).toBe(69);
    expect(noteToMidi('C0')).toBe(12);
    expect(noteToMidi('G9')).toBe(127);
  });
});

describe('midiToNote', () => {
  it('converts MIDI to note names', () => {
    expect(midiToNote(60)).toBe('C4');
    expect(midiToNote(69)).toBe('A4');
    expect(midiToNote(61)).toBe('C#4');
  });

  it('throws on out of range MIDI', () => {
    expect(() => midiToNote(-1)).toThrow('out of range');
    expect(() => midiToNote(128)).toThrow('out of range');
  });
});

describe('transpose', () => {
  it('transposes up by semitones', () => {
    expect(transpose('C4', 4)).toBe('E4');
    expect(transpose('C4', 12)).toBe('C5');
  });

  it('transposes down by semitones', () => {
    expect(transpose('C4', -5)).toBe('G3');
    expect(transpose('C4', -12)).toBe('C3');
  });

  it('handles black keys', () => {
    expect(transpose('F#4', 2)).toBe('G#4');
    expect(transpose('Bb3', 2)).toBe('C4');
  });
});

describe('changeOctave', () => {
  it('changes octave up', () => {
    expect(changeOctave('C4', 1)).toBe('C5');
    expect(changeOctave('C4', 2)).toBe('C6');
  });

  it('changes octave down', () => {
    expect(changeOctave('C4', -1)).toBe('C3');
    expect(changeOctave('C4', -2)).toBe('C2');
  });
});

describe('sortNotes', () => {
  it('sorts notes by pitch', () => {
    const notes = ['G4', 'C4', 'E4', 'B4'];
    expect(sortNotes(notes)).toEqual(['C4', 'E4', 'G4', 'B4']);
  });
});

describe('getNoteDistance', () => {
  it('calculates distance in semitones', () => {
    expect(getNoteDistance('C4', 'E4')).toBe(4);
    expect(getNoteDistance('E4', 'C4')).toBe(-4);
    expect(getNoteDistance('C4', 'C5')).toBe(12);
  });
});

describe('getNoteRange', () => {
  it('returns all notes in range', () => {
    const range = getNoteRange('C4', 'E4');
    expect(range).toEqual(['C4', 'C#4', 'D4', 'D#4', 'E4']);
  });
});

describe('isValidNote', () => {
  it('returns true for valid notes', () => {
    expect(isValidNote('C4')).toBe(true);
    expect(isValidNote('F#5')).toBe(true);
  });

  it('returns false for invalid notes', () => {
    expect(isValidNote('H4')).toBe(false);
    expect(isValidNote('C')).toBe(false);
  });
});
