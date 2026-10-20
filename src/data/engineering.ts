import { CalculationModule } from '../types';
import {
  calculateHydrostaticPressure,
  calculatePressureGradient,
  calculateRequiredMudWeight,
  calculateBottomHolePressure,
  calculateFormationPressureFromKick,
  calculateOverbalance,
  calculateEcd
} from '../simulation/drillingCalculations';

export const ENGINEERING_MODULES: CalculationModule[] = [
  {
    id: 'hydrostatic-pressure',
    title: 'Hydrostatic Pressure',
    turkishTitle: 'Hidrostatik Basınç Hesabı',
    formula: 'P = 0.052 × MW × TVD',
    description: 'Durgun sondaj sıvısı sütununun kuyu tabanına veya belirli bir derinliğe uyguladığı basınçtır.',
    fields: [
      {
        label: 'Çamur Yoğunluğu (MW - Mud Weight)',
        variable: 'MW',
        value: 10.0,
        unit: 'ppg (lb/gal)',
        min: 8.33,
        max: 20.0,
        step: 0.1,
        description: 'Sondaj sıvısının yoğunluğu. Su = 8.33 ppg, Barit takviyeli ağır çamurlar 18-20 ppg seviyesine çıkabilir.'
      },
      {
        label: 'Gerçek Dikey Derinlik (TVD - True Vertical Depth)',
        variable: 'TVD',
        value: 5000,
        unit: 'ft (feet)',
        min: 500,
        max: 30000,
        step: 100,
        description: 'Yüzey döner masasından (rotary table) kuyu tabanına dikey mesafe. Eğik kuyularda ölçülen derinlikten (MD) farklıdır.'
      }
    ],
    calculate: (inputs) => {
      const mw = inputs.MW || 10;
      const tvd = inputs.TVD || 5000;
      const res = calculateHydrostaticPressure({ mw, tvd });

      return {
        result: res.pressure,
        unit: 'psi',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  },
  {
    id: 'pressure-gradient',
    title: 'Pressure Gradient',
    turkishTitle: 'Basınç Gradyanı (Pressure Gradient)',
    formula: 'G = 0.052 × MW',
    description: 'Birim dikey derinlik başına basınç artış hızıdır (psi/ft).',
    fields: [
      {
        label: 'Çamur Yoğunluğu (MW)',
        variable: 'MW',
        value: 11.5,
        unit: 'ppg',
        min: 8.33,
        max: 20.0,
        step: 0.1,
        description: 'Kuyuda dolaşan sıvının birim hacim kütlesi.'
      }
    ],
    calculate: (inputs) => {
      const mw = inputs.MW || 11.5;
      const res = calculatePressureGradient({ mw });

      return {
        result: res.gradient,
        unit: 'psi/ft',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  },
  {
    id: 'required-mud-weight',
    title: 'Required Mud Weight',
    turkishTitle: 'Gereken Çamur Yoğunluğu (Required MW)',
    formula: 'MW = P / (0.052 × TVD)',
    description: 'Bilinen bir formasyon basıncını dengelemek için gereken asgari çamur ağırlığı.',
    fields: [
      {
        label: 'Formasyon Basıncı (P_form)',
        variable: 'P',
        value: 4500,
        unit: 'psi',
        min: 500,
        max: 25000,
        step: 50,
        description: 'Rezervuar veya gözenek içindeki akışkan basıncı (Pore Pressure).'
      },
      {
        label: 'Gerçek Dikey Derinlik (TVD)',
        variable: 'TVD',
        value: 8000,
        unit: 'ft',
        min: 500,
        max: 30000,
        step: 100,
        description: 'Basıncın ölçüldüğü derinlik.'
      },
      {
        label: 'İstenen Güvenlik Payı (Overbalance Margin)',
        variable: 'Margin',
        value: 200,
        unit: 'psi',
        min: 0,
        max: 800,
        step: 25,
        description: 'Swab etkilerini ve geçiş basınçlarını tolere etmek için eklenen güvenlik marjı (Genellikle 150-300 psi).'
      }
    ],
    calculate: (inputs) => {
      const p = inputs.P || 4500;
      const tvd = inputs.TVD || 8000;
      const margin = inputs.Margin || 200;
      const res = calculateRequiredMudWeight({ pForm: p, tvd, margin });

      return {
        result: res.requiredMudWeight,
        unit: 'ppg',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  },
  {
    id: 'bottom-hole-pressure',
    title: 'Bottom Hole Pressure (BHP)',
    turkishTitle: 'Kuyu Dibi Basıncı (BHP)',
    formula: 'BHP = P_hydrostatic + ΔP_annulus (Dolaşım Sırasında)',
    description: 'Statik durumda sadece hidrostatik basınca, pompalar çalışırken ise hidrostatik basınç artı anüler sürtünme basınç kaybına eşittir.',
    fields: [
      {
        label: 'Çamur Ağırlığı (MW)',
        variable: 'MW',
        value: 12.0,
        unit: 'ppg',
        min: 8.33,
        max: 20.0,
        step: 0.1,
        description: 'Kuyudaki aktif çamurun yoğunluğu.'
      },
      {
        label: 'Kuyu TVD',
        variable: 'TVD',
        value: 9500,
        unit: 'ft',
        min: 1000,
        max: 25000,
        step: 100,
        description: 'Gerçek dikey derinlik.'
      },
      {
        label: 'Anüler Sürtünme Kaybı (APL - Annular Pressure Loss)',
        variable: 'APL',
        value: 250,
        unit: 'psi',
        min: 0,
        max: 1000,
        step: 25,
        description: 'Çamurun kuyu ile boru arasındaki anülüs boşluğundan yukarı akarken oluşturduğu sürtünme basıncı.'
      }
    ],
    calculate: (inputs) => {
      const mw = inputs.MW || 12.0;
      const tvd = inputs.TVD || 9500;
      const apl = inputs.APL || 250;
      const res = calculateBottomHolePressure({ mw, tvd, apl });

      return {
        result: res.dynamicBhp,
        unit: 'psi',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  },
  {
    id: 'formation-pressure',
    title: 'Formation Pressure from Kick Data',
    turkishTitle: 'Kick Sonrası Formasyon Basıncı Hesabı',
    formula: 'P_formation = P_hydrostatic + SIDPP',
    description: 'Kuyu kapatıldığında (Shut-in), kapalı sondaj borusu basıncı (SIDPP) yardımıyla formasyonun gerçek basıncını tespit etme.',
    fields: [
      {
        label: 'Mevcut Çamur Yoğunluğu (OMW)',
        variable: 'OMW',
        value: 9.8,
        unit: 'ppg',
        min: 8.33,
        max: 18.0,
        step: 0.1,
        description: 'Kuyuda delgi sırasında bulunan orijinal çamur ağırlığı.'
      },
      {
        label: 'Kuyu Dibi TVD',
        variable: 'TVD',
        value: 7200,
        unit: 'ft',
        min: 1000,
        max: 25000,
        step: 100,
        description: 'Gazın veya sıvının kuyuya girdiği derinlik.'
      },
      {
        label: 'Kapalı Boru Basıncı (SIDPP - Shut-In Drillpipe Pressure)',
        variable: 'SIDPP',
        value: 420,
        unit: 'psi',
        min: 50,
        max: 3000,
        step: 10,
        description: 'BOP kapatıldıktan sonra manometreden okunan kapalı boru basıncı.'
      }
    ],
    calculate: (inputs) => {
      const omw = inputs.OMW || 9.8;
      const tvd = inputs.TVD || 7200;
      const sidpp = inputs.SIDPP || 420;
      const res = calculateFormationPressureFromKick({ omw, tvd, sidpp });

      return {
        result: res.formationPressure,
        unit: 'psi',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  },
  {
    id: 'overbalance-underbalance',
    title: 'Overbalance / Underbalance',
    turkishTitle: 'Aşırı Denge (Overbalance) / Yetersiz Denge (Underbalance)',
    formula: 'ΔP = BHP - P_formation',
    description: 'Kuyu dibi basıncı ile formasyon basıncı arasındaki güvenlik farkı.',
    fields: [
      {
        label: 'Kuyu Dibi Basıncı (BHP)',
        variable: 'BHP',
        value: 5200,
        unit: 'psi',
        min: 1000,
        max: 20000,
        step: 50,
        description: 'Kuyunun dibindeki toplam basınç.'
      },
      {
        label: 'Formasyon Gözenek Basıncı (P_form)',
        variable: 'PFORM',
        value: 4950,
        unit: 'psi',
        min: 1000,
        max: 20000,
        step: 50,
        description: 'Formasyon akışkanlarının basıncı.'
      }
    ],
    calculate: (inputs) => {
      const bhp = inputs.BHP || 5200;
      const pform = inputs.PFORM || 4950;
      const res = calculateOverbalance({ bhp, pForm: pform });

      return {
        result: res.differentialPressure,
        unit: 'psi',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance,
        warning: res.warning
      };
    }
  },
  {
    id: 'equivalent-circulating-density',
    title: 'Equivalent Circulating Density (ECD)',
    turkishTitle: 'Eşdeğer Dolaşım Yoğunluğu (ECD)',
    formula: 'ECD = MW + (Annular Pressure Loss / (0.052 × TVD))',
    description: 'Pompalar çalışırken anüler sürtünme basınç kayıpları nedeniyle formasyonun hissettiği efektif çamur yoğunluğudur.',
    fields: [
      {
        label: 'Statik Çamur Yoğunluğu (MW)',
        variable: 'MW',
        value: 10.5,
        unit: 'ppg',
        min: 8.33,
        max: 20.0,
        step: 0.1,
        description: 'Yüzeyde ölçülen durgun çamur yoğunluğu.'
      },
      {
        label: 'Anüler Basınç Kaybı (APL)',
        variable: 'APL',
        value: 320,
        unit: 'psi',
        min: 50,
        max: 1200,
        step: 10,
        description: 'Çamur debisi ve viskozite kaynaklı anüler sürtünme basınç kaybı.'
      },
      {
        label: 'Kuyu TVD',
        variable: 'TVD',
        value: 8500,
        unit: 'ft',
        min: 1000,
        max: 25000,
        step: 100,
        description: 'Gerçek dikey derinlik.'
      }
    ],
    calculate: (inputs) => {
      const mw = inputs.MW || 10.5;
      const apl = inputs.APL || 320;
      const tvd = inputs.TVD || 8500;
      const res = calculateEcd({ mw, apl, tvd });

      return {
        result: res.ecd,
        unit: 'ppg',
        steps: res.steps,
        explanation: res.explanation,
        drillingSignificance: res.drillingSignificance
      };
    }
  }
];
