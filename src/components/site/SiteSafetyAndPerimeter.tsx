import React from 'react';
import * as THREE from 'three';

interface SiteSafetyProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  getMaterialColor: (id: string, baseColor: string, highlightColor?: string) => string;
}

export const SiteSafetyAndPerimeter: React.FC<SiteSafetyProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  getMaterialColor
}) => {
  const isMusterSelected = selectedEquipmentId === 'muster-point';

  return (
    <group name="site-safety-and-perimeter">
      {/* ================= 1. WINDSOCK (UPWIND EMERGENCY WIND INDICATOR) ================= */}
      {/* Critical for H2S and toxic gas evacuation direction planning */}
      <group position={[18, -1.98, 16]}>
        {/* Foundation concrete footing */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.4, 0.45, 0.3, 12]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>

        {/* Tall steel mast pole (7m high) */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 7.2, 10]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Top swivel basket & rotating pivot arm */}
        <mesh position={[0, 7.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.25, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.4, 7.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* High-visibility Fluorescent Orange & White Striped Fabric Cone */}
        <group position={[1.4, 7.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
          {/* Section 1 - Orange throat */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.26, 0.5, 12, 1, true]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Section 2 - White stripe */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.26, 0.22, 0.4, 12, 1, true]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Section 3 - Orange band */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.22, 0.18, 0.4, 12, 1, true]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Section 4 - White band */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.18, 0.14, 0.3, 12, 1, true]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Section 5 - Orange tail tip */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.14, 0.1, 0.3, 12, 1, true]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Mast illumination solar lamp at top */}
        <mesh position={[0, 7.6, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* ================= 2. MUSTER POINT (EMERGENCY ASSEMBLY STATION) ================= */}
      <group
        name="muster-point-group"
        position={[14, -1.98, 14]}
        onClick={(e: any) => {
          if (e.delta && e.delta > 5) return;
          e.stopPropagation();
          onSelectEquipment('muster-point');
        }}
      >
        {/* Designated Safe Assembly Zone Marking Pad (Green border on ground) */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.5, 5.5]} />
          <meshStandardMaterial
            color={getMaterialColor('muster-point', '#1e3a2b', '#10b981')}
            roughness={0.8}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
        {/* Green / White perimeter safety border */}
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.7, 32]} />
          <meshStandardMaterial color="#10b981" polygonOffset polygonOffsetFactor={-2} />
        </mesh>

        {/* Muster Point Signboard Post */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3.2, 10]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
        </mesh>

        {/* International ISO Muster Sign (Green square with 4 converging white arrows) */}
        <group position={[0, 2.8, 0]}>
          {/* Green backing plate */}
          <mesh>
            <boxGeometry args={[1.2, 1.2, 0.06]} />
            <meshStandardMaterial color="#059669" metalness={0.2} roughness={0.4} />
          </mesh>
          {/* White inner symbol box */}
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.9, 0.9, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Inner green center symbol */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.5, 0.5, 0.02]} />
            <meshBasicMaterial color="#059669" />
          </mesh>
        </group>

        {/* Emergency Beacon Siren Light on top of muster post */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.22, 12]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
        </mesh>

        {/* Emergency Muster Radio Box & First Aid Cabinet mounted on post */}
        <mesh position={[0, 1.2, 0.15]}>
          <boxGeometry args={[0.45, 0.6, 0.25]} />
          <meshStandardMaterial color="#047857" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Selection Indicator Ring */}
        {isMusterSelected && (
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.2, 3.4, 32]} />
            <meshBasicMaterial color="#f97316" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* ================= 3. EMERGENCY EYEWASH & SAFETY SHOWER STATION ================= */}
      {/* Positioned beside the mud preparation & pump area for chemical / mud splashes */}
      <group position={[-12.8, -1.98, 1.5]}>
        {/* Safety shower drainage grating floor slab */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.1, 1.4]} />
          <meshStandardMaterial color="#059669" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Slotted yellow drain grate */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[1.2, 0.02, 1.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.7} />
        </mesh>

        {/* High-visibility green vertical supply pipe */}
        <mesh position={[0, 1.5, -0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 2.9, 10]} />
          <meshStandardMaterial color="#059669" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Overhead Emergency Deluge Shower Head */}
        <group position={[0, 2.9, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          {/* Shower bell nozzle */}
          <mesh position={[0, -0.1, 0.4]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.18, 0.14, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} />
          </mesh>
          {/* Pull triangle lever */}
          <mesh position={[0.2, -0.5, 0.4]}>
            <torusGeometry args={[0.08, 0.015, 6, 16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Dual Eyewash Basin & Foot Pedal */}
        <group position={[0, 1.1, -0.15]}>
          {/* Stainless steel catch basin */}
          <mesh>
            <cylinderGeometry args={[0.2, 0.16, 0.12, 14]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Dual aerated eyewash nozzles */}
          <mesh position={[-0.06, 0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          <mesh position={[0.06, 0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          {/* Push-flag activation paddle */}
          <mesh position={[0.22, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.15, 0.1]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* ================= 4. SAFETY SIGNS AROUND THE SITE ================= */}
      {/* Rig entrance PPE Mandatory sign */}
      <group position={[4, -1.98, 24]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[1.4, 0.9, 0.04]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Blue Mandatory PPE circle icon representation */}
        <mesh position={[0, 2.1, 0.03]}>
          <circleGeometry args={[0.32, 20]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* High Voltage Hazard Sign near Generator Skid */}
      <group position={[7.5, -1.98, -5.5]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 1.6, 0]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.03]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </group>

      {/* ================= 5. LOCATION PERIMETER FENCE & ENTRANCE GATE ================= */}
      {/* Industrial chain-link fence defining the 60m x 60m secure drilling location pad */}
      <group position={[0, -1.98, 0]}>
        {/* Fence Corner & Line Posts with horizontal top tension pipe */}
        {[-28, 28].map((x) =>
          [-28, 28].map((z) => (
            <group key={`corner-post-${x}-${z}`} position={[x, 0, z]}>
              <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 2.5, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))
        )}

        {/* North / South / East / West Boundary Fence Runs (light translucent mesh screen without wireframe diagonal artifacts) */}
        {/* East fence (x = 28) */}
        <mesh position={[28, 1.1, 0]}>
          <boxGeometry args={[0.05, 2.2, 56]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>
        {/* West fence (x = -28) */}
        <mesh position={[-28, 1.1, 0]}>
          <boxGeometry args={[0.05, 2.2, 56]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>
        {/* North fence (z = -28) */}
        <mesh position={[0, 1.1, -28]}>
          <boxGeometry args={[56, 2.2, 0.05]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>
        {/* South fence (z = 28) with central 10m vehicle gate gap */}
        <mesh position={[-18, 1.1, 28]}>
          <boxGeometry args={[20, 2.2, 0.05]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>
        <mesh position={[18, 1.1, 28]}>
          <boxGeometry args={[20, 2.2, 0.05]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Main Site Entrance Gate Posts (Yellow with hazard reflectors) */}
        <mesh position={[-5.2, 1.4, 28]}>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 10]} />
          <meshStandardMaterial color="#eab308" metalness={0.4} />
        </mesh>
        <mesh position={[5.2, 1.4, 28]}>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 10]} />
          <meshStandardMaterial color="#eab308" metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
