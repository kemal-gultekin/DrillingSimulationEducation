import React, { useState } from 'react';
import { DRILLING_SCENARIOS } from '../data/scenarios';
import { DrillingScenario, ScenarioStep, ScenarioChoice } from '../types';
import { 
  AlertOctagon, 
  Gauge, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Flame, 
  Compass, 
  Eye 
} from 'lucide-react';

interface ScenarioPanelProps {
  onFocusEquipment?: (equipmentId: string) => void;
  onRecordScenarioScore?: (scenarioId: string, score: number) => void;
}

export const ScenarioPanel: React.FC<ScenarioPanelProps> = ({
  onFocusEquipment,
  onRecordScenarioScore
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-kick');
  const [currentStepId, setCurrentStepId] = useState<string>('step-1');
  const [lastChoice, setLastChoice] = useState<ScenarioChoice | null>(null);
  const [cumulativeScore, setCumulativeScore] = useState<number>(0);
  const [history, setHistory] = useState<{ step: ScenarioStep; choice: ScenarioChoice }[]>([]);

  const activeScenario: DrillingScenario = 
    DRILLING_SCENARIOS.find((s) => s.id === selectedScenarioId) || DRILLING_SCENARIOS[0];

  const currentStep: ScenarioStep = 
    activeScenario.steps[currentStepId] || activeScenario.steps[activeScenario.initialStepId];

  const handleSelectScenario = (id: string) => {
    const sc = DRILLING_SCENARIOS.find((s) => s.id === id) || DRILLING_SCENARIOS[0];
    setSelectedScenarioId(id);
    setCurrentStepId(sc.initialStepId);
    setLastChoice(null);
    setCumulativeScore(0);
    setHistory([]);
    if (sc.equipmentIdFocus && onFocusEquipment) {
      onFocusEquipment(sc.equipmentIdFocus);
    }
  };

  const handleChoose = (choice: ScenarioChoice) => {
    setLastChoice(choice);
    const newScore = Math.max(0, cumulativeScore + choice.scoreChange);
    setCumulativeScore(newScore);
    setHistory((prev) => [...prev, { step: currentStep, choice }]);

    if (!choice.nextStepId && onRecordScenarioScore) {
      onRecordScenarioScore(activeScenario.id, newScore);
    }
  };

  const handleContinueNextStep = () => {
    if (lastChoice?.nextStepId && activeScenario.steps[lastChoice.nextStepId]) {
      setCurrentStepId(lastChoice.nextStepId);
      setLastChoice(null);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(activeScenario.initialStepId);
    setLastChoice(null);
    setCumulativeScore(0);
    setHistory([]);
  };

  // Get active telemetry factoring in choice modifications if applicable
  const telemetry = {
    ...currentStep.observedData,
    ...(lastChoice?.telemetryChange || {})
  };

  const isFinished = lastChoice !== null && !lastChoice.nextStepId;

  return (
    <div
      id="drilling-scenario-panel"
      className="absolute top-16 left-4 z-20 w-[460px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Sondaj Senaryoları & Karar Motoru</h2>
              <p className="text-[11px] text-slate-400">Dallanan Karar Ağacı & Saha Müdahalesi</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs font-mono">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{cumulativeScore} Skor</span>
          </div>
        </div>

        {/* Scenario Select */}
        <select
          id="scenario-select"
          value={selectedScenarioId}
          onChange={(e) => handleSelectScenario(e.target.value)}
          className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
        >
          {DRILLING_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id}>
              [{sc.difficulty}] {sc.turkishTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Initial Well Conditions */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
            <span className="font-semibold text-slate-300">Kuyu Başlangıç Koşulları</span>
            <span className="font-mono text-amber-400">{activeScenario.initialConditions.formation}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center pt-1">
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Derinlik (TVD)</div>
              <div className="font-bold text-slate-200">{activeScenario.initialConditions.tvd} ft</div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Kuyu Çapı</div>
              <div className="font-bold text-slate-200">{activeScenario.initialConditions.holeSize} in</div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Başlangıç MW</div>
              <div className="font-bold text-amber-300">{activeScenario.initialConditions.mudWeight} ppg</div>
            </div>
          </div>
        </div>

        {/* Live Rig Telemetry Dashboard */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Canlı Kule Telemetrisi (Driller Display)</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CANLI VERİ
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Standpipe Basıncı</span>
              <span className="font-bold text-sm text-sky-400">{telemetry.standpipePressure}</span>
              <span className="text-[10px] text-slate-500 ml-1">psi</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Tank Hacmi</span>
              <span className="font-bold text-sm text-amber-400">{telemetry.pitVolume}</span>
              <span className="text-[10px] text-slate-500 ml-1">bbl</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Dönüş Akışı</span>
              <span className="font-bold text-sm text-emerald-400">{telemetry.flowOut}</span>
              <span className="text-[10px] text-slate-500 ml-1">%</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Delme Hızı (ROP)</span>
              <span className="font-bold text-sm text-purple-400">{telemetry.rop}</span>
              <span className="text-[10px] text-slate-500 ml-1">ft/hr</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Kanca Yükü</span>
              <span className="font-bold text-sm text-slate-200">{telemetry.hookLoad}</span>
              <span className="text-[10px] text-slate-500 ml-1">klbs</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Dönüş Çamur MW</span>
              <span className="font-bold text-sm text-yellow-300">{telemetry.mudWeight}</span>
              <span className="text-[10px] text-slate-500 ml-1">ppg</span>
            </div>
          </div>

          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 font-semibold text-[11px] text-center">
            {currentStep.observedData.statusAlert}
          </div>
        </div>

        {/* Situation Briefing */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Mevcut Durum & Sahadan Gelen Bilgi:</span>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed">{currentStep.situation}</p>
        </div>

        {/* Decision Options (If not currently showing feedback or if waiting next step) */}
        {!lastChoice ? (
          <div className="space-y-2">
            <div className="text-slate-300 font-semibold text-xs">
              Mühendislik Kararınızı Seçiniz (Ne Yapmalısınız?):
            </div>
            {currentStep.choices.map((choice) => (
              <button
                key={choice.id}
                id={`choice-${choice.id}`}
                onClick={() => handleChoose(choice)}
                className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 text-xs text-slate-200 transition-all cursor-pointer flex items-start gap-2.5 group"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5 group-hover:scale-125 transition-transform" />
                <span className="leading-relaxed font-medium">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Consequence & Educational Feedback */
          <div className="space-y-3">
            <div
              id="scenario-feedback-card"
              className={`p-4 rounded-xl border space-y-2.5 ${
                lastChoice.outcomeType === 'safe'
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : lastChoice.outcomeType === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <div className="flex items-center gap-2">
                  {lastChoice.outcomeType === 'safe' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Güvenli ve Standart Karar</span>
                    </>
                  ) : lastChoice.outcomeType === 'warning' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Operasyonel Risk / Uyarı</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Kritik Hata / Tehlikeli Karar</span>
                    </>
                  )}
                </div>
                <span className="font-mono text-[11px]">
                  {lastChoice.scoreChange >= 0 ? `+${lastChoice.scoreChange}` : lastChoice.scoreChange} Puan
                </span>
              </div>

              {/* Consequence text */}
              <div className="text-xs leading-relaxed text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold block text-slate-300 mb-1">Meydana Gelen Sonuç:</span>
                {lastChoice.consequence}
              </div>

              {/* Technical Explanation */}
              <div className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-1">Teknik & Mühendislik Analizi:</span>
                {lastChoice.explanation}
              </div>
            </div>

            {/* Actions: Continue or Restart */}
            <div className="flex gap-2">
              {lastChoice.nextStepId ? (
                <button
                  id="scenario-continue-btn"
                  onClick={handleContinueNextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>Senaryoya Devam Et (Sonraki Durum)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-semibold">
                    Senaryo Başarıyla Tamamlandı! Toplam Skor: {cumulativeScore}
                  </div>
                  <button
                    id="scenario-restart-btn"
                    onClick={handleRestart}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Senaryoyu Yeniden Başlat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
