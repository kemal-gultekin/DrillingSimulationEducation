import React, { useState } from 'react';
import { calculateKillSheet, WELL_CONTROL_CONCEPTS } from '../data/wellControl';
import { 
  ShieldCheck, 
  Layers, 
  HelpCircle, 
  TrendingDown, 
  Sliders, 
  BookOpen, 
  Flame, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

interface WellControlPanelProps {
  onPracticeRecorded?: () => void;
}

export const WellControlPanel: React.FC<WellControlPanelProps> = ({
  onPracticeRecorded
}) => {
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
      className="absolute top-16 left-4 z-20 w-[470px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Well Control (Kuyu Kontrolü) Eğitimi</h2>
            <p className="text-[11px] text-slate-400">Kill Sheet Hesabı & Kuyu Öldürme Metotları</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            id="tab-killsheet"
            onClick={() => setActiveTab('killsheet')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'killsheet'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kill Sheet
          </button>
          <button
            id="tab-methods"
            onClick={() => setActiveTab('methods')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'methods'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kuyu Öldürme Yöntemleri
          </button>
          <button
            id="tab-concepts"
            onClick={() => setActiveTab('concepts')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'concepts'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kritik Kavramlar
          </button>
        </div>
      </div>

      {/* Tab 1: Kill Sheet Calculator */}
      {activeTab === 'killsheet' && (
        <div className="p-4 space-y-4 text-xs">
          {/* Key Calculated Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-gradient-to-br from-amber-500/10 to-slate-950 p-3 rounded-xl border border-amber-500/40 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Gereken Öldürme Çamuru</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{killSheet.killMudWeight}</span>
              <span className="text-xs text-slate-300 ml-1">ppg (KMW)</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">OMW: {omw} ppg</span>
            </div>

            <div className="bg-gradient-to-br from-sky-500/10 to-slate-950 p-3 rounded-xl border border-sky-500/40 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Formasyon Basıncı (P_form)</span>
              <span className="text-2xl font-black text-sky-400 font-mono">{killSheet.formationPressure}</span>
              <span className="text-xs text-slate-300 ml-1">psi</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">SIDPP: {sidpp} psi</span>
            </div>
          </div>

          {/* Secondary Kill Sheet Values */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block font-sans">İlk Dolaşım (ICP)</span>
              <span className="text-sm font-bold text-slate-200">{killSheet.icp}</span>
              <span className="text-[10px] text-slate-500 ml-1">psi</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block font-sans">Son Dolaşım (FCP)</span>
              <span className="text-sm font-bold text-slate-200">{killSheet.fcp}</span>
              <span className="text-[10px] text-slate-500 ml-1">psi</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block font-sans">MAASP Sınırı</span>
              <span className="text-sm font-bold text-amber-400">{killSheet.maasp}</span>
              <span className="text-[10px] text-slate-500 ml-1">psi</span>
            </div>
          </div>

          {/* Influx Fluid Diagnostics */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300">Teşhis Edilen Akışkan Tipi:</span>
              <span className="font-mono text-amber-400 font-bold">
                {killSheet.influxDensity} ppg ({killSheet.influxHeight} ft)
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              {killSheet.influxType}
            </div>
          </div>

          {/* Sliders / Inputs */}
          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="text-slate-300 font-semibold text-xs border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>Saha ve Kuyu Verileri</span>
              <span className="text-[10px] text-slate-500 font-normal">Değerleri değiştirerek hesaplayın</span>
            </div>

            {/* TVD */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Kuyu TVD (ft):</span>
                <span className="font-mono font-bold text-white">{tvd} ft</span>
              </div>
              <input
                type="range"
                min={3000}
                max={20000}
                step={100}
                value={tvd}
                onChange={(e) => {
                  setTvd(Number(e.target.value));
                  handleInputChange();
                }}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
              />
            </div>

            {/* OMW */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Mevcut Çamur (OMW):</span>
                <span className="font-mono font-bold text-amber-400">{omw} ppg</span>
              </div>
              <input
                type="range"
                min={8.5}
                max={16.0}
                step={0.1}
                value={omw}
                onChange={(e) => {
                  setOmw(Number(e.target.value));
                  handleInputChange();
                }}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
              />
            </div>

            {/* SIDPP */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Kapalı Boru Basıncı (SIDPP):</span>
                <span className="font-mono font-bold text-sky-400">{sidpp} psi</span>
              </div>
              <input
                type="range"
                min={50}
                max={1500}
                step={10}
                value={sidpp}
                onChange={(e) => {
                  setSidpp(Number(e.target.value));
                  handleInputChange();
                }}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
              />
            </div>

            {/* SICP */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Kapalı Anülüs Basıncı (SICP):</span>
                <span className="font-mono font-bold text-red-400">{sicp} psi</span>
              </div>
              <input
                type="range"
                min={100}
                max={2500}
                step={10}
                value={sicp}
                onChange={(e) => {
                  setSicp(Number(e.target.value));
                  handleInputChange();
                }}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
              />
            </div>

            {/* Slow Circulating Rate Pressure */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Düşük Debi Pompa Basıncı (SCR @ 30 SPM):</span>
                <span className="font-mono font-bold text-slate-200">{scrPressure} psi</span>
              </div>
              <input
                type="range"
                min={300}
                max={1500}
                step={25}
                value={scrPressure}
                onChange={(e) => {
                  setScrPressure(Number(e.target.value));
                  handleInputChange();
                }}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Methods Comparison */}
      {activeTab === 'methods' && (
        <div className="p-4 space-y-4 text-xs">
          {/* Drillers Method */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-amber-300">1. Driller's Method (Sondör Yöntemi)</h3>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">2 Tur Dolaşım</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              En yaygın kullanılan yöntemdir çünkü barit ağırlıklı çamurun tankta hazırlanmasını beklemeden derhal dolaşıma başlanabilir.
            </p>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">1. Dolaşım Turu (Influx Out):</span>
                Orijinal çamurla (OMW) gaz/petrol anülüsten dışarı atılır. Drill pipe basıncı ICP sabit tutularak choke üzerinden gaz tahliye edilir.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">2. Dolaşım Turu (KMW In):</span>
                Hazırlanan Kill Mud Weight (KMW) kuyuya pompalanır. Çamur matkaba ulaşınca basınç FCP'ye düşer, anülüsten yüzeye dönünce kuyu öldürülür.
              </div>
            </div>
          </div>

          {/* Wait & Weight Method */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-sky-300">2. Wait & Weight (Mühendis Yöntemi)</h3>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">1 Tur Dolaşım</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Kuyu kapatıldıktan sonra çamur tanklarında barit ile gereken Kill Mud Weight (KMW) hazırlanana kadar beklenir.
            </p>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300">
              <span className="font-bold text-sky-400 block mb-0.5">Avantajı (Düşük Yüzey Basıncı):</span>
              Ağır çamur anülüste yükselirken hidrostatik sütun hemen güçlenir; bu sayede muhafaza borusu pabucuna (Casing Shoe) ve yüzey choke manifolduna binen maksimum basınç Driller yöntemine göre çok daha düşüktür.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Key Concepts */}
      {activeTab === 'concepts' && (
        <div className="p-4 space-y-3 text-xs">
          {WELL_CONTROL_CONCEPTS.map((concept, idx) => (
            <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{concept.title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {concept.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
