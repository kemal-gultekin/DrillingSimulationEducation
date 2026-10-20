import React from 'react';
import { StudentProgressState } from '../types';
import { EQUIPMENT_LIST } from '../data/equipment';
import { SAFETY_QUESTIONS } from '../data/safety';
import { DRILLING_SCENARIOS } from '../data/scenarios';
import { ENGINEERING_MODULES } from '../data/engineering';
import { GUIDED_MISSIONS } from '../data/missions';
import { useI18n } from '../i18n';
import { 
  Award, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Download, 
  Flame, 
  Brain, 
  Compass,
  RotateCcw
} from 'lucide-react';

interface ProgressPanelProps {
  progress: StudentProgressState;
  onResetProgress?: () => void;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  progress,
  onResetProgress
}) => {
  const { t, lang } = useI18n();

  const equipmentRatio = Math.round((progress.completedEquipment.length / EQUIPMENT_LIST.length) * 100);
  const missionsTotal = GUIDED_MISSIONS.length;
  const missionsCompletedCount = (progress.completedMissions || []).length;
  const missionsRatio = missionsTotal > 0 ? Math.round((missionsCompletedCount / missionsTotal) * 100) : 0;

  const safetyQuestionsTotal = SAFETY_QUESTIONS.length;
  const safetyAnsweredCount = Object.keys(progress.safetyAnswered).length;
  const safetyCorrectCount = Object.values(progress.safetyAnswered).filter((a) => a.isCorrect).length;
  const safetyRatio = safetyQuestionsTotal > 0 ? Math.round((safetyCorrectCount / safetyQuestionsTotal) * 100) : 0;

  const scenariosTotal = DRILLING_SCENARIOS.length;
  const scenariosCompletedCount = Object.keys(progress.completedScenarios).length;
  const scenariosRatio = scenariosTotal > 0 ? Math.round((scenariosCompletedCount / scenariosTotal) * 100) : 0;

  const calculationsTotal = ENGINEERING_MODULES.length;
  const calculationsDoneCount = progress.completedCalculations.length;
  const calculationsRatio = calculationsTotal > 0 ? Math.round((calculationsDoneCount / calculationsTotal) * 100) : 0;

  const totalScore = 
    progress.safetyScore + 
    Object.values(progress.completedScenarios).reduce((acc, curr) => acc + curr.score, 0) + 
    calculationsDoneCount * 15 +
    missionsCompletedCount * 10;

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "petrosim_student_progress.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (window.confirm(t('progress.resetConfirm'))) {
      if (onResetProgress) onResetProgress();
    }
  };

  return (
    <div
      id="progress-panel"
      className="absolute top-16 left-4 z-20 w-[460px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{t('progress.title')}</h2>
            <p className="text-[11px] text-slate-400">{t('progress.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="export-progress-json-btn"
            onClick={handleExportJson}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            title="JSON Export"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON</span>
          </button>
          {onResetProgress && (
            <button
              id="reset-progress-btn"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title={t('progress.resetProgress')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Total Score Banner */}
        <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 p-4 rounded-xl border border-amber-500/30 text-center space-y-1">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            {t('progress.cumulativeScore')}
          </span>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-tight">
            {totalScore}
          </div>
          <p className="text-[11px] text-slate-300">
            {t('progress.cumulativeDesc')}
          </p>
        </div>

        {/* Modules Progress Breakdown */}
        <div className="space-y-2.5">
          <div className="text-slate-300 font-semibold text-xs border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{t('progress.moduleStatusTitle')}</span>
            <span className="text-[10px] text-slate-500 font-mono">5 {t('progress.keyAreas')}</span>
          </div>

          {/* 1. Exploration */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                {t('progress.exploredEquipment')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {progress.completedEquipment.length} / {EQUIPMENT_LIST.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${equipmentRatio}%` }}
              />
            </div>
          </div>

          {/* Guided Walk Tour */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {t('progress.guidedMissionsLabel')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {missionsCompletedCount} / {missionsTotal}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${missionsRatio}%` }}
              />
            </div>
          </div>

          {/* 2. Safety */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {t('progress.safetyQuizScore')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {safetyCorrectCount} / {safetyQuestionsTotal}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${safetyRatio}%` }}
              />
            </div>
          </div>

          {/* 3. Engineering Calculations */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                {t('progress.calculationsCompleted')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {calculationsDoneCount} / {calculationsTotal}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${calculationsRatio}%` }}
              />
            </div>
          </div>

          {/* 4. Drilling Scenarios */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {t('progress.scenariosSolved')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {scenariosCompletedCount} / {scenariosTotal}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${scenariosRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Competency Analysis */}
        <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('progress.competencyTitle')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40 text-emerald-300">
              <span className="font-bold block mb-0.5">{t('progress.strongAreas')}</span>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
                <li>{lang === 'tr' ? 'Hidrostatik Basınç & MW' : 'Hydrostatic Pressure & MW'}</li>
                <li>{lang === 'tr' ? 'KKD & Saha Güvenliği' : 'PPE & Rig Safety'}</li>
                <li>{lang === 'tr' ? 'BOP Fonksiyonları' : 'BOP Stack Functions'}</li>
              </ul>
            </div>
            <div className="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-amber-300">
              <span className="font-bold block mb-0.5">{t('progress.reviewRecommended')}</span>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
                <li>{lang === 'tr' ? 'Choke Manifold Basınç Ayarı' : 'Choke Manifold Setting'}</li>
                <li>{lang === 'tr' ? 'Diferansiyel Sıkışma Teşhisi' : 'Differential Sticking Diagnosis'}</li>
                <li>{lang === 'tr' ? 'MAASP Limit Hesabı' : 'MAASP Calculation'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status Note */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>{t('progress.backendNoticeTitle')}</span>
          </div>
          <p className="text-slate-400">
            {t('progress.backendNoticeDesc')}
          </p>
        </div>
      </div>
    </div>
  );
};
