import { LocalizedString } from '../i18n/types';

export interface StudentRecord {
  id: string;
  studentNumber: string;
  fullName: string;
  avatarUrl?: string;
  overallScore: number;
  completedModulesCount: number;
  quizzesCompleted: number;
  scenariosCompleted: number;
  weakTopics: LocalizedString[] | string[];
  strongTopics: LocalizedString[] | string[];
  lastActive: LocalizedString | string;
  assignmentStatus: 'Tamamlandı' | 'Devam Ediyor' | 'Başlanmadı';
}

export interface Assignment {
  id: string;
  title: LocalizedString | string;
  dueDate: string;
  description: LocalizedString | string;
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
    lastActive: {
      tr: 'Bugün, 14:20',
      en: 'Today, 14:20'
    },
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
    lastActive: {
      tr: 'Dün, 18:45',
      en: 'Yesterday, 18:45'
    },
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
    lastActive: {
      tr: '2 gün önce',
      en: '2 days ago'
    },
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
    lastActive: {
      tr: '3 gün önce',
      en: '3 days ago'
    },
    assignmentStatus: 'Devam Ediyor'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: {
      tr: 'Kuyu Kontrolü & Hidrostatik Basınç Ödevi',
      en: 'Well Control & Hydrostatic Pressure Benchmark'
    },
    dueDate: '2026-10-15',
    description: {
      tr: '10,200 ft TVD gazlı kumtaşı kuyusunda Kick teşhisi, yumuşak kapatma ve Kill Sheet hesaplama ödevi.',
      en: '10,200 ft TVD gas sandstone kick diagnosis, soft shut-in, and kill sheet calculations.'
    },
    requiredScenarios: ['scenario-kick', 'hydrostatic-pressure', 'formation-pressure'],
    targetScore: 80,
    enrolledStudentsCount: 42,
    submissionRate: 85
  },
  {
    id: 'asg-2',
    title: {
      tr: 'İSG & Kule Tabanı Güvenlik Sertifikasyonu',
      en: 'HSE & Rig Floor Safety Certification'
    },
    dueDate: '2026-10-22',
    description: {
      tr: 'H2S tahliyesi, LOTO enerji izolasyonu, kule tabanı kırmızı bölge ve atık yönetimi modüllerinin tamamlanması.',
      en: 'Completion of H2S evacuation, LOTO isolation, rig floor red zone, and drilling waste management modules.'
    },
    requiredScenarios: ['safe-ppe-1', 'safe-h2s-1', 'safe-loto-1'],
    targetScore: 85,
    enrolledStudentsCount: 42,
    submissionRate: 62
  }
];
