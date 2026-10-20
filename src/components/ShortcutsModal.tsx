import React from 'react';
import { useI18n } from '../i18n';
import { 
  Keyboard, 
  X, 
  Eye, 
  RotateCcw, 
  Layers, 
  Minimize2, 
  EyeOff, 
  Maximize2, 
  Compass, 
  MousePointer,
  Sparkles
} from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t, lang } = useI18n();

  if (!isOpen) return null;

  const shortcutsList = [
    {
      key: 'F',
      action: t('shortcuts.focus'),
      description: lang === 'tr' ? 'Seçili objeye 700ms yumuşak easing ile yaklaşır' : 'Flies camera to selected equipment with 700ms smooth easing',
      icon: <Eye className="w-4 h-4 text-amber-400" />
    },
    {
      key: 'R',
      action: t('shortcuts.reset'),
      description: lang === 'tr' ? 'Kamerayı standart kule genel bakış açısına döndürür' : 'Smoothly returns camera to standard overview angle',
      icon: <RotateCcw className="w-4 h-4 text-sky-400" />
    },
    {
      key: 'G',
      action: t('shortcuts.subsurface'),
      description: lang === 'tr' ? 'Zemini saydamlaştırır; 15.000 ft stratigrafi, casing ve BHA\'yı açar' : 'Transparents ground; reveals 15,000 ft formations, casing strings & bit',
      icon: <Layers className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'I',
      action: t('shortcuts.isolate'),
      description: lang === 'tr' ? 'Seçili objeyi tek başına gösterir, diğerlerini gizler' : 'Isolates active equipment, hiding surrounding rig structure',
      icon: <Minimize2 className="w-4 h-4 text-indigo-400" />
    },
    {
      key: 'D',
      action: t('shortcuts.fadeOthers'),
      description: lang === 'tr' ? 'Diğer bileşenleri %20 saydamlığa düşürür (ghost mode)' : 'Dims unselected objects to semi-transparent ghost mode',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />
    },
    {
      key: 'H',
      action: t('shortcuts.hide'),
      description: lang === 'tr' ? 'Seçili ekipmanı geçici olarak sahnede gizler' : 'Temporarily hides the currently selected component',
      icon: <EyeOff className="w-4 h-4 text-rose-400" />
    },
    {
      key: 'U',
      action: t('shortcuts.unhideAll'),
      description: lang === 'tr' ? 'Tüm gizlenen veya filtrelenen parçaları normale çevirir' : 'Restores all hidden or faded components to normal visibility',
      icon: <Maximize2 className="w-4 h-4 text-teal-400" />
    },
    {
      key: 'X',
      action: t('shortcuts.internals'),
      description: lang === 'tr' ? 'İç mekanik ve hidrolik kanalları gösteren X-Ray modu' : 'X-Ray wireframe view revealing inner mechanical channels',
      icon: <Compass className="w-4 h-4 text-cyan-400" />
    }
  ];

  return (
    <div
      id="shortcuts-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="shortcuts-modal-content"
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{t('shortcuts.title')}</h3>
              <p className="text-xs text-slate-400">PetroSim 3D Navigation & Inspection Hotkeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcutsList.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800/60 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{item.action}</h4>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>
              </div>
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg font-mono text-xs font-bold text-amber-300 shadow-sm shrink-0">
                {item.key}
              </kbd>
            </div>
          ))}

          {/* Mouse & Touch navigation tips */}
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/10 via-slate-900 to-sky-500/10 border border-amber-500/30 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <MousePointer className="w-3.5 h-3.5" />
              <span>{lang === 'tr' ? 'Fare & Dokunmatik Kontrolleri' : 'Mouse & Touch Controls'}</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4 marker:text-amber-400">
              <li>{t('shortcuts.orbitHint')}</li>
              <li>{t('shortcuts.doubleClickHint')}</li>
              <li>{lang === 'tr' ? 'Mobil / Tablet: Tek parmak döndürür, iki parmak yaklaştırır ve kaydırır.' : 'Mobile/Tablet: One finger orbits, pinch zooms and two-finger pans.'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
