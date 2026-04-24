import { useEffect, useRef, memo } from 'react';
import type { ChordDef, NoteName } from '../../types';
import { noteToMidi } from '../../lib/music-theory/note';

interface VoiceLeadingCanvasProps {
  fromChord: ChordDef | null;
  toChord: ChordDef | null;
  duration?: number;
  isAnimating?: boolean;
}

interface VoiceDot {
  fromNote: NoteName;
  toNote: NoteName;
  fromY: number;
  toY: number;
  x: number;
  color: string;
  isCommonTone: boolean;
}

const NOTE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const VoiceLeadingCanvas = memo(function VoiceLeadingCanvas({
  fromChord,
  toChord,
  duration = 500,
  isAnimating = false,
}: VoiceLeadingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const voiceDots = useRef<VoiceDot[]>([]);

  useEffect(() => {
    if (!fromChord || !toChord || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Calculate voice dots
    const fromNotes = fromChord.notes;
    const toNotes = toChord.notes;

    const dots: VoiceDot[] = [];
    const usedToIndices = new Set<number>();

    // Match notes (simple greedy matching by closest pitch)
    for (let i = 0; i < fromNotes.length; i++) {
      const fromNote = fromNotes[i];
      const fromMidi = noteToMidi(fromNote);

      let bestMatch = -1;
      let bestDistance = Infinity;

      for (let j = 0; j < toNotes.length; j++) {
        if (usedToIndices.has(j)) continue;
        const toMidi = noteToMidi(toNotes[j]);
        const distance = Math.abs(toMidi - fromMidi);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = j;
        }
      }

      if (bestMatch >= 0) {
        usedToIndices.add(bestMatch);
        const toNote = toNotes[bestMatch];
        const toMidi = noteToMidi(toNote);
        const isCommonTone = fromMidi === toMidi;

        // Map MIDI to Y position (higher pitch = lower Y)
        const minMidi = 48; // C3
        const maxMidi = 84; // B5
        const fromY = height - ((noteToMidi(fromNote) - minMidi) / (maxMidi - minMidi)) * height * 0.8 - height * 0.1;
        const toY = height - ((toMidi - minMidi) / (maxMidi - minMidi)) * height * 0.8 - height * 0.1;

        dots.push({
          fromNote,
          toNote,
          fromY,
          toY,
          x: width / 2,
          color: NOTE_COLORS[i % NOTE_COLORS.length],
          isCommonTone,
        });
      }
    }

    voiceDots.current = dots;

    // Draw static state
    const draw = (progress: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw voice dots and paths
      for (const dot of dots) {
        const currentY = dot.fromY + (dot.toY - dot.fromY) * progress;

        // Draw path line
        ctx.strokeStyle = dot.color + '40';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(width * 0.2, dot.fromY);
        ctx.lineTo(width * 0.8, dot.toY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw current dot
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(width * 0.2 + (width * 0.6) * progress, currentY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw note label
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          progress < 0.5 ? dot.fromNote : dot.toNote,
          width * 0.2 + (width * 0.6) * progress,
          currentY - 14
        );
      }
    };

    if (isAnimating) {
      startTimeRef.current = performance.now();

      const animate = (now: number) => {
        const elapsed = now - (startTimeRef.current ?? now);
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-in-out)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        draw(eased);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      draw(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fromChord, toChord, duration, isAnimating]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 border border-border rounded-lg bg-card"
      aria-label="声部流动动画"
    />
  );
});
