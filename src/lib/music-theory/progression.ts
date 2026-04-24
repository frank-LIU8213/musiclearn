import type { NoteName, ChordDef, ScaleType } from '../../types';
import { getDegreeChord } from './scale';

/**
 * Parse a Roman numeral string into degree and quality modifiers.
 * Supports: I, ii, iii, IV, V, vi, vii°, viiø (the ø is treated as min7b5)
 */
function parseRomanNumeral(numeral: string): { degree: number; quality?: string } {
  // Remove quality suffixes for parsing
  const clean = numeral.replace(/[°ø+]/g, '');
  const isLower = clean[0] === clean[0].toLowerCase();

  const romanToInt: Record<string, number> = {
    I: 1, i: 1,
    II: 2, ii: 2,
    III: 3, iii: 3,
    IV: 4, iv: 4,
    V: 5, v: 5,
    VI: 6, vi: 6,
    VII: 7, vii: 7,
  };

  const degree = romanToInt[clean];
  if (!degree) {
    throw new Error(`Invalid Roman numeral: ${numeral}`);
  }

  // Detect quality modifiers
  let quality: string | undefined;
  if (numeral.includes('°')) {
    quality = 'dim';
  } else if (numeral.includes('ø')) {
    quality = 'min7b5'; // Half-diminished (not in our quality list, will fallback)
  } else if (isLower) {
    quality = 'min';
  } else {
    quality = 'maj';
  }

  // Check for 7 suffix
  if (numeral.match(/7$/)) {
    if (quality === 'maj') quality = 'dom7';
    else if (quality === 'min') quality = 'min7';
  }

  return { degree, quality };
}

/**
 * Build a chord progression from a key, scale type, and Roman numerals.
 */
export function buildProgression(
  key: NoteName,
  scaleType: ScaleType,
  numerals: string[]
): ChordDef[] {
  return numerals.map((numeral) => {
    const { degree } = parseRomanNumeral(numeral);
    return getDegreeChord(key, scaleType, degree);
  });
}

/**
 * Get display symbols for a progression.
 */
export function getProgressionSymbols(chords: ChordDef[]): string {
  return chords.map((c) => c.symbol).join(' - ');
}
