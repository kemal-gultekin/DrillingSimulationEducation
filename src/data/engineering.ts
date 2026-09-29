import { CalculationModule } from '../types';

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
      const result = 0.052 * mw * tvd;
      const rounded = Math.round(result * 10) / 10;
      const gradient = Math.round(0.052 * mw * 1000) / 1000;

      return {
        result: rounded,
        unit: 'psi',
        steps: [
          `Formül: P = 0.052 × MW × TVD`,
          `0.052 katsayısı: 1 ft³ suyun 1 in² taban alanına yaptığı basınç dönüşüm faktörüdür (12 in / 231 in³/gal = 0.05195 ≈ 0.052).`,
          `Basınç Gradyanı: G = 0.052 × ${mw} ppg = ${gradient} psi/ft`,
          `P = 0.052 × ${mw} ppg × ${tvd} ft = ${rounded} psi`
        ],
        explanation: `${tvd} ft gerçek dikey derinlikte, ${mw} ppg yoğunluğundaki sondaj çamuru sütunu kuyu tabanına tam olarak ${rounded} psi hidrostatik basınç uygulamaktadır. Her bir dikey fit için basınç ${gradient} psi artmaktadır.`,
        drillingSignificance: 'Hidrostatik basınç, kuyu kontrolünün (Well Control) ilk ve en önemli birincil bariyeridir (Primary Barrier). Formasyon akışkanlarının (gaz, petrol, tuzlu su) kuyuya kontrolsüzce girmesini (Kick) engellemek için hidrostatik basıncın formasyon basıncından biraz yüksek (Overbalance) tutulması şarttır.'
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
      const result = 0.052 * mw;
      const rounded = Math.round(result * 1000) / 1000;
      const freshwaterGrad = 0.433; // 8.33 * 0.052

      return {
        result: rounded,
        unit: 'psi/ft',
        steps: [
          `Formül: G = 0.052 × MW`,
          `G = 0.052 × ${mw} ppg`,
          `G = ${rounded} psi/ft`
        ],
        explanation: `Sıvı sütunu her 1 feet derinleştiğinde hidrostatik basınç ${rounded} psi artar. Karşılaştırma için: Saf tatlı su gradyanı 0.433 psi/ft, normal formasyon gözenek suyu gradyanı ise genellikle 0.465 psi/ft (tuzlu su) kabul edilir.`,
        drillingSignificance: 'Basınç gradyanı kuyu planlamasında formasyon çatlatma gradyanı (Fracture Gradient) ve gözenek basıncı gradyanı (Pore Pressure Gradient) ile doğrudan karşılaştırılır. Çamur gradyanı gözenek basıncının altında kalırsa kick, çatlatma gradyanını aşarsa kuyu çatlaması ve kaçak (lost circulation) meydana gelir.'
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
      const targetP = p + margin;
      const rawMw = targetP / (0.052 * tvd);
      const roundedMw = Math.round(rawMw * 100) / 100;
      const balanceMw = Math.round((p / (0.052 * tvd)) * 100) / 100;

      return {
        result: roundedMw,
        unit: 'ppg',
        steps: [
          `Hedef Basınç = P_form (${p} psi) + Emniyet Marjı (${margin} psi) = ${targetP} psi`,
          `Formül: MW = Hedef Basınç / (0.052 × TVD)`,
          `MW = ${targetP} / (0.052 × ${tvd}) = ${roundedMw} ppg`,
          `Tam Denge Çamuru (Sıfır marj): ${balanceMw} ppg`
        ],
        explanation: `${tvd} ft derinlikte ${p} psi formasyon basıncını dengeleyip ${margin} psi güvenli overbalance sağlamak için çamur yoğunluğu en az ${roundedMw} ppg olmalıdır.`,
        drillingSignificance: 'Çamur mühendisi (Mud Engineer) çamur tankına barit (baryte / BaSO4) veya kalsiyum karbonat ekleyerek yoğunluğu bu hesaplanan seviyeye ayarlar.'
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
      const phyd = 0.052 * mw * tvd;
      const staticBhp = Math.round(phyd);
      const dynamicBhp = Math.round(phyd + apl);

      return {
        result: dynamicBhp,
        unit: 'psi',
        steps: [
          `Statik Hidrostatik Basınç (P_hyd) = 0.052 × ${mw} × ${tvd} = ${staticBhp} psi`,
          `Dinamik Basınç Kaybı (APL) = ${apl} psi`,
          `Dinamik BHP = P_hyd + APL = ${staticBhp} + ${apl} = ${dynamicBhp} psi`
        ],
        explanation: `Pompalar durduğunda kuyu dibi basıncı ${staticBhp} psi seviyesine düşer. Pompalar çalıştırıldığında anüler sürtünme eklenerek kuyu dibi basıncı ${dynamicBhp} psi seviyesine yükselir.`,
        drillingSignificance: 'Pompa durdurulduğunda (örneğin boru eklerken) BHP anüler kayıp kadar aniden düşer. Eğer formasyon basıncı statik hidrostatikten yüksekse, pompalar kapatıldığı anda kuyu kick alabilir.'
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
      const phyd = 0.052 * omw * tvd;
      const pform = Math.round(phyd + sidpp);
      const kmw = Math.round((omw + sidpp / (0.052 * tvd)) * 100) / 100;

      return {
        result: pform,
        unit: 'psi',
        steps: [
          `Matkap İçi Hidrostatik Basınç = 0.052 × ${omw} ppg × ${tvd} ft = ${Math.round(phyd)} psi`,
          `Boru içi temiz çamurla dolu olduğu için: P_form = P_hyd + SIDPP`,
          `P_form = ${Math.round(phyd)} psi + ${sidpp} psi = ${pform} psi`,
          `Kuyuyu Öldürmek İçin Gereken Çamur (Kill Mud Weight) = ${kmw} ppg`
        ],
        explanation: `Formasyon basıncı ${pform} psi olarak tespit edilmiştir. Sondaj borusundaki çamur kirlenmediği için SIDPP değeri kuyu dibi ile formasyon arasındaki net basınç açığını tam olarak yansıtır.`,
        drillingSignificance: 'Bu hesap, kuyuyu öldürme operasyonunun (Well Kill) temel taşıdır. Yanlış hesaplanırsa formasyon basıncı yenilemez ve ikinci bir kick veya kuyu patlaması (blowout) tetiklenebilir.'
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
      const deltaP = Math.round(bhp - pform);
      const isOver = deltaP >= 0;

      return {
        result: deltaP,
        unit: 'psi',
        steps: [
          `Formül: ΔP = BHP - P_form`,
          `ΔP = ${bhp} psi - ${pform} psi = ${deltaP} psi`,
          isOver ? `Durum: OVERBALANCE (+${deltaP} psi)` : `TEHLİKE: UNDERBALANCE (${deltaP} psi)`
        ],
        explanation: isOver 
          ? `Kuyu ${deltaP} psi pozitif aşırı dengededir (Overbalance). Formasyon akışkanları kuyuya giremez.`
          : `UYARI: Kuyu ${Math.abs(deltaP)} psi eksik dengededir (Underbalance)! Kuyu akış alıyor (Kick) olabilir veya çamur ağırlığı acilen arttırılmalıdır.`,
        drillingSignificance: 'Normal sondajda 150-300 psi pozitif overbalance hedeflenir. Aşırı yüksek overbalance (>500 psi) differential sticking (diferansiyel yapışma) ve formasyon hasarına yol açarken, negatif overbalance kuyu kontrolü felaketine yol açar.',
        warning: isOver ? undefined : 'DİKKAT: Negatif basınç farkı tespit edildi! Kuyu kontrol prosedürlerini başlatınız.'
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
      const ecdDelta = apl / (0.052 * tvd);
      const ecd = Math.round((mw + ecdDelta) * 100) / 100;

      return {
        result: ecd,
        unit: 'ppg',
        steps: [
          `Formül: ECD = MW + (APL / (0.052 × TVD))`,
          `Ek Dinamik Yoğunluk = ${apl} / (0.052 × ${tvd}) = ${Math.round(ecdDelta * 100) / 100} ppg`,
          `ECD = ${mw} + ${Math.round(ecdDelta * 100) / 100} = ${ecd} ppg`
        ],
        explanation: `Statik çamur ${mw} ppg olmasına rağmen, pompa debisi devredeyken kuyu tabanındaki kayaçlar sanki kuyu ${ecd} ppg yoğunluğunda çamurla doluymuş gibi yüksek basınca maruz kalmaktadır.`,
        drillingSignificance: 'ECD kuyu stabilitesinde hayati bir sınırdır. Dar sondaj pencerelerinde (dar pore pressure - fracture gradient aralığı) yüksek debi nedeniyle ECD formasyon çatlatma gradyanını aşarsa zayıf formasyon aniden çatlar ve derin kaçak (Loss Circulation) başlar.'
      };
    }
  }
];
