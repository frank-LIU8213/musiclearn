import type { NoteName, ChordDef, ChordQuality, Interval } from '../../types';
import { transpose } from './note';

/** Interval map for each chord quality: semitone offsets from root */
const INTERVAL_MAP: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  dim: [0, 3, 6],
  dim7: [0, 3, 6, 9],
  aug: [0, 4, 8],
  sus4: [0, 5, 7],
  sus2: [0, 2, 7],
  '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  add9: [0, 4, 7, 14],
  madd9: [0, 3, 7, 14],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  '9': [0, 4, 7, 10, 14],
};

/** Interval names for display */
const INTERVAL_NAMES: Record<number, Interval> = {
  0: 'P1',
  1: 'm2',
  2: 'M2',
  3: 'm3',
  4: 'M3',
  5: 'P4',
  6: 'TT',
  7: 'P5',
  8: 'm6',
  9: 'M6',
  10: 'm7',
  11: 'M7',
  12: 'P8',
  13: 'm9',
  14: 'M9',
};

/** Variant map: which qualities can replace each other */
const VARIANT_MAP: Record<ChordQuality, ChordQuality[]> = {
  maj: ['maj7', '6', 'add9', 'sus4', 'sus2'],
  min: ['min7', 'm6', 'madd9', 'sus4'],
  maj7: ['maj', 'maj9', '6'],
  min7: ['min', 'min9', 'm6'],
  dom7: ['maj', '9'],
  dim: ['dim7', 'min'],
  dim7: ['dim'],
  aug: ['maj'],
  sus4: ['maj', 'min', 'sus2'],
  sus2: ['maj', 'sus4'],
  '6': ['maj', 'maj7'],
  m6: ['min', 'min7'],
  add9: ['maj', 'maj7'],
  madd9: ['min', 'min7'],
  maj9: ['maj7', 'maj'],
  min9: ['min7', 'min'],
  '9': ['dom7', 'maj'],
};

/** Chinese names for chord qualities */
const QUALITY_NAMES: Record<ChordQuality, string> = {
  maj: '大三和弦',
  min: '小三和弦',
  maj7: '大七和弦',
  min7: '小七和弦',
  dom7: '属七和弦',
  dim: '减三和弦',
  dim7: '减七和弦',
  aug: '增三和弦',
  sus4: '挂留四和弦',
  sus2: '挂留二和弦',
  '6': '六和弦',
  m6: '小六和弦',
  add9: '加九和弦',
  madd9: '小加九和弦',
  maj9: '大九和弦',
  min9: '小九和弦',
  '9': '九和弦',
};

/** Mood descriptions for chord qualities */
const QUALITY_MOODS: Record<ChordQuality, string> = {
  maj: '明亮、稳定、快乐',
  min: '忧伤、内敛、沉思',
  maj7: '梦幻、开放、爵士',
  min7: '柔和、叙事、抒情',
  dom7: '紧张、趋向解决、布鲁斯',
  dim: '悬疑、不安、过渡',
  dim7: '极度紧张、神秘、爵士',
  aug: '悬疑、奇幻、上升',
  sus4: '悬而未决、期待、现代',
  sus2: '空灵、开放、流行',
  '6': '温暖、怀旧、老歌',
  m6: '忧郁、浪漫、拉丁',
  add9: '明亮、扩展、流行',
  madd9: '忧伤、扩展、现代',
  maj9: '丰富、爵士、复杂',
  min9: '深沉、爵士、灵魂',
  '9': '丰富、放克、爵士',
};

/**
 * Build a chord definition from root note and quality.
 */
export function buildChord(root: NoteName, quality: ChordQuality): ChordDef {
  const semitones = INTERVAL_MAP[quality];
  if (!semitones) {
    throw new Error(`Unknown chord quality: ${quality}`);
  }

  const notes = semitones.map((st) => transpose(root, st));
  const intervals = semitones.map((st) => INTERVAL_NAMES[st] || `${st}`);

  return {
    symbol: `${root.replace(/\d+$/, '')}${quality === 'maj' ? '' : quality}`,
    root,
    quality,
    notes,
    intervals,
  };
}

/**
 * Get all variant qualities for a given chord quality.
 */
export function getChordVariants(chord: ChordDef): ChordDef[] {
  const variants = VARIANT_MAP[chord.quality] ?? [];
  return variants.map((quality) => buildChord(chord.root, quality));
}

/**
 * Get the Chinese name for a chord quality.
 */
export function getQualityName(quality: ChordQuality): string {
  return QUALITY_NAMES[quality] ?? '未知和弦';
}

/**
 * Get the mood description for a chord quality.
 */
export function getQualityMood(quality: ChordQuality): string {
  return QUALITY_MOODS[quality] ?? '';
}

/**
 * Get tooltip data for a chord.
 */
export function getChordTooltipData(chord: ChordDef): {
  chineseName: string;
  notesDisplay: string;
  mood: string;
  description: string;
} {
  return {
    chineseName: getQualityName(chord.quality),
    notesDisplay: chord.notes.join(' '),
    mood: getQualityMood(chord.quality),
    description: `${chord.root.replace(/\d+$/, '')}音上构建的${getQualityName(chord.quality)}`,
  };
}
