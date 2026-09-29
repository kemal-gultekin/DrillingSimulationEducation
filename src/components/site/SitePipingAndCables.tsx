import React from 'react';
import * as THREE from 'three';

/**
 * SitePipingAndCables:
 * Realistic industrial fluid and power conveyance infrastructure:
 * 1. 5,000-psi High-Pressure Mud Standpipe & Goose-neck on Derrick
 * 2. Flexible Rotary/Kelly Hose looping from standpipe to Top Drive
 * 3. High-Pressure Mud Pump Discharge Line with Hammer Unions
 * 4. Coflexip High-Pressure Choke & Kill Flexible Lines to BOP Stack
 * 5. Heavy-Duty Yellow-and-Black Drive-Over Cable Protector Ramps
 * 6. High-Voltage Galvanized Cable Trays connecting VFD Powerhouse
 */
export const SitePipingAndCables: React.FC = () => {
  return (
    <group name="site-piping-and-cables">
      {/* ================= 3. MUD PUMP DISCHARGE HIGH-PRESSURE LINE ================= */}
      {/* 5" 5,000-psi discharge manifold connecting mud pumps (-10, -1.98, -1) to rig substructure */}
      <group position={[-5.5, -1.98, -1.0]}>
        {/* Horizontal main discharge pipe */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 7.5, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Forged Hammer Union Connections (Weco Fig 1502 Red & Blue) */}
        {[-2.5, 0, 2.5].map((hx) => (
          <mesh key={`hammer-union-${hx}`} position={[hx, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.22, 12]} />
            <meshStandardMaterial color="#dc2626" metalness={0.6} />
          </mesh>
        ))}
        {/* Pipe support stanchions resting on concrete footings flush on the ground */}
        {[-2.5, 0, 2.5].map((sx) => (
          <group key={`stanchion-${sx}`} position={[sx, 0, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.5, 0.16, 0.5]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.2]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 4. COFLEXIP HIGH-PRESSURE CHOKE & KILL LINES ================= */}
      {/* Flexible armored lines running between BOP side outlets and choke manifold */}
      <group position={[1.8, -1.2, 0.4]}>
        {/* Choke line */}
        <mesh position={[0, 0.1, 0]} rotation={[0, 0.3, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 3.4, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Kill line */}
        <mesh position={[0, -0.2, 0.3]} rotation={[0, -0.2, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 3.4, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* ================= 5. HEAVY-DUTY DRIVE-OVER CABLE PROTECTOR RAMPS ================= */}
      {/* Yellow Jacket 5-channel heavy polyurethane ramps protecting power cables across road */}
      {[
        { x: 3.5, z: 8.0, rotY: 0, length: 5.5 },
        { x: 8.0, z: -2.0, rotY: Math.PI / 2, length: 4.8 }
      ].map((ramp, rIdx) => (
        <group key={`cable-ramp-${rIdx}`} position={[ramp.x, -1.94, ramp.z]} rotation={[0, ramp.rotY, 0]}>
          {/* Main Polyurethane Ramp Base */}
          <mesh receiveShadow>
            <boxGeometry args={[ramp.length, 0.08, 0.55]} />
            <meshStandardMaterial color="#1e293b" roughness={0.95} />
          </mesh>
          {/* High-Visibility Safety Yellow Hinged Lid */}
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[ramp.length * 0.98, 0.02, 0.32]} />
            <meshStandardMaterial color="#eab308" roughness={0.6} />
          </mesh>
          {/* Black chevron hazard stripes on lid */}
          {Array.from({ length: 5 }).map((_, cIdx) => (
            <mesh
              key={`ramp-chv-${cIdx}`}
              position={[(cIdx - 2) * (ramp.length / 5.5), 0.056, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.15, 0.28]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= 6. HIGH-VOLTAGE POWER CABLE TRAYS ================= */}
      {/* Galvanized perforated ladder cable trays routing thick cables from VFD house */}
      <group position={[11, -1.98, -7]}>
        {/* Support ground sleepers */}
        {[-3.5, 0, 3.5].map((sz) => (
          <mesh key={`tray-sleeper-${sz}`} position={[0, 0.04, sz]}>
            <boxGeometry args={[0.6, 0.08, 0.3]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        ))}
        {/* Cable tray trough */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.45, 0.1, 8.5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Three heavy insulated 3-phase power feeder cables */}
        {[-0.12, 0, 0.12].map((cx) => (
          <mesh key={`pwr-cable-${cx}`} position={[cx, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 8.4, 8]} />
            <meshStandardMaterial color="#020617" roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
