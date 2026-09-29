export interface CameraPreset {
  id: string;
  name: string;
  turkishName: string;
  position: [number, number, number];
  target: [number, number, number];
  description: string;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'overview',
    name: 'Site Overview',
    turkishName: 'Saha Genel Bakış',
    position: [24, 20, 32],
    target: [0, 8, 0],
    description: 'Tüm sondaj lokasyonunu, kuleyi ve yüzey ekipmanlarını gören kuşbakışı açı.'
  },
  {
    id: 'rig-floor',
    name: 'Rig Floor',
    turkishName: 'Kule Tabanı (Rig Floor)',
    position: [0, 6, 8],
    target: [0, 3.5, 0],
    description: 'Döner masa, sondaj dizisi, vinç ve çalışma platformunun detaylı görünümü.'
  },
  {
    id: 'derrick-top',
    name: 'Crown & Mast Top',
    turkishName: 'Kule Tepesi & Crown Block',
    position: [4, 28, 12],
    target: [0, 26, 0],
    description: 'Sabit makara grubu, su masası ve en üst yük taşıyıcı kirişler.'
  },
  {
    id: 'substructure-bop',
    name: 'Substructure & BOP Cellar',
    turkishName: 'Alt Yapı & BOP Kuyu Ağzı',
    position: [4, 0.5, 5],
    target: [0, -1, 0],
    description: 'Kuyu ağzı flanşları, blowout preventer (BOP) stack ve hidrolik hatlar.'
  },
  {
    id: 'mud-system',
    name: 'Circulating & Mud Tanks',
    turkishName: 'Çamur Sirkülasyon Sistemi',
    position: [-14, 7, 12],
    target: [-9, 1.5, 6],
    description: 'Titreşimli elekler, çamur tankları, mikserler ve triplex çamur pompaları.'
  },
  {
    id: 'power-support',
    name: 'Power & Management Cabins',
    turkishName: 'Güç Santrali ve Yönetim',
    position: [15, 6, 2],
    target: [10, 1.5, 2],
    description: 'Dizel jeneratörler, SCR ünitesi, çamur kayıt kabini ve şirket ofisi.'
  },
  {
    id: 'catwalk-pipe',
    name: 'Catwalk & Pipe Racks',
    turkishName: 'Catwalk & Boru Sahası',
    position: [12, 6, 26],
    target: [0, 0, 18],
    description: 'Boru istif sahası, V-Door rampası, muhafaza boruları ve catwalk yürüyüş yolu.'
  },
  {
    id: 'safety-muster',
    name: 'Muster Point & Safety',
    turkishName: 'Toplanma & Güvenlik Alanı',
    position: [18, 4, 20],
    target: [14, 0, 14],
    description: 'Acil durum toplanma noktası, rüzgar tulumu (windsock) ve acil durum duşu.'
  },
  {
    id: 'camp-infrastructure',
    name: 'Camp & Site Infrastructure',
    turkishName: 'Yaşam Kampı & Saha Altyapısı',
    position: [28, 8, -6],
    target: [18, 0, -14],
    description: 'Şantiye yönetim ofisi, personel yaşam konteynerleri, yemekhane ve aydınlatma kuleleri.'
  }
];
