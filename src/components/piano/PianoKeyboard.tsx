import { memo, useMemo, useEffect, useRef, useState } from 'react';
import { PianoKey } from './PianoKey';
import type { NoteName, NoteRole } from '../../types';
import { getNoteRange } from '../../lib/music-theory/note';

interface PianoKeyboardProps {
  activeNoteRoles?: Map<NoteName, NoteRole>;
  onKeyPress?: (note: NoteName) => void;
  range?: [NoteName, NoteName];
}

const WHITE_KEY_WIDTH = 48;
const BLACK_KEY_OFFSET = 0.55;

export const PianoKeyboard = memo(function PianoKeyboard({
  activeNoteRoles = new Map(),
  onKeyPress,
  range = ['C3', 'E5'],
}: PianoKeyboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyWidth, setKeyWidth] = useState(WHITE_KEY_WIDTH);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w < 400) setKeyWidth(28);
        else if (w < 600) setKeyWidth(36);
        else setKeyWidth(WHITE_KEY_WIDTH);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const whiteKeyPositions = useMemo(() => {
    const map: Record<string, number> = {};
    whiteKeys.forEach((note, index) => {
      map[note] = index;
    });
    return map;
  }, [whiteKeys]);

  const keyboardWidth = whiteKeys.length * keyWidth;

  return (
    <div ref={containerRef} className="relative select-none" style={{ width: keyboardWidth, minWidth: '100%' }}>
      {/* White keys container */}
      <div className="flex">
        {whiteKeys.map((note) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={false}
            role={activeNoteRoles.get(note) ?? null}
            onClick={handleKeyPress}
          />
        ))}
      </div>

      {/* Black keys overlay */}
      <div
        className="absolute top-0 left-0 pointer-events-none z-10"
        style={{ width: keyboardWidth, height: 144 }}
      >
        {blackKeys.map((note) => {
          const match = note.match(/^([A-G])#(\d+)$/);
          if (!match) return null;
          const [, baseNote, octave] = match;
          const whiteNote = `${baseNote}${octave}`;
          const whiteIndex = whiteKeyPositions[whiteNote];

          if (whiteIndex === undefined) return null;

          const leftPosition = (whiteIndex + BLACK_KEY_OFFSET) * keyWidth;

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
                role={activeNoteRoles.get(note) ?? null}
                onClick={handleKeyPress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
