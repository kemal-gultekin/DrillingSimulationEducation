import { calculateKillSheet as calcKillSheetCore } from '../simulation/killSheetEngine';
import { KillSheetCalculationResult, KillSheetInputParams } from '../simulation/types';

export type KillSheetCalculation = KillSheetCalculationResult;

export function calculateKillSheet(params: {
  tvd: number;
  originalMudWeight: number;
  sidpp: number;
  sicp: number;
  pitGain: number;
  scrPressure: number;
  casingShoeTvd: number;
  lotMudWeight: number;
  annularCapacityDCOpenHole?: number;
}): KillSheetCalculation {
  return calcKillSheetCore(params as KillSheetInputParams);
}

export interface WellControlConcept {
  title: { tr: string; en: string };
  content: { tr: string; en: string };
}

export const WELL_CONTROL_CONCEPTS: WellControlConcept[] = [
  {
    title: {
      tr: 'SIDPP vs SICP Neden Farklıdır?',
      en: 'Why Does SICP Exceed SIDPP?'
    },
    content: {
      tr: 'Kuyu kapatıldığında hem sondaj borusu (Drill Pipe) hem de anülüs (Casing) tabandaki aynı formasyon basıncını dengeler. Ancak sondaj borusu içi saf ve homojen sondaj çamuru ile doludur (bu yüzden SIDPP doğrudan formasyon açığını verir). Anülüste ise hafif gaz/petrol akıntısı çamur sütununun bir kısmını işgal ettiği için anülüs hidrostatik basıncı daha düşüktür; bu eksikliği kapatmak için yüzeydeki SICP manometresi her zaman SIDPP\'den DAHA YÜKSEK basınç gösterir (SICP > SIDPP).',
      en: 'When a well is shut in, both the drill string and annulus balance the same bottomhole formation pressure. Because the drill pipe contains a continuous column of uncontaminated drilling mud, SIDPP directly measures formation overpressure. In the annulus, lighter formation influx (gas or oil) displaces heavier mud, resulting in lower hydrostatic head. Consequently, surface casing pressure (SICP) must read higher than SIDPP to balance bottomhole pressure (SICP > SIDPP).'
    }
  },
  {
    title: {
      tr: 'MAASP (İzin Verilen Azami Kılıf Basıncı)',
      en: 'MAASP (Maximum Allowable Annular Surface Pressure)'
    },
    content: {
      tr: 'Muhafaza borusu pabucundaki (Casing Shoe) kayaç formasyonunu çatlatmadan yüzey kılıf manometresinde (SICP) izin verilebilecek en yüksek tavan basınçtır. SICP değeri MAASP\'yi aşarsa pabucun altındaki zayıf formasyon çatlar, çamur yer altına kaçar ve kuyu dışından yüzeye yeraltı patlaması (Underground Blowout) riski oluşur.',
      en: 'MAASP represents the highest permissible pressure on the surface casing gauge (SICP) before the formation directly beneath the casing shoe fractures. Exceeding MAASP risks breakdown of the shoe formation, total loss of returns, and potential underground blowout around the casing string.'
    }
  },
  {
    title: {
      tr: 'Sondör Yöntemi (Drillers) vs Mühendis Yöntemi (Wait & Weight)',
      en: 'Drillers Method vs Wait & Weight Method'
    },
    content: {
      tr: 'Drillers Method 2 tam dolaşım turu gerektirir: 1. turda orijinal çamurla (OMW) gaz kuyudan atılır, 2. turda ağırlaştırılmış öldürme çamuru (KMW) basılır. Basittir ve bekleme gerektirmez. Wait & Weight ise çamur tankta ağırlaştırılana kadar beklenir ve tek turda gaz tahliye edilirken aynı anda KMW pompalanır. Pabuca binen anüler tepe basıncı Wait & Weight yönteminde daha düşüktür.',
      en: 'The Drillers Method requires two full circulations: circulation 1 pumps original mud weight (OMW) to strip the influx out, and circulation 2 introduces kill mud weight (KMW). Wait & Weight holds the shut-in well until kill mud is mixed, removing the kick and weighting up in a single circulation, which imposes lower peak burst pressures on the casing shoe.'
    }
  }
];
