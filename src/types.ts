import { LocalizedString, OptionalLocalizedString } from './i18n/types';

export type UserRole = 'student' | 'instructor';

export interface UserProfile {
  id: string;
  fullName: string;
  role: UserRole;
  studentNumber?: string;
  title?: string;
  email?: string;
  username?: string;
  classCode?: string;
  createdAt?: string;
}

export type AppMode = 
  | 'explore'                // Keşfet
  | 'safety'                 // Güvenlik
  | 'engineering'            // Mühendislik
  | 'scenarios'              // Sondaj Senaryoları
  | 'quizzes'                // Quizler
  | 'my-assignments'         // Ödevlerim (Öğrenci)
  | 'my-grades'              // Notlarım (Öğrenci)
  | 'wellcontrol'            // Kuyu Kontrolü
  | 'progress'               // İlerleme & Performans
  | 'instructor'             // Eğitmen Paneli (Genel)
  | 'instructor-dashboard'   // Panel (Sınıf İlerlemesi)
  | 'instructor-quizzes'     // Quiz Yönetimi
  | 'instructor-assignments' // Ödev Yönetimi
  | 'instructor-grading'     // Teslimler ve Notlandırma
  | 'instructor-students';   // Öğrenci Listesi

export type CameraViewMode = 'orbit' | 'walk';
export type WalkPerspective = 'first-person' | 'third-person';

export interface NearbyEquipmentInfo {
  id: string;
  name: LocalizedString | string;
  turkishName?: string;
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
  name: LocalizedString | string;
  turkishName?: string;
  category: EquipmentCategory;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: LocalizedString | string;
  shortDescription?: LocalizedString | string;
  referenceStandard?: string;
  referenceBook?: string;
  technicalSpecs: { tr?: Record<string, string>; en?: Record<string, string> } | Record<string, string>;
  workingPrinciple: LocalizedString | string;
  drillingRole: LocalizedString | string;
  safetyHazards: { tr: string[]; en: string[] } | string[];
  maintenanceChecks: { tr: string[]; en: string[] } | string[];
  systemConnection: LocalizedString | string;
}

export type ViewDisplayMode = 'normal' | 'isolate' | 'fade' | 'hide' | 'internals';
export type DownholeOperationPhase = 'drilling' | 'tripping' | 'casing' | 'wellcontrol';

export interface FormationLayer {
  id: string;
  name: LocalizedString;
  depthStart: number; // ft
  depthEnd: number;   // ft
  color: string;
  textColor?: string;
  textureType: 'soil' | 'sandstone' | 'shale' | 'limestone' | 'reservoir' | 'basement';
  description: LocalizedString;
  porePressureGradient: number; // psi/ft
  rockHardness: number;         // 1 to 10
}

export interface SafetyQuestion {
  id: string;
  category: 'ppe' | 'h2s' | 'fire' | 'emergency' | 'heights' | 'loto' | 'confined' | 'chemicals' | 'rigfloor' | 'environmental';
  title: LocalizedString | string;
  question: LocalizedString | string;
  options: { tr: string[]; en: string[] } | string[];
  correctIndex: number;
  explanation: LocalizedString | string;
  equipmentFocusId?: string;
  difficulty: 'Temel' | 'Orta' | 'İleri' | 'Basic' | 'Intermediate' | 'Advanced';
  regulationRef?: string;
}

export interface CalculationField {
  label: LocalizedString | string;
  variable: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: LocalizedString | string;
}

export interface CalculationModule {
  id: string;
  title: LocalizedString | string;
  turkishTitle?: string;
  formula: string;
  description: LocalizedString | string;
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
  text: LocalizedString | string;
  outcomeType: 'safe' | 'warning' | 'critical';
  consequence: LocalizedString | string;
  explanation: LocalizedString | string;
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
  situation: LocalizedString | string;
  observedData: {
    standpipePressure: number; // psi
    pitVolume: number;         // bbl
    flowOut: number;           // %
    rop: number;               // ft/hr
    hookLoad: number;          // klbs
    mudWeight: number;         // ppg
    statusAlert: LocalizedString | string;
  };
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
  title: LocalizedString | string;
  turkishTitle?: string;
  targetEquipmentId: string;
  instruction: LocalizedString | string;
  turkishInstruction?: string;
  hint: LocalizedString | string;
  turkishHint?: string;
}
