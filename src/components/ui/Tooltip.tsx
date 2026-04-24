import { memo, useState, useRef } from 'react';
import type { ChordDef } from '../../types';
import { getChordTooltipData } from '../../lib/music-theory/chord';

interface TooltipProps {
  chord: ChordDef | null;
  children: React.ReactNode;
}

export const Tooltip = memo(function Tooltip({ chord, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!chord) return <>{children}</>;

  const data = getChordTooltipData(chord);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          <div className="font-semibold">{data.chineseName}</div>
          <div className="text-gray-300">构成: {data.notesDisplay}</div>
          <div className="text-gray-400 text-xs mt-1">{data.mood}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
});
