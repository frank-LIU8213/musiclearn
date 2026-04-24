import { memo } from 'react';
import { ProgressionSlot } from './ProgressionSlot';
import type { ProgressionSlot as ProgressionSlotType } from '../../types';

interface ProgressionPlayerProps {
  slots: ProgressionSlotType[];
  currentIndex: number;
  isPlaying: boolean;
  onSlotClick: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const ProgressionPlayer = memo(function ProgressionPlayer({
  slots,
  currentIndex,
  isPlaying,
  onSlotClick,
  onPlay,
  onPause,
  onStop,
}: ProgressionPlayerProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {slots.map((slot) => (
          <ProgressionSlot
            key={slot.index}
            index={slot.index}
            chord={slot.chord}
            isActive={currentIndex === slot.index && isPlaying}
            isModified={slot.isModified}
            onClick={() => onSlotClick(slot.index)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPlay}
          disabled={slots.length === 0}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="播放"
        >
          {isPlaying ? '播放中' : '播放'}
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!isPlaying}
          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          暂停
        </button>
        <button
          type="button"
          onClick={onStop}
          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
        >
          停止
        </button>
      </div>
    </div>
  );
});
