import { memo } from 'react';
import type { NoteName, ScaleType } from '../../types';

interface KeySelectorProps {
  keyNote: NoteName;
  scaleType: ScaleType;
  onKeyChange: (key: NoteName) => void;
  onScaleTypeChange: (type: ScaleType) => void;
}

const ALL_KEYS: { label: string; note: NoteName }[] = [
  { label: 'C', note: 'C4' },
  { label: 'C#', note: 'C#4' },
  { label: 'D', note: 'D4' },
  { label: 'D#', note: 'D#4' },
  { label: 'E', note: 'E4' },
  { label: 'F', note: 'F4' },
  { label: 'F#', note: 'F#4' },
  { label: 'G', note: 'G4' },
  { label: 'G#', note: 'G#4' },
  { label: 'A', note: 'A4' },
  { label: 'A#', note: 'A#4' },
  { label: 'B', note: 'B4' },
];

export const KeySelector = memo(function KeySelector({
  keyNote,
  scaleType,
  onKeyChange,
  onScaleTypeChange,
}: KeySelectorProps) {
  const currentPitchClass = keyNote.replace(/\d+$/, '');

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <select
        value={currentPitchClass}
        onChange={(e) => {
          const match = ALL_KEYS.find((k) => k.label === e.target.value);
          if (match) onKeyChange(match.note);
        }}
        className="bg-card border border-border rounded-lg px-2 py-1.5 text-foreground text-sm cursor-pointer hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        aria-label="选择调性"
      >
        {ALL_KEYS.map((k) => (
          <option key={k.note} value={k.label}>
            {k.label}
          </option>
        ))}
      </select>

      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => onScaleTypeChange('major')}
          className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
            scaleType === 'major'
              ? 'bg-primary-600 text-white'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
          aria-label="选择大调"
        >
          大调
        </button>
        <button
          type="button"
          onClick={() => onScaleTypeChange('minor')}
          className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
            scaleType === 'minor'
              ? 'bg-primary-600 text-white'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
          aria-label="选择小调"
        >
          小调
        </button>
      </div>
    </div>
  );
});
