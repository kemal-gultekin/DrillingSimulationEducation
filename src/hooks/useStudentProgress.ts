import { useState, useEffect, useCallback } from 'react';
import { StudentProgressState } from '../types';

const STORAGE_KEY = 'petrosim_progress';

const INITIAL_PROGRESS: StudentProgressState = {
  completedEquipment: ['derrick', 'bop-stack'],
  safetyScore: 0,
  safetyAnswered: {},
  completedCalculations: ['hydrostatic-pressure'],
  completedScenarios: {},
  wellControlPracticed: false,
  completedMissions: []
};

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          completedMissions: parsed.completedMissions || []
        };
      }
      return INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  const markEquipmentExplored = useCallback((id: string) => {
    setProgress((prev) => {
      if (!prev.completedEquipment.includes(id)) {
        return {
          ...prev,
          completedEquipment: [...prev.completedEquipment, id]
        };
      }
      return prev;
    });
  }, []);

  const recordSafetyAnswer = useCallback((questionId: string, isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      safetyScore: prev.safetyScore + (isCorrect ? 10 : 0),
      safetyAnswered: {
        ...prev.safetyAnswered,
        [questionId]: {
          answeredIndex: 0,
          isCorrect
        }
      }
    }));
  }, []);

  const recordCalculationCompleted = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (!prev.completedCalculations.includes(moduleId)) {
        return {
          ...prev,
          completedCalculations: [...prev.completedCalculations, moduleId]
        };
      }
      return prev;
    });
  }, []);

  const recordScenarioScore = useCallback((scenarioId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      completedScenarios: {
        ...prev.completedScenarios,
        [scenarioId]: {
          score,
          completedAt: new Date().toISOString()
        }
      }
    }));
  }, []);

  const recordWellControlPractice = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      wellControlPracticed: true
    }));
  }, []);

  const markMissionCompleted = useCallback((missionId: string) => {
    setProgress((prev) => {
      const prevCompleted = prev.completedMissions || [];
      if (!prevCompleted.includes(missionId)) {
        return {
          ...prev,
          completedMissions: [...prevCompleted, missionId]
        };
      }
      return prev;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
  }, []);

  return {
    progress,
    setProgress,
    markEquipmentExplored,
    recordSafetyAnswer,
    recordCalculationCompleted,
    recordScenarioScore,
    recordWellControlPractice,
    markMissionCompleted,
    resetAllProgress
  };
}
