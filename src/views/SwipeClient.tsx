import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { Project, StyleAsset, SwipeSession } from '../types';

interface SwipeClientProps {
  onBackToProject: () => void;
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onNotify: (msg: string, title?: string) => void;
}

export default function SwipeClient({
  onBackToProject,
  project,
  onUpdateProject,
  onNotify
}: SwipeClientProps) {
  const [session, setSession] = useState<SwipeSession>({
    projectId: project.id,
    currentIndex: 0,
    loves: [],
    skips: []
  });

  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStart = useRef({ x: 0, y: 0 });

  const currentAsset: StyleAsset | undefined = project.assets[session.currentIndex];

  const handleSwipeAction = (direction: 'love' | 'skip') => {
    if (!currentAsset) return;

    // Trigger local aggregate updates on the project's StyleAsset
    const updatedAssets = project.assets.map(asset => {
      if (asset.id === currentAsset.id) {
        return {
          ...asset,
          loveCount: direction === 'love' ? asset.loveCount + 1 : asset.loveCount,
          skipCount: direction === 'skip' ? asset.skipCount + 1 : asset.skipCount,
          totalSwipes: asset.totalSwipes + 1
        };
      }
      return asset;
    });

    const updatedProject = {
      ...project,
      assets: updatedAssets
    };

    onUpdateProject(updatedProject);

    // Record swipe action in active session state
    setSession(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      loves: direction === 'love' ? [...prev.loves, currentAsset.id] : prev.loves,
      skips: direction === 'skip' ? [...prev.skips, currentAsset.id] : prev.skips
    }));

    // Reset offsets
    setSwipeOffset({ x: 0, y: 0 });

    const dirLabel = direction === 'love' ? 'LOVED' : 'SKIPPED';
    onNotify(`Preferences updated for direction '${currentAsset.title}': Recorded as ${dirLabel}.`, `Aesthetic Response logged`);
  };

  // Keyboard shortcut keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentAsset) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleSwipeAction('skip');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleSwipeAction('love');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAsset, session]);

  // Mouse / Touch Drag listeners
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setIsSwiping(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    swipeStart.current = { x: clientX, y: clientY };
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isSwiping) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - swipeStart.current.x;
    const dy = clientY - swipeStart.current.y;
    setSwipeOffset({ x: dx, y: dy });
  };

  const endDrag = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const threshold = 120;
    if (swipeOffset.x > threshold) {
      handleSwipeAction('love');
    } else if (swipeOffset.x < -threshold) {
      handleSwipeAction('skip');
    } else {
      setSwipeOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isSwiping) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchmove', handleDrag, { passive: true });
      window.addEventListener('touchend', endDrag);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [isSwiping, swipeOffset]);

  const handleResetSession = () => {
    setSession({
      projectId: project.id,
      currentIndex: 0,
      loves: [],
      skips: []
    });
    onNotify('Preference session has been reloaded. Swipe to choose again.', 'Session Reset');
  };

  // Drag tilt logic
  const dragRotation = (swipeOffset.x / window.innerWidth) * 45; // Degrees limit
  const dragOpacity = Math.min(Math.abs(swipeOffset.x) / 100, 0.9);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 flex flex-col justify-center items-center text-on-surface text-center select-none overflow-hidden relative">
      {/* Decorative ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-primary opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] space-y-8 z-10">
        
        {/* Navigation top bar */}
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={onBackToProject}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant hover:border-on-surface bg-surface-container/60 hover:bg-surface-container font-semibold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Finish Review</span>
          </button>
          
          <span className="text-[10px] font-black tracking-widest text-on-surface-variant uppercase bg-surface-container px-3 py-1 rounded-full border border-outline-variant/60">
            {project.title}
          </span>
        </div>

        {/* Swipe Card / End screen switcher */}
        {currentAsset ? (
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <h2 className="text-xl md:text-2xl font-black font-headline tracking-tight text-on-surface">Review Concepts</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Hint: Drag card or use arrows (← Swipe Left to Skip, → Swipe Right to Love)</p>
            </div>

            {/* Gesture Card */}
            <div 
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              style={{
                transform: `translate3d(${swipeOffset.x}px, ${swipeOffset.y}px, 0) rotate(${dragRotation}deg)`,
                cursor: isSwiping ? 'grabbing' : 'grab',
                transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="bg-surface-container border border-outline-variant rounded-2.5xl aspect-square overflow-hidden shadow-2xl relative select-none group touch-action-none"
            >
              
              {/* Image Frame */}
              <div className="w-full h-full relative">
                <img 
                  draggable={false}
                  alt={currentAsset.title} 
                  className="w-full h-full object-cover select-none pointer-events-none" 
                  src={currentAsset.imageUrl}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual shading layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-app/90 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Love Indicator */}
                {swipeOffset.x > 30 && (
                  <div 
                    style={{ opacity: dragOpacity }}
                    className="absolute top-10 left-10 border-4 border-tertiary text-tertiary text-2xl font-black font-headline tracking-widest px-6 py-2.5 rounded-xl uppercase rotate-[-12deg] pointer-events-none"
                  >
                    LOVE IT
                  </div>
                )}

                {/* Floating Skip Indicator */}
                {swipeOffset.x < -30 && (
                  <div 
                    style={{ opacity: dragOpacity }}
                    className="absolute top-10 right-10 border-4 border-error text-error text-2xl font-black font-headline tracking-widest px-6 py-2.5 rounded-xl uppercase rotate-[12deg] pointer-events-none"
                  >
                    SKIP IT
                  </div>
                )}

                {/* Bottom title layer overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-left pointer-events-none">
                  <span className="text-[10px] font-black text-tertiary-container bg-tertiary-container/30 px-3 py-1 rounded-full uppercase tracking-wider select-none border border-tertiary-container/40">
                    {currentAsset.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black font-headline text-on-surface mt-2 truncate">
                    {currentAsset.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Manual Swipe Command buttons */}
            <div className="flex justify-center items-center gap-6 pt-2 select-none">
              <button 
                onClick={() => handleSwipeAction('skip')}
                className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center hover:bg-error/15 cursor-pointer text-on-surface hover:text-error transition-all hover:scale-105 active:scale-95 shadow-md shadow-black/20 shrink-0"
                aria-label="Skip / Left swipe"
              >
                <X className="w-5 h-5 stroke-[3px]" />
              </button>

              <button 
                onClick={() => handleSwipeAction('love')}
                className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center hover:bg-tertiary/20 cursor-pointer text-on-surface hover:text-tertiary transition-all hover:scale-105 active:scale-95 shadow-md shadow-black/20 shrink-0"
                aria-label="Love / Right swipe"
              >
                <Heart className="w-5 h-5 fill-current stroke-[3px]" />
              </button>
            </div>

            {/* Swipe count trackers */}
            <p className="text-[10px] tracking-wider uppercase font-black text-on-surface-variant">
              Concept {session.currentIndex + 1} of {project.assets.length}
            </p>
          </div>
        ) : (
          /* Finished session view */
          <div className="glass-panel p-8 md:p-10 rounded-2.5xl shadow-2xl space-y-6 animate-fade-in select-none">
            <div className="w-16 h-16 rounded-full bg-tertiary/10 border-2 border-tertiary flex items-center justify-center mx-auto text-tertiary relative">
              <Sparkles className="w-8 h-8 font-black animate-pulse" />
              <div className="absolute inset-0 bg-tertiary/20 rounded-full blur-md" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tight text-on-surface">Perfect Consensus Map Complete!</h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                Thank you! Your personal aesthetic preferences have been recorded instantly to our creative consensus ledger.
              </p>
            </div>

            {/* Choices Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/60">
              <div className="p-3 bg-surface-container rounded-xl">
                <span className="block text-xl font-headline font-black text-tertiary">{session.loves.length}</span>
                <span className="block text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">Approved Decisions</span>
              </div>
              <div className="p-3 bg-surface-container rounded-xl">
                <span className="block text-xl font-headline font-black text-on-surface-variant">{session.skips.length}</span>
                <span className="block text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">Concepts Deferred</span>
              </div>
            </div>

            {/* CTA action loops */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onBackToProject}
                className="w-full bg-primary text-on-primary font-bold text-xs py-3.5 rounded-xl transition-all hover:translate-y-[-1px] active:scale-95 shadow-lg shadow-primary/20 hover:brightness-110 cursor-pointer"
              >
                Return to Dashboard
              </button>

              <button
                onClick={handleResetSession}
                className="w-full flex items-center justify-center gap-2 border border-outline-variant py-3 rounded-xl hover:bg-surface-container-high text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Swipe Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
