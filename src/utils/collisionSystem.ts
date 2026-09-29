/**
 * collisionSystem:
 * Simplified high-performance 2.5D AABB sliding collision resolution for PetroSim Walk mode.
 *
 * Prevents the player from clipping through solid drilling structures:
 * - Derrick Substructure Columns & Mast Corners
 * - Triplex Mud Pumps & Mud Tanks
 * - Containers & Trailers (Mud Logging, Company Man, Generator, VFD, Camp)
 * - Pipe Racks & Bolsters
 * - BOP Stack & Choke Manifold
 * - Rig Floor perimeter safety handrails (preventing falling off edges except at stairs/V-door)
 */

export interface CollisionBox {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY?: number;
  maxY?: number;
}

export const SITE_COLLISION_BOXES: CollisionBox[] = [
  // 1. Substructure 4 Main Support Columns (Ground level y = -1.9 to 3.4)
  { id: 'sub-col-nw', minX: -3.45, maxX: -2.55, minZ: -3.45, maxZ: -2.55, minY: -2.0, maxY: 3.3 },
  { id: 'sub-col-ne', minX: 2.55, maxX: 3.45, minZ: -3.45, maxZ: -2.55, minY: -2.0, maxY: 3.3 },
  { id: 'sub-col-sw', minX: -3.45, maxX: -2.55, minZ: 2.55, maxZ: 3.45, minY: -2.0, maxY: 3.3 },
  { id: 'sub-col-se', minX: 2.55, maxX: 3.45, minZ: 2.55, maxZ: 3.45, minY: -2.0, maxY: 3.3 },

  // 2. BOP Stack (Cellar Pit & Ground Level beneath Substructure)
  { id: 'bop-stack', minX: -1.2, maxX: 1.2, minZ: -1.2, maxZ: 1.2, minY: -2.5, maxY: 2.5 },

  // 3. Choke Manifold Skid (Ground Level, East of Substructure)
  { id: 'choke-manifold', minX: 2.5, maxX: 5.1, minZ: -0.2, maxZ: 1.2, minY: -1.9, maxY: 0.5 },

  // 4. Mud Pumps (Ground Level, West of Substructure)
  { id: 'mud-pump-1', minX: -12.6, maxX: -7.4, minZ: -3.9, maxZ: -1.1, minY: -1.9, maxY: 1.5 },
  { id: 'mud-pump-2', minX: -12.6, maxX: -7.4, minZ: 0.1, maxZ: 2.9, minY: -1.9, maxY: 1.5 },

  // 5. Mud Tanks Tank Body (Except walkway on top)
  { id: 'mud-tanks-body', minX: -11.6, maxX: -6.4, minZ: 3.2, maxZ: 9.8, minY: -1.9, maxY: 1.2 },

  // 6. Shale Shakers Unit (West of Catwalk)
  { id: 'shale-shakers', minX: -10.7, maxX: -6.3, minZ: 10.5, maxZ: 13.5, minY: -1.9, maxY: 3.0 },

  // 7. Poor Boy Degasser Skid
  { id: 'poor-boy-degasser', minX: -6.8, maxX: -5.6, minZ: 3.2, maxZ: 4.4, minY: -1.9, maxY: 6.0 },

  // 8. Diesel Generators Skid
  { id: 'generators-skid', minX: 8.4, maxX: 13.6, minZ: -9.6, maxZ: -2.4, minY: -1.9, maxY: 2.0 },

  // 9. Mud Logging Trailer
  { id: 'mud-logging-cabin', minX: 7.2, maxX: 10.8, minZ: 0.5, maxZ: 5.5, minY: -1.9, maxY: 2.5 },

  // 10. Company Man & Toolpusher Trailer
  { id: 'company-man-trailer', minX: 7.7, maxX: 11.3, minZ: 7.0, maxZ: 12.0, minY: -1.9, maxY: 2.5 },

  // 11. VFD / SCR Electrical House
  { id: 'vfd-house', minX: 8.7, maxX: 13.3, minZ: -15.5, maxZ: -9.5, minY: -1.9, maxY: 3.0 },

  // 12. Bulk Diesel Fuel Tank & Dike
  { id: 'diesel-fuel-tank', minX: 14.5, maxX: 19.5, minZ: -12.2, maxZ: -3.8, minY: -1.9, maxY: 3.0 },

  // 13. Pipe Racks (Tubular storage banks left & right of catwalk)
  { id: 'piperack-west', minX: -7.4, maxX: -3.0, minZ: 11.4, maxZ: 24.8, minY: -1.9, maxY: 1.5 },
  { id: 'piperack-east', minX: 3.0, maxX: 7.4, minZ: 11.4, maxZ: 24.8, minY: -1.9, maxY: 1.5 },

  // 14. Camp Zone Office Container
  { id: 'camp-office', minX: 14.8, maxX: 20.2, minZ: -11.8, maxZ: -8.2, minY: -1.9, maxY: 2.5 },

  // 15. Camp Sleeper / Accommodation Cabins
  { id: 'camp-cabins', minX: 20.0, maxX: 26.0, minZ: -19.5, maxZ: -10.5, minY: -1.9, maxY: 2.5 },

  // 16. Rig Floor Equipment (When on elevated floor y >= 3.0m)
  // Doghouse (Driller Cabin)
  { id: 'rf-doghouse', minX: -4.3, maxX: -1.7, minZ: -3.3, maxZ: 0.3, minY: 3.2, maxY: 6.5 },
  // Drawworks Skid
  { id: 'rf-drawworks', minX: -1.3, maxX: 1.3, minZ: -4.4, maxZ: -2.4, minY: 3.2, maxY: 6.5 },
  // Derrick 4 Mast Columns on Rig Floor
  { id: 'mast-leg-nw', minX: -2.6, maxX: -2.1, minZ: -2.6, maxZ: -2.1, minY: 3.2, maxY: 30.0 },
  { id: 'mast-leg-ne', minX: 2.1, maxX: 2.6, minZ: -2.6, maxZ: -2.1, minY: 3.2, maxY: 30.0 },
  { id: 'mast-leg-sw', minX: -2.6, maxX: -2.1, minZ: 2.1, maxZ: 2.6, minY: 3.2, maxY: 30.0 },
  { id: 'mast-leg-se', minX: 2.1, maxX: 2.6, minZ: 2.1, maxZ: 2.6, minY: 3.2, maxY: 30.0 },

  // 17. Rig Floor Perimeter Handrails (Keep player on floor, openings at stairs & V-door)
  // North edge handrail
  { id: 'rf-rail-north', minX: -4.6, maxX: 4.6, minZ: -4.6, maxZ: -4.3, minY: 3.2, maxY: 5.5 },
  // West edge handrail
  { id: 'rf-rail-west', minX: -4.6, maxX: -4.3, minZ: -4.6, maxZ: 4.6, minY: 3.2, maxY: 5.5 },
  // East edge handrail (split around stairs opening between z: -2.6 and -1.8)
  { id: 'rf-rail-east-n', minX: 4.3, maxX: 4.6, minZ: -4.6, maxZ: -2.6, minY: 3.2, maxY: 5.5 },
  { id: 'rf-rail-east-s', minX: 4.3, maxX: 4.6, minZ: -1.8, maxZ: 4.6, minY: 3.2, maxY: 5.5 },
  // South edge handrail (split around V-door opening between x: -1.3 and 1.3)
  { id: 'rf-rail-south-w', minX: -4.6, maxX: -1.3, minZ: 4.3, maxZ: 4.6, minY: 3.2, maxY: 5.5 },
  { id: 'rf-rail-south-e', minX: 1.3, maxX: 4.6, minZ: 4.3, maxZ: 4.6, minY: 3.2, maxY: 5.5 }
];

/**
 * Resolves 2D circular player collision against all active 3D AABB boxes.
 * Pushes the player outward along the minimum penetration axis so player smoothly slides along walls.
 */
export function resolveCollisions(
  playerX: number,
  playerZ: number,
  playerY: number,
  radius: number = 0.42
): { x: number; z: number } {
  let resolvedX = playerX;
  let resolvedZ = playerZ;

  for (let i = 0; i < SITE_COLLISION_BOXES.length; i++) {
    const box = SITE_COLLISION_BOXES[i];

    // Check vertical overlap if box defines Y bounds
    if (box.minY !== undefined && playerY < box.minY) continue;
    if (box.maxY !== undefined && playerY > box.maxY) continue;

    // Find closest point on AABB to circle center
    const closestX = Math.max(box.minX, Math.min(box.maxX, resolvedX));
    const closestZ = Math.max(box.minZ, Math.min(box.maxZ, resolvedZ));

    const dx = resolvedX - closestX;
    const dz = resolvedZ - closestZ;
    const distSq = dx * dx + dz * dz;

    if (distSq < radius * radius) {
      const dist = Math.sqrt(distSq);
      if (dist > 0.0001) {
        // Push circle along normal out of box
        const pushDist = radius - dist;
        resolvedX += (dx / dist) * pushDist;
        resolvedZ += (dz / dist) * pushDist;
      } else {
        // Center is inside box - push out along shallowest axis
        const toMinX = Math.abs(resolvedX - box.minX);
        const toMaxX = Math.abs(box.maxX - resolvedX);
        const toMinZ = Math.abs(resolvedZ - box.minZ);
        const toMaxZ = Math.abs(box.maxZ - resolvedZ);

        const minPen = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
        if (minPen === toMinX) resolvedX = box.minX - radius;
        else if (minPen === toMaxX) resolvedX = box.maxX + radius;
        else if (minPen === toMinZ) resolvedZ = box.minZ - radius;
        else resolvedZ = box.maxZ + radius;
      }
    }
  }

  return { x: resolvedX, z: resolvedZ };
}
