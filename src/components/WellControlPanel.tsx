import React, { useState } from 'react';
import { calculateKillSheet, WELL_CONTROL_CONCEPTS } from '../data/wellControl';
import { useI18n } from '../i18n';
import { 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  Sliders, 
  BookOpen, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

interface WellControlPanelProps {
  onPracticeRecorded?: () => void;
}

export const WellControlPanel: React.FC<WellControlPanelProps> = ({
  onPracticeRecorded
}) => {
  const { t, resolveText, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'killsheet' | 'methods' | 'concepts'>('killsheet');

  // Input states for Kill Sheet calculation
  const [tvd, setTvd] = useState<number>(9800);
  const [omw, setOmw] = useState<number>(10.4);
  const [sidpp, setSidpp] = useState<number>(480);
  const [sicp, setSicp] = useState<number>(690);
  const [pitGain, setPitGain] = useState<number>(22);
  const [scrPressure, setScrPressure] = useState<number>(750);
  const [casingShoeTvd, setCasingShoeTvd] = useState<number>(6500);
  const [lotMw, setLotMw] = useState<number>(14.2);

  const killSheet = calculateKillSheet({
    tvd,
    originalMudWeight: omw,
    sidpp,
    sicp,
    pitGain,
    scrPressure,
    casingShoeTvd,
    lotMudWeight: lotMw
  });

  const handleInputChange = () => {
    if (onPracticeRecorded) onPracticeRecorded();
  };

  return (
    <div
      id="well-control-panel"
      className="absolute top-16 left-4 z-20 w-[470px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{t('wellControl.title')}</h2>
            <p className="text-[11px] text-slate-400">{t('wellControl.subtitle')}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            id="tab-killsheet"
            onClick={() => setActiveTab('killsheet')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'killsheet'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('wellControl.tabKillSheet')}
          </button>
          <button
            id="tab-methods"
            onClick={() => setActiveTab('methods')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'methods'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('wellControl.tabMethods')}
          </button>
          <button
            id="tab-concepts"
            onClick={() => setActiveTab('concepts')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('wellControl.tabConcepts')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {activeTab === 'killsheet' && (
          <>
            {/* Input Controls */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs mb-1">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('wellControl.dataInputs')}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.tvdLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{tvd} ft</span>
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={20000}
                    step={100}
                    value={tvd}
                    onChange={(e) => {
                      setTvd(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.omwLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{omw} ppg</span>
                  </div>
                  <input
                    type="range"
                    min={8.33}
                    max={18.0}
                    step={0.1}
                    value={omw}
                    onChange={(e) => {
                      setOmw(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.sidppLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{sidpp} psi</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={10}
                    value={sidpp}
                    onChange={(e) => {
                      setSidpp(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.sicpLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{sicp} psi</span>
                  </div>
                  <input
                    type="range"
                    min={sidpp + 20}
                    max={3000}
                    step={10}
                    value={sicp}
                    onChange={(e) => {
                      setSicp(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.pitGainLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{pitGain} bbl</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={pitGain}
                    onChange={(e) => {
                      setPitGain(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{t('wellControl.scrLabel')}</span>
                    <span className="font-mono text-amber-400 font-bold">{scrPressure} psi</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    step={25}
                    value={scrPressure}
                    onChange={(e) => {
                      setScrPressure(parseFloat(e.target.value));
                      handleInputChange();
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Core Kill Sheet Results Grid */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">{t('wellControl.resultsTitle')}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  IWCF / IADC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">{t('wellControl.formationPressure')}</span>
                  <span className="text-base font-bold text-sky-400">{killSheet.formationPressure}</span>
                  <span className="text-[10px] text-slate-500 ml-1">psi</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-500/40 text-center bg-amber-500/5">
                  <span className="text-[10px] text-amber-300 block font-sans font-bold">{t('wellControl.killMudWeight')}</span>
                  <span className="text-base font-bold text-amber-400">{killSheet.killMudWeight}</span>
                  <span className="text-[10px] text-slate-500 ml-1">ppg</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">{t('wellControl.icp')}</span>
                  <span className="text-base font-bold text-emerald-400">{killSheet.icp}</span>
                  <span className="text-[10px] text-slate-500 ml-1">psi</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">{t('wellControl.fcp')}</span>
                  <span className="text-base font-bold text-purple-400">{killSheet.fcp}</span>
                  <span className="text-[10px] text-slate-500 ml-1">psi</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">{t('wellControl.maasp')}</span>
                  <span className="text-base font-bold text-rose-400">{killSheet.maasp}</span>
                  <span className="text-[10px] text-slate-500 ml-1">psi</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">{t('wellControl.kickTolerance')}</span>
                  <span className="text-base font-bold text-teal-400">+{killSheet.kickTolerance}</span>
                  <span className="text-[10px] text-slate-500 ml-1">ppg</span>
                </div>
              </div>

              {/* Influx Analysis Card */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px] border-b border-slate-800 pb-1">
                  <span className="text-slate-400 font-sans">{t('wellControl.influxHeight')}</span>
                  <span className="font-mono text-slate-200">{killSheet.influxHeight} ft</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-slate-800 pb-1">
                  <span className="text-slate-400 font-sans">{t('wellControl.influxDensity')}</span>
                  <span className="font-mono text-slate-200">{killSheet.influxDensity} ppg</span>
                </div>
                <div className="pt-1 text-[11px]">
                  <span className="text-slate-400 block font-sans">{t('wellControl.influxType')}</span>
                  <span className="font-bold text-amber-300 block">{killSheet.influxType}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'methods' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>1. Driller's Method (Sondör Yöntemi)</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {lang === 'tr'
                  ? 'İki tam dolaşım turu gerektirir. 1. Turda kuyu kapatıldıktan sonra orijinal çamurla (OMW) gaz kuyu anülüsünden tahliye edilir (ICP basıncı sabit tutulur). Gaz atıldıktan sonra 2. Turda tankta hazırlanan ağır öldürme çamuru (KMW) basılır.'
                  : 'Requires two full circulations. Circulation 1 removes the kick from the annulus using original mud weight (OMW) while holding drill pipe pressure at ICP. Circulation 2 pumps the kill mud weight (KMW) into the well.'}
              </p>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-400">
                1. Dolaşım: Pompala OMW | Basınç = ICP &rarr; 2. Dolaşım: Pompala KMW | Basınç = FCP
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>2. Wait and Weight Method (Mühendis Yöntemi)</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {lang === 'tr'
                  ? 'Tek tam dolaşım turu gerektirir. Kuyu kapatıldıktan sonra çamur tanklarında derhal KMW ağırlıklı çamur hazırlanana kadar beklenir. Tek seferde gaz tahliye edilirken arkasından öldürme çamuru basılır. Muhafaza pabucundaki tepe basıncı daha düşüktür.'
                  : 'Executes kill in a single circulation. The well remains shut in while mud is weighted to KMW. Pumping KMW displaces the influx simultaneously, minimizing peak shoe pressures.'}
              </p>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-400">
                Tek Dolaşım: ICP &rarr; FCP Basınç Düşüş Programı (Strokes / Pressure Chart)
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="space-y-3">
            {WELL_CONTROL_CONCEPTS.map((c, i) => (
              <div key={i} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>{resolveText(c.title)}</span>
                </h3>
                <p className="text-slate-300 leading-relaxed text-[11px]">{resolveText(c.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
