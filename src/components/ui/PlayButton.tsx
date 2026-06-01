import './PlayButton.css';
import { memo } from 'react';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  iconPlay?: React.ReactNode;
  iconPause?: React.ReactNode;
}

export const PlayButton = memo(function PlayButton({
  isPlaying,
  onClick,
  className = '',
  variant = 'primary',
  iconPlay,
  iconPause,
}: PlayButtonProps) {
  return (
    <button
      className={`play-button ${variant === 'secondary' ? 'secondary' : ''} ${className}`}
      onClick={onClick}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <span className="icon flex items-center justify-center">
        {isPlaying ? (
          iconPause || (
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M14 10h6v28h-6zM28 10h6v28h-6z" />
            </svg>
          )
        ) : (
          iconPlay || (
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M16 10v28l22-14z" />
            </svg>
          )
        )}
      </span>
      <span className="text">{isPlaying ? 'Pause' : 'Play'}</span>
    </button>
  );
});
