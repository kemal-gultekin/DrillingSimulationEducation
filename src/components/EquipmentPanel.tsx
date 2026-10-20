import React, { useState } from 'react';
import { EQUIPMENT_LIST } from '../data/equipment';
import { CAMERA_PRESETS } from '../data/focus';
import { EquipmentCategory } from '../types';
import { useI18n } from '../i18n';
import { 
  Search, 
  Layers, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Footprints
} from 'lucide-react';

interface EquipmentPanelProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectCameraPreset: (presetId: string) => void;
  activePresetId?: string;
  onStartGuidedTour?: () => void;
  onHoverItem?: (id: string | null) => void;
}

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({
  selectedId,
  onSelect,
  onSelectCameraPreset,
  activePresetId,
  onStartGuidedTour,
  onHoverItem
}) => {
  const { t, resolveText } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all');

  const categories: { key: EquipmentCategory | 'all'; labelKey: string }[] = [
    { key: 'all', labelKey: 'equipment.allCategories' },
    { key: 'hoisting', labelKey: 'equipment.categoryHoisting' },
    { key: 'rotating', labelKey: 'equipment.categoryRotating' },
    { key: 'circulating', labelKey: 'equipment.categoryCirculating' },
    { key: 'wellcontrol', labelKey: 'equipment.categoryWellcontrol' },
    { key: 'power', labelKey: 'equipment.categoryPower' },
    { key: 'monitoring', labelKey: 'equipment.categoryMonitoring' },
    { key: 'surface', labelKey: 'equipment.categorySurface' }
  ];

  const filteredEquipment = EQUIPMENT_LIST.filter((item) => {
    const itemName = resolveText(item.name).toLowerCase();
    const itemTurkish = (item.turkishName || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = itemName.includes(query) || itemTurkish.includes(query);
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isCollapsed) {
    return (
      <button
        id="expand-equipment-panel-btn"
        onClick={() => setIsCollapsed(false)}
        className="absolute top-16 left-4 z-20 bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 p-2.5 rounded-xl shadow-xl text-slate-200 hover:text-amber-400 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md select-none"
        title={t('equipment.title')}
      >
        <Layers className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-semibold">{t('equipment.title')} ({EQUIPMENT_LIST.length})</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <div
      id="equipment-panel"
      className="absolute top-16 left-4 z-20 w-80 max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 transition-all duration-300 select-none"
    >
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white">{t('equipment.title')}</h3>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
            {filteredEquipment.length}
          </span>
        </div>
        <button
          id="collapse-equipment-panel-btn"
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={t('common.close')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Presets Bar */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5 font-medium">
          <Video className="w-3.5 h-3.5 text-sky-400" />
          <span>{t('equipment.cameraPresets')}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {CAMERA_PRESETS.slice(0, 6).map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`cam-preset-${preset.id}`}
                onClick={() => onSelectCameraPreset(preset.id)}
                className={`py-1 px-1.5 rounded text-[10px] font-semibold truncate transition-colors cursor-pointer text-center ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                }`}
                title={resolveText(preset.description)}
              >
                {resolveText(preset.name, preset.turkishName)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guided Tour Banner Button */}
      {onStartGuidedTour && (
        <div className="px-3 pt-2.5 pb-1">
          <button
            id="start-guided-tour-btn"
            onClick={onStartGuidedTour}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all cursor-pointer shadow-sm group"
          >
            <Footprints className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{t('equipment.startGuidedTour')}</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="equipment-search-input"
            type="text"
            placeholder={t('equipment.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-3 py-2 border-b border-slate-800 flex gap-1 overflow-x-auto text-[11px] scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.key}
            id={`filter-${c.key}`}
            onClick={() => setActiveCategory(c.key)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === c.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      {/* Equipment List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredEquipment.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-xs">
            {t('common.empty')}
          </div>
        ) : (
          filteredEquipment.map((item) => {
            const isSelected = selectedId === item.id;
            const displayName = resolveText(item.name, item.turkishName || '');
            return (
              <button
                key={item.id}
                id={`equipment-item-${item.id}`}
                onClick={() => onSelect(item.id)}
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                    : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{displayName}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{item.category}</span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-amber-400' : 'bg-slate-600 group-hover:bg-amber-400/50'
                  }`}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
