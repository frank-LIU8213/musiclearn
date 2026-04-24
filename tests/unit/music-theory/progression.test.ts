import { describe, it, expect } from 'vitest';
import { buildProgression } from '../../../src/lib/music-theory/progression';
import { DEFAULT_TEMPLATES } from '../../../src/data/progressions';

describe('buildProgression', () => {
  it('builds I-V-vi-IV in C major', () => {
    const chords = buildProgression('C4', 'major', ['I', 'V', 'vi', 'IV']);
    expect(chords).toHaveLength(4);
    expect(chords[0].notes).toContain('C4'); // I = Cmaj
    expect(chords[1].notes).toContain('G4'); // V = Gmaj
    expect(chords[2].notes).toContain('A4'); // vi = Amin
    expect(chords[3].notes).toContain('F4'); // IV = Fmaj
  });

  it('builds ii-V-I in C major', () => {
    const chords = buildProgression('C4', 'major', ['ii', 'V', 'I']);
    expect(chords).toHaveLength(3);
    expect(chords[0].quality).toBe('min'); // ii = Dmin
    expect(chords[1].quality).toBe('maj'); // V = Gmaj
    expect(chords[2].quality).toBe('maj'); // I = Cmaj
  });

  it('builds i-VI-III-VII in A minor', () => {
    const chords = buildProgression('A3', 'minor', ['i', 'VI', 'III', 'VII']);
    expect(chords).toHaveLength(4);
    expect(chords[0].notes).toContain('A3'); // i = Amin
    expect(chords[1].notes).toContain('F4'); // VI = Fmaj
    expect(chords[2].notes).toContain('C4'); // III = Cmaj
    expect(chords[3].notes).toContain('G4'); // VII = Gmaj
  });
});

describe('DEFAULT_TEMPLATES', () => {
  it('has 6 templates', () => {
    expect(DEFAULT_TEMPLATES).toHaveLength(6);
  });

  it('each template has required fields', () => {
    for (const template of DEFAULT_TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.moods.length).toBeGreaterThan(0);
      expect(template.numerals.length).toBeGreaterThan(0);
      expect(template.defaultBpm).toBeGreaterThan(0);
    }
  });
});
