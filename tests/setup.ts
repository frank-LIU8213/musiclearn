import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock ResizeObserver for jsdom
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock Tone.js for jsdom environment (no Web Audio API)
function createMockSynth() {
  return {
    toDestination: vi.fn().mockReturnThis(),
    triggerAttackRelease: vi.fn(),
    releaseAll: vi.fn(),
    volume: { value: 0 },
  };
}

vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  PolySynth: vi.fn().mockImplementation(function () {
    return createMockSynth();
  }),
  Synth: vi.fn().mockImplementation(function () {
    return createMockSynth();
  }),
}));
