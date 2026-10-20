/**
 * Simulation Core Types & Interfaces
 * Pure TypeScript definitions for drilling engineering, well control, and scenarios.
 */

import { LocalizedString } from '../i18n/types';

export interface HydrostaticParams {
  mw: number;   // Mud Weight in ppg
  tvd: number;  // True Vertical Depth in ft
}

export interface HydrostaticResult {
  pressure: number;       // psi
  gradient: number;       // psi/ft
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface PressureGradientParams {
  mw: number; // Mud Weight in ppg
}

export interface PressureGradientResult {
  gradient: number; // psi/ft
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface RequiredMudWeightParams {
  pForm: number;   // Formation Pressure in psi
  tvd: number;     // True Vertical Depth in ft
  margin?: number; // Safety overbalance margin in psi (default: 0)
}

export interface RequiredMudWeightResult {
  requiredMudWeight: number; // ppg (rounded to 2 decimals)
  balanceMudWeight: number;  // ppg (exact zero-margin balance)
  targetPressure: number;    // psi (pForm + margin)
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface BottomHolePressureParams {
  mw: number;   // Mud Weight in ppg
  tvd: number;  // True Vertical Depth in ft
  apl?: number; // Annular Pressure Loss in psi (circulating friction)
}

export interface BottomHolePressureResult {
  staticBhp: number;   // psi
  dynamicBhp: number;  // psi (static + apl)
  apl: number;         // psi
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface FormationPressureParams {
  omw: number;   // Original Mud Weight in ppg
  tvd: number;   // True Vertical Depth in ft
  sidpp: number; // Shut-in Drill Pipe Pressure in psi
}

export interface FormationPressureResult {
  formationPressure: number; // psi
  hydrostaticPressure: number; // psi
  killMudWeight: number;      // ppg
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface OverbalanceParams {
  bhp: number;   // Bottom Hole Pressure in psi
  pForm: number; // Formation Pore Pressure in psi
}

export interface OverbalanceResult {
  differentialPressure: number; // psi (bhp - pForm)
  isOverbalance: boolean;
  status: 'OVERBALANCE' | 'UNDERBALANCE' | 'EXACT_BALANCE';
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
  warning?: string;
}

export interface EcdParams {
  mw: number;   // Mud Weight in ppg
  apl: number;  // Annular Pressure Loss in psi
  tvd: number;  // True Vertical Depth in ft
}

export interface EcdResult {
  ecd: number;       // ppg (Equivalent Circulating Density)
  ecdDelta: number;  // ppg addition from circulation
  formula: string;
  steps: string[];
  explanation: string;
  drillingSignificance: string;
}

export interface KillSheetInputParams {
  tvd: number;                         // True Vertical Depth (ft)
  originalMudWeight: number;           // Original Mud Weight (ppg)
  sidpp: number;                       // Shut-in Drill Pipe Pressure (psi)
  sicp: number;                        // Shut-in Casing Pressure (psi)
  pitGain: number;                     // Pit volume increase (bbl)
  scrPressure: number;                 // Slow Circulating Rate pressure (psi)
  casingShoeTvd: number;               // Casing shoe TVD (ft)
  lotMudWeight: number;                // Leak-Off Test equivalent mud weight (ppg)
  annularCapacityDCOpenHole?: number;  // Annular capacity (bbl/ft), default 0.029
}

export interface KillSheetCalculationResult {
  formationPressure: number;    // psi
  killMudWeight: number;        // ppg
  icp: number;                  // Initial Circulating Pressure (psi)
  fcp: number;                  // Final Circulating Pressure (psi)
  maasp: number;                // Maximum Allowable Annular Surface Pressure (psi)
  casingShoePressure: number;   // psi
  influxHeight: number;         // ft
  influxDensity: number;        // ppg
  influxType: string;
  kickTolerance: number;        // ppg
}

export interface ScenarioTelemetry {
  standpipePressure: number; // psi
  pitVolume: number;         // bbl
  flowOut: number;           // %
  rop: number;               // ft/hr
  hookLoad: number;          // klbs
  mudWeight: number;         // ppg
  statusAlert: LocalizedString | string;
}

export interface ScenarioChoice {
  id: string;
  text: LocalizedString | string;
  outcomeType: 'safe' | 'warning' | 'critical';
  consequence: LocalizedString | string;
  explanation: LocalizedString | string;
  telemetryChange?: Partial<ScenarioTelemetry>;
  scoreChange: number;
  nextStepId?: string;
}

export interface ScenarioStep {
  id: string;
  situation: LocalizedString | string;
  observedData: ScenarioTelemetry;
  choices: ScenarioChoice[];
}

export interface DrillingScenario {
  id: string;
  title: LocalizedString | string;
  turkishTitle?: string;
  difficulty: 'Başlangıç' | 'Orta' | 'Zor' | 'Beginner' | 'Intermediate' | 'Advanced';
  summary: LocalizedString | string;
  initialConditions: {
    depth: number;       // ft
    tvd: number;         // ft
    holeSize: number;    // in
    drillCollarLength: number;
    mudWeight: number;   // ppg
    formation: LocalizedString | string;
  };
  equipmentIdFocus?: string;
  initialStepId: string;
  steps: Record<string, ScenarioStep>;
}

export interface ScenarioEngineState {
  scenarioId: string;
  currentStepId: string;
  score: number;
  lastChoice: ScenarioChoice | null;
  history: Array<{
    step: ScenarioStep;
    choice: ScenarioChoice;
  }>;
  isFinished: boolean;
}
