import React, { useState, useEffect, useRef } from 'react';
import { AppMode, CameraViewMode, WalkPerspective, NearbyEquipmentInfo, StudentProgressState } from './types';
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
import { InstructorPanel } from './components/InstructorPanel';
import { WalkModeHUD } from './components/navigation/WalkModeHUD';
import { MissionHUD } from './components/navigation/MissionHUD';

const INITIAL_PROGRESS: StudentProgressState = {
  completedEquipment: ['derrick', 'bop-stack'],
  safetyScore: 0,
  safetyAnswered: {},
  completedCalculations: ['hydrostatic-pressure'],
  completedScenarios: {},
  wellControlPracticed: false,
  completedMissions: []
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('explore');
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

  // Guided Tour Mission State
  const [isMissionActive, setIsMissionActive] = useState<boolean>(false);
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const [missionJustCompleted, setMissionJustCompleted] = useState<boolean>(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Student progress state with localStorage persistence
  const [progress, setProgress] = useState<StudentProgressState>(() => {
    try {
      const saved = localStorage.getItem('petrosim_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          completedMissions: parsed.completedMissions || []
        };
      }
      return INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('petrosim_progress', JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

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

  // Handle equipment selection
  const handleSelectEquipment = (id: string, shouldFocusCamera: boolean = true) => {
    setSelectedEquipmentId(id);
    const item = EQUIPMENT_LIST.find((eq) => eq.id === id);
    if (item) {
      // Camera focus & teleport only permitted in Orbit mode
      if (shouldFocusCamera && cameraViewMode === 'orbit') {
        setCameraPosition(item.cameraPosition);
        setCameraTarget(item.cameraTarget);
        setActivePresetId('');
      }

      // Mark equipment as explored in progress
      setProgress((prev) => {
        if (!prev.completedEquipment.includes(id)) {
          return {
            ...prev,
            completedEquipment: [...prev.completedEquipment, id]
          };
        }
        return prev;
      });
    }
  };

  // Toggle equipment inspection in Walk mode via [E] key
  const handleToggleInspect = () => {
    if (selectedEquipmentId !== null) {
      // Close InfoCard
      setSelectedEquipmentId(null);
    } else if (nearbyEquipment) {
      // Open InfoCard without moving the camera or changing vantage point
      handleSelectEquipment(nearbyEquipment.id, false);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      // Check guided mission completion
      if (isMissionActive && activeMission && nearbyEquipment.id === activeMission.targetEquipmentId) {
        const missionId = activeMission.id;
        setProgress((prev) => {
          const prevCompleted = prev.completedMissions || [];
          if (!prevCompleted.includes(missionId)) {
            return {
              ...prev,
              completedMissions: [...prevCompleted, missionId]
            };
          }
          return prev;
        });

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
      setCameraPosition(preset.position);
      setCameraTarget(preset.target);
      setActivePresetId(presetId);
    }
  };

  // Reset to overview camera
  const handleResetCamera = () => {
    setCameraViewMode('orbit');
    handleSelectCameraPreset('overview');
    setSelectedEquipmentId(null);
  };

  // Focus directly on current selected equipment
  const handleFocusSelectedEquipment = () => {
    if (selectedEquipmentId) {
      handleSelectEquipment(selectedEquipmentId, true);
    }
  };

  // Record safety score
  const handleRecordSafetyScore = (questionId: string, isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      safetyScore: prev.safetyScore + (isCorrect ? 10 : 0),
      safetyAnswered: {
        ...prev.safetyAnswered,
        [questionId]: {
          answeredIndex: 0,
          isCorrect
        }
      }
    }));
  };

  // Record engineering calculation exercise
  const handleRecordCalculation = (moduleId: string) => {
    setProgress((prev) => {
      if (!prev.completedCalculations.includes(moduleId)) {
        return {
          ...prev,
          completedCalculations: [...prev.completedCalculations, moduleId]
        };
      }
      return prev;
    });
  };

  // Record scenario completion
  const handleRecordScenarioScore = (scenarioId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      completedScenarios: {
        ...prev.completedScenarios,
        [scenarioId]: {
          score,
          completedAt: new Date().toISOString()
        }
      }
    }));
  };

  // Selected equipment data object
  const selectedEquipment = EQUIPMENT_LIST.find((eq) => eq.id === selectedEquipmentId);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Top Navigation Header */}
      <NavigationHeader
        currentMode={currentMode}
        onChangeMode={(mode) => {
          setCurrentMode(mode);
          // If switching to explore and equipment was selected, focus it
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
          }
        }}
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
        />

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
      </div>

      {/* Mode Specific UI Panels */}
      {/* 1. Exploration Mode: Equipment Sidebar Panel (active in Orbit mode) */}
      {currentMode === 'explore' && cameraViewMode === 'orbit' && (
        <EquipmentPanel
          selectedId={selectedEquipmentId}
          onSelect={handleSelectEquipment}
          onSelectCameraPreset={handleSelectCameraPreset}
          activePresetId={activePresetId}
          onStartGuidedTour={handleStartGuidedTour}
        />
      )}

      {/* Selected Equipment Info Card:
          - In Orbit mode: rendered when clicked from scene or selected from sidebar.
          - In Walk mode: rendered when inspected via [E] key without moving the camera. */}
      {selectedEquipment && (
        <InfoCard
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipmentId(null)}
          onFocusCamera={() => {
            setCameraViewMode('orbit');
            handleFocusSelectedEquipment();
          }}
          onJumpToSafety={() => setCurrentMode('safety')}
        />
      )}

      {/* 2. Safety Training Mode */}
      {currentMode === 'safety' && (
        <QuizPanel
          onFocusEquipment={handleSelectEquipment}
          onRecordScore={handleRecordSafetyScore}
          userAnswers={progress.safetyAnswered}
        />
      )}

      {/* 3. Engineering Calculations Mode */}
      {currentMode === 'engineering' && (
        <EngineeringPanel
          onRecordCompletion={handleRecordCalculation}
        />
      )}

      {/* 4. Drilling Scenarios & Decision Engine Mode */}
      {currentMode === 'scenarios' && (
        <ScenarioPanel
          onFocusEquipment={handleSelectEquipment}
          onRecordScenarioScore={handleRecordScenarioScore}
        />
      )}

      {/* 5. Well Control Mode */}
      {currentMode === 'wellcontrol' && (
        <WellControlPanel
          onPracticeRecorded={() => setProgress((p) => ({ ...p, wellControlPracticed: true }))}
        />
      )}

      {/* 6. Student Progress & Analytics Mode */}
      {currentMode === 'progress' && (
        <ProgressPanel
          progress={progress}
          onResetProgress={() => setProgress(INITIAL_PROGRESS)}
        />
      )}

      {/* 7. Instructor Portal Mode */}
      {currentMode === 'instructor' && (
        <InstructorPanel />
      )}
    </div>
  );
}
