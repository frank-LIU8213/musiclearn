import { describe, it, expect } from 'vitest';
import {
  buildScale,
  getDegreeChord,
  getRomanNumeral,
  getDiatonicChords,
} from '../../../src/lib/music-theory/scale';

describe('buildScale', () => {
  it('builds C major scale', () => {
    const scale = buildScale('C4', 'major');
    expect(scale).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']);
  });

  it('builds A minor scale', () => {
    const scale = buildScale('A3', 'minor');
    expect(scale).toEqual(['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4']);
  });
});

describe('getDegreeChord', () => {
  it('returns I chord in C major', () => {
    const chord = getDegreeChord('C4', 'major', 1);
    expect(chord.quality).toBe('maj');
    expect(chord.notes).toContain('C4');
  });

  it('returns vi chord in C major', () => {
    const chord = getDegreeChord('C4', 'major', 6);
    expect(chord.quality).toBe('min');
    expect(chord.notes).toContain('A4');
  });

  it('returns ii chord in C major', () => {
    const chord = getDegreeChord('C4', 'major', 2);
    expect(chord.quality).toBe('min');
    expect(chord.notes).toContain('D4');
  });
});

describe('getRomanNumeral', () => {
  it('returns correct numerals for major', () => {
    expect(getRomanNumeral('major', 1)).toBe('I');
    expect(getRomanNumeral('major', 2)).toBe('ii');
    expect(getRomanNumeral('major', 5)).toBe('V');
    expect(getRomanNumeral('major', 7)).toBe('vii°');
  });

  it('returns correct numerals for minor', () => {
    expect(getRomanNumeral('minor', 1)).toBe('i');
    expect(getRomanNumeral('minor', 3)).toBe('III');
  });
});

describe('getDiatonicChords', () => {
  it('returns all 7 diatonic chords for C major', () => {
    const chords = getDiatonicChords('C4', 'major');
    expect(chords).toHaveLength(7);
    expect(chords[0].quality).toBe('maj'); // I
    expect(chords[1].quality).toBe('min'); // ii
    expect(chords[4].quality).toBe('maj'); // V
  });
});
