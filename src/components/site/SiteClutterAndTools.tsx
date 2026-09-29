import React from 'react';
import * as THREE from 'three';

/**
 * SiteClutterAndTools:
 * Purposeful, authentic operational equipment, tools, and safety items:
 * 1. Stacked Timber Pallets of 50-lb Barite (BaSO4) & Bentonite sacks
 * 2. 55-Gallon Steel Lube Oil & Mud Additive Barrels on Spill Containment Decks
 * 3. Heavy-Duty Jobsite Gang Toolboxes (Pipe tongs, slips, and heavy wrenches)
 * 4. Oxygen / Acetylene Dual-Bottle Welding Cylinder Safety Cart
 * 5. OSHA-Compliant Deluge Emergency Eyewash & Safety Shower Station
 * 6. High-Visibility Fluorescent Orange Safety Cones & Perimeter Barricades
 * 7. Aviation Windsocks (Toxic Gas & Wind Direction Indicator) atop derrick & camp
 */
export const SiteClutterAndTools: React.FC = () => {
  return (
    <group name="site-clutter-and-tools">
      {/* ================= 1. CHEMICAL MUD SACKS ON WOODEN PALLETS ================= */}
      {/* Positioned near the mud mixing area (x = -13.5, z = 4.0) */}
      <group position={[-13.5, -1.98, 4.0]}>
        {/* Hardwood Timber Pallet #1 */}
        <mesh position={[0, 0.07, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.14, 1.2]} />
          <meshStandardMaterial color="#785938" roughness={0.9} />
        </mesh>
        {/* Stack of 50-lb Barite Sacks (White & Kraft Brown paper sacks) */}
        {Array.from({ length: 4 }).map((_, layerIdx) =>
          [-0.28, 0.28].map((sx) =>
            [-0.28, 0.28].map((sz) => (
              <mesh
                key={`sack-layer-${layerIdx}-${sx}-${sz}`}
                position={[sx, 0.21 + layerIdx * 0.16, sz]}
                castShadow
              >
                <boxGeometry args={[0.52, 0.14, 0.52]} />
                <meshStandardMaterial color={layerIdx % 2 === 0 ? '#f1f5f9' : '#d97706'} roughness={0.8} />
              </mesh>
            ))
          )
        )}

        {/* Pallet #2 (Adjacent, partially used sacks of Bentonite gel) */}
        <group position={[1.5, 0, 0.2]}>
          <mesh position={[0, 0.07, 0]} receiveShadow>
            <boxGeometry args={[1.2, 0.14, 1.2]} />
            <meshStandardMaterial color="#785938" roughness={0.9} />
          </mesh>
          {Array.from({ length: 2 }).map((_, layerIdx) =>
            [-0.28, 0.28].map((sx) =>
              [-0.28, 0.28].map((sz) => (
                <mesh
                  key={`gel-sack-${layerIdx}-${sx}-${sz}`}
                  position={[sx, 0.21 + layerIdx * 0.16, sz]}
                  castShadow
                >
                  <boxGeometry args={[0.52, 0.14, 0.52]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
                </mesh>
              ))
            )
          )}
        </group>
      </group>

      {/* ================= 2. 55-GALLON STEEL DRUMS ON YELLOW CONTAINMENT BUND ================= */}
      {/* Positioned near the maintenance workshop (x = 15.5, z = -2.5) */}
      <group position={[15.5, -1.98, -2.5]}>
        {/* Yellow Polyethylene Spill Containment Sump Deck */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.24, 1.4]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* Black Grating Deck on top of sump */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.3, 0.02, 1.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* 4 Steel 55-Gallon Lube Oil & Chemical Drums */}
        {[
          { x: -0.7, z: -0.3, col: '#0284c7' },
          { x: -0.7, z: 0.3, col: '#059669' },
          { x: 0.7, z: -0.3, col: '#0284c7' },
          { x: 0.7, z: 0.3, col: '#dc2626' }
        ].map((drum, dIdx) => (
          <group key={`drum-${dIdx}`} position={[drum.x, 0.72, drum.z]}>
            {/* Drum Cylinder Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.9, 16]} />
              <meshStandardMaterial color={drum.col} metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Drum Chimes (Rims) */}
            {[-0.44, 0.44].map((ry) => (
              <mesh key={`rim-${ry}`} position={[0, ry, 0]}>
                <torusGeometry args={[0.285, 0.015, 8, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            ))}
            {/* 2" Bung Plug on Top Lid */}
            <mesh position={[0.15, 0.46, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.03, 10]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 3. HEAVY STEEL JOBSITE GANG TOOLBOXES ================= */}
      {/* Positioned on ground near rig floor access stairs (x = 6.2, z = -4.5) */}
      <group position={[6.2, -1.98, -4.5]} rotation={[0, -0.2, 0]}>
        {/* Heavy Steel Jobsite Box (Red Knaack / Ridgid style) */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.5, 0.75, 0.8]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Recessed Lock Housing & Handles */}
        <mesh position={[0, 0.45, 0.41]}>
          <boxGeometry args={[0.15, 0.15, 0.04]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Heavy Skid Legs */}
        {[-0.6, 0.6].map((lx) => (
          <mesh key={`box-leg-${lx}`} position={[lx, 0.05, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.82]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
      </group>

      {/* ================= 4. OXYGEN / ACETYLENE CYLINDER WELDING CART ================= */}
      {/* Positioned near the generator/workshop area (x = 6.5, z = -8.0) */}
      <group position={[6.5, -1.98, -8.0]}>
        {/* 2-Wheel Heavy Hand Cart Frame */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 1.1, 0.4]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        {/* Cart Rubber Wheels */}
        {[-0.35, 0.35].map((wx) => (
          <mesh key={`cart-wh-${wx}`} position={[wx, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        ))}
        {/* Green High-Pressure Oxygen Cylinder */}
        <group position={[-0.14, 0.85, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.11, 1.4, 14]} />
            <meshStandardMaterial color="#15803d" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#15803d" metalness={0.6} />
          </mesh>
          {/* Dual-Stage Pressure Regulator with Twin Gauges */}
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
        {/* Red Dissolved Acetylene Cylinder */}
        <group position={[0.14, 0.72, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.13, 1.15, 14]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.63, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= 5. EMERGENCY EYEWASH & DELUGE SAFETY SHOWER ================= */}
      {/* Positioned beside the mud chemical mixing zone (x = -11.5, z = 2.0) */}
      <group position={[-11.5, -1.98, 2.0]}>
        {/* Yellow-and-Black Hazard Floor Deck Pad */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.06, 1.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
        {/* Vertical Supply Pipe (Safety Green) */}
        <mesh position={[0, 1.4, -0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 2.7, 10]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        {/* Overhead Deluge Shower Head */}
        <mesh position={[0, 2.65, -0.1]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15, 0.12, 16]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        {/* Emergency Pull Rod & Triangular Handle */}
        <mesh position={[0.22, 1.9, -0.1]}>
          <cylinderGeometry args={[0.008, 0.008, 1.1, 8]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        {/* Eyewash Basin & Twin Soft-Flow Nozzles at waist height */}
        <mesh position={[0, 1.05, -0.1]}>
          <cylinderGeometry args={[0.18, 0.14, 0.15, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Foot Treadle Activation Pedal */}
        <mesh position={[0, 0.08, -0.1]}>
          <boxGeometry args={[0.25, 0.04, 0.2]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </group>

      {/* ================= 6. FLUORESCENT ORANGE SAFETY CONES ================= */}
      {/* High-visibility traffic cones marking exclusion zones and perimeter */}
      {[
        { x: -3.5, z: 2.2 },
        { x: -3.5, z: -2.2 },
        { x: 3.5, z: 2.2 },
        { x: 3.5, z: -2.2 },
        { x: 0, z: 4.8 },
        { x: 5.5, z: -6.5 }
      ].map((cone, cIdx) => (
        <group key={`safety-cone-${cIdx}`} position={[cone.x, -1.98, cone.z]}>
          {/* Square rubber base */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.34, 0.04, 0.34]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Orange reflective cone */}
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.12, 0.65, 14]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          {/* White reflective retro-reflective collar */}
          <mesh position={[0, 0.38, 0]}>
            <coneGeometry args={[0.09, 0.18, 14]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ================= 7. AVIATION WINDSOCKS (H2S / GAS SAFETY) ================= */}
      {/* Crucial for toxic gas emergency muster direction (mounted on camp and derrick) */}
      <group position={[17.5, 1.2, -10]}>
        {/* Windsock Mast Pole */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.6, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>
        {/* Swivel Hoop Frame */}
        <mesh position={[0.25, 3.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.015, 8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Orange and White Striped Fabric Windsock Tube */}
        <mesh position={[0.65, 3.42, 0]} rotation={[0, 0, -1.45]}>
          <coneGeometry args={[0.18, 1.0, 16, 1, true]} />
          <meshStandardMaterial color="#ea580c" side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
