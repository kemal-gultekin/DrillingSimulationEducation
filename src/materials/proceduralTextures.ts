import * as THREE from 'three';

/**
 * proceduralTextures.ts:
 * Generates lightweight, shared runtime procedural canvas textures for PetroSim.
 * Zero external asset dependencies, zero network requests, ultra-fast GPU caching.
 */

export interface PetroSimTextures {
  dirtWear: THREE.CanvasTexture;
  metalScratches: THREE.CanvasTexture;
  concreteNoise: THREE.CanvasTexture;
  corrugatedPanel: THREE.CanvasTexture;
  corrugated: THREE.CanvasTexture;
  woodPlank: THREE.CanvasTexture;
  safetyHazard: THREE.CanvasTexture;
  gravelGround: THREE.CanvasTexture;
}

// Cached singletons
let cachedTextures: PetroSimTextures | null = null;

/**
 * Creates a simple deterministic pseudorandom generator for consistent procedural textures
 */
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getSharedProceduralTextures(): PetroSimTextures {
  if (cachedTextures) return cachedTextures;

  if (typeof document === 'undefined') {
    // Fallback for non-browser compilation
    const dummy = new THREE.CanvasTexture({} as HTMLCanvasElement);
    return {
      dirtWear: dummy,
      metalScratches: dummy,
      concreteNoise: dummy,
      corrugatedPanel: dummy,
      corrugated: dummy,
      woodPlank: dummy,
      safetyHazard: dummy,
      gravelGround: dummy,
    };
  }

  // 1. Dirt & Industrial Grime Wear Map (256x256)
  const dirtCanvas = document.createElement('canvas');
  dirtCanvas.width = 256;
  dirtCanvas.height = 256;
  const dirtCtx = dirtCanvas.getContext('2d');
  if (dirtCtx) {
    dirtCtx.fillStyle = '#808080';
    dirtCtx.fillRect(0, 0, 256, 256);
    const rnd = createPrng(12345);
    const imgData = dirtCtx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (rnd() - 0.5) * 65;
      const val = Math.min(255, Math.max(0, 128 + n));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    dirtCtx.putImageData(imgData, 0, 0);

    // Subtle oil/mud splatter splotches
    dirtCtx.fillStyle = 'rgba(40, 35, 30, 0.25)';
    for (let s = 0; s < 18; s++) {
      const x = rnd() * 256;
      const y = rnd() * 256;
      const r = 4 + rnd() * 16;
      dirtCtx.beginPath();
      dirtCtx.arc(x, y, r, 0, Math.PI * 2);
      dirtCtx.fill();
    }
  }
  const dirtWear = new THREE.CanvasTexture(dirtCanvas);
  dirtWear.wrapS = THREE.RepeatWrapping;
  dirtWear.wrapT = THREE.RepeatWrapping;
  dirtWear.repeat.set(4, 4);

  // 2. Micro Metal Scratches & Machining Lines (256x256)
  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = 256;
  metalCanvas.height = 256;
  const metalCtx = metalCanvas.getContext('2d');
  if (metalCtx) {
    metalCtx.fillStyle = '#b0b0b0';
    metalCtx.fillRect(0, 0, 256, 256);
    const rnd = createPrng(67890);
    metalCtx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    metalCtx.lineWidth = 1;
    for (let j = 0; j < 90; j++) {
      const y = rnd() * 256;
      metalCtx.beginPath();
      metalCtx.moveTo(0, y);
      metalCtx.lineTo(256, y + (rnd() - 0.5) * 8);
      metalCtx.stroke();
    }
    metalCtx.strokeStyle = 'rgba(30, 30, 30, 0.18)';
    for (let k = 0; k < 60; k++) {
      const y = rnd() * 256;
      metalCtx.beginPath();
      metalCtx.moveTo(0, y);
      metalCtx.lineTo(256, y + (rnd() - 0.5) * 6);
      metalCtx.stroke();
    }
  }
  const metalScratches = new THREE.CanvasTexture(metalCanvas);
  metalScratches.wrapS = THREE.RepeatWrapping;
  metalScratches.wrapT = THREE.RepeatWrapping;
  metalScratches.repeat.set(2, 6);

  // 3. Concrete Mottled Surface Texture (128x128)
  const concreteCanvas = document.createElement('canvas');
  concreteCanvas.width = 128;
  concreteCanvas.height = 128;
  const concreteCtx = concreteCanvas.getContext('2d');
  if (concreteCtx) {
    concreteCtx.fillStyle = '#787878';
    concreteCtx.fillRect(0, 0, 128, 128);
    const rnd = createPrng(4321);
    const cData = concreteCtx.getImageData(0, 0, 128, 128);
    for (let i = 0; i < cData.data.length; i += 4) {
      const grain = (rnd() - 0.5) * 45;
      const cv = Math.min(255, Math.max(0, 120 + grain));
      cData.data[i] = cv;
      cData.data[i + 1] = cv;
      cData.data[i + 2] = cv;
      cData.data[i + 3] = 255;
    }
    concreteCtx.putImageData(cData, 0, 0);
  }
  const concreteNoise = new THREE.CanvasTexture(concreteCanvas);
  concreteNoise.wrapS = THREE.RepeatWrapping;
  concreteNoise.wrapT = THREE.RepeatWrapping;
  concreteNoise.repeat.set(3, 3);

  // 4. Corrugated Shipping Container Vertical Panel Texture (128x128)
  const corrugateCanvas = document.createElement('canvas');
  corrugateCanvas.width = 128;
  corrugateCanvas.height = 128;
  const corrugateCtx = corrugateCanvas.getContext('2d');
  if (corrugateCtx) {
    corrugateCtx.fillStyle = '#909090';
    corrugateCtx.fillRect(0, 0, 128, 128);
    // Vertical corrugated ridges
    const ribWidth = 16;
    for (let x = 0; x < 128; x += ribWidth) {
      const grad = corrugateCtx.createLinearGradient(x, 0, x + ribWidth, 0);
      grad.addColorStop(0, '#555555');
      grad.addColorStop(0.3, '#d0d0d0');
      grad.addColorStop(0.7, '#888888');
      grad.addColorStop(1, '#444444');
      corrugateCtx.fillStyle = grad;
      corrugateCtx.fillRect(x, 0, ribWidth, 128);
    }
  }
  const corrugatedPanel = new THREE.CanvasTexture(corrugateCanvas);
  corrugatedPanel.wrapS = THREE.RepeatWrapping;
  corrugatedPanel.wrapT = THREE.RepeatWrapping;
  corrugatedPanel.repeat.set(6, 1);

  // 5. Timber Planking & Wood Grain Texture (128x128)
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 128;
  woodCanvas.height = 128;
  const woodCtx = woodCanvas.getContext('2d');
  if (woodCtx) {
    woodCtx.fillStyle = '#6b4f35';
    woodCtx.fillRect(0, 0, 128, 128);
    const rnd = createPrng(9988);
    woodCtx.strokeStyle = 'rgba(35, 20, 10, 0.45)';
    woodCtx.lineWidth = 1.5;
    for (let y = 0; y < 128; y += 32) {
      // Plank division line
      woodCtx.beginPath();
      woodCtx.moveTo(0, y);
      woodCtx.lineTo(128, y);
      woodCtx.stroke();
    }
    woodCtx.strokeStyle = 'rgba(215, 175, 130, 0.2)';
    woodCtx.lineWidth = 1;
    for (let k = 0; k < 40; k++) {
      const y = rnd() * 128;
      woodCtx.beginPath();
      woodCtx.moveTo(0, y);
      woodCtx.lineTo(128, y + (rnd() - 0.5) * 4);
      woodCtx.stroke();
    }
  }
  const woodPlank = new THREE.CanvasTexture(woodCanvas);
  woodPlank.wrapS = THREE.RepeatWrapping;
  woodPlank.wrapT = THREE.RepeatWrapping;
  woodPlank.repeat.set(2, 4);

  // 6. 45-Degree Industrial Yellow-Black Safety Stripe (128x128)
  const stripeCanvas = document.createElement('canvas');
  stripeCanvas.width = 128;
  stripeCanvas.height = 128;
  const stripeCtx = stripeCanvas.getContext('2d');
  if (stripeCtx) {
    stripeCtx.fillStyle = '#eab308';
    stripeCtx.fillRect(0, 0, 128, 128);
    stripeCtx.fillStyle = '#0f172a';
    const stripeW = 24;
    for (let i = -128; i < 256; i += stripeW * 2) {
      stripeCtx.beginPath();
      stripeCtx.moveTo(i, 0);
      stripeCtx.lineTo(i + stripeW, 0);
      stripeCtx.lineTo(i + stripeW + 128, 128);
      stripeCtx.lineTo(i + 128, 128);
      stripeCtx.closePath();
      stripeCtx.fill();
    }
  }
  const safetyHazard = new THREE.CanvasTexture(stripeCanvas);
  safetyHazard.wrapS = THREE.RepeatWrapping;
  safetyHazard.wrapT = THREE.RepeatWrapping;
  safetyHazard.repeat.set(4, 1);

  // 7. Engineered Caliche / Crushed Gravel Ground Texture (256x256)
  // High-frequency aggregate noise & speckling tuned to be crisp at default camera view (18x repetition)
  const gravelCanvas = document.createElement('canvas');
  gravelCanvas.width = 256;
  gravelCanvas.height = 256;
  const gravelCtx = gravelCanvas.getContext('2d');
  if (gravelCtx) {
    gravelCtx.fillStyle = '#b8b0a2';
    gravelCtx.fillRect(0, 0, 256, 256);
    const rnd = createPrng(98765);
    const gData = gravelCtx.getImageData(0, 0, 256, 256);
    const d = gData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n1 = (rnd() - 0.5) * 55;
      const n2 = (rnd() - 0.5) * 40;
      const v = Math.min(255, Math.max(0, 185 + n1 + n2));
      d[i] = Math.min(255, Math.max(0, v + 8));
      d[i + 1] = Math.min(255, Math.max(0, v + 2));
      d[i + 2] = Math.min(255, Math.max(0, v - 8));
      d[i + 3] = 255;
    }
    gravelCtx.putImageData(gData, 0, 0);

    // Scattered darker crushed gravel pebbles
    gravelCtx.fillStyle = 'rgba(65, 58, 48, 0.42)';
    for (let p = 0; p < 220; p++) {
      const px = rnd() * 256;
      const py = rnd() * 256;
      const pr = 1.0 + rnd() * 2.2;
      gravelCtx.beginPath();
      gravelCtx.arc(px, py, pr, 0, Math.PI * 2);
      gravelCtx.fill();
    }

    // Scattered light limestone chips
    gravelCtx.fillStyle = 'rgba(245, 242, 235, 0.65)';
    for (let p = 0; p < 160; p++) {
      const px = rnd() * 256;
      const py = rnd() * 256;
      const pr = 0.8 + rnd() * 2.0;
      gravelCtx.beginPath();
      gravelCtx.arc(px, py, pr, 0, Math.PI * 2);
      gravelCtx.fill();
    }
  }
  const gravelGround = new THREE.CanvasTexture(gravelCanvas);
  gravelGround.wrapS = THREE.RepeatWrapping;
  gravelGround.wrapT = THREE.RepeatWrapping;
  gravelGround.repeat.set(18, 18);

  const textures: PetroSimTextures = {
    dirtWear,
    metalScratches,
    concreteNoise,
    corrugatedPanel,
    corrugated: corrugatedPanel,
    woodPlank,
    safetyHazard,
    gravelGround,
  };

  cachedTextures = textures;
  return textures;
}

export const getPBRTextures = getSharedProceduralTextures;
