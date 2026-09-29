import React from 'react';
import { AppMode, CameraViewMode } from '../types';
import { 
  Layers, 
  ShieldAlert, 
  Calculator, 
  AlertOctagon, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Video, 
  Flame,
  Orbit,
  Footprints
} from 'lucide-react';

interface NavigationHeaderProps {
  currentMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  onResetCamera: () => void;
  isPumping: boolean;
  onTogglePumps: () => void;
  cameraViewMode: CameraViewMode;
  onChangeCameraViewMode: (mode: CameraViewMode) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentMode,
  onChangeMode,
  onResetCamera,
  isPumping,
  onTogglePumps,
  cameraViewMode,
  onChangeCameraViewMode
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: 'explore', label: 'Keşfet', icon: <Layers className="w-4 h-4" /> },
    { id: 'safety', label: 'Güvenlik', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'engineering', label: 'Mühendislik', icon: <Calculator className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Senaryolar', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'wellcontrol', label: 'Kuyu Kontrolü', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'progress', label: 'İlerleme', icon: <Award className="w-4 h-4" /> },
    { id: 'instructor', label: 'Eğitmen', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  return (
    <header
      id="main-navigation-header"
      className="absolute top-0 left-0 right-0 h-14 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/90 z-30 flex items-center justify-between px-4 text-slate-200"
    >
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Flame className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>PetroSim</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Drilling Sim
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium">
              Petrol & Doğalgaz Mühendisliği Eğitim Simülatörü
            </p>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Bar */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`nav-btn-${m.id}`}
              onClick={() => onChangeMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Camera Mode Toggle: Orbit vs Walk */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          id="cam-mode-orbit-btn"
          onClick={() => onChangeCameraViewMode('orbit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            cameraViewMode === 'orbit'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Orbit Kamera: Dışarıdan Kuşbakışı ve Serbest İnceleme"
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Orbit</span>
        </button>
        <button
          id="cam-mode-walk-btn"
          onClick={() => onChangeCameraViewMode('walk')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            cameraViewMode === 'walk'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Yürüyüş Modu: Birinci Şahıs (FPS) Saha İçi Gezinti"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Walk</span>
        </button>
      </div>

      {/* Right Controls: Pump Simulator & Camera Reset */}
      <div className="flex items-center gap-2">
        {/* Circulation Pump Toggle */}
        <button
          id="toggle-pumps-btn"
          onClick={onTogglePumps}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            isPumping
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
          title={isPumping ? 'Çamur Pompalarını Durdur' : 'Çamur Pompalarını Çalıştır'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPumping ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>{isPumping ? 'Pompalar: 60 SPM' : 'Pompalar: Kapalı'}</span>
        </button>

        {/* Camera Reset */}
        <button
          id="reset-camera-btn"
          onClick={onResetCamera}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Kamera Açısını Sıfırla (Saha Kuşbakışı)"
        >
          <Video className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
