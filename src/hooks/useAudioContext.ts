import { useState, useCallback, useRef } from 'react';
import { synthEngine } from '../lib/audio-engine/synth';

/**
 * Hook to manage Tone.js audio context lifecycle.
 * Ensures audio is only initialized after user interaction (browser autoplay policy).
 */
export function useAudioContext() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const initPromise = useRef<Promise<void> | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized) return;

    // Prevent multiple simultaneous init calls
    if (initPromise.current) {
      await initPromise.current;
      return;
    }

    initPromise.current = synthEngine.initialize();
    await initPromise.current;
    setIsInitialized(true);
    setIsSuspended(false);
    initPromise.current = null;
  }, [isInitialized]);

  const suspend = useCallback(() => {
    // Tone.js context suspend
    setIsSuspended(true);
  }, []);

  const resume = useCallback(async () => {
    if (!isInitialized) {
      await initialize();
    }
    setIsSuspended(false);
  }, [isInitialized, initialize]);

  return {
    isInitialized,
    isSuspended,
    initialize,
    suspend,
    resume,
    ready: isInitialized && !isSuspended,
  };
}
