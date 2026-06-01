import { memo, useMemo, useCallback, useState } from 'react';
import type { ChordDef, NoteName } from '../../types';
import { noteToMidi, getNoteNameWithoutOctave } from '../../lib/music-theory/note';
import type { VoiceMovementType } from '../../types';

interface VoiceLeadingGridProps {
  chords: ChordDef[];
  currentIndex: number;
  isPlaying: boolean;
  onChordClick?: (index: number) => void;
}

interface VoiceDot {
  note: NoteName;
  role: string;
  midi: number;
}

interface VoiceRow {
  dots: (VoiceDot | null)[];
  movements: (VoiceMovementType | null)[];
  semitones: (number | null)[];
}

interface Position {
  x: number;
  y: number;
}

const PADDING = { top: 30, right: 24, bottom: 120, left: 80 };
const COL_WIDTH = 140;
const ROW_HEIGHT = 70;
const DOT_RADIUS = 22;

const VOICE_COLORS = ['#15ccbe', '#3b82f6', '#ff2a75', '#8b5cf6', '#f59e0b', '#0891B2'];

function midiToMovementType(diff: number): { type: VoiceMovementType; semitones: number } {
  const abs = Math.abs(diff);
  if (abs === 0) return { type: 'static', semitones: 0 };
  if (abs <= 2) return { type: 'step', semitones: diff };
  if (abs <= 4) return { type: 'skip', semitones: diff };
  return { type: 'leap', semitones: diff };
}

function buildVoiceRows(chords: ChordDef[]): VoiceRow[] {
  if (chords.length === 0) return [];

  // Determine max voice count
  const maxVoices = Math.max(...chords.map((c) => c.notes.length), 1);

  // For each chord, sort notes by pitch, then pad to maxVoices with nulls
  const chordDots: (VoiceDot | null)[][] = chords.map((chord) => {
    const sorted = [...chord.notes].sort((a, b) => noteToMidi(a) - noteToMidi(b));
    return sorted.map((note, i) => ({
      note,
      role: i === 0 ? '低' : i === sorted.length - 1 ? '高' : '中',
      midi: noteToMidi(note),
    }));
  });

  // Build rows: each row is voice position index
  const rows: VoiceRow[] = [];
  for (let v = 0; v < maxVoices; v++) {
    const dots: (VoiceDot | null)[] = chordDots.map((cd) => cd[v] ?? null);
    const movements: (VoiceMovementType | null)[] = [];
    const semitones: (number | null)[] = [];

    for (let c = 0; c < chords.length - 1; c++) {
      const from = dots[c];
      const to = dots[c + 1];
      if (from && to) {
        const diff = noteToMidi(to.note) - noteToMidi(from.note);
        const { type, semitones: st } = midiToMovementType(diff);
        movements.push(type);
        semitones.push(st);
      } else {
        movements.push(null);
        semitones.push(null);
      }
    }

    rows.push({ dots, movements, semitones });
  }

  return rows;
}

function getLineStyle(type: VoiceMovementType): { dash: string; width: number; opacity: number } {
  switch (type) {
    case 'static':
      return { dash: 'none', width: 2.5, opacity: 0.8 };
    case 'step':
      return { dash: 'none', width: 1.5, opacity: 0.6 };
    case 'skip':
      return { dash: '6,4', width: 1.5, opacity: 0.5 };
    case 'leap':
      return { dash: '3,5', width: 1.5, opacity: 0.4 };
  }
}

const MOVEMENT_LABELS: Record<VoiceMovementType, string> = {
  static: '共同音（保持）',
  step: '级进 (1–2半音)',
  skip: '小跳 (3–4半音)',
  leap: '大跳 (5+半音)',
};

export const VoiceLeadingGrid = memo(function VoiceLeadingGrid({
  chords,
  currentIndex,
  isPlaying,
  onChordClick,
}: VoiceLeadingGridProps) {
  const [highlightedVoice, setHighlightedVoice] = useState<number | null>(null);

  const rows = useMemo(() => buildVoiceRows(chords), [chords]);

  const svgWidth = chords.length * COL_WIDTH + PADDING.left + PADDING.right;
  const svgHeight = rows.length * ROW_HEIGHT + PADDING.top + PADDING.bottom;

  const getDotPosition = useCallback(
    (colIndex: number, rowIndex: number): Position => {
      const x = PADDING.left + colIndex * COL_WIDTH + COL_WIDTH / 2;
      const y = PADDING.top + rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
      return { x, y };
    },
    [rows.length]
  );

  const colCenters = useMemo(
    () => chords.map((_, i) => PADDING.left + i * COL_WIDTH + COL_WIDTH / 2),
    [chords.length]
  );

  // Compute which line segments to highlight for the current playback
  const activeTransition = isPlaying && currentIndex > 0 ? currentIndex - 1 : -1;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full block"
      preserveAspectRatio="xMidYMid meet"
      aria-label="声部流动分析"
      role="img"
      style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))' }}
    >
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid lines */}
        {chords.map((_, ci) => {
          const cx = colCenters[ci];
          const isCurrent = ci === currentIndex;
          return (
            <g 
              key={`col-bg-${ci}`} 
              onClick={() => onChordClick?.(ci)}
              className={onChordClick ? 'cursor-pointer' : ''}
            >
              {/* Invisible hit area for clicking */}
              <rect
                x={cx - COL_WIDTH / 2}
                y={0}
                width={COL_WIDTH}
                height={svgHeight}
                fill="transparent"
              />
              <line
                x1={cx}
                y1={PADDING.top}
                x2={cx}
                y2={PADDING.top + rows.length * ROW_HEIGHT}
                stroke={isCurrent ? '#15ccbe' : '#333'}
                strokeWidth={isCurrent ? 2 : 1}
                strokeDasharray={isCurrent && isPlaying ? 'none' : '4,4'}
                opacity={isCurrent ? (isPlaying ? 0.5 : 0.8) : 0.4}
              />
              {/* Active column glow */}
              {isCurrent && isPlaying && (
                <rect
                  x={cx - COL_WIDTH / 2 + 4}
                  y={PADDING.top}
                  width={COL_WIDTH - 8}
                  height={rows.length * ROW_HEIGHT}
                  fill="#15ccbe"
                  opacity={0.08}
                  rx={8}
                  filter="url(#neon-glow)"
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}

        {/* Voice rows */}
        {rows.map((row, ri) => {
          const isHighlighted = highlightedVoice === ri || highlightedVoice === null;
          const rowColor = VOICE_COLORS[ri % VOICE_COLORS.length];

          return (
            <g
              key={`row-${ri}`}
              opacity={isHighlighted ? 1 : 0.3}
              onMouseEnter={() => setHighlightedVoice(ri)}
              onMouseLeave={() => setHighlightedVoice(null)}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            >
              {/* Voice label */}
              <text
                x={PADDING.left - 12}
                y={PADDING.top + ri * ROW_HEIGHT + ROW_HEIGHT / 2 + 5}
                textAnchor="end"
                fill={rowColor}
                fontSize={14}
                fontWeight={600}
              >
                声部 {ri + 1}
              </text>

              {/* Connecting lines between chords */}
              {row.dots.map((dot, ci) => {
                if (ci >= chords.length - 1) return null;
                const nextDot = row.dots[ci + 1];
                if (!dot || !nextDot) return null;

                const from = getDotPosition(ci, ri);
                const to = getDotPosition(ci + 1, ri);
                const movement = row.movements[ci];
                if (!movement) return null;

                const style = getLineStyle(movement);
                const isActiveSegment = ci === activeTransition;
                const segmentOpacity = isActiveSegment ? 1 : style.opacity;
                const segmentWidth = isActiveSegment ? style.width + 1 : style.width;

                const semitones = row.semitones[ci];
                const label = semitones !== null ? (semitones >= 0 ? `+${semitones}` : `${semitones}`) : '';

                return (
                  <g key={`line-${ri}-${ci}`}>
                    {/* Glowing under-line */}
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isActiveSegment ? '#15ccbe' : rowColor}
                      strokeWidth={segmentWidth * 2.5}
                      opacity={segmentOpacity * 0.3}
                      filter="url(#neon-glow)"
                    />
                    {/* Core line */}
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isActiveSegment ? '#fff' : rowColor}
                      strokeWidth={segmentWidth}
                      strokeDasharray={style.dash === 'none' ? undefined : style.dash}
                      opacity={isActiveSegment ? 1 : segmentOpacity + 0.2}
                    />
                    {/* Semitone label on the line midpoint */}
                    <rect
                      x={(from.x + to.x) / 2 - 16}
                      y={(from.y + to.y) / 2 - 10}
                      width={32}
                      height={20}
                      rx={6}
                      fill="#000"
                      stroke={isActiveSegment ? '#15ccbe' : rowColor}
                      strokeWidth={1}
                      opacity={0.9}
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 + 5}
                      textAnchor="middle"
                      fill={isActiveSegment ? '#fff' : (movement === 'static' ? '#16A34A' : rowColor)}
                      fontSize={12}
                      fontWeight={700}
                    >
                      {movement === 'static' ? '保持' : label}
                    </text>
                  </g>
                );
              })}

              {/* Note dots */}
              {row.dots.map((dot, ci) => {
                if (!dot) return null;
                const pos = getDotPosition(ci, ri);
                const isCurrent = ci === currentIndex && isPlaying;
                const displayNote = getNoteNameWithoutOctave(dot.note);

                return (
                  <g 
                    key={`dot-${ri}-${ci}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChordClick?.(ci);
                    }}
                  >
                    {/* Outer glow ring for current chord */}
                    {isCurrent && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={DOT_RADIUS + 6}
                        fill="none"
                        stroke="#15ccbe"
                        strokeWidth={2}
                        opacity={0.8}
                        filter="url(#neon-glow)"
                      />
                    )}
                    {/* Base dot shadow glow */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={DOT_RADIUS}
                      fill={rowColor}
                      opacity={0.5}
                      filter="url(#neon-glow)"
                    />
                    {/* Dot circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={DOT_RADIUS - 1}
                      fill={rowColor}
                      opacity={1}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    {/* Note name */}
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={14}
                      fontWeight={800}
                      fontFamily="var(--font-mono)"
                    >
                      {displayNote}
                    </text>
                    {/* Octave subscript */}
                    <text
                      x={pos.x + DOT_RADIUS - 1}
                      y={pos.y + DOT_RADIUS - 1}
                      textAnchor="end"
                      fill="rgba(255,255,255,0.9)"
                      fontSize={10}
                      fontFamily="var(--font-mono)"
                    >
                      {dot.note.match(/\d+$/)?.[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Column labels (chord names) at top */}
        {chords.map((chord, ci) => {
          const cx = colCenters[ci];
          const isCurrent = ci === currentIndex;
          return (
            <g 
              key={`col-label-${ci}`}
              onClick={() => onChordClick?.(ci)}
              className={onChordClick ? 'cursor-pointer' : ''}
            >
              <text
                x={cx}
                y={PADDING.top - 10}
                textAnchor="middle"
                fill={isCurrent ? '#fff' : '#666'}
                fontSize={18}
                fontWeight={isCurrent ? 700 : 500}
                fontFamily="var(--font-serif)"
                style={{ textShadow: isCurrent ? '0 0 10px #15ccbe' : 'none' }}
              >
                {chord.symbol}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PADDING.left}, ${svgHeight - PADDING.bottom + 45})`}>
          {Object.entries(MOVEMENT_LABELS).map(([type, label], i) => {
            const style = getLineStyle(type as VoiceMovementType);
            const x = i * 150;
            return (
              <g key={`legend-${type}`} transform={`translate(${x}, 0)`}>
                <line
                  x1={0}
                  y1={8}
                  x2={36}
                  y2={8}
                  stroke="#555"
                  strokeWidth={style.width}
                  strokeDasharray={style.dash === 'none' ? undefined : style.dash}
                />
                <text x={44} y={12} fill="#888" fontSize={11} fontFamily="var(--font-mono)">
                  {label}
                </text>
              </g>
            );
          })}
          <text x={0} y={32} fill="#555" fontSize={10} fontFamily="var(--font-mono)">
            悬停声部行可高亮该声部的运动轨迹
          </text>
        </g>
      </svg>
  );
});
