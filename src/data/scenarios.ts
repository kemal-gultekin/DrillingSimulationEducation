import { DrillingScenario } from '../types';

export const DRILLING_SCENARIOS: DrillingScenario[] = [
  {
    id: 'scenario-kick',
    title: {
      tr: 'Formasyon Akışı (Kick Tespiti ve Kuyu Kapatma)',
      en: 'Formation Influx (Kick Detection & Shut-In)'
    },
    turkishTitle: 'Formasyon Akışı (Kick Tespiti ve Kuyu Kapatma)',
    difficulty: 'Zor',
    summary: {
      tr: 'Delgi sırasında beklenmedik pompa basıncı düşüşü, tank hacmi artışı ve delme hızı artışı (drilling break) gözleniyor.',
      en: 'Unexpected drilling break, pit volume gain, and standpipe pressure drop indicate an influx of reservoir fluids into the borehole.'
    },
    initialConditions: {
      depth: 10450,
      tvd: 10200,
      holeSize: 8.5,
      drillCollarLength: 600,
      mudWeight: 10.8,
      formation: {
        tr: 'Yüksek Basınçlı Gazlı Kumtaşı (Permeable Sandstone)',
        en: 'Overpressured Permeable Gas Sandstone'
      }
    },
    equipmentIdFocus: 'bop-stack',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        situation: {
          tr: '10,200 ft TVD derinlikte delme işlemi sürerken sondaj kabininde ani bir ROP artışı (Drilling Break: 15 ft/hr -> 45 ft/hr) kaydedildi. Birkaç dakika sonra tank hacminde (Pit Gain) +18 bbl artış ve dönüş akışında (Flow Out) %65 -> %88 yükseliş fark edildi.',
          en: 'While drilling ahead at 10,200 ft TVD, a sudden drilling break is observed (ROP jumps from 15 to 45 ft/hr). Minutes later, pit volume increases by +18 bbl and flow out jumps from 65% to 88%.'
        },
        observedData: {
          standpipePressure: 2850,
          pitVolume: 418,
          flowOut: 88,
          rop: 45,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: {
            tr: 'UYARI: Pozitif Tank Hacmi Artışı ve Dönüş Debisi Yükselmesi!',
            en: 'WARNING: Positive Pit Volume Gain and Elevated Return Flow!'
          }
        },
        choices: [
          {
            id: 'c1-flowcheck',
            text: {
              tr: 'Diziyi kuyu tabanından kaldır (off-bottom), pompaları durdur ve Akış Kontrolü (Flow Check) yap.',
              en: 'Pick up off bottom, space out tool joints above the rotary table, shut down mud pumps, and conduct a Flow Check.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Doğru ve emniyetli standart prosedür uygulandı. Pompalar kapatıldıktan sonra çamurun kuyu ağzından hala aktığı görüldü (Well is flowing!). Bu durum kesin bir KICK kanıtıdır.',
              en: 'Standard well control protocol verified. With pumps offline, mud continues discharging over the bell nipple (well is flowing). Definite kick confirmed.'
            },
            explanation: {
              tr: 'IADC ve IWCF standart kuyu kontrol kuralı: Kuyu parametrelerinde anormallik (pit gain, flow out artışı) görüldüğünde ilk adım derhal diziyi takılma riskini önlemek için kuyu tabanından kaldırmak, pompaları kapatmak ve akış olup olmadığını gözlemlemektir (Flow Check).',
              en: 'Standard IADC/IWCF rule: Upon observing drilling breaks or pit gains, immediately space out, shut down pumps, and conduct a flow check to verify formation flow.'
            },
            telemetryChange: {
              standpipePressure: 0,
              flowOut: 35,
              rop: 0
            },
            scoreChange: 30,
            nextStepId: 'step-2-shutin'
          },
          {
            id: 'c1-ignore',
            text: {
              tr: 'Delgiye tam gaz devam et, çamur yoğunluğunu kontrol etmek için kırıntı numunesi bekle.',
              en: 'Continue drilling ahead and wait for rock cuttings samples before taking action.'
            },
            outcomeType: 'critical',
            consequence: {
              tr: 'Kritik Hata! Gaz balonu kuyu anülüsünde hızla genleşti ve hidrostatik basıncı düşürdü. Tank hacmi +45 bbl oldu, kuyu tabanından püskürme (blowout) tehlikesi doğdu.',
              en: 'Critical error! Gas expanded rapidly up the annulus, reducing hydrostatic head. Pit gain reached +45 bbl with imminent blowout risk.'
            },
            explanation: {
              tr: 'Semptomları görmezden gelmek felakete davetiyedir. Gaz kuyu içinde yukarı çıktıkça Boyle Kanunu (P1*V1 = P2*V2) gereği katlanarak genleşir ve çamuru kuyudan fırlatır.',
              en: 'Ignoring kick signs allows gas to migrate upwards, expanding exponentially per Boyle\'s Law (P1*V1 = P2*V2), unloading the wellbore.'
            },
            telemetryChange: {
              pitVolume: 460,
              flowOut: 100,
              standpipePressure: 2400
            },
            scoreChange: -40,
            nextStepId: 'step-2-blowout'
          },
          {
            id: 'c1-speedup',
            text: {
              tr: 'Pompa devrini maksimuma çıkararak gazı geri aşağı itmeye çalış.',
              en: 'Increase pump SPM to maximum in an attempt to pump the kick back into the formation.'
            },
            outcomeType: 'critical',
            consequence: {
              tr: 'Hatalı karar! Pompa basıncı anülüsü zorladı ve formasyonu çatlattı, kuyu hem akış almaya hem de kaçak vermeye başladı.',
              en: 'Severe mistake! Hydraulic surge pressures fractured the casing shoe; the well is now experiencing simultaneous kick and lost circulation.'
            },
            explanation: {
              tr: 'Pompa debisini artırmak gazı aşağı itemez; aksine anüler sürtünmeyle kuyu ağzından taşmayı artırır ve zayıf muhafaza pabucunu (casing shoe) çatlatabilir.',
              en: 'Pumping harder cannot force gas down against formation pressure; friction backpressure fractures weak formations at the shoe.'
            },
            scoreChange: -30,
            nextStepId: 'step-2-blowout'
          }
        ]
      },
      'step-2-shutin': {
        id: 'step-2-shutin',
        situation: {
          tr: 'Akış kontrolünde pompalar kapalıyken kuyunun taştığı teyit edildi. Kuyu kapatma (Shut-In) prosedürüne geçilmesi gerekiyor.',
          en: 'Flow check confirms positive flow with pumps off. The well must be shut in immediately.'
        },
        observedData: {
          standpipePressure: 0,
          pitVolume: 422,
          flowOut: 20,
          rop: 0,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: {
            tr: 'KUYU AKIYOR: Akış Kontrolü Pozitif! Acil Kuyu Kapatma Gerekiyor.',
            en: 'WELL FLOWING: Positive Flow Check! Immediate Shut-In Required.'
          }
        },
        choices: [
          {
            id: 'c2-soft-shutin',
            text: {
              tr: 'Yumuşak Kapatma (Soft Shut-in): Choke vanasını açık bırak, Annular BOP kapat, ardından choke vanasını yavaşça kısarak kuyuyu kapat.',
              en: 'Soft Shut-in: Open remote choke line, close Annular BOP, then smoothly close remote choke valve.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Mükemmel uygulama. Basınç dalgası (water hammer) oluşmadan kuyu başarıyla izole edildi. SIDPP ve SICP basınçları stabilize oldu.',
              en: 'Superb execution. Annular space safely isolated without water-hammer shock loads. Drill pipe and casing pressures stabilized.'
            },
            explanation: {
              tr: 'Yumuşak kapatma prosedürü, ani hidrolik şok dalgalarının casing pabucunu ve yüzey manifoldunu tahrip etmesini engeller.',
              en: 'Soft shut-in minimizes pressure surge shocks that could break down the open hole casing shoe formation.'
            },
            telemetryChange: {
              standpipePressure: 450,
              flowOut: 0,
              pitVolume: 424
            },
            scoreChange: 40,
            nextStepId: 'step-3-stabilized'
          },
          {
            id: 'c2-hard-shutin',
            text: {
              tr: 'Sert Kapatma (Hard Shut-in): Choke vanası kapalıyken doğrudan Annular BOP veya Pipe Ram kapat.',
              en: 'Hard Shut-in: With choke already closed, immediately close Annular or Pipe Rams.'
            },
            outcomeType: 'warning',
            consequence: {
              tr: 'Kuyu kapatıldı ancak oluşan ani su darbesi (water hammer) şoku manifold hattında yüksek basınç dalgası yarattı.',
              en: 'Well is sealed, but abrupt shut-in generated a sharp pressure surge across the casing shoe and manifold.'
            },
            explanation: {
              tr: 'Sert kapatma hızlıdır ancak hassas formasyonlarda pabucun çatlamasına neden olabilir. Pek çok modern operatör kontrollü kapatmayı tercih eder.',
              en: 'Hard shut-in is rapid but induces shock waves that can exceed formation fracture limits in tight drilling margins.'
            },
            telemetryChange: {
              standpipePressure: 480,
              flowOut: 0,
              pitVolume: 423
            },
            scoreChange: 20,
            nextStepId: 'step-3-stabilized'
          }
        ]
      },
      'step-3-stabilized': {
        id: 'step-3-stabilized',
        situation: {
          tr: 'Kuyu kapatıldı ve basınçlar stabilize oldu: SIDPP = 450 psi, SICP = 620 psi, Toplam Tank Artışı = 24 bbl. Şimdi hangi kuyu kontrol adımı atılmalıdır?',
          en: 'Well is shut in and stabilized: SIDPP = 450 psi, SICP = 620 psi, Total Pit Gain = 24 bbl. What is the next procedure?'
        },
        observedData: {
          standpipePressure: 450,
          pitVolume: 424,
          flowOut: 0,
          rop: 0,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: {
            tr: 'KUYU KAPALI: SIDPP = 450 psi, SICP = 620 psi. Kill Sheet Hazırlığı.',
            en: 'WELL SHUT IN: SIDPP = 450 psi, SICP = 620 psi. Prepare Kill Sheet.'
          }
        },
        choices: [
          {
            id: 'c3-killsheet',
            text: {
              tr: 'Kill Mud Weight (KMW) hesapla, barit ağırlıklı öldürme çamurunu hazırla ve Wait & Weight veya Driller Yöntemi ile kuyuyu dolaşıma al.',
              en: 'Calculate Kill Mud Weight (KMW), weight up suction pits with barite, and execute Wait & Weight or Driller\'s Method.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'KMW = 10.8 + 450 / (0.052 * 10200) = 11.65 ppg olarak hesaplandı. Kuyu güvenli bir şekilde öldürüldü ve rezervuar gazı yüzeye zarar vermeden choke üzerinden tahliye edildi.',
              en: 'KMW computed at 11.65 ppg. Kick circulated out through the Poor Boy degasser and flare line while maintaining constant bottom hole pressure.'
            },
            explanation: {
              tr: 'Doğru öldürme çamuru formasyon basıncını hidrostatik olarak dengeler (P_form = 0.052*10.8*10200 + 450 = 6182 psi). Kuyu kontrol kuralları eksiksiz uygulandı.',
              en: 'Accurate kill mud calculation ensures bottomhole pressure exceeds formation pressure (6,182 psi) safely without breaking the casing shoe.'
            },
            scoreChange: 30
          },
          {
            id: 'c3-open-bop',
            text: {
              tr: 'Basıncı düşürmek için BOP ramlerini hemen aç ve çamuru atmosfere tahliye et.',
              en: 'Open BOP rams immediately to relieve surface casing pressure.'
            },
            outcomeType: 'critical',
            consequence: {
              tr: 'Büyük Felaket! BOP açıldığı anda 6000 psi üzerindeki gaz kulesine püskürdü ve kule tabanında kontrolsüz yangın çıktı.',
              en: 'Catastrophic disaster! Opening the BOP released 6,000+ psi gas onto the rig floor, igniting an uncontrolled surface blowout.'
            },
            explanation: {
              tr: 'Kuyu öldürülmeden BOP asla açılmaz! Basınç altındaki kuyuyu açmak felakete yol açan en ölümcül hatadır.',
              en: 'Never open BOPs on a pressurized well before killing the kick! Hydrostatic balance must be restored first.'
            },
            scoreChange: -50
          }
        ]
      },
      'step-2-blowout': {
        id: 'step-2-blowout',
        situation: {
          tr: 'Kuyu kontrolü kaybedildi! Gaz yüzeye ulaştı, rotary tablasından kontrolsüz çamur fışkırıyor.',
          en: 'Well control lost! Gas has reached the surface, erupting through the rotary table.'
        },
        observedData: {
          standpipePressure: 1200,
          pitVolume: 520,
          flowOut: 100,
          rop: 0,
          hookLoad: 210,
          mudWeight: 8.9,
          statusAlert: {
            tr: 'ACİL DURUM: KONTROLSÜZ AKIŞ (BLOWOUT RİSKİ)!',
            en: 'EMERGENCY: UNCONTROLLED SURFACE FLOW (BLOWOUT RISK)!'
          }
        },
        choices: [
          {
            id: 'c-esd',
            text: {
              tr: 'Kör Kesici Makas Ramini (Blind Shear Ram) devreye sok, kule acil durdurma (ESD) sistemini etkinleştir ve personeli tahliye et.',
              en: 'Activate Blind Shear Rams to cut pipe and seal wellbore; trip Emergency Shutdown (ESD) and evacuate personnel.'
            },
            outcomeType: 'warning',
            consequence: {
              tr: 'Shear ram boruyu kesti ve kuyuyu mühürledi. Can kaybı önlendi ancak sondaj dizisi kuyuda kaldı.',
              en: 'Shear rams severed the drill pipe and capped the well. Loss of life prevented; pipe left in hole.'
            },
            explanation: {
              tr: 'Shear Ram son savunma hattıdır. Can kaybı önlendi ancak operasyonel maliyet milyonlarca dolar oldu.',
              en: 'Shear Rams are the ultimate line of defense when conventional well control fails, sacrificing tubulars to preserve human life.'
            },
            scoreChange: 0
          }
        ]
      }
    }
  },
  {
    id: 'scenario-lost-circulation',
    title: {
      tr: 'Şiddetli Kaçak (Lost Circulation)',
      en: 'Severe Lost Circulation'
    },
    turkishTitle: 'Şiddetli Kaçak (Lost Circulation)',
    difficulty: 'Orta',
    summary: {
      tr: 'Kırıklı kireçtaşı formasyonuna girildiğinde tank seviyesi aniden düşüyor ve kuyu dönüş debisi sıfırlanıyor.',
      en: 'Fractured limestone formation causes sudden severe drop in pit volumes and loss of mud returns.'
    },
    initialConditions: {
      depth: 6800,
      tvd: 6800,
      holeSize: 12.25,
      drillCollarLength: 450,
      mudWeight: 11.2,
      formation: {
        tr: 'Kırıklı ve Mağaralı Kireçtaşı (Fractured Limestone)',
        en: 'Naturally Fractured Karstic Limestone'
      }
    },
    equipmentIdFocus: 'mud-tanks',
    initialStepId: 'step-lc-1',
    steps: {
      'step-lc-1': {
        id: 'step-lc-1',
        situation: {
          tr: '6,800 ft derinlikte aniden çamur dönüş debisi (Flow Out) %100\'den %15\'e düştü ve tank seviyesi dakikada 8 bbl hızla eksilmeye başladı. Pompa basıncında da 250 psi düşüş görüldü.',
          en: 'At 6,800 ft, return flow abruptly drops from 100% to 15%, pit volume decreases at 8 bbl/min, and standpipe pressure drops by 250 psi.'
        },
        observedData: {
          standpipePressure: 2200,
          pitVolume: 310,
          flowOut: 15,
          rop: 22,
          hookLoad: 180,
          mudWeight: 11.2,
          statusAlert: {
            tr: 'ACİL: Dolaşım Kaybı (Lost Circulation) - Çamur Tankı Hızla Boşalıyor!',
            en: 'EMERGENCY: Lost Circulation - Mud Pits Emptying Rapidly!'
          }
        },
        choices: [
          {
            id: 'clc-pumprate',
            text: {
              tr: 'Delgiyi durdur, anülüsü kuyu tepesinden tatlı su veya hafif çamurla doldurarak sıvı seviyesini izle ve LCM (Lost Circulation Material) hapı hazırla.',
              en: 'Stop drilling, fill the annulus from surface to monitor fluid level, and mix high-viscosity LCM (Lost Circulation Material) pills.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Kuyu anülüsü doldurularak hidrostatik sütunun çökmesi ve ikincil bir kick gelmesi önlendi. LCM hapı çatlakları tıkamaya hazırlandı.',
              en: 'Hydrostatic fluid level maintained from surface, preventing hydrostatic collapse and secondary kick. LCM pill staged.'
            },
            explanation: {
              tr: 'Kaçak anında kuyu içindeki sıvı sütunu düşerse hidrostatik basınç formasyon basıncının altına inebilir ve kuyu kick alabilir (Loss/Kick durumu). Üstten doldurmak seviyeyi tespit etmeyi sağlar.',
              en: 'When mud level drops in the annulus, bottomhole pressure falls, risking a simultaneous kick and loss. Filling the annulus establishes true fluid level.'
            },
            telemetryChange: {
              standpipePressure: 0,
              rop: 0,
              flowOut: 0
            },
            scoreChange: 35,
            nextStepId: 'step-lc-2'
          },
          {
            id: 'clc-heavy-mud',
            text: {
              tr: 'Kaçağı tıkamak için çamur yoğunluğunu derhal 11.2 ppg\'den 13.5 ppg\'ye çıkar.',
              en: 'Heavily weight up mud from 11.2 to 13.5 ppg to plug fractures.'
            },
            outcomeType: 'critical',
            consequence: {
              tr: 'Büyük Hata! Çamur ağırlaştırılınca hidrostatik basınç formasyon çatlatma sınırını çok daha fazla aştı ve kayıp %100 oldu (Total Losses).',
              en: 'Disastrous mistake! Increased mud weight exacerbated hydrostatic overpressure, fracturing the formation further into total losses.'
            },
            explanation: {
              tr: 'Kaçak olan kuyuya daha ağır çamur basmak formasyonun daha da çatlamasına neden olur. Yoğunluk artırılmaz, aksine gerekirse düşürülür veya LCM hapı pompalanır.',
              en: 'Pumping heavier mud increases bottomhole pressure, worsening losses. Operators should reduce density or pump particulate LCM pills.'
            },
            scoreChange: -40
          }
        ]
      },
      'step-lc-2': {
        id: 'step-lc-2',
        situation: {
          tr: 'Anülüsten kuyuya sıvı verildi ve seviyenin yüzeyden 350 ft aşağıda dengelendiği görüldü. Tankta 50 bbl yüksek viskoziteli lifli LCM hapı hazırlandı.',
          en: 'Annulus was topped up, fluid level stabilized at 350 ft below surface. 50 bbl fibrous LCM pill is mixed in the slug pit.'
        },
        observedData: {
          standpipePressure: 0,
          pitVolume: 260,
          flowOut: 0,
          rop: 0,
          hookLoad: 180,
          mudWeight: 11.2,
          statusAlert: {
            tr: 'LCM HAPI HAZIR: Kırık bölgesine kontrollü pompalama kararı bekleniyor.',
            en: 'LCM PILL READY: Spotting decision required across loss zone.'
          }
        },
        choices: [
          {
            id: 'clc-pump-lcm',
            text: {
              tr: 'LCM hapını matkap ucundan kaçağın olduğu derinliğe düşük debide pompala, kuyu anülüsüne it ve 4-6 saat bekle.',
              en: 'Spot the LCM pill across the loss zone at low pump rate, hesitate squeeze, and allow 4-6 hours to bridge.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Başarılı! Lifli parçacıklar kırıkları köprüledi (bridging) ve filtre keki oluşturdu. Çamur pompaları çalıştırıldığında dönüş debisi %100\'e ulaştı.',
              en: 'Success! Granular and fibrous LCM particles bridged fracture apertures. Returns restored to 100% when circulating.'
            },
            explanation: {
              tr: 'Doğru seçilmiş partikül boyut dağılımına sahip LCM (Lost Circulation Material) hapları kırıkların ağzını tıkayarak hidrostatik sütunun yeniden kurulmasını sağlar.',
              en: 'Properly graded LCM bridges across fracture throats, forming an impermeable filter cake to restore circulation.'
            },
            scoreChange: 40
          }
        ]
      }
    }
  },
  {
    id: 'scenario-stuck-pipe',
    title: {
      tr: 'Diferansiyel Sıkışma (Differential Sticking)',
      en: 'Differential Pipe Sticking'
    },
    turkishTitle: 'Diferansiyel Sıkışma (Differential Sticking)',
    difficulty: 'Orta',
    summary: {
      tr: 'Yüksek overbalance basıncı altında geçirgen kumtaşı formasyonunda boru hareketsiz bırakıldığında kuyu duvarına yapışıyor.',
      en: 'Drill string left stationary across permeable sand under high overbalance becomes stuck against the borehole mudcake.'
    },
    initialConditions: {
      depth: 8900,
      tvd: 8900,
      holeSize: 8.5,
      drillCollarLength: 500,
      mudWeight: 12.8,
      formation: {
        tr: 'Gözenekli Geçirgen Kumtaşı (Porosity: %24, Permeability: 350 mD)',
        en: 'High Permeability Sandstone (Porosity: 24%, Perm: 350 mD)'
      }
    },
    equipmentIdFocus: 'drawworks',
    initialStepId: 'step-sp-1',
    steps: {
      'step-sp-1': {
        id: 'step-sp-1',
        situation: {
          tr: 'Sondaj dizisi 8,900 ft derinlikte 45 dakika hareketsiz asılı kaldı. Kule vinci diziyi yukarı çekemedi (Hook Load tavan yaptı) ve rotary dönemedi. Çamur sirkülasyonu ise normal devam ediyor.',
          en: 'Drill string remained stationary for 45 minutes at 8,900 ft. Hoisting stalls (overpull limit), cannot rotate, yet circulation is completely unobstructed.'
        },
        observedData: {
          standpipePressure: 2400,
          pitVolume: 400,
          flowOut: 100,
          rop: 0,
          hookLoad: 380,
          mudWeight: 12.8,
          statusAlert: {
            tr: 'BORU SIKIŞTI: Tam Dolaşım Var, Ancak Dizi Yukarı Çekilemiyor ve Dönmüyor!',
            en: 'PIPE STUCK: Full Circulation Maintained, Cannot Hoist or Rotate!'
          }
        },
        choices: [
          {
            id: 'csp-identify',
            text: {
              tr: 'Dolaşımın engelsiz olması nedeniyle durumun "Diferansiyel Sıkışma" olduğunu teşhis et; derhal aşağı jar vur, tork uygula ve serbestleştirme sıvısı (spotting fluid) planla.',
              en: 'Diagnose as Differential Sticking due to unrestricted circulation; immediately jar down with torque and spot freeing pill.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Doğru teşhis! Mekanik değil diferansiyel sıkışma olduğu belirlendi. Aşağı hidrolik darbe ve tork ile dizinin kekten ayrılması sağlandı.',
              en: 'Correct technical diagnosis. Free circulation confirmed differential sticking; downward jarring and torque initiated release.'
            },
            explanation: {
              tr: 'Diferansiyel sıkışmanın 3 göstergesi: 1) Dolaşım serbesttir, 2) Boru geçirgen formasyon karşısında hareketsiz kalmıştır, 3) Kuyu içi hidrostatik basıncı formasyon basıncından yüksektir. Çözüm: Aşağı jar vurmak ve çamur kekini çözecek yağ/glikol hapı basmaktır.',
              en: 'Hallmarks of differential sticking: 1) Unrestricted circulation, 2) String stationary in permeable zone, 3) High overbalance pressure differential.'
            },
            scoreChange: 40,
            nextStepId: 'step-sp-2'
          },
          {
            id: 'csp-pull-hard',
            text: {
              tr: 'Vinci son gücüne kadar zorla, boru kopma sınırının (yield strength) üzerine çıkana kadar yukarı asıl.',
              en: 'Pull with maximum drawworks capacity beyond the drill pipe tensile yield rating.'
            },
            outcomeType: 'critical',
            consequence: {
              tr: 'Felaket! Sondaj borusu alet bağlantısından koptu (pipe parted). Kuyu içinde 3000 ft boru kaldı ve pahalı balıkçılık (fishing) gerekti.',
              en: 'Catastrophic failure! Drill pipe parted at a tool joint connection, leaving 3,000 ft of fish in the hole.'
            },
            explanation: {
              tr: 'Diferansiyel yapışma kuvveti F = ΔP × A × μ yüz binlerce libreye ulaşabilir. Boruyu kopma limitinin üzerinde çekmek borunun kopmasına neden olur.',
              en: 'Differential sticking force (F = ΔP * Area * friction) can exceed string yield strength. Pulling beyond tensile limits parts the pipe.'
            },
            scoreChange: -40
          }
        ]
      },
      'step-sp-2': {
        id: 'step-sp-2',
        situation: {
          tr: 'Aşağı jar darbeleri uygulandı ve sıkışma bölgesine 35 bbl glikol/yağ bazlı serbestleştirme hapı (spotting pill) basıldı. Boru hafifçe oynadı.',
          en: 'Downward jar impacts delivered and 35 bbl oil-glycol spotting pill pumped across stuck interval. Drill string shows slight movement.'
        },
        observedData: {
          standpipePressure: 2350,
          pitVolume: 400,
          flowOut: 100,
          rop: 0,
          hookLoad: 240,
          mudWeight: 12.8,
          statusAlert: {
            tr: 'BORU HAREKETLENDİ: Tam Serbestleşme İçin Son Müdahale.',
            en: 'STRING FREED SLIGHTLY: Final operations to liberate drill string.'
          }
        },
        choices: [
          {
            id: 'csp-rotate-free',
            text: {
              tr: 'Düşük devirde sağa tork vererek rotary ile yavaşça döndür, aynı anda hafifçe yukarı kaldırıp dolaşımı sürdür.',
              en: 'Work slow right-hand torque with rotary, simultaneously reciprocating upward with circulation.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Boru tamamen kurtarıldı! Dizi kuyu tabanından güvenli derinliğe çekildi ve filtre keki iyileştirildi.',
              en: 'Drill string completely liberated! String reciprocated cleanly and mud filter cake properties optimized.'
            },
            explanation: {
              tr: 'Spotting fluid filtre kekini inceltip sürtünme katsayısını düşürdükten sonra kontrollü tork ve çekme ile boru güvenle kurtarılır.',
              en: 'Spotting fluid shrinks filter cake thickness and lowers friction coefficient, freeing the embedded pipe.'
            },
            scoreChange: 30
          }
        ]
      }
    }
  },
  {
    id: 'scenario-gas-cut',
    title: {
      tr: 'Gazlı Çamur ve Yüzey Davranışı',
      en: 'Gas Cut Mud Behavior'
    },
    turkishTitle: 'Gazlı Çamur ve Yüzey Davranışı',
    difficulty: 'Başlangıç',
    summary: {
      tr: 'Titreşimli eleklerde çamur kabarcıklanıyor ve çamur terazisinde yoğunluk 10.5 ppg\'den 8.8 ppg\'ye düşmüş görünüyor.',
      en: 'Mud foams across shale shakers and mud balance measurements drop from 10.5 to 8.8 ppg, but shut-in pressures are zero.'
    },
    initialConditions: {
      depth: 7500,
      tvd: 7500,
      holeSize: 8.5,
      drillCollarLength: 400,
      mudWeight: 10.5,
      formation: {
        tr: 'Sıkı Gazlı Şist (Gas-bearing Tight Shale)',
        en: 'Gas-bearing Tight Organic Shale'
      }
    },
    equipmentIdFocus: 'shale-shakers',
    initialStepId: 'step-gc-1',
    steps: {
      'step-gc-1': {
        id: 'step-gc-1',
        situation: {
          tr: 'Eleklerde köpürme gözlendi. Yüzeydeki çamur yoğunluğu 8.8 ppg olarak ölçüldü. Ancak kuyu kapatıldığında boru ve kılıf manometrelerinde (SIDPP ve SICP) basınç SIFIR psi okundu. Tank seviyesinde artış yok.',
          en: 'Mud is aerated at shaker screens. Mud weight measured at 8.8 ppg. When shut in, SIDPP and SICP read 0 psi. No pit volume gain.'
        },
        observedData: {
          standpipePressure: 2100,
          pitVolume: 350,
          flowOut: 60,
          rop: 18,
          hookLoad: 160,
          mudWeight: 8.8,
          statusAlert: {
            tr: 'ELEKLERDE KÖPÜKLENME: Yüzeyde Çamur Yoğunluğu Düştü, Manometreler 0 psi.',
            en: 'SURFACE AERATION: Mud Weight Dropped at Surface, Shut-In Pressures 0 psi.'
          }
        },
        choices: [
          {
            id: 'cgc-degasser',
            text: {
              tr: 'Durumun gerçek bir kick değil, kırılan kayaç gözeneklerindeki gazın yüzeye yakın genleşmesi (Drilled Gas) olduğunu teşhis et; Vakum Gaz Ayırıcıyı (Degasser) devreye al ve çamuru temizleyerek yoğunluğu izle.',
              en: 'Diagnose as drilled gas expansion rather than a kick; align flow through vacuum degasser and monitor desander pit density.'
            },
            outcomeType: 'safe',
            consequence: {
              tr: 'Mükemmel teknik teşhis. Basınçlar sıfır ve pit gain olmadığı için kuyuya akış girmediği, gazın yüzeyde genleşerek yoğunluğu düşürdüğü anlaşıldı. Degasser gazı tahliye etti.',
              en: 'Accurate technical diagnosis. With zero shut-in pressures and stable pit volume, bottomhole hydrostatic remained intact. Degasser restored mud density.'
            },
            explanation: {
              tr: 'Drilled Gas yüzeye yaklaştıkça düşük hidrostatik basınç altında hacimce genleşir ve yüzey çamur ağırlığını düşürür (Gas-cut mud). Ancak kuyu dibindeki hidrostatik kayıp çok azdır (<100 psi).',
              en: 'Drilled gas expands near surface due to reduced hydrostatic pressure, reducing surface mud density without significant bottomhole hydrostatic loss.'
            },
            scoreChange: 40
          },
          {
            id: 'cgc-panic-barite',
            text: {
              tr: 'Panik yapıp çamur tankına derhal tonlarca barit dökerek yoğunluğu 14 ppg seviyesine fırlat.',
              en: 'Add excessive barite to weight up the entire active system to 14.0 ppg immediately.'
            },
            outcomeType: 'warning',
            consequence: {
              tr: 'Kuyu dibi aşırı yüklendi (Overbalance +1200 psi oldu), delme hızı yarı yarıya düştü ve formasyonda mikro çatlaklar oluştu.',
              en: 'Overbalance surged past +1,200 psi, halving penetration rates and initiating micro-fractures in sensitive formations.'
            },
            explanation: {
              tr: 'Gas cut mud durumunda kuyu dibi gerçekte kick almamıştır. Gereksiz barit eklemek çamur maliyetini katlar ve kuyuya zarar verir.',
              en: 'Gas-cut mud does not mean underbalance at total depth. Indiscriminately adding barite wastes chemicals and risks fracturing formations.'
            },
            scoreChange: -10
          }
        ]
      }
    }
  }
];
