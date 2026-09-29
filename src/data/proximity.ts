import { EQUIPMENT_LIST } from './equipment';
import { NearbyEquipmentInfo } from '../types';

export interface EquipmentProximityAnchor {
  id: string;
  x: number;
  z: number;
  radius: number;
  y?: number;
  verticalTolerance?: number;
}

/**
 * Ground-accessible and elevated platform interaction positions, elevations, and interaction radii.
 * Foot elevation levels:
 * - Wellsite ground pad: y = -1.90m
 * - Catwalk: y = -1.20m
 * - Mud tanks walkway / shaker deck: y = 1.30m
 * - Elevated Rig Floor deck: y = 3.45m
 */
export const EQUIPMENT_PROXIMITY_ANCHORS: EquipmentProximityAnchor[] = [
  // Rig Substructure & Wellhead Cellar (Ground level y = -1.90m)
  { id: 'bop-stack', x: 0, z: 0, radius: 3.2, y: -1.9, verticalTolerance: 1.6 },

  // Elevated Rig Floor (Elevated deck y = 3.45m)
  // Must ONLY be inspectable when the player is on the rig floor elevation, NOT from the ground below
  { id: 'drill-string', x: 0, z: 1.8, radius: 2.8, y: 3.45, verticalTolerance: 1.5 },
  { id: 'derrick', x: 0, z: 3.2, radius: 3.5, y: 3.45, verticalTolerance: 1.8 },
  { id: 'drawworks', x: 0, z: -4.5, radius: 3.2, y: 3.45, verticalTolerance: 1.5 },
  { id: 'top-drive', x: 0, z: 0.5, radius: 2.6, y: 3.45, verticalTolerance: 1.5 },
  { id: 'travelling-block', x: 0, z: -1.0, radius: 2.6, y: 3.45, verticalTolerance: 1.5 },
  { id: 'crown-block', x: 0, z: -2.5, radius: 2.6, y: 3.45, verticalTolerance: 1.5 },
  { id: 'doghouse', x: 3.1, z: -2.1, radius: 3.2, y: 3.45, verticalTolerance: 1.5 },

  // Choke Manifold & Standpipe lower manifold (Ground level y = -1.90m)
  { id: 'choke-manifold', x: 3.8, z: 0.5, radius: 3.0, y: -1.9, verticalTolerance: 1.6 },

  // Pipe Racks & Runway (Catwalk deck y = -1.20m or ground pad y = -1.90m)
  { id: 'catwalk-piperacks', x: 0, z: 16.0, radius: 4.8, y: -1.5, verticalTolerance: 1.8 },

  // Mud Circulation & Solids Control
  { id: 'poor-boy-degasser', x: -6.2, z: 3.8, radius: 3.2, y: -1.9, verticalTolerance: 1.8 },
  { id: 'mud-pumps', x: -10.0, z: -1.0, radius: 3.8, y: -1.9, verticalTolerance: 1.8 },
  { id: 'mud-tanks', x: -9.0, z: 6.5, radius: 4.0, y: -0.5, verticalTolerance: 2.5 },
  { id: 'shale-shakers', x: -8.5, z: 12.0, radius: 3.6, y: 0.0, verticalTolerance: 2.5 },
  { id: 'waste-pit', x: -13.0, z: -9.0, radius: 4.2, y: -1.9, verticalTolerance: 1.8 },

  // Power & Support Cabins (Ground level y = -1.90m)
  { id: 'generators', x: 11.0, z: -6.0, radius: 3.8, y: -1.9, verticalTolerance: 1.8 },
  { id: 'mud-logging', x: 9.0, z: 3.0, radius: 3.2, y: -1.9, verticalTolerance: 1.8 },
  { id: 'company-man', x: 9.5, z: 9.5, radius: 3.2, y: -1.9, verticalTolerance: 1.8 },

  // Safety Muster Point (Ground level y = -1.90m)
  { id: 'muster-point', x: 14.0, z: 14.0, radius: 3.5, y: -1.9, verticalTolerance: 1.8 },
];

/**
 * Finds the closest equipment to player's (x, y, z) position within horizontal radius and vertical level tolerance.
 * Ensures equipment on the rig floor (~y = 3.5m) is only inspectable when standing on the rig floor,
 * and equipment on the ground is not inspected from up on the mast/floor.
 * Extremely efficient: 0 object/vector allocations per call.
 */
export function findClosestEquipment(x: number, z: number, y?: number): NearbyEquipmentInfo | null {
  let closestId: string | null = null;
  let minDistanceSq = Infinity;

  for (let i = 0; i < EQUIPMENT_PROXIMITY_ANCHORS.length; i++) {
    const anchor = EQUIPMENT_PROXIMITY_ANCHORS[i];

    // Check vertical level tolerance if player elevation y is provided and anchor defines y
    if (y !== undefined && anchor.y !== undefined) {
      const tolerance = anchor.verticalTolerance ?? 1.5;
      const dy = Math.abs(y - anchor.y);
      if (dy > tolerance) {
        continue;
      }
    }

    const dx = x - anchor.x;
    const dz = z - anchor.z;
    const distSq = dx * dx + dz * dz;
    const radiusSq = anchor.radius * anchor.radius;

    if (distSq <= radiusSq && distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestId = anchor.id;
    }
  }

  if (!closestId) return null;

  const item = EQUIPMENT_LIST.find((eq) => eq.id === closestId);
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    turkishName: item.turkishName,
    distance: Math.sqrt(minDistanceSq)
  };
}
