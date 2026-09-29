import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, N8AO, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode, ToneMappingEffect } from 'postprocessing';

interface SceneEffectsProps {
  enablePostProcessing?: boolean;
}

/**
 * SCENE_LIGHTING_CONFIG:
 * Centralized, easily adjustable lighting, exposure and SSAO configuration for PetroSim.
 * Tuned for clear educational readability and high contrast on classroom displays/projectors.
 */
export const SCENE_LIGHTING_CONFIG = {
  // 1. Scene Exposure (Single master constant: 1.0 - 1.4 range)
  exposure: 1.25,

  // 2. Ambient & Daylight Fill (brightens shaded sides so equipment details are not near-black)
  ambientIntensity: 0.92,
  ambientColor: '#f8fafc',

  hemisphereIntensity: 0.88,
  skyColor: '#e0f2fe',
  groundBounceColor: '#cbd5e1',

  // 3. Directional Sunlight (clear crisp shadows while keeping materials well-lit)
  sunIntensity: 2.2,
  sunColor: '#fffdf8',
  sunPosition: [42, 65, 32] as [number, number, number],

  // 4. Opposing Sky Fill Light (prevents deep harsh shadows on opposing equipment faces)
  skyFillIntensity: 0.65,
  skyFillColor: '#bae6fd',
  skyFillPosition: [-32, 28, -28] as [number, number, number],

  // 5. Worksite Task & Operational Floodlights
  rigFloorLightIntensity: 0.65,
  mudSystemLightIntensity: 0.70,
  genSkidLightIntensity: 0.55,
  flareLightIntensity: 0.90,

  // 6. SSAO (N8AO) - Tuned down: contact occlusion only in tight joints/skids, never darkening whole surfaces
  ssaoIntensity: 0.40,
  ssaoRadius: 0.40,
  ssaoDistanceFalloff: 0.85,
  ssaoColor: '#1e293b',

  // 7. Post-Processing Bloom & Vignette
  bloomIntensity: 0.22,
  bloomThreshold: 0.94,
  vignetteDarkness: 0.10, // Minimal edge darkening to keep full frame bright and readable
  vignetteOffset: 0.45,
};

/**
 * SceneEffects:
 * Modular Lighting & Post-Processing pipeline for PetroSim.
 * - Calibrated directional sunlight with high-resolution contact shadows & normal bias
 * - Rich ambient and sky fill light ensuring shaded sides are readable, not dark
 * - Operational task lights on key working zones (Rig floor, mud system)
 * - Tamed screen-space ambient occlusion (SSAO/N8AO) for micro-crevice depth only
 * - Subtle bloom on warning beacons and flare
 * - ACES Filmic tonemapping with calibrated master scene exposure
 */
export const SceneEffects: React.FC<SceneEffectsProps> = ({ enablePostProcessing = true }) => {
  const { gl } = useThree();
  const toneMappingRef = useRef<ToneMappingEffect>(null);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = SCENE_LIGHTING_CONFIG.exposure;

    if (toneMappingRef.current) {
      if (!toneMappingRef.current.uniforms.has('toneMappingExposure')) {
        toneMappingRef.current.uniforms.set(
          'toneMappingExposure',
          new THREE.Uniform(SCENE_LIGHTING_CONFIG.exposure)
        );
      } else {
        const u = toneMappingRef.current.uniforms.get('toneMappingExposure');
        if (u) u.value = SCENE_LIGHTING_CONFIG.exposure;
      }
    }
  }, [gl]);

  return (
    <>
      {/* ================= 1. REBALANCED DAYLIGHT ILLUMINATION ================= */}
      {/* High-intensity diffuse ambient daylight ensuring shaded faces remain fully legible */}
      <ambientLight
        intensity={SCENE_LIGHTING_CONFIG.ambientIntensity}
        color={SCENE_LIGHTING_CONFIG.ambientColor}
      />

      {/* Primary Directional Sunlight casting clear, crisp contact shadows */}
      <directionalLight
        position={SCENE_LIGHTING_CONFIG.sunPosition}
        intensity={SCENE_LIGHTING_CONFIG.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={180}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
        color={SCENE_LIGHTING_CONFIG.sunColor}
      />

      {/* Opposing Sky Fill Directional Light (prevents pitch-dark shadow recesses) */}
      <directionalLight
        position={SCENE_LIGHTING_CONFIG.skyFillPosition}
        intensity={SCENE_LIGHTING_CONFIG.skyFillIntensity}
        color={SCENE_LIGHTING_CONFIG.skyFillColor}
      />

      {/* Hemisphere Light: Crisp daylight sky vs warm limestone caliche ground bounce */}
      <hemisphereLight
        intensity={SCENE_LIGHTING_CONFIG.hemisphereIntensity}
        color={SCENE_LIGHTING_CONFIG.skyColor}
        groundColor={SCENE_LIGHTING_CONFIG.groundBounceColor}
      />

      {/* Operational Task Lights */}
      {/* Rig Floor Task Lights */}
      <pointLight
        position={[-4, 7.5, 4]}
        intensity={SCENE_LIGHTING_CONFIG.rigFloorLightIntensity}
        distance={25}
        color="#fef08a"
        decay={2}
      />
      <pointLight
        position={[4, 7.5, -4]}
        intensity={SCENE_LIGHTING_CONFIG.rigFloorLightIntensity}
        distance={25}
        color="#fef08a"
        decay={2}
      />

      {/* Mud System & Shale Shaker Task Light */}
      <pointLight
        position={[-9, 3.5, 10]}
        intensity={SCENE_LIGHTING_CONFIG.mudSystemLightIntensity}
        distance={20}
        color="#fde047"
        decay={2}
      />

      {/* Generator Skid Work Light */}
      <pointLight
        position={[11, 2.5, -6]}
        intensity={SCENE_LIGHTING_CONFIG.genSkidLightIntensity}
        distance={18}
        color="#fde68a"
        decay={2}
      />

      {/* Flare Pit Point Light */}
      <pointLight
        position={[-17, 3, -13]}
        intensity={SCENE_LIGHTING_CONFIG.flareLightIntensity}
        distance={16}
        color="#f97316"
        decay={2}
      />

      {/* ================= 2. POST-PROCESSING PIPELINE ================= */}
      {enablePostProcessing && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          {/* Subtle SSAO: localized contact shadows at joints and skids without darkening open surfaces */}
          <N8AO
            aoRadius={SCENE_LIGHTING_CONFIG.ssaoRadius}
            intensity={SCENE_LIGHTING_CONFIG.ssaoIntensity}
            distanceFalloff={SCENE_LIGHTING_CONFIG.ssaoDistanceFalloff}
            color={SCENE_LIGHTING_CONFIG.ssaoColor}
          />

          {/* Subtle Bloom: highlights beacons and hot spots without hazing the scene */}
          <Bloom
            luminanceThreshold={SCENE_LIGHTING_CONFIG.bloomThreshold}
            luminanceSmoothing={0.3}
            intensity={SCENE_LIGHTING_CONFIG.bloomIntensity}
            mipmapBlur
          />

          {/* ACES Filmic Tone Mapping with calibrated master exposure */}
          <ToneMapping ref={toneMappingRef} mode={ToneMappingMode.ACES_FILMIC} />

          {/* Minimal Vignette so edges and UI panels remain clean and bright */}
          <Vignette
            darkness={SCENE_LIGHTING_CONFIG.vignetteDarkness}
            offset={SCENE_LIGHTING_CONFIG.vignetteOffset}
          />
        </EffectComposer>
      )}
    </>
  );
};
