import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { CameraViewMode, NearbyEquipmentInfo, WalkPerspective } from '../types';
import { Rig } from './Rig';
import { FirstPersonController } from './navigation/FirstPersonController';
import { SceneEffects, SCENE_LIGHTING_CONFIG } from './SceneEffects';

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
}

// Camera animation controller that smoothly interpolates camera position & orbit target only during transitions
function CameraController({
  targetPos,
  targetLookAt
}: {
  targetPos: [number, number, number];
  targetLookAt: [number, number, number];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const desiredPos = useRef(new THREE.Vector3(...targetPos));
  const desiredTarget = useRef(new THREE.Vector3(...targetLookAt));
  const isTransitioning = useRef<boolean>(false);

  // When target changes via props, initiate smooth transition
  useEffect(() => {
    desiredPos.current.set(...targetPos);
    desiredTarget.current.set(...targetLookAt);
    isTransitioning.current = true;
  }, [targetPos[0], targetPos[1], targetPos[2], targetLookAt[0], targetLookAt[1], targetLookAt[2]]);

  // Listen to user interaction on controls to cancel automated lerp immediately
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      // User started manual dragging/orbiting/panning: stop fighting with programmatic lerp
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  useFrame(() => {
    if (isTransitioning.current) {
      // Smoothly interpolate towards the selected target
      camera.position.lerp(desiredPos.current, 0.08);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(desiredTarget.current, 0.08);
      }

      // Check if close enough to finish programmatic transition
      const posDist = camera.position.distanceTo(desiredPos.current);
      const targetDist = controlsRef.current
        ? controlsRef.current.target.distanceTo(desiredTarget.current)
        : 0;

      if (posDist < 0.04 && targetDist < 0.04) {
        isTransitioning.current = false;
      }
    }

    // Always update controls for smooth damping
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      maxPolarAngle={Math.PI / 2 - 0.02} // Do not dip below ground
      minDistance={2.5}
      maxDistance={120}
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
  isInteracting = false
}) => {
  // In Walk mode, clicking on 3D objects in the scene should NEVER trigger camera focus or selection
  const handleSceneSelectEquipment = (id: string) => {
    if (cameraViewMode === 'walk') {
      return;
    }
    onSelectEquipment(id);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
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
        {/* Crisp daytime atmospheric sky background, sky dome gradient, and distant horizon fog */}
        <color attach="background" args={['#90bbd7']} />
        <SkyAtmosphere />
        <fog attach="fog" args={['#90bbd7', 85, 250]} />

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
        />

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
          <CameraController targetPos={cameraPosition} targetLookAt={cameraTarget} />
        )}
      </Canvas>
    </div>
  );
};
