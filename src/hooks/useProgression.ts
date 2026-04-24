import { useState, useCallback, useMemo } from 'react';
import type { ChordDef, ProgressionTemplate, ProgressionSlot } from '../types';
import { buildProgression } from '../lib/music-theory/progression';
import { DEFAULT_TEMPLATES } from '../data/progressions';

interface ProgressionState {
  template: ProgressionTemplate | null;
  slots: ProgressionSlot[];
  currentIndex: number;
  isPlaying: boolean;
  bpm: number;
}

export function useProgression() {
  const [state, setState] = useState<ProgressionState>({
    template: null,
    slots: [],
    currentIndex: 0,
    isPlaying: false,
    bpm: 120,
  });

  const selectTemplate = useCallback((templateId: string) => {
    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId) ?? null;
    if (!template) return;

    const chords = buildProgression(template.key, template.scaleType, template.numerals);
    const slots: ProgressionSlot[] = chords.map((chord, index) => ({
      index,
      chord,
      isModified: false,
    }));

    setState({
      template,
      slots,
      currentIndex: 0,
      isPlaying: false,
      bpm: template.defaultBpm,
    });
  }, []);

  const replaceChord = useCallback((slotIndex: number, newChord: ChordDef) => {
    setState((prev) => {
      if (slotIndex < 0 || slotIndex >= prev.slots.length) return prev;

      const newSlots = [...prev.slots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        chord: newChord,
        isModified: true,
      };

      return { ...prev, slots: newSlots };
    });
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentIndex: index }));
  }, []);

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState((prev) => ({ ...prev, isPlaying }));
  }, []);

  const setBpm = useCallback((bpm: number) => {
    setState((prev) => ({ ...prev, bpm: Math.max(40, Math.min(200, bpm)) }));
  }, []);

  const currentChord = useMemo(() => {
    if (state.slots.length === 0) return null;
    return state.slots[state.currentIndex]?.chord ?? null;
  }, [state.slots, state.currentIndex]);

  const allChords = useMemo(() => state.slots.map((s) => s.chord), [state.slots]);

  return {
    template: state.template,
    slots: state.slots,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    bpm: state.bpm,
    currentChord,
    allChords,
    selectTemplate,
    replaceChord,
    setCurrentIndex,
    setIsPlaying,
    setBpm,
  };
}
