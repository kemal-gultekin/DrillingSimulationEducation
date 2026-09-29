import React from 'react';
import * as THREE from 'three';

/**
 * SiteInfrastructure represents the realistic industrial support facilities of an onshore drilling rig:
 * - 4 High-output mobile lighting towers (floodlights illuminating key zones)
 * - Bulk diesel fuel day-tank skid with secondary containment dike
 * - VFD / SCR Electrical House next to the diesel generators
 * - Heavy-duty cable protector ramps & high-voltage cable trays
 * - Outdoor maintenance workshop area (steel workbench, vise, oxygen/acetylene welding rack)
 * - Industrial storage: Jobsite tool gang boxes, chemical sacks on pallets, 55-gal lube drums
 * - Wheeled 50kg Class B/C fire extinguisher crash carts
 */
export const SiteInfrastructure: React.FC = () => {
  return (
    <group name="site-infrastructure">
      {/* ================= 1. MOBILE FLOODLIGHT TOWERS (4 UNITS) ================= */}
      {/* Positioned at strategic quadrants to illuminate 24/7 round-the-clock operations */}
      {[
        { pos: [-18, -1.98, 18], rotY: Math.PI / 4, label: 'NW-Tower' },
        { pos: [18, -1.98, 22], rotY: -Math.PI / 4, label: 'NE-Tower' },
        { pos: [-22, -1.98, -16], rotY: (3 * Math.PI) / 4, label: 'SW-Tower' },
        { pos: [22, -1.98, -16], rotY: -(3 * Math.PI) / 4, label: 'SE-Tower' }
      ].map((tower, idx) => (
        <group key={`light-tower-${idx}`} position={tower.pos as [number, number, number]} rotation={[0, tower.rotY, 0]}>
          {/* Mobile trailer chassis on rubber tires */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.5, 0.7, 2.4]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          {/* Steel frame underside */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.4, 0.1, 2.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Rubber wheels with black steel fenders */}
          {[-0.85, 0.85].map((wx) => (
            <group key={`wheel-assembly-${wx}`}>
              <mesh position={[wx, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.22, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.9} />
              </mesh>
              {/* Wheel Fender / Mudguard */}
              <mesh position={[wx > 0 ? wx - 0.04 : wx + 0.04, 0.58, 0]}>
                <boxGeometry args={[0.26, 0.06, 0.85]} />
                <meshStandardMaterial color="#0f172a" metalness={0.6} />
              </mesh>
            </group>
          ))}
          {/* Trailer tongue & tow hitch with ground support jack */}
          <mesh position={[0, 0.25, 1.6]}>
            <boxGeometry args={[0.15, 0.1, 1.0]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Front tongue swivel jack & ground footplate */}
          <mesh position={[0, 0.18, 1.8]}>
            <cylinderGeometry args={[0.04, 0.04, 0.36, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.02, 1.8]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Outrigger horizontal extension beams and drop jacks with broad footpads resting on ground */}
          {[-1, 1].map((sideX) => (
            <group key={`outrigger-side-${sideX}`}>
              {/* Front & Rear horizontal outrigger extension arms */}
              <mesh position={[sideX * 0.95, 0.16, 1.0]}>
                <boxGeometry args={[0.6, 0.08, 0.08]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              <mesh position={[sideX * 0.95, 0.16, -1.0]}>
                <boxGeometry args={[0.6, 0.08, 0.08]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              {/* Outrigger vertical jack legs */}
              {[-1.0, 1.0].map((oz) => (
                <group key={`jack-${sideX}-${oz}`} position={[sideX * 1.2, 0, oz]}>
                  <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.045, 0.045, 0.4, 8]} />
                    <meshStandardMaterial color="#eab308" />
                  </mesh>
                  {/* Broad circular footpad resting firmly on the ground pad */}
                  <mesh position={[0, 0.02, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.04, 12]} />
                    <meshStandardMaterial color="#334155" metalness={0.6} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
          {/* Telescoping steel mast (9m high) */}
          <mesh position={[0, 4.5, -0.4]}>
            <cylinderGeometry args={[0.08, 0.12, 8.5, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Top Crossbar mounting bracket */}
          <mesh position={[0, 8.8, -0.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          {/* 4 High-Intensity LED/Metal-Halide Floodlights */}
          {[-0.7, -0.25, 0.25, 0.7].map((lx) => (
            <group key={`lamp-${lx}`} position={[lx, 8.7, -0.2]}>
              <mesh rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.36, 0.26, 0.18]} />
                <meshStandardMaterial color="#334155" metalness={0.6} />
              </mesh>
              {/* Luminous lamp face */}
              <mesh position={[0, 0, 0.09]} rotation={[0.4, 0, 0]}>
                <planeGeometry args={[0.32, 0.22]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ================= 2. BULK DIESEL FUEL DAY-TANK SKID ================= */}
      {/* Heavy cylindrical 10,000-gallon diesel fuel supply skid for rig generators */}
      <group position={[17, -1.98, -8]}>
        {/* Steel secondary containment bund dike - height 0.4, centered at y=0.2 so bottom is at 0.0 (-1.98 world) */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[4.8, 0.4, 8.2]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Inner spill basin floor */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[4.4, 0.05, 7.8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Horizontal cylindrical fuel tank */}
        <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 7.0, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Red Hazmat stripe along tank */}
        <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.11, 1.11, 0.4, 20]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Top inspection manhole & breather vent */}
        <mesh position={[0, 2.75, 1.5]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Fuel transfer pump dispenser skid & hose reel */}
        <mesh position={[-1.6, 0.8, -2.5]}>
          <boxGeometry args={[0.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Black rubber fuel delivery hose */}
        <mesh position={[-1.6, 0.8, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Warning: DIESEL FLAMMABLE sign */}
        <mesh position={[-2.42, 1.6, 0]}>
          <boxGeometry args={[0.02, 0.6, 1.2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* ================= 3. VFD / SCR ELECTRICAL POWER HOUSE ================= */}
      {/* Silicon Controlled Rectifier container converting AC generator power to DC for drilling motors */}
      <group position={[11, -1.98, -12.5]}>
        {/* Container body - height 2.6, centered at y=1.3 so bottom is at 0.0 (-1.98 world) */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[4.4, 2.6, 5.8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* HVAC heavy-duty climate cooling packs on rear */}
        {[-1.2, 1.2].map((cx) => (
          <mesh key={`vfd-ac-${cx}`} position={[cx, 1.8, -3.0]}>
            <boxGeometry args={[1.2, 0.9, 0.4]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
        {/* High Voltage Electrical Warning Triangle plate */}
        <mesh position={[-2.22, 1.6, 0]}>
          <boxGeometry args={[0.02, 0.6, 0.6]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </group>

      {/* ================= 4. HEAVY-DUTY CABLE TRAYS & ROAD RAMPS ================= */}
      <group position={[0, -1.98, 0]}>
        {/* Yellow-and-Black heavy-duty rubber hose/cable protector ramp crossing main route */}
        {/* Height 0.12, centered at y=0.06 so bottom is at 0.0 (-1.98 world) */}
        <mesh position={[4.5, 0.06, 0]}>
          <boxGeometry args={[3.2, 0.12, 1.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.8} />
        </mesh>
        {/* Black rubber cable channels */}
        {[-0.3, 0, 0.3].map((cz) => (
          <mesh key={`cable-channel-${cz}`} position={[4.5, 0.12, cz]}>
            <boxGeometry args={[3.2, 0.04, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}

        {/* Elevated galvanized steel cable tray running from VFD House toward Substructure */}
        <mesh position={[6.5, 0.3, -5]}>
          <boxGeometry args={[0.5, 0.12, 11]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Tray support posts down to ground */}
        {[-9, -6, -3, 0].map((tz) => (
          <mesh key={`tray-post-${tz}`} position={[6.5, 0.12, tz]}>
            <cylinderGeometry args={[0.03, 0.03, 0.24, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        {/* Cable bundle inside tray */}
        <mesh position={[6.5, 0.4, -5]}>
          <boxGeometry args={[0.36, 0.08, 10.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= 5. MAINTENANCE & MECHANICAL WORKSHOP AREA ================= */}
      {/* Positioned beside the generators and mud pumps (x: -16, z: -4) */}
      <group position={[-16, -1.98, -3.5]}>
        {/* Heavy timber & steel workbench */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2.6, 0.1, 1.1]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        {/* Workbench steel legs - height 0.5, centered at y=0.25 so bottom is at 0.0 (-1.98 world) */}
        {[-1.1, 1.1].map((lx) =>
          [-0.4, 0.4].map((lz) => (
            <mesh key={`bench-leg-${lx}-${lz}`} position={[lx, 0.25, lz]}>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))
        )}
        {/* Heavy Machinist Vise mounted on corner */}
        <mesh position={[-0.9, 0.7, 0.3]}>
          <boxGeometry args={[0.3, 0.22, 0.25]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Compressed Gas Bottle Rack (Oxygen & Acetylene Welding Cylinders) */}
        <group position={[1.8, 0, 0]}>
          {/* Steel cage back & side frame with safety rail */}
          <mesh position={[0, 0.7, -0.32]}>
            <boxGeometry args={[1.2, 1.4, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[-0.58, 0.7, 0]}>
            <boxGeometry args={[0.04, 1.4, 0.68]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.58, 0.7, 0]}>
            <boxGeometry args={[0.04, 1.4, 0.68]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Front safety retainer bar */}
          <mesh position={[0, 0.8, 0.34]}>
            <boxGeometry args={[1.2, 0.05, 0.04]} />
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Oxygen Cylinder (Green) */}
          <mesh position={[-0.3, 0.75, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
          {/* Acetylene Cylinder (Red/Maroon) */}
          <mesh position={[0.3, 0.6, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 1.1, 12]} />
            <meshStandardMaterial color="#991b1b" roughness={0.4} />
          </mesh>
        </group>

        {/* Heavy Jobsite Steel Gang Box (Tool chest) - height 0.7, centered at y=0.35 so bottom is at 0.0 */}
        <mesh position={[-0.2, 0.35, 1.6]}>
          <boxGeometry args={[1.6, 0.7, 0.8]} />
          <meshStandardMaterial color="#d97706" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 6. CHEMICAL PALLETS & 55-GALLON OIL DRUMS ================= */}
      <group position={[-14, -1.98, 15]}>
        {/* Euro Wood Pallet #1 with stacked Bentonite mud additive sacks */}
        {/* Height 0.14, centered at y=0.07 so bottom is at 0.0 (-1.98 world) */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[1.4, 0.14, 1.4]} />
          <meshStandardMaterial color="#785c37" roughness={0.9} />
        </mesh>
        {/* Stacked bagged chemicals (drilling mud polymer/barite) under protective tarp */}
        <mesh position={[0, 0.61, 0]}>
          <boxGeometry args={[1.25, 0.94, 1.25]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>

        {/* Pallet #2 with four 55-Gallon Lube Oil & Coolant Drums */}
        <group position={[2.2, 0, 0]}>
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[1.4, 0.14, 1.4]} />
            <meshStandardMaterial color="#785c37" roughness={0.9} />
          </mesh>
          {/* Drum 1 (Blue Engine Oil) */}
          <mesh position={[-0.35, 0.59, -0.35]}>
            <cylinderGeometry args={[0.26, 0.26, 0.9, 14]} />
            <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* Drum 2 (Yellow Hydraulic Oil) */}
          <mesh position={[0.35, 0.59, -0.35]}>
            <cylinderGeometry args={[0.26, 0.26, 0.9, 14]} />
            <meshStandardMaterial color="#eab308" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* Drum 3 (Black Gear Lube) */}
          <mesh position={[-0.35, 0.59, 0.35]}>
            <cylinderGeometry args={[0.26, 0.26, 0.9, 14]} />
            <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Drum 4 (Red Transmission Oil) */}
          <mesh position={[0.35, 0.59, 0.35]}>
            <cylinderGeometry args={[0.26, 0.26, 0.9, 14]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= 7. EMERGENCY FIRE EXTINGUISHER CRASH CARTS ================= */}
      {/* 50kg Heavy-Duty Wheeled Dry Chemical Extinguishers */}
      {[
        { pos: [14.5, -1.98, -7.5], rot: 0.4 }, // Near Fuel Tank
        { pos: [8.5, -1.98, -4.5], rot: -0.8 }, // Near Generators
        { pos: [-12.5, -1.98, -1.5], rot: 1.2 } // Near Mud Pumps
      ].map((cart, idx) => (
        <group key={`extinguisher-cart-${idx}`} position={cart.pos as [number, number, number]} rotation={[0, cart.rot, 0]}>
          {/* Wheeled hand truck frame */}
          <mesh position={[0, 0.6, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Wheels - radius 0.18, centered at y=0.18 so bottom touches ground at 0.0 (-1.98 world) */}
          {[-0.22, 0.22].map((wx) => (
            <mesh key={`ext-wheel-${wx}`} position={[wx, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
          {/* Main 50kg Red Pressure Cylinder */}
          <mesh position={[0, 0.68, 0.05]}>
            <cylinderGeometry args={[0.16, 0.16, 0.95, 14]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Top Brass Valve & Discharge Hose */}
          <mesh position={[0, 1.2, 0.05]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
