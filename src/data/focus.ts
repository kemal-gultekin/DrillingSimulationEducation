import { LocalizedString } from '../i18n/types';

export interface CameraPreset {
  id: string;
  name: LocalizedString | string;
  turkishName: string;
  position: [number, number, number];
  target: [number, number, number];
  description: LocalizedString | string;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'overview',
    name: {
      tr: 'Saha Genel Bakış',
      en: 'Site Overview'
    },
    turkishName: 'Saha Genel Bakış',
    position: [24, 20, 32],
    target: [0, 8, 0],
    description: {
      tr: 'Tüm sondaj lokasyonunu, kuleyi ve yüzey ekipmanlarını gören kuşbakışı açı.',
      en: 'High-angle vantage point surveying the entire drilling location and surface equipment.'
    }
  },
  {
    id: 'rig-floor',
    name: {
      tr: 'Kule Tabanı (Rig Floor)',
      en: 'Rig Floor'
    },
    turkishName: 'Kule Tabanı (Rig Floor)',
    position: [0, 6, 8],
    target: [0, 3.5, 0],
    description: {
      tr: 'Döner masa, sondaj dizisi, vinç ve çalışma platformunun detaylı görünümü.',
      en: 'Close-up perspective of the rotary table, drill string, drawworks, and driller doghouse.'
    }
  },
  {
    id: 'derrick-top',
    name: {
      tr: 'Kule Tepesi & Crown Block',
      en: 'Crown & Mast Top'
    },
    turkishName: 'Kule Tepesi & Crown Block',
    position: [4, 28, 12],
    target: [0, 26, 0],
    description: {
      tr: 'Sabit makara grubu, su masası ve en üst yük taşıyıcı kirişler.',
      en: 'View of the crown block sheaves, water table, and top structural lattice members.'
    }
  },
  {
    id: 'substructure-bop',
    name: {
      tr: 'Alt Yapı & BOP Kuyu Ağzı',
      en: 'Substructure & BOP Cellar'
    },
    turkishName: 'Alt Yapı & BOP Kuyu Ağzı',
    position: [4, 0.5, 5],
    target: [0, -1, 0],
    description: {
      tr: 'Kuyu ağzı flanşları, blowout preventer (BOP) stack ve hidrolik hatlar.',
      en: 'Wellhead cellar, BOP stack rams, annular preventer, and choke/kill hydraulic lines.'
    }
  },
  {
    id: 'mud-system',
    name: {
      tr: 'Çamur Sirkülasyon Sistemi',
      en: 'Circulating & Mud Tanks'
    },
    turkishName: 'Çamur Sirkülasyon Sistemi',
    position: [-14, 7, 12],
    target: [-9, 1.5, 6],
    description: {
      tr: 'Titreşimli elekler, çamur tankları, mikserler ve triplex çamur pompaları.',
      en: 'Shale shakers, agitated mud pit compartments, degassers, and high-pressure mud pumps.'
    }
  },
  {
    id: 'power-support',
    name: {
      tr: 'Güç Santrali ve Yönetim',
      en: 'Power & Management Cabins'
    },
    turkishName: 'Güç Santrali ve Yönetim',
    position: [15, 6, 2],
    target: [10, 1.5, 2],
    description: {
      tr: 'Dizel jeneratörler, SCR ünitesi, çamur kayıt kabini ve şirket ofisi.',
      en: 'Diesel electric generator skids, mud logging cabin, and operator office trailer.'
    }
  },
  {
    id: 'catwalk-pipe',
    name: {
      tr: 'Catwalk & Boru Sahası',
      en: 'Catwalk & Pipe Racks'
    },
    turkishName: 'Catwalk & Boru Sahası',
    position: [12, 6, 26],
    target: [0, 0, 18],
    description: {
      tr: 'Boru istif sahası, V-Door rampası, muhafaza boruları ve catwalk yürüyüş yolu.',
      en: 'Horizontal staging racks, V-Door ramp, casing stands, and pipe catwalk.'
    }
  },
  {
    id: 'safety-muster',
    name: {
      tr: 'Toplanma & Güvenlik Alanı',
      en: 'Muster Point & Safety'
    },
    turkishName: 'Toplanma & Güvenlik Alanı',
    position: [18, 4, 20],
    target: [14, 0, 14],
    description: {
      tr: 'Acil durum toplanma noktası, rüzgar tulumu (windsock) ve acil durum duşu.',
      en: 'Designated emergency muster point, windsock, and decontamination deluge station.'
    }
  },
  {
    id: 'camp-infrastructure',
    name: {
      tr: 'Yaşam Kampı & Saha Altyapısı',
      en: 'Camp & Site Infrastructure'
    },
    turkishName: 'Yaşam Kampı & Saha Altyapısı',
    position: [28, 8, -6],
    target: [18, 0, -14],
    description: {
      tr: 'Şantiye yönetim ofisi, personel yaşam konteynerleri, yemekhane ve aydınlatma kuleleri.',
      en: 'Site trailers, crew quarters, mess hall, and portable light towers.'
    }
  }
];
