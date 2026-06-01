import { memo } from 'react';
import { ProgressionSlot } from './ProgressionSlot';
import { synthEngine } from '../../lib/audio-engine/synth';
import { PlayButton } from '../ui/PlayButton';
import type { ProgressionSlot as ProgressionSlotType, ChordDef } from '../../types';

interface ProgressionPlayerProps {
  slots: ProgressionSlotType[];
  currentIndex: number;
  isPlaying: boolean;
  currentChord?: ChordDef | null;
  numerals?: string[];
  onSlotClick: (index: number) => void;
  onAddSlot: () => void;
  onRemoveSlot: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const ProgressionPlayer = memo(function ProgressionPlayer({
  slots,
  currentIndex,
  isPlaying,
  currentChord,
  numerals,
  onSlotClick,
  onAddSlot,
  onRemoveSlot,
  onPlay,
  onPause,
  onStop,
}: ProgressionPlayerProps) {
  const handleArpeggioUp = () => {
    if (!currentChord || !synthEngine.ready) return;
    synthEngine.playSequence(currentChord.notes, 0.15, 0.05);
  };

  const handleArpeggioDown = () => {
    if (!currentChord || !synthEngine.ready) return;
    synthEngine.playSequence([...currentChord.notes].reverse(), 0.15, 0.05);
  };

  return (
    <div className="flex items-center gap-6">
      {/* Play Controls - HUD Style */}
      <div className="flex items-center gap-4 bg-black/30 p-2 rounded-xl border border-white/5 shadow-inner grow-0 shrink-0">
        <PlayButton 
          isPlaying={isPlaying} 
          onClick={isPlaying ? onPause : onPlay} 
        />
        
        <button
          type="button"
          onClick={onStop}
          title="Stop & Reset"
          className="h-12 w-12 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>

        {/* Arpeggio controls */}
        <div className="flex flex-col gap-1 pl-4 border-l border-white/10">
          <button
            type="button"
            onClick={handleArpeggioUp}
            disabled={!currentChord}
            title="Arpeggio Up"
            className="w-8 h-[22px] flex items-center justify-center border border-white/10 rounded text-[10px] bg-white/5 hover:bg-white/10 hover:border-primary-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-colors text-primary-400"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={handleArpeggioDown}
            disabled={!currentChord}
            title="Arpeggio Down"
            className="w-8 h-[22px] flex items-center justify-center border border-white/10 rounded text-[10px] bg-white/5 hover:bg-white/10 hover:border-primary-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-colors text-primary-400"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Slots Track */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 p-3 bg-black/40 rounded-xl border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] overflow-x-auto hide-scrollbar items-center">
          {slots.map((slot) => (
            <div key={slot.index} className="relative group">
              <ProgressionSlot
                index={slot.index}
                chord={slot.chord}
                isActive={currentIndex === slot.index && isPlaying}
                isModified={slot.isModified}
                onClick={() => onSlotClick(slot.index)}
                romanNumeral={numerals?.[slot.index]}
              />
              {slots.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSlot(slot.index);
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
                  aria-label="Remove Chord"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add Button */}
          <button
            onClick={onAddSlot}
            className="w-12 h-16 shrink-0 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-primary-400 transition-all text-muted-foreground group"
            title="Add New Chord"
          >
            <span className="text-xl font-light group-hover:scale-125 transition-transform">+</span>
            <span className="text-[8px] uppercase tracking-tighter opacity-60">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
});
