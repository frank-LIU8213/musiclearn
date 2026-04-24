import type { NoteName, ChordDef, ScaleType } from '../../types';
import { transpose } from './note';
import { buildChord } from './chord';

/** Semitone patterns for scales */
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

/** Roman numerals for scale degrees */
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Chord quality for each degree in major scale */
const MAJOR_SCALE_CHORDS: Array<'maj' | 'min' | 'dim'> = [
  'maj', 'min', 'min', 'maj', 'maj', 'min', 'dim',
];

/** Chord quality for each degree in minor scale (natural minor) */
const MINOR_SCALE_CHORDS: Array<'maj' | 'min' | 'dim' | 'maj'> = [
  'min', 'dim', 'maj', 'min', 'min', 'maj', 'maj',
];

/**
 * Build a scale from a root note and scale type.
 */
export function buildScale(root: NoteName, scaleType: ScaleType): NoteName[] {
  const pattern = SCALE_PATTERNS[scaleType];
  return pattern.map((semitone) => transpose(root, semitone));
}

/**
 * Get the chord quality for a specific degree in a scale.
 * Degrees are 1-indexed (1 = tonic, 2 = supertonic, etc.)
 */
export function getDegreeQuality(
  scaleType: ScaleType,
  degree: number
): 'maj' | 'min' | 'dim' {
  const chords = scaleType === 'major' ? MAJOR_SCALE_CHORDS : MINOR_SCALE_CHORDS;
  return chords[degree - 1];
}

/**
 * Build the diatonic chord for a specific degree in a scale.
 * Degrees are 1-indexed.
 */
export function getDegreeChord(
  root: NoteName,
  scaleType: ScaleType,
  degree: number
): ChordDef {
  const scale = buildScale(root, scaleType);
  const degreeRoot = scale[degree - 1];
  const quality = getDegreeQuality(scaleType, degree);
  return buildChord(degreeRoot, quality);
}

/**
 * Get the Roman numeral for a degree (1-indexed).
 * Uppercase for major, lowercase for minor/diminished.
 */
export function getRomanNumeral(
  scaleType: ScaleType,
  degree: number
): string {
  const numeral = ROMAN_NUMERALS[degree - 1];
  const quality = getDegreeQuality(scaleType, degree);

  if (quality === 'min') {
    return numeral.toLowerCase();
  }
  if (quality === 'dim') {
    return numeral.toLowerCase() + '°';
  }
  return numeral;
}

/**
 * Get all diatonic chords for a scale.
 */
export function getDiatonicChords(
  root: NoteName,
  scaleType: ScaleType
): ChordDef[] {
  return [1, 2, 3, 4, 5, 6, 7].map((degree) =>
    getDegreeChord(root, scaleType, degree)
  );
}
