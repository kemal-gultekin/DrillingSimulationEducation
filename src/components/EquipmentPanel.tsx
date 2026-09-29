import React, { useState } from 'react';
import { EQUIPMENT_LIST } from '../data/equipment';
import { CAMERA_PRESETS } from '../data/focus';
import { EquipmentCategory } from '../types';
import { 
  Search, 
  Layers, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  ChevronDown,
  Compass,
  Footprints
} from 'lucide-react';

interface EquipmentPanelProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectCameraPreset: (presetId: string) => void;
  activePresetId?: string;
  onStartGuidedTour?: () => void;
}

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({
  selectedId,
  onSelect,
  onSelectCameraPreset,
  activePresetId,
  onStartGuidedTour
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all');

  const categories: { key: EquipmentCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'hoisting', label: 'Kaldırma' },
    { key: 'rotating', label: 'Döndürme' },
    { key: 'circulating', label: 'Sirkülasyon' },
    { key: 'wellcontrol', label: 'Kuyu Kontrol' },
    { key: 'power', label: 'Güç' },
    { key: 'monitoring', label: 'İzleme' },
    { key: 'surface', label: 'Yüzey' }
  ];

  const filteredEquipment = EQUIPMENT_LIST.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.turkishName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isCollapsed) {
    return (
      <button
        id="expand-equipment-panel-btn"
        onClick={() => setIsCollapsed(false)}
        className="absolute top-16 left-4 z-20 bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 p-2.5 rounded-xl shadow-xl text-slate-200 hover:text-amber-400 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
        title="Ekipman Listesini Aç"
      >
        <Layers className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-semibold">Ekipmanlar ({EQUIPMENT_LIST.length})</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <div
      id="equipment-panel"
      className="absolute top-16 left-4 z-20 w-80 max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 transition-all duration-300"
    >
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white">Sondaj Sahası Ekipmanları</h3>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
            {filteredEquipment.length}
          </span>
        </div>
        <button
          id="collapse-equipment-panel-btn"
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Paneli Gizle"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Presets Bar */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5 font-medium">
          <Video className="w-3.5 h-3.5 text-sky-400" />
          <span>Kamera Açıları (Hızlı Bakış)</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {CAMERA_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`cam-preset-${preset.id}`}
                onClick={() => onSelectCameraPreset(preset.id)}
                className={`text-[10px] py-1 px-1.5 rounded truncate text-left transition-colors border font-medium ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-slate-700/50'
                }`}
                title={preset.description}
              >
                {preset.turkishName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guided Tour Walk Mode Entry */}
      {onStartGuidedTour && (
        <div className="px-3 py-2 border-b border-slate-800 bg-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Rehberli Saha Turu</span>
              <span className="text-[10px] text-slate-400">Yürüyüş modunda 8 adımlı keşif</span>
            </div>
          </div>
          <button
            id="start-guided-tour-panel-btn"
            onClick={onStartGuidedTour}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            title="Yürüyüş Moduna Geç ve Rehberli Görevleri Başlat"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Turu Başlat</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            id="equipment-search-input"
            type="text"
            placeholder="Ekipman ara (örn. BOP, Top Drive)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto mt-2 pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          {categories.map((cat) => (
            <button
              key={cat.key}
              id={`cat-filter-${cat.key}`}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-2 py-0.5 text-[10px] rounded-full whitespace-nowrap transition-colors border ${
                activeCategory === cat.key
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Aradığınız kritere uygun ekipman bulunamadı.
          </div>
        ) : (
          filteredEquipment.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                id={`equipment-item-${item.id}`}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-md'
                    : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-semibold truncate group-hover:text-amber-300">
                    {item.turkishName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{item.name}</div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    {item.category}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
