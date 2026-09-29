import React, { useState } from 'react';
import { ENGINEERING_MODULES } from '../data/engineering';
import { CalculationModule } from '../types';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Activity, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface EngineeringPanelProps {
  onRecordCompletion?: (moduleId: string) => void;
}

export const EngineeringPanel: React.FC<EngineeringPanelProps> = ({
  onRecordCompletion
}) => {
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

  return (
    <div
      id="engineering-panel"
      className="absolute top-16 left-4 z-20 w-[460px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Sondaj Mühendisliği Hesaplayıcısı</h2>
            <p className="text-[11px] text-slate-400">Dinamik Formül ve Kuyu Basınç Analizi</p>
          </div>
        </div>

        {/* Module Picker */}
        <select
          id="engineering-module-select"
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
          className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
        >
          {ENGINEERING_MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.turkishTitle} ({m.title})
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Module Banner & Formula Card */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">Kullanılan Temel Formül:</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/30">
              API Standart
            </span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center font-mono text-sm font-bold text-amber-300 tracking-wide">
            {activeModule.formula}
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed italic">
            {activeModule.description}
          </p>
        </div>

        {/* Input Parameters */}
        <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs border-b border-slate-800 pb-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Girdi Değerleri ve Parametreler</span>
          </div>

          {activeModule.fields.map((field) => {
            const currentVal = currentInputs[field.variable] ?? field.value;
            return (
              <div key={field.variable} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 font-medium">{field.label}:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={currentVal}
                      onChange={(e) => handleInputChange(field.variable, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-right font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-slate-400 text-[10px] w-14 truncate">{field.unit}</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={currentVal}
                  onChange={(e) => handleInputChange(field.variable, parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
                />

                <p className="text-[10px] text-slate-500 leading-tight">{field.description}</p>
              </div>
            );
          })}
        </div>

        {/* Warning Badge if any */}
        {calcResult.warning && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-2 text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{calcResult.warning}</span>
          </div>
        )}

        {/* Calculation Result Highlight Box */}
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-4 rounded-xl border border-amber-500/40 text-center space-y-1 shadow-lg">
          <span className="text-[11px] text-amber-300 font-medium uppercase tracking-wider">
            Hesaplanan Nihai Sonuç
          </span>
          <div className="text-3xl font-black text-amber-400 font-mono tracking-tight flex items-baseline justify-center gap-2">
            <span>{calcResult.result}</span>
            <span className="text-sm font-semibold text-slate-300 font-sans">{calcResult.unit}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal pt-1">{calcResult.explanation}</p>
        </div>

        {/* Step-by-Step Mathematical Substitution */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adım Adım Sayısal Yerine Koyma (Substitution)</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
            {calcResult.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-amber-500 font-bold shrink-0">{idx + 1}.</span>
                <span className="leading-tight">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why this Calculation Matters in Drilling */}
        <div className="bg-sky-950/20 border border-sky-900/40 p-3.5 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-sky-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Sondaj Operasyonundaki Hayati Önemi</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {calcResult.drillingSignificance}
          </p>
        </div>

        {/* Educational Concept Flow Diagram */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] text-slate-400 text-center space-y-1">
          <div className="text-amber-400 font-semibold">Temel Mühendislik İlişkisi:</div>
          <div className="flex items-center justify-center gap-1 font-mono text-slate-300">
            <span>Mud Weight (Çamur Ağırlığı)</span>
            <span>→</span>
            <span className="text-amber-300 font-bold">Hidrostatik Basınç</span>
            <span>→</span>
            <span>Kuyu Dibi Basıncı (BHP)</span>
            <span>→</span>
            <span className="text-emerald-300 font-bold">Well Control</span>
          </div>
        </div>
      </div>
    </div>
  );
};
