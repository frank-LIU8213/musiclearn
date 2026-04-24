import { memo } from 'react';
import type { NoteName } from '../../types';

interface PianoKeyProps {
  note: NoteName;
  isBlack: boolean;
  isActive: boolean;
  onClick: (note: NoteName) => void;
}

export const PianoKey = memo(function PianoKey({
  note,
  isBlack,
  isActive,
  onClick,
}: PianoKeyProps) {
  const baseClasses = isBlack
    ? 'w-8 h-24 bg-gray-900 rounded-b-md absolute -top-0 z-10'
    : 'w-12 h-36 bg-white border border-gray-300 rounded-b-md flex flex-col justify-end pb-2';

  const activeClasses = isActive
    ? isBlack
      ? ' bg-blue-500'
      : ' bg-blue-300'
    : '';

  const hoverClasses = isBlack
    ? ' hover:bg-gray-800 active:bg-gray-700'
    : ' hover:bg-gray-50 active:bg-gray-100';

  return (
    <button
      type="button"
      data-testid={`key-${note}`}
      className={`${baseClasses}${activeClasses}${hoverClasses} transition-colors cursor-pointer select-none`}
      onClick={() => onClick(note)}
      aria-label={`Play ${note}`}
    >
      {!isBlack && (
        <span className="text-xs text-gray-400 font-medium">{note}</span>
      )}
    </button>
  );
});
