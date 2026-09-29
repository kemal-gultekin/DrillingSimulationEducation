import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PBR_PRESETS } from '../../materials/materialLibrary';
import { getPBRTextures } from '../../materials/proceduralTextures';

interface PipeRacksProps {
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  getMaterialColor: (id: string, baseColor: string, highlightColor?: string) => string;
}

export const PipeRacks: React.FC<PipeRacksProps> = ({
  selectedEquipmentId,
  onSelectEquipment,
  getMaterialColor
}) => {
  const isSelected = selectedEquipmentId === 'catwalk-piperacks';
  const textures = useMemo(() => getPBRTextures(), []);

  return (
    <group
      name="catwalk-piperacks-group"
      onClick={(e: any) => {
        if (e.delta && e.delta > 5) return;
        e.stopPropagation();
        onSelectEquipment('catwalk-piperacks');
      }}
    >
      {/* ================= 1. V-DOOR RAMP (CONNECTING RIG FLOOR TO CATWALK) ================= */}
      {/* Sloped ramp structure from Rig Floor (y=3.45, z=4.5) down to Catwalk (y=-1.2, z=9.5) */}
      <group position={[0, 1.125, 7.0]}>
        {/* Sloped ramp beam */}
        <mesh
          rotation={[Math.atan2(4.65, 5.0), 0, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[2.2, 0.25, 6.8]} />
          <meshStandardMaterial
            color={getMaterialColor('catwalk-piperacks', '#475569', '#f59e0b')}
            metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
            roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
          />
        </mesh>

        {/* Central pipe slide trough (tinned steel skid channel) */}
        <mesh
          position={[0, 0.12, 0]}
          rotation={[Math.atan2(4.65, 5.0), 0, 0]}
        >
          <boxGeometry args={[1.0, 0.1, 6.7]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={0.28}
            bumpMap={textures.metalScratches}
            bumpScale={0.015}
          />
        </mesh>

        {/* Ramp yellow side guide rails */}
        {[-1.15, 1.15].map((x, idx) => (
          <mesh
            key={`ramp-rail-${idx}`}
            position={[x, 0.35, 0]}
            rotation={[Math.atan2(4.65, 5.0), 0, 0]}
          >
            <boxGeometry args={[0.08, 0.6, 6.8]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
              roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
            />
          </mesh>
        ))}

        {/* Support structural A-frame under V-door ramp */}
        <mesh position={[0, -0.6, 0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 2. CATWALK HORIZONTAL RUNWAY ================= */}
      {/* Runs from z=9.5 to z=26.5 at y=-1.2 (elevated from ground y=-1.9) */}
      <group position={[0, -1.2, 18]}>
        {/* Catwalk steel grating floor */}
        <mesh receiveShadow castShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.3, 17]} />
          <meshStandardMaterial
            color={getMaterialColor('catwalk-piperacks', '#475569', '#f59e0b')}
            metalness={0.5}
            roughness={0.45}
            roughnessMap={textures.dirtWear}
          />
        </mesh>

        {/* Center automated pipe trough / skate track */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.9, 0.08, 16.8]} />
          <meshStandardMaterial
            color="#334155"
            metalness={PBR_PRESETS.RAW_METAL.metalness}
            roughness={0.3}
            bumpMap={textures.metalScratches}
            bumpScale={0.01}
          />
        </mesh>

        {/* Catwalk yellow safety handrails */}
        {[-1.12, 1.12].map((x, idx) => (
          <group key={`catwalk-rail-${idx}`} position={[x, 0.6, 0]}>
            <mesh>
              <boxGeometry args={[0.06, 0.9, 16.9]} />
              <meshStandardMaterial
                color="#eab308"
                metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
                roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
              />
            </mesh>
          </group>
        ))}

        {/* Vertical support legs lifting catwalk off gravel pad with footplates */}
        {[-7, -3.5, 0, 3.5, 7].map((zOffset, idx) => (
          <group key={`catwalk-legs-${idx}`} position={[0, 0, zOffset]}>
            {[-0.9, 0.9].map((lx) => (
              <group key={`cat-leg-${lx}`}>
                <mesh position={[lx, -0.4, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.76, 8]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
                </mesh>
                {/* Steel footing baseplate flush on pad */}
                <mesh position={[lx, -0.76, 0]}>
                  <boxGeometry args={[0.3, 0.04, 0.3]} />
                  <meshStandardMaterial color="#334155" metalness={0.7} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* ================= 3. PIPE RACKS (LEFT & RIGHT OF CATWALK) ================= */}
      {/* Pipe rack beams (bolsters) */}
      {[-1, 1].map((side) => {
        const xPos = side * 5.2;
        return (
          <group key={`piperack-side-${side}`} position={[xPos, -1.35, 18]}>
            {/* Triangular Rack Steel Bolsters */}
            {[-6.5, -3.2, 0.1, 3.4, 6.7].map((zPos, bIdx) => (
              <group key={`bolster-${bIdx}`} position={[0, 0, zPos]}>
                {/* Horizontal bolster I-beam */}
                <mesh position={[0, 0.1, 0]} castShadow>
                  <boxGeometry args={[4.2, 0.25, 0.3]} />
                  <meshStandardMaterial
                    color="#2563eb"
                    metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
                    roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
                  />
                </mesh>
                {/* Bolster support posts down to ground with footplates */}
                {[-1.8, 1.8].map((px) => (
                  <group key={`bpost-${px}`}>
                    <mesh position={[px, -0.32, 0]}>
                      <cylinderGeometry args={[0.09, 0.09, 0.65, 8]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
                    </mesh>
                    <mesh position={[px, -0.61, 0]}>
                      <boxGeometry args={[0.35, 0.04, 0.35]} />
                      <meshStandardMaterial color="#334155" metalness={0.7} />
                    </mesh>
                  </group>
                ))}
                {/* End safety stops (prevents tubulars from rolling off) */}
                <mesh position={[side * 2.0, 0.35, 0]}>
                  <boxGeometry args={[0.15, 0.45, 0.25]} />
                  <meshStandardMaterial
                    color="#eab308"
                    metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
                    roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
                  />
                </mesh>
              </group>
            ))}

            {/* Drill Pipe Stacks on this rack */}
            {side === -1 ? (
              // Left side: Drill Pipe (5" OD, NC50) stacks in 3 layers
              <group position={[0, 0.32, 0]}>
                {/* Layer 1 (Bottom) */}
                {[-1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6].map((xOff, pIdx) => (
                  <mesh
                    key={`dp-l1-${pIdx}`}
                    position={[xOff, 0.08, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.12, 0.12, 15.5, 12]} />
                    <meshStandardMaterial
                      color="#475569"
                      metalness={PBR_PRESETS.RAW_METAL.metalness}
                      roughness={PBR_PRESETS.RAW_METAL.roughness}
                      bumpMap={textures.metalScratches}
                      bumpScale={0.015}
                    />
                  </mesh>
                ))}

                {/* Layer 2 (Middle) with wooden spacer strip */}
                <mesh position={[0, 0.22, 0]}>
                  <boxGeometry args={[3.8, 0.06, 15]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                {[-1.4, -1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((xOff, pIdx) => (
                  <mesh
                    key={`dp-l2-${pIdx}`}
                    position={[xOff, 0.38, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.12, 0.12, 15.5, 12]} />
                    <meshStandardMaterial
                      color="#64748b"
                      metalness={PBR_PRESETS.RAW_METAL.metalness}
                      roughness={0.28}
                      bumpMap={textures.metalScratches}
                      bumpScale={0.015}
                    />
                  </mesh>
                ))}

                {/* Layer 3 (Top) */}
                <mesh position={[0, 0.52, 0]}>
                  <boxGeometry args={[3.2, 0.06, 15]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((xOff, pIdx) => (
                  <mesh
                    key={`dp-l3-${pIdx}`}
                    position={[xOff, 0.68, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.12, 0.12, 15.5, 12]} />
                    <meshStandardMaterial
                      color="#94a3b8"
                      metalness={PBR_PRESETS.RAW_METAL.metalness}
                      roughness={0.22}
                      bumpMap={textures.metalScratches}
                      bumpScale={0.015}
                    />
                  </mesh>
                ))}
              </group>
            ) : (
              // Right side: Casing stands (9-5/8" and 13-3/8" larger diameter tubulars)
              <group position={[0, 0.35, 0]}>
                {/* Bottom layer of large casing */}
                {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((xOff, cIdx) => (
                  <mesh
                    key={`casing-l1-${cIdx}`}
                    position={[xOff, 0.16, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.22, 0.22, 15.2, 14]} />
                    <meshStandardMaterial
                      color="#334155"
                      metalness={PBR_PRESETS.RAW_METAL.metalness}
                      roughness={0.32}
                      bumpMap={textures.metalScratches}
                      bumpScale={0.012}
                    />
                  </mesh>
                ))}
                {/* Spacer timbers */}
                <mesh position={[0, 0.42, 0]}>
                  <boxGeometry args={[3.6, 0.08, 14.8]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                {/* Second tier casing with thread protectors */}
                {[-1.2, -0.6, 0, 0.6, 1.2].map((xOff, cIdx) => (
                  <group key={`casing-l2-${cIdx}`} position={[xOff, 0.7, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                      <cylinderGeometry args={[0.22, 0.22, 15.2, 14]} />
                      <meshStandardMaterial
                        color="#475569"
                        metalness={PBR_PRESETS.RAW_METAL.metalness}
                        roughness={0.32}
                        bumpMap={textures.metalScratches}
                        bumpScale={0.012}
                      />
                    </mesh>
                    {/* Thread protectors (orange composite caps on tubular ends) */}
                    <mesh position={[0, 0, 7.55]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.24, 0.24, 0.3, 14]} />
                      <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0, -7.55]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.24, 0.24, 0.3, 14]} />
                      <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.4} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* Inspection Selection Ring / Highlight when active */}
      {isSelected && (
        <mesh position={[0, -0.8, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9, 9.4, 32]} />
          <meshBasicMaterial color="#f97316" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
