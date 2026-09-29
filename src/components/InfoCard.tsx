import React from 'react';
import { EquipmentItem } from '../types';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Eye, 
  Link2 
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
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'hoisting':
        return { label: 'Kaldırma Sistemi (Hoisting)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'rotating':
        return { label: 'Döndürme Sistemi (Rotating)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 'circulating':
        return { label: 'Sirkülasyon Sistemi (Circulating)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'wellcontrol':
        return { label: 'Kuyu Kontrolü (Well Control)', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'power':
        return { label: 'Güç Sistemi (Power)', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' };
      case 'monitoring':
        return { label: 'İzleme & Kayıt (Monitoring)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      default:
        return { label: 'Yüzey Tesisi (Surface)', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const badge = getCategoryBadge(equipment.category);

  return (
    <div
      id="equipment-info-card"
      className="absolute top-16 right-4 w-96 max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-y-auto text-slate-200 z-30 flex flex-col transition-all duration-300"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-start justify-between">
        <div>
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border mb-1.5 ${badge.color}`}>
            {badge.label}
          </span>
          <h2 className="text-lg font-bold text-white leading-tight">{equipment.turkishName}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{equipment.name}</p>
        </div>
        <button
          id="close-info-card-btn"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-amber-500 pl-3 italic">
          {equipment.description}
        </p>

        {/* Quick Camera Navigation Action */}
        <div className="flex gap-2 pt-1">
          <button
            id="focus-camera-btn"
            onClick={onFocusCamera}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Kamerayı Odakla
          </button>
          {onJumpToSafety && (
            <button
              id="related-safety-btn"
              onClick={onJumpToSafety}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
              title="İlgili İSG / Emniyet Maddesini Gör"
            >
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              İSG
            </button>
          )}
        </div>

        {/* Technical Specifications */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Teknik Özellikler & Değerler</span>
          </div>
          <div className="bg-slate-950/60 rounded-lg border border-slate-800 divide-y divide-slate-800/80">
            {Object.entries(equipment.technicalSpecs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1.5 px-2.5">
                <span className="text-slate-400">{key}:</span>
                <span className="text-slate-200 font-mono text-right ml-2 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Working Principle */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Çalışma Prensibi</span>
          </div>
          <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
            {equipment.workingPrinciple}
          </p>
        </div>

        {/* Role in Drilling Operation */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sondaj Operasyonundaki Rolü</span>
          </div>
          <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
            {equipment.drillingRole}
          </p>
        </div>

        {/* System Connections */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
            <Link2 className="w-3.5 h-3.5 text-yellow-400" />
            <span>Sistem Bağlantıları</span>
          </div>
          <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
            {equipment.systemConnection}
          </p>
        </div>

        {/* Safety Hazards */}
        <div>
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Kritik İSG Tehlikeleri</span>
          </div>
          <ul className="space-y-1 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-lg">
            {equipment.safetyHazards.map((hazard, index) => (
              <li key={index} className="flex items-start gap-1.5 text-amber-200/90">
                <span className="text-amber-500 font-bold">•</span>
                <span>{hazard}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Maintenance Checks */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rutin Bakım ve Kontroller</span>
          </div>
          <ul className="space-y-1 bg-slate-950/40 border border-slate-800 p-2.5 rounded-lg">
            {equipment.maintenanceChecks.map((check, index) => (
              <li key={index} className="flex items-start gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
