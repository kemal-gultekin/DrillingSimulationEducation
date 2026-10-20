/**
 * Drilling Calculations Module
 * Pure, deterministic functions for petroleum and drilling hydraulics calculations.
 * Standard Oilfield Units:
 *   - Depth: feet (ft)
 *   - Mud Weight: pounds per gallon (ppg / lb/gal)
 *   - Pressure: pounds per square inch (psi)
 *   - Gradient: psi per foot (psi/ft)
 *   - Conversion Factor: 0.052 (12 in / 231 in³/gal ≈ 0.051948)
 */

import {
  HydrostaticParams,
  HydrostaticResult,
  PressureGradientParams,
  PressureGradientResult,
  RequiredMudWeightParams,
  RequiredMudWeightResult,
  BottomHolePressureParams,
  BottomHolePressureResult,
  FormationPressureParams,
  FormationPressureResult,
  OverbalanceParams,
  OverbalanceResult,
  EcdParams,
  EcdResult
} from './types';

export const DRILLING_CONSTANTS = {
  PRESSURE_FACTOR: 0.052,
  FRESHWATER_DENSITY: 8.33,     // ppg
  FRESHWATER_GRADIENT: 0.433,   // psi/ft (8.33 * 0.052)
  NORMAL_FORMATION_GRADIENT: 0.465 // psi/ft (typical saltwater gradient)
};

/**
 * Calculates hydrostatic pressure of a static mud column:
 * P = 0.052 * MW * TVD
 */
export function calculateHydrostaticPressure(params: HydrostaticParams): HydrostaticResult {
  const { mw, tvd } = params;
  const rawPressure = DRILLING_CONSTANTS.PRESSURE_FACTOR * mw * tvd;
  const pressure = Math.round(rawPressure * 10) / 10;
  const gradient = Math.round(DRILLING_CONSTANTS.PRESSURE_FACTOR * mw * 1000) / 1000;

  return {
    pressure,
    gradient,
    formula: 'P = 0.052 × MW × TVD',
    steps: [
      `Formül: P = 0.052 × MW × TVD`,
      `0.052 dönüşüm katsayısı: 1 ft³ suyun 1 in² taban alanına yaptığı basınç dönüşüm faktörüdür (12 in / 231 in³/gal = 0.05195 ≈ 0.052).`,
      `Basınç Gradyanı: G = 0.052 × ${mw} ppg = ${gradient} psi/ft`,
      `P = 0.052 × ${mw} ppg × ${tvd} ft = ${pressure} psi`
    ],
    explanation: `${tvd} ft gerçek dikey derinlikte (TVD), ${mw} ppg yoğunluğundaki sondaj çamuru sütunu kuyu tabanına tam olarak ${pressure} psi hidrostatik basınç uygulamaktadır. Her dikey fit için basınç ${gradient} psi artmaktadır.`,
    drillingSignificance: 'Hidrostatik basınç, kuyu kontrolünün (Well Control) ilk ve en önemli birincil bariyeridir (Primary Barrier). Formasyon akışkanlarının (gaz, petrol, tuzlu su) kuyuya kontrolsüzce girmesini (Kick) engellemek için hidrostatik basıncın formasyon basıncından biraz yüksek (Overbalance) tutulması şarttır.'
  };
}

/**
 * Calculates pressure gradient of drilling fluid:
 * G = 0.052 * MW
 */
export function calculatePressureGradient(params: PressureGradientParams): PressureGradientResult {
  const { mw } = params;
  const rawGradient = DRILLING_CONSTANTS.PRESSURE_FACTOR * mw;
  const gradient = Math.round(rawGradient * 1000) / 1000;

  return {
    gradient,
    formula: 'G = 0.052 × MW',
    steps: [
      `Formül: G = 0.052 × MW`,
      `G = 0.052 × ${mw} ppg`,
      `G = ${gradient} psi/ft`
    ],
    explanation: `Sıvı sütunu her 1 feet derinleştiğinde hidrostatik basınç ${gradient} psi artar. Karşılaştırma için: Saf tatlı su gradyanı 0.433 psi/ft, normal formasyon gözenek suyu gradyanı ise genellikle 0.465 psi/ft (tuzlu su) kabul edilir.`,
    drillingSignificance: 'Basınç gradyanı kuyu planlamasında formasyon çatlatma gradyanı (Fracture Gradient) ve gözenek basıncı gradyanı (Pore Pressure Gradient) ile doğrudan karşılaştırılır. Çamur gradyanı gözenek basıncının altında kalırsa kick, çatlatma gradyanını aşarsa kuyu çatlaması ve kaçak (lost circulation) meydana gelir.'
  };
}

/**
 * Calculates required mud weight to balance or overbalance a target formation pressure:
 * MW = TargetPressure / (0.052 * TVD)
 */
export function calculateRequiredMudWeight(params: RequiredMudWeightParams): RequiredMudWeightResult {
  const { pForm, tvd, margin = 0 } = params;
  const targetPressure = pForm + margin;
  const rawMw = targetPressure / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd);
  const requiredMudWeight = Math.round(rawMw * 100) / 100;
  const balanceMudWeight = Math.round((pForm / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd)) * 100) / 100;

  return {
    requiredMudWeight,
    balanceMudWeight,
    targetPressure,
    formula: 'MW = Hedef Basınç / (0.052 × TVD)',
    steps: [
      `Hedef Basınç = P_form (${pForm} psi) + Emniyet Marjı (${margin} psi) = ${targetPressure} psi`,
      `Formül: MW = Hedef Basınç / (0.052 × TVD)`,
      `MW = ${targetPressure} / (0.052 × ${tvd}) = ${requiredMudWeight} ppg`,
      `Tam Denge Çamuru (Sıfır marj): ${balanceMudWeight} ppg`
    ],
    explanation: `${tvd} ft derinlikte ${pForm} psi formasyon basıncını dengeleyip ${margin} psi emniyet payı sağlamak için çamur yoğunluğu en az ${requiredMudWeight} ppg olmalıdır.`,
    drillingSignificance: 'Çamur mühendisi (Mud Engineer) çamur tankına barit (baryte / BaSO4) veya kalsiyum karbonat ekleyerek yoğunluğu bu hesaplanan seviyeye ayarlar.'
  };
}

/**
 * Calculates Bottom Hole Pressure (BHP):
 * Static BHP = P_hyd
 * Dynamic BHP = P_hyd + Annular Pressure Loss (APL)
 */
export function calculateBottomHolePressure(params: BottomHolePressureParams): BottomHolePressureResult {
  const { mw, tvd, apl = 0 } = params;
  const pHyd = DRILLING_CONSTANTS.PRESSURE_FACTOR * mw * tvd;
  const staticBhp = Math.round(pHyd);
  const dynamicBhp = Math.round(pHyd + apl);

  return {
    staticBhp,
    dynamicBhp,
    apl,
    formula: 'BHP = P_hydrostatic + ΔP_annulus (Dolaşım Sırasında)',
    steps: [
      `Statik Hidrostatik Basınç (P_hyd) = 0.052 × ${mw} × ${tvd} = ${staticBhp} psi`,
      `Dinamik Basınç Kaybı (APL) = ${apl} psi`,
      `Dinamik BHP = P_hyd + APL = ${staticBhp} + ${apl} = ${dynamicBhp} psi`
    ],
    explanation: `Pompalar durduğunda kuyu dibi basıncı ${staticBhp} psi seviyesine düşer. Pompalar çalıştırıldığında anüler sürtünme eklenerek kuyu dibi basıncı ${dynamicBhp} psi seviyesine yükselir.`,
    drillingSignificance: 'Pompa durdurulduğunda (örneğin boru eklerken) BHP anüler kayıp kadar aniden düşer. Eğer formasyon basıncı statik hidrostatikten yüksekse, pompalar kapatıldığı anda kuyu kick alabilir.'
  };
}

/**
 * Calculates formation pressure after a kick using SIDPP:
 * P_form = Hydrostatic + SIDPP
 * Kill Mud Weight = OMW + (SIDPP / (0.052 * TVD))
 */
export function calculateFormationPressureFromKick(params: FormationPressureParams): FormationPressureResult {
  const { omw, tvd, sidpp } = params;
  const rawHyd = DRILLING_CONSTANTS.PRESSURE_FACTOR * omw * tvd;
  const hydrostaticPressure = Math.round(rawHyd);
  const formationPressure = Math.round(rawHyd + sidpp);
  const rawKmw = omw + (sidpp / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd));
  const killMudWeight = Math.round(rawKmw * 100) / 100;

  return {
    formationPressure,
    hydrostaticPressure,
    killMudWeight,
    formula: 'P_formation = P_hydrostatic + SIDPP',
    steps: [
      `Matkap İçi Hidrostatik Basınç = 0.052 × ${omw} ppg × ${tvd} ft = ${hydrostaticPressure} psi`,
      `Boru içi temiz çamurla dolu olduğu için: P_form = P_hyd + SIDPP`,
      `P_form = ${hydrostaticPressure} psi + ${sidpp} psi = ${formationPressure} psi`,
      `Kuyuyu Öldürmek İçin Gereken Çamur (Kill Mud Weight) = ${killMudWeight} ppg`
    ],
    explanation: `Formasyon basıncı ${formationPressure} psi olarak tespit edilmiştir. Sondaj borusundaki çamur kirlenmediği için SIDPP değeri kuyu dibi ile formasyon arasındaki net basınç açığını tam olarak yansıtır.`,
    drillingSignificance: 'Bu hesap, kuyuyu öldürme operasyonunun (Well Kill) temel taşıdır. Yanlış hesaplanırsa formasyon basıncı yenilemez ve ikinci bir kick veya kuyu patlaması (blowout) tetiklenebilir.'
  };
}

/**
 * Calculates Overbalance / Underbalance differential pressure:
 * ΔP = BHP - P_formation
 */
export function calculateOverbalance(params: OverbalanceParams): OverbalanceResult {
  const { bhp, pForm } = params;
  const deltaP = Math.round(bhp - pForm);
  const isOverbalance = deltaP >= 0;
  const status = deltaP > 0 ? 'OVERBALANCE' : deltaP === 0 ? 'EXACT_BALANCE' : 'UNDERBALANCE';

  return {
    differentialPressure: deltaP,
    isOverbalance,
    status,
    formula: 'ΔP = BHP - P_form',
    steps: [
      `Formül: ΔP = BHP - P_form`,
      `ΔP = ${bhp} psi - ${pForm} psi = ${deltaP} psi`,
      isOverbalance ? `Durum: OVERBALANCE (+${deltaP} psi)` : `TEHLİKE: UNDERBALANCE (${deltaP} psi)`
    ],
    explanation: isOverbalance
      ? `Kuyu ${deltaP} psi pozitif aşırı dengededir (Overbalance). Formasyon akışkanları kuyuya giremez.`
      : `UYARI: Kuyu ${Math.abs(deltaP)} psi eksik dengededir (Underbalance)! Kuyu akış alıyor (Kick) olabilir veya çamur ağırlığı acilen arttırılmalıdır.`,
    drillingSignificance: 'Normal sondajda 150-300 psi pozitif overbalance hedeflenir. Aşırı yüksek overbalance (>500 psi) differential sticking (diferansiyel yapışma) ve formasyon hasarına yol açarken, negatif overbalance kuyu kontrolü felaketine yol açar.',
    warning: isOverbalance ? undefined : 'DİKKAT: Negatif basınç farkı tespit edildi! Kuyu kontrol prosedürlerini başlatınız.'
  };
}

/**
 * Calculates Equivalent Circulating Density (ECD):
 * ECD = MW + (Annular Pressure Loss / (0.052 * TVD))
 */
export function calculateEcd(params: EcdParams): EcdResult {
  const { mw, apl, tvd } = params;
  const rawDelta = apl / (DRILLING_CONSTANTS.PRESSURE_FACTOR * tvd);
  const ecdDelta = Math.round(rawDelta * 100) / 100;
  const ecd = Math.round((mw + rawDelta) * 100) / 100;

  return {
    ecd,
    ecdDelta,
    formula: 'ECD = MW + (APL / (0.052 × TVD))',
    steps: [
      `Formül: ECD = MW + (APL / (0.052 × TVD))`,
      `Ek Dinamik Yoğunluk = ${apl} / (0.052 × ${tvd}) = ${ecdDelta} ppg`,
      `ECD = ${mw} + ${ecdDelta} = ${ecd} ppg`
    ],
    explanation: `Statik çamur ${mw} ppg olmasına rağmen, pompa debisi devredeyken kuyu tabanındaki kayaçlar sanki kuyu ${ecd} ppg yoğunluğunda çamurla doluymuş gibi yüksek basınca maruz kalmaktadır.`,
    drillingSignificance: 'ECD kuyu stabilitesinde hayati bir sınırdır. Dar sondaj pencerelerinde yüksek debi nedeniyle ECD formasyon çatlatma gradyanını aşarsa zayıf formasyon aniden çatlar ve derin kaçak (Lost Circulation) başlar.'
  };
}
