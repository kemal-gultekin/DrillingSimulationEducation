import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NearbyEquipmentInfo, WalkPerspective } from '../../types';
import { findClosestEquipment } from '../../data/proximity';
import { getSurfaceElevation } from '../../utils/terrainElevation';
import { resolveCollisions } from '../../utils/collisionSystem';
import { PlayerCharacter } from './PlayerCharacter';

interface FirstPersonControllerProps {
  onLockChange?: (locked: boolean) => void;
  initialPosition?: [number, number, number];
  onNearbyEquipmentChange?: (equipment: NearbyEquipmentInfo | null) => void;
  onInspectNearby?: () => void;
  onCloseInspect?: () => void;
  isInteracting?: boolean;
  perspective?: WalkPerspective;
  onPerspectiveChange?: (perspective: WalkPerspective) => void;
  onDeckChange?: (deckName: string) => void;
}

/**
 * FirstPersonController:
 * Comprehensive onshore oilfield walking navigation:
 * 1. Supports both First-Person (1P) and Third-Person (3P) perspectives with [V] key toggle.
 * 2. Terrain & Deck Elevation traversal:
 *    - Ground caliche pad (-1.9m)
 *    - Catwalk walkway (-1.2m)
 *    - Sloped V-door pipe ramp (-1.2m up to 3.45m)
 *    - Substructure Rig Floor (3.45m)
 *    - Sloped Rig Floor access staircase (-1.9m up to 3.45m)
 *    - Mud Tank walkway & stairs (-1.9m to 1.3m)
 * 3. 2.5D Sliding Collision Resolution:
 *    - Prevents walking through mud pumps, tanks, containers, derrick legs, and handrails.
 * 4. Realistic character animations with ANSI hard hat, safety glasses, FR coveralls, and work boots.
 * 5. WASD directional movement, Shift to sprint, mouse look with pointer lock, and [E] inspect.
 */
export const FirstPersonController: React.FC<FirstPersonControllerProps> = ({
  onLockChange,
  initialPosition = [12, -0.15, 16],
  onNearbyEquipmentChange,
  onInspectNearby,
  onCloseInspect,
  isInteracting = false,
  perspective = 'first-person',
  onPerspectiveChange,
  onDeckChange
}) => {
  const { camera, gl } = useThree();

  // Eye height above walkable surface
  const EYE_OFFSET = 1.75;
  const WALK_SPEED = 4.8;
  const SPRINT_SPEED = 8.2;
  const MOUSE_SENSITIVITY = 0.0022;

  // Internal perspective state synced with prop
  const [currentPerspective, setCurrentPerspective] = useState<WalkPerspective>(perspective);
  useEffect(() => {
    setCurrentPerspective(perspective);
  }, [perspective]);

  // Synchronized refs to avoid re-binding event listeners
  const perspectiveRef = useRef<WalkPerspective>(currentPerspective);
  perspectiveRef.current = currentPerspective;

  const onPerspectiveChangeRef = useRef(onPerspectiveChange);
  onPerspectiveChangeRef.current = onPerspectiveChange;

  const onDeckChangeRef = useRef(onDeckChange);
  onDeckChangeRef.current = onDeckChange;

  const isInteractingRef = useRef(isInteracting);
  isInteractingRef.current = isInteracting;

  const onInspectNearbyRef = useRef(onInspectNearby);
  onInspectNearbyRef.current = onInspectNearby;

  const onCloseInspectRef = useRef(onCloseInspect);
  onCloseInspectRef.current = onCloseInspect;

  const onNearbyEquipmentChangeRef = useRef(onNearbyEquipmentChange);
  onNearbyEquipmentChangeRef.current = onNearbyEquipmentChange;

  const lastClosestIdRef = useRef<string | null>(null);
  const lastDeckRef = useRef<string>('Gravel Pad');

  // Player position in 3D world (at eye height)
  const positionRef = useRef(new THREE.Vector3(...initialPosition));
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const surfaceYRef = useRef(initialPosition[1] - EYE_OFFSET);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isLockedRef = useRef(false);

  // Third-person rendering state
  const [characterState, setCharacterState] = useState<{
    position: [number, number, number];
    rotationY: number;
    isMoving: boolean;
  }>({
    position: [initialPosition[0], initialPosition[1] - EYE_OFFSET, initialPosition[2]],
    rotationY: 0,
    isMoving: false
  });

  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });

  // Reusable vectors for zero-garbage frame calculations
  const moveDirection = useRef(new THREE.Vector3());
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const targetVelocity = useRef(new THREE.Vector3());

  // Setup initial camera orientation
  useEffect(() => {
    const dx = 0 - positionRef.current.x;
    const dz = 0 - positionRef.current.z;
    yawRef.current = Math.atan2(-dx, -dz);
    pitchRef.current = 0.05;

    camera.position.set(positionRef.current.x, positionRef.current.y, positionRef.current.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitchRef.current, yawRef.current, 0);

    const domElement = gl.domElement;

    const handleClick = () => {
      if (isInteractingRef.current) return;
      if (document.pointerLockElement !== domElement) {
        domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === domElement;
      isLockedRef.current = locked;
      if (onLockChange) {
        onLockChange(locked);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLockedRef.current || isInteractingRef.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      yawRef.current -= movementX * MOUSE_SENSITIVITY;
      pitchRef.current -= movementY * MOUSE_SENSITIVITY;

      // Limit pitch to prevent camera flip
      const maxPitch = Math.PI / 2.15;
      pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      // [E] Inspect
      if (event.code === 'KeyE') {
        event.preventDefault();
        if (onInspectNearbyRef.current) {
          onInspectNearbyRef.current();
        }
        return;
      }

      // [V] Toggle First-Person / Third-Person view
      if (event.code === 'KeyV') {
        event.preventDefault();
        const next = perspectiveRef.current === 'first-person' ? 'third-person' : 'first-person';
        setCurrentPerspective(next);
        if (onPerspectiveChangeRef.current) {
          onPerspectiveChangeRef.current(next);
        }
        return;
      }

      // [ESC] key closes InfoCard if open
      if (event.code === 'Escape') {
        if (isInteractingRef.current && onCloseInspectRef.current) {
          onCloseInspectRef.current();
          return;
        }
      }

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = false;
          break;
      }
    };

    domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (document.pointerLockElement === domElement) {
        document.exitPointerLock();
      }
      if (onLockChange) {
        onLockChange(false);
      }
    };
  }, [camera, gl, onLockChange]);

  // Main animation and physics tick
  useFrame((_, delta) => {
    if (isInteractingRef.current) {
      velocityRef.current.set(0, 0, 0);
      return;
    }

    const safeDelta = Math.min(delta, 0.1);
    const yaw = yawRef.current;
    const pitch = pitchRef.current;

    // Movement vectors on horizontal XZ plane
    forwardVector.current.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    rightVector.current.set(Math.cos(yaw), 0, -Math.sin(yaw));

    moveDirection.current.set(0, 0, 0);
    const keys = keysRef.current;

    if (keys.forward) moveDirection.current.add(forwardVector.current);
    if (keys.backward) moveDirection.current.sub(forwardVector.current);
    if (keys.right) moveDirection.current.add(rightVector.current);
    if (keys.left) moveDirection.current.sub(rightVector.current);

    const isMoving = moveDirection.current.lengthSq() > 0;
    if (isMoving) {
      moveDirection.current.normalize();
    }

    const currentSpeed = keys.sprint ? SPRINT_SPEED : WALK_SPEED;
    targetVelocity.current.copy(moveDirection.current).multiplyScalar(currentSpeed);
    velocityRef.current.lerp(targetVelocity.current, 0.22);

    // Tentative new horizontal position
    const nextX = positionRef.current.x + velocityRef.current.x * safeDelta;
    const nextZ = positionRef.current.z + velocityRef.current.z * safeDelta;

    // 1. Calculate realistic surface elevation with smooth ramp/stair interpolation
    const targetSurfaceY = getSurfaceElevation(nextX, nextZ, surfaceYRef.current);
    surfaceYRef.current = THREE.MathUtils.lerp(surfaceYRef.current, targetSurfaceY, 0.22);

    // 2. Perform 2.5D sliding collision resolution against all drilling structures
    const resolved = resolveCollisions(nextX, nextZ, surfaceYRef.current, 0.44);

    // 3. Keep player strictly within the wellsite pad boundaries (-33m to +33m)
    positionRef.current.x = Math.max(-33, Math.min(33, resolved.x));
    positionRef.current.z = Math.max(-33, Math.min(33, resolved.z));
    positionRef.current.y = surfaceYRef.current + EYE_OFFSET;

    // Detect and report deck name
    let currentDeck = 'Saha Zemini (Ground Pad)';
    if (surfaceYRef.current > 3.0) {
      currentDeck = 'Rig Floor (Sondaj Platformu, +3.5m)';
    } else if (surfaceYRef.current > 0.5) {
      currentDeck = 'Mud Tank Yürüme Yolu (+1.3m)';
    } else if (surfaceYRef.current > -1.5 && (positionRef.current.z > 9.0 && positionRef.current.z < 25.0)) {
      currentDeck = 'Catwalk (+0.7m)';
    }
    if (currentDeck !== lastDeckRef.current) {
      lastDeckRef.current = currentDeck;
      if (onDeckChangeRef.current) {
        onDeckChangeRef.current(currentDeck);
      }
    }

    // 4. Update Character model state for third-person rendering
    const footY = surfaceYRef.current;
    setCharacterState({
      position: [positionRef.current.x, footY, positionRef.current.z],
      rotationY: yaw + Math.PI,
      isMoving
    });

    // 5. Camera positioning based on perspective
    if (perspectiveRef.current === 'first-person') {
      // First person: camera at eye level
      camera.position.set(positionRef.current.x, positionRef.current.y, positionRef.current.z);
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
    } else {
      // Third person: orbit camera behind player
      const armDistance = 3.2;
      const heightOffset = 0.85;

      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      const camX = positionRef.current.x + Math.sin(yaw) * armDistance * cosPitch;
      const camZ = positionRef.current.z + Math.cos(yaw) * armDistance * cosPitch;
      const camY = Math.max(footY + 0.35, positionRef.current.y + heightOffset - sinPitch * 2.2);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(positionRef.current.x, positionRef.current.y - 0.2, positionRef.current.z);
    }

    // 6. Proximity check for equipment inspection (including vertical elevation check)
    const closest = findClosestEquipment(positionRef.current.x, positionRef.current.z, surfaceYRef.current);
    const closestId = closest ? closest.id : null;
    if (closestId !== lastClosestIdRef.current) {
      lastClosestIdRef.current = closestId;
      if (onNearbyEquipmentChangeRef.current) {
        onNearbyEquipmentChangeRef.current(closest);
      }
    }
  });

  return (
    <>
      {/* 3D Character Model (Visible in third-person view) */}
      <PlayerCharacter
        position={characterState.position}
        rotationY={characterState.rotationY}
        isMoving={characterState.isMoving}
        visible={currentPerspective === 'third-person'}
      />
    </>
  );
};
