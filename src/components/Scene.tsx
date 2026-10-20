import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { 
  CameraViewMode, 
  NearbyEquipmentInfo, 
  WalkPerspective, 
  ViewDisplayMode, 
  DownholeOperationPhase 
} from '../types';
import { Rig } from './Rig';
import { FirstPersonController } from './navigation/FirstPersonController';
import { SceneEffects, SCENE_LIGHTING_CONFIG } from './SceneEffects';
import { SubsurfaceView } from './subsurface/SubsurfaceView';

// Subtle daytime atmospheric sky dome creating a natural zenith-to-horizon daylight gradient
function SkyAtmosphere() {
  const skyTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Vertical linear gradient from zenith down to horizon
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, '#4a7ea8'); // Rich daylight blue at zenith
    grad.addColorStop(0.35, '#6a9fc4'); // Mid-sky
    grad.addColorStop(0.65, '#8cb8d6'); // Lower sky
    grad.addColorStop(0.78, '#9fc3dc'); // Soft pale horizon haze band
    grad.addColorStop(0.82, '#90bbd7'); // Exact fog color at ground horizon (y ~ -2)
    grad.addColorStop(1.00, '#7795a9'); // Sub-horizon ground ambient
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  if (!skyTexture) return null;

  return (
    <mesh position={[0, -15, 0]} renderOrder={-1000}>
      <sphereGeometry args={[340, 32, 24]} />
      <meshBasicMaterial
        map={skyTexture}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

interface SceneProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  isPumping?: boolean;
  cameraViewMode?: CameraViewMode;
  walkPerspective?: WalkPerspective;
  onPerspectiveChange?: (perspective: WalkPerspective) => void;
  onDeckChange?: (deckName: string) => void;
  onLockChange?: (locked: boolean) => void;
  onNearbyEquipmentChange?: (equipment: NearbyEquipmentInfo | null) => void;
  onInspectNearby?: () => void;
  onCloseInspect?: () => void;
  isInteracting?: boolean;
  // Stage 4B additions:
  hoveredEquipmentId?: string | null;
  onHoverEquipment?: (id: string | null, clientX?: number, clientY?: number) => void;
  onDoubleClickEquipment?: (id: string) => void;
  isSubsurfaceMode?: boolean;
  displayMode?: ViewDisplayMode;
  hiddenEquipmentIds?: string[];
  subsurfaceData?: {
    currentBitDepth: number;
    isDrilling: boolean;
    phase: DownholeOperationPhase;
    kickActive: boolean;
    isBopClosed: boolean;
  };
}

// Camera animation controller with 700 ms smooth cubic easing and drag cancellation
function CameraController({
  targetPos,
  targetLookAt,
  isSubsurfaceMode = false
}: {
  targetPos: [number, number, number];
  targetLookAt: [number, number, number];
  isSubsurfaceMode?: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3(...targetPos));
  const endTarget = useRef(new THREE.Vector3(...targetLookAt));

  const startTime = useRef<number>(0);
  const duration = useRef<number>(750); // 750 ms smooth easing flight
  const isTransitioning = useRef<boolean>(false);

  // When target changes, start smooth eased transition
  useEffect(() => {
    if (controlsRef.current) {
      startPos.current.copy(camera.position);
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startPos.current.set(...targetPos);
      startTarget.current.set(...targetLookAt);
    }
    endPos.current.set(...targetPos);
    endTarget.current.set(...targetLookAt);

    startTime.current = performance.now();
    isTransitioning.current = true;
  }, [targetPos[0], targetPos[1], targetPos[2], targetLookAt[0], targetLookAt[1], targetLookAt[2]]);

  // User manual drag/orbit cancels animation instantly
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  useFrame(() => {
    if (isTransitioning.current) {
      const now = performance.now();
      const elapsed = now - startTime.current;
      const progress = Math.min(1.0, Math.max(0, elapsed / duration.current));

      // Cubic Ease-Out curve: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPos.current, endPos.current, ease);

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(startTarget.current, endTarget.current, ease);
      }

      if (progress >= 1.0) {
        isTransitioning.current = false;
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      maxPolarAngle={isSubsurfaceMode ? Math.PI * 0.98 : Math.PI / 2 - 0.02}
      minDistance={isSubsurfaceMode ? 1.5 : 2.5}
      maxDistance={isSubsurfaceMode ? 260 : 120}
    />
  );
}

export const Scene: React.FC<SceneProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  cameraPosition,
  cameraTarget,
  isPumping = true,
  cameraViewMode = 'orbit',
  walkPerspective = 'first-person',
  onPerspectiveChange,
  onDeckChange,
  onLockChange,
  onNearbyEquipmentChange,
  onInspectNearby,
  onCloseInspect,
  isInteracting = false,
  hoveredEquipmentId = null,
  onHoverEquipment,
  onDoubleClickEquipment,
  isSubsurfaceMode = false,
  displayMode = 'normal',
  hiddenEquipmentIds = [],
  subsurfaceData
}) => {
  // In Walk mode, clicking on 3D objects in the scene should NEVER trigger camera focus or selection
  const handleSceneSelectEquipment = (id: string) => {
    if (cameraViewMode === 'walk') {
      return;
    }
    onSelectEquipment(id);
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-slate-900"
      onPointerDown={() => {
        // Hide hover tooltip if user is dragging/interacting
        onHoverEquipment?.(null);
      }}
      onPointerLeave={() => {
        onHoverEquipment?.(null);
      }}
    >
      <Canvas
        shadows
        camera={{
          position: cameraPosition,
          fov: 48,
          near: 0.5,
          far: 450
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: SCENE_LIGHTING_CONFIG.exposure
        }}
      >
        {/* Daytime sky background, sky dome gradient, and distant horizon fog */}
        <color attach="background" args={['#90bbd7']} />
        <SkyAtmosphere />
        <fog attach="fog" args={['#90bbd7', isSubsurfaceMode ? 140 : 85, 260]} />

        {/* Modular Lighting System & Post-Processing Pipeline */}
        <SceneEffects />

        {/* Subdued Engineering Orientation Grid */}
        <Grid
          position={[0, -2.03, 0]}
          args={[140, 140]}
          cellSize={5}
          cellThickness={0.6}
          cellColor="#788b9e"
          sectionSize={20}
          sectionThickness={1.0}
          sectionColor="#4f6479"
          fadeDistance={110}
          fadeStrength={1.5}
        />

        {/* 3D Rig & Surface Model */}
        <Rig
          selectedEquipmentId={selectedEquipmentId}
          onSelectEquipment={handleSceneSelectEquipment}
          isPumping={isPumping}
          cameraViewMode={cameraViewMode}
          hoveredEquipmentId={hoveredEquipmentId}
          onHoverEquipment={onHoverEquipment}
          onDoubleClickEquipment={onDoubleClickEquipment}
          displayMode={displayMode}
          hiddenEquipmentIds={hiddenEquipmentIds}
          isSubsurfaceMode={isSubsurfaceMode}
        />

        {/* 3D Subsurface Geological & Downhole Model (rendered when Subsurface view is active) */}
        {isSubsurfaceMode && subsurfaceData && (
          <SubsurfaceView
            currentBitDepth={subsurfaceData.currentBitDepth}
            isDrilling={subsurfaceData.isDrilling}
            phase={subsurfaceData.phase}
            kickActive={subsurfaceData.kickActive}
            isBopClosed={subsurfaceData.isBopClosed}
            mudPumping={isPumping}
          />
        )}

        {/* Camera Navigation Mode Selection: First-Person Walk vs. Orbit Inspection */}
        {cameraViewMode === 'walk' ? (
          <FirstPersonController
            perspective={walkPerspective}
            onPerspectiveChange={onPerspectiveChange}
            onDeckChange={onDeckChange}
            onLockChange={onLockChange}
            onNearbyEquipmentChange={onNearbyEquipmentChange}
            onInspectNearby={onInspectNearby}
            onCloseInspect={onCloseInspect}
            isInteracting={isInteracting}
          />
        ) : (
          <CameraController
            targetPos={cameraPosition}
            targetLookAt={cameraTarget}
            isSubsurfaceMode={isSubsurfaceMode}
          />
        )}
      </Canvas>
    </div>
  );
};
