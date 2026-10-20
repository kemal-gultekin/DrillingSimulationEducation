import { IStudentProgressRepository } from '../types';
import { StudentProgressState } from '../../types';

const PROGRESS_STORAGE_KEY = 'petrosim_progress';

const INITIAL_PROGRESS: StudentProgressState = {
  completedEquipment: ['derrick', 'bop-stack'],
  safetyScore: 0,
  safetyAnswered: {},
  completedCalculations: ['hydrostatic-pressure'],
  completedScenarios: {},
  wellControlPracticed: false,
  completedMissions: []
};

export class LocalStorageProgressRepository implements IStudentProgressRepository {
  async getProgress(): Promise<StudentProgressState> {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          completedMissions: parsed.completedMissions || []
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  }

  async saveProgress(progress: StudentProgressState): Promise<void> {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }

  async resetProgress(): Promise<StudentProgressState> {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  }
}
