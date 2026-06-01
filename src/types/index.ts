// ============================================
// Music Theory Types
// ============================================

/** Note name with octave, e.g. 'C4', 'F#5', 'Bb3' */
export type NoteName = string;

/** MIDI note number, 0-127 */
export type MidiNumber = number;

/** Supported chord qualities */
export type ChordQuality =
  | 'maj'
  | 'min'
  | 'maj7'
  | 'min7'
  | 'dom7'
  | 'dim'
  | 'dim7'
  | 'aug'
  | 'sus4'
  | 'sus2'
  | '6'
  | 'm6'
  | 'add9'
  | 'madd9'
  | 'maj9'
  | 'min9'
  | '9';

/** Musical interval, e.g. 'P1', 'M3', 'P5', 'm7' */
export type Interval = string;

/** Scale type */
export type ScaleType = 'major' | 'minor';

/** Structural role of a note within a chord */
export type NoteRole = 'root' | 'third' | 'fifth' | 'seventh' | 'extension';

/** Chord definition - the core data structure */
export interface ChordDef {
  /** Display symbol, e.g. 'Cmaj7', 'F#dim' */
  symbol: string;
  /** Root note, e.g. 'C4' */
  root: NoteName;
  /** Chord quality */
  quality: ChordQuality;
  /** Full note names, e.g. ['C4', 'E4', 'G4', 'B4'] */
  notes: NoteName[];
  /** Intervals from root, e.g. ['P1', 'M3', 'P5', 'M7'] */
  intervals: Interval[];
  /** Inversion degree (0: root, 1: first, 2: second, etc.) */
  inversion?: number;
  /** The actual bass note of this chord (might differ from root if inverted) */
  bass?: NoteName;
}

/** A single slot in a chord progression */
export interface ProgressionSlot {
  /** Slot index in the progression */
  index: number;
  /** The chord at this position */
  chord: ChordDef;
  /** Whether this slot was user-modified from the template default */
  isModified: boolean;
}

/** Chord progression template */
export interface ProgressionTemplate {
  /** Unique identifier */
  id: string;
  /** Display name, e.g. '1-5-6-4 流行进行' */
  name: string;
  /** Mood tags, e.g. ['明亮', '流行'] */
  moods: string[];
  /** Key for the template, e.g. 'C' */
  key: NoteName;
  /** Scale type */
  scaleType: ScaleType;
  /** Roman numerals, e.g. ['I', 'V', 'vi', 'IV'] */
  numerals: string[];
  /** Default BPM */
  defaultBpm: number;
  /** Educational explanation of why this progression works */
  explanation: string;
  /** Famous songs that use this progression */
  exampleSongs: string[];
}

// ============================================
// Voice Leading Types
// ============================================

/** Type of voice movement between two notes */
export type VoiceMovementType = 'static' | 'step' | 'skip' | 'leap';

/** Describes how one voice moves between two chords */
export interface VoiceMovement {
  /** The note in the first chord */
  fromNote: NoteName;
  /** The note in the second chord */
  toNote: NoteName;
  /** Type of movement */
  type: VoiceMovementType;
  /** Semitone distance (signed) */
  semitones: number;
}

/** Complete voice leading analysis between two chords */
export interface VoiceLeadingAnalysis {
  /** Movements for each voice */
  movements: VoiceMovement[];
  /** Notes that are common to both chords */
  commonTones: NoteName[];
  /** Overall smoothness score (0-1, higher is smoother) */
  smoothness: number;
}

// ============================================
// Audio & Playback Types
// ============================================

/** Playback state */
export type PlaybackState = 'idle' | 'playing' | 'paused';

/** Audio context state */
export interface AudioContextState {
  /** Whether audio context is initialized */
  isInitialized: boolean;
  /** Whether audio context is currently suspended */
  isSuspended: boolean;
}

/** Chord playback event */
export interface ChordPlaybackEvent {
  /** The chord to play */
  chord: ChordDef;
  /** Duration in seconds */
  duration: number;
  /** When to start (relative to now, in seconds) */
  startTime?: number;
}

// ============================================
// UI Types
// ============================================

/** Theme mode */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Tooltip data for a chord symbol */
export interface ChordTooltipData {
  /** Chinese name, e.g. 'C大七和弦' */
  chineseName: string;
  /** Note names, e.g. 'C E G B' */
  notesDisplay: string;
  /** Mood description, e.g. '梦幻、开放' */
  mood: string;
  /** Technical description */
  description: string;
}

/** Piano key properties */
export interface PianoKeyDef {
  /** Note name */
  note: NoteName;
  /** Whether this is a black key */
  isBlack: boolean;
  /** MIDI number */
  midi: MidiNumber;
}

/** Chord variant for the replacer menu */
export interface ChordVariantOption {
  /** The variant chord */
  chord: ChordDef;
  /** Display label */
  label: string;
  /** How different from the original (0-1) */
  difference: number;
}
