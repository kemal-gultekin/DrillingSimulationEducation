import { useState, useCallback, useMemo } from 'react';
import { DrillingScenario, ScenarioChoice } from '../simulation/types';
import { DRILLING_SCENARIOS } from '../data/scenarios';
import {
  createInitialScenarioState,
  getCurrentStep,
  computeActiveTelemetry,
  makeChoice,
  advanceStep
} from '../simulation/scenarioEngine';

export function useScenarioEngine(
  initialScenarioId: string = 'scenario-kick',
  onRecordScore?: (scenarioId: string, score: number) => void
) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);

  const scenario = useMemo(() => {
    return DRILLING_SCENARIOS.find((s) => s.id === selectedScenarioId) || DRILLING_SCENARIOS[0];
  }, [selectedScenarioId]);

  const [engineState, setEngineState] = useState(() => createInitialScenarioState(scenario));

  const selectScenario = useCallback((id: string, onFocus?: (focusId: string) => void) => {
    const nextScenario = DRILLING_SCENARIOS.find((s) => s.id === id) || DRILLING_SCENARIOS[0];
    setSelectedScenarioId(id);
    setEngineState(createInitialScenarioState(nextScenario));
    if (nextScenario.equipmentIdFocus && onFocus) {
      onFocus(nextScenario.equipmentIdFocus);
    }
  }, []);

  const chooseOption = useCallback((choice: ScenarioChoice) => {
    setEngineState((prev) => {
      const next = makeChoice(prev, scenario, choice);
      if (next.isFinished && onRecordScore) {
        onRecordScore(scenario.id, next.score);
      }
      return next;
    });
  }, [scenario, onRecordScore]);

  const proceedNextStep = useCallback(() => {
    setEngineState((prev) => advanceStep(prev, scenario));
  }, [scenario]);

  const restartScenario = useCallback(() => {
    setEngineState(createInitialScenarioState(scenario));
  }, [scenario]);

  const currentStep = useMemo(() => {
    return getCurrentStep(scenario, engineState.currentStepId);
  }, [scenario, engineState.currentStepId]);

  const activeTelemetry = useMemo(() => {
    return computeActiveTelemetry(
      currentStep.observedData,
      engineState.lastChoice?.telemetryChange
    );
  }, [currentStep.observedData, engineState.lastChoice]);

  return {
    scenario,
    selectedScenarioId,
    selectScenario,
    currentStep,
    activeTelemetry,
    engineState,
    chooseOption,
    proceedNextStep,
    restartScenario,
    isFinished: engineState.isFinished
  };
}
