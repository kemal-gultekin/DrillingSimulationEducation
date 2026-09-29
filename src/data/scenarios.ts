import { DrillingScenario } from '../types';

export const DRILLING_SCENARIOS: DrillingScenario[] = [
  {
    id: 'scenario-kick',
    title: 'Formation Influx (Kick Detection & Shut-In)',
    turkishTitle: 'Formasyon Akışı (Kick Tespiti ve Kuyu Kapatma)',
    difficulty: 'Zor',
    summary: 'Delgi sırasında beklenmedik pompa basıncı düşüşü, tank hacmi artışı ve delme hızı artışı (drilling break) gözleniyor.',
    initialConditions: {
      depth: 10450,
      tvd: 10200,
      holeSize: 8.5,
      drillCollarLength: 600,
      mudWeight: 10.8,
      formation: 'Yüksek Basınçlı Gazlı Kumtaşı (Permeable Sandstone)'
    },
    equipmentIdFocus: 'bop-stack',
    initialStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        situation: '10,200 ft TVD derinlikte delme işlemi sürerken sondaj kabininde ani bir ROP artışı (Drilling Break: 15 ft/hr -> 45 ft/hr) kaydedildi. Birkaç dakika sonra tank hacminde (Pit Gain) +18 bbl artış ve dönüş akışında (Flow Out) %65 -> %88 yükseliş fark edildi.',
        observedData: {
          standpipePressure: 2850,
          pitVolume: 418,
          flowOut: 88,
          rop: 45,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: 'UYARI: Pozitif Tank Hacmi Artışı ve Dönüş Debisi Yükselmesi!'
        },
        choices: [
          {
            id: 'c1-flowcheck',
            text: 'Diziyi kuyu tabanından kaldır (off-bottom), pompaları durdur ve Akış Kontrolü (Flow Check) yap.',
            outcomeType: 'safe',
            consequence: 'Doğru ve emniyetli standart prosedür uygulandı. Pompalar kapatıldıktan sonra çamurun kuyu ağzından hala aktığı görüldü (Well is flowing!). Bu durum kesin bir KICK kanıtıdır.',
            explanation: 'IADC ve IWCF standart kuyu kontrol kuralı: Kuyu parametrelerinde anormallik (pit gain, flow out artışı) görüldüğünde ilk adım derhal diziyi takılma riskini önlemek için rotary tablası üzerine kaldırmak (space out), pompaları kapatmak ve akış olup olmadığını gözlemlemektir (Flow Check).',
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
            text: 'Delgiye tam gaz devam et, çamur yoğunluğunu kontrol etmek için kırıntı numunesi bekle.',
            outcomeType: 'critical',
            consequence: 'Kritik Hata! Gaz balonu kuyu anülüsünde hızla genleşti ve hidrostatik basıncı düşürdü. Tank hacmi +45 bbl oldu, kuyu tabanından püskürme (blowout) tehlikesi doğdu.',
            explanation: 'Semptomları görmezden gelmek felakete davetiyedir. Gaz kuyu içinde yukarı çıktıkça Boyle Kanunu (P1*V1 = P2*V2) gereği katlanarak genleşir ve çamuru kuyudan fırlatır.',
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
            text: 'Pompa devrini maksimuma çıkararak gazı geri aşağı itmeye çalış.',
            outcomeType: 'critical',
            consequence: 'Hatalı karar! Pompa basıncı anülüsü zorladı ve formasyonu çatlattı, kuyu hem akış almaya hem de kaçak vermeye başladı.',
            explanation: 'Pompa debisini artırmak gazı aşağı itemez; aksine anüler sürtünmeyle kuyu ağzından taşmayı artırır ve zayıf muhafaza pabucunu (casing shoe) çatlatabilir.',
            scoreChange: -30,
            nextStepId: 'step-2-blowout'
          }
        ]
      },
      'step-2-shutin': {
        id: 'step-2-shutin',
        situation: 'Akış kontrolünde pompalar kapalıyken kuyunun taştığı teyit edildi. Kuyu kapatma (Shut-In) prosedürüne geçilmesi gerekiyor.',
        observedData: {
          standpipePressure: 0,
          pitVolume: 422,
          flowOut: 20,
          rop: 0,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: 'KUYU AKIYOR: Akış Kontrolü Pozitif! Acil Kuyu Kapatma Gerekiyor.'
        },
        choices: [
          {
            id: 'c2-soft-shutin',
            text: 'Yumuşak Kapatma (Soft Shut-in): Choke vanasını açık bırak, Annular BOP kapat, ardından choke vanasını yavaşça kısarak kuyuyu kapat.',
            outcomeType: 'safe',
            consequence: 'Mükemmel uygulama. Basınç dalgası (water hammer) oluşmadan kuyu başarıyla izole edildi. SIDPP ve SICP basınçları stabilize oldu.',
            explanation: 'Yumuşak kapatma prosedürü, ani hidrolik şok dalgalarının casing pabucunu ve yüzey manifoldunu tahrip etmesini engeller.',
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
            text: 'Sert Kapatma (Hard Shut-in): Choke vanası kapalıyken doğrudan Annular BOP veya Pipe Ram kapat.',
            outcomeType: 'warning',
            consequence: 'Kuyu kapatıldı ancak oluşan ani su darbesi (water hammer) şoku manifold hattında yüksek basınç dalgası yarattı.',
            explanation: 'Sert kapatma hızlıdır ancak hassas formasyonlarda pabucun çatlamasına neden olabilir. Pek çok modern operatör yumuşak veya kontrollü sert kapatma uygular.',
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
        situation: 'Kuyu kapatıldı ve basınçlar stabilize oldu: SIDPP = 450 psi, SICP = 620 psi, Toplam Tank Artışı = 24 bbl. Şimdi hangi kuyu kontrol adımı atılmalıdır?',
        observedData: {
          standpipePressure: 450,
          pitVolume: 424,
          flowOut: 0,
          rop: 0,
          hookLoad: 240,
          mudWeight: 10.6,
          statusAlert: 'KUYU KAPALI: SIDPP = 450 psi, SICP = 620 psi. Kill Sheet Hazırlığı.'
        },
        choices: [
          {
            id: 'c3-killsheet',
            text: 'Kill Mud Weight (KMW) hesapla, barit ağırlıklı öldürme çamurunu hazırla ve Wait & Weight (Mühendis) veya Driller Yöntemi ile kuyuyu dolaşıma al.',
            outcomeType: 'safe',
            consequence: 'KMW = 10.8 + 450 / (0.052 * 10200) = 11.65 ppg olarak hesaplandı. Kuyu güvenli bir şekilde öldürüldü ve rezervuar gazı yüzeye zarar vermeden choke üzerinden tahliye edildi.',
            explanation: 'Doğru öldürme çamuru formasyon basıncını hidrostatik olarak dengeler (P_form = 0.052*10.8*10200 + 450 = 6182 psi). Kuyu kontrol kuralları eksiksiz uygulandı.',
            scoreChange: 30
          },
          {
            id: 'c3-open-bop',
            text: 'Basıncı düşürmek için BOP ramlerini hemen aç ve çamuru atmosfere tahliye et.',
            outcomeType: 'critical',
            consequence: 'Büyük Felaket! BOP açıldığı anda 6000 psi üzerindeki gaz kulesine püskürdü ve kule tabanında kontrolsüz yangın çıktı.',
            explanation: 'Kuyu öldürülmeden BOP asla açılmaz! Basınç altındaki kuyuyu açmak felakete yol açan en ölümcül hatadır.',
            scoreChange: -50
          }
        ]
      },
      'step-2-blowout': {
        id: 'step-2-blowout',
        situation: 'Kuyu kontrolü kaybedildi! Gaz yüzeye ulaştı, rotary tablasından kontrolsüz çamur fışkırıyor.',
        observedData: {
          standpipePressure: 1200,
          pitVolume: 520,
          flowOut: 100,
          rop: 0,
          hookLoad: 210,
          mudWeight: 8.9,
          statusAlert: 'ACİL DURUM: KONTROLSÜZ AKIŞ (BLOWOUT RİSKİ)!'
        },
        choices: [
          {
            id: 'c-esd',
            text: 'Kör Kesici Makas Ramini (Blind Shear Ram) devreye sok, kule acil durdurma (ESD) sistemini etkinleştir ve personeli tahliye et.',
            outcomeType: 'warning',
            consequence: 'Shear ram boruyu kesti ve kuyuyu kesti. Kuyu mühürlendi ancak sondaj dizisi kuyuda kaldı ve kuyu terk edildi.',
            explanation: 'Shear Ram son savunma hattıdır. Can kaybı önlendi ancak operasyonel maliyet milyonlarca dolar oldu.',
            scoreChange: 0
          }
        ]
      }
    }
  },
  {
    id: 'scenario-lost-circulation',
    title: 'Severe Lost Circulation (Kaçak & Dolaşım Kaybı)',
    turkishTitle: 'Şiddetli Kaçak (Lost Circulation)',
    difficulty: 'Orta',
    summary: 'Kırıklı kireçtaşı formasyonuna girildiğinde tank seviyesi aniden düşüyor ve kuyu dönüş debisi sıfırlanıyor.',
    initialConditions: {
      depth: 6800,
      tvd: 6800,
      holeSize: 12.25,
      drillCollarLength: 450,
      mudWeight: 11.2,
      formation: 'Kırıklı ve Mağaralı Kireçtaşı (Fractured Limestone)'
    },
    equipmentIdFocus: 'mud-tanks',
    initialStepId: 'step-lc-1',
    steps: {
      'step-lc-1': {
        id: 'step-lc-1',
        situation: '6,800 ft derinlikte aniden çamur dönüş debisi (Flow Out) %100\'den %15\'e düştü ve tank seviyesi dakikada 8 bbl hızla eksilmeye başladı. Pompa basıncında da 250 psi düşüş görüldü.',
        observedData: {
          standpipePressure: 2200,
          pitVolume: 310,
          flowOut: 15,
          rop: 22,
          hookLoad: 180,
          mudWeight: 11.2,
          statusAlert: 'ACİL: Dolaşım Kaybı (Lost Circulation) - Çamur Tankı Hızla Boşalıyor!'
        },
        choices: [
          {
            id: 'clc-pumprate',
            text: 'Delgiyi durdur, anülüsü kuyu tepesinden tatlı su veya hafif çamurla doldurarak sıvı seviyesini izle ve LCM (Lost Circulation Material) hapı hazırla.',
            outcomeType: 'safe',
            consequence: 'Kuyu anülüsü doldurularak hidrostatik sütunun çökmesi ve ikincil bir kick gelmesi önlendi. LCM hapı çatlakları tıkamaya hazırlandı.',
            explanation: 'Kaçak anında kuyu içindeki sıvı sütunu düşerse hidrostatik basınç formasyon basıncının altına inebilir ve aynı anda kuyu kick alabilir (Loss/Kick senaryosu). Anülüsü üstten doldurmak sıvı seviyesini tespit etmeyi sağlar.',
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
            text: 'Kaçağı tıkamak için çamur yoğunluğunu derhal 11.2 ppg\'den 13.5 ppg\'ye çıkar.',
            outcomeType: 'critical',
            consequence: 'Büyük Hata! Çamur ağırlaştırılınca kuyu tabanındaki hidrostatik basınç formasyon çatlatma sınırını çok daha fazla aştı ve kuyu tamamen kırılarak kayıp %100 oldu (Total Losses).',
            explanation: 'Kaçak olan kuyuya daha ağır çamur basmak formasyonun daha da çatlamasına neden olur. Yoğunluk artırılmaz, aksine gerekirse düşürülür veya LCM hapı pompalanır.',
            scoreChange: -40
          },
          {
            id: 'clc-continue',
            text: 'Hiçbir şey yapmadan tanktaki yedek çamurları devreye sokup delgiye devam et.',
            outcomeType: 'critical',
            consequence: 'Tüm yedek tanklar 25 dakikada tükendi, kuyu kuru kaldı ve dizide diferansiyel sıkışma meydana geldi.',
            explanation: 'Kaçak çözülmeden delgiye devam edilmez, pahalı sondaj çamuru toprağa kaybedilir ve kuyu kontrolü yitirilir.',
            scoreChange: -30
          }
        ]
      },
      'step-lc-2': {
        id: 'step-lc-2',
        situation: 'Anülüsten kuyuya sıvı verildi ve seviyenin yüzeyden 350 ft aşağıda dengelendiği görüldü. Tankta kaba ve lifli malzemeler (fındık kabuğu, mika, kalsiyum karbonat - LCM) içeren 50 bbl yüksek viskoziteli LCM hapı hazırlandı.',
        observedData: {
          standpipePressure: 0,
          pitVolume: 260,
          flowOut: 0,
          rop: 0,
          hookLoad: 180,
          mudWeight: 11.2,
          statusAlert: 'LCM HAPI HAZIR: Kırık bölgesine kontrollü pompalama kararı bekleniyor.'
        },
        choices: [
          {
            id: 'clc-pump-lcm',
            text: 'LCM hapını matkap ucundan kaçağın olduğu derinliğe düşük debide pompala, kuyu anülüsüne it ve 4-6 saat formasyonun tıkamasını bekle.',
            outcomeType: 'safe',
            consequence: 'Başarılı! Lifli parçacıklar kırıkları köprüledi (bridging) ve filtre keki oluşturdu. Çamur pompaları çalıştırıldığında dönüş debisi %100\'e ulaştı.',
            explanation: 'Doğru seçilmiş partikül boyut dağılımına sahip LCM (Lost Circulation Material) hapları kırıkların ağzını tıkayarak hidrostatik sütunun yeniden kurulmasını sağlar.',
            scoreChange: 40
          }
        ]
      }
    }
  },
  {
    id: 'scenario-stuck-pipe',
    title: 'Differential Sticking (Diferansiyel Boru Sıkışması)',
    turkishTitle: 'Diferansiyel Sıkışma (Differential Sticking)',
    difficulty: 'Orta',
    summary: 'Yüksek overbalance basıncı altında geçirgen kumtaşı formasyonunda boru hareketsiz bırakıldığında kuyu duvarına yapışıyor.',
    initialConditions: {
      depth: 8900,
      tvd: 8900,
      holeSize: 8.5,
      drillCollarLength: 500,
      mudWeight: 12.8,
      formation: 'Gözenekli Geçirgen Kumtaşı (Porosity: %24, Permeability: 350 mD)'
    },
    equipmentIdFocus: 'drawworks',
    initialStepId: 'step-sp-1',
    steps: {
      'step-sp-1': {
        id: 'step-sp-1',
        situation: 'Kule tabanında elektrik arızası nedeniyle sondaj dizisi 8,900 ft derinlikte 45 dakika hareketsiz (dönmeden ve hareket etmeden) asılı kaldı. Arıza giderildiğinde kule vinci diziyi yukarı çekemedi (Hook Load maksimuma vurdu) ve rotary tablası dönemedi. Çamur sirkülasyonu ise normal şekilde devam ediyor.',
        observedData: {
          standpipePressure: 2400,
          pitVolume: 400,
          flowOut: 100,
          rop: 0,
          hookLoad: 380,
          mudWeight: 12.8,
          statusAlert: 'BORU SIKIŞTI: Tam Dolaşım Var, Ancak Dizi Yukarı Çekilemiyor ve Dönmüyor!'
        },
        choices: [
          {
            id: 'csp-identify',
            text: 'Dolaşımın tam olması ve formasyonun geçirgen kumtaşı olması nedeniyle durumun "Diferansiyel Sıkışma" olduğunu teşhis et; derhal aşağı yönde darbe (jar down), tork uygula ve spotting fluid (yağ bazlı serbestleştirme sıvısı) planla.',
            outcomeType: 'safe',
            consequence: 'Doğru teşhis! Mekanik sıkışma değil diferansiyel sıkışma olduğu anlaşıldı. Aşağı yönde hidrolik kavanozlama (jarring) ve tork ile dizinin filtre kekinden kurtarılması sağlandı.',
            explanation: 'Diferansiyel sıkışmanın 3 altın kuralı vardır: 1) Kuyu dolaşımı tamdır ve engelsizdir, 2) Boru geçirgen formasyon karşısında hareketsiz kalmıştır, 3) Kuyu içi hidrostatik basıncı formasyon basıncından belirgin şekilde yüksektir (yüksek overbalance). Çözüm: Aşağı jar vurmak ve çamur kekini çözecek yağ/glikol hapı (spotting fluid) basmaktır.',
            scoreChange: 40,
            nextStepId: 'step-sp-2'
          },
          {
            id: 'csp-pull-hard',
            text: 'Vinci son gücüne kadar zorla, boru kopma sınırının (yield strength) üzerine çıkana kadar yukarı asıl.',
            outcomeType: 'critical',
            consequence: 'Felaket! Sondaj borusu alet bağlantısından koptu (pipe parted/twist-off). Kuyu içinde 3000 ft boru kaldı ve pahalı balıkçılık (fishing) operasyonu gerekti.',
            explanation: 'Diferansiyel yapışma kuvveti F = ΔP × A × μ yüz binlerce libreye ulaşabilir. Boruyu kopma limitinin üzerinde çekmek borunun kopmasına neden olur.',
            scoreChange: -40
          }
        ]
      },
      'step-sp-2': {
        id: 'step-sp-2',
        situation: 'Aşağı jar darbeleri uygulandı ve sıkışma bölgesine 35 bbl organik asit ve glikol bazlı serbestleştirme hapı (spotting pill) basıldı. Boru hafifçe oynadı.',
        observedData: {
          standpipePressure: 2350,
          pitVolume: 400,
          flowOut: 100,
          rop: 0,
          hookLoad: 240,
          mudWeight: 12.8,
          statusAlert: 'BORU HAREKETLENDİ: Tam Serbestleşme İçin Son Müdahale.'
        },
        choices: [
          {
            id: 'csp-rotate-free',
            text: 'Düşük devirde sağa tork vererek rotary ile yavaşça döndür, aynı anda hafifçe yukarı kaldırıp dolaşımı sürdür.',
            outcomeType: 'safe',
            consequence: 'Boru tamamen kurtarıldı! Dizi kuyu tabanından güvenli derinliğe çekildi ve filtre keki iyileştirildi.',
            explanation: 'Spotting fluid filtre kekini inceltip sürtünme katsayısını düşürdükten sonra kontrollü tork ve çekme ile boru güvenle kurtarılır.',
            scoreChange: 30
          }
        ]
      }
    }
  },
  {
    id: 'scenario-gas-cut',
    title: 'Gas Cut Mud (Gazlı Çamur)',
    turkishTitle: 'Gazlı Çamur ve Yüzey Davranışı',
    difficulty: 'Başlangıç',
    summary: 'Titreşimli eleklerde çamur kabarcıklanıyor ve çamur terazisinde yoğunluk 10.5 ppg\'den 8.8 ppg\'ye düşmüş görünüyor.',
    initialConditions: {
      depth: 7500,
      tvd: 7500,
      holeSize: 8.5,
      drillCollarLength: 400,
      mudWeight: 10.5,
      formation: 'Sıkı Gazlı Şist (Gas-bearing Shale)'
    },
    equipmentIdFocus: 'shale-shakers',
    initialStepId: 'step-gc-1',
    steps: {
      'step-gc-1': {
        id: 'step-gc-1',
        situation: 'Eleklerde köpürme gözlendi. Çamur mühendisi yüzeydeki çamur yoğunluğunu 8.8 ppg olarak ölçtü. Ancak kuyu kapatıldığında boru ve kılıf manometrelerinde (SIDPP ve SICP) basınç SIFIR psi okundu. Tank seviyesinde artış yok.',
        observedData: {
          standpipePressure: 2100,
          pitVolume: 350,
          flowOut: 60,
          rop: 18,
          hookLoad: 160,
          mudWeight: 8.8,
          statusAlert: 'ELEKLERDE KÖPÜKLENME: Yüzeyde Çamur Yoğunluğu Düştü, Manometreler 0 psi.'
        },
        choices: [
          {
            id: 'cgc-degasser',
            text: 'Durumun gerçek bir kick değil, kırılan kayaç gözeneklerindeki gazın yüzeye yakın genleşmesi (Drilled Gas) olduğunu teşhis et; Vakum Gaz Ayırıcıyı (Degasser) devreye al ve çamuru temizleyerek yoğunluğu izle.',
            outcomeType: 'safe',
            consequence: 'Mükemmel teknik teşhis. Kuyu basınçları sıfır ve pit gain olmadığı için kuyuya akış girmediği, sadece delinen kayacın gazının yüzeyde genleşerek yoğunluğu yapay düşürdüğü anlaşıldı. Degasser gazı tahliye etti.',
            explanation: 'Drilled Gas yüzeye yaklaştıkça düşük hidrostatik basınç altında hacimce genleşir ve yüzey çamur ağırlığını düşürür (Gas-cut mud). Ancak kuyu dibindeki hidrostatik basınç kaybı genellikle 50-100 psi\'dan azdır. Vakumlu degasser çalıştırılarak gaz bertaraf edilir.',
            scoreChange: 40
          },
          {
            id: 'cgc-panic-barite',
            text: 'Panik yapıp çamur tankına derhal tonlarca barit dökerek yoğunluğu 14 ppg seviyesine fırlat.',
            outcomeType: 'warning',
            consequence: 'Kuyu dibi aşırı yüklendi (Overbalance +1200 psi oldu), delme hızı yarı yarıya düştü ve formasyonda mikro çatlaklar oluştu.',
            explanation: 'Gas cut mud durumunda kuyu dibi gerçekte kick almamıştır. Gereksiz barit eklemek çamur maliyetini katlar ve kuyuya zarar verir.',
            scoreChange: -10
          }
        ]
      }
    }
  }
];
