/**
 * terrainElevation:
 * Determines the surface ground/deck elevation (in meters) for any (x, z) coordinate
 * across the onshore drilling location.
 *
 * Supported walkable levels:
 * 1. Engineered Caliche/Gravel Location Pad (y = -1.90m)
 * 2. Catwalk Walkway Deck (y = -1.20m, z: 9.5 to 24.5)
 * 3. Catwalk South End Access Steps (z: 24.5 to 26.0, slope -1.9m to -1.2m)
 * 4. Sloped V-Door Pipe Ramp (z: 4.5 to 9.5, slope -1.2m to 3.45m)
 * 5. Elevated Substructure Rig Floor (y = 3.45m, x: -4.5 to 4.5, z: -4.5 to 4.5)
 * 6. Rig Floor East Access Staircase (x: 4.0 to 5.2, z: -7.1 to -2.1, slope -1.9m to 3.45m)
 * 7. Mud Tank Walkway Deck (y = 1.30m, x: -9.8 to -8.2, z: 3.3 to 9.7)
 * 8. Mud Tank South Access Steps (x: -9.8 to -8.2, z: 9.7 to 11.2, slope -1.9m to 1.3m)
 */

export function getSurfaceElevation(x: number, z: number, currentSurfaceY: number): number {
  // 1. Rig Floor East Access Staircase
  // Slopes from ground (-1.9m) at z = -7.1 up to rig floor entrance (3.45m) at z = -2.1
  if (x >= 4.0 && x <= 5.2 && z >= -7.15 && z <= -2.05) {
    const t = (z - (-7.1)) / 5.0;
    const clampedT = Math.max(0, Math.min(1, t));
    return -1.9 + clampedT * (3.45 - (-1.9));
  }

  // 2. V-Door Pipe Ramp
  // Connects catwalk (-1.2m) at z = 9.5 up to rig floor V-door entrance (3.45m) at z = 4.5
  if (x >= -1.25 && x <= 1.25 && z >= 4.45 && z <= 9.55) {
    const t = (9.5 - z) / 5.0;
    const clampedT = Math.max(0, Math.min(1, t));
    return -1.2 + clampedT * (3.45 - (-1.2));
  }

  // 3. Elevated Rig Floor Deck Platform
  // If player is on or near elevated level (currentSurfaceY > 1.8) and within rig floor perimeter
  if (x >= -4.5 && x <= 4.5 && z >= -4.5 && z <= 4.5) {
    if (currentSurfaceY > 1.8) {
      return 3.45;
    }
  }

  // 4. Catwalk Walkway Platform
  // Long pipe handling deck running south from V-door
  if (x >= -1.25 && x <= 1.25 && z > 9.55 && z <= 24.5) {
    return -1.2;
  }

  // 5. Catwalk South End Access Steps (from ground up to catwalk)
  if (x >= -1.25 && x <= 1.25 && z > 24.5 && z <= 26.0) {
    const t = (26.0 - z) / 1.5;
    const clampedT = Math.max(0, Math.min(1, t));
    return -1.9 + clampedT * (-1.2 - (-1.9));
  }

  // 6. Mud Tank Walkway Deck
  if (x >= -9.8 && x <= -8.2 && z >= 3.3 && z <= 9.7) {
    return 1.3;
  }

  // 7. Mud Tank South Access Steps
  if (x >= -9.8 && x <= -8.2 && z > 9.7 && z <= 11.2) {
    const t = (11.2 - z) / 1.5;
    const clampedT = Math.max(0, Math.min(1, t));
    return -1.9 + clampedT * (1.3 - (-1.9));
  }

  // Default: Standard compacted gravel drilling pad level
  return -1.9;
}
