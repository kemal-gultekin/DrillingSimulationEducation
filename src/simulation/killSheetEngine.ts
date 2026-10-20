/**
 * Kill Sheet Engine
 * Implements IADC & IWCF standard well kill calculations:
 * - Formation Pressure (P_form)
 * - Kill Mud Weight (KMW)
 * - Initial Circulating Pressure (ICP)
 * - Final Circulating Pressure (FCP)
 * - Maximum Allowable Annular Surface Pressure (MAASP)
 * - Influx Height & Estimated Density (Gas / Oil / Water discrimination)
 * - Casing Shoe Pressure
 * - Kick Tolerance
 */

import { KillSheetInputParams, KillSheetCalculationResult } from './types';
import { DRILLING_CONSTANTS } from './drillingCalculations';

export function calculateKillSheet(params: KillSheetInputParams): KillSheetCalculationResult {
  const {
    tvd,
    originalMudWeight,
    sidpp,
    sicp,
    pitGain,
    scrPressure,
    casingShoeTvd,
    lotMudWeight,
    annularCapacityDCOpenHole = 0.029 // typical 8.5" hole x 6.5" drill collar (bbl/ft)
  } = params;

  // 1. Formation Pressure = Drill pipe hydrostatic + SIDPP
  const pHyd = DRILLING_CONSTANTS.PRESSURE_FACTOR * originalMudWeight * tvd;
  const formationPressure = Math.round(pHyd + sidpp);

  // 2. Kill Mud Weight = OMW + (SIDPP / (0.052 * TVD))
  const rawKmw = originalMudWeight + (sidpp / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd));
  const killMudWeight = Math.round(rawKmw * 100) / 100;

  // 3. Initial Circulating Pressure (ICP) = SIDPP + SCR Pressure
  const icp = Math.round(sidpp + scrPressure);

  // 4. Final Circulating Pressure (FCP) = SCR Pressure * (KMW / OMW)
  const fcp = Math.round(scrPressure * (killMudWeight / originalMudWeight));

  // 5. MAASP = (LOT - OMW) * 0.052 * CasingShoeTVD
  const maasp = Math.round((lotMudWeight - originalMudWeight) * DRILLING_CONSTANTS.PRESSURE_FACTOR * casingShoeTvd);

  // 6. Influx Height Estimate = Pit Gain / Annular Capacity
  const influxHeight = Math.round(pitGain / annularCapacityDCOpenHole);

  // 7. Influx Density Estimation:
  // (SICP - SIDPP) = (OMW - InfluxDensity) * 0.052 * InfluxHeight
  let influxDensity = 0;
  let influxType = 'Bilinmeyen Akışkan';

  if (influxHeight > 0) {
    const rawInfluxDensity = originalMudWeight - ((sicp - sidpp) / (DRILLING_CONSTANTS.PRESSURE_FACTOR * influxHeight));
    influxDensity = Math.round(rawInfluxDensity * 100) / 100;

    if (influxDensity < 3.0) {
      influxType = 'Gaz (Methane / Natural Gas) - Çok Düşük Yoğunluk & Yüksek Genleşme';
    } else if (influxDensity < 7.0) {
      influxType = 'Petrol / Kondensat (Oil/Condensate Influx)';
    } else {
      influxType = 'Tuzlu Su (Saltwater / Formation Brine)';
    }
  }

  // 8. Casing Shoe Pressure under current shut-in
  const casingShoePressure = Math.round(sicp + (DRILLING_CONSTANTS.PRESSURE_FACTOR * originalMudWeight * casingShoeTvd));

  // 9. Kick Tolerance in ppg
  const kickTolerance = Math.max(0, Math.round(((maasp - sicp) / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd)) * 100) / 100);

  return {
    formationPressure,
    killMudWeight,
    icp,
    fcp,
    maasp,
    casingShoePressure,
    influxHeight,
    influxDensity,
    influxType,
    kickTolerance
  };
}
