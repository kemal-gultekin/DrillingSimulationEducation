import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PBR_PRESETS } from '../../materials/materialLibrary';
import { getPBRTextures } from '../../materials/proceduralTextures';

/**
 * SiteGround represents the engineered onshore drilling location pad (caliche/gravel pad),
 * load-bearing timber & steel rig mats beneath the heavy mast substructure,
 * the concrete BOP cellar pit under the wellhead, compacted gravel roads with tire tracks,
 * and operational soil/oil wear patches.
 */
export const SiteGround: React.FC = () => {
  const textures = useMemo(() => getPBRTextures(), []);

  // Procedural radial fade texture for expansive outer terrain (transitions soil tone to horizon sky/fog color)
  const radialGroundTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 252);
    grad.addColorStop(0.00, '#756b5d'); // Inner natural desert earth
    grad.addColorStop(0.22, '#756b5d'); // Out to inner soil border
    grad.addColorStop(0.42, '#736b5e'); // Subtle arid soil variation
    grad.addColorStop(0.60, '#7c8684'); // Atmospheric scattering transition
    grad.addColorStop(0.78, '#889fb2'); // Soft distance haze
    grad.addColorStop(0.92, '#90bbd7'); // Full horizon sky/fog color
    grad.addColorStop(1.00, '#90bbd7');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle grain to prevent color stepping
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * 8;
      d[i] = Math.min(255, Math.max(0, d[i] + noise));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Procedural vertical atmospheric haze texture for the distant horizon veil ring
  const horizonHazeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, 'rgba(160, 201, 225, 0)');
    grad.addColorStop(0.40, 'rgba(152, 194, 220, 0.08)');
    grad.addColorStop(0.68, 'rgba(144, 187, 215, 0.32)');
    grad.addColorStop(0.84, 'rgba(144, 187, 215, 0.42)');
    grad.addColorStop(0.92, 'rgba(135, 172, 198, 0.20)');
    grad.addColorStop(1.00, 'rgba(120, 155, 178, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Procedural soft-edge alpha falloff mask for the rectangular gravel drilling pad
  // Hermite smoothstep creates a seamless feathered blend into the surrounding circular terrain disc
  const padAlphaTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(512, 512);
    const data = imgData.data;

    for (let y = 0; y < 512; y++) {
      const ny = Math.abs((y - 256) / 256); // 0 at center, 1 at perimeter
      for (let x = 0; x < 512; x++) {
        const nx = Math.abs((x - 256) / 256);
        const idx = (y * 512 + x) * 4;

        // Chebyshev distance with rounded corner softening
        const maxDist = Math.max(nx, ny);
        const euclidDist = Math.sqrt(nx * nx + ny * ny) / Math.SQRT2;
        const d = maxDist * 0.82 + euclidDist * 0.18;

        // Solid core up to 72% of pad width (~56m), followed by smooth cubic falloff to 0 at edges (78m)
        let alpha = 1.0;
        if (d > 0.72) {
          const t = Math.min(1.0, (d - 0.72) / (1.0 - 0.72));
          alpha = 1.0 - (t * t * (3 - 2 * t));
        }

        const val = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = val;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // Distant low rolling terrain silhouettes along the horizon (radius ~185m to 215m)
  const distantRidges = useMemo(() => {
    const ridges = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.08 : -0.06);
      const radius = 185 + ((i * 17) % 30);
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const width = 55 + ((i * 23) % 35);
      const height = 3.2 + ((i * 7) % 3.6); // Very low, gentle profile (3.2m to 6.8m)
      const rotY = angle + Math.PI / 2 + 0.1;
      ridges.push({ x, z, width, height, rotY, key: `ridge-${i}` });
    }
    return ridges;
  }, []);

  return (
    <group name="site-ground-pad">
      {/* ================= 1. ENGINEERED GRAVEL DRILLING PAD & EXPANSIVE TERRAIN ================= */}
      {/* Primary compacted crushed-rock location pad with gradual feathered alpha falloff (no hard edge/step) */}
      <mesh position={[0, -1.98, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[78, 78]} />
        <meshStandardMaterial
          color="#aba293"
          roughness={PBR_PRESETS.GRAVEL_SOIL.roughness}
          metalness={PBR_PRESETS.GRAVEL_SOIL.metalness}
          map={textures.gravelGround}
          bumpMap={textures.gravelGround}
          bumpScale={0.022}
          roughnessMap={textures.dirtWear}
          alphaMap={padAlphaTexture || undefined}
          transparent={true}
        />
      </mesh>

      {/* Expansive outer terrain disk (radius 360m) - unified continuous base with seamless radial fade */}
      {radialGroundTexture && (
        <mesh position={[0, -1.982, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[360, 64]} />
          <meshStandardMaterial
            map={radialGroundTexture}
            roughness={0.96}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* Low distant rolling ridges / mesas along horizon (softly bathed in atmospheric fog) */}
      <group name="distant-horizon-terrain">
        {distantRidges.map((r) => (
          <mesh
            key={r.key}
            position={[r.x, -1.98 + r.height * 0.35, r.z]}
            rotation={[0, r.rotY, 0]}
          >
            <cylinderGeometry args={[r.width * 0.35, r.width * 0.5, r.height, 14]} />
            <meshStandardMaterial color="#6e6456" roughness={1.0} metalness={0.0} />
          </mesh>
        ))}
      </group>

      {/* Subtle atmospheric horizon haze veil ring (softens line where earth meets sky) */}
      {horizonHazeTexture && (
        <mesh position={[0, 4.0, 0]}>
          <cylinderGeometry args={[235, 235, 22, 48, 1, true]} />
          <meshBasicMaterial
            map={horizonHazeTexture}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      )}

      {/* Pad boundary earthen containment berms (sloped perimeter banks) */}
      {/* North berm */}
      <mesh position={[0, -1.9, -36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[74, 0.22, 1.4]} />
        <meshStandardMaterial color="#6e6456" roughness={0.96} bumpMap={textures.gravelGround} bumpScale={0.02} />
      </mesh>
      {/* South berm (split for vehicle gate at center) */}
      <mesh position={[-21, -1.9, 36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[32, 0.22, 1.4]} />
        <meshStandardMaterial color="#6e6456" roughness={0.96} bumpMap={textures.gravelGround} bumpScale={0.02} />
      </mesh>
      <mesh position={[21, -1.9, 36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[32, 0.22, 1.4]} />
        <meshStandardMaterial color="#6e6456" roughness={0.96} bumpMap={textures.gravelGround} bumpScale={0.02} />
      </mesh>
      {/* East berm */}
      <mesh position={[36, -1.9, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.22, 74]} />
        <meshStandardMaterial color="#6e6456" roughness={0.96} bumpMap={textures.gravelGround} bumpScale={0.02} />
      </mesh>
      {/* West berm */}
      <mesh position={[-36, -1.9, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.22, 74]} />
        <meshStandardMaterial color="#6e6456" roughness={0.96} bumpMap={textures.gravelGround} bumpScale={0.02} />
      </mesh>

      {/* ================= 2. HEAVY-DUTY TIMBER & STEEL RIG MATS ================= */}
      {/* Interlocked 8'x40' structural crane mats beneath substructure to support 1,000,000+ lbs */}
      <group position={[0, -1.92, 0]}>
        {/* Mast Substructure Foundation Mats (x: -5 to 5, z: -5 to 5) */}
        {[-4.0, -2.4, -0.8, 0.8, 2.4, 4.0].map((xOffset) => (
          <group key={`sub-mat-${xOffset}`} position={[xOffset, 0, 0]}>
            {/* Oak Timber deck planking */}
            <mesh position={[0, 0.04, 0]} receiveShadow>
              <boxGeometry args={[1.45, 0.08, 9.8]} />
              <meshStandardMaterial
                color="#57493a"
                roughness={0.88}
                metalness={0.08}
                bumpMap={textures.concreteNoise}
                bumpScale={0.015}
              />
            </mesh>
            {/* Outer steel I-beam side frames */}
            <mesh position={[-0.7, 0.04, 0]}>
              <boxGeometry args={[0.06, 0.09, 9.8]} />
              <meshStandardMaterial
                color="#475569"
                metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
                roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
              />
            </mesh>
            <mesh position={[0.7, 0.04, 0]}>
              <boxGeometry args={[0.06, 0.09, 9.8]} />
              <meshStandardMaterial
                color="#475569"
                metalness={PBR_PRESETS.PAINTED_STEEL.metalness}
                roughness={PBR_PRESETS.PAINTED_STEEL.roughness}
              />
            </mesh>
            {/* Steel lifting shackle plates on ends */}
            <mesh position={[0, 0.04, 4.9]}>
              <boxGeometry args={[1.4, 0.08, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.04, -4.9]}>
              <boxGeometry args={[1.4, 0.08, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Mud Pump Foundation Mats */}
        <mesh position={[-10, 0.03, -0.5]} receiveShadow>
          <boxGeometry args={[6.2, 0.06, 8.4]} />
          <meshStandardMaterial
            color="#5a4d3f"
            roughness={0.9}
            bumpMap={textures.concreteNoise}
            bumpScale={0.015}
          />
        </mesh>
      </group>

      {/* ================= 3. CONCRETE BOP CELLAR PIT ================= */}
      {/* 8ft x 8ft x 6ft reinforced concrete cellar pit beneath the wellhead */}
      <group position={[0, -1.95, 0]}>
        {/* Cellar Floor slab */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.15, 4.2]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={PBR_PRESETS.CONCRETE.roughness}
            metalness={PBR_PRESETS.CONCRETE.metalness}
            bumpMap={textures.concreteNoise}
            bumpScale={0.03}
          />
        </mesh>
        {/* Cellar walls */}
        {/* North wall */}
        <mesh position={[0, -0.35, -2.1]}>
          <boxGeometry args={[4.4, 0.7, 0.2]} />
          <meshStandardMaterial
            color="#7a889b"
            roughness={0.88}
            bumpMap={textures.concreteNoise}
            bumpScale={0.03}
          />
        </mesh>
        {/* South wall */}
        <mesh position={[0, -0.35, 2.1]}>
          <boxGeometry args={[4.4, 0.7, 0.2]} />
          <meshStandardMaterial
            color="#7a889b"
            roughness={0.88}
            bumpMap={textures.concreteNoise}
            bumpScale={0.03}
          />
        </mesh>
        {/* East wall */}
        <mesh position={[2.1, -0.35, 0]}>
          <boxGeometry args={[0.2, 0.7, 4.0]} />
          <meshStandardMaterial
            color="#7a889b"
            roughness={0.88}
            bumpMap={textures.concreteNoise}
            bumpScale={0.03}
          />
        </mesh>
        {/* West wall */}
        <mesh position={[-2.1, -0.35, 0]}>
          <boxGeometry args={[0.2, 0.7, 4.0]} />
          <meshStandardMaterial
            color="#7a889b"
            roughness={0.88}
            bumpMap={textures.concreteNoise}
            bumpScale={0.03}
          />
        </mesh>
        {/* Cellar sump pit pump & suction hose */}
        <mesh position={[1.4, -0.4, 1.4]}>
          <cylinderGeometry args={[0.18, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[1.4, -0.1, 1.4]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 10]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>
        {/* Cellar access ladder */}
        <mesh position={[-1.9, -0.35, 0]}>
          <boxGeometry args={[0.1, 0.7, 0.5]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={PBR_PRESETS.SAFETY_ENAMEL.metalness}
            roughness={PBR_PRESETS.SAFETY_ENAMEL.roughness}
          />
        </mesh>
      </group>

      {/* ================= 4. COMPACTED ROADS & TIRE TRACK RUTS ================= */}
      <group position={[0, -1.97, 0]}>
        {/* Main Access Highway from South Gate (z=36 to z=0) */}
        <mesh position={[0, 0, 18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.5, 36]} />
          <meshStandardMaterial
            color="#8c8273"
            roughness={0.96}
            bumpMap={textures.gravelGround}
            bumpScale={0.015}
            roughnessMap={textures.dirtWear}
          />
        </mesh>

        {/* Exterior Approach Road beyond South Gate (z=36 to z=56) blending into surrounding desert terrain */}
        <mesh position={[0, -0.005, 46]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.5, 20]} />
          <meshStandardMaterial
            color="#7a7061"
            roughness={0.96}
            bumpMap={textures.gravelGround}
            bumpScale={0.012}
            roughnessMap={textures.dirtWear}
          />
        </mesh>

        {/* Heavy Truck Tire Tracks (Twin pair of darker compacted gravel ruts) */}
        {[-1.6, 1.6].map((rutX) => (
          <mesh
            key={`truck-rut-${rutX}`}
            position={[rutX, 0.003, 18]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.7, 35]} />
            <meshStandardMaterial
              color="#756b5d"
              roughness={0.92}
              bumpMap={textures.metalScratches}
              bumpScale={0.008}
            />
          </mesh>
        ))}

        {/* Cross road leading to Pipe Racks & Generator loading lane */}
        <mesh position={[8, 0.001, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[22, 5.5]} />
          <meshStandardMaterial color="#887e70" roughness={0.96} roughnessMap={textures.dirtWear} />
        </mesh>

        {/* Camp Area Egress Route */}
        <mesh position={[18, 0.001, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.5, 26]} />
          <meshStandardMaterial color="#887e70" roughness={0.96} roughnessMap={textures.dirtWear} />
        </mesh>

        {/* Fuel Delivery & Mud Chemical Delivery Spur */}
        <mesh position={[-14, 0.001, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 4.8]} />
          <meshStandardMaterial color="#887e70" roughness={0.96} roughnessMap={textures.dirtWear} />
        </mesh>
      </group>

      {/* ================= 5. OPERATIONAL WEAR, DUST & OIL GRIME PATCHES ================= */}
      {/* High-traffic foot and equipment staining around shaker effluent and pumps */}
      <group position={[0, -1.96, 0]}>
        {/* Oil/mud discoloration around Shakers and Possum Belly */}
        <mesh position={[-8.5, 0.005, 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 4.5]} />
          <meshStandardMaterial color="#332a22" roughness={0.65} metalness={0.15} transparent opacity={0.6} />
        </mesh>
        {/* Heavy mud spill stain near Mud Tanks */}
        <mesh position={[-9, 0.004, 6.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.5, 7.5]} />
          <meshStandardMaterial color="#3d3328" roughness={0.7} metalness={0.1} transparent opacity={0.55} />
        </mesh>
        {/* Diesel / oil drip patch under Generator Skid */}
        <mesh position={[11, 0.004, -6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.5, 8]} />
          <meshStandardMaterial color="#2d2924" roughness={0.6} metalness={0.2} transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
};
