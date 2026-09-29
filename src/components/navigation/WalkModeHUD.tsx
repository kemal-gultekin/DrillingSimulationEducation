import React from 'react';
import { MousePointerClick, Eye, User, Layers } from 'lucide-react';
import { NearbyEquipmentInfo, WalkPerspective } from '../../types';

interface WalkModeHUDProps {
  isLocked: boolean;
  nearbyEquipment?: NearbyEquipmentInfo | null;
  isInspecting?: boolean;
  perspective?: WalkPerspective;
  onTogglePerspective?: () => void;
  currentDeck?: string;
}

/**
 * WalkModeHUD:
 * Displays a clean, non-intrusive instruction badge, reticle, 1P/3P perspective toggle,
 * location/deck elevation badge, and [E] Inspect interaction prompt.
 */
export const WalkModeHUD: React.FC<WalkModeHUDProps> = ({
  isLocked,
  nearbyEquipment,
  isInspecting = false,
  perspective = 'first-person',
  onTogglePerspective,
  currentDeck = 'Saha Zemini (Ground Pad)'
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
      {/* Subtle Center Reticle (only in first-person mode) */}
      {perspective === 'first-person' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isLocked ? (
            <div className="relative flex items-center justify-center">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  nearbyEquipment ? 'bg-amber-400 scale-125' : 'bg-white/80'
                } shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all`}
              />
              <div className="absolute w-6 h-[1px] bg-white/20" />
              <div className="absolute h-6 w-[1px] bg-white/20" />
            </div>
          ) : (
            <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 text-amber-200 animate-pulse">
              <MousePointerClick className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="text-xs font-bold text-white">Yürüyüş Modu Aktif</p>
                <p className="text-[11px] text-amber-300/90 font-mono">
                  Ekrana tıklayarak kamerayı kilitleyin ve sahada dolaşın
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Equipment Interaction Prompt [E] Inspect */}
      {nearbyEquipment && !isInspecting && (
        <div className="absolute top-[57%] left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-slate-950/95 backdrop-blur-md border border-amber-400/90 rounded-xl px-4 py-2.5 shadow-[0_0_24px_rgba(245,158,11,0.35)] flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-mono font-black text-sm shadow-md border border-amber-300 animate-pulse">
              E
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Inspect / İncele
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ({nearbyEquipment.distance.toFixed(1)}m)
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-tight">
                {nearbyEquipment.name}
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                {nearbyEquipment.turkishName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Right Walk Mode Badge & Perspective Switcher */}
      <div className="self-end flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-1.5 pl-3 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              {perspective === 'first-person' ? '1P First-Person' : '3P Third-Person'}
            </span>
          </div>

          {/* Perspective Toggle Button [V] */}
          <button
            onClick={onTogglePerspective}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-medium transition-all"
            title="Kamera Bakış Açısını Değiştir (Klavye: V)"
          >
            {perspective === 'first-person' ? (
              <>
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>3P Görünüm</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>1P Görünüm</span>
              </>
            )}
            <kbd className="ml-1 text-[10px] font-mono bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-300">
              V
            </kbd>
          </button>
        </div>

        {/* Current Deck / Elevation Level Indicator */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1 text-slate-300 text-[11px] shadow-md font-mono">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentDeck}</span>
        </div>
      </div>

      {/* Bottom Center Control Instructions Pill */}
      <div className="self-center bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-full px-5 py-2 shadow-2xl flex items-center gap-3 text-xs font-medium text-slate-300 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-amber-300 text-[11px]">
            WASD
          </span>
          <span className="text-slate-200">Yürü</span>
        </div>

        <span className="text-slate-600">•</span>

        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-amber-300 text-[11px]">
            Shift
          </span>
          <span className="text-slate-200">Sprint</span>
        </div>

        <span className="text-slate-600">•</span>

        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-amber-300 text-[11px]">
            V
          </span>
          <span className="text-slate-200">1P/3P</span>
        </div>

        <span className="text-slate-600">•</span>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-1.5 py-0.5 rounded font-mono font-bold text-[11px] transition-colors ${
              nearbyEquipment
                ? 'bg-amber-500 text-slate-950 border border-amber-300 animate-pulse'
                : 'bg-slate-800 border border-slate-700 text-amber-300'
            }`}
          >
            E
          </span>
          <span className={nearbyEquipment ? 'text-amber-200 font-semibold' : 'text-slate-200'}>
            İncele
          </span>
        </div>

        <span className="text-slate-600">•</span>

        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-amber-300 text-[11px]">
            ESC
          </span>
          <span className="text-slate-200">Fareyi Bırak</span>
        </div>
      </div>
    </div>
  );
};
