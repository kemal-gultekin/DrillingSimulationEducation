import React, { useState } from 'react';
import { ENGINEERING_MODULES } from '../data/engineering';
import { useI18n } from '../i18n';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Activity, 
  TrendingUp
} from 'lucide-react';

interface EngineeringPanelProps {
  onRecordCompletion?: (moduleId: string) => void;
}

export const EngineeringPanel: React.FC<EngineeringPanelProps> = ({
  onRecordCompletion
}) => {
  const { t, resolveText } = useI18n();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('hydrostatic-pressure');
  const [inputValues, setInputValues] = useState<Record<string, Record<string, number>>>({
    'hydrostatic-pressure': { MW: 10.0, TVD: 5000 },
    'pressure-gradient': { MW: 11.5 },
    'required-mud-weight': { P: 4500, TVD: 8000, Margin: 200 },
    'bottom-hole-pressure': { MW: 12.0, TVD: 9500, APL: 250 },
    'formation-pressure': { OMW: 9.8, TVD: 7200, SIDPP: 420 },
    'overbalance-underbalance': { BHP: 5200, PFORM: 4950 },
    'equivalent-circulating-density': { MW: 10.5, APL: 320, TVD: 8500 }
  });

  const activeModule = ENGINEERING_MODULES.find((m) => m.id === selectedModuleId) || ENGINEERING_MODULES[0];
  const currentInputs = inputValues[activeModule.id] || {};

  // Ensure default field values if not yet set
  activeModule.fields.forEach((f) => {
    if (currentInputs[f.variable] === undefined) {
      currentInputs[f.variable] = f.value;
    }
  });

  const handleInputChange = (variable: string, val: number) => {
    setInputValues((prev) => ({
      ...prev,
      [activeModule.id]: {
        ...prev[activeModule.id],
        [variable]: val
      }
    }));
    if (onRecordCompletion) {
      onRecordCompletion(activeModule.id);
    }
  };

  const calcResult = activeModule.calculate(currentInputs);
  const moduleTitle = resolveText(activeModule.title, activeModule.turkishTitle || '');
  const moduleDesc = resolveText(activeModule.description);

  return (
    <div
      id="engineering-panel"
      className="absolute top-16 left-4 z-20 w-[460px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{t('engineering.title')}</h2>
            <p className="text-[11px] text-slate-400">{t('engineering.subtitle')}</p>
          </div>
        </div>

        {/* Module Picker */}
        <select
          id="engineering-module-select"
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
          className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          {ENGINEERING_MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {resolveText(m.title, m.turkishTitle)}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Module Banner & Formula Card */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">{moduleTitle}</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/30">
              API Spec
            </span>
          </div>
          <div className="font-mono text-base font-extrabold text-amber-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center tracking-wide">
            {activeModule.formula}
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{moduleDesc}</p>
        </div>

        {/* Interactive Inputs */}
        <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('engineering.inputsTitle')}</span>
          </div>

          {activeModule.fields.map((field) => {
            const currentVal = currentInputs[field.variable] !== undefined ? currentInputs[field.variable] : field.value;
            const fieldLabel = resolveText(field.label);
            const fieldDesc = resolveText(field.description);
            return (
              <div key={field.variable} className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{fieldLabel}</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
                    <span>{currentVal}</span>
                    <span className="text-slate-400 text-[10px]">{field.unit}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={currentVal}
                  onChange={(e) => handleInputChange(field.variable, parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <p className="text-[10px] text-slate-500 leading-tight">{fieldDesc}</p>
              </div>
            );
          })}
        </div>

        {/* Real-time Calculation Result Hero Card */}
        <div
          id="calculation-result-hero"
          className="bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-4 rounded-xl border border-amber-500/40 text-center space-y-1.5 shadow-lg"
        >
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            {t('engineering.engineeringComment')}
          </span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
              {calcResult.result}
            </span>
            <span className="text-sm font-bold font-mono text-slate-300">
              {calcResult.unit}
            </span>
          </div>

          {calcResult.warning && (
            <div className="mt-2 p-2 bg-red-950/40 border border-red-500/50 rounded-lg text-red-300 font-bold text-[11px] flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{calcResult.warning}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Mathematical Derivation */}
        <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('engineering.solutionSteps')}</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {calcResult.steps.map((st, i) => (
              <div key={i} className="text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800/80 leading-relaxed">
                {st}
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Evaluation & Meaning */}
        <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('engineering.engineeringComment')}</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{calcResult.explanation}</p>
        </div>

        {/* Operational Significance */}
        <div className="space-y-1.5 bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('engineering.drillingSignificance')}</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{calcResult.drillingSignificance}</p>
        </div>
      </div>
    </div>
  );
};
