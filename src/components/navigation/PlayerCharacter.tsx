import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerCharacterProps {
  position: [number, number, number];
  rotationY: number;
  isMoving: boolean;
  visible?: boolean;
}

/**
 * PlayerCharacter:
 * 3D procedural character representing an onshore petroleum drilling engineer / roughneck:
 * - ANSI certified high-impact yellow hard hat with headlamp
 * - Clear wrap-around safety glasses
 * - Heavy-duty oilfield flame-resistant (FR) navy blue coveralls
 * - Hi-Vis fluorescent yellow safety vest with silver reflective stripes
 * - H2S multi-gas personal monitor clip on lapel
 * - Impact-resistant rigger work gloves
 * - Steel-toe puncture-resistant oilfield safety boots
 * - Natural procedural limb animation when walking
 */
export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  position,
  rotationY,
  isMoving,
  visible = true
}) => {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const walkCycle = useRef(0);

  useFrame((_, delta) => {
    if (!visible) return;

    if (isMoving) {
      walkCycle.current += delta * 9.0;
      const swing = Math.sin(walkCycle.current) * 0.45;

      // Legs swing in opposition
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;

      // Arms swing opposite to corresponding leg
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8;

      // Slight natural hip bounce
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.88 + Math.abs(Math.sin(walkCycle.current * 2)) * 0.04;
      }
    } else {
      // Idle breathing and neutral limb position
      walkCycle.current += delta * 1.5;
      const breathe = Math.sin(walkCycle.current) * 0.01;

      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.88 + breathe;
      }
    }
  });

  if (!visible) return null;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ================= 1. TORSO & UPPER BODY ================= */}
      <group ref={torsoRef} position={[0, 0.88, 0]}>
        {/* Navy FR Work Coverall Torso */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.42, 0.54, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Hi-Vis Fluorescent Yellow Safety Vest Outer Layer */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.44, 0.52, 0.26]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>

        {/* Reflective Silver Bands (Horizontal Waist) */}
        <mesh position={[0, 0.16, 0.005]}>
          <boxGeometry args={[0.445, 0.05, 0.265]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Reflective Silver Bands (Vertical Shoulder Straps) */}
        {[-0.12, 0.12].map((sx) => (
          <mesh key={`vest-strap-${sx}`} position={[sx, 0.35, 0.005]}>
            <boxGeometry args={[0.04, 0.32, 0.266]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Personal H2S Multi-Gas Monitor Clip (Chest Lapel) */}
        <mesh position={[-0.14, 0.44, 0.14]}>
          <boxGeometry args={[0.05, 0.07, 0.03]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        {/* LCD display screen on gas monitor */}
        <mesh position={[-0.14, 0.44, 0.156]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 10]} />
          <meshStandardMaterial color="#d4a373" roughness={0.6} />
        </mesh>

        {/* ================= 2. HEAD & PPE HARD HAT ================= */}
        <group position={[0, 0.72, 0]}>
          {/* Head / Face */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.11, 14, 14]} />
            <meshStandardMaterial color="#d4a373" roughness={0.6} />
          </mesh>

          {/* Safety Eyewear (Clear Polycarbonate Glasses with Dark Frame) */}
          <mesh position={[0, 0.015, 0.09]}>
            <boxGeometry args={[0.16, 0.035, 0.05]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} metalness={0.2} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.035, 0.08]}>
            <boxGeometry args={[0.17, 0.01, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Hard Hat Suspension Dome (ANSI Certified Rig Helmet) */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.15} />
          </mesh>

          {/* Hard Hat Full Perimeter Safety Brim */}
          <mesh position={[0, 0.04, 0.01]} rotation={[-0.05, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.015, 18]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Hard Hat Top Reinforcement Ridge */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.03, 0.04, 0.22]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>

          {/* Headlamp Mount on Front of Hard Hat */}
          <mesh position={[0, 0.11, 0.14]}>
            <boxGeometry args={[0.045, 0.035, 0.025]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.11, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.01, 10]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* ================= 3. ARMS & WORK GLOVES ================= */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.26, 0.48, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.05, 0.28, 10]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.24, 10]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Silver wrist reflective strip */}
          <mesh position={[0, -0.47, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.03, 10]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.7} />
          </mesh>
          {/* Impact-Resistant Rigger Work Glove */}
          <mesh position={[0, -0.54, 0]}>
            <boxGeometry args={[0.08, 0.11, 0.06]} />
            <meshStandardMaterial color="#eab308" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.26, 0.48, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.05, 0.28, 10]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.24, 10]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Silver wrist reflective strip */}
          <mesh position={[0, -0.47, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.03, 10]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.7} />
          </mesh>
          {/* Impact-Resistant Rigger Work Glove */}
          <mesh position={[0, -0.54, 0]}>
            <boxGeometry args={[0.08, 0.11, 0.06]} />
            <meshStandardMaterial color="#eab308" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. LEGS & STEEL-TOE BOOTS ================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.88, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.4, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Lower Leg & Calf */}
        <mesh position={[0, -0.56, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.36, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Reflective band below knee */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.073, 0.073, 0.04, 10]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Steel-Toe Heavy Work Boot */}
        <group position={[0, -0.78, 0.04]}>
          {/* Boot Shaft */}
          <mesh position={[0, 0.05, -0.04]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Boot Foot & Reinforced Steel Toe Cap */}
          <mesh position={[0, 0, 0.03]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          {/* Rugged Cleated Sole */}
          <mesh position={[0, -0.045, 0.03]}>
            <boxGeometry args={[0.12, 0.02, 0.23]} />
            <meshStandardMaterial color="#020617" roughness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.88, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.4, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Lower Leg & Calf */}
        <mesh position={[0, -0.56, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.36, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Reflective band below knee */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.073, 0.073, 0.04, 10]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Steel-Toe Heavy Work Boot */}
        <group position={[0, -0.78, 0.04]}>
          {/* Boot Shaft */}
          <mesh position={[0, 0.05, -0.04]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Boot Foot & Reinforced Steel Toe Cap */}
          <mesh position={[0, 0, 0.03]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
          {/* Rugged Cleated Sole */}
          <mesh position={[0, -0.045, 0.03]}>
            <boxGeometry args={[0.12, 0.02, 0.23]} />
            <meshStandardMaterial color="#020617" roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
