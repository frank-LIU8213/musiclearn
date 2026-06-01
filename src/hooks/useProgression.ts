import { useState, useCallback, useMemo } from 'react';
import type { ChordDef, ProgressionTemplate, ProgressionSlot, NoteName, ScaleType } from '../types';
import { buildProgression } from '../lib/music-theory/progression';
import { DEFAULT_TEMPLATES } from '../data/progressions';

interface ProgressionState {
  template: ProgressionTemplate | null;
  slots: ProgressionSlot[];
  currentIndex: number;
  isPlaying: boolean;
  bpm: number;
  key: NoteName;
  scaleType: ScaleType;
}

export function useProgression() {
  const [state, setState] = useState<ProgressionState>({
    template: null,
    slots: [],
    currentIndex: 0,
    isPlaying: false,
    bpm: 120,
    key: 'C4',
    scaleType: 'major',
  });

  const buildSlots = useCallback(
    (key: NoteName, scaleType: ScaleType, numerals: string[]): ProgressionSlot[] => {
      const chords = buildProgression(key, scaleType, numerals);
      return chords.map((chord, index) => ({
        index,
        chord,
        isModified: false,
      }));
    },
    []
  );

  const selectTemplate = useCallback(
    (templateId: string) => {
      const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId) ?? null;
      if (!template) return;

      const key = template.key;
      const scaleType = template.scaleType;
      const slots = buildSlots(key, scaleType, template.numerals);

      setState({
        template,
        slots,
        currentIndex: 0,
        isPlaying: false,
        bpm: template.defaultBpm,
        key,
        scaleType,
      });
    },
    [buildSlots]
  );

  const setKey = useCallback(
    (newKey: NoteName) => {
      setState((prev) => {
        if (!prev.template) return { ...prev, key: newKey, scaleType: prev.scaleType };
        const slots = buildSlots(newKey, prev.scaleType, prev.template.numerals);
        return { ...prev, key: newKey, slots, currentIndex: 0 };
      });
    },
    [buildSlots]
  );

  const setScaleType = useCallback(
    (scaleType: ScaleType) => {
      setState((prev) => {
        if (!prev.template) return { ...prev, scaleType };
        const slots = buildSlots(prev.key, scaleType, prev.template.numerals);
        return { ...prev, scaleType, slots, currentIndex: 0 };
      });
    },
    [buildSlots]
  );

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

  const addSlot = useCallback((index?: number, customChord?: ChordDef) => {
    setState((prev) => {
      const insertIndex = index !== undefined ? index : prev.slots.length;
      const defaultChord = customChord || (prev.slots.length > 0 
        ? prev.slots[prev.slots.length - 1].chord 
        : buildProgression(prev.key, prev.scaleType, ['I'])[0]);
      
      const newSlot: ProgressionSlot = {
        index: insertIndex,
        chord: defaultChord,
        isModified: true,
      };

      const newSlots = [...prev.slots];
      newSlots.splice(insertIndex, 0, newSlot);
      
      // Re-index
      const reindexed = newSlots.map((s, i) => ({ ...s, index: i }));

      return { ...prev, slots: reindexed };
    });
  }, []);

  const removeSlot = useCallback((index: number) => {
    setState((prev) => {
      if (prev.slots.length <= 1) return prev; // Keep at least one
      const newSlots = prev.slots.filter((_, i) => i !== index);
      const reindexed = newSlots.map((s, i) => ({ ...s, index: i }));
      const newIndex = Math.min(prev.currentIndex, reindexed.length - 1);
      return { ...prev, slots: reindexed, currentIndex: newIndex };
    });
  }, []);

  return {
    template: state.template,
    slots: state.slots,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    bpm: state.bpm,
    key: state.key,
    scaleType: state.scaleType,
    currentChord,
    allChords,
    selectTemplate,
    replaceChord,
    setCurrentIndex,
    setIsPlaying,
    setBpm,
    setKey,
    setScaleType,
    addSlot,
    removeSlot,
  };
}
