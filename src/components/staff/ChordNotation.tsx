import { memo } from 'react';
import type { ChordDef } from '../../types';

interface ChordNotationProps {
  chord: ChordDef | null;
  size?: 'sm' | 'md' | 'lg';
}

export const ChordNotation = memo(function ChordNotation({
  chord,
  size = 'md',
}: ChordNotationProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  if (!chord) {
    return (
      <span className={`${sizeClasses[size]} text-muted-foreground`}>-</span>
    );
  }

  return (
    <span className={`${sizeClasses[size]} font-semibold text-foreground`}>
      {chord.symbol}
    </span>
  );
});
