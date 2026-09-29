export interface StudentRecord {
  id: string;
  studentNumber: string;
  fullName: string;
  avatarUrl?: string;
  overallScore: number;
  completedModulesCount: number;
  quizzesCompleted: number;
  scenariosCompleted: number;
  weakTopics: string[];
  strongTopics: string[];
  lastActive: string;
  assignmentStatus: 'Tamamlandı' | 'Devam Ediyor' | 'Başlanmadı';
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  requiredScenarios: string[];
  targetScore: number;
  enrolledStudentsCount: number;
  submissionRate: number;
}

export const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    studentNumber: 'PETRO-2024-041',
    fullName: 'Kemal Gültekin',
    overallScore: 92,
    completedModulesCount: 6,
    quizzesCompleted: 9,
    scenariosCompleted: 4,
    weakTopics: ['Choke Manifold Basınç Ayarı'],
    strongTopics: ['Hidrostatik Basınç', 'BOP İşletimi', 'H2S Güvenliği'],
    lastActive: 'Bugün, 14:20',
    assignmentStatus: 'Tamamlandı'
  },
  {
    id: 'std-2',
    studentNumber: 'PETRO-2024-019',
    fullName: 'Zeynep Kaya',
    overallScore: 84,
    completedModulesCount: 5,
    quizzesCompleted: 8,
    scenariosCompleted: 3,
    weakTopics: ['Diferansiyel Sıkışma Teşhisi', 'ECD Hesaplama'],
    strongTopics: ['KKD Standartları', 'Basınç Gradyanı'],
    lastActive: 'Dün, 18:45',
    assignmentStatus: 'Tamamlandı'
  },
  {
    id: 'std-3',
    studentNumber: 'PETRO-2024-055',
    fullName: 'Ahmet Demir',
    overallScore: 68,
    completedModulesCount: 3,
    quizzesCompleted: 5,
    scenariosCompleted: 2,
    weakTopics: ['Shut-in Prosedürü', 'MAASP Sınırı', 'LOTO'],
    strongTopics: ['Kule Ekipman Tanıma'],
    lastActive: '2 gün önce',
    assignmentStatus: 'Devam Ediyor'
  },
  {
    id: 'std-4',
    studentNumber: 'PETRO-2024-082',
    fullName: 'Elif Şahin',
    overallScore: 76,
    completedModulesCount: 4,
    quizzesCompleted: 6,
    scenariosCompleted: 2,
    weakTopics: ['Akış Kontrolü (Flow Check)', 'Atık Çukuru Yönetimi'],
    strongTopics: ['Wait & Weight Yöntemi'],
    lastActive: '3 gün önce',
    assignmentStatus: 'Devam Ediyor'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Well Control & Hydrostatic Pressure Benchmark',
    dueDate: '2026-10-15',
    description: '10,200 ft TVD gazlı kumtaşı kuyusunda Kick teşhisi, yumuşak kapatma ve Kill Sheet hesaplama ödevi.',
    requiredScenarios: ['scenario-kick', 'hydrostatic-pressure', 'formation-pressure'],
    targetScore: 80,
    enrolledStudentsCount: 42,
    submissionRate: 85
  },
  {
    id: 'asg-2',
    title: 'HSE & Rig Floor Safety Certification',
    dueDate: '2026-10-22',
    description: 'H2S tahliyesi, LOTO enerji izolasyonu, kule tabanı kırmızı bölge ve atık yönetimi modüllerinin tamamlanması.',
    requiredScenarios: ['safe-ppe-1', 'safe-h2s-1', 'safe-loto-1'],
    targetScore: 85,
    enrolledStudentsCount: 42,
    submissionRate: 62
  }
];
