export type AppMode = 
  | 'explore'      // Keşfet
  | 'safety'       // Güvenlik
  | 'engineering'  // Mühendislik
  | 'scenarios'    // Sondaj Senaryoları
  | 'wellcontrol'  // Kuyu Kontrolü
  | 'progress'     // İlerleme & Performans
  | 'instructor';  // Eğitmen Paneli

export type CameraViewMode = 'orbit' | 'walk';
export type WalkPerspective = 'first-person' | 'third-person';

export interface NearbyEquipmentInfo {
  id: string;
  name: string;
  turkishName: string;
  distance: number;
}

export type EquipmentCategory = 
  | 'hoisting'     // Kaldırma Sistemi
  | 'rotating'     // Döndürme Sistemi
  | 'circulating'  // Dolaşım (Sirkülasyon) Sistemi
  | 'wellcontrol'  // Kuyu Kontrol Sistemi (BOP)
  | 'power'        // Güç Sistemi
  | 'monitoring'   // İzleme & Kayıt Sistemi
  | 'surface';     // Yüzey Tesisleri

export interface EquipmentItem {
  id: string;
  name: string;
  turkishName: string;
  category: EquipmentCategory;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: string;
  technicalSpecs: { [key: string]: string };
  workingPrinciple: string;
  drillingRole: string;
  safetyHazards: string[];
  maintenanceChecks: string[];
  systemConnection: string;
}

export interface SafetyQuestion {
  id: string;
  category: 'ppe' | 'h2s' | 'fire' | 'emergency' | 'heights' | 'loto' | 'confined' | 'chemicals' | 'rigfloor' | 'environmental';
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  equipmentFocusId?: string;
  difficulty: 'Temel' | 'Orta' | 'İleri';
  regulationRef?: string;
}

export interface CalculationField {
  label: string;
  variable: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
}

export interface CalculationModule {
  id: string;
  title: string;
  turkishTitle: string;
  formula: string;
  description: string;
  fields: CalculationField[];
  calculate: (inputs: Record<string, number>) => {
    result: number;
    unit: string;
    steps: string[];
    explanation: string;
    drillingSignificance: string;
    warning?: string;
  };
}

export interface ScenarioChoice {
  id: string;
  text: string;
  outcomeType: 'safe' | 'warning' | 'critical';
  consequence: string;
  explanation: string;
  telemetryChange?: {
    standpipePressure?: number;
    pitVolume?: number;
    flowOut?: number;
    rop?: number;
    hookLoad?: number;
    mudWeight?: number;
  };
  scoreChange: number;
  nextStepId?: string;
}

export interface ScenarioStep {
  id: string;
  situation: string;
  observedData: {
    standpipePressure: number; // psi
    pitVolume: number;         // bbl
    flowOut: number;           // %
    rop: number;               // ft/hr
    hookLoad: number;          // klbs
    mudWeight: number;         // ppg
    statusAlert: string;
  };
  choices: ScenarioChoice[];
}

export interface DrillingScenario {
  id: string;
  title: string;
  turkishTitle: string;
  difficulty: 'Başlangıç' | 'Orta' | 'Zor';
  summary: string;
  initialConditions: {
    depth: number;       // ft
    tvd: number;         // ft
    holeSize: number;    // in
    drillCollarLength: number;
    mudWeight: number;   // ppg
    formation: string;
  };
  equipmentIdFocus?: string;
  initialStepId: string;
  steps: Record<string, ScenarioStep>;
}

export interface WellControlData {
  tvd: number;              // ft
  measuredDepth: number;    // ft
  originalMudWeight: number;// ppg
  sidpp: number;            // psi (Shut-in drill pipe pressure)
  sicp: number;             // psi (Shut-in casing pressure)
  pitGain: number;          // bbl
  slowCirculatingRate: number; // psi at SCR (e.g. 30 SPM)
  casingShoeTvd: number;    // ft
  lotMudWeight: number;     // ppg (Leak-off test equivalent MW)
}

export interface StudentProgressState {
  completedEquipment: string[];
  safetyScore: number;
  safetyAnswered: Record<string, { answeredIndex: number; isCorrect: boolean }>;
  completedCalculations: string[];
  completedScenarios: Record<string, { score: number; completedAt: string }>;
  wellControlPracticed: boolean;
  completedMissions?: string[];
}

export interface GuidedMission {
  id: string;
  stepNumber: number;
  title: string;
  turkishTitle: string;
  targetEquipmentId: string;
  instruction: string;
  turkishInstruction: string;
  hint: string;
  turkishHint: string;
}
