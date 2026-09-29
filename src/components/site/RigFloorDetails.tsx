import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PBR_PRESETS } from '../../materials/materialLibrary';
import { getPBRTextures } from '../../materials/proceduralTextures';

interface RigFloorDetailsProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  getMaterialColor: (id: string, baseColor: string, highlightColor?: string) => string;
}

export const RigFloorDetails: React.FC<RigFloorDetailsProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  getMaterialColor
}) => {
  const isDoghouseSelected = selectedEquipmentId === 'doghouse';
  const textures = useMemo(() => getPBRTextures(), []);

  return (
    <group position={[0, 3.45, 0]}>
      {/* ================= 1. RED ZONE HAZARD FLOOR MARKING ================= */}
      {/* High-hazard rotating & pipe-handling exclusion zone around Rotary Table */}
      <group position={[0, 0.015, 0]}>
        {/* Red tinted circular floor zone (4m diameter) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.9, 2.3, 32]} />
          <meshStandardMaterial
            color="#dc2626"
            roughness={0.65}
            metalness={0.15}
            roughnessMap={textures.dirtWear}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        {/* Yellow-and-Black Hazard Safety Border Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.5, 32]} />
          <meshStandardMaterial
            color="#eab308"
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
        {/* Black segment stripes on border */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <mesh
            key={`hazard-strip-${deg}`}
            rotation={[-Math.PI / 2, 0, (deg * Math.PI) / 180]}
            position={[0, 0.005, 0]}
          >
            <planeGeometry args={[0.4, 0.22]} />
            <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* ================= 2. ROTARY TABLE RIM & MASTER BUSHING ================= */}
      <group position={[0, 0.08, 0]}>
        {/* Outer cast steel table rim */}
        <mesh receiveShadow>
          <cylinderGeometry args={[0.88, 0.92, 0.16, 24]} />
          <meshStandardMaterial
            color="#334155"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>
        {/* Master bushing insert ring */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 20]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.9}
            roughness={0.2}
            bumpMap={textures.metalScratches}
            bumpScale={0.01}
          />
        </mesh>
      </group>

      {/* ================= 3. MOUSEHOLE & RATHOLE ================= */}
      {/* Mousehole: pipe socket in floor used to pre-stage the next drill pipe joint */}
      <group position={[1.4, 0, 1.2]}>
        {/* Raised protective collar */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.2, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
        {/* Hole interior down through floor */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.5, 14]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Staged drill pipe joint peeking out */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3.2, 12]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>
      </group>

      {/* Rathole: storage socket for kelly / drive bushing */}
      <group position={[2.1, 0, 1.9]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.16, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 1.2, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= 4. DOGHOUSE / DRILLER'S CABIN ================= */}
      {/* Enclosed climate-controlled command cabin on the driller's side (x=3.1, z=-2.1) */}
      <group
        name="doghouse-group"
        position={[3.1, 1.35, -2.1]}
        onClick={(e: any) => {
          if (e.delta && e.delta > 5) return;
          e.stopPropagation();
          onSelectEquipment('doghouse');
        }}
      >
        {/* Cabin Main Enclosure (Box cabin 2.2m wide x 2.5m high x 3.4m deep) */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.2, 2.5, 3.4]} />
          <meshStandardMaterial
            color={getMaterialColor('doghouse', '#1e293b', '#fbbf24')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
            bumpMap={textures.corrugated}
            bumpScale={0.02}
          />
        </mesh>

        {/* Sloped Rain Roof Cap */}
        <mesh position={[0, 1.32, 0]}>
          <boxGeometry args={[2.35, 0.12, 3.55]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Large Front Panoramic Observation Windows facing Rig Floor & Rotary Table */}
        <mesh position={[-1.11, 0.35, 0]}>
          <boxGeometry args={[0.04, 1.2, 2.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* Window Framing Grid */}
        <mesh position={[-1.12, 0.35, 0]}>
          <boxGeometry args={[0.05, 1.26, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Driller's Cyber Chair & Joystick Console inside cabin */}
        <group position={[-0.4, -0.3, 0]}>
          {/* Cyber Chair */}
          <mesh position={[0.2, 0.2, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.5]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.5} />
          </mesh>
          {/* Driller's Multi-screen Console Desk */}
          <mesh position={[-0.4, 0.0, 0]}>
            <boxGeometry args={[0.6, 0.7, 1.6]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Illuminated digital telemetry screens */}
          {[-0.5, 0, 0.5].map((zScr, sIdx) => (
            <mesh key={`driller-scr-${sIdx}`} position={[-0.42, 0.5, zScr]}>
              <boxGeometry args={[0.04, 0.32, 0.42]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}
        </group>

        {/* Cabin Door (facing rear deck) */}
        <mesh position={[0, -0.2, -1.71]}>
          <boxGeometry args={[0.9, 1.9, 0.04]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Door Inspection Window */}
        <mesh position={[0, 0.3, -1.72]}>
          <boxGeometry args={[0.35, 0.45, 0.02]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Driller Cabin Safety Identification Plaque */}
        <mesh position={[-0.8, 0.9, -1.72]}>
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>

        {/* Exterior Air Conditioner Unit mounted on rear wall */}
        <mesh position={[0.5, 0.7, -1.8]}>
          <boxGeometry args={[0.7, 0.5, 0.4]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Selection Indicator Ring */}
        {isDoghouseSelected && (
          <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 2.7, 24]} />
            <meshBasicMaterial color="#f97316" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* ================= 5. RIG FLOOR PERIMETER BARRIERS & V-DOOR OPENING ================= */}
      {/* V-Door opening is at Z = +4.4 between X = -1.4 and +1.4 to allow pipe transfer */}
      <group position={[0, 0, 0]}>
        {/* Front Left Rail */}
        <mesh position={[-2.9, 0.45, 4.4]}>
          <boxGeometry args={[3.0, 0.9, 0.08]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
        {/* Front Right Rail */}
        <mesh position={[2.9, 0.45, 4.4]}>
          <boxGeometry args={[3.0, 0.9, 0.08]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>

        {/* Yellow-Black safety chains across V-door when idle */}
        <mesh position={[0, 0.6, 4.4]}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* ================= 6. RIG FLOOR MAIN ACCESS STAIRWAY ================= */}
      {/* Heavy-duty steel industrial stairway leading from ground (y = -1.98 world, -5.43 relative) up to floor (y = 3.45) */}
      <group position={[4.6, 0, -2.1]}>
        {/* Ground landing concrete pad flush with ground */}
        <mesh position={[0, -5.35, -4.9]}>
          <boxGeometry args={[1.6, 0.16, 1.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>

        {/* Sloped stringers */}
        <mesh position={[0.5, -2.65, -2.35]} rotation={[0.78, 0, 0]}>
          <boxGeometry args={[0.08, 0.25, 7.4]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[-0.5, -2.65, -2.35]} rotation={[0.78, 0, 0]}>
          <boxGeometry args={[0.08, 0.25, 7.4]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
        </mesh>

        {/* Treads / Steps */}
        {Array.from({ length: 15 }).map((_, stepIdx) => {
          const frac = (stepIdx + 1) / 15.5;
          const yPos = -frac * 5.35;
          const zPos = -frac * 5.0;
          return (
            <mesh key={`stair-step-${stepIdx}`} position={[0, yPos, zPos]}>
              <boxGeometry args={[1.0, 0.06, 0.32]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={PBR_PRESETS.RAW_METAL.metalness}
                roughness={0.3}
                bumpMap={textures.metalScratches}
                bumpScale={0.01}
              />
            </mesh>
          );
        })}

        {/* Stair Safety Handrails */}
        <mesh position={[0.55, -2.05, -2.35]} rotation={[0.78, 0, 0]}>
          <boxGeometry args={[0.04, 0.9, 7.4]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
        <mesh position={[-0.55, -2.05, -2.35]} rotation={[0.78, 0, 0]}>
          <boxGeometry args={[0.04, 0.9, 7.4]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
      </group>

      {/* ================= 7. STANDPIPE & ROTARY KELLY HOSE ================= */}
      {/* Vertical 4" heavy-wall standpipe rising along derrick leg to deliver mud into flexible kelly hose */}
      <group position={[3.2, 0, 3.2]}>
        {/* Standpipe lower manifold & calibrated mud pressure gauge */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* High-pressure analog standpipe dial gauge */}
        <mesh position={[0.2, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Standpipe vertical run up the derrick (rising 12m) */}
        <mesh position={[0, 6.5, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 11, 12]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={PBR_PRESETS.RAW_METAL.roughness}
            bumpMap={textures.metalScratches}
            bumpScale={0.012}
          />
        </mesh>

        {/* Top Gooseneck bend at y = 12 */}
        <mesh position={[-0.3, 12, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.8, 10]} />
          <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* Flexible Reinforced Rubber Rotary Hose hanging in catenary loop towards top drive */}
        <mesh position={[-1.6, 10.5, -1.6]} rotation={[0.3, 0.7, -0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 5.5, 10]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={PBR_PRESETS.RUBBER_HOSE.roughness}
            metalness={PBR_PRESETS.RUBBER_HOSE.metalness}
          />
        </mesh>
      </group>

      {/* ================= 8. HYDRAULIC IRON ROUGHNECK ================= */}
      {/* Floor-mounted torque wrench and spinning wrench for making up / breaking out pipe tool joints */}
      <group position={[-1.8, 0, 1.6]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.9]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>
        {/* Hydraulic torque wrench jaws */}
        <mesh position={[0.35, 0.75, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.6]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
      </group>
    </group>
  );
};
