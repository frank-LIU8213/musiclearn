import { memo } from 'react';
import type { ChordDef } from '../../types';

interface ProgressionSlotProps {
  index: number;
  chord: ChordDef | null;
  isActive: boolean;
  isModified: boolean;
  onClick: () => void;
}

export const ProgressionSlot = memo(function ProgressionSlot({
  index,
  chord,
  isActive,
  isModified,
  onClick,
}: ProgressionSlotProps) {
  return (
    <button
      type="button"
      data-testid={`chord-slot-${index}`}
      onClick={onClick}
      className={`w-16 h-16 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
        isActive
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-300'
          : isModified
            ? 'border-amber-400 bg-amber-50'
            : 'border-border bg-card hover:border-primary-300'
      }`}
    >
      <span className="text-xs text-muted-foreground">{index + 1}</span>
      <span className="text-lg font-semibold">{chord?.symbol ?? '-'}</span>
      {isModified && (
        <span className="text-[10px] text-amber-600">已替换</span>
      )}
    </button>
  );
});
