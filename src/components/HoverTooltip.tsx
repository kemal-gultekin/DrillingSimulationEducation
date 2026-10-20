import React from 'react';
import { EquipmentItem } from '../types';
import { useI18n } from '../i18n';
import { Layers, Eye, MousePointer } from 'lucide-react';

interface HoverTooltipProps {
  equipment: EquipmentItem | null;
  position: { x: number; y: number } | null;
  visible: boolean;
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({
  equipment,
  position,
  visible
}) => {
  const { t, resolveText } = useI18n();

  if (!visible || !equipment || !position) {
    return null;
  }

  // Viewport clamping to ensure tooltip never goes off-screen
  const tooltipWidth = 270;
  const tooltipHeight = 110;
  const padding = 16;

  let left = position.x + 18;
  let top = position.y + 18;

  if (typeof window !== 'undefined') {
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = Math.max(padding, position.x - tooltipWidth - 14);
    }
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = Math.max(padding, position.y - tooltipHeight - 14);
    }
  }

  const name = resolveText(equipment.name, equipment.turkishName || '');
  
  // Format single-line concise summary
  let descriptionText = '';
  if (equipment.shortDescription) {
    descriptionText = resolveText(equipment.shortDescription);
  } else {
    const fullDesc = resolveText(equipment.description);
    // Take first sentence
    const firstPeriod = fullDesc.indexOf('.');
    descriptionText = firstPeriod !== -1 ? fullDesc.slice(0, firstPeriod + 1) : fullDesc.slice(0, 90) + '...';
  }

  // System category label & color badge
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'hoisting':
        return { label: t('equipment.categoryHoisting'), color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' };
      case 'rotating':
        return { label: t('equipment.categoryRotating'), color: 'text-sky-400 bg-sky-500/20 border-sky-500/30' };
      case 'circulating':
        return { label: t('equipment.categoryCirculating'), color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
      case 'wellcontrol':
        return { label: t('equipment.categoryWellcontrol'), color: 'text-red-400 bg-red-500/20 border-red-500/30' };
      case 'power':
        return { label: t('equipment.categoryPower'), color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' };
      case 'monitoring':
        return { label: t('equipment.categoryMonitoring'), color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' };
      default:
        return { label: t('equipment.categorySurface'), color: 'text-slate-300 bg-slate-700/30 border-slate-600/40' };
    }
  };

  const catInfo = getCategoryInfo(equipment.category);

  return (
    <div
      id="equipment-hover-tooltip"
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-50 pointer-events-none select-none transition-all duration-75 ease-out"
    >
      <div className="w-[270px] bg-slate-950/92 backdrop-blur-md border border-amber-500/40 rounded-xl p-2.5 shadow-2xl shadow-black/80 space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
        {/* Header: Name and Category badge */}
        <div className="flex items-start justify-between gap-1.5 border-b border-slate-800/80 pb-1.5">
          <div className="truncate flex-1">
            <h4 className="text-xs font-bold text-white truncate leading-tight tracking-tight">
              {name}
            </h4>
            <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-medium mt-0.5 ${catInfo.color}`}>
              {catInfo.label}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0 mt-1" />
        </div>

        {/* Single-line concise summary */}
        <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
          {descriptionText}
        </p>

        {/* Action hints footer */}
        <div className="pt-1 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-amber-300/90 font-medium">
            <MousePointer className="w-2.5 h-2.5" />
            <span>{t('hover.clickToSelect')}</span>
          </span>
          <span className="flex items-center gap-1 text-sky-300/90 font-medium">
            <Eye className="w-2.5 h-2.5" />
            <span>[F]</span>
          </span>
        </div>
      </div>
    </div>
  );
};
