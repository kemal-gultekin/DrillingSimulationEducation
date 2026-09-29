import * as THREE from 'three';
import { getSharedProceduralTextures, PetroSimTextures } from './proceduralTextures';

/**
 * materialLibrary.ts:
 * Centralized PBR material presets for PetroSim.
 * Assigns realistic physical roughness, metalness, and procedural wear maps
 * based on drilling equipment material types.
 */

export const PBR_PRESETS = {
  // Painted structural steel (derrick mast, substructure columns, rig floor, container frames)
  PAINTED_STEEL: {
    metalness: 0.35,
    roughness: 0.5,
  },
  // Derrick mast lattice & galvanized steel
  DERRICK_STEEL: {
    metalness: 0.65,
    roughness: 0.32,
  },
  // Bare/raw heavy metal (drill pipes, collars, casing, BOP body, drawworks drum)
  RAW_METAL: {
    metalness: 0.88,
    roughness: 0.22,
  },
  // Polished chrome (hydraulic rams, cylinder rods, washpipe)
  CHROME_POLISHED: {
    metalness: 0.95,
    roughness: 0.12,
  },
  // Heavy industrial rubber (rotary hose, mud suction hoses, vehicle tires, blow-out seals)
  RUBBER: {
    metalness: 0.02,
    roughness: 0.9,
  },
  RUBBER_HOSE: {
    metalness: 0.05,
    roughness: 0.85,
  },
  // Structural concrete (BOP cellar walls, rig foundation pad, containment curbs)
  CONCRETE: {
    metalness: 0.0,
    roughness: 0.88,
  },
  // Compacted crushed rock & caliche drilling pad
  GRAVEL_SOIL: {
    metalness: 0.02,
    roughness: 0.95,
  },
  // Heavy timber crane mats & pipe rack dunnage
  WOOD_TIMBER: {
    metalness: 0.0,
    roughness: 0.82,
  },
  // High-visibility safety coatings (handrails, crane booms, guardrails, warning cages)
  SAFETY_ENAMEL: {
    metalness: 0.2,
    roughness: 0.35,
  },
  // Drilling mud / viscous slurry fluid in tanks and pits
  DRILLING_MUD: {
    metalness: 0.08,
    roughness: 0.16,
  },
  // Mud logging / Doghouse cabin glass
  CABIN_GLASS: {
    metalness: 0.1,
    roughness: 0.08,
  },
};

/**
 * Returns a slightly varied color hex for repeating identical geometries
 * (e.g. pipe rack joints, oil drums, cable reels, timber planks)
 * so they don't look like identical clones.
 */
export function getVariedHex(baseHex: string, index: number, variance = 0.06): string {
  const col = new THREE.Color(baseHex);
  const hsl = { h: 0, s: 0, l: 0 };
  col.getHSL(hsl);

  // Deterministic oscillation based on index
  const offset = Math.sin(index * 1.7) * variance;
  hsl.l = Math.max(0.05, Math.min(0.95, hsl.l + offset));
  hsl.s = Math.max(0.05, Math.min(0.95, hsl.s + (Math.cos(index * 2.3) * variance * 0.5)));

  col.setHSL(hsl.h, hsl.s, hsl.l);
  return '#' + col.getHexString();
}

/**
 * Helper to get shared procedural texture references
 */
export function getPBRTextures(): PetroSimTextures {
  return getSharedProceduralTextures();
}
