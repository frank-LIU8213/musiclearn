import { memo } from 'react';
import type { ProgressionTemplate } from '../../types';

interface ProgressionExplanationProps {
  template: ProgressionTemplate | null;
}

export const ProgressionExplanation = memo(function ProgressionExplanation({
  template,
}: ProgressionExplanationProps) {
  if (!template) return null;

  return (
    <div className="space-y-4 text-white/70 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(21,204,190,0.6)]" />
        <h3 className="text-base font-mono text-primary-400 uppercase tracking-widest font-bold">
          Engine Theory
        </h3>
      </div>
      
      <div className="space-y-3">
        {template.explanation.split('\n').map((paragraph, idx) => (
          paragraph.trim() && (
            <p 
              key={idx} 
              className={`text-[13px] leading-relaxed font-sans ${
                paragraph.startsWith('【') ? 'text-primary-300 font-semibold mt-4' : 'text-gray-300'
              }`}
            >
              {paragraph}
            </p>
          )
        ))}
      </div>

      {template.exampleSongs.length > 0 && (
        <div className="pt-4 mt-6 border-t border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#ff2a75] mb-2 opacity-80">
            Reference Tracks
          </div>
          <ul className="space-y-1.5 flex flex-wrap gap-2">
            {template.exampleSongs.map((song) => (
              <li 
                key={song} 
                className="text-xs bg-black/40 border border-white/5 px-2 py-1 rounded inline-block text-gray-400 font-sans"
              >
                {song}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
