import { memo } from 'react';
import type { NoteName, NoteRole } from '../../types';
import { getNoteNameWithoutOctave } from '../../lib/music-theory/note';

interface PianoKeyProps {
  note: NoteName;
  isBlack: boolean;
  role: NoteRole | null;
  onClick: (note: NoteName) => void;
}

const ROLE_COLORS: Record<NoteRole, string> = {
  root: '#15ccbe', // Cyan
  third: '#3b82f6', // Blue
  fifth: '#ff2a75', // Pink
  seventh: '#8b5cf6', // Violet
  extension: '#f59e0b', // Orange
};

export const PianoKey = memo(function PianoKey({
  note,
  isBlack,
  role,
  onClick,
}: PianoKeyProps) {
  const noteLabel = getNoteNameWithoutOctave(note);
  const glowColor = role ? ROLE_COLORS[role] : '#ffffff';

  // Base setup
  const baseClasses = isBlack 
    ? 'w-10 h-28 rounded-b-md z-10 mx-[-20px] relative transition-all duration-75 cursor-pointer flex flex-col justify-end pb-2' 
    : 'w-12 h-44 rounded-b-md border-r border-[#111] transition-all duration-75 cursor-pointer relative flex flex-col justify-end pb-2 z-0';

  let keyStyle: React.CSSProperties = {};

  if (isBlack) {
    if (role) {
      keyStyle = {
        background: `linear-gradient(to bottom, #222 0%, ${glowColor} 100%)`,
        boxShadow: `inset 0 4px 6px -1px rgba(255,255,255,0.2), 0 10px 20px -5px ${glowColor}80`,
        transform: 'translateY(2px)',
        borderBottom: `2px solid ${glowColor}`,
      };
    } else {
      keyStyle = {
        background: 'linear-gradient(to bottom, #222 0%, #000 100%)',
        boxShadow: 'inset 0 4px 6px -1px rgba(255,255,255,0.1), 0 5px 10px rgba(0,0,0,0.5)',
        borderBottom: '2px solid #000',
      };
    }
  } else {
    if (role) {
      keyStyle = {
        background: `linear-gradient(to bottom, #d4d4d4 0%, ${glowColor}50 100%)`,
        boxShadow: `inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -4px 10px ${glowColor}, 0 20px 25px -5px ${glowColor}50`,
        borderBottom: `4px solid ${glowColor}`,
        transform: 'translateY(2px)',
      };
    } else {
      keyStyle = {
        background: 'linear-gradient(to bottom, #f0f0f0 0%, #d4d4d4 100%)',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,1), 0 5px 10px rgba(0,0,0,0.2)',
        borderBottom: '4px solid #999',
      };
    }
  }

  return (
    <button
      type="button"
      data-testid={`key-${note}`}
      className={`${baseClasses} group active:translate-y-[4px]`}
      style={keyStyle}
      onClick={() => onClick(note)}
      aria-label={`Play ${note}${role ? ` (${role})` : ''}`}
    >
      {/* Label for white keys */}
      {!isBlack && (
        <span 
          className="text-xs font-mono font-bold tracking-widest transition-colors duration-200"
          style={{ color: role ? '#fff' : '#888', textShadow: role ? `0 0 5px ${glowColor}` : 'none' }}
        >
          {noteLabel}
        </span>
      )}

      {/* Label for black keys */}
      {isBlack && (
        <span 
          className="text-[9px] font-mono font-medium tracking-widest transition-colors duration-200 leading-none"
          style={{ color: role ? '#fff' : '#666', textShadow: role ? `0 0 5px ${glowColor}` : 'none' }}
        >
          {noteLabel}
        </span>
      )}

      {/* Role dot indicator */}
      {role && (
        <span 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" 
          style={{ backgroundColor: '#fff', boxShadow: `0 0 8px 2px ${glowColor}` }}
        />
      )}
    </button>
  );
});
