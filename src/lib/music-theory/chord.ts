import type { NoteName, ChordDef, ChordQuality, Interval, NoteRole } from '../../types';
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
export const QUALITY_NAMES: Record<ChordQuality, string> = {
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

/** Structure descriptions explaining the interval makeup of each chord quality */
const STRUCTURE_DESCRIPTIONS: Record<ChordQuality, string> = {
  maj: '根音 → 大三度（4半音）→ 纯五度（7半音）',
  min: '根音 → 小三度（3半音）→ 纯五度（7半音）',
  maj7: '根音 → 大三度 → 纯五度 → 大七度（11半音）',
  min7: '根音 → 小三度 → 纯五度 → 小七度（10半音）',
  dom7: '根音 → 大三度 → 纯五度 → 小七度（10半音）',
  dim: '根音 → 小三度 → 减五度（6半音）',
  dim7: '根音 → 小三度 → 减五度 → 减七度（9半音）',
  aug: '根音 → 大三度 → 增五度（8半音）',
  sus4: '根音 → 纯四度（5半音）→ 纯五度',
  sus2: '根音 → 大二度（2半音）→ 纯五度',
  '6': '根音 → 大三度 → 纯五度 → 大六度（9半音）',
  m6: '根音 → 小三度 → 纯五度 → 大六度',
  add9: '根音 → 大三度 → 纯五度 → 大九度（14半音）',
  madd9: '根音 → 小三度 → 纯五度 → 大九度',
  maj9: '根音 → 大三度 → 纯五度 → 大七度 → 大九度',
  min9: '根音 → 小三度 → 纯五度 → 小七度 → 大九度',
  '9': '根音 → 大三度 → 纯五度 → 小七度 → 大九度',
};

/** Usage tips explaining the musical function and common usage of each chord quality */
const USAGE_TIPS: Record<ChordQuality, string> = {
  maj: '大三和弦是调性的"家"，用于建立调性、开始和结束乐句',
  min: '小三和弦是大调的平行调核心，为进行增添忧伤色彩',
  maj7: '大七和弦的梦幻感来自大七度与大三度的碰撞，常用于爵士和氛围音乐',
  min7: '小七和弦比小三和弦更柔和抒情，适合叙事性旋律',
  dom7: '属七和弦有强烈的解决倾向，三全音制造张力，是布鲁斯和古典终止式的核心',
  dim: '减三和弦的减五度产生紧张感，常用于过渡连接两个和弦',
  dim7: '减七和弦是所有和弦中最紧张的，可以往任意方向解决，是模进的利器',
  aug: '增三和弦的对称结构（大三度+大三度）产生上升感和奇幻色彩',
  sus4: '挂留四和弦用四度替代三度，产生"悬而未决"的期待感，需要解决回大三或小三',
  sus2: '挂留二和弦比 sus4 更空灵，二度与大三度的结合营造开放感',
  '6': '六和弦比大三和弦温暖怀旧，六度替代七度避免了爵士味，适合老歌风格',
  m6: '小六和弦在小三的基础上加入六度，忧郁中带浪漫，常见于拉丁和法国香颂',
  add9: '加九和弦在大三和弦上加九度（比七和弦简单），增添明亮和现代流行感',
  madd9: '小加九和弦为小三和弦增添一丝希望和现代色彩',
  maj9: '大九和弦叠加了七度和九度，极其丰富，常用于爵士和 R&B 的华丽段落',
  min9: '小九和弦是小七和弦的进一步延伸，深沉而有灵魂感',
  '9': '九和弦是同名属七的延伸，丰满而富有放克和爵士色彩',
};

/**
 * Get the structural role of each note in a chord (root, third, fifth, etc.)
 */
export function getNoteRoles(chord: ChordDef): Map<NoteName, NoteRole> {
  const semitones = INTERVAL_MAP[chord.quality];
  const result = new Map<NoteName, NoteRole>();

  for (let i = 0; i < semitones.length; i++) {
    const st = semitones[i];
    let role: NoteRole;
    if (st === 0) {
      role = 'root';
    } else if (st >= 3 && st <= 4) {
      role = 'third';
    } else if (st >= 6 && st <= 8) {
      role = 'fifth';
    } else if (st >= 10 && st <= 11) {
      role = 'seventh';
    } else {
      role = 'extension';
    }
    result.set(chord.notes[i], role);
  }

  return result;
}

/** Explanation data for a chord quality */
export interface ChordExplanation {
  name: string;
  mood: string;
  structure: string;
  usage: string;
  commonIn: string;
}

/** Common musical contexts for chord qualities */
const COMMON_CONTEXTS: Record<ChordQuality, string> = {
  maj: '流行音乐、古典音乐',
  min: '流行音乐、古典音乐、民谣',
  maj7: '爵士乐、氛围音乐、City Pop',
  min7: '爵士乐、R&B、抒情流行',
  dom7: '布鲁斯、摇滚、古典终止式',
  dim: '古典过渡、爵士经过',
  dim7: '爵士乐、古典模进、电影配乐',
  aug: '科幻配乐、迷幻摇滚、现代爵士',
  sus4: '流行音乐、摇滚、新世纪',
  sus2: '流行音乐、氛围音乐、后摇滚',
  '6': '老歌、乡村音乐、流行',
  m6: '拉丁音乐、法国香颂、爵士',
  add9: '流行音乐、独立民谣',
  madd9: '现代流行、独立音乐',
  maj9: '爵士乐、R&B、Fusion',
  min9: '爵士乐、灵魂乐、Neo Soul',
  '9': '放克、爵士、Fusion',
};

/**
 * Get comprehensive explanation data for a chord quality.
 */
export function getChordExplanation(quality: ChordQuality): ChordExplanation {
  return {
    name: QUALITY_NAMES[quality] ?? '未知和弦',
    mood: QUALITY_MOODS[quality] ?? '',
    structure: STRUCTURE_DESCRIPTIONS[quality] ?? '',
    usage: USAGE_TIPS[quality] ?? '',
    commonIn: COMMON_CONTEXTS[quality] ?? '',
  };
}

/**
 * Build a chord definition from root note and quality, with optional inversion.
 * @param inversion 0: root, 1: 1st inv, 2: 2nd inv, etc.
 */
export function buildChord(root: NoteName, quality: ChordQuality, inversion: number = 0): ChordDef {
  const semitones = INTERVAL_MAP[quality];
  if (!semitones) {
    throw new Error(`Unknown chord quality: ${quality}`);
  }

  // 1. Get raw notes in root position
  let notes = semitones.map((st) => transpose(root, st));
  const intervals = semitones.map((st) => INTERVAL_NAMES[st] || `${st}`);

  // 2. Apply inversion if needed
  // Rule: for each degree of inversion, take the lowest note and move it up an octave
  const numNotes = notes.length;
  const actualInversion = inversion % numNotes;
  
  if (actualInversion > 0) {
    for (let i = 0; i < actualInversion; i++) {
      const lowest = notes.shift()!;
      notes.push(transpose(lowest, 12));
    }
  }

  // 3. Determine symbol and bass
  const rootDisplay = root.replace(/\d+$/, '');
  const qualitySuffix = quality === 'maj' ? '' : quality;
  const bassNote = notes[0];
  const bassDisplay = bassNote.replace(/\d+$/, '');
  
  let symbol = `${rootDisplay}${qualitySuffix}`;
  if (actualInversion > 0 && bassDisplay !== rootDisplay) {
    symbol = `${symbol}/${bassDisplay}`;
  }

  return {
    symbol,
    root,
    quality,
    notes,
    intervals,
    inversion: actualInversion,
    bass: bassNote,
  };
}

/**
 * Get all possible inversions for a given chord root and quality.
 */
export function getChordInversions(root: NoteName, quality: ChordQuality): ChordDef[] {
  const numNotes = INTERVAL_MAP[quality]?.length || 3;
  const invs: ChordDef[] = [];
  for (let i = 0; i < numNotes; i++) {
    invs.push(buildChord(root, quality, i));
  }
  return invs;
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
