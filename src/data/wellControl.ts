export interface KillSheetCalculation {
  formationPressure: number;
  killMudWeight: number;
  icp: number; // Initial Circulating Pressure
  fcp: number; // Final Circulating Pressure
  maasp: number; // Maximum Allowable Annular Surface Pressure
  casingShoePressure: number;
  influxHeight: number;
  influxDensity: number;
  influxType: string;
  kickTolerance: number;
}

export function calculateKillSheet(params: {
  tvd: number;
  originalMudWeight: number;
  sidpp: number;
  sicp: number;
  pitGain: number;
  scrPressure: number;
  casingShoeTvd: number;
  lotMudWeight: number;
  annularCapacityDCOpenHole?: number; // bbl/ft
}): KillSheetCalculation {
  const {
    tvd,
    originalMudWeight,
    sidpp,
    sicp,
    pitGain,
    scrPressure,
    casingShoeTvd,
    lotMudWeight,
    annularCapacityDCOpenHole = 0.029 // typical 8.5" hole x 6.5" DC
  } = params;

  // Formation Pressure = P_hyd_drillpipe + SIDPP
  const pHyd = 0.052 * originalMudWeight * tvd;
  const formationPressure = Math.round(pHyd + sidpp);

  // Kill Mud Weight = OMW + (SIDPP / (0.052 * TVD))
  const rawKmw = originalMudWeight + (sidpp / (0.052 * tvd));
  const killMudWeight = Math.round(rawKmw * 100) / 100;

  // ICP = SIDPP + SCR
  const icp = Math.round(sidpp + scrPressure);

  // FCP = SCR * (KMW / OMW)
  const fcp = Math.round(scrPressure * (killMudWeight / originalMudWeight));

  // MAASP = (LOT - OMW) * 0.052 * CasingShoeTVD
  const maasp = Math.round((lotMudWeight - originalMudWeight) * 0.052 * casingShoeTvd);

  // Influx height estimate: h = Pit Gain / Annular Capacity
  const influxHeight = Math.round(pitGain / annularCapacityDCOpenHole);

  // Influx density estimation from (SICP - SIDPP) = (OMW - InfluxDensity) * 0.052 * h
  let influxDensity = 0;
  let influxType = 'Bilinmeyen Akışkan';
  if (influxHeight > 0) {
    const rawInfluxDensity = originalMudWeight - ((sicp - sidpp) / (0.052 * influxHeight));
    influxDensity = Math.round(rawInfluxDensity * 100) / 100;

    if (influxDensity < 3.0) {
      influxType = 'Gaz (Methane / Natural Gas) - Çok Düşük Yoğunluk & Yüksek Genleşme';
    } else if (influxDensity < 7.0) {
      influxType = 'Petrol / Kondensat (Oil/Condensate Influx)';
    } else {
      influxType = 'Tuzlu Su (Saltwater / Formation Brine)';
    }
  }

  // Casing shoe pressure under current shut-in
  const casingShoePressure = Math.round(sicp + (0.052 * originalMudWeight * casingShoeTvd));

  // Kick Tolerance in ppg
  const kickTolerance = Math.max(0, Math.round(((maasp - sicp) / (0.052 * tvd)) * 100) / 100);

  return {
    formationPressure,
    killMudWeight,
    icp,
    fcp,
    maasp,
    casingShoePressure,
    influxHeight,
    influxDensity,
    influxType,
    kickTolerance
  };
}

export const WELL_CONTROL_CONCEPTS = [
  {
    title: 'SIDPP vs SICP Neden Farklıdır?',
    content: 'Kuyu kapatıldığında hem sondaj borusu (Drill Pipe) hem de anülüs (Casing) tabandaki aynı formasyon basıncını dengeler. Ancak sondaj borusu içi saf ve homojen sondaj çamuru ile doludur (bu yüzden SIDPP doğrudan formasyon açığını verir). Anülüste ise hafif gaz/petrol akıntısı çamur sütununun bir kısmını işgal ettiği için anülüs hidrostatik basıncı daha düşüktür; bu eksikliği kapatmak için yüzeydeki SICP manometresi her zaman SIDPP\'den DAHA YÜKSEK basınç gösterir (SICP > SIDPP).'
  },
  {
    title: 'MAASP (Maximum Allowable Annular Surface Pressure)',
    content: 'Muhafaza borusu pabucundaki (Casing Shoe) kayaç formasyonunu çatlatmadan yüzey kılıf manometresinde (SICP) izin verilebilecek en yüksek tavan basınçtır. SICP değeri MAASP\'yi aşarsa pabucun altındaki zayıf formasyon çatlar, çamur yer altına kaçar ve kuyu dışından yüzeye yeraltı patlaması (Underground Blowout) riski oluşur.'
  },
  {
    title: 'Drillers Method (Sondör Yöntemi) vs Wait & Weight (Mühendis Yöntemi)',
    content: 'Drillers Method 2 tam dolaşım turu gerektirir: 1. turda orijinal çamurla (OMW) gaz kuyudan atılır, 2. turda ağırlaştırılmış öldürme çamuru (KMW) basılır. Basittir ve bekleme gerektirmez. Wait & Weight ise çamur tankta ağırlaştırılana kadar beklenir ve tek turda gaz tahliye edilirken aynı anda KMW pompalanır. Pabuca binen anüler tepe basıncı Wait & Weight yönteminde daha düşüktür.'
  }
];
