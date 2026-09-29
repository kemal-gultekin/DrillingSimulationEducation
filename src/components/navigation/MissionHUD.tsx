import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Pause, 
  Play, 
  Compass, 
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { GuidedMission } from '../../types';

interface MissionHUDProps {
  activeMission: GuidedMission | null;
  currentMissionIndex: number;
  totalMissions: number;
  completedMissionIds: string[];
  isActive: boolean;
  onStartTour: () => void;
  onPauseTour: () => void;
  onRestartTour: () => void;
  onSelectMissionIndex?: (index: number) => void;
  isJustCompleted?: boolean;
  nearbyEquipmentId?: string | null;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
  activeMission,
  currentMissionIndex,
  totalMissions,
  completedMissionIds,
  isActive,
  onStartTour,
  onPauseTour,
  onRestartTour,
  onSelectMissionIndex,
  isJustCompleted = false,
  nearbyEquipmentId
}) => {
  const [showHint, setShowHint] = useState(false);

  const isAllCompleted = completedMissionIds.length >= totalMissions && totalMissions > 0;
  const isTargetNearby = activeMission && nearbyEquipmentId === activeMission.targetEquipmentId;

  // 1. Minimized / Inactive floating launcher in Walk mode
  if (!isActive) {
    return (
      <div 
        id="mission-hud-inactive"
        className="absolute top-4 left-6 z-20 pointer-events-auto"
      >
        <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-2 pl-3.5 shadow-2xl shadow-black/50 text-slate-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-left mr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                Rehberli Saha Turu
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                {completedMissionIds.length}/{totalMissions}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {isAllCompleted ? 'Tüm görevler tamamlandı' : 'Sıralı saha keşif görevleri'}
            </p>
          </div>

          <button
            id="start-mission-tour-btn"
            onClick={isAllCompleted ? onRestartTour : onStartTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            {isAllCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tekrarla</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{completedMissionIds.length > 0 ? 'Devam Et' : 'Turu Başlat'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 2. All Missions Completed Celebration View
  if (isAllCompleted && !isJustCompleted) {
    return (
      <div 
        id="mission-hud-completed"
        className="absolute top-4 left-6 z-20 w-84 max-w-[calc(100vw-3rem)] pointer-events-auto"
      >
        <div className="bg-slate-950/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-950/30 text-slate-200">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Saha Oryantasyonu Tamamlandı
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                Tüm Görevler Başarıyla Bitti!
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Tebrikler! Sondaj sahasındaki 8 kritik ekipmanı yürüyüş modunda bizzat ziyaret edip teknik özelliklerini incelediniz.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onRestartTour}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Turu Baştan Al</span>
            </button>
            <button
              onClick={onPauseTour}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Mission HUD
  return (
    <div 
      id="mission-hud-active"
      className="absolute top-4 left-6 z-20 w-88 max-w-[calc(100vw-3rem)] pointer-events-auto"
    >
      <div 
        className={`backdrop-blur-md rounded-2xl p-3.5 shadow-2xl transition-all duration-300 ${
          isJustCompleted
            ? 'bg-emerald-950/90 border-2 border-emerald-400 shadow-emerald-500/30'
            : isTargetNearby
            ? 'bg-slate-950/95 border-2 border-amber-400 shadow-amber-500/25 ring-2 ring-amber-400/30'
            : 'bg-slate-950/92 border border-slate-700/80 shadow-black/60'
        }`}
      >
        {/* Top Mission Counter & Controls */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isJustCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500/20 text-amber-400'}`}>
              {isJustCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Görev {currentMissionIndex + 1} / {totalMissions}
                </span>
                {completedMissionIds.includes(activeMission?.id || '') && !isJustCompleted && (
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30">
                    Tamamlandı
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Step navigation */}
            {onSelectMissionIndex && currentMissionIndex > 0 && (
              <button
                onClick={() => onSelectMissionIndex(currentMissionIndex - 1)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Önceki Görev"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {onSelectMissionIndex && currentMissionIndex < totalMissions - 1 && (
              <button
                onClick={() => onSelectMissionIndex(currentMissionIndex + 1)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Sonraki Görev"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Pause tour */}
            <button
              onClick={onPauseTour}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Turu Duraklat / Gizle"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Visual segments) */}
        <div className="w-full grid grid-cols-8 gap-1 mb-2.5">
          {Array.from({ length: totalMissions }).map((_, idx) => {
            const isDone = completedMissionIds.length > idx;
            const isCurrent = currentMissionIndex === idx;
            return (
              <div
                key={`progress-seg-${idx}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-400'
                    : isCurrent
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        {/* Just Completed Flash Banner */}
        {isJustCompleted ? (
          <div className="py-2 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>GÖREV TAMAMLANDI!</span>
            </div>
            <p className="text-xs font-medium text-emerald-100">
              {activeMission?.turkishTitle} başarıyla incelendi.
            </p>
            <p className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
              Sıradaki göreve geçiliyor...
            </p>
          </div>
        ) : (
          <>
            {/* Objective Title */}
            <div className="mb-1.5">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>{activeMission?.title}</span>
              </h4>
              <p className="text-[11px] text-amber-300/90 font-medium">
                {activeMission?.turkishTitle}
              </p>
            </div>

            {/* Instruction description */}
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              {activeMission?.turkishInstruction}
            </p>

            {/* Target Nearby Notification */}
            {isTargetNearby ? (
              <div className="bg-amber-500/20 border border-amber-400/80 rounded-xl p-2 flex items-center justify-between gap-2 text-amber-200 mb-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center">
                    E
                  </div>
                  <span className="text-[11px] font-bold">Hedefe ulaştınız! [E] İncele</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">
                  Hazır
                </span>
              </div>
            ) : (
              /* Hint Toggle */
              <div className="mb-1">
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3 text-amber-400/80" />
                  <span>{showHint ? 'İpucunu Gizle' : 'Nerede Bulabilirim? (İpucu)'}</span>
                </button>
                {showHint && (
                  <div className="mt-1.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 leading-normal animate-in fade-in duration-150">
                    <span className="text-amber-400 font-bold block mb-0.5">Konum İpucu:</span>
                    {activeMission?.turkishHint}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
