import { memo, useMemo } from 'react';
import { PianoKey } from './PianoKey';
import type { NoteName } from '../../types';
import { getNoteRange } from '../../lib/music-theory/note';

interface PianoKeyboardProps {
  activeNotes?: NoteName[];
  onKeyPress?: (note: NoteName) => void;
  range?: [NoteName, NoteName];
}

const BLACK_KEY_OFFSETS: Record<string, number> = {
  'C#': 0.65,
  'D#': 1.65,
  'F#': 3.65,
  'G#': 4.65,
  'A#': 5.65,
};

export const PianoKeyboard = memo(function PianoKeyboard({
  activeNotes = [],
  onKeyPress,
  range = ['C3', 'B4'],
}: PianoKeyboardProps) {
  const { whiteKeys, blackKeys } = useMemo(() => {
    const allNotes = getNoteRange(range[0], range[1]);
    const white: NoteName[] = [];
    const black: NoteName[] = [];

    for (const note of allNotes) {
      if (note.includes('#')) {
        black.push(note);
      } else {
        white.push(note);
      }
    }

    return { whiteKeys: white, blackKeys: black };
  }, [range]);

  const handleKeyPress = (note: NoteName) => {
    onKeyPress?.(note);
  };

  // Build a map of white key positions for black key placement
  const whiteKeyPositions = useMemo(() => {
    const map: Record<string, number> = {};
    whiteKeys.forEach((note, index) => {
      map[note] = index;
    });
    return map;
  }, [whiteKeys]);

  return (
    <div className="relative inline-flex select-none">
      {/* White keys container */}
      <div className="flex">
        {whiteKeys.map((note) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={false}
            isActive={activeNotes.includes(note)}
            onClick={handleKeyPress}
          />
        ))}
      </div>

      {/* Black keys overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {blackKeys.map((note) => {
          const baseNote = note.replace('#', '');
          const octave = note.match(/\d+$/)?.[0] || '';
          const whiteNote = baseNote + octave;
          const whiteIndex = whiteKeyPositions[whiteNote];

          if (whiteIndex === undefined) return null;

          const offset = BLACK_KEY_OFFSETS[note.replace(/\d+$/, '')];
          if (offset === undefined) return null;

          const leftPosition = (whiteIndex + offset) * 48; // 48px = w-12

          return (
            <div
              key={note}
              className="pointer-events-auto"
              style={{
                position: 'absolute',
                left: `${leftPosition}px`,
                top: 0,
              }}
            >
              <PianoKey
                note={note}
                isBlack={true}
                isActive={activeNotes.includes(note)}
                onClick={handleKeyPress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
