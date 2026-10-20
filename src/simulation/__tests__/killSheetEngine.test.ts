import { describe, it, expect } from 'vitest';
import { calculateKillSheet } from '../killSheetEngine';

describe('Kill Sheet Engine Module', () => {
  const standardKickParams = {
    tvd: 10000,
    originalMudWeight: 10.0,
    sidpp: 500,
    sicp: 750,
    pitGain: 20,
    scrPressure: 600,
    casingShoeTvd: 7000,
    lotMudWeight: 14.0,
    annularCapacityDCOpenHole: 0.029
  };

  it('calculates accurate formation pressure from SIDPP', () => {
    // pHyd = 0.052 * 10.0 * 10000 = 5200 psi
    // Formation Pressure = 5200 + 500 = 5700 psi
    const result = calculateKillSheet(standardKickParams);
    expect(result.formationPressure).toBe(5700);
  });

  it('calculates accurate Kill Mud Weight (KMW)', () => {
    // KMW = 10.0 + (500 / (0.052 * 10000)) = 10.0 + 0.9615 = 10.96 ppg
    const result = calculateKillSheet(standardKickParams);
    expect(result.killMudWeight).toBe(10.96);
  });

  it('calculates Initial Circulating Pressure (ICP)', () => {
    // ICP = SIDPP + SCR = 500 + 600 = 1100 psi
    const result = calculateKillSheet(standardKickParams);
    expect(result.icp).toBe(1100);
  });

  it('calculates Final Circulating Pressure (FCP)', () => {
    // FCP = SCR * (KMW / OMW) = 600 * (10.96 / 10.0) = 657.6 -> 658 psi
    const result = calculateKillSheet(standardKickParams);
    expect(result.fcp).toBe(658);
  });

  it('calculates MAASP (Maximum Allowable Annular Surface Pressure)', () => {
    // MAASP = (LOT - OMW) * 0.052 * CasingShoeTVD
    // MAASP = (14.0 - 10.0) * 0.052 * 7000 = 4.0 * 364 = 1456 psi
    const result = calculateKillSheet(standardKickParams);
    expect(result.maasp).toBe(1456);
  });

  it('estimates influx height and detects gas influx', () => {
    // Influx Height = pitGain / annularCapacity = 20 / 0.029 = 689.65 -> 690 ft
    // SICP - SIDPP = 750 - 500 = 250 psi
    // Influx Density = 10.0 - (250 / (0.052 * 690)) = 10.0 - 6.967 = 3.03 ppg (~oil/gas boundary)
    const result = calculateKillSheet(standardKickParams);
    expect(result.influxHeight).toBe(690);
    expect(result.influxDensity).toBeGreaterThan(0);
    expect(typeof result.influxType).toBe('string');
  });

  it('detects methane/gas influx correctly when density is low', () => {
    // Higher SICP gives much lower density
    const gasKick = {
      ...standardKickParams,
      sicp: 850 // bigger difference (350 psi)
    };
    const result = calculateKillSheet(gasKick);
    expect(result.influxDensity).toBeLessThan(3.0);
    expect(result.influxType).toContain('Gaz');
  });

  it('calculates positive Kick Tolerance', () => {
    const result = calculateKillSheet(standardKickParams);
    expect(result.kickTolerance).toBeGreaterThan(0);
  });
});
