import React from 'react';
import { EquipmentItem } from '../types';
import { useI18n } from '../i18n';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Eye, 
  Link2,
  BookOpen
} from 'lucide-react';

interface InfoCardProps {
  equipment: EquipmentItem;
  onClose: () => void;
  onFocusCamera: () => void;
  onJumpToSafety?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  equipment,
  onClose,
  onFocusCamera,
  onJumpToSafety
}) => {
  const { t, resolveText, resolveArray, resolveDict, lang } = useI18n();

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'hoisting':
        return { label: t('equipment.categoryHoisting'), color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'rotating':
        return { label: t('equipment.categoryRotating'), color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 'circulating':
        return { label: t('equipment.categoryCirculating'), color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'wellcontrol':
        return { label: t('equipment.categoryWellcontrol'), color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'power':
        return { label: t('equipment.categoryPower'), color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' };
      case 'monitoring':
        return { label: t('equipment.categoryMonitoring'), color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      default:
        return { label: t('equipment.categorySurface'), color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const badge = getCategoryBadge(equipment.category);
  const title = resolveText(equipment.name, equipment.turkishName || '');
  const description = resolveText(equipment.description);
  const workingPrinciple = resolveText(equipment.workingPrinciple);
  const drillingRole = resolveText(equipment.drillingRole);
  const systemConnection = resolveText(equipment.systemConnection);
  const technicalSpecs = resolveDict(equipment.technicalSpecs);
  const safetyHazards = resolveArray(equipment.safetyHazards);
  const maintenanceChecks = resolveArray(equipment.maintenanceChecks);

  return (
    <div
      id="equipment-info-card"
      className="absolute top-16 right-4 w-96 max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-y-auto text-slate-200 z-30 flex flex-col transition-all duration-300 select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-start justify-between">
        <div>
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border mb-1.5 ${badge.color}`}>
            {badge.label}
          </span>
          <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
          {equipment.turkishName && lang === 'en' && (
            <p className="text-xs text-slate-400 font-mono mt-0.5">{equipment.turkishName}</p>
          )}
        </div>
        <button
          id="close-info-card-btn"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={t('equipment.closeCard')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-amber-500 pl-3 italic">
          {description}
        </p>

        {/* Quick Camera Navigation Action */}
        <div className="flex gap-2 pt-1">
          <button
            id="focus-camera-btn"
            onClick={onFocusCamera}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            {t('equipment.focusCamera')}
          </button>
          {onJumpToSafety && (
            <button
              id="related-safety-btn"
              onClick={onJumpToSafety}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
              title={t('equipment.relatedSafetyQuiz')}
            >
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>ISG</span>
            </button>
          )}
        </div>

        {/* Technical Specifications */}
        {Object.keys(technicalSpecs).length > 0 && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs mb-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('equipment.technicalSpecs')}</span>
            </div>
            <div className="space-y-1">
              {Object.entries(technicalSpecs).map(([specKey, specVal]) => (
                <div key={specKey} className="flex justify-between py-0.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-400">{specKey}:</span>
                  <span className="font-mono text-slate-200 font-semibold text-right">{specVal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Working Principle */}
        {workingPrinciple && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('equipment.workingPrinciple')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{workingPrinciple}</p>
          </div>
        )}

        {/* Drilling Role */}
        {drillingRole && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('equipment.drillingRole')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{drillingRole}</p>
          </div>
        )}

        {/* System Connection */}
        {systemConnection && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('equipment.systemConnection')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{systemConnection}</p>
          </div>
        )}

        {/* Safety Hazards */}
        {safetyHazards.length > 0 && (
          <div className="space-y-1.5 bg-amber-950/20 p-3 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('equipment.safetyHazards')}</span>
            </div>
            <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-amber-500">
              {safetyHazards.map((hazard, i) => (
                <li key={i} className="leading-relaxed">{hazard}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Maintenance Checks */}
        {maintenanceChecks.length > 0 && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('equipment.maintenanceChecks')}</span>
            </div>
            <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-emerald-500">
              {maintenanceChecks.map((check, i) => (
                <li key={i} className="leading-relaxed">{check}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Source Standard & Literature Reference */}
        <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-sky-300">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'tr' ? 'Mühendislik Standardı & Kaynak' : 'Engineering Standard & Reference'}</span>
          </div>
          <div className="text-slate-300 font-mono text-[10px]">
            {equipment.referenceStandard || 'API Spec 4F / 7K / 8C & Bourgoyne Applied Drilling Engineering'}
          </div>
        </div>

        {/* Simplified Model Disclaimer */}
        <div className="text-[10px] text-slate-500 font-mono text-center p-1.5 border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          ⚠️ {lang === 'tr' ? 'Eğitim amaçlı basitleştirilmiş 3D modeldir.' : 'Simplified 3D model for educational purposes.'}
        </div>
      </div>
    </div>
  );
};
