import { describe, it, expect } from 'vitest';
import {
  calculateHydrostaticPressure,
  calculatePressureGradient,
  calculateRequiredMudWeight,
  calculateBottomHolePressure,
  calculateFormationPressureFromKick,
  calculateOverbalance,
  calculateEcd,
  DRILLING_CONSTANTS
} from '../drillingCalculations';

describe('Drilling Calculations Module', () => {
  it('correctly calculates Hydrostatic Pressure (P = 0.052 × MW × TVD)', () => {
    // 10 ppg mud at 5000 ft TVD -> 0.052 * 10 * 5000 = 2600 psi
    const res1 = calculateHydrostaticPressure({ mw: 10, tvd: 5000 });
    expect(res1.pressure).toBe(2600);
    expect(res1.gradient).toBe(0.52);

    // 12.5 ppg mud at 10,000 ft TVD -> 0.052 * 12.5 * 10000 = 6500 psi
    const res2 = calculateHydrostaticPressure({ mw: 12.5, tvd: 10000 });
    expect(res2.pressure).toBe(6500);
    expect(res2.gradient).toBe(0.65);
  });

  it('correctly calculates Pressure Gradient (G = 0.052 × MW)', () => {
    // 11.5 ppg -> 0.052 * 11.5 = 0.598 psi/ft
    const res = calculatePressureGradient({ mw: 11.5 });
    expect(res.gradient).toBe(0.598);

    // Freshwater (8.33 ppg) -> ~0.433 psi/ft
    const waterRes = calculatePressureGradient({ mw: DRILLING_CONSTANTS.FRESHWATER_DENSITY });
    expect(waterRes.gradient).toBeCloseTo(0.433, 2);
  });

  it('correctly calculates Required Mud Weight with and without overbalance margin', () => {
    // 4500 psi pore pressure at 8000 ft TVD with 200 psi margin
    // Target P = 4700 psi -> 4700 / (0.052 * 8000) = 4700 / 416 = 11.298 ~ 11.3 ppg
    const resWithMargin = calculateRequiredMudWeight({ pForm: 4500, tvd: 8000, margin: 200 });
    expect(resWithMargin.targetPressure).toBe(4700);
    expect(resWithMargin.requiredMudWeight).toBe(11.3);
    expect(resWithMargin.balanceMudWeight).toBe(10.82);

    // Zero margin
    const resZeroMargin = calculateRequiredMudWeight({ pForm: 4500, tvd: 8000, margin: 0 });
    expect(resZeroMargin.requiredMudWeight).toBe(10.82);
    expect(resZeroMargin.balanceMudWeight).toBe(10.82);
  });

  it('correctly calculates Static and Dynamic Bottom Hole Pressure (BHP)', () => {
    // MW = 12.0 ppg, TVD = 9500 ft, APL = 250 psi
    // Static BHP = 0.052 * 12.0 * 9500 = 5928 psi
    // Dynamic BHP = 5928 + 250 = 6178 psi
    const res = calculateBottomHolePressure({ mw: 12.0, tvd: 9500, apl: 250 });
    expect(res.staticBhp).toBe(5928);
    expect(res.dynamicBhp).toBe(6178);
    expect(res.apl).toBe(250);
  });

  it('correctly calculates Formation Pressure from Kick data (SIDPP)', () => {
    // OMW = 9.8 ppg, TVD = 7200 ft, SIDPP = 420 psi
    // Hydrostatic = 0.052 * 9.8 * 7200 = 3669.12 -> 3669 psi
    // Formation Pressure = 3669 + 420 = 4089 psi
    // Kill Mud Weight = 9.8 + 420 / (0.052 * 7200) = 9.8 + 1.1218 = 10.92 ppg
    const res = calculateFormationPressureFromKick({ omw: 9.8, tvd: 7200, sidpp: 420 });
    expect(res.hydrostaticPressure).toBe(3669);
    expect(res.formationPressure).toBe(4089);
    expect(res.killMudWeight).toBe(10.92);
  });

  it('correctly identifies Overbalance and Underbalance situations', () => {
    // Overbalance
    const overRes = calculateOverbalance({ bhp: 5200, pForm: 4950 });
    expect(overRes.differentialPressure).toBe(250);
    expect(overRes.isOverbalance).toBe(true);
    expect(overRes.status).toBe('OVERBALANCE');
    expect(overRes.warning).toBeUndefined();

    // Underbalance
    const underRes = calculateOverbalance({ bhp: 4700, pForm: 4950 });
    expect(underRes.differentialPressure).toBe(-250);
    expect(underRes.isOverbalance).toBe(false);
    expect(underRes.status).toBe('UNDERBALANCE');
    expect(underRes.warning).toBeDefined();
  });

  it('correctly calculates Equivalent Circulating Density (ECD)', () => {
    // MW = 10.5 ppg, APL = 320 psi, TVD = 8500 ft
    // Delta = 320 / (0.052 * 8500) = 320 / 442 = 0.72398 -> 0.72 ppg
    // ECD = 10.5 + 0.72 = 11.22 ppg
    const res = calculateEcd({ mw: 10.5, apl: 320, tvd: 8500 });
    expect(res.ecdDelta).toBe(0.72);
    expect(res.ecd).toBe(11.22);
  });
});
