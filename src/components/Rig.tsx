import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraViewMode } from '../types';
import { EQUIPMENT_LIST } from '../data/equipment';
import { PBR_PRESETS, getPBRTextures } from '../materials/materialLibrary';
import { PipeRacks } from './site/PipeRacks';
import { RigFloorDetails } from './site/RigFloorDetails';
import { MudSystemDetails } from './site/MudSystemDetails';
import { SiteSafetyAndPerimeter } from './site/SiteSafetyAndPerimeter';
import { SiteGround } from './site/SiteGround';
import { SiteInfrastructure } from './site/SiteInfrastructure';
import { CampZone } from './site/CampZone';
import { SiteVehicles } from './site/SiteVehicles';
import { SitePipingAndCables } from './site/SitePipingAndCables';
import { SiteClutterAndTools } from './site/SiteClutterAndTools';

interface RigProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  isPumping?: boolean;
  cameraViewMode?: CameraViewMode;
}

export const Rig: React.FC<RigProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  isPumping = true,
  cameraViewMode = 'orbit'
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const textures = getPBRTextures();

  // Safe selection handler that strictly disables camera focus/selection when in Walk mode
  const safeSelectEquipment = (id: string) => {
    if (cameraViewMode === 'walk') {
      return;
    }
    onSelectEquipment(id);
  };

  // Animation refs for moving components
  const agitator1Ref = useRef<THREE.Group>(null);
  const agitator2Ref = useRef<THREE.Group>(null);
  const shakerVibeRef = useRef<THREE.Group>(null);
  const travellingBlockRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate mud tank agitators when pumping
    if (isPumping) {
      if (agitator1Ref.current) agitator1Ref.current.rotation.y += 0.05;
      if (agitator2Ref.current) agitator2Ref.current.rotation.y += 0.05;
      // High-frequency vibration for shale shaker
      if (shakerVibeRef.current) {
        shakerVibeRef.current.position.y = -0.18 + Math.sin(time * 30) * 0.015;
        shakerVibeRef.current.position.z = 12 + Math.cos(time * 30) * 0.015;
      }
    }

    // Subtle gentle breathing movement for travelling block
    if (travellingBlockRef.current) {
      travellingBlockRef.current.position.y = 16 + Math.sin(time * 0.8) * 0.4;
    }
  });

  const getMaterialColor = (id: string, baseColor: string, highlightColor: string = '#f59e0b') => {
    if (selectedEquipmentId === id) return '#f97316'; // Active selected orange
    if (hoveredId === id) return highlightColor;      // Hovered yellow/amber
    return baseColor;
  };

  const handlePointerOver = (e: any, id: string) => {
    if (cameraViewMode === 'walk') return;
    e.stopPropagation();
    setHoveredId(id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    if (cameraViewMode === 'walk') return;
    e.stopPropagation();
    setHoveredId(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any, id: string) => {
    // In Walk mode, clicking on objects must NEVER trigger camera focus or lock onto equipment
    if (cameraViewMode === 'walk') {
      return;
    }
    // If the mouse dragged more than 5 pixels (e.g. orbit rotation), do not trigger equipment selection
    if (e.delta && e.delta > 5) return;
    e.stopPropagation();
    safeSelectEquipment(id);
  };

  return (
    <group>
      {/* ================= 1. RIG FOUNDATION SLAB & SUBSTRUCTURE ================= */}
      {/* Rig Foundation Concrete Slab */}
      <mesh receiveShadow position={[0, -1.9, 0]}>
        <boxGeometry args={[26, 0.3, 26]} />
        <meshStandardMaterial
          color="#475569"
          roughness={PBR_PRESETS.CONCRETE.roughness}
          metalness={PBR_PRESETS.CONCRETE.metalness}
          bumpMap={textures.concreteNoise}
          bumpScale={0.03}
        />
      </mesh>
      {/* Concrete Pad Chamfered Curb Trim */}
      <mesh position={[0, -1.74, 0]}>
        <boxGeometry args={[26.15, 0.04, 26.15]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Cellar Trench beneath Substructure */}
      <mesh position={[0, -2.5, 0]}>
        <boxGeometry args={[4, 1.2, 4]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.92}
          metalness={0.05}
          bumpMap={textures.concreteNoise}
          bumpScale={0.04}
        />
      </mesh>
      {/* Cellar Safety Hazard Stripe Rim */}
      <mesh position={[0, -1.74, 0]}>
        <boxGeometry args={[4.4, 0.08, 4.4]} />
        <meshStandardMaterial map={textures.safetyHazard} roughness={0.45} />
      </mesh>

      {/* ================= 2. SUBSTRUCTURE (ELEVATED FLOOR) ================= */}
      <group position={[0, 0.8, 0]}>
        {/* Four Main Structural Columns */}
        {[-3, 3].map((x) =>
          [-3, 3].map((z) => (
            <group key={`sub-col-${x}-${z}`} position={[x, 0, z]}>
              <mesh>
                <boxGeometry args={[0.8, 5.2, 0.8]} />
                <meshStandardMaterial
                  color="#475569"
                  metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
                  roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
                />
              </mesh>
              {/* Heavy base shoe plate */}
              <mesh position={[0, -2.5, 0]}>
                <boxGeometry args={[1.2, 0.15, 1.2]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Structural diagonal stiffener gusset */}
              <mesh position={[0, 2.3, 0]}>
                <boxGeometry args={[1.05, 0.4, 1.05]} />
                <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.45} />
              </mesh>
            </group>
          ))
        )}
        {/* Rig Floor Deck Platform with diamond plate traffic wear */}
        <mesh receiveShadow position={[0, 2.65, 0]}>
          <boxGeometry args={[9, 0.3, 9]} />
          <meshStandardMaterial
            color="#526177"
            metalness={0.4}
            roughness={0.52}
            roughnessMap={textures.dirtWear}
          />
        </mesh>
        {/* Floor Edge Framing Beams */}
        <mesh position={[4.45, 2.65, 0]}>
          <boxGeometry args={[0.15, 0.35, 9.1]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-4.45, 2.65, 0]}>
          <boxGeometry args={[0.15, 0.35, 9.1]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Rig Floor Side Safety Handrails with Kickplates */}
        <group position={[4.4, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.9, 8.8]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          {/* Kickplate / Toe-board */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.06, 0.15, 8.8]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.5} />
          </mesh>
        </group>
        <group position={[-4.4, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.9, 8.8]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.06, 0.15, 8.8]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= 3. DERRICK / MAST ================= */}
      <group
        position={[0, 3.5, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'derrick')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'derrick')}
      >
        {/* Derrick Legs: 4 angled steel legs tapering to the top */}
        {[
          { x: -3.6, z: -3.6, tx: -1.2, tz: -1.2 },
          { x: 3.6, z: -3.6, tx: 1.2, tz: -1.2 },
          { x: -3.6, z: 3.6, tx: -1.2, tz: 1.2 },
          { x: 3.6, z: 3.6, tx: 1.2, tz: 1.2 }
        ].map((leg, i) => {
          const midX = (leg.x + leg.tx) / 2;
          const midZ = (leg.z + leg.tz) / 2;
          return (
            <group key={`derrick-leg-${i}`}>
              <mesh position={[midX, 11, midZ]}>
                <cylinderGeometry args={[0.18, 0.28, 22, 6]} />
                <meshStandardMaterial
                  color={getMaterialColor('derrick', '#94a3b8', '#fbbf24')}
                  metalness={PBR_PRESETS.DERRICK_STEEL.metalness}
                  roughness={PBR_PRESETS.DERRICK_STEEL.roughness}
                />
              </mesh>
              {/* Mast Anchor Foot Hinge Pin Plate */}
              <mesh position={[leg.x, 0.15, leg.z]}>
                <boxGeometry args={[0.45, 0.3, 0.45]} />
                <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          );
        })}

        {/* Cross Bracing Tiers */}
        {[4, 8, 12, 16, 20].map((h) => {
          const width = 7.2 - (h / 22) * 4.8;
          return (
            <group key={`tier-${h}`} position={[0, h, 0]}>
              <mesh position={[0, 0, width / 2]}>
                <boxGeometry args={[width, 0.12, 0.12]} />
                <meshStandardMaterial
                  color={getMaterialColor('derrick', '#64748b')}
                  metalness={0.65}
                  roughness={0.32}
                />
              </mesh>
              <mesh position={[0, 0, -width / 2]}>
                <boxGeometry args={[width, 0.12, 0.12]} />
                <meshStandardMaterial
                  color={getMaterialColor('derrick', '#64748b')}
                  metalness={0.65}
                  roughness={0.32}
                />
              </mesh>
              <mesh position={[width / 2, 0, 0]}>
                <boxGeometry args={[0.12, 0.12, width]} />
                <meshStandardMaterial
                  color={getMaterialColor('derrick', '#64748b')}
                  metalness={0.65}
                  roughness={0.32}
                />
              </mesh>
              <mesh position={[-width / 2, 0, 0]}>
                <boxGeometry args={[0.12, 0.12, width]} />
                <meshStandardMaterial
                  color={getMaterialColor('derrick', '#64748b')}
                  metalness={0.65}
                  roughness={0.32}
                />
              </mesh>
            </group>
          );
        })}

        {/* Monkey Board / Monkeyboard platform (approx 85 ft level / y=16) */}
        <group position={[0, 16, 1.6]}>
          <mesh>
            <boxGeometry args={[2.2, 0.1, 1.2]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          {/* Derrickman Fall Protection Anchor Bar & Handrail */}
          <mesh position={[0, 0.5, 0.58]}>
            <boxGeometry args={[2.2, 0.9, 0.04]} />
            <meshStandardMaterial color="#eab308" metalness={0.3} roughness={0.4} />
          </mesh>
          {/* Grated Floor Edge Trim */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[2.24, 0.04, 1.24]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. CROWN BLOCK ================= */}
      <group
        position={[0, 26, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'crown-block')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'crown-block')}
      >
        {/* Water Table Frame with heavy steel I-beam flanges */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.6, 0.3, 2.6]} />
          <meshStandardMaterial
            color="#475569"
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>
        {/* Crown Sheave Cluster Assembly */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.4, 0.8, 1.6]} />
          <meshStandardMaterial
            color={getMaterialColor('crown-block', '#e11d48', '#fb7185')}
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
        {/* Sheaves (Machined Steel Wheels with grooved cable rims) */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((offset, idx) => (
          <mesh key={`sheave-${idx}`} position={[offset, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.08, 20]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={PBR_PRESETS.RAW_METAL.metalness}
              roughness={PBR_PRESETS.RAW_METAL.roughness}
              bumpMap={textures.metalScratches}
              bumpScale={0.01}
            />
          </mesh>
        ))}
        {/* Top Warning Aviation Beacon */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} />
        </mesh>
        {/* Beacon Mast mount */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* ================= 5. TRAVELLING BLOCK & TOP DRIVE ================= */}
      <group ref={travellingBlockRef} position={[0, 16, 0]}>
        {/* Wireline lines running down from crown */}
        {[-0.25, 0.25].map((x) => (
          <mesh key={`wireline-${x}`} position={[x, 5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.92}
              roughness={0.2}
              bumpMap={textures.metalScratches}
              bumpScale={0.02}
            />
          </mesh>
        ))}

        {/* Travelling Block Body */}
        <group
          onPointerOver={(e) => handlePointerOver(e, 'travelling-block')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'travelling-block')}
        >
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.1, 1.3, 1.2]} />
            <meshStandardMaterial
              color={getMaterialColor('travelling-block', '#eab308', '#fef08a')}
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          {/* Block Guide Side Wear Pads */}
          <mesh position={[0.56, 0.4, 0]}>
            <boxGeometry args={[0.04, 1.1, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.56, 0.4, 0]}>
            <boxGeometry args={[0.04, 1.1, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Swivel / Hook Shackle */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial
              color="#475569"
              metalness={PBR_PRESETS.RAW_METAL.metalness}
              roughness={PBR_PRESETS.RAW_METAL.roughness}
            />
          </mesh>
        </group>

        {/* Top Drive Assembly (Suspended directly below hook) */}
        <group
          position={[0, -1.8, 0]}
          onPointerOver={(e) => handlePointerOver(e, 'top-drive')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'top-drive')}
        >
          {/* Main Motor Housing */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.4, 1.6, 1.4]} />
            <meshStandardMaterial
              color={getMaterialColor('top-drive', '#0284c7', '#38bdf8')}
              metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
              roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            />
          </mesh>
          {/* Cooling Rib Strips */}
          {[-0.6, -0.2, 0.2, 0.6].map((rz) => (
            <mesh key={`td-rib-${rz}`} position={[0.71, 0.3, rz]}>
              <boxGeometry args={[0.04, 1.2, 0.08]} />
              <meshStandardMaterial color="#0369a1" roughness={0.4} />
            </mesh>
          ))}
          {/* Motor Cooling Fan Housing */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
            <meshStandardMaterial color="#0369a1" roughness={0.5} />
          </mesh>
          {/* Rotary Quill & Washpipe (Polished Chrome) */}
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={PBR_PRESETS.CHROME_POLISHED.metalness}
              roughness={PBR_PRESETS.CHROME_POLISHED.roughness}
            />
          </mesh>
          {/* Pipe Elevator Links (Bails) */}
          <mesh position={[-0.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.4, 10]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.4, 10]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          {/* Pipe Elevator Clamp Ring */}
          <mesh position={[0, -1.45, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* ================= 6. ROTARY TABLE & DRILL STRING ================= */}
      <group
        position={[0, 3.45, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'drill-string')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'drill-string')}
      >
        {/* Rotary Table Ring on Floor */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.1, 1.2, 0.15, 24]} />
          <meshStandardMaterial
            color={getMaterialColor('drill-string', '#e11d48', '#fb7185')}
            metalness={0.7}
            roughness={0.3}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>
        {/* Master Bushing Center Bowl */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Drill Pipe descending through floor into wellbore with API tool joints */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 7, 16]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>
        {/* Tool Joint Connection Collar */}
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.35, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Drill Pipe running down through cellar into BOP */}
        <mesh position={[0, -3.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 6, 16]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>
      </group>

      {/* ================= 7. DRAWWORKS ================= */}
      <group
        position={[0, 3.8, -3.4]}
        onPointerOver={(e) => handlePointerOver(e, 'drawworks')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'drawworks')}
      >
        {/* Main Winch Body Frame */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2.4, 1.2, 1.8]} />
          <meshStandardMaterial
            color={getMaterialColor('drawworks', '#2563eb', '#60a5fa')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>
        {/* Grooved Spooling Drum (High metalness + wire wrap ridges) */}
        <mesh position={[0, 0.5, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 1.6, 20]} />
          <meshStandardMaterial
            color="#475569"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={0.28}
            bumpMap={textures.metalScratches}
            bumpScale={0.02}
          />
        </mesh>
        {/* Brake Disc Housing */}
        <mesh position={[1.1, 0.5, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.55, 0.2, 20]} />
          <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Disc Brake Caliper Unit */}
        <mesh position={[1.1, 0.9, 0.4]}>
          <boxGeometry args={[0.25, 0.35, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 8. BOP STACK (UNDER RIG FLOOR) ================= */}
      <group
        position={[0, -0.6, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'bop-stack')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'bop-stack')}
      >
        {/* Annular Preventer (Spherical/Donut top with flange bolts) */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.7, 20]} />
          <meshStandardMaterial
            color={getMaterialColor('bop-stack', '#f97316', '#fdba74')}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Flange Bolt Ring Studs */}
        <mesh position={[0, 1.58, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.08, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.22} />
        </mesh>

        {/* Upper Pipe Ram Body */}
        <group position={[0, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.5, 1.1]} />
            <meshStandardMaterial
              color={getMaterialColor('bop-stack', '#ea580c', '#fdba74')}
              metalness={0.65}
              roughness={0.35}
            />
          </mesh>
          {/* Hydraulic Cylinder Bonnet End-Caps */}
          <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>

        {/* Blind Shear Ram Body */}
        <group position={[0, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.5, 1.1]} />
            <meshStandardMaterial
              color={getMaterialColor('bop-stack', '#dc2626', '#f87171')}
              metalness={0.65}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>

        {/* Lower Pipe Ram Body */}
        <group position={[0, -0.8, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.5, 1.1]} />
            <meshStandardMaterial
              color={getMaterialColor('bop-stack', '#ea580c', '#fdba74')}
              metalness={0.65}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>

        {/* Wellhead Casing Flange Base (Heavy Cast Steel) */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.4, 20]} />
          <meshStandardMaterial
            color="#334155"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
          />
        </mesh>
        {/* Choke line manifold takeoff pipe */}
        <mesh position={[1.4, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 10]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* ================= 9. CHOKE MANIFOLD & STANDPIPE ================= */}
      <group
        position={[3.8, -1.98, 0.5]}
        onPointerOver={(e) => handlePointerOver(e, 'choke-manifold')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'choke-manifold')}
      >
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2.5, 0.8, 1.2]} />
          <meshStandardMaterial
            color={getMaterialColor('choke-manifold', '#d97706', '#fde68a')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>
        {/* High-Pressure Gate Valves with Handwheels */}
        {[-0.8, 0, 0.8].map((vx) => (
          <group key={`choke-v-${vx}`} position={[vx, 0.9, 0]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
              <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.35} />
            </mesh>
            {/* Valve Handwheel */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
              <meshStandardMaterial color="#f87171" metalness={0.7} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 10. TRIPLEX MUD PUMPS ================= */}
      <group
        position={[-10, -1.98, -1]}
        onPointerOver={(e) => handlePointerOver(e, 'mud-pumps')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'mud-pumps')}
      >
        {/* Mud Pump #1 */}
        <group position={[0, 0, -2.5]}>
          {/* Base Skid with flange trims */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[5, 0.4, 2.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
          </mesh>
          {/* Pump Power End Body */}
          <mesh position={[-0.8, 1.1, 0]}>
            <boxGeometry args={[2.8, 1.4, 1.8]} />
            <meshStandardMaterial
              color={getMaterialColor('mud-pumps', '#059669', '#34d399')}
              metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
              roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            />
          </mesh>
          {/* Crankcase Inspection Hatch */}
          <mesh position={[-0.8, 1.1, 0.92]}>
            <boxGeometry args={[1.6, 0.8, 0.04]} />
            <meshStandardMaterial color="#047857" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Fluid End (3 Machined Cylinders) */}
          <mesh position={[1.4, 0.9, 0]}>
            <boxGeometry args={[1.4, 1.1, 1.7]} />
            <meshStandardMaterial
              color="#475569"
              metalness={PBR_PRESETS.RAW_METAL.metalness}
              roughness={PBR_PRESETS.RAW_METAL.roughness}
              bumpMap={textures.metalScratches}
              bumpScale={0.015}
            />
          </mesh>
          {/* 3 Cylinder Valve Caps */}
          {[-0.5, 0, 0.5].map((cz) => (
            <mesh key={`p1-cap-${cz}`} position={[2.12, 0.9, cz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          {/* Pulsation Dampener (Spherical top with pressure gauge) */}
          <mesh position={[1.4, 1.9, 0]}>
            <sphereGeometry args={[0.45, 20, 20]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          {/* Pressure Gauge Dial */}
          <mesh position={[1.4, 2.38, 0.35]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
        </group>

        {/* Mud Pump #2 */}
        <group position={[0, 0, 1.5]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[5, 0.4, 2.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
          </mesh>
          <mesh position={[-0.8, 1.1, 0]}>
            <boxGeometry args={[2.8, 1.4, 1.8]} />
            <meshStandardMaterial
              color={getMaterialColor('mud-pumps', '#059669', '#34d399')}
              metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
              roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            />
          </mesh>
          <mesh position={[-0.8, 1.1, 0.92]}>
            <boxGeometry args={[1.6, 0.8, 0.04]} />
            <meshStandardMaterial color="#047857" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[1.4, 0.9, 0]}>
            <boxGeometry args={[1.4, 1.1, 1.7]} />
            <meshStandardMaterial
              color="#475569"
              metalness={PBR_PRESETS.RAW_METAL.metalness}
              roughness={PBR_PRESETS.RAW_METAL.roughness}
              bumpMap={textures.metalScratches}
              bumpScale={0.015}
            />
          </mesh>
          {[-0.5, 0, 0.5].map((cz) => (
            <mesh key={`p2-cap-${cz}`} position={[2.12, 0.9, cz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          <mesh position={[1.4, 1.9, 0]}>
            <sphereGeometry args={[0.45, 20, 20]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          <mesh position={[1.4, 2.38, 0.35]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
        </group>

        {/* High-Pressure Discharge Pipe towards Derrick */}
        <mesh position={[4.5, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 7, 12]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={0.28}
          />
        </mesh>
      </group>

      {/* ================= 11. MUD TANKS & AGITATORS ================= */}
      <group
        position={[-9, -1.98, 6.5]}
        onPointerOver={(e) => handlePointerOver(e, 'mud-tanks')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'mud-tanks')}
      >
        {/* Main Mud Pit Tank Container with wall stiffeners */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[4.8, 1.8, 6.4]} />
          <meshStandardMaterial
            color={getMaterialColor('mud-tanks', '#0891b2', '#22d3ee')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>
        {/* Tank Wall Vertical Stiffener Ribs (Industrial plate fabrication detail) */}
        {[-2, -0.67, 0.67, 2].map((stz) => (
          <mesh key={`tank-stiff-${stz}`} position={[2.42, 0.9, stz]}>
            <boxGeometry args={[0.06, 1.7, 0.08]} />
            <meshStandardMaterial color="#0e7490" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        {/* Mud Fluid Surface inside Tank (viscous slurry fluid sheen) */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[4.4, 0.1, 6]} />
          <meshStandardMaterial
            color="#78716c"
            roughness={PBR_PRESETS.DRILLING_MUD.roughness}
            metalness={PBR_PRESETS.DRILLING_MUD.metalness}
          />
        </mesh>
        {/* Tank Walkway Grating & Handrail */}
        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[0.8, 0.05, 6.2]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Agitator Motor 1 & 2 */}
        <group ref={agitator1Ref} position={[1.2, 2.2, -1.8]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[1, 0.05, 0.1]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
        <group ref={agitator2Ref} position={[1.2, 2.2, 1.8]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[1, 0.05, 0.1]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ================= 12. SHALE SHAKERS ================= */}
      <group
        ref={shakerVibeRef}
        position={[-8.5, -0.18, 12]}
        onPointerOver={(e) => handlePointerOver(e, 'shale-shakers')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'shale-shakers')}
      >
        {/* Shaker Elevated Skid Frame */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[4.2, 0.4, 2.8]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Shaker Screen Box 1 & 2 */}
        {[-1, 1].map((sx) => (
          <group key={`shaker-unit-${sx}`} position={[sx, 0.8, 0]}>
            <mesh rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[1.5, 0.7, 2.2]} />
              <meshStandardMaterial
                color={getMaterialColor('shale-shakers', '#ea580c', '#fb923c')}
                metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
                roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
              />
            </mesh>
            {/* Screen Mesh Surface with Mud Sheen */}
            <mesh position={[0, 0.36, 0]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[1.35, 0.02, 2.0]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.75}
                roughness={0.25}
                bumpMap={textures.metalScratches}
                bumpScale={0.01}
              />
            </mesh>
            {/* Vibrator Electric Motor */}
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.6, 16]} />
              <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Possum Belly Mud Feeder Box from Wellhead */}
        <mesh position={[0, 1.4, 1.2]}>
          <boxGeometry args={[3.8, 0.6, 0.7]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 13. GENERATOR SKID ================= */}
      <group
        position={[11, -1.98, -6]}
        onPointerOver={(e) => handlePointerOver(e, 'generators')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'generators')}
      >
        {/* Skid Platform */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[5, 0.4, 7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Generator Cabin Units 1, 2, 3 with corrugated housing bump map */}
        {[-2, 0, 2].map((gz) => (
          <group key={`gen-${gz}`} position={[0, 1.2, gz]}>
            <mesh>
              <boxGeometry args={[4.2, 1.7, 1.6]} />
              <meshStandardMaterial
                color={getMaterialColor('generators', '#eab308', '#fef08a')}
                metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
                roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
                bumpMap={textures.corrugatedPanel}
                bumpScale={0.02}
              />
            </mesh>
            {/* Exhaust Muffler Pipe on Top with Rain Cap */}
            <mesh position={[-1.2, 1.4, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 1.1, 14]} />
              <meshStandardMaterial
                color="#475569"
                metalness={PBR_PRESETS.RAW_METAL.metalness}
                roughness={0.25}
              />
            </mesh>
            <mesh position={[-1.2, 2.0, 0]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            {/* Radiator Louvers */}
            <mesh position={[2.11, 0, 0]}>
              <boxGeometry args={[0.04, 1.2, 1.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 14. MUD LOGGING CABIN ================= */}
      <group
        position={[9, -1.98, 3]}
        onPointerOver={(e) => handlePointerOver(e, 'mud-logging')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'mud-logging')}
      >
        {/* Insulated Pressurized Cabin Body with Corrugated Siding */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[3.4, 2.2, 4.8]} />
          <meshStandardMaterial
            color={getMaterialColor('mud-logging', '#f8fafc', '#fed7aa')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            bumpMap={textures.corrugatedPanel}
            bumpScale={0.025}
          />
        </mesh>
        {/* Corner ISO Casting Lifting Blocks */}
        {[-1.68, 1.68].map((cx) =>
          [-2.38, 2.38].map((cz) => (
            <mesh key={`cabin-corner-${cx}-${cz}`} position={[cx, 2.18, cz]}>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
          ))
        )}
        {/* Observation Windows with Tinted Glass Sheen */}
        <mesh position={[-1.71, 1.2, 0]}>
          <boxGeometry args={[0.05, 0.8, 2.4]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={PBR_PRESETS.CABIN_GLASS.roughness}
            metalness={PBR_PRESETS.CABIN_GLASS.metalness}
          />
        </mesh>
        {/* Roof Air Conditioner / Overpressure Purge Unit */}
        <mesh position={[0, 2.4, 1.2]}>
          <boxGeometry args={[1.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Roof Satellite Dome Antenna */}
        <mesh position={[0, 2.5, -1.2]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= 15. COMPANY MAN & TOOLPUSHER TRAILER ================= */}
      <group
        position={[9.5, -1.98, 9.5]}
        onPointerOver={(e) => handlePointerOver(e, 'company-man')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'company-man')}
      >
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[3.6, 2.1, 4.4]} />
          <meshStandardMaterial
            color={getMaterialColor('company-man', '#e2e8f0', '#fef08a')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            bumpMap={textures.corrugatedPanel}
            bumpScale={0.02}
          />
        </mesh>
        {/* Door and Steps */}
        <mesh position={[-1.81, 0.8, 0]}>
          <boxGeometry args={[0.05, 1.6, 0.9]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ================= 16. WASTE PIT & FLARE LINE ================= */}
      <group
        position={[-13, -1.98, -9]}
        onPointerOver={(e) => handlePointerOver(e, 'waste-pit')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'waste-pit')}
      >
        {/* Pit Depression / Berm with soil roughness */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[9, 0.4, 9]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.95}
            bumpMap={textures.dirtWear}
            bumpScale={0.03}
          />
        </mesh>
        {/* Waste Slurry Liquid with oily dark sheen */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[8.4, 0.1, 8.4]} />
          <meshStandardMaterial
            color={getMaterialColor('waste-pit', '#292524', '#78716c')}
            roughness={0.16}
            metalness={0.15}
          />
        </mesh>
        {/* Flare Igniter Pipe */}
        <mesh position={[-3.8, 2, -3.8]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 4.5, 14]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={0.25}
          />
        </mesh>
        {/* Flare Flame (Small educational flame with subtle bloom glow) */}
        <mesh position={[-4.2, 4.3, -3.8]}>
          <coneGeometry args={[0.25, 0.8, 14]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* ================= 17. REALISTIC DRILLING SITE MODULES ================= */}
      {/* Catwalk, Pipe Racks, Casing stands & V-Door Ramp */}
      <PipeRacks
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={safeSelectEquipment}
        getMaterialColor={getMaterialColor}
      />

      {/* Rig Floor Details: Doghouse / Driller cabin, Red Zone, Mousehole, Rathole */}
      <RigFloorDetails
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={safeSelectEquipment}
        getMaterialColor={getMaterialColor}
      />

      {/* Mud System Details: Poor Boy Degasser, Gas Vent Line, Flow Line, Tank Interconnects */}
      <MudSystemDetails
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={safeSelectEquipment}
        getMaterialColor={getMaterialColor}
        isPumping={isPumping}
      />

      {/* Site Safety & Environment: Windsock, Muster Point, Emergency Shower, HSE Signs, Perimeter Fence */}
      <SiteSafetyAndPerimeter
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={safeSelectEquipment}
        getMaterialColor={getMaterialColor}
      />

      {/* ================= 18. LOCATION GROUND, RIG MATS & BOP CELLAR ================= */}
      <SiteGround />

      {/* ================= 19. INDUSTRIAL INFRASTRUCTURE, WORKSHOP & STORAGE ================= */}
      <SiteInfrastructure />

      {/* ================= 20. SEPARATED SAFE LIVING & CAMP ZONE ================= */}
      <CampZone />

      {/* ================= 21. REALISTIC OILFIELD SERVICE VEHICLES ================= */}
      <SiteVehicles />

      {/* ================= 22. HIGH-PRESSURE PLUMBING, ROTARY HOSE & CABLE TRAYS ================= */}
      <SitePipingAndCables />

      {/* ================= 23. OPERATIONAL CLUTTER, PALLETS & JOB TOOLS ================= */}
      <SiteClutterAndTools />
    </group>
  );
};
