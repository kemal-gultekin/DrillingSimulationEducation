import React, { useState, useEffect, useRef } from 'react';
import { 
  AppMode, 
  CameraViewMode, 
  WalkPerspective, 
  NearbyEquipmentInfo,
  ViewDisplayMode,
  DownholeOperationPhase
} from './types';
import { EQUIPMENT_LIST } from './data/equipment';
import { CAMERA_PRESETS } from './data/focus';
import { GUIDED_MISSIONS } from './data/missions';
import { Scene } from './components/Scene';
import { NavigationHeader } from './components/NavigationHeader';
import { EquipmentPanel } from './components/EquipmentPanel';
import { InfoCard } from './components/InfoCard';
import { QuizPanel } from './components/QuizPanel';
import { EngineeringPanel } from './components/EngineeringPanel';
import { ScenarioPanel } from './components/ScenarioPanel';
import { WellControlPanel } from './components/WellControlPanel';
import { ProgressPanel } from './components/ProgressPanel';
import { InstructorPanel, InstructorSection } from './components/InstructorPanel';
import { StudentAssignmentsPanel } from './components/StudentAssignmentsPanel';
import { StudentGradesPanel } from './components/StudentGradesPanel';
import { WalkModeHUD } from './components/navigation/WalkModeHUD';
import { MissionHUD } from './components/navigation/MissionHUD';
import { HoverTooltip } from './components/HoverTooltip';
import { ShortcutsModal } from './components/ShortcutsModal';
import { SubsurfaceHUD } from './components/subsurface/SubsurfaceHUD';
import { useStudentProgress } from './hooks/useStudentProgress';
import { useAuth } from './auth/AuthContext';
import { LoginModal } from './auth/LoginModal';
import { useI18n } from './i18n';
import { 
  Eye, 
  RotateCcw, 
  Layers, 
  Minimize2, 
  EyeOff, 
  Maximize2, 
  Compass, 
  Sparkles, 
  Keyboard, 
  ChevronRight 
} from 'lucide-react';

export default function App() {
  const { currentUser } = useAuth();
  const { t, lang, resolveText } = useI18n();

  const [currentMode, setCurrentMode] = useState<AppMode>(() => 
    currentUser.role === 'instructor' ? 'instructor-dashboard' : 'explore'
  );
  const [cameraViewMode, setCameraViewMode] = useState<CameraViewMode>('orbit');
  const [walkPerspective, setWalkPerspective] = useState<WalkPerspective>('first-person');
  const [currentDeck, setCurrentDeck] = useState<string>('Saha Zemini (Ground Pad)');
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [nearbyEquipment, setNearbyEquipment] = useState<NearbyEquipmentInfo | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>('derrick');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([24, 20, 32]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 8, 0]);
  const [activePresetId, setActivePresetId] = useState<string>('overview');
  const [isPumping, setIsPumping] = useState<boolean>(true);

  // Stage 4B States:
  // 1) Hover state
  const [hoveredEquipmentId, setHoveredEquipmentId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // 2) Display modes & Shortcuts
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>('normal');
  const [hiddenEquipmentIds, setHiddenEquipmentIds] = useState<string[]>([]);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // 3) Subsurface (Yeraltı) View States
  const [isSubsurfaceMode, setIsSubsurfaceMode] = useState<boolean>(false);
  const [subsurfaceDepth, setSubsurfaceDepth] = useState<number>(4500); // 0 to 15,000 ft
  const [isDrillingSubsurface, setIsDrillingSubsurface] = useState<boolean>(false);
  const [subsurfaceSpeedMultiplier, setSubsurfaceSpeedMultiplier] = useState<number>(10);
  const [subsurfacePhase, setSubsurfacePhase] = useState<DownholeOperationPhase>('drilling');
  const [kickActive, setKickActive] = useState<boolean>(false);
  const [isBopClosed, setIsBopClosed] = useState<boolean>(false);

  // Auto switch default mode when role or user changes
  useEffect(() => {
    if (currentUser.role === 'instructor') {
      if (!currentMode.startsWith('instructor') && currentMode !== 'explore') {
        setCurrentMode('instructor-dashboard');
      }
    } else {
      if (currentMode.startsWith('instructor')) {
        setCurrentMode('explore');
      }
    }
  }, [currentUser.id, currentUser.role]);

  // Guided Tour Mission State
  const [isMissionActive, setIsMissionActive] = useState<boolean>(false);
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const [missionJustCompleted, setMissionJustCompleted] = useState<boolean>(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Student progress state with custom hook
  const {
    progress,
    setProgress,
    markEquipmentExplored,
    recordSafetyAnswer,
    recordCalculationCompleted,
    recordScenarioScore,
    recordWellControlPractice,
    markMissionCompleted,
    resetAllProgress
  } = useStudentProgress();

  // Clean up advance timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const activeMission = GUIDED_MISSIONS[activeMissionIndex] || null;

  // Handle starting the guided tour
  const handleStartGuidedTour = () => {
    setCameraViewMode('walk');
    setIsMissionActive(true);
    setSelectedEquipmentId(null);
    const completed = progress.completedMissions || [];
    const nextIdx = GUIDED_MISSIONS.findIndex((m) => !completed.includes(m.id));
    setActiveMissionIndex(nextIdx !== -1 ? nextIdx : 0);
  };

  const handlePauseGuidedTour = () => {
    setIsMissionActive(false);
  };

  const handleRestartGuidedTour = () => {
    setProgress((prev) => ({
      ...prev,
      completedMissions: []
    }));
    setActiveMissionIndex(0);
    setIsMissionActive(true);
    setMissionJustCompleted(false);
  };

  // Subsurface Drilling Loop simulation
  useEffect(() => {
    if (!isSubsurfaceMode || !isDrillingSubsurface) return;
    const interval = setInterval(() => {
      setSubsurfaceDepth((prev) => {
        if (prev >= 15000) {
          setIsDrillingSubsurface(false);
          return 15000;
        }
        // Base ROP ~ 45 ft/hr => in ft/sec = 45 / 3600 = 0.0125 ft/sec
        // With 100ms interval:
        const increment = (45 / 3600) * 0.1 * subsurfaceSpeedMultiplier * 15;
        const next = Math.min(15000, prev + increment);

        // Auto trigger kick if drilling deep into gas reservoir without well control
        if (next >= 12200 && !kickActive && !isBopClosed && Math.random() < 0.015) {
          setKickActive(true);
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSubsurfaceMode, isDrillingSubsurface, subsurfaceSpeedMultiplier, kickActive, isBopClosed]);

  // Enhanced Camera Focus with Box3 Bounding Sphere & Direction Preservation
  const handleFocusEquipment = (id: string | null) => {
    if (!id) return;
    setSelectedEquipmentId(id);
    setCameraViewMode('orbit');
    const eq = EQUIPMENT_LIST.find((e) => e.id === id);
    if (!eq) return;

    // Approximate bounding sphere radius based on equipment dimensions / category
    let radius = 2.5;
    if (id === 'derrick') radius = 13.5;
    else if (['crown-block', 'drawworks', 'mud-pumps', 'mud-tanks', 'generators'].includes(id)) radius = 3.2;
    else if (['bop-stack', 'top-drive', 'travelling-block', 'shale-shakers'].includes(id)) radius = 2.0;
    else radius = 1.8;

    const fov = 48;
    const fovRad = (fov * Math.PI) / 180;
    const calcDist = Math.max(3.8, (radius / Math.sin(fovRad / 2)) * 1.3);

    // Current camera direction relative to target
    const dx = cameraPosition[0] - cameraTarget[0];
    const dy = cameraPosition[1] - cameraTarget[1];
    const dz = cameraPosition[2] - cameraTarget[2];
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const dir = len > 0.001 ? [dx / len, dy / len, dz / len] : [0.6, 0.4, 0.7];

    const target = eq.cameraTarget;
    const newPos: [number, number, number] = [
      target[0] + dir[0] * calcDist,
      target[1] + dir[1] * calcDist,
      target[2] + dir[2] * calcDist
    ];

    setCameraPosition(newPos);
    setCameraTarget(target);
    setActivePresetId('');
    markEquipmentExplored(id);
  };

  // Reset to overview camera
  const handleResetCamera = () => {
    setCameraViewMode('orbit');
    setIsSubsurfaceMode(false);
    setCameraPosition([24, 20, 32]);
    setCameraTarget([0, 8, 0]);
    setActivePresetId('overview');
  };

  // Toggle Subsurface mode
  const handleToggleSubsurface = () => {
    setIsSubsurfaceMode((prev) => {
      const next = !prev;
      if (next) {
        // Smoothly adjust camera downhole
        setCameraPosition([22, -25, 34]);
        setCameraTarget([0, -40, 0]);
      } else {
        // Return to surface overview
        setCameraPosition([24, 20, 32]);
        setCameraTarget([0, 8, 0]);
      }
      return next;
    });
  };

  // Global Keyboard Shortcuts (F, R, G, I, D, H, U, X, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'f') {
        e.preventDefault();
        const targetId = selectedEquipmentId || hoveredEquipmentId;
        if (targetId) {
          handleFocusEquipment(targetId);
        }
      } else if (key === 'r') {
        e.preventDefault();
        handleResetCamera();
      } else if (key === 'g') {
        e.preventDefault();
        handleToggleSubsurface();
      } else if (key === 'i') {
        e.preventDefault();
        setDisplayMode((curr) => (curr === 'isolate' ? 'normal' : 'isolate'));
      } else if (key === 'd') {
        e.preventDefault();
        setDisplayMode((curr) => (curr === 'fade' ? 'normal' : 'fade'));
      } else if (key === 'h') {
        e.preventDefault();
        if (selectedEquipmentId) {
          setHiddenEquipmentIds((prev) =>
            prev.includes(selectedEquipmentId) ? prev : [...prev, selectedEquipmentId]
          );
        }
      } else if (key === 'u') {
        e.preventDefault();
        setHiddenEquipmentIds([]);
        setDisplayMode('normal');
      } else if (key === 'x') {
        e.preventDefault();
        setDisplayMode((curr) => (curr === 'internals' ? 'normal' : 'internals'));
      } else if (key === '?' || key === 'k') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEquipmentId, hoveredEquipmentId, cameraPosition, cameraTarget]);

  // Handle equipment selection
  const handleSelectEquipment = (id: string, shouldFocusCamera: boolean = true) => {
    setSelectedEquipmentId(id);
    const item = EQUIPMENT_LIST.find((eq) => eq.id === id);
    if (item) {
      if (shouldFocusCamera && cameraViewMode === 'orbit') {
        handleFocusEquipment(id);
      }
      markEquipmentExplored(id);
    }
  };

  // Hover equipment handler
  const handleHoverEquipment = (id: string | null, clientX?: number, clientY?: number) => {
    setHoveredEquipmentId(id);
    if (id && clientX !== undefined && clientY !== undefined) {
      setHoverPosition({ x: clientX, y: clientY });
    } else {
      setHoverPosition(null);
    }
  };

  // Toggle equipment inspection in Walk mode via [E] key
  const handleToggleInspect = () => {
    if (selectedEquipmentId !== null) {
      setSelectedEquipmentId(null);
    } else if (nearbyEquipment) {
      handleSelectEquipment(nearbyEquipment.id, false);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      if (isMissionActive && activeMission && nearbyEquipment.id === activeMission.targetEquipmentId) {
        const missionId = activeMission.id;
        markMissionCompleted(missionId);

        setMissionJustCompleted(true);

        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current);
        }

        advanceTimerRef.current = setTimeout(() => {
          setMissionJustCompleted(false);
          setActiveMissionIndex((curr) => {
            if (curr < GUIDED_MISSIONS.length - 1) {
              return curr + 1;
            }
            return curr;
          });
        }, 2200);
      }
    }
  };

  // Handle camera preset selection
  const handleSelectCameraPreset = (presetId: string) => {
    const preset = CAMERA_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      if (cameraViewMode === 'walk') {
        setCameraViewMode('orbit');
      }
      setIsSubsurfaceMode(false);
      setCameraPosition(preset.position);
      setCameraTarget(preset.target);
      setActivePresetId(presetId);
    }
  };

  // Selected equipment data object
  const selectedEquipment = EQUIPMENT_LIST.find((eq) => eq.id === selectedEquipmentId);
  const hoveredEquipment = EQUIPMENT_LIST.find((eq) => eq.id === hoveredEquipmentId) || null;

  // Helper to map instructor mode to section
  const getInstructorSection = (mode: AppMode): InstructorSection => {
    switch (mode) {
      case 'instructor-quizzes':
        return 'quizzes';
      case 'instructor-assignments':
        return 'assignments';
      case 'instructor-grading':
        return 'grading';
      case 'instructor-students':
        return 'students';
      default:
        return 'dashboard';
    }
  };

  // Hierarchy Breadcrumb
  const renderBreadcrumb = () => {
    if (!selectedEquipment) return null;
    const sysName = t(`equipment.category${selectedEquipment.category.charAt(0).toUpperCase() + selectedEquipment.category.slice(1)}`);
    const equipName = resolveText(selectedEquipment.name, selectedEquipment.turkishName);

    return (
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg">
        <span className="text-slate-500">{lang === 'tr' ? 'Sondaj Sahası' : 'Rig Site'}</span>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-amber-400/90 font-semibold">{sysName}</span>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-white font-bold truncate max-w-[140px]">{equipName}</span>
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Top Navigation Header */}
      <NavigationHeader
        currentMode={currentMode}
        onChangeMode={(mode) => {
          setCurrentMode(mode);
          if (mode === 'explore' && !selectedEquipmentId) {
            handleSelectEquipment('derrick');
          }
        }}
        onResetCamera={handleResetCamera}
        isPumping={isPumping}
        onTogglePumps={() => setIsPumping((p) => !p)}
        cameraViewMode={cameraViewMode}
        onChangeCameraViewMode={(mode) => {
          setCameraViewMode(mode);
          if (mode === 'walk') {
            setSelectedEquipmentId(null);
            setIsSubsurfaceMode(false);
          }
        }}
        isSubsurfaceMode={isSubsurfaceMode}
        onToggleSubsurface={handleToggleSubsurface}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* 3D Simulation Canvas Container */}
      <div className="w-full h-full pt-14 relative">
        <Scene
          selectedEquipmentId={selectedEquipmentId}
          onSelectEquipment={(id) => handleSelectEquipment(id, cameraViewMode === 'orbit')}
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
          isPumping={isPumping}
          cameraViewMode={cameraViewMode}
          walkPerspective={walkPerspective}
          onPerspectiveChange={setWalkPerspective}
          onDeckChange={setCurrentDeck}
          onLockChange={setIsPointerLocked}
          onNearbyEquipmentChange={setNearbyEquipment}
          onInspectNearby={handleToggleInspect}
          onCloseInspect={() => setSelectedEquipmentId(null)}
          isInteracting={selectedEquipmentId !== null}
          hoveredEquipmentId={hoveredEquipmentId}
          onHoverEquipment={handleHoverEquipment}
          onDoubleClickEquipment={(id) => handleFocusEquipment(id)}
          isSubsurfaceMode={isSubsurfaceMode}
          displayMode={displayMode}
          hiddenEquipmentIds={hiddenEquipmentIds}
          subsurfaceData={{
            currentBitDepth: subsurfaceDepth,
            isDrilling: isDrillingSubsurface,
            phase: subsurfacePhase,
            kickActive: kickActive,
            isBopClosed: isBopClosed
          }}
        />

        {/* 1) Floating Hover Tooltip: appears when mouse hovers over 3D equipment */}
        <HoverTooltip
          equipment={hoveredEquipment}
          position={hoverPosition}
          visible={cameraViewMode === 'orbit' && !isSubsurfaceMode && hoveredEquipmentId !== null}
        />

        {/* 2) Subsurface 2D HUD (Depth Ruler, Downhole Telemetry, Mud Circulation, Kick & BOP Shut-In) */}
        {isSubsurfaceMode && (
          <SubsurfaceHUD
            currentDepth={subsurfaceDepth}
            onChangeDepth={setSubsurfaceDepth}
            isDrilling={isDrillingSubsurface}
            onToggleDrilling={() => setIsDrillingSubsurface((d) => !d)}
            speedMultiplier={subsurfaceSpeedMultiplier}
            onChangeSpeed={setSubsurfaceSpeedMultiplier}
            phase={subsurfacePhase}
            onChangePhase={setSubsurfacePhase}
            kickActive={kickActive}
            onTriggerKick={() => setKickActive(true)}
            isBopClosed={isBopClosed}
            onShutInBop={() => setIsBopClosed(true)}
            onResetKick={() => {
              setKickActive(false);
              setIsBopClosed(false);
            }}
            onCloseSubsurface={handleToggleSubsurface}
          />
        )}

        {/* Walk Mode HUD Instructions, Reticle, Perspective Switcher & Elevation Info */}
        {cameraViewMode === 'walk' && (
          <>
            <WalkModeHUD
              isLocked={isPointerLocked}
              nearbyEquipment={nearbyEquipment}
              isInspecting={selectedEquipmentId !== null}
              perspective={walkPerspective}
              onTogglePerspective={() =>
                setWalkPerspective((prev) => (prev === 'first-person' ? 'third-person' : 'first-person'))
              }
              currentDeck={currentDeck}
            />

            {/* Guided Exploration Mission HUD */}
            <MissionHUD
              activeMission={activeMission}
              currentMissionIndex={activeMissionIndex}
              totalMissions={GUIDED_MISSIONS.length}
              completedMissionIds={progress.completedMissions || []}
              isActive={isMissionActive}
              onStartTour={handleStartGuidedTour}
              onPauseTour={handlePauseGuidedTour}
              onRestartTour={handleRestartGuidedTour}
              onSelectMissionIndex={setActiveMissionIndex}
              isJustCompleted={missionJustCompleted}
              nearbyEquipmentId={nearbyEquipment ? nearbyEquipment.id : null}
            />
          </>
        )}

        {/* Bottom Control Bar & Breadcrumbs (Active in 3D Orbit Explore mode) */}
        {currentMode === 'explore' && cameraViewMode === 'orbit' && !isSubsurfaceMode && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Left: Breadcrumbs */}
            <div className="pointer-events-auto hidden md:block">
              {renderBreadcrumb()}
            </div>

            {/* Center / Right: Quick View Control & Shortcut Action Buttons */}
            <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl text-xs ml-auto">
              <button
                onClick={() => handleFocusEquipment(selectedEquipmentId)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
                title={`${t('shortcuts.focus')} [F]`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Focus</span>
                <kbd className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-300 font-mono border border-slate-700">F</kbd>
              </button>

              <button
                onClick={handleResetCamera}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-sky-400 font-semibold transition-colors cursor-pointer"
                title={`${t('shortcuts.reset')} [R]`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Reset</span>
                <kbd className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-sky-300 font-mono border border-slate-700">R</kbd>
              </button>

              <button
                onClick={handleToggleSubsurface}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                title={`${t('shortcuts.subsurface')} [G]`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Yeraltı</span>
                <kbd className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-emerald-300 font-mono border border-slate-700">G</kbd>
              </button>

              <div className="w-px h-4 bg-slate-800 mx-0.5" />

              <button
                onClick={() => setDisplayMode((curr) => (curr === 'isolate' ? 'normal' : 'isolate'))}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  displayMode === 'isolate'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`${t('shortcuts.isolate')} [I]`}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDisplayMode((curr) => (curr === 'fade' ? 'normal' : 'fade'))}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  displayMode === 'fade'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`${t('shortcuts.fadeOthers')} [D]`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (selectedEquipmentId) {
                    setHiddenEquipmentIds((prev) =>
                      prev.includes(selectedEquipmentId) ? prev : [...prev, selectedEquipmentId]
                    );
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title={`${t('shortcuts.hide')} [H]`}
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>

              {(hiddenEquipmentIds.length > 0 || displayMode !== 'normal') && (
                <button
                  onClick={() => {
                    setHiddenEquipmentIds([]);
                    setDisplayMode('normal');
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold hover:bg-teal-500/30 transition-colors cursor-pointer"
                  title={`${t('shortcuts.unhideAll')} [U]`}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Unhide</span>
                </button>
              )}

              <div className="w-px h-4 bg-slate-800 mx-0.5" />

              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                title={`${t('shortcuts.shortcutsHelp')} [?]`}
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mode Specific UI Panels */}
      {/* 1. Exploration Mode: Equipment Sidebar Panel (active in Orbit mode, hidden in subsurface) */}
      {currentMode === 'explore' && cameraViewMode === 'orbit' && !isSubsurfaceMode && (
        <EquipmentPanel
          selectedId={selectedEquipmentId}
          onSelect={handleSelectEquipment}
          onSelectCameraPreset={handleSelectCameraPreset}
          activePresetId={activePresetId}
          onStartGuidedTour={handleStartGuidedTour}
          onHoverItem={(id) => setHoveredEquipmentId(id)}
        />
      )}

      {/* Selected Equipment Info Card (hidden in Subsurface view) */}
      {selectedEquipment && !isSubsurfaceMode && (
        <InfoCard
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipmentId(null)}
          onFocusCamera={() => {
            setCameraViewMode('orbit');
            handleFocusEquipment(selectedEquipmentId);
          }}
          onJumpToSafety={() => setCurrentMode('safety')}
        />
      )}

      {/* 2. Safety Training Mode */}
      {currentMode === 'safety' && (
        <QuizPanel
          onFocusEquipment={handleSelectEquipment}
          onRecordScore={recordSafetyAnswer}
          userAnswers={progress.safetyAnswered}
        />
      )}

      {/* 3. Engineering Calculations Mode */}
      {currentMode === 'engineering' && (
        <EngineeringPanel
          onRecordCompletion={recordCalculationCompleted}
        />
      )}

      {/* 4. Drilling Scenarios & Decision Engine Mode */}
      {currentMode === 'scenarios' && (
        <ScenarioPanel
          onFocusEquipment={handleSelectEquipment}
          onRecordScenarioScore={recordScenarioScore}
        />
      )}

      {/* 5. Student Quizzes Mode (Öğrenci - Quizler) */}
      {currentMode === 'quizzes' && (
        <QuizPanel
          onFocusEquipment={handleSelectEquipment}
          onRecordScore={recordSafetyAnswer}
          userAnswers={progress.safetyAnswered}
        />
      )}

      {/* 6. Student Assignments Mode (Öğrenci - Ödevlerim) */}
      {currentMode === 'my-assignments' && (
        <StudentAssignmentsPanel
          onNavigateToMode={(mode) => setCurrentMode(mode)}
        />
      )}

      {/* 7. Student Grades Mode (Öğrenci - Notlarım) */}
      {currentMode === 'my-grades' && (
        <StudentGradesPanel
          progress={progress}
        />
      )}

      {/* 8. Well Control Mode */}
      {currentMode === 'wellcontrol' && (
        <WellControlPanel
          onPracticeRecorded={recordWellControlPractice}
        />
      )}

      {/* 9. Student Progress & Analytics Mode */}
      {currentMode === 'progress' && (
        <ProgressPanel
          progress={progress}
          onResetProgress={resetAllProgress}
        />
      )}

      {/* 10. Instructor Portal Modes (Öğretmen - Panel, Quizler, Ödevler, Notlandırma, Öğrenciler) */}
      {(currentMode === 'instructor' ||
        currentMode === 'instructor-dashboard' ||
        currentMode === 'instructor-quizzes' ||
        currentMode === 'instructor-assignments' ||
        currentMode === 'instructor-grading' ||
        currentMode === 'instructor-students') && (
        <InstructorPanel
          activeSection={getInstructorSection(currentMode)}
          onChangeSection={(sec) => {
            switch (sec) {
              case 'quizzes':
                setCurrentMode('instructor-quizzes');
                break;
              case 'assignments':
                setCurrentMode('instructor-assignments');
                break;
              case 'grading':
                setCurrentMode('instructor-grading');
                break;
              case 'students':
                setCurrentMode('instructor-students');
                break;
              default:
                setCurrentMode('instructor-dashboard');
                break;
            }
          }}
        />
      )}

      {/* Shortcuts Help Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Role & User Login / Profile Modal */}
      <LoginModal />
    </div>
  );
}
