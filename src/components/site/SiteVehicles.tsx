import React from 'react';
import * as THREE from 'three';

/**
 * SiteVehicles:
 * Authentic onshore oilfield vehicles parked in operational support locations:
 * 1. Heavy-duty 4x4 Oilfield Crew Cab Pickup Truck (Company parking zone)
 * 2. Rough-Terrain Industrial Telehandler Forklift (Pipe racks & tubular handling zone)
 * 3. Heavy-Duty Vacuum / Water Service Tank Truck (Mud treatment & disposal zone)
 */
export const SiteVehicles: React.FC = () => {
  return (
    <group name="site-vehicles">
      {/* ================= 1. OILFIELD 4X4 CREW CAB PICKUP TRUCK ================= */}
      {/* Positioned in company parking bay near camp entrance (x = 17, z = 7) */}
      <group position={[17, -1.98, 7]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Truck Frame / Chassis */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[2.1, 0.25, 5.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Truck White Cab Body */}
        <mesh position={[0, 1.15, -0.4]} castShadow>
          <boxGeometry args={[2.05, 1.15, 2.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Cab Windshield & Windows */}
        {/* Front Windshield */}
        <mesh position={[0, 1.35, -1.76]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[1.8, 0.7]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Rear Window */}
        <mesh position={[0, 1.35, 0.96]}>
          <planeGeometry args={[1.7, 0.55]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Side Windows */}
        {[-1.04, 1.04].map((sx) => (
          <mesh key={`truck-win-${sx}`} position={[sx, 1.35, -0.4]} rotation={[0, (sx > 0 ? 1 : -1) * Math.PI / 2, 0]}>
            <planeGeometry args={[2.2, 0.55]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
          </mesh>
        ))}

        {/* Truck Cargo Bed */}
        <mesh position={[0, 0.85, 1.75]} castShadow>
          <boxGeometry args={[2.05, 0.6, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Bed interior liner */}
        <mesh position={[0, 0.88, 1.75]}>
          <boxGeometry args={[1.85, 0.55, 1.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* Steel Headache Rack (Cab Guard & Light Mount) */}
        <mesh position={[0, 1.45, 0.98]}>
          <boxGeometry args={[1.95, 0.85, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* Amber Strobe Safety Warning Beacon on Roof */}
        <mesh position={[0, 1.82, -0.4]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>

        {/* Safety Whip Antenna with High-Visibility Orange Flag (Oilfield Standard) */}
        <mesh position={[0.95, 2.3, 0.95]}>
          <cylinderGeometry args={[0.015, 0.015, 2.6, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh position={[0.95, 3.5, 0.95]}>
          <boxGeometry args={[0.02, 0.35, 0.5]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>

        {/* Front Grille & Bull Bar Guard */}
        <mesh position={[0, 0.75, -2.72]}>
          <boxGeometry args={[1.9, 0.55, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} />
        </mesh>
        {/* Headlights */}
        {[-0.8, 0.8].map((hx) => (
          <mesh key={`truck-hl-${hx}`} position={[hx, 0.8, -2.78]}>
            <boxGeometry args={[0.28, 0.18, 0.04]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
        ))}

        {/* 4 Heavy All-Terrain Mud Tires */}
        {[
          { x: -1.05, z: -1.6 },
          { x: 1.05, z: -1.6 },
          { x: -1.05, z: 1.8 },
          { x: 1.05, z: 1.8 }
        ].map((tire, tIdx) => (
          <group key={`truck-tire-${tIdx}`} position={[tire.x, 0.42, tire.z]} rotation={[0, 0, Math.PI / 2]}>
            {/* Rubber Tire with deep treads */}
            <mesh castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.28, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.95} />
            </mesh>
            {/* Steel Wheel Rim */}
            <mesh position={[0, tire.x > 0 ? 0.08 : -0.08, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.14, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 2. ROUGH-TERRAIN PIPE FORKLIFT / TELEHANDLER ================= */}
      {/* Positioned near the pipe racks for drill pipe handling (x = 8.5, z = 20) */}
      <group position={[8.5, -1.98, 20]} rotation={[0, -Math.PI / 1.8, 0]}>
        {/* Heavy Counterweight & Lower Frame */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[2.4, 0.8, 4.4]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Rear Counterweight Block */}
        <mesh position={[0, 0.8, 1.8]} castShadow>
          <boxGeometry args={[2.35, 1.1, 0.8]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* Operator Safety ROPS/FOPS Roll-Cage Cabin */}
        <mesh position={[-0.55, 1.6, 0.1]} castShadow>
          <boxGeometry args={[1.1, 1.4, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Cab Safety Tinted Glass */}
        <mesh position={[-0.55, 1.7, 0.1]}>
          <boxGeometry args={[1.05, 1.1, 1.7]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.65} metalness={0.4} />
        </mesh>

        {/* Amber Flashing Safety Beacon atop cabin */}
        <mesh position={[-0.55, 2.38, 0.1]}>
          <cylinderGeometry args={[0.12, 0.12, 0.14, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>

        {/* Telescoping Steel Lifting Boom */}
        <mesh position={[0.55, 1.5, -0.4]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 4.2]} />
          <meshStandardMaterial color="#ea580c" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Extension Stage Boom */}
        <mesh position={[0.55, 1.9, -2.4]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.48, 3.2]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Pipe Handling Fork Carriage */}
        <mesh position={[0.55, 0.5, -3.9]}>
          <boxGeometry args={[1.6, 0.6, 0.15]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Dual Steel Lifting Forks */}
        {[-0.5, 0.5].map((fx) => (
          <group key={`fork-${fx}`} position={[0.55 + fx, 0.1, -4.6]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.12, 0.08, 1.4]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, 0.65]}>
              <boxGeometry args={[0.12, 0.55, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* 4 Large Knobby Industrial Tires */}
        {[
          { x: -1.25, z: -1.4 },
          { x: 1.25, z: -1.4 },
          { x: -1.25, z: 1.5 },
          { x: 1.25, z: 1.5 }
        ].map((wh, idx) => (
          <mesh
            key={`forklift-wh-${idx}`}
            position={[wh.x, 0.55, wh.z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.55, 0.55, 0.38, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* ================= 3. OILFIELD VACUUM / WATER SERVICE TANK TRUCK ================= */}
      {/* Positioned near mud handling and wastewater disposal area (x = -17, z = 7) */}
      <group position={[-17, -1.98, 7]} rotation={[0, Math.PI / 3, 0]}>
        {/* Heavy Commercial Truck Cab (Vocational Mack/Kenworth style) */}
        <mesh position={[0, 1.3, -3.2]} castShadow>
          <boxGeometry args={[2.2, 1.7, 2.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Cab Hood & Engine Compartment */}
        <mesh position={[0, 0.9, -4.5]} castShadow>
          <boxGeometry args={[1.9, 1.1, 1.6]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Vertical Chrome Exhaust Stacks */}
        {[-1.15, 1.15].map((ex) => (
          <mesh key={`truck-ex-${ex}`} position={[ex, 2.4, -2.1]}>
            <cylinderGeometry args={[0.07, 0.07, 1.6, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Heavy Cylindrical Steel Vacuum Tank (70-barrel capacity) */}
        <mesh position={[0, 1.45, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.05, 1.05, 5.2, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* Rounded Tank End Domes */}
        <mesh position={[0, 1.45, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[1.04, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#475569" metalness={0.4} />
        </mesh>

        {/* External Suction Hose Storage Troughs (Left & Right) */}
        {[-1.12, 1.12].map((tx) => (
          <group key={`hose-tr-${tx}`} position={[tx, 1.35, 0.6]}>
            <mesh>
              <boxGeometry args={[0.22, 0.35, 4.8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Flexible Corrugated Suction Hose Coiled Inside */}
            <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 4.6, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Rear Discharge Gate Valves */}
        <mesh position={[0, 0.8, 3.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.7} />
        </mesh>

        {/* Tandem Rear Axles & 8 Heavy Dual Tires */}
        {[-1.0, 1.0].map((tx) =>
          [-4.0, 0.8, 2.2].map((tz, idx) => (
            <mesh
              key={`tank-tire-${tx}-${idx}`}
              position={[tx * 1.1, 0.48, tz]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.48, 0.48, 0.32, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.95} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};
