import { useCallback, useState, useEffect, useMemo } from 'react';
import { PianoKeyboard } from './components/piano/PianoKeyboard';
import { StaffDisplay } from './components/staff/StaffDisplay';
import { ProgressionPlayer } from './components/progression/ProgressionPlayer';
import { ChordReplacer } from './components/progression/ChordReplacer';
import { VoiceLeadingGrid } from './components/animation/VoiceLeadingGrid';
import { KeySelector } from './components/controls/KeySelector';
import { ChordInfoPanel } from './components/education/ChordInfoPanel';
import { ProgressionExplanation } from './components/education/ProgressionExplanation';
import { useProgression } from './hooks/useProgression';
import { useAudioContext } from './hooks/useAudioContext';
import { useChordPlayback } from './hooks/useChordPlayback';
import { DEFAULT_TEMPLATES } from './data/progressions';
import { synthEngine } from './lib/audio-engine/synth';
import { getNoteRoles } from './lib/music-theory/chord';
import type { ChordDef, ProgressionSlot as ProgressionSlotType, NoteRole } from './types';

function App() {
  const {
    template,
    slots,
    currentIndex: progressionIndex,
    key: progressionKey,
    scaleType,
    bpm,
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
  } = useProgression();

  const { initialize: initAudio } = useAudioContext();
  const {
    playProgression,
    stop: stopPlayback,
    setBpm: setPlaybackBpm,
    currentIndex: playbackIndex,
    playbackState,
  } = useChordPlayback();

  // Use playback index when actively playing/paused, otherwise use progression index
  const isPlaybackActive = playbackState === 'playing' || playbackState === 'paused';
  const currentIndex = isPlaybackActive ? playbackIndex : progressionIndex;
  const currentChord = slots[currentIndex]?.chord ?? null;
  const isPlaying = playbackState === 'playing';

  const noteRoles = useMemo<Map<string, NoteRole>>(() => {
    if (!currentChord) return new Map();
    return getNoteRoles(currentChord);
  }, [currentChord]);

  const [replacerSlot, setReplacerSlot] = useState<ProgressionSlotType | null>(null);
  const [isReplacerOpen, setIsReplacerOpen] = useState(false);

  // Default to selecting the first template if none is selected
  useEffect(() => {
    if (!template && DEFAULT_TEMPLATES.length > 0) {
      selectTemplate(DEFAULT_TEMPLATES[0].id);
    }
  }, [template, selectTemplate]);

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
    await playProgression(allChords, 0);
    setIsPlaying(false);
  }, [template, slots, initAudio, setIsPlaying, playProgression, allChords]);

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

  const handleAddSlot = useCallback(() => {
    addSlot();
  }, [addSlot]);

  const handleRemoveSlot = useCallback((index: number) => {
    removeSlot(index);
  }, [removeSlot]);

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
      const newBpm = parseInt(e.target.value, 10);
      setBpm(newBpm);
      setPlaybackBpm(newBpm);
    },
    [setBpm, setPlaybackBpm]
  );

  return (
    <div className="h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary-500 selection:text-black overflow-hidden relative">
      {/* Top Header - Glass Navbar */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 flex flex-wrap items-center justify-between border-b border-white/5 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded shrink-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-[0_0_15px_rgba(21,204,190,0.4)]">
            <span className="text-black font-extrabold text-sm font-mono">CW</span>
          </div>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white/90">和弦织网</h1>
          <span className="text-xs uppercase tracking-widest text-primary-500 ml-2 hidden sm:inline-block border border-primary-500/30 px-2 py-0.5 rounded-sm bg-primary-500/10">Chord Weaver Engine</span>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          {/* Template Dropdown inside Header */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Engine:</span>
            <select
              value={template?.id || ''}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="bg-transparent text-sm text-primary-400 font-medium outline-none cursor-pointer appearance-none hover:text-primary-300 transition-colors pr-2"
              title="选择和弦进行引擎"
            >
              {DEFAULT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id} className="bg-card text-foreground">{t.name}</option>
              ))}
            </select>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500 pointer-events-none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {template && (
            <KeySelector
              keyNote={progressionKey}
              scaleType={scaleType}
              onKeyChange={setKey}
              onScaleTypeChange={setScaleType}
            />
          )}
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 flex pt-[88px] pb-4 px-4 gap-4 relative overflow-hidden h-full">
        
        {/* Left Workbench: Canvas, HUD, Piano */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
          
          {/* Voice Leading Canvas */}
          <section className="flex-1 bg-card/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col shadow-2xl relative overflow-hidden min-h-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Voice Leading Canvas
              </h2>
              {currentChord && (
                <div className="font-serif italic text-2xl text-white">
                  {currentChord.symbol}
                </div>
              )}
            </div>
            
            {/* Split Panel Area */}
            <div className="flex-1 min-h-0 relative z-10 flex flex-row items-stretch overflow-hidden">
              
              {/* Left Panel: Theory Engine */}
              <div className="w-[32%] min-w-[280px] shrink-0 overflow-y-auto hide-scrollbar pr-4 relative">
                <ProgressionExplanation template={template} />
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2 self-stretch shrink-0" />

              {/* Right Panel: Visualizer Grid */}
              <div className="flex-1 flex items-center justify-center pl-2 overflow-hidden relative">
                <VoiceLeadingGrid
                  chords={allChords}
                  currentIndex={currentIndex}
                  isPlaying={isPlaying}
                  onChordClick={setCurrentIndex}
                />
              </div>
            </div>
          </section>

          {/* HUD Controls (Play & Progressions) */}
          <section className="relative z-20 w-full shrink-0">
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Progression Slots Area */}
                <div className="flex-1 overflow-x-auto pb-1 md:pb-0 hide-scrollbar w-full">
                  <ProgressionPlayer
                    slots={slots}
                    currentIndex={currentIndex}
                    isPlaying={isPlaying}
                    currentChord={currentChord}
                    numerals={template?.numerals}
                    onSlotClick={handleSlotClick}
                    onAddSlot={handleAddSlot}
                    onRemoveSlot={handleRemoveSlot}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStop={handleStop}
                  />
                </div>

                {/* BPM slider */}
                <div className="shrink-0 w-full md:w-44 flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-lg border border-white/5 shadow-inner">
                  <span className="text-xs font-mono text-muted-foreground">BPM</span>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={bpm}
                    onChange={handleBpmChange}
                    className="w-full accent-primary-500 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(21,204,190,0.5)]"
                  />
                  <span className="text-xs font-mono text-primary-500 w-8">{bpm}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Piano Deck */}
          <section className="relative z-30 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 pt-4 pb-0 h-[160px] xl:h-[200px] flex items-end justify-center shadow-2xl shrink-0 overflow-hidden">
            <div className="w-full h-full flex justify-center">
              <PianoKeyboard
                activeNoteRoles={noteRoles}
                onKeyPress={handlePianoKey}
                range={['C2', 'C6']}
              />
            </div>
          </section>
        </div>

        {/* Global Sidebar: Notation & Theory */}
        <aside className="w-[320px] shrink-0 flex flex-col gap-4 overflow-hidden">
          {/* Staff Display */}
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-2xl shrink-0">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Notation Grid
            </h2>
            <div className="bg-black/40 rounded-xl border border-white/5 pb-1">
              <StaffDisplay chord={currentChord} />
            </div>
          </div>

          {/* Chord Info Pane / Theory Analysis */}
          <div className="flex-1 bg-card/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-2xl overflow-y-auto hide-scrollbar">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
              Theory Analysis
            </h2>
            <ChordInfoPanel chord={currentChord} />
          </div>
        </aside>
      </main>

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

export default App;

