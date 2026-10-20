import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../i18n';
import { FORMATION_LAYERS, CASING_PROGRAM } from '../../data/subsurface';
import { DownholeOperationPhase } from '../../types';
import { 
  Layers, 
  Play, 
  Pause, 
  Gauge, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  ArrowDownCircle, 
  Sparkles,
  RotateCcw,
  Zap,
  Droplets,
  Activity,
  Compass
} from 'lucide-react';

interface SubsurfaceHUDProps {
  currentDepth: number;           // in ft (0 - 15000)
  onChangeDepth: (depth: number) => void;
  isDrilling: boolean;
  onToggleDrilling: () => void;
  speedMultiplier: number;
  onChangeSpeed: (spd: number) => void;
  phase: DownholeOperationPhase;
  onChangePhase: (phase: DownholeOperationPhase) => void;
  kickActive: boolean;
  onTriggerKick: () => void;
  isBopClosed: boolean;
  onShutInBop: () => void;
  onResetKick: () => void;
  onCloseSubsurface: () => void;
}

export const SubsurfaceHUD: React.FC<SubsurfaceHUDProps> = ({
  currentDepth,
  onChangeDepth,
  isDrilling,
  onToggleDrilling,
  speedMultiplier,
  onChangeSpeed,
  phase,
  onChangePhase,
  kickActive,
  onTriggerKick,
  isBopClosed,
  onShutInBop,
  onResetKick,
  onCloseSubsurface
}) => {
  const { t, lang, resolveText } = useI18n();
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Unit conversion helper
  const formatDepth = (feetVal: number) => {
    if (unit === 'm') {
      return `${Math.round(feetVal * 0.3048).toLocaleString()} m`;
    }
    return `${Math.round(feetVal).toLocaleString()} ft`;
  };

  // Determine active formation based on current depth
  const currentFormation = FORMATION_LAYERS.find(
    (f) => currentDepth >= f.depthStart && currentDepth < f.depthEnd
  ) || FORMATION_LAYERS[FORMATION_LAYERS.length - 1];

  // Dynamic telemetry calculations based on depth & rock hardness
  const baseRop = isDrilling ? Math.max(12, Math.round(95 / currentFormation.rockHardness)) : 0;
  const rop = isDrilling ? baseRop : 0;
  const wob = isDrilling ? Math.round(24 + currentFormation.rockHardness * 1.8) : 0;
  const rpm = isDrilling ? 120 : (phase === 'tripping' ? 0 : 40);
  const mudWeight = kickActive ? 10.2 : (currentDepth > 11800 ? 11.8 : 10.8);
  const pumpPressure = kickActive ? (isBopClosed ? 680 : 3450) : (isDrilling ? 2850 + Math.round(currentDepth * 0.05) : 0);
  const flowRate = kickActive ? (isBopClosed ? 0 : 850) : (isDrilling ? 620 : 0);
  const hookLoad = Math.round(180 + (currentDepth / 15000) * 120);

  // Educational Context Explanation based on depth and phase
  const getDownholeContext = () => {
    if (kickActive) {
      if (isBopClosed) {
        return {
          title: lang === 'tr' ? 'BOP Kapalı: Kuyu Güvenceye Alındı' : 'BOP Closed: Well Secured',
          text: t('subsurface.wellShutInDesc')
        };
      }
      return {
        title: lang === 'tr' ? 'Acil Durum: Kuyuya Gaz Akışı Başladı' : 'Emergency: Formation Gas Influx',
        text: t('subsurface.kickWarningDesc')
      };
    }

    if (phase === 'tripping') {
      return {
        title: lang === 'tr' ? 'Boru Manevrası (Trip In / Trip Out)' : 'Tripping Pipe',
        text: t('downholeExplanations.trippingNotice')
      };
    }

    if (phase === 'casing') {
      return {
        title: lang === 'tr' ? 'Casing & Çimentolama İzolasyonu' : 'Casing & Cementing Isolation',
        text: t('downholeExplanations.casingNotice')
      };
    }

    // By Depth
    if (currentDepth < 1000) {
      return {
        title: lang === 'tr' ? 'Akifer Koruması & Yüzey Casing' : 'Aquifer Protection & Surface Casing',
        text: t('downholeExplanations.shallow')
      };
    }
    if (currentDepth < 8200) {
      return {
        title: lang === 'tr' ? 'Reaktif Şeyl Formasyonu' : 'Reactive Marine Shale',
        text: t('downholeExplanations.shale')
      };
    }
    if (currentDepth < 11800) {
      return {
        title: lang === 'tr' ? 'Kireçtaşı & Kaçak Riski' : 'Limestone & Lost Circulation Risk',
        text: t('downholeExplanations.limestone')
      };
    }
    return {
      title: lang === 'tr' ? 'Rezervuar Geçişi & Overbalance' : 'Pay Zone Penetration & Overbalance',
      text: t('downholeExplanations.reservoirDrilling')
    };
  };

  const contextInfo = getDownholeContext();

  return (
    <>
      {/* ================= 1. LEFT SIDE: VERTICAL DEPTH RULER ================= */}
      <div
        id="subsurface-depth-ruler"
        className="absolute top-16 left-4 bottom-20 w-32 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-2.5 flex flex-col justify-between select-none z-30 font-sans"
      >
        {/* Ruler Header & Unit Switcher */}
        <div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              {t('subsurface.depthRuler')}
            </span>
            {/* Unit Toggle: ft <-> m */}
            <button
              onClick={() => setUnit((u) => (u === 'ft' ? 'm' : 'ft'))}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer"
              title="Birim Değiştir (ft / m)"
            >
              {unit.toUpperCase()}
            </button>
          </div>

          {/* Current Depth readout at top */}
          <div className="mt-2 text-center bg-slate-900/90 p-1.5 rounded-lg border border-amber-500/40">
            <div className="text-[9px] text-slate-400 font-mono">BIT DEPTH</div>
            <div className="text-sm font-extrabold text-amber-400 font-mono leading-none">
              {formatDepth(currentDepth)}
            </div>
          </div>
        </div>

        {/* Stratigraphic Layer Depth Scale Bar */}
        <div className="relative flex-1 my-3 bg-slate-900/60 rounded-lg overflow-hidden border border-slate-800 flex flex-col justify-between p-1">
          {/* Stratigraphic color bands */}
          {FORMATION_LAYERS.map((layer) => {
            const heightPercent = ((layer.depthEnd - layer.depthStart) / 15000) * 100;
            const isCurrent = currentFormation.id === layer.id;
            return (
              <div
                key={layer.id}
                style={{ height: `${heightPercent}%`, backgroundColor: layer.color }}
                className={`w-full opacity-60 transition-opacity relative group ${
                  isCurrent ? 'opacity-100 ring-1 ring-amber-400' : ''
                }`}
                title={`${resolveText(layer.name)}: ${formatDepth(layer.depthStart)} - ${formatDepth(layer.depthEnd)}`}
              >
                <span className="absolute left-1 top-0.5 text-[8px] font-bold text-white/90 truncate max-w-[80px]">
                  {formatDepth(layer.depthStart)}
                </span>
              </div>
            );
          })}

          {/* Animated Bit Depth Indicator Needle */}
          <div
            style={{ top: `${(currentDepth / 15000) * 94}%` }}
            className="absolute left-0 right-0 h-1.5 bg-amber-400 shadow-md shadow-amber-400/80 -translate-y-1/2 flex items-center transition-all duration-100 pointer-events-none"
          >
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-400 -ml-1 border border-slate-950" />
            <div className="ml-auto mr-1 text-[8px] font-mono font-bold bg-slate-950 text-amber-300 px-1 rounded border border-amber-500/60">
              BIT
            </div>
          </div>

          {/* Casing shoe markers along ruler */}
          {CASING_PROGRAM.map((c) => {
            const shoePercent = (c.shoeDepth / 15000) * 94;
            return (
              <div
                key={`ruler-shoe-${c.id}`}
                style={{ top: `${shoePercent}%` }}
                className="absolute right-0.5 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none"
                title={`${resolveText(c.name)} Shoe: ${formatDepth(c.shoeDepth)}`}
              >
                <div
                  style={{ backgroundColor: c.shoeColor }}
                  className="w-2 h-1 rounded-sm shadow-sm"
                />
              </div>
            );
          })}
        </div>

        {/* Ruler Bottom: TD (Total Depth) */}
        <div className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-slate-800">
          TD: {formatDepth(15000)}
        </div>
      </div>

      {/* ================= 2. TOP RIGHT: TELEMETRY & OPERATION HUD ================= */}
      <div
        id="subsurface-telemetry-hud"
        className="absolute top-16 right-4 w-96 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-200 select-none z-30 font-sans space-y-3"
      >
        {/* HUD Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-white tracking-tight">
                {t('subsurface.hudTitle')}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {currentFormation ? resolveText(currentFormation.name) : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onCloseSubsurface}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            {t('subsurface.exitBtn')}
          </button>
        </div>

        {/* Operation Phase Selector */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">
            {t('subsurface.phaseTitle')}
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-semibold">
            {(['drilling', 'tripping', 'casing', 'wellcontrol'] as DownholeOperationPhase[]).map((p) => {
              const isActive = phase === p;
              let label = t('subsurface.phaseDrilling');
              if (p === 'tripping') label = t('subsurface.phaseTripping');
              if (p === 'casing') label = t('subsurface.phaseCasing');
              if (p === 'wellcontrol') label = t('subsurface.phaseWellControl');

              return (
                <button
                  key={p}
                  onClick={() => onChangePhase(p)}
                  className={`py-1.5 px-2 rounded-lg border transition-all text-left truncate cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Gauges Matrix */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-center font-mono">
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">ROP</div>
            <div className="text-xs font-bold text-emerald-400">{rop}</div>
            <div className="text-[8px] text-slate-500">ft/hr</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">WOB</div>
            <div className="text-xs font-bold text-amber-400">{wob}</div>
            <div className="text-[8px] text-slate-500">klbs</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">RPM</div>
            <div className="text-xs font-bold text-sky-400">{rpm}</div>
            <div className="text-[8px] text-slate-500">rpm</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">MUD</div>
            <div className="text-xs font-bold text-teal-400">{mudWeight.toFixed(1)}</div>
            <div className="text-[8px] text-slate-500">ppg</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">SPP</div>
            <div className="text-xs font-bold text-indigo-400">{pumpPressure}</div>
            <div className="text-[8px] text-slate-500">psi</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">FLOW</div>
            <div className="text-xs font-bold text-cyan-400">{flowRate}</div>
            <div className="text-[8px] text-slate-500">gpm</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">HOOK</div>
            <div className="text-xs font-bold text-purple-400">{hookLoad}</div>
            <div className="text-[8px] text-slate-500">klbs</div>
          </div>
          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400">PORE</div>
            <div className="text-xs font-bold text-rose-400">
              {Math.round(currentDepth * currentFormation.porePressureGradient)}
            </div>
            <div className="text-[8px] text-slate-500">psi</div>
          </div>
        </div>

        {/* Depth Scrubbing Controller & Drilling Multiplier */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">{t('subsurface.bitDepthControl')}</span>
            <span className="font-mono font-bold text-amber-400">{formatDepth(currentDepth)}</span>
          </div>

          <input
            id="bit-depth-slider"
            type="range"
            min="0"
            max="15000"
            step="50"
            value={currentDepth}
            onChange={(e) => onChangeDepth(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          {/* Play/Pause Drilling & Time Multiplier */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={onToggleDrilling}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                isDrilling
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isDrilling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isDrilling ? t('subsurface.pauseDrilling') : t('subsurface.startDrilling')}</span>
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
              {[1, 10, 100].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    speedMultiplier === s
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* "Şu An Aşağıda Neler Oluyor?" Educational Box */}
        <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t('subsurface.downholeContextTitle')}</span>
          </div>
          <h4 className="text-xs font-semibold text-slate-200">{contextInfo.title}</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed italic">
            {contextInfo.text}
          </p>
        </div>

        {/* Kick Event Integration & BOP Shut-In */}
        <div className="pt-1">
          {!kickActive ? (
            <button
              onClick={onTriggerKick}
              className="w-full py-2 px-3 bg-gradient-to-r from-red-950/60 to-orange-950/60 hover:from-red-900/60 hover:to-orange-900/60 border border-red-500/40 rounded-xl text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              <span>{t('subsurface.triggerKickBtn')}</span>
            </button>
          ) : (
            <div className="p-3 bg-red-950/70 border-2 border-red-500 rounded-xl space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-red-200 font-extrabold text-xs">
                <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
                <span>{t('subsurface.kickWarningTitle')}</span>
              </div>
              <p className="text-[11px] text-red-300 leading-snug">
                {t('subsurface.kickWarningDesc')}
              </p>

              {!isBopClosed ? (
                <button
                  onClick={onShutInBop}
                  className="w-full py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg shadow-lg shadow-red-600/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t('subsurface.shutInBopBtn')}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('subsurface.wellShutInSuccess')}</span>
                  </div>
                  <button
                    onClick={onResetKick}
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {t('subsurface.resetKickBtn')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educational Disclaimer Badge */}
        <div className="text-[9px] text-slate-500 text-center font-mono pt-1">
          {t('subsurface.disclaimer')}
        </div>
      </div>
    </>
  );
};
