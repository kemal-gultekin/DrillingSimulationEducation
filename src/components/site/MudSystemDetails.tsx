import React from 'react';
import * as THREE from 'three';

interface MudSystemDetailsProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  getMaterialColor: (id: string, baseColor: string, highlightColor?: string) => string;
  isPumping?: boolean;
}

export const MudSystemDetails: React.FC<MudSystemDetailsProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  getMaterialColor,
  isPumping = true
}) => {
  const isDegasserSelected = selectedEquipmentId === 'poor-boy-degasser';

  return (
    <group name="mud-system-details-group">
      {/* ================= 1. FLOW LINE / RETURN LINE (BELL NIPPLE TO SHAKER) ================= */}
      {/* 12" OD steel return line carrying mud & cuttings from under rig floor down to shakers */}
      <group position={[0, 0, 0]}>
        {/* Bell nipple collar under rotary table on top of BOP stack */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Bell nipple discharge side tee */}
        <mesh position={[-0.4, 0.4, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.6, 14]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Engineered sloped flowline from bell nipple (-0.7, 0.4, 0.4) down to shaker possum belly (-8.5, 1.2, 13.2) */}
        {/* Midpoint: x = -4.6, y = 0.8, z = 6.8 */}
        <group position={[-4.6, 0.8, 6.8]}>
          <mesh
            rotation={[
              0.93,
              -0.42,
              -0.56
            ]}
          >
            <cylinderGeometry args={[0.18, 0.18, 15.2, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.35} />
          </mesh>
        </group>

        {/* Structural Flowline Pipe Support Bridge / Stanchion (Grounded on pad at y = -1.98) */}
        <group position={[-4.6, -1.98, 6.8]}>
          {/* Concrete foundation footing pad on gravel pad */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.2, 0.16, 1.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          {/* Twin structural channel legs rising to support saddle */}
          {[-0.35, 0.35].map((lx) => (
            <mesh key={`flow-leg-${lx}`} position={[lx, 1.35, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
          ))}
          {/* Cross-brace horizontal member */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.78, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Top U-bolt cradle / pipe saddle clamp holding the flowline */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ================= 2. POOR BOY DEGASSER (MUD-GAS SEPARATOR) ================= */}
      {/* Vertical atmospheric gas separation vessel mounted adjacent to mud tanks (x = -6.2, z = 3.8) */}
      <group
        name="poor-boy-degasser-group"
        position={[-6.2, -1.98, 3.8]}
        onClick={(e: any) => {
          if (e.delta && e.delta > 5) return;
          e.stopPropagation();
          onSelectEquipment('poor-boy-degasser');
        }}
      >
        {/* Heavy Steel Structural Skid Base resting flush on ground pad */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.2, 0.2, 2.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* 4 Structural Tubular Support Legs rising from skid to vessel bottom */}
        {[-0.7, 0.7].map((x) =>
          [-0.7, 0.7].map((z) => (
            <mesh key={`degasser-leg-${x}-${z}`} position={[x, 1.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 2.0, 10]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
          ))
        )}

        {/* Diagonal Structural X-Bracing between legs */}
        {[-0.7, 0.7].map((x) => (
          <mesh key={`degasser-brace-x-${x}`} position={[x, 1.1, 0]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.04, 2.2, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
        ))}

        {/* Vessel Bottom Support Ring at y = 2.1 */}
        <mesh position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.15, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>

        {/* Main Vertical Separator Pressure Cylinder (1.3m diameter x 4.8m tall) */}
        <mesh castShadow receiveShadow position={[0, 4.6, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 4.8, 24]} />
          <meshStandardMaterial
            color={getMaterialColor('poor-boy-degasser', '#2563eb', '#fbbf24')}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* Top Torispherical Head at y = 7.0 */}
        <mesh position={[0, 7.0, 0]}>
          <sphereGeometry args={[0.65, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={getMaterialColor('poor-boy-degasser', '#1d4ed8', '#fbbf24')}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
        {/* Bottom Inverted Head at y = 2.2 */}
        <mesh position={[0, 2.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.65, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* High-Pressure Inlet Line from Choke Manifold */}
        <mesh position={[0.75, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 12]} />
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Inlet flange */}
        <mesh position={[1.05, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>

        {/* Mud Return U-Tube Liquid Seal Loop (discharges into mud tank trough) */}
        <group position={[-0.7, 2.2, 0]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          <mesh position={[-0.6, -1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          <mesh position={[-1.2, -0.7, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        </group>

        {/* Internal Baffle Indicator Welds on exterior shell */}
        {[3.6, 4.6, 5.6].map((yBaffle, bIdx) => (
          <mesh key={`baffle-weld-${bIdx}`} position={[0, yBaffle, 0]}>
            <torusGeometry args={[0.66, 0.02, 8, 24]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
        ))}

        {/* Pressure & Liquid Level Sight Glass column on vessel side */}
        <mesh position={[0, 4.6, 0.68]}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>

        {/* Vessel Safety Relief Valve */}
        <mesh position={[0.4, 6.8, 0.3]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 8]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>

        {/* Gas Vent Line Riser extending up from top dome */}
        <mesh position={[0, 8.8, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 3.6, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Highlight Ring when selected */}
        {isDegasserSelected && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.7, 24]} />
            <meshBasicMaterial color="#f97316" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* ================= 3. MUD TANK INTERCONNECTS & WALKWAY ================= */}
      <group position={[-9, -1.98, 6.5]}>
        {/* Equalization suction manifold along the bottom skid of the tanks */}
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 11.5, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>

        {/* Tank top walkway grating & yellow safety handrails at y = 1.85 */}
        <mesh position={[2.1, 1.85, 0]}>
          <boxGeometry args={[0.8, 0.08, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Walkway outer yellow safety handrail */}
        <mesh position={[2.45, 2.3, 0]}>
          <boxGeometry args={[0.05, 0.85, 11.9]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>

        {/* Walkway access stairway from ground pad up to tank top */}
        <group position={[2.2, 0, -6.5]}>
          {/* Concrete stair base footing pad flush on ground */}
          <mesh position={[0, 0.05, -0.6]}>
            <boxGeometry args={[1.0, 0.1, 1.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          {/* Sloped stringers */}
          <mesh position={[0, 0.95, 0.5]} rotation={[0.65, 0, 0]}>
            <boxGeometry args={[0.8, 0.1, 2.8]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
          {/* Handrails */}
          <mesh position={[0.4, 1.35, 0.5]} rotation={[0.65, 0, 0]}>
            <boxGeometry args={[0.04, 0.8, 2.8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        </group>
      </group>

      {/* ================= 4. SOLIDS CONTROL: DESANDER & DESILTER ================= */}
      {/* Mounted atop the mud tank downstream of shale shakers (tank top at -0.18) */}
      <group position={[-9, -0.18, 9.5]}>
        {/* Support structural frame resting flush on tank top */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[3.2, 0.5, 1.6]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>

        {/* Desander: Two large 10-inch polyurethane hydrocyclone cones */}
        {[-0.9, -0.3].map((cx) => (
          <group key={`desander-cone-${cx}`} position={[cx, 0.7, 0]}>
            {/* Top cylindrical feed chamber */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.4, 12]} />
              <meshStandardMaterial color="#eab308" roughness={0.4} />
            </mesh>
            {/* Lower conical underflow nozzle */}
            <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.22, 0.7, 12]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Desilter: Bank of eight 4-inch hydrocyclone cones */}
        <group position={[0.8, 0.7, 0]}>
          {[-0.45, -0.15, 0.15, 0.45].map((dx) =>
            [-0.2, 0.2].map((dz) => (
              <mesh key={`desilter-${dx}-${dz}`} position={[dx, -0.1, dz]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.09, 0.5, 10]} />
                <meshStandardMaterial color="#0284c7" />
              </mesh>
            ))
          )}
          {/* Desilter inlet feed manifold pipe */}
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 1.2, 10]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= 5. MUD MIXING HOPPER ================= */}
      {/* Venturi chemical addition funnel beside active mud pit (x = -11.5, z = 4.5) */}
      <group position={[-11.5, -1.98, 4.5]}>
        {/* Support table frame with 4 grounded steel legs */}
        {[-0.6, 0.6].map((lx) =>
          [-0.6, 0.6].map((lz) => (
            <mesh key={`hopper-leg-${lx}-${lz}`} position={[lx, 0.5, lz]}>
              <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
          ))
        )}
        {/* Table platform top */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.6, 0.08, 1.6]} />
          <meshStandardMaterial color="#475569" metalness={0.5} />
        </mesh>
        {/* Conical Mud Hopper funnel */}
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.45, 0.7, 16]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
        </mesh>
        {/* Top chemical sack rest table */}
        <mesh position={[0, 1.85, 0.35]}>
          <boxGeometry args={[0.7, 0.04, 0.4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        {/* Venturi high-velocity jet line underneath */}
        <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
      </group>

      {/* ================= 6. MUD PUMP SUCTION LINES ================= */}
      {/* 10" Low-pressure suction pipes delivering conditioned mud from Active Tank to Pump fluid ends */}
      <group position={[-9.5, -1.98, 2.5]}>
        {/* Support pipe sleepers resting on pad */}
        {[-1.8, 0, 1.8].map((sz) => (
          <mesh key={`sleeper-${sz}`} position={[0, 0.1, sz]}>
            <boxGeometry args={[0.6, 0.2, 0.3]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        ))}
        {/* Main suction manifold running between tanks and mud pumps */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 4.8, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Suction strainer housings with butterfly valves */}
        {[-1.2, 1.2].map((sz) => (
          <group key={`strainer-${sz}`} position={[0, 0.35, sz]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
            {/* Valve wheel */}
            <mesh position={[0, 0.35, 0]}>
              <torusGeometry args={[0.12, 0.02, 6, 12]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

