import { FormationLayer } from '../types';

export interface CasingString {
  id: string;
  name: { tr: string; en: string };
  sizeOD: string;       // e.g. '30"', '20"', '13-3/8"', '9-5/8"'
  shoeDepth: number;    // ft
  topDepth: number;     // ft
  cementTop: number;    // ft
  color: string;
  shoeColor: string;
  purpose: { tr: string; en: string };
}

export const CASING_PROGRAM: CasingString[] = [
  {
    id: 'conductor',
    name: { tr: 'İletken Boru (Conductor)', en: 'Conductor Casing' },
    sizeOD: '30"',
    shoeDepth: 150,
    topDepth: 0,
    cementTop: 0,
    color: '#64748b',
    shoeColor: '#e2e8f0',
    purpose: {
      tr: 'Yüzey gevşek toprağını ve kuyu ağzı çökmesini önler, dolaşım akışını çamur kanalına yönlendirir.',
      en: 'Prevents shallow unconsolidated surface soil washout and guides returns to flowline.'
    }
  },
  {
    id: 'surface',
    name: { tr: 'Yüzey Muhafaza Borusu (Surface Casing)', en: 'Surface Casing' },
    sizeOD: '20"',
    shoeDepth: 2500,
    topDepth: 0,
    cementTop: 0,
    color: '#94a3b8',
    shoeColor: '#f59e0b',
    purpose: {
      tr: 'Tatlı su akiferlerini tecrit eder; BOP (Blowout Preventer) kuyu kontrol vanasını taşır.',
      en: 'Protects freshwater aquifers from contamination and provides structural base for BOP stack.'
    }
  },
  {
    id: 'intermediate',
    name: { tr: 'Ara Muhafaza Borusu (Intermediate Casing)', en: 'Intermediate Casing' },
    sizeOD: '13-3/8"',
    shoeDepth: 7500,
    topDepth: 0,
    cementTop: 1800,
    color: '#cbd5e1',
    shoeColor: '#38bdf8',
    purpose: {
      tr: 'Aşırı basınçlı veya kaçak yapan şeyl ve tuz katmanlarını izole ederek derin kuyu güvenliğini sağlar.',
      en: 'Isolates weak loss zones, sloughing shales, and abnormal pore pressure transitions.'
    }
  },
  {
    id: 'production',
    name: { tr: 'Üretim Borusu (Production Casing)', en: 'Production Casing' },
    sizeOD: '9-5/8"',
    shoeDepth: 13000,
    topDepth: 0,
    cementTop: 6800,
    color: '#e2e8f0',
    shoeColor: '#10b981',
    purpose: {
      tr: 'Hedef hidrokarbon haznesini izole eder; perforasyon ile petrol/gaz akışını güvenle yüzeye taşır.',
      en: 'Isolates pay zones and provides high-integrity conduit for perforating and reservoir fluid production.'
    }
  }
];

export const FORMATION_LAYERS: FormationLayer[] = [
  {
    id: 'aquifer',
    name: {
      tr: '1. Toprak & Tatlı Su Akiferi',
      en: '1. Surface Soil & Freshwater Aquifer'
    },
    depthStart: 0,
    depthEnd: 800,
    color: '#b08968', // Sandy alluvial clay
    textColor: '#fef3c7',
    textureType: 'soil',
    porePressureGradient: 0.433, // psi/ft (fresh water)
    rockHardness: 2,
    description: {
      tr: 'Sığ alüvyal çökeller ve içme suyu akiferi. Sondaj sıvısı sızıntısına karşı 30" ve 20" çimentolu casing ile tam yalıtım zorunludur.',
      en: 'Shallow alluvium and drinking water aquifer. Stringent isolation required using cemented conductor and surface casings.'
    }
  },
  {
    id: 'sandstone',
    name: {
      tr: '2. Yumuşak Kumtaşı & Kiltaşı',
      en: '2. Soft Sandstone & Claystone'
    },
    depthStart: 800,
    depthEnd: 3500,
    color: '#c49a6c', // Sandstone golden tan
    textColor: '#fef3c7',
    textureType: 'sandstone',
    porePressureGradient: 0.445,
    rockHardness: 3.5,
    description: {
      tr: 'İyi derecelenmiş kumtaşı ardalanması. Yüksek ROP (ilerleme hızı) elde edilir; yüzey muhafaza pabucu tabanında sağlam formasyona oturtulur.',
      en: 'Well-sorted sandstone sequences. High ROP achievable; surface casing shoe is anchored in competent rock at base.'
    }
  },
  {
    id: 'shale',
    name: {
      tr: '3. Aşırı Basınçlı Deniz Şeyli',
      en: '3. Overpressured Marine Shale'
    },
    depthStart: 3500,
    depthEnd: 8200,
    color: '#475569', // Dark laminated shale
    textColor: '#e2e8f0',
    textureType: 'shale',
    porePressureGradient: 0.520, // Overpressured
    rockHardness: 6.0,
    description: {
      tr: 'Lamine kil mineralleri ve yüksek gözenek basıncı. Çamur ağırlığı 10.8 ppg seviyesinde tutularak kuyu göçmesi (sloughing) engellenir.',
      en: 'Fissile marine shales with abnormal pore pressure. Mud weight must be raised to ~10.8 ppg to suppress mechanical borehole collapse.'
    }
  },
  {
    id: 'limestone',
    name: {
      tr: '4. Çatlaklı Kireçtaşı & Dolomit',
      en: '4. Fractured Limestone & Dolomite'
    },
    depthStart: 8200,
    depthEnd: 11800,
    color: '#6b7280', // Grey limestone
    textColor: '#f3f4f6',
    textureType: 'limestone',
    porePressureGradient: 0.465,
    rockHardness: 7.5,
    description: {
      tr: 'Kompakt kireçtaşı ve vuglu dolomit. Kırık ve çatlak sistemleri nedeniyle çamur kaçağı (lost circulation) riski bulunur.',
      en: 'Dense crystalline limestone with natural fracture vugs. Prone to severe lost circulation if hydrostatic pressure exceeds fracture gradient.'
    }
  },
  {
    id: 'reservoir',
    name: {
      tr: '5. Hedef Hidrokarbon Rezervuarı (Petrol & Gaz)',
      en: '5. Target Hydrocarbon Reservoir (Oil & Gas Sand)'
    },
    depthStart: 11800,
    depthEnd: 13800,
    color: '#1e293b', // Deep hydrocarbon pay zone with golden streaks
    textColor: '#fde047',
    textureType: 'reservoir',
    porePressureGradient: 0.545, // High pressure pay zone (~6,800 psi pore pressure)
    rockHardness: 5.0,
    description: {
      tr: 'Yüksek gözenekli ve geçirgen kumtaşı rezervuarı. Tepe gaz başlığı (gas cap) ve petrol sütunu barındırır. Kick oluşumuna karşı hassas denge şarttır.',
      en: 'Prolific pay zone with gas cap and oil column. Pore pressure reaches ~6,800 psi. Requires tight overbalance monitoring to avoid kicks.'
    }
  },
  {
    id: 'basement',
    name: {
      tr: '6. Masif Anhidrit & Temel Taban Kayacı',
      en: '6. Dense Anhydrite & Basement'
    },
    depthStart: 13800,
    depthEnd: 15000,
    color: '#334155', // Crystalline igneous/metamorphic floor
    textColor: '#cbd5e1',
    textureType: 'basement',
    porePressureGradient: 0.465,
    rockHardness: 9.0,
    description: {
      tr: 'Kuyu tabanı (TD) altındaki geçirimsiz temel kayaç. Çok sert formasyon, düşük ROP, matkap aşınması yüksek.',
      en: 'Impermeable crystalline basement rock below total depth. Ultra-hard formation, low penetration rate, high bit tooth wear.'
    }
  }
];

export interface DrillBitSpecs {
  type: string;
  diameterInches: number;
  nozzles: number[]; // e.g. [12, 12, 12] in 32nds inch
  tfa: number;       // Total Flow Area in sq inches
  wobMax: number;    // klbs
  rpmRange: [number, number];
}

export const PDC_BIT_SPECS: DrillBitSpecs = {
  type: 'Matrix Body PDC (Polycrystalline Diamond Compact)',
  diameterInches: 8.5,
  nozzles: [13, 13, 13, 12],
  tfa: 0.485,
  wobMax: 45,
  rpmRange: [80, 160]
};
