/**
 * Scenario Engine
 * Pure state machine and evaluation functions for drilling emergency decision trees.
 */

import {
  DrillingScenario,
  ScenarioStep,
  ScenarioChoice,
  ScenarioEngineState,
  ScenarioTelemetry
} from './types';

export function createInitialScenarioState(scenario: DrillingScenario): ScenarioEngineState {
  return {
    scenarioId: scenario.id,
    currentStepId: scenario.initialStepId,
    score: 0,
    lastChoice: null,
    history: [],
    isFinished: false
  };
}

export function getCurrentStep(
  scenario: DrillingScenario,
  currentStepId: string
): ScenarioStep {
  return scenario.steps[currentStepId] || scenario.steps[scenario.initialStepId];
}

export function computeActiveTelemetry(
  baseTelemetry: ScenarioTelemetry,
  telemetryChange?: Partial<ScenarioTelemetry>
): ScenarioTelemetry {
  if (!telemetryChange) return baseTelemetry;
  return {
    ...baseTelemetry,
    ...telemetryChange
  };
}

export function makeChoice(
  state: ScenarioEngineState,
  scenario: DrillingScenario,
  choice: ScenarioChoice
): ScenarioEngineState {
  const currentStep = getCurrentStep(scenario, state.currentStepId);
  const newScore = Math.max(0, state.score + choice.scoreChange);
  const isFinished = !choice.nextStepId || !scenario.steps[choice.nextStepId];

  return {
    ...state,
    score: newScore,
    lastChoice: choice,
    history: [...state.history, { step: currentStep, choice }],
    isFinished
  };
}

export function advanceStep(
  state: ScenarioEngineState,
  scenario: DrillingScenario
): ScenarioEngineState {
  if (state.lastChoice?.nextStepId && scenario.steps[state.lastChoice.nextStepId]) {
    return {
      ...state,
      currentStepId: state.lastChoice.nextStepId,
      lastChoice: null
    };
  }
  return state;
}
