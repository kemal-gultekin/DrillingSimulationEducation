import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FORMATION_LAYERS, CASING_PROGRAM, PDC_BIT_SPECS } from '../../data/subsurface';
import { DownholeOperationPhase } from '../../types';

interface SubsurfaceViewProps {
  currentBitDepth: number;     // 0 to 15000 ft
  isDrilling: boolean;
  phase: DownholeOperationPhase;
  kickActive: boolean;
  isBopClosed: boolean;
  mudPumping: boolean;
}

// Coordinate scaling: 1 unit in 3D = 100 ft in depth
// depth ft = -y * 100  =>  y = -depth / 100
const DEPTH_SCALE = 0.01;

export const SubsurfaceView: React.FC<SubsurfaceViewProps> = ({
  currentBitDepth,
  isDrilling,
  phase,
  kickActive,
  isBopClosed,
  mudPumping
}) => {
  const bitRotationRef = useRef<THREE.Group>(null);
  const mudParticlesDownRef = useRef<THREE.Points>(null);
  const mudParticlesUpRef = useRef<THREE.Points>(null);
  const gasBubbleRef = useRef<THREE.Group>(null);
  const bopRamsRef = useRef<THREE.Group>(null);

  // Bit depth in 3D world units (negative Y)
  const bitY = -currentBitDepth * DEPTH_SCALE;

  // Generate downward mud particles (inside drillstring)
  const particleCountDown = 120;
  const { downPositions, downSpeeds } = useMemo(() => {
    const pos = new Float32Array(particleCountDown * 3);
    const spd = new Float32Array(particleCountDown);
    for (let i = 0; i < particleCountDown; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = -Math.random() * 150;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      spd[i] = 0.8 + Math.random() * 0.6;
    }
    return { downPositions: pos, downSpeeds: spd };
  }, []);

  // Generate upward mud particles & cuttings (inside annulus)
  const particleCountUp = 180;
  const { upPositions, upSpeeds } = useMemo(() => {
    const pos = new Float32Array(particleCountUp * 3);
    const spd = new Float32Array(particleCountUp);
    for (let i = 0; i < particleCountUp; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.35 + Math.random() * 0.35;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -Math.random() * 150;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      spd[i] = 0.4 + Math.random() * 0.5;
    }
    return { upPositions: pos, upSpeeds: spd };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Rotate drill bit and BHA when drilling or pumping
    if (bitRotationRef.current && (isDrilling || mudPumping)) {
      bitRotationRef.current.rotation.y += delta * 6.5;
    }

    // Animate downward fluid inside pipe
    if (mudParticlesDownRef.current && mudPumping) {
      const geo = mudParticlesDownRef.current.geometry;
      const positions = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCountDown; i++) {
        positions[i * 3 + 1] -= downSpeeds[i] * 12 * delta;
        // Reset when particle exceeds current bit depth
        if (positions[i * 3 + 1] < bitY) {
          positions[i * 3 + 1] = -0.5;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Animate upward fluid & cuttings in annulus
    if (mudParticlesUpRef.current && mudPumping && !isBopClosed) {
      const geo = mudParticlesUpRef.current.geometry;
      const positions = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCountUp; i++) {
        // Only animate if above bit
        if (positions[i * 3 + 1] < bitY) {
          positions[i * 3 + 1] = bitY + Math.random() * 2;
        }
        positions[i * 3 + 1] += upSpeeds[i] * 8 * delta;
        if (positions[i * 3 + 1] > -0.5) {
          positions[i * 3 + 1] = bitY;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Pulsing gas kick bubbles when kick is active
    if (gasBubbleRef.current && kickActive) {
      gasBubbleRef.current.position.y += delta * 4;
      if (gasBubbleRef.current.position.y > (isBopClosed ? -2.2 : -0.5)) {
        gasBubbleRef.current.position.y = bitY;
      }
      const scale = 1 + Math.sin(time * 10) * 0.15;
      gasBubbleRef.current.scale.set(scale, scale, scale);
    }

    // BOP Rams closing interpolation
    if (bopRamsRef.current) {
      const targetScale = isBopClosed ? 0.35 : 1.0;
      bopRamsRef.current.scale.x = THREE.MathUtils.lerp(bopRamsRef.current.scale.x, targetScale, 0.15);
      bopRamsRef.current.scale.z = THREE.MathUtils.lerp(bopRamsRef.current.scale.z, targetScale, 0.15);
    }
  });

  return (
    <group position={[0, -2.0, 0]}>
      {/* ================= 1. FORMATION GEOLOGICAL LAYERS ================= */}
      <group>
        {FORMATION_LAYERS.map((layer) => {
          const topY = -layer.depthStart * DEPTH_SCALE;
          const botY = -layer.depthEnd * DEPTH_SCALE;
          const height = Math.abs(topY - botY);
          const centerY = topY - height / 2;

          return (
            <group key={layer.id} position={[0, centerY, 0]}>
              {/* Outer geological cylinder with 270-degree cutaway (revealing wellbore inside) */}
              <mesh receiveShadow>
                <cylinderGeometry
                  args={[
                    16,                // top radius
                    16,                // bottom radius
                    height,            // height
                    36,                // radial segments
                    1,                 // height segments
                    true,              // open ended
                    Math.PI * 0.25,    // thetaStart (opens facing front-right)
                    Math.PI * 1.5      // thetaLength (270 degrees)
                  ]}
                />
                <meshStandardMaterial
                  color={layer.color}
                  roughness={0.88}
                  metalness={0.08}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Cutaway cross-section cap planes */}
              <mesh rotation={[0, Math.PI * 0.25, 0]} position={[8 * Math.cos(Math.PI * 0.25), 0, 8 * Math.sin(Math.PI * 0.25)]}>
                <boxGeometry args={[16, height, 0.05]} />
                <meshStandardMaterial color={layer.color} roughness={0.9} />
              </mesh>
              <mesh rotation={[0, Math.PI * 1.75, 0]} position={[8 * Math.cos(Math.PI * 1.75), 0, 8 * Math.sin(Math.PI * 1.75)]}>
                <boxGeometry args={[16, height, 0.05]} />
                <meshStandardMaterial color={layer.color} roughness={0.9} />
              </mesh>

              {/* Hydrocarbon reservoir golden glow indicator */}
              {layer.textureType === 'reservoir' && (
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry
                    args={[16.2, 16.2, height * 0.95, 24, 1, true, Math.PI * 0.25, Math.PI * 1.5]}
                  />
                  <meshBasicMaterial
                    color="#f59e0b"
                    transparent={true}
                    opacity={0.18}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* ================= 2. WELLBORE & CASING PROGRAM ================= */}
      <group>
        {CASING_PROGRAM.map((casing) => {
          const shoeY = -casing.shoeDepth * DEPTH_SCALE;
          const topY = -casing.topDepth * DEPTH_SCALE;
          const height = Math.abs(topY - shoeY);
          const centerY = topY - height / 2;

          // Convert string size to relative visual radius
          let radius = 0.9;
          if (casing.id === 'conductor') radius = 1.35;
          if (casing.id === 'surface') radius = 1.05;
          if (casing.id === 'intermediate') radius = 0.8;
          if (casing.id === 'production') radius = 0.6;

          return (
            <group key={casing.id}>
              {/* Casing Steel Pipe (Cutaway cylinder so inside fluid and string are visible) */}
              <mesh position={[0, centerY, 0]}>
                <cylinderGeometry
                  args={[radius, radius, height, 24, 1, true, Math.PI * 0.35, Math.PI * 1.3]}
                />
                <meshStandardMaterial
                  color={casing.color}
                  metalness={0.7}
                  roughness={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Cement Sheath outside casing */}
              <mesh position={[0, centerY, 0]}>
                <cylinderGeometry
                  args={[radius + 0.1, radius + 0.1, height, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3]}
                />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.1}
                  roughness={0.95}
                  transparent={true}
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Distinct Heavy Casing Shoe Collar Ring at bottom */}
              <mesh position={[0, shoeY + 0.15, 0]}>
                <cylinderGeometry args={[radius + 0.08, radius + 0.04, 0.4, 24]} />
                <meshStandardMaterial
                  color={casing.shoeColor}
                  metalness={0.8}
                  roughness={0.25}
                  emissive={casing.shoeColor}
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          );
        })}

        {/* Open Hole Borehole from Production Casing Shoe down to 15,000 ft */}
        <mesh position={[0, -140, 0]}>
          <cylinderGeometry
            args={[0.55, 0.55, 20, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3]}
          />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ================= 3. DRILL STRING, BHA & ROTATING BIT ================= */}
      <group>
        {/* Drill Pipe (from surface to 200 ft above bit) */}
        {bitY < -2 && (
          <mesh position={[0, bitY / 2 + 1, 0]}>
            <cylinderGeometry args={[0.18, 0.18, Math.abs(bitY) - 2, 16]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Drill Pipe Tool Joints every 30 ft (scaled visual rings) */}
        {Array.from({ length: Math.min(30, Math.floor(Math.abs(bitY) / 3)) }).map((_, i) => (
          <mesh key={`joint-${i}`} position={[0, -i * 3 - 1, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.25, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* BHA & Bit Assembly (Positioned at current bit depth) */}
        <group position={[0, bitY, 0]}>
          {/* Heavy Weight Drill Collars (thick steel section) */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 2.0, 16]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>

          {/* Near-Bit Stabilizer with helical blades */}
          <group position={[0, 0.45, 0]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} />
            </mesh>
            {[0, 1, 2, 3].map((b) => (
              <mesh key={`blade-${b}`} rotation={[0, (b * Math.PI) / 2, 0.1]}>
                <boxGeometry args={[0.5, 0.45, 0.08]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </group>

          {/* Rotating PDC Matrix Drill Bit */}
          <group ref={bitRotationRef} position={[0, 0, 0]}>
            {/* Bit Shank & Crown */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.28, 0.42, 0.35, 16]} />
              <meshStandardMaterial
                color="#ca8a04"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>

            {/* PDC Cutter Blades (Polycrystalline Diamond Compact Cutters) */}
            {[0, 1, 2, 3, 4].map((c) => (
              <group key={`cutter-${c}`} rotation={[0, (c * Math.PI * 2) / 5, 0]}>
                <mesh position={[0.22, -0.15, 0]}>
                  <boxGeometry args={[0.08, 0.18, 0.06]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            ))}

            {/* Bit Jet Nozzles */}
            {[0, 1, 2].map((n) => (
              <mesh key={`nozzle-${n}`} position={[0.1 * Math.cos(n * 2.1), -0.18, 0.1 * Math.sin(n * 2.1)]}>
                <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ================= 4. MUD CIRCULATION PARTICLES ================= */}
      {/* Downward drilling mud flow inside pipe */}
      <points ref={mudParticlesDownRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[downPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#38bdf8"
          transparent={true}
          opacity={0.85}
        />
      </points>

      {/* Upward mud & cuttings flow in annulus */}
      <points ref={mudParticlesUpRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[upPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#a3e635" // Yellow-green mud carrying cuttings
          transparent={true}
          opacity={0.75}
        />
      </points>

      {/* ================= 5. KICK GAS INFLUX SIMULATION ================= */}
      {kickActive && (
        <group ref={gasBubbleRef} position={[0, bitY + 1.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#dc2626"
              emissiveIntensity={0.8}
              transparent={true}
              opacity={0.85}
            />
          </mesh>
          {/* Swirling gas particles */}
          {[0, 1, 2, 3].map((g) => (
            <mesh key={`gas-part-${g}`} position={[(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.6]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#f97316" transparent={true} opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= 6. BOP STACK CUTAWAY & RAMS (At Cellar Floor) ================= */}
      <group position={[0, -0.6, 0]}>
        {/* BOP Outer Housing */}
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 1.8, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3]} />
          <meshStandardMaterial color="#dc2626" metalness={0.75} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>

        {/* BOP Pipe Rams / Annular Element (Animates closed when shut-in) */}
        <group ref={bopRamsRef} position={[0, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.65, 0.25, 16, 24]} />
            <meshStandardMaterial
              color={isBopClosed ? '#e11d48' : '#64748b'}
              emissive={isBopClosed ? '#be123c' : '#000000'}
              emissiveIntensity={isBopClosed ? 0.7 : 0}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
