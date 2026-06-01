import { memo, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChordDef, ProgressionSlot, ChordQuality } from '../../types';
import { getChordVariants, getChordInversions, buildChord, QUALITY_NAMES } from '../../lib/music-theory/chord';
import { synthEngine } from '../../lib/audio-engine/synth';
import { getNoteNameWithoutOctave } from '../../lib/music-theory/note';

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
  const [activeTab, setActiveTab] = useState<'variants' | 'inversions' | 'custom'>('variants');
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedQuality, setSelectedQuality] = useState<ChordQuality>('maj');

  // Sync state when slot changes
  useEffect(() => {
    if (slot) {
      const root = slot.chord.root.replace(/\d+$/, '');
      setSelectedRoot(root || 'C');
      setSelectedQuality(slot.chord.quality);
    }
  }, [slot, isOpen]); // Also sync when opened

  if (!slot) return null;

  const variants = getChordVariants(slot.chord);
  const inversions = getChordInversions(slot.chord.root, slot.chord.quality);
  
  const rootNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const currentOctave = slot.chord.root.match(/\d+$/)?.[0] || '4';
  
  // Safety wrapper for buildChord
  const customChord = useMemo(() => {
    const root = selectedRoot || 'C';
    return buildChord(`${root}${currentOctave}`, selectedQuality);
  }, [selectedRoot, selectedQuality, currentOctave]);

  const handleReplace = (chord: ChordDef) => {
    if (synthEngine.ready) {
      synthEngine.playChord(chord.notes, 0.8);
    }
    onReplace(slot.index, chord);
    onClose();
  };

  const handlePreview = (chord: ChordDef) => {
    if (synthEngine.ready) {
      synthEngine.playChord(chord.notes, 0.6);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-[440px] max-w-[95vw] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">配置和弦</h3>
                <p className="text-xs text-muted-foreground mt-1">变体、转位或自由构建</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                ✕
              </button>
            </div>

            {/* Current Selection Display */}
            <div className="mb-6 p-4 bg-primary-500/5 border border-primary-500/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-primary-400 tracking-widest mb-1">
                  {activeTab === 'custom' ? '实时预览' : '当前选择'}
                </div>
                <div className="text-2xl font-black text-primary-500 font-serif leading-none">
                  {activeTab === 'custom' ? customChord.symbol : slot.chord.symbol}
                </div>
              </div>
              <button 
                onClick={() => handleReplace(activeTab === 'custom' ? customChord : slot.chord)}
                className="px-4 py-2 bg-primary-500 text-black text-sm font-bold rounded-lg hover:bg-primary-400 transition-colors"
              >
                确认使用
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-muted rounded-lg mb-6">
              {[
                { id: 'variants', label: '智能变体' },
                { id: 'inversions', label: '转位连接' },
                { id: 'custom', label: '全量选择' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.id ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[250px] max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'custom' ? (
                <div className="space-y-6 py-2">
                  {/* Root Picker */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3 block">根音 (Root)</label>
                    <div className="grid grid-cols-6 gap-2">
                      {rootNotes.map(root => (
                        <button
                          key={root}
                          onClick={() => {
                            setSelectedRoot(root);
                            handlePreview(buildChord(`${root}${currentOctave}`, selectedQuality));
                          }}
                          className={`py-2 text-sm font-bold rounded-md border transition-all ${
                            selectedRoot === root 
                              ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                              : 'border-border hover:border-primary-500/30'
                          }`}
                        >
                          {root}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Picker */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3 block">性质 (Quality)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(QUALITY_NAMES) as ChordQuality[]).map(q => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            handlePreview(buildChord(`${selectedRoot}${currentOctave}`, q));
                          }}
                          className={`px-3 py-2 text-left text-xs font-medium rounded-lg border transition-all ${
                            selectedQuality === q 
                              ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                              : 'border-border hover:border-primary-500/30'
                          }`}
                        >
                          <div className="font-bold">{q}</div>
                          <div className="opacity-60">{QUALITY_NAMES[q]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(activeTab === 'variants' ? variants : inversions).map((opt) => (
                    <button
                      key={opt.symbol}
                      onClick={() => handleReplace(opt)}
                      onMouseEnter={() => handlePreview(opt)}
                      className="group w-full text-left p-3 rounded-xl border border-border hover:border-primary-500/50 hover:bg-primary-500/[0.02] transition-all relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="font-bold text-lg group-hover:text-primary-400 transition-colors font-serif">{opt.symbol}</span>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {opt.notes.map(getNoteNameWithoutOctave).join(' · ')}
                          </div>
                          {activeTab === 'inversions' && (
                            <div className="text-[9px] text-primary-500/60 font-bold uppercase tracking-tighter">
                              {opt.inversion === 0 ? 'Root Position' : `${opt.inversion}${opt.inversion === 1 ? 'st' : opt.inversion === 2 ? 'nd' : 'rd'} Inv.`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
