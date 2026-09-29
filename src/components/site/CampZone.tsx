import React from 'react';
import * as THREE from 'three';

/**
 * CampZone represents the physically separated safe living and administrative area of the drill site:
 * - Positioned well away from Zone 1/2 hazardous wellbore areas
 * - Site Management & HSE Safety Induction trailer
 * - Modular crew sleeper cabins
 * - Galley / Dining container unit
 * - Elevated connecting timber walkway
 * - Waste disposal / recycling station
 * - Site vehicle parking bay with safety wheel stops
 */
export const CampZone: React.FC = () => {
  return (
    <group name="camp-living-zone" position={[20, -1.98, -14]}>
      {/* Gravel Pad foundation for Camp Zone - height 0.1, centered at y=0.05 so bottom is at 0.0 (-1.98 world) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 16]} />
        <meshStandardMaterial color="#3f454e" roughness={0.96} />
      </mesh>

      {/* ================= 1. SITE MANAGEMENT & HSE INDUCTION TRAILER ================= */}
      <group position={[-2.5, 0, 4]}>
        {/* Foundation support steel pylons */}
        {[-2.2, 2.2].map((px) =>
          [-1.6, 1.6].map((pz) => (
            <mesh key={`pylon-off-${px}-${pz}`} position={[px, 0.2, pz]}>
              <boxGeometry args={[0.3, 0.4, 0.3]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))
        )}
        {/* Main Office Container Body */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[5.2, 2.4, 3.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Blue roof weather trim */}
        <mesh position={[0, 2.85, 0]}>
          <boxGeometry args={[5.3, 0.1, 3.5]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Double Entrance Glass Doors */}
        <mesh position={[-2.62, 1.2, 0.4]}>
          <boxGeometry args={[0.04, 1.8, 1.0]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Exterior HSE Safety & Induction Notice Board */}
        <mesh position={[-2.63, 1.5, -0.7]}>
          <boxGeometry args={[0.02, 0.9, 1.2]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        {/* Office Windows */}
        {[-0.8, 0.8].map((wz) => (
          <mesh key={`off-win-${wz}`} position={[0, 1.6, wz + 1.71]}>
            <boxGeometry args={[1.2, 0.8, 0.04]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
        ))}
        {/* Rooftop AC Purge Package */}
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[1.2, 0.4, 1.0]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* ================= 2. MODULAR CREW SLEEPER CABINS ================= */}
      <group position={[-2.5, 0, -4]}>
        {/* Sleeper Cabin Container */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[5.2, 2.4, 3.4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>
        {/* Green roof trim */}
        <mesh position={[0, 2.85, 0]}>
          <boxGeometry args={[5.3, 0.1, 3.5]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        {/* Bedroom windows with blackout louvers */}
        {[-1.4, 0, 1.4].map((wx) => (
          <mesh key={`sleep-win-${wx}`} position={[wx, 1.6, 1.71]}>
            <boxGeometry args={[0.9, 0.7, 0.04]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        {/* Rooftop AC unit */}
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[1.1, 0.4, 0.9]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* ================= 3. CREW GALLEY / DINING UNIT ================= */}
      <group position={[3.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[6.4, 2.4, 3.0]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Orange safety roof trim */}
        <mesh position={[0, 2.85, 0]}>
          <boxGeometry args={[6.5, 0.1, 3.1]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        {/* Dining windows */}
        {[-1.8, 0, 1.8].map((wx) => (
          <mesh key={`mess-win-${wx}`} position={[wx, 1.6, 1.51]}>
            <boxGeometry args={[1.2, 0.8, 0.04]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ================= 4. CONNECTING TIMBER BOARDWALK & VERANDA ================= */}
      <mesh position={[-0.4, 0.12, 0]}>
        <boxGeometry args={[1.6, 0.08, 12]} />
        <meshStandardMaterial color="#5c442c" roughness={0.85} />
      </mesh>
      {/* Handrails along boardwalk */}
      <mesh position={[-1.15, 0.55, 0]}>
        <boxGeometry args={[0.04, 0.8, 12]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      {/* ================= 5. WASTE & RECYCLING DISPOSAL CORNER ================= */}
      <group position={[4.5, 0, 6]}>
        {/* Recycling bins: Blue (Plastic), Green (Organic), Red (Hazmat Wipes) */}
        {[
          { x: -0.7, color: '#2563eb' },
          { x: 0, color: '#16a34a' },
          { x: 0.7, color: '#dc2626' }
        ].map((bin, i) => (
          <mesh key={`bin-${i}`} position={[bin.x, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.8, 0.5]} />
            <meshStandardMaterial color={bin.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ================= 6. VEHICLE PARKING AREA WITH RUBBER WHEEL STOPS ================= */}
      <group position={[0, 0, -6.5]}>
        {[-1.8, 1.8].map((px) => (
          <mesh key={`wheel-stop-${px}`} position={[px, 0.1, -0.6]}>
            <boxGeometry args={[1.4, 0.12, 0.2]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
