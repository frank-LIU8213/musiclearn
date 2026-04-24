import { memo } from 'react';
import type { ChordDef, ProgressionSlot } from '../../types';
import { getChordVariants } from '../../lib/music-theory/chord';
import { synthEngine } from '../../lib/audio-engine/synth';

interface ChordReplacerProps {
  slot: ProgressionSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onReplace: (slotIndex: number, newChord: ChordDef) => void;
}

export const ChordReplacer = memo(function ChordReplacer({
  slot,
  isOpen,
  onClose,
  onReplace,
}: ChordReplacerProps) {
  if (!isOpen || !slot) return null;

  const variants = getChordVariants(slot.chord);

  const handleReplace = (chord: ChordDef) => {
    if (synthEngine.ready) {
      synthEngine.playChord(chord.notes, 0.8);
    }
    onReplace(slot.index, chord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl shadow-lg p-6 w-80 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            替换和弦
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">当前和弦</div>
          <div className="text-xl font-bold">{slot.chord.symbol}</div>
          <div className="text-sm text-muted-foreground">{slot.chord.notes.join(' ')}</div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {variants.map((variant) => (
            <button
              key={variant.symbol}
              onClick={() => handleReplace(variant)}
              className="w-full text-left p-3 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{variant.symbol}</span>
                <span className="text-xs text-muted-foreground">{variant.notes.join(' ')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
