import { memo } from 'react';
import { motion } from 'framer-motion';
import type { ChordDef } from '../../types';

interface ProgressionSlotProps {
  index: number;
  chord: ChordDef | null;
  isActive: boolean;
  isModified: boolean;
  onClick: () => void;
  romanNumeral?: string;
}

const QUALITY_COLORS: Record<string, string> = {
  maj: '#15ccbe', // Cyan for Maj
  min: '#3b82f6', // Blue for Min
  dim: '#6b7280', // Gray for Dim
  aug: '#ff2a75', // Neon Pink for Aug
  sus4: '#8b5cf6', // Violet for Sus
  sus2: '#8b5cf6',
  dom7: '#f59e0b', // Orange for Dom
};

function getChordColor(quality: string): string {
  for (const [key, color] of Object.entries(QUALITY_COLORS)) {
    if (quality.startsWith(key)) return color;
  }
  return '#f59e0b';
}

export const ProgressionSlot = memo(function ProgressionSlot({
  index,
  chord,
  isActive,
  isModified,
  onClick,
  romanNumeral,
}: ProgressionSlotProps) {
  const accentColor = chord ? getChordColor(chord.quality) : '#333333';

  return (
    <motion.button
      type="button"
      data-testid={`chord-slot-${index}`}
      onClick={onClick}
      layout
      animate={{
        scale: isActive ? 1.05 : 1,
        y: isActive ? -5 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        boxShadow: isActive ? `0 10px 25px -5px ${accentColor}80, 0 0 15px ${accentColor}40` : '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        borderColor: isActive ? accentColor : `${accentColor}30`,
        background: isActive ? `conic-gradient(from 180deg at 50% 50%, rgba(0,0,0,0) 0deg, ${accentColor}20 180deg, rgba(0,0,0,0) 360deg), #111` : '#111',
      }}
      className={`w-[72px] h-[96px] shrink-0 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer relative overflow-hidden group hover:border-[${accentColor}80]`}
    >
      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{ 
          backgroundColor: accentColor, 
          boxShadow: `0 0 8px ${accentColor}`,
        }}
      />

      {/* Roman numeral label */}
      {romanNumeral && (
        <span className="text-[11px] font-mono font-medium tracking-widest text-[#a1a1aa] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
          {romanNumeral}
        </span>
      )}

      {/* Chord symbol */}
      <span
        className="text-lg font-serif font-bold italic tracking-wider leading-none mt-1"
        style={{ 
          color: chord ? '#fff' : '#666',
          textShadow: chord ? `0 0 10px ${accentColor}80` : 'none',
        }}
      >
        {chord?.symbol ?? '-'}
      </span>
      
      {/* Step number on bottom */}
      <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-mono text-[#555] group-hover:text-[#888]">
        {index + 1}
      </span>

      {/* Modified indicator */}
      {isModified && (
        <span 
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" 
          style={{ backgroundColor: accentColor, boxShadow: `0 0 5px ${accentColor}` }}
          title="已替换" 
        />
      )}
    </motion.button>
  );
});
