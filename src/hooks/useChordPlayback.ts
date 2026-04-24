import { useState, useCallback, useRef } from 'react';
import { synthEngine } from '../lib/audio-engine/synth';
import type { ChordDef, PlaybackState } from '../types';

/**
 * Hook to manage chord and progression playback.
 */
export function useChordPlayback() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bpm, setBpm] = useState(120);
  const abortController = useRef<AbortController | null>(null);

  const playChord = useCallback(
    (chord: ChordDef, duration?: number) => {
      if (!synthEngine.ready) return;
      const beatDuration = duration ?? 60 / bpm * 2;
      synthEngine.playChord(chord.notes, beatDuration);
    },
    [bpm]
  );

  const playProgression = useCallback(
    async (chords: ChordDef[], startIndex: number = 0) => {
      if (!synthEngine.ready) return;

      // Cancel any existing playback
      if (abortController.current) {
        abortController.current.abort();
      }

      const controller = new AbortController();
      abortController.current = controller;

      setPlaybackState('playing');
      setCurrentIndex(startIndex);

      const beatDuration = 60 / bpm;
      const chordDuration = beatDuration * 2;

      try {
        for (let i = startIndex; i < chords.length; i++) {
          if (controller.signal.aborted) break;

          setCurrentIndex(i);
          synthEngine.playChord(chords[i].notes, chordDuration);

          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, chordDuration * 1000);
            controller.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              resolve(undefined);
            });
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setPlaybackState('idle');
          setCurrentIndex(0);
        }
        abortController.current = null;
      }
    },
    [bpm]
  );

  const pause = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setPlaybackState('paused');
  }, []);

  const stop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    synthEngine.stopAll();
    setPlaybackState('idle');
    setCurrentIndex(0);
  }, []);

  const setPlaybackBpm = useCallback((newBpm: number) => {
    setBpm(Math.max(40, Math.min(200, newBpm)));
  }, []);

  return {
    playbackState,
    currentIndex,
    bpm,
    playChord,
    playProgression,
    pause,
    stop,
    setBpm: setPlaybackBpm,
  };
}
