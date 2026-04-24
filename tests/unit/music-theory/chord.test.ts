import { describe, it, expect } from 'vitest';
import {
  buildChord,
  getChordVariants,
  getQualityName,
  getChordTooltipData,
} from '../../../src/lib/music-theory/chord';

describe('buildChord', () => {
  it('builds C major triad', () => {
    const chord = buildChord('C4', 'maj');
    expect(chord.notes).toEqual(['C4', 'E4', 'G4']);
    expect(chord.intervals).toEqual(['P1', 'M3', 'P5']);
    expect(chord.quality).toBe('maj');
  });

  it('builds C minor triad', () => {
    const chord = buildChord('C4', 'min');
    expect(chord.notes).toEqual(['C4', 'D#4', 'G4']);
  });

  it('builds C major 7th', () => {
    const chord = buildChord('C4', 'maj7');
    expect(chord.notes).toEqual(['C4', 'E4', 'G4', 'B4']);
  });

  it('builds C minor 7th', () => {
    const chord = buildChord('C4', 'min7');
    expect(chord.notes).toEqual(['C4', 'D#4', 'G4', 'A#4']);
  });

  it('builds C dominant 7th', () => {
    const chord = buildChord('C4', 'dom7');
    expect(chord.notes).toEqual(['C4', 'E4', 'G4', 'A#4']);
  });

  it('builds C diminished', () => {
    const chord = buildChord('C4', 'dim');
    expect(chord.notes).toEqual(['C4', 'D#4', 'F#4']);
  });

  it('builds C augmented', () => {
    const chord = buildChord('C4', 'aug');
    expect(chord.notes).toEqual(['C4', 'E4', 'G#4']);
  });

  it('builds C sus4', () => {
    const chord = buildChord('C4', 'sus4');
    expect(chord.notes).toEqual(['C4', 'F4', 'G4']);
  });

  it('builds C6', () => {
    const chord = buildChord('C4', '6');
    expect(chord.notes).toEqual(['C4', 'E4', 'G4', 'A4']);
  });
});

describe('getChordVariants', () => {
  it('returns variants for major chord', () => {
    const chord = buildChord('C4', 'maj');
    const variants = getChordVariants(chord);
    const qualities = variants.map((v) => v.quality);
    expect(qualities).toContain('maj7');
    expect(qualities).toContain('sus4');
  });

  it('returns variants for minor chord', () => {
    const chord = buildChord('C4', 'min');
    const variants = getChordVariants(chord);
    const qualities = variants.map((v) => v.quality);
    expect(qualities).toContain('min7');
  });
});

describe('getQualityName', () => {
  it('returns Chinese names', () => {
    expect(getQualityName('maj')).toBe('大三和弦');
    expect(getQualityName('min')).toBe('小三和弦');
    expect(getQualityName('maj7')).toBe('大七和弦');
  });
});

describe('getChordTooltipData', () => {
  it('returns tooltip data for a chord', () => {
    const chord = buildChord('C4', 'maj7');
    const data = getChordTooltipData(chord);
    expect(data.chineseName).toBe('大七和弦');
    expect(data.notesDisplay).toBe('C4 E4 G4 B4');
    expect(data.mood).toBeTruthy();
  });
});
