import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChordDef, NoteRole } from '../../types';
import { getNoteRoles, getChordExplanation } from '../../lib/music-theory/chord';
import { getNoteNameWithoutOctave } from '../../lib/music-theory/note';
import { synthEngine } from '../../lib/audio-engine/synth';

interface ChordInfoPanelProps {
  chord: ChordDef | null;
}

const ROLE_LABELS: Record<NoteRole, { label: string; color: string }> = {
  root: { label: '根音', color: '#2563EB' },
  third: { label: '三音', color: '#16A34A' },
  fifth: { label: '五音', color: '#EA580C' },
  seventh: { label: '七音', color: '#7C3AED' },
  extension: { label: '延伸音', color: '#DB2777' },
};

export const ChordInfoPanel = memo(function ChordInfoPanel({ chord }: ChordInfoPanelProps) {
  return (
    <div className="p-5 border border-border rounded-xl bg-card overflow-hidden">
      <AnimatePresence mode="wait">
        {!chord ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-muted-foreground text-center py-8"
          >
            选择一个和弦进行开始探索
          </motion.p>
        ) : (
          <ChordInfo key={chord.symbol} chord={chord} />
        )}
      </AnimatePresence>
    </div>
  );
});

const ChordInfo = memo(function ChordInfo({ chord }: { chord: ChordDef }) {
  const roles = getNoteRoles(chord);
  const explanation = getChordExplanation(chord.quality);
  const notes = chord.notes.map((note) => {
    const role = roles.get(note);
    const roleInfo = role ? ROLE_LABELS[role] : null;
    return { note, role, roleInfo };
  });

  const handlePlayChord = () => {
    if (synthEngine.ready) synthEngine.playChord(chord.notes, 1.0);
  };

  const handleArpeggio = () => {
    if (synthEngine.ready) synthEngine.playSequence(chord.notes, 0.15, 0.06);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-foreground">{chord.symbol}</span>
        <span className="text-sm text-muted-foreground">
          {explanation.name}
          {chord.inversion ? ` (${chord.inversion === 1 ? '第一' : chord.inversion === 2 ? '第二' : '第三'}转位)` : ' (原位)'}
        </span>
      </div>

      {chord.inversion !== undefined && chord.inversion > 0 && (
        <div className="mb-4 p-2 bg-primary-500/5 border border-primary-500/20 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-primary-400 tracking-widest mb-1">Inversion Active</div>
          <p className="text-xs text-primary-300">
            低音已变为 <span className="font-bold underline">{getNoteNameWithoutOctave(chord.bass ?? '')}</span>。
            转位常用于使声部连接更顺滑，避免低音大幅跳跃。
          </p>
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          构成音
        </div>
        <div className="flex flex-wrap gap-2">
          {notes.map(({ note, roleInfo }) => (
            <span
              key={note}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border"
              style={{
                borderColor: roleInfo?.color ?? '#d1d5db',
                backgroundColor: roleInfo ? `${roleInfo.color}10` : '#f9fafb',
                color: roleInfo?.color ?? '#6b7280',
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: roleInfo?.color ?? '#d1d5db' }}
              />
              {getNoteNameWithoutOctave(note)}
              {roleInfo && (
                <span className="text-xs opacity-60">{roleInfo.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          结构
        </div>
        <p className="text-sm text-foreground">{explanation.structure}</p>
      </div>

      <div className="mb-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          色彩
        </div>
        <p className="text-sm text-foreground">{explanation.mood}</p>
      </div>

      <div className="mb-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          用法
        </div>
        <p className="text-sm text-foreground">{explanation.usage}</p>
      </div>

      <div className="mb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          常见于
        </div>
        <p className="text-sm text-muted-foreground">{explanation.commonIn}</p>
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          type="button"
          onClick={handlePlayChord}
          className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          试听和弦
        </button>
        <button
          type="button"
          onClick={handleArpeggio}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
        >
          琶音分解
        </button>
      </div>
    </motion.div>
  );
});
