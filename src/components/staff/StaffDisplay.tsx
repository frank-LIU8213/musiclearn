import { useEffect, useRef, memo } from 'react';
import type { ChordDef } from '../../types';

interface StaffDisplayProps {
  chord: ChordDef | null;
  clef?: 'treble' | 'bass';
}

export const StaffDisplay = memo(function StaffDisplay({
  chord,
  clef = 'treble',
}: StaffDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<InstanceType<typeof import('vexflow').Renderer> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initStaff = async () => {
      try {
        const VF = await import('vexflow');
        const { Renderer, Stave, StaveNote, Formatter, Accidental } = VF;

        const container = containerRef.current;
        if (!container) return;

        // Clear previous content
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = 120;

        const renderer = new Renderer(container, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();
        
        // Base DAW theme colors
        const staffColor = '#555555';
        const noteColor = '#15ccbe'; // Neon Cyan

        // Create stave
        const stave = new Stave(10, 10, width - 20);
        stave.addClef(clef);
        stave.setContext(context);
        
        // Style Stave lines and clef
        context.setFillStyle(staffColor);
        context.setStrokeStyle(staffColor);
        stave.draw();

        // Add notes if chord is provided
        if (chord) {
          const noteKeys = chord.notes.map((note) => {
            const match = note.match(/^([A-G])(#|b)?(\d+)$/);
            if (!match) return null;
            const [, base, accidental, octave] = match;
            const vfOctave = parseInt(octave, 10);
            return {
              key: `${base.toLowerCase()}/${vfOctave}`,
              accidental: accidental || '',
            };
          }).filter(Boolean);

          if (noteKeys.length > 0) {
            const keys = noteKeys.map((n) => n!.key);
            const staveNote = new StaveNote({
              clef,
              keys,
              duration: 'w',
            });

            // Set note color
            staveNote.setStyle({ fillStyle: noteColor, strokeStyle: noteColor });

            // Add accidentals
            noteKeys.forEach((noteInfo, index) => {
              if (noteInfo!.accidental === '#') {
                const acc = new Accidental('#');
                staveNote.addModifier(acc, index);
              } else if (noteInfo!.accidental === 'b') {
                const acc = new Accidental('b');
                staveNote.addModifier(acc, index);
              }
            });

            // Format and draw
            const voice = new VF.Voice({ numBeats: 4, beatValue: 4 });
            voice.addTickables([staveNote]);

            const formatter = new Formatter();
            formatter.joinVoices([voice]).format([voice], width - 40);

            voice.setStave(stave);
            voice.setContext(context);
            voice.draw();
          }
        }

        rendererRef.current = renderer;
      } catch (err) {
        console.error('VexFlow initialization error:', err);
      }
    };

    initStaff();
  }, [chord, clef]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[120px] bg-transparent flex justify-center overflow-hidden"
      aria-label="五线谱显示"
    />
  );
});
