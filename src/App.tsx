import { useCallback, useState, useEffect } from 'react';
import { PianoKeyboard } from './components/piano/PianoKeyboard';
import { StaffDisplay } from './components/staff/StaffDisplay';
import { ProgressionPlayer } from './components/progression/ProgressionPlayer';
import { ChordReplacer } from './components/progression/ChordReplacer';
import { VoiceLeadingCanvas } from './components/animation/VoiceLeadingCanvas';
import { Tooltip } from './components/ui/Tooltip';
import { useProgression } from './hooks/useProgression';
import { useAudioContext } from './hooks/useAudioContext';
import { useChordPlayback } from './hooks/useChordPlayback';
import { DEFAULT_TEMPLATES } from './data/progressions';
import { synthEngine } from './lib/audio-engine/synth';
import type { ChordDef, ProgressionSlot as ProgressionSlotType } from './types';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  const {
    template,
    slots,
    currentIndex,
    isPlaying,
    bpm,
    currentChord,
    allChords,
    selectTemplate,
    replaceChord,
    setIsPlaying,
    setBpm,
  } = useProgression();

  const { initialize: initAudio } = useAudioContext();
  const { playProgression, stop: stopPlayback } = useChordPlayback();

  const [replacerSlot, setReplacerSlot] = useState<ProgressionSlotType | null>(null);
  const [isReplacerOpen, setIsReplacerOpen] = useState(false);

  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      await initAudio();
      selectTemplate(templateId);
    },
    [initAudio, selectTemplate]
  );

  const handlePlay = useCallback(async () => {
    if (!template || slots.length === 0) return;
    await initAudio();
    setIsPlaying(true);
    await playProgression(allChords, bpm);
    setIsPlaying(false);
  }, [template, slots, initAudio, setIsPlaying, playProgression, allChords, bpm]);

  const handlePause = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
  }, [stopPlayback, setIsPlaying]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
  }, [stopPlayback, setIsPlaying]);

  const handleSlotClick = useCallback((index: number) => {
    const slot = slots[index];
    if (slot) {
      setReplacerSlot(slot);
      setIsReplacerOpen(true);
    }
  }, [slots]);

  const handleReplace = useCallback((slotIndex: number, newChord: ChordDef) => {
    replaceChord(slotIndex, newChord);
  }, [replaceChord]);

  const handlePianoKey = useCallback(
    async (note: string) => {
      await initAudio();
      synthEngine.playNote(note, 0.5);
    },
    [initAudio]
  );

  const handleBpmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBpm(parseInt(e.target.value, 10));
    },
    [setBpm]
  );

  const activeNotes = currentChord?.notes ?? [];

  // Get previous chord for voice leading animation
  const previousChord = currentIndex > 0 ? allChords[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CW</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">和弦织网</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="切换主题"
            title="切换明暗主题"
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <div className="text-sm text-muted-foreground">Chord Weaver</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Controls */}
        <aside className="w-full md:w-72 border-r border-border bg-card flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              和弦进行模板
            </h2>
            <div className="space-y-2">
              {DEFAULT_TEMPLATES.map((t) => (
                <TemplateButton
                  key={t.id}
                  label={t.name}
                  moods={t.moods}
                  isSelected={template?.id === t.id}
                  onClick={() => handleTemplateSelect(t.id)}
                />
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              播放控制
            </h2>
            <ProgressionPlayer
              slots={slots}
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              onSlotClick={handleSlotClick}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
            />
          </div>

          <div className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              速度
            </h2>
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={handleBpmChange}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>40</span>
              <span>{bpm} BPM</span>
              <span>200</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Progression Info */}
          <section className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                当前进行
              </h2>
              {template && (
                <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                  {template.name}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentChord ? (
                <Tooltip chord={currentChord}>
                  <span className="cursor-help">
                    当前和弦: <strong className="text-foreground">{currentChord.symbol}</strong>
                    {' '}
                    ({currentChord.notes.join(' ')})
                  </span>
                </Tooltip>
              ) : (
                <span>选择一个模板开始</span>
              )}
            </div>
          </section>

          {/* Voice Leading Animation */}
          {template && (
            <section className="p-4 border-b border-border bg-card">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                声部流动
              </h2>
              <VoiceLeadingCanvas
                fromChord={previousChord}
                toChord={currentChord}
                isAnimating={isPlaying}
                duration={(60 / bpm) * 2000}
              />
            </section>
          )}

          {/* Staff Display */}
          <section className="p-4 border-b border-border bg-card">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              五线谱
            </h2>
            <StaffDisplay chord={currentChord} />
          </section>

          {/* Piano Keyboard */}
          <section className="flex-1 p-4 flex flex-col min-h-[300px]">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              虚拟钢琴
            </h2>
            <div className="flex-1 flex items-center justify-center overflow-x-auto">
              <PianoKeyboard
                activeNotes={activeNotes}
                onKeyPress={handlePianoKey}
                range={['C3', 'B4']}
              />
            </div>
          </section>
        </main>
      </div>

      {/* Chord Replacer Modal */}
      <ChordReplacer
        slot={replacerSlot}
        isOpen={isReplacerOpen}
        onClose={() => setIsReplacerOpen(false)}
        onReplace={handleReplace}
      />
    </div>
  );
}

function TemplateButton({
  label,
  moods,
  isSelected,
  onClick,
}: {
  label: string;
  moods: string[];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-border hover:border-primary-300 hover:bg-muted'
      }`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="flex gap-1 mt-1">
        {moods.map((mood) => (
          <span
            key={mood}
            className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
          >
            {mood}
          </span>
        ))}
      </div>
    </button>
  );
}

export default App;
