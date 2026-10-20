import { EquipmentItem } from '../types';

export const EQUIPMENT_LIST: EquipmentItem[] = [
  {
    id: 'derrick',
    name: {
      tr: 'Sondaj Kulesi (Derrick/Mast)',
      en: 'Derrick (Mast)'
    },
    turkishName: 'Sondaj Kulesi (Derrick/Mast)',
    category: 'hoisting',
    position: [0, 12, 0],
    cameraTarget: [0, 12, 0],
    cameraPosition: [0, 16, 28],
    description: {
      tr: 'Kaldırma sistemini, gezer makarayı ve sondaj dizisini taşıyan kule platformu üzerindeki ana çelik kafes yapı.',
      en: 'The primary load-bearing structural framework supporting the hoisting system, travelling equipment, and drill string handling.'
    },
    technicalSpecs: {
      tr: {
        'Nominal Kanca Kapasitesi': '1,000,000 lbs (450 ton)',
        'Net Kule Yüksekliği': '147 ft (44.8 m)',
        'Taban Alanı': '30 ft x 30 ft (9.1 x 9.1 m)',
        'Rüzgâr Yükü Sınırı': '100 knot (boru dizili halde)',
        'Standart': 'API Spec 4F (4. Baskı)'
      },
      en: {
        'Gross Nominal Capacity': '1,000,000 lbs (450 tonnes)',
        'Clear Height': '147 ft (44.8 m)',
        'Base Spread': '30 ft x 30 ft',
        'Wind Load Capacity': '100 knots (full pipe set-back)',
        'API Specification': 'API Spec 4F (4th Edition)'
      }
    },
    workingPrinciple: {
      tr: 'Sabit makara (Crown Block) üzerinden gelen eksenel basınç yüklerini 4 ana kule bacağına dağıtarak kule alt yapısına (substructure) iletir.',
      en: 'Truss structural design distributing compressive axial loads from the crown block through four main vertical leg columns directly into the rig substructure.'
    },
    drillingRole: {
      tr: 'Boru manevralarında (tripping) 3\'lü boru standlarını (yaklaşık 90 ft) tek seferde kaldırıp boru sehpasına dizebilecek dikey çalışma payı sağlar.',
      en: 'Provides vertical clearance to hoist and rack 90-ft pipe stands (triples) during trips in and out of the borehole.'
    },
    safetyHazards: {
      tr: [
        'Kule yüksekliğinden platform zeminine düşen malzeme riski (Dropped Objects)',
        'Şiddetli fırtınada kule bacaklarında burkulma veya aşırı yüklenme',
        'Kafes kiriş kaynak noktalarında paslanma ve yorulma çatlakları'
      ],
      en: [
        'Dropped objects from elevated heights onto the rig floor',
        'High wind loads causing mast deflection or structural stress',
        'Corrosion and fatigue in load-carrying lattice joints'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Kule bacak pimlerinin, emniyet kilitlerinin ve tırmanma merdiveni sepetinin günlük kontrolü',
        'API 4F Kategori III ve IV tahribatsız manyetik parçacık muayeneleri',
        'Kule tepesi çarpma tamponu ve emniyet teli bağlantı kontrolü'
      ],
      en: [
        'Daily visual inspection of pins, safety locks, and derrick ladder cages',
        'API 4F Category III & IV non-destructive magnetic particle structural inspections',
        'Crown bumper block alignment and crown safety line integrity'
      ]
    },
    systemConnection: {
      tr: 'Alt yapıya (Substructure) ankrajlıdır; tepede Sabit Makarayı, halatla Gezer Makarayı ve 85 ft kotunda maymunluğunu (Fingerboard) taşır.',
      en: 'Anchored to the Substructure; supports the Crown Block at the water table, Travelling Block via wireline, and Fingerboard at 85 ft.'
    }
  },
  {
    id: 'crown-block',
    name: {
      tr: 'Sabit Makara (Crown Block)',
      en: 'Crown Block'
    },
    turkishName: 'Sabit Makara (Crown Block)',
    category: 'hoisting',
    position: [0, 26.5, 0],
    cameraTarget: [0, 26.5, 0],
    cameraPosition: [0, 28, 8],
    description: {
      tr: 'Kulenin en tepe noktasında yer alan ve sondaj halatının makaralar arasından geçerek mekanik kuvvet kazancı sağladığı sabit makara takımı.',
      en: 'Fixed assembly of sheaves mounted at the apex of the derrick over which the drilling wireline is reeved to create mechanical advantage.'
    },
    technicalSpecs: {
      tr: {
        'Makara Sayısı': '7 makara (hızlı hat ve ölü hat dahil)',
        'Makara Çapı': '60 inç (1524 mm)',
        'Halat Çapı': '1-3/8 inç (35 mm) EIPS',
        'Maks. Statik Kanca Yükü': '1,000,000 lbs',
        'Yağlama': 'Merkezi otomatik gres manifoldu'
      },
      en: {
        'Number of Sheaves': '7 sheaves (including fastline & deadline)',
        'Sheave Diameter': '60 in (1524 mm)',
        'Wireline Diameter': '1-3/8 in (35 mm) EIPS',
        'Max Static Hook Load': '1,000,000 lbs',
        'Lubrication': 'Centralized automatic grease manifold'
      }
    },
    workingPrinciple: {
      tr: 'Palanga sisteminin sabit parçasını oluşturur. Çekme kuvvetini donatılan hat sayısı (ör. 10 veya 12 hat) oranında katlar.',
      en: 'Acts as the fixed pulley cluster in a compound block-and-tackle system, multiplying hoisting force by the number of active wireline lines reeved (typically 10 or 12 lines).'
    },
    drillingRole: {
      tr: 'Drawworks vinç kuvvetini gezer makaraya iletir; yüzlerce tonluk sondaj dizisinin vinç tamburu tarafından güvenle kaldırılmasını sağlar.',
      en: 'Transfers drawworks pull to the travelling block, allowing hundreds of tons of drill string or casing to be lifted with manageable drawworks line tension.'
    },
    safetyHazards: {
      tr: [
        'Halat hareketi sırasında şiddetli ezilme ve kapılma riski',
        '140+ ft yükseklikte açıkta çalışma ve düşme tehlikesi',
        'Makara yiv aşınması nedeniyle halatın düzleşmesi ve lif kopması'
      ],
      en: [
        'Severe pinch point hazards during wireline travel',
        'Extreme elevation (140+ ft) working-at-height exposure',
        'Catastrophic sheave groove wear leading to wireline premature fatigue'
      ]
    },
    maintenanceChecks: {
      tr: [
        'API RP 9B makara yiv kumpası ile aşınma ölçümü',
        'Rulman sıcaklık takibi ve haftalık gresleme',
        'Kule tepesi aşırı yükselme limit anahtarının (Crown-O-Matic) testi'
      ],
      en: [
        'API RP 9B sheave groove radius caliper measurement (prevent line flattening)',
        'Bearing temperature monitoring and weekly grease flushing',
        'Crown safety saver limit switch testing before tripping pipe'
      ]
    },
    systemConnection: {
      tr: 'Drawworks vinç tamburundan çıkan hızlı hat (Fastline) buraya gelir; donatılan hatlar Gezer Makaraya iner ve ölü hat (Deadline) ankrajına bağlanır.',
      en: 'Receives the Fastline from the Drawworks drum; reeves down to the Travelling Block, with the Deadline anchored at rig substructure.'
    }
  },
  {
    id: 'travelling-block',
    name: {
      tr: 'Gezer Makara & Kanca (Travelling Block & Hook)',
      en: 'Travelling Block & Hook'
    },
    turkishName: 'Gezer Makara & Kanca',
    category: 'hoisting',
    position: [0, 18, 0],
    cameraTarget: [0, 18, 0],
    cameraPosition: [0, 19, 7],
    description: {
      tr: 'Kule içinde dikey olarak aşağı-yukarı hareket eden, Top Drive veya fırdöndüyü (Swivel) asılı tutan hareketli makara bloğu.',
      en: 'The moving sheave assembly traveling vertically within the derrick mast, suspending the Top Drive and entire drill string.'
    },
    technicalSpecs: {
      tr: {
        'Makara Sayısı': '6 veya 7 oluklu makara',
        'Nominal Yük Kapasitesi': '500 - 750 ton',
        'Blok Ağırlığı': '18,000 - 24,000 lbs (hızlı serbest iniş için)',
        'Kılavuz Ray Açıklığı': 'Kule tork kılavuz raylarına entegre'
      },
      en: {
        'Number of Sheaves': '6 or 7 grooved sheaves',
        'Rated Load Capacity': '500 - 750 tons',
        'Block Net Weight': '18,000 - 24,000 lbs (ballasted for fast free fall)',
        'Track Clearance': 'Mounted on derrick guide dolly rails'
      }
    },
    workingPrinciple: {
      tr: 'Sabit makara ile gezer makara arasındaki halat hatları vinç tamburu sarıldıkça kısalır ve tüm diziyi yukarı çeker.',
      en: 'Reeved via wireline lines with the Crown Block; spooling the drawworks drum shortens loop distance and lifts the load.'
    },
    drillingRole: {
      tr: 'Tüm delgi operasyonunda dizinin ağırlığını kancada taşır; kuyuya boru indirip çıkarma hızını belirler.',
      en: 'Supports hook load during drilling, reaming, tripping, and running heavy casing strings.'
    },
    safetyHazards: {
      tr: [
        'Kule tepesine çarpma (Crown collision) veya tabana hızla inme tehlikesi',
        'Ağır çelik gövdenin kule içindeki savrulma ve çarpma riski'
      ],
      en: [
        'Crown block collision or inadvertent rig floor impact',
        'Unrestrained swinging or guide dolly derailment under dynamic hoisting'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Makara rulman boşluklarının ve kılavuz pabuç aşınmalarının günlük kontrolü',
        'Kanca emniyet mandalı ve hidrolik yaylı sönümleyici testi'
      ],
      en: [
        'Daily check of guide dolly wear pads and sheave bearing clearances',
        'Inspection of hook safety latch and internal hydraulic snubber mechanism'
      ]
    },
    systemConnection: {
      tr: 'Sondaj halatı ile Sabit Makaraya asılıdır; alt flanşı doğrudan Top Drive motor ünitesine cıvatalıdır.',
      en: 'Suspended by wireline from the Crown Block; bolted directly to the Top Drive main support frame.'
    }
  },
  {
    id: 'top-drive',
    name: {
      tr: 'Top Drive Döndürme Ünitesi',
      en: 'Top Drive System'
    },
    turkishName: 'Top Drive Döndürme Ünitesi',
    category: 'rotating',
    position: [0, 14, 0],
    cameraTarget: [0, 14, 0],
    cameraPosition: [0, 14.5, 6],
    description: {
      tr: 'Sondaj dizisini kule platformunun en üstünden yüksek tork ve devirle döndüren, aynı anda çamuru boru içine basan hidrolik/elektrikli tahrik motoru.',
      en: 'High-torque AC/hydraulic drive unit suspended in the derrick, rotating the drill string while simultaneously injecting drilling mud.'
    },
    technicalSpecs: {
      tr: {
        'Motor Gücü': '1150 HP AC değişken frekanslı (VFD)',
        'Maksimum Tork': '60,000 - 75,000 ft-lbs',
        'Dönüş Hızı': '0 - 240 RPM (çift kademeli şanzıman)',
        'Çalışma Basıncı': '7,500 psi yüksek basınç fırdöndüsü'
      },
      en: {
        'Continuous Power': '1150 HP AC variable-frequency motor',
        'Continuous Torque': '60,000 - 75,000 ft-lbs',
        'Operating Speed': '0 - 240 RPM (dual-speed gearbox)',
        'Circulation Pressure': '7,500 psi rated washpipe assembly'
      }
    },
    workingPrinciple: {
      tr: 'AC elektrik motoru redüktör üzerinden ana mili (quill) döndürür. Kule boyunca uzanan tork rayları gövdenin dönmesini engeller.',
      en: 'AC electric motor drives the main quill shaft through heavy helical gears, reacting counter-torque through derrick vertical guide tracks.'
    },
    drillingRole: {
      tr: 'Geleneksel Kelly ve döner masa sisteminin yerini alarak 90 ft\'lik standlarla kesintisiz delme sağlar; sıkışma riskini büyük ölçüde azaltır.',
      en: 'Replaces conventional rotary tables by rotating 90-ft stands directly, reducing connection times and sticking risks.'
    },
    safetyHazards: {
      tr: [
        'Dönme anında kule tabanında dönen parçalara temas riski',
        '7,500 psi esnek hortum patlaması veya kelepçe kopması',
        'Yüksek tork birikmesi sonucu geri tepme (back-torque)'
      ],
      en: [
        'High rotational energy pinch hazards on the rig floor',
        '7,500 psi flexible rotary hose failure or safety clamp separation',
        'Sudden reactive torque release if the drill bit stalls'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Yıkama borusu (washpipe) ve salmastra sızıntı kontrolü',
        'Şanzıman yağ seviyesi ve manyetik talaş tapası analizi',
        'Tork rayı pabuçları ve boru tutucu hidrolik çenelerin kontrolü'
      ],
      en: [
        'Daily washpipe packing leakage check and lubrication',
        'Gearbox lube oil condition and magnetic chip detector inspection',
        'Torque track dolly guide shoes and pipe grabber hydraulic checks'
      ]
    },
    systemConnection: {
      tr: 'Standpipe manifolduna rotary hortumuyla bağlanır; ana mili matkap dizisinin en üst borusuna vidalanır.',
      en: 'Connected to the Standpipe via the rotary Kelly hose; quill thread screws into the top drill pipe stand.'
    }
  },
  {
    id: 'drawworks',
    name: {
      tr: 'Kule Vinci (Drawworks)',
      en: 'Drawworks'
    },
    turkishName: 'Kule Vinci (Drawworks)',
    category: 'hoisting',
    position: [0, 3.8, -4.5],
    cameraTarget: [0, 3.8, -4.5],
    cameraPosition: [0, 6, 4],
    description: {
      tr: 'Sondaj halatını çelik tamburuna sarıp boşaltarak gezer makarayı ve kancayı kontrol eden kule tabanındaki ana kaldırma mekanizması.',
      en: 'The heavy winch mechanism housed on the rig floor that spools and reels the drilling wireline to raise and lower the travelling equipment.'
    },
    technicalSpecs: {
      tr: {
        'Giriş Gücü': '2000 - 3000 HP (AC elektrik motorlu)',
        'Tambur Çapı': '30 inç x 56 inç oluklu Lebus tamburu',
        'Fren Sistemi': 'Dinamik elektrik rejeneratif fren + hidrolik disk fren',
        'Halat Çekme Hızı': 'Maksimum 60 ft/s'
      },
      en: {
        'Input Power': '2000 - 3000 HP (AC drive motors)',
        'Drum Dimensions': '30 in dia x 56 in width grooved Lebus drum',
        'Braking System': 'Regenerative dynamic electric braking + hydraulic disc brakes',
        'Line Speed': 'Up to 60 ft/s fastline velocity'
      }
    },
    workingPrinciple: {
      tr: 'Büyük güçlü AC motorlar ağır dişli kutusunu çevirir; çelik tambura sarılan halat palanga sistemi sayesinde tonlarca yükü kaldırır.',
      en: 'High-torque electric motors rotate the heavy grooved drum, winding or spooling the fastline under precise PLC control.'
    },
    drillingRole: {
      tr: 'Delgi sırasında matkap üzerindeki ağırlığı (WOB) milimetrik olarak besler; manevralarda diziyi hızla kaldırıp indirir.',
      en: 'Feeds the drill string into the well with millimeter precision (controlling Weight on Bit) and hoists stands rapidly.'
    },
    safetyHazards: {
      tr: [
        'Tambur bölgesinde yüksek hızda dönen çelik halat ve makaralar',
        'Fren arızası durumunda dizinin kontrolsüz kuyuya düşmesi riski'
      ],
      en: [
        'Extreme pinch points around high-speed spooling wireline',
        'Catastrophic brake slip causing dropped string into the wellbore'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Disk fren balataları kalınlığı ve hidrolik basınç seviyesi',
        'API RP 9B uyarınca ton-mil halat kesme ve kaydırma programı takibi',
        'Acil durdurma ve tambur aşırı hız kilit mekanizması testi'
      ],
      en: [
        'Hydraulic caliper brake pad thickness and hydraulic pressure tests',
        'API RP 9B ton-mile tracking and line slip-and-cut schedules',
        'Emergency stop and drum over-speed interlock function tests'
      ]
    },
    systemConnection: {
      tr: 'Doğrudan kule elektrik santralinden beslenir; hızlı hatla kule tepesindeki Sabit Makaraya bağlıdır.',
      en: 'Powered by the rig SCR/VFD motor control center; routes the fastline directly to the crown block.'
    }
  },
  {
    id: 'drill-string',
    name: {
      tr: 'Sondaj Dizisi & Döner Masa (Drill String & Rotary)',
      en: 'Drill String & Rotary Table'
    },
    turkishName: 'Sondaj Dizisi & Döner Masa',
    category: 'rotating',
    position: [0, 3.5, 0],
    cameraTarget: [0, 3.5, 0],
    cameraPosition: [0, 5, 5],
    description: {
      tr: 'Kule platformu merkezindeki kuyu ağzından yerin binlerce metre altına inen sondaj boruları, ağırlık boruları ve matkaptan oluşan çelik kolon.',
      en: 'The column of drill pipe, heavyweight pipe, drill collars, and bit extending from the rotary table down into the reservoir.'
    },
    technicalSpecs: {
      tr: {
        'Sondaj Borusu': '5 inç S-135, NC50 bağlantılı',
        'Ağırlık Borusu (DC)': '6-1/2 inç ile 8 inç kalın etli çelik borular',
        'Döner Masa Açıklığı': '37-1/2 inç (952.5 mm)',
        'Kuyu Dibi Takımı (BHA)': 'Matkap, motor, MWD/LWD telemetri, stabilizatör'
      },
      en: {
        'Drill Pipe': '5-in OD, S-135 grade, NC50 connections',
        'Drill Collars': '6-1/2 in to 8 in OD thick-walled steel',
        'Rotary Opening': '37-1/2 in (952.5 mm) table master bushing',
        'BHA Components': 'Bit, mud motor, MWD/LWD telemetry, stabilizers'
      }
    },
    workingPrinciple: {
      tr: 'Yüzeydeki torku kuyu dibindeki matkaba iletir; boru içi çamur akışı sağlar ve kuyu tabanındaki ağırlığı kayaç kırmaya yönlendirir.',
      en: 'Transmits rotation, weight, and high-pressure drilling fluid to the drill bit, creating a continuous conduit for cuttings removal.'
    },
    drillingRole: {
      tr: 'Kayaçları delerek kuyu geometrisini oluşturan ve kuyu dibi basınç-sıcaklık verilerini yüzeye aktaran ana mekanik köprüdür.',
      en: 'Mechanically crushes rock formations and provides a hydraulic channel to circulate cuttings back up the annulus.'
    },
    safetyHazards: {
      tr: [
        'Döner masa üzerinde kayma, takılma ve sıkışma (Red Zone tehlikesi)',
        'Diferansiyel boru sıkışması ve kuyu içi kopma (twist-off)'
      ],
      en: [
        'Severe crush/entanglement hazards in the rotary red zone',
        'Differential pipe sticking and subsurface string twist-off'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Boru dişlerinin (tool joints) kumpas ve optik kontrolü',
        'Döner masa kilidinin ve slip pabuçlarının aşınma muayenesi'
      ],
      en: [
        'Drill pipe tool joint thread cleaning, doping, and shoulder inspection',
        'Rotary slip segment insert teeth wear measurement'
      ]
    },
    systemConnection: {
      tr: 'Tepede Top Drive\'a vidalanır; kule tabanından geçerek BOP ve kuyu muhafaza borusu içine girer.',
      en: 'Screwed into the Top Drive quill; passes through the rotary slips, BOP stack, and casing string.'
    }
  },
  {
    id: 'bop-stack',
    name: {
      tr: 'BOP Kuyu Kontrol Ünitesi (Blowout Preventer)',
      en: 'BOP Stack'
    },
    turkishName: 'BOP Kuyu Kontrol Ünitesi',
    category: 'wellcontrol',
    position: [0, -0.6, 0],
    cameraTarget: [0, -0.6, 0],
    cameraPosition: [0, 0.5, 6],
    description: {
      tr: 'Formasyon akışkanlarının kontrolsüzce yüzeye fışkırmasını önlemek için kuyu başı üzerine monte edilmiş yüksek basınçlı hidrolik vanalar grubu.',
      en: 'Heavy multi-ram safety valve assembly bolted directly atop the wellhead casing spool to seal high-pressure well kicks.'
    },
    technicalSpecs: {
      tr: {
        'Basınç Sınıfı': '10,000 psi (700 bar) veya 15,000 psi',
        'Nominal Geçiş Çapı': '13-5/8 inç (346 mm)',
        'Bileşenler': '1 Halka (Annular) BOP, 2 Boru Rami, 1 Kör-Makas (Blind Shear) Rami',
        'Standart': 'API Spec 16A ve API Standard 53'
      },
      en: {
        'Working Pressure': '10,000 psi (700 bar) or 15,000 psi',
        'Bore Diameter': '13-5/8 in (346 mm)',
        'Stack Configuration': '1 Annular BOP, 2 Pipe Rams, 1 Blind Shear Ram',
        'API Standards': 'API Spec 16A & API Standard 53'
      }
    },
    workingPrinciple: {
      tr: 'Hidrolik akümülatörden gelen basınçlı yağ ile ram bloklarını veya halka elastomerini boru etrafında sıkarak kuyu ağzını saniyeler içinde mühürler.',
      en: 'Hydraulic accumulator fluid drives opposed steel ram blocks or an annular elastomeric doughnut to seal the wellbore.'
    },
    drillingRole: {
      tr: 'Kuyu kontrolünün (Well Control) ikincil bariyeridir. Kick geldiğinde kuyuyu kapatarak kontrollü sirkülasyona olanak tanır.',
      en: 'Acts as the secondary well control barrier, containing formation influxes under pressure until kill mud can be circulated.'
    },
    safetyHazards: {
      tr: [
        'Kuyu başı hücresinde (cellar) H2S ve zehirli gaz birikmesi',
        'Yüksek basınç altında flanş contası veya cıvata patlaması riski'
      ],
      en: [
        'Toxic H2S gas accumulation in the low-lying cellar pit',
        'Catastrophic high-pressure flange seal blowout under shut-in'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Her 14 veya 21 günde bir API 53 uyarınca yüksek/düşük basınç hidrolik testi',
        'Akümülatör (Koomey) şarj süresi ve kapanma sürelerinin kronometreyle testi'
      ],
      en: [
        'Bi-weekly high/low pressure test per API Standard 53',
        'Koomey accumulator bottle pre-charge and closure time verification'
      ]
    },
    systemConnection: {
      tr: 'Kuyu başı (Wellhead) flanşına cıvatalıdır; yan çıkışlarından Choke ve Kill manifoldu hatlarına bağlanır.',
      en: 'Flanged to the wellhead casing spool; connected to the Choke Manifold and Kill Line valves.'
    }
  },
  {
    id: 'mud-pumps',
    name: {
      tr: 'Tripleks Çamur Pompaları',
      en: 'Triplex Mud Pumps'
    },
    turkishName: 'Tripleks Çamur Pompaları',
    category: 'circulating',
    position: [-16, -1.2, 2],
    cameraTarget: [-16, -0.8, 2],
    cameraPosition: [-16, 1.5, 9],
    description: {
      tr: 'Sondaj çamurunu tanklardan emip binlerce psi basınçla sondaj dizisinin içine basan yüksek debili üç pistonlu pompa ünitesi.',
      en: 'High-pressure positive-displacement pumps that intake drilling mud from suction tanks and force it down the drill string.'
    },
    technicalSpecs: {
      tr: {
        'Pompa Sayısı & Gücü': '2 veya 3 adet, her biri 1600 HP elektrik motorlu',
        'Maksimum Çalışma Basıncı': '5,000 - 7,500 psi',
        'Azami Debi': 'Pompa başına 600 - 800 GPM (liner çapına bağlı)',
        'Piston Tipi': 'Tek etkili 3 seramik/krom gömlekli piston'
      },
      en: {
        'Number & Power': '2 or 3 pumps, each powered by a 1600 HP AC motor',
        'Working Pressure': '5,000 to 7,500 psi continuous discharge',
        'Max Flow Rate': '600 - 800 GPM per pump depending on liner size',
        'Piston Type': 'Single-acting triplex with ceramic liners'
      }
    },
    workingPrinciple: {
      tr: 'Krank mili hareketini biyel kolları üzerinden 3 silindire aktarır. Emme ve basma sübapları sayesinde kesintisiz yüksek basınçlı akış üretir.',
      en: 'A heavy crankshaft drives three reciprocating pistons in separate fluid chambers, generating continuous high-pressure flow.'
    },
    drillingRole: {
      tr: 'Çamur dolaşımının kalbidir. Matkap ucundaki püskürtme memelerinden (nozzles) çamuru fışkırtarak kayaçları temizler ve kırıntıları yüzeye taşır.',
      en: 'The circulatory heart of the rig, powering the mud motor, cleaning the bit cutters, and lifting rock cuttings up the annulus.'
    },
    safetyHazards: {
      tr: [
        '5,000+ psi yüksek basınç hattı patlaması ve hidrolik delinme riski',
        'Titreşim ve yüksek ses seviyesi (işitme koruyucu zorunluluğu)'
      ],
      en: [
        '5,000+ psi high-pressure line discharge rupture hazard',
        'Extreme acoustic noise emissions requiring ear defense'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Basma hattı sönümleyici (pulsation dampener) azot basıncı kontrolü',
        'Piston gömlek ve sübap aşınma muayenesi',
        'Basınç tahliye emniyet valfi (Pop-off valve) pimi kontrolü'
      ],
      en: [
        'Discharge pulsation dampener nitrogen pre-charge check',
        'Piston liner and valve seat wash inspection',
        'Pop-off safety shear pin pressure rating verification'
      ]
    },
    systemConnection: {
      tr: 'Emme hattı çamur tanklarına, basma hattı ise kule ayağındaki Standpipe manifoldu ve Top Drive hortumuna bağlıdır.',
      en: 'Suction manifold connects to mud tanks; discharge manifold connects to the Standpipe and rotary hose.'
    }
  },
  {
    id: 'mud-tanks',
    name: {
      tr: 'Çamur Tankları & Karıştırıcılar (Mud Pits)',
      en: 'Mud Tanks & Agitators'
    },
    turkishName: 'Çamur Tankları & Karıştırıcılar',
    category: 'circulating',
    position: [-16, -1.0, 11],
    cameraTarget: [-16, 0.2, 11],
    cameraPosition: [-16, 2.5, 18],
    description: {
      tr: 'Sondaj çamurunun depolandığı, kimyasal katkılar ve barit ile yoğunluğunun ayarlandığı ve kuyu hacminin hassas izlendiği çelik tanklar serisi.',
      en: 'Steel tank compartments where drilling mud is stored, conditioned with chemicals, and continuously monitored for pit volume gains or losses.'
    },
    technicalSpecs: {
      tr: {
        'Toplam Tank Hacmi': '1,200 - 2,000 bbl (190 - 320 m³)',
        'Bölmeler': 'Çalkantı (Shaker), Yağ Alma (Degasser), Emme (Suction), Rezerv ve Kimyasal tankları',
        'Karıştırıcılar': 'Her tankta 7.5 - 15 HP çamur karıştırıcı (agitator)'
      },
      en: {
        'Active Capacity': '1,200 - 2,000 bbl (190 - 320 m³)',
        'Compartments': 'Shaker pit, settling pit, suction pit, reserve and pill tanks',
        'Agitation': '7.5 to 15 HP mechanical turbine paddle agitators'
      }
    },
    workingPrinciple: {
      tr: 'Çamur yerçekimi ve pompalarla bölmeler arasında dolaşır. Mekanik karıştırıcılar barit gibi ağırlaştırıcıların dibe çökmesini önler.',
      en: 'Mud flows sequentially through baffled compartments while turbine impellers keep weighting agents in suspension.'
    },
    drillingRole: {
      tr: 'Kuyu kontrolünün en kritik göstergesidir. Tank seviyesindeki ani artış (pit gain) KICK, ani düşüş (pit loss) ise KAÇAK habercisidir.',
      en: 'Pit volume totalizer (PVT) sensors detect well kicks (pit gain) or formation losses (pit loss) immediately.'
    },
    safetyHazards: {
      tr: [
        'Açık tanklara düşme ve boğulma tehlikesi',
        'Kuyudan gelen zehirli gazların (H2S / hidrokarbon) tank üstünde birikmesi'
      ],
      en: [
        'Falling into open agitated fluid tanks (drowning hazard)',
        'Entrained hazardous gas venting over tank surface'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Ultrasonik pit seviye sensörlerinin kalibrasyonu',
        'Karıştırıcı şaft rulmanları ve dişli kutusu yağ seviyeleri'
      ],
      en: [
        'Ultrasonic pit volume sensor calibration checks',
        'Agitator shaft bearing and motor drive belt inspections'
      ]
    },
    systemConnection: {
      tr: 'Eleklerin altındaki çamur teknesinden sıvıyı alır; emme tankından çamur pompalarına verir.',
      en: 'Receives screened mud from shale shakers; discharges to mud pump suction lines.'
    }
  },
  {
    id: 'shale-shakers',
    name: {
      tr: 'Titreşimli Elekler (Shale Shakers)',
      en: 'Shale Shakers'
    },
    turkishName: 'Titreşimli Elekler (Shale Shakers)',
    category: 'circulating',
    position: [-16, 0.4, 6],
    cameraTarget: [-16, 0.4, 6],
    cameraPosition: [-16, 1.8, 11],
    description: {
      tr: 'Kuyudan dönen çamurdaki kayaç kırıntılarını (cuttings) yüksek frekanslı titreşimli elek telleriyle sıvıdan ayıran birinci kademe katı madde kontrol ünitesi.',
      en: 'The primary solids control equipment that separates drilled formation rock cuttings from the returning drilling fluid using vibrating mesh screens.'
    },
    technicalSpecs: {
      tr: {
        'Elek Sayısı': '3 veya 4 adet yüksek G-kuvvetli elek',
        'G-Kuvveti': '6.5G ile 8.0G lineer eliptik hareket',
        'Elek Tel Aralığı': 'API 80 ile API 325 arası (75 - 180 mikron)',
        'İşleme Kapasitesi': 'Elek başına 500 GPM debi'
      },
      en: {
        'Number of Units': '3 or 4 high-G linear motion shakers',
        'G-Force Rating': '6.5G to 8.0G linear motion vibration',
        'Screen Mesh Sizes': 'API 80 to API 325 (75 - 180 microns)',
        'Flow Capacity': 'Up to 500 GPM per shaker unit'
      }
    },
    workingPrinciple: {
      tr: 'Eksantrik elektrik motorları elek tepsisine doğrusal titreşim uygular. Sıvı yerçekimiyle gözeneklerden tanka akar, katı kırıntılar atık oluğuna fırlatılır.',
      en: 'Dual vibrator motors generate elliptical linear motion, pitching rock solids forward into the waste chute while fluid drops into the tank.'
    },
    drillingRole: {
      tr: 'Aşındırıcı kuyu kırıntılarını ayırarak pompa ömrünü uzatır ve çamur yoğunluğunun plansız artmasını engeller.',
      en: 'Prevents abrasive sand/cuttings from circulating back into pumps and drill string, preserving drilling mud chemistry.'
    },
    safetyHazards: {
      tr: [
        'Kuyudan çıkan çamurdan ilk gaz çıkış noktası (H2S ve parlayıcı gaz tehlikesi)',
        'Sürekli yüksek titreşim ve gürültü'
      ],
      en: [
        'Primary source of liberated toxic H2S or combustible hydrocarbon vapors',
        'High vibration pinch points and eye splatter hazards'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Elek teli yırtılma ve delinme kontrolleri (saatlik gözlem)',
        'Titreşim takozları ve motor montaj cıvatalarının sıkılığı'
      ],
      en: [
        'Hourly screen cloth puncture and blinding inspections',
        'Vibration isolation spring rubber and motor mounting bolt torque checks'
      ]
    },
    systemConnection: {
      tr: 'Kuyu ağzından gelen akış hattına (flowline) bağlıdır; altından çamur tankına dökülür.',
      en: 'Fed by the bell nipple flowline; underflow drains into the shaker sand trap compartment.'
    }
  },
  {
    id: 'generators',
    name: {
      tr: 'Dizel Jeneratörler & Güç Santrali',
      en: 'Diesel Generators & Power Plant'
    },
    turkishName: 'Dizel Jeneratörler & Güç Santrali',
    category: 'power',
    position: [17, -0.6, 2],
    cameraTarget: [17, -0.2, 2],
    cameraPosition: [17, 1.8, 9],
    description: {
      tr: 'Kulenin vincini, çamur pompalarını, aydınlatmasını ve tüm operasyonel sistemlerini besleyen yüksek voltajlı bağımsız dizel-elektrik güç istasyonu.',
      en: 'Heavy-duty industrial diesel generator sets providing independent electric power for the entire drilling rig.'
    },
    technicalSpecs: {
      tr: {
        'Jeneratör Sayısı': '3 veya 4 adet Caterpillar 3512 / EMD dizel motor',
        'Toplam Elektrik Gücü': '4,500 - 6,000 kVA (600V AC, 60 Hz)',
        'SCR / VFD Sistemi': '600V AC\'yi kontrol edilebilir DC/AC güce çeviren VFD kabinleri'
      },
      en: {
        'Engine Configuration': '3 or 4 Caterpillar 3512B / EMD diesel gensets',
        'Total Electrical Output': '4,500 - 6,000 kVA at 600V AC, 60 Hz',
        'Power Conditioning': 'Modern VFD (Variable Frequency Drive) container house'
      }
    },
    workingPrinciple: {
      tr: 'Dizel motorlar senkron alternatörleri çevirerek 600V elektrik üretir. VFD kabini bu gücü hassas hız ve tork kontrolü için kule motorlarına iletir.',
      en: 'Turbocharged diesel engines drive alternators producing 600V AC electricity, regulated by VFD drives.'
    },
    drillingRole: {
      tr: 'Şebekeden bağımsız ıssız sahalarda kulenin 7/24 kesintisiz çalışmasını sağlayan enerji kaynağıdır.',
      en: 'Supplies all electrical power for hoisting, circulation, rotation, and living quarters in remote onshore locations.'
    },
    safetyHazards: {
      tr: [
        'Yüksek voltaj (600V) elektrik çarpması riski',
        'Dizel yakıt hatlarında parlama ve yangın riski',
        'Egzoz manifoldlarında yüksek ısı ve yanma tehlikesi'
      ],
      en: [
        'High voltage (600V) arc flash and electrocution hazards',
        'Pressurized diesel fuel line leaks and fire risk',
        'Extreme thermal surfaces on turbochargers and exhaust manifolds'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Motor yağı, soğutma suyu ve yakıt filtrelerinin periyodik değişimi',
        'Jeneratör acil yakıt kesme ve otomatik yangın söndürme testi'
      ],
      en: [
        'Engine oil levels, coolant jacket temperatures, and fuel water traps',
        'Emergency engine air shut-off and ESD trip testing'
      ]
    },
    systemConnection: {
      tr: 'Kablolarla VFD/SCR güç kontrol konteynerine, oradan kule motorlarına ve aydınlatma panolarına dağılır.',
      en: 'Busbars feed into the VFD power house; heavy armored cables route power across the rig site.'
    }
  },
  {
    id: 'mud-logging',
    name: {
      tr: 'Mud Logging Jeoloji Laboratuvarı',
      en: 'Mud Logging Geology Cabin'
    },
    turkishName: 'Mud Logging Jeoloji Laboratuvarı',
    category: 'monitoring',
    position: [12, -0.6, 12],
    cameraTarget: [12, -0.2, 12],
    cameraPosition: [12, 1.5, 17],
    description: {
      tr: 'Kuyudan gelen kırıntı ve gaz numunelerini mikroskop ve gaz kromatografisiyle analiz eden, litoloji ve hidrokarbon varlığını kaydeden saha laboratuvarı.',
      en: 'Field laboratory monitoring rock cuttings, total gas chromatography, and real-time drilling parameter trends.'
    },
    technicalSpecs: {
      tr: {
        'Gaz Analiz Cihazı': 'FID alev iyonlaşma dedektörü & gaz kromatografı (C1 - C5 gazları)',
        'Litoloji': 'Binoküler polarize mikroskop, florasan ışık kabini ve kalsimetre',
        'Veri Toplama': 'WITS / WITSML gerçek zamanlı telemetri yayını'
      },
      en: {
        'Gas Detection': 'FID total hydrocarbon detector & rapid gas chromatograph (C1-C5)',
        'Geological Analysis': 'Binocular polarized light microscope & calcimeter',
        'Data Protocol': 'Real-time WITSML sensor telemetry integration'
      }
    },
    workingPrinciple: {
      tr: 'Eleklerden alınan çamur numunesindeki gaz vakum pompasıyla çekilerek dedektöre gönderilir; kırıntılar yıkanıp mikroskop altında incelenir.',
      en: 'Degasser traps mud gas at the possum belly; sample gas is piped to FID chromatographs to identify gas shows.'
    },
    drillingRole: {
      tr: 'Hedef rezervuara girildiğini anında teyit eder; gözenek basıncı anomalilerini ve tehlikeli gazları erkenden tespit eder.',
      en: 'Identifies geological formations, tracks target reservoir entry, and provides early warning for kick-prone porous zones.'
    },
    safetyHazards: {
      tr: [
        'Kabin içine numune hattından gelebilecek zehirli gaz riski (sürekli gaz dedektörü zorunlu)',
        'Kimyasal asit reaktifleriyle temas riski'
      ],
      en: [
        'Risk of toxic gas intrusion via sample vacuum lines',
        'Chemical exposure from laboratory acid reagents'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Gaz kromatografının standart gaz karışımıyla günlük kalibrasyonu',
        'Sensör kablo hatlarının ve kuyu başı derinlik enkoderinin kontrolü'
      ],
      en: [
        'Daily calibration of gas detectors using certified calibration gas',
        'Inspection of rig sensor cable harnesses and depth encoder wireline'
      ]
    },
    systemConnection: {
      tr: 'Sensör kablolarıyla eleklere, çamur tanklarına, kuyu başına ve driller kabinine bağlıdır.',
      en: 'Hardwired to sensors across the flowline, shaker pit, drill floor, and client office.'
    }
  },
  {
    id: 'company-man',
    name: {
      tr: 'Saha Mühendisi & Yetkili Ofisi (Company Man Trailer)',
      en: 'Company Man Site Trailer'
    },
    turkishName: 'Saha Mühendisi & Yetkili Ofisi',
    category: 'surface',
    position: [12, -0.6, 20],
    cameraTarget: [12, -0.2, 20],
    cameraPosition: [12, 1.5, 25],
    description: {
      tr: 'Petrol şirketi saha temsilcisinin (Company Man) ve sondaj mühendislerinin operasyonu yönettiği ana yönetim konteyneri.',
      en: 'Administrative office and living quarters for the operator representative overseeing safety, contracts, and drilling programs.'
    },
    technicalSpecs: {
      tr: {
        'Kullanım': 'Mühendislik toplantıları, operasyon planlama ve telemetri izleme',
        'İletişim': 'VSAT uydu interneti, kule telsiz ağı ve SCADA ekranları'
      },
      en: {
        'Capacity': 'Meeting facilities, 24/7 telemetry monitoring console, bunkroom',
        'Communications': 'VSAT satellite data link, private rig radio repeater'
      }
    },
    workingPrinciple: {
      tr: 'Kuyu verileri uydu üzerinden merkez mühendislik ofisine aktarılır; saha onayları ve acil kararlar bu merkezden verilir.',
      en: 'Centralizes communication between rig floor supervisors, service contractors, and headquarters engineers.'
    },
    drillingRole: {
      tr: 'Kuyu bütçesini, mühendislik tasarım değişikliklerini ve kuyu güvenliğini doğrudan denetler.',
      en: 'Ultimate operational authority on the wellsite for safety compliance, cost control, and wellbore placement.'
    },
    safetyHazards: {
      tr: [
        'Acil durumlarda tahliye koordinasyonu sorumluluğu'
      ],
      en: [
        'Critical coordination hub during site emergencies'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Uydu haberleşme hattının ve acil siren butonunun çalışırlık kontrolü'
      ],
      en: [
        'Satellite telemetry backup link check and emergency horn verification'
      ]
    },
    systemConnection: {
      tr: 'Tüm kule telemetri verilerine yerel ağ ve uydu aracılığıyla bağlıdır.',
      en: 'Connected via LAN to real-time rig networks and cloud database.'
    }
  },
  {
    id: 'waste-pit',
    name: {
      tr: 'Atık Havuzu & Rezerv Çukuru (Reserve Pit)',
      en: 'Reserve Waste Pit'
    },
    turkishName: 'Atık Havuzu & Rezerv Çukuru',
    category: 'surface',
    position: [-22, -1.8, 14],
    cameraTarget: [-22, -1.5, 14],
    cameraPosition: [-22, 1.0, 22],
    description: {
      tr: 'Eleklerden ayrılan kayaç kırıntılarının ve atık sıvıların çevreye sızmasını önleyen geomembran astarlı güvenli atık sahası.',
      en: 'Lined containment basin designed to collect drilled cuttings and waste fluids safely, preventing soil contamination.'
    },
    technicalSpecs: {
      tr: {
        'Yalıtım': 'Yüksek yoğunluklu polietilen (HDPE) çift katmanlı geomembran astar',
        'Kapasite': 'Saha şartlarına bağlı olarak 5,000 - 15,000 bbl'
      },
      en: {
        'Liner Material': 'Heavy-duty 60-mil HDPE geomembrane impermeability barrier',
        'Capacity': '5,000 - 15,000 bbl fluid and solid waste storage'
      }
    },
    workingPrinciple: {
      tr: 'Yerçekimiyle ayrışan katılar tabanda çökelir; üstteki su filtre edilerek saha içi temizlikte yeniden değerlendirilebilir.',
      en: 'Gravity settling allows suspended solids to precipitate; supernatant liquid is recovered or treated.'
    },
    drillingRole: {
      tr: 'Çevre yönetmeliklerine uygun olarak atıkların çevreye yayılmasını engeller.',
      en: 'Ensures zero-discharge environmental compliance during drilling operations.'
    },
    safetyHazards: {
      tr: [
        'Çukur kenarlarında kayma ve sıvıya düşme tehlikesi (çevre korkuluk zorunlu)',
        'Astar delinmesi sonucu yeraltı sularına kimyasal sızıntı riski'
      ],
      en: [
        'Steep sloped slippery banks (drowning risk, perimeter fence mandatory)',
        'Environmental contamination if membrane is punctured'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Astar bütünlüğünün ve sızıntı tespit drenaj borularının kontrolü'
      ],
      en: [
        'Weekly integrity inspection of visible geomembrane edges and leak detection sumps'
      ]
    },
    systemConnection: {
      tr: 'Shale shaker atık oluklarından çıkan katılar helezon konveyörle buraya aktarılır.',
      en: 'Fed by cuttings ditch and shaker discharge chute.'
    }
  },
  {
    id: 'choke-manifold',
    name: {
      tr: 'Choke Manifoldu (Kuyu Kontrol Manifoldu)',
      en: 'Choke Manifold'
    },
    turkishName: 'Choke Manifoldu (Kuyu Kontrol Manifoldu)',
    category: 'wellcontrol',
    position: [-6, -1.2, -4],
    cameraTarget: [-6, -0.6, -4],
    cameraPosition: [-6, 1.2, 2],
    description: {
      tr: 'Kuyu kapatıldığında gaz veya petrol akıntısını kontrollü bir karşı basınçla yüzeye tahliye eden ayarlanabilir vanalar grubu.',
      en: 'High-pressure valve arrangement with adjustable chokes used to control wellbore pressure during well-killing operations.'
    },
    technicalSpecs: {
      tr: {
        'Basınç Sınıfı': '10,000 - 15,000 psi',
        'Vana Tipleri': 'Manuel ayarlanabilir choke + hidrolik uzaktan kumandalı choke',
        'Standart': 'API Spec 16C'
      },
      en: {
        'Pressure Rating': '10,000 to 15,000 psi API working pressure',
        'Choke Types': 'One manual adjustable choke + one remote hydraulic choke',
        'Specification': 'API Spec 16C (Choke and Kill Systems)'
      }
    },
    workingPrinciple: {
      tr: 'Choke orifis açıklığı milimetrik olarak kısılarak veya açılarak kuyu dibindeki basınç sabit tutulur.',
      en: 'Adjusting tungsten carbide choke orifices controls surface backpressure precisely, keeping Bottom Hole Pressure constant.'
    },
    drillingRole: {
      tr: 'Well Control operasyonunda (Driller\'s Method veya Wait & Weight) gazın kuleye zarar vermeden tahliye edilmesini sağlar.',
      en: 'Enables safe circulation of a gas kick out of the wellbore through the mud-gas separator without fracturing formations.'
    },
    safetyHazards: {
      tr: [
        'Yüksek hızlı gaz akışı nedeniyle aşırı erozyon ve kavitasyon',
        'Gaz genleşmesi kaynaklı aşırı soğuma ve vana donması (Joule-Thomson etkisi)'
      ],
      en: [
        'Severe abrasive erosion from high-velocity sand/gas mixtures',
        'Cryogenic freezing from gas expansion (Joule-Thomson cooling)'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Choke çekirdeği (tungsten karbür) erozyon kontrolü',
        'Uzaktan kumanda konsolu basınç manometrelerinin kalibrasyonu'
      ],
      en: [
        'Inspect tungsten carbide trim for washouts or wire-drawing erosion',
        'Calibrate digital and analog hydraulic remote position gauges'
      ]
    },
    systemConnection: {
      tr: 'BOP kuyu ağzı choke hattından beslenir; çıkışı Mud-Gas Separator\'e veya meşaleye (flare) gider.',
      en: 'Connected to the BOP stack choke line; discharges into the Poor Boy separator or flare line.'
    }
  },
  {
    id: 'catwalk-piperacks',
    name: {
      tr: 'Catwalk & Boru Sehpaları (Pipe Racks)',
      en: 'Catwalk & Pipe Racks'
    },
    turkishName: 'Catwalk & Boru Sehpaları',
    category: 'surface',
    position: [0, -1.2, 18],
    cameraTarget: [0, -0.6, 18],
    cameraPosition: [6, 1.5, 22],
    description: {
      tr: 'Kuyuya indirilecek sondaj boruları ve muhafaza borularının yatay olarak depolandığı ve kuleye verilmeden önce hazırlandığı çelik platform.',
      en: 'Horizontal steel staging walkway and flanking racks where pipe stands are stored, inspected, and fed to the rig floor.'
    },
    technicalSpecs: {
      tr: {
        'Yapı': 'Hidrolik veya mekanik boru iticili uzun yürüyüş yolu',
        'Kapasite': 'Yüzlerce tonluk boru dizisi depolama sehpası'
      },
      en: {
        'Staging Structure': 'Heavy steel walkway with mechanical pipe skate trolley',
        'Rack Capacity': 'Engineered for hundreds of tons of drill pipe and casing'
      }
    },
    workingPrinciple: {
      tr: 'Borular sehpada dizilir, ölçülür (tally) ve temizlenir. Hidrolik itici veya halat yardımıyla V-door rampasından kule tabanına sürülür.',
      en: 'Pipes are measured, drifted, and thread-doped on racks, then winched or skated up the V-door ramp.'
    },
    drillingRole: {
      tr: 'Boru indirme-kaldırma operasyonunun hızlı ve düzenli yürümesini sağlar.',
      en: 'Essential for orderly tubular staging during high-speed casing and drilling operations.'
    },
    safetyHazards: {
      tr: [
        'Yuvarlanan ağır çelik boruların altında ezilme ve uzuv kaybı riski',
        'Rampa boyunca çekilen borunun savrulması'
      ],
      en: [
        'Crush and amputation hazards from rolling heavy tubulars',
        'Uncontrolled pipe slippage along the sloped ramp'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Boru durdurucu takozların ve kilit pimlerinin sağlamlık kontrolü'
      ],
      en: [
        'Inspect pipe stop pins, safety chocks, and trolley wirelines'
      ]
    },
    systemConnection: {
      tr: 'V-door rampası ile doğrudan Kule Tabanı platformuna bağlanır.',
      en: 'Directly adjoins the elevated rig floor via the inclined V-door ramp.'
    }
  },
  {
    id: 'doghouse',
    name: {
      tr: 'Driller Kontrol Kabini (Doghouse)',
      en: 'Driller Doghouse Cabin'
    },
    turkishName: 'Driller Kontrol Kabini (Doghouse)',
    category: 'monitoring',
    position: [-4.2, 4.2, 1.5],
    cameraTarget: [-4.2, 4.2, 1.5],
    cameraPosition: [-4.2, 5.5, 6],
    description: {
      tr: 'Kule tabanında sondörün (Driller) joystickler, dokunmatik ekranlar ve telemetri göstergeleriyle tüm sondaj operasyonunu yönettiği korunaklı kabin.',
      en: 'Enclosed soundproof control cabin on the rig floor where the driller operates hoisting, rotary, and pumping controls.'
    },
    technicalSpecs: {
      tr: {
        'Donanım': 'Çift joystickli ergonomik cyber-chair koltuk',
        'Ekranlar': 'WOB, ROP, tork, standpipe basıncı, debi ve tank hacmi canlı ekranları',
        'Emniyet': 'Patlamaya dayanıklı (ATEX Zone 1) pozitif basınçlı kabin'
      },
      en: {
        'Controls': 'Dual multi-axis joysticks on an ergonomic driller cyber-chair',
        'Instrumentation': 'Real-time multi-screen touch displays for WOB, ROP, torque, and pumps',
        'Safety Rating': 'Pressurized ATEX Zone 1 explosion-proof enclosure'
      }
    },
    workingPrinciple: {
      tr: 'Sondörün komutları PLC sistemi üzerinden vinç motorlarına, top drive\'a ve pompalara dijital sinyallerle anında iletilir.',
      en: 'Driller commands are digitized through industrial PLCs to actuate drawworks, top drive, and mud pumps.'
    },
    drillingRole: {
      tr: 'Sondaj sahasının operasyonel beyin merkezidir.',
      en: 'The primary command cockpit for drilling execution and immediate well control response.'
    },
    safetyHazards: {
      tr: [
        'Operatör dikkatinin dağılması sonucu mekanik kaza riski'
      ],
      en: [
        'Operator fatigue or misinterpretation of downhole kick alarms'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Joystick kalibrasyonları, acil durdurma butonları ve yangın/gaz alarmlarının testi'
      ],
      en: [
        'Test cyber-chair emergency stop switches and positive pressurization fans'
      ]
    },
    systemConnection: {
      tr: 'Kule tabanına monte edilmiştir; fiber optik ve CAN-bus kablolarıyla tüm kule otomasyonuna bağlıdır.',
      en: 'Mounted on rig floor substructure; connects via fieldbus networks to rig machinery.'
    }
  },
  {
    id: 'poor-boy-degasser',
    name: {
      tr: 'Çamur-Gaz Ayırıcı Kulesi (Poor Boy Degasser)',
      en: 'Mud-Gas Separator (Poor Boy)'
    },
    turkishName: 'Çamur-Gaz Ayırıcı (Poor Boy)',
    category: 'wellcontrol',
    position: [-13, 1.5, 3.5],
    cameraTarget: [-13, 2.0, 3.5],
    cameraPosition: [-13, 3.5, 9],
    description: {
      tr: 'Kuyu kontrolü sırasında çamurla karışık gelen yüksek hacimli serbest gazı güvenle ayıran ve meşale hattına (flare) yönlendiren dikey ayırıcı kule.',
      en: 'Vertical baffle vessel designed to separate large volumes of free formation gas from mud during a well kick circulation.'
    },
    technicalSpecs: {
      tr: {
        'Gövde': '30 - 48 inç çapında dikey çelik kule, içte zikzak yönlendirici plakalar',
        'Çalışma': 'Yerçekimi ve santrifüj etkili gaz-sıvı ayrımı',
        'Sıvı Mührü (U-Tüp)': '10 - 20 ft sıvı sütun mührü ile gazın tanka kaçışı engellenir'
      },
      en: {
        'Vessel Geometry': '30 - 48 in OD vertical steel column with internal step baffles',
        'Separation Method': 'Gravity settling and impingement baffling',
        'Liquid Seal': '10 - 20 ft U-tube mud leg preventing gas blow-by into shaker tanks'
      }
    },
    workingPrinciple: {
      tr: 'Gazlı çamur tepeye yakın bölgeden girip plakalardan aşağı süzülür. Hafif gaz yukarı yükselip meşaleye gider, ağır sıvı alttan tanka dökülür.',
      en: 'Gas-cut mud hits internal baffles; liberated gas rises to the derrick vent line while degassed mud exits bottom.'
    },
    drillingRole: {
      tr: 'Gaz kicki sırasında kule tabanında patlama ve yangın çıkmasını önleyen en kritik güvenlik cihazıdır.',
      en: 'Prevents explosive gas accumulation around shale shakers during well-killing operations.'
    },
    safetyHazards: {
      tr: [
        'Aşırı gaz akışında sıvı mührünün kırılması ve gazın tanklara dolması (Blow-by)',
        'Meşale hattında basınç tıkanması sonucu kule gövdesinin patlama riski'
      ],
      en: [
        'Liquid mud leg seal blow-by releasing combustible gas into shaker pit area',
        'Vessel over-pressurization if vent line to flare is obstructed'
      ]
    },
    maintenanceChecks: {
      tr: [
        'İç plakaların kavitasyon ve aşınma kontrolü',
        'U-tüp sıvı contası seviyesi ve tahliye vanası sızdırmazlık testi'
      ],
      en: [
        'Inspect internal baffle plate wall thickness for erosive wear',
        'Verify mud U-tube seal leg drain valves are tightly seated'
      ]
    },
    systemConnection: {
      tr: 'Girişi Choke Manifoldu tahliye hattına, gaz çıkışı kule meşale hattına, sıvı çıkışı eleklere bağlıdır.',
      en: 'Inlet connected to Choke Manifold; top vent piped to flare; liquid outlet discharges to shakers.'
    }
  },
  {
    id: 'muster-point',
    name: {
      tr: 'Acil Toplanma Noktası (Muster Point)',
      en: 'Emergency Muster Point'
    },
    turkishName: 'Acil Toplanma Noktası',
    category: 'surface',
    position: [24, -1.8, 24],
    cameraTarget: [24, -1.5, 24],
    cameraPosition: [24, 0.5, 30],
    description: {
      tr: 'Yangın, gaz kaçağı veya patlama gibi acil durumlarda kule personelinin hızla toplanıp sayım yapıldığı, rüzgâr üstü güvenli alan.',
      en: 'Designated safe outdoor perimeter assembly area with windsock and emergency decontamination equipment.'
    },
    technicalSpecs: {
      tr: {
        'Donanım': 'Rüzgâr gülü (Windsock), acil göz/boy duşu, personel yoklama panosu',
        'Konum': 'Hâkim rüzgâr yönünün tersinde, gaz toplanma çukurlarından uzakta'
      },
      en: {
        'Equipment': 'Orange windsock, safety eyewash/shower, personnel muster tally board',
        'Siting': 'Located upwind on the site boundary outside hazardous classification zones'
      }
    },
    workingPrinciple: {
      tr: 'Rüzgâr gülü rüzgârın yönünü gösterir; H2S alarmında personel rüzgârı arkasına alarak en güvenli toplanma alanına tahliye olur.',
      en: 'Windsock displays wind direction so personnel can evacuate crosswind and upwind of gas plumes.'
    },
    drillingRole: {
      tr: 'Saha can güvenliği ve acil durum tahliye protokolünün merkezidir.',
      en: 'Essential life-safety infrastructure for roll calls and rescue coordination.'
    },
    safetyHazards: {
      tr: [
        'Rüzgâr yönü değiştiğinde toplanma noktasının gaz dumanı altında kalma riski (ikincil toplanma noktası belirlenmelidir)'
      ],
      en: [
        'Risk of wind shift blowing toxic plume toward primary muster location'
      ]
    },
    maintenanceChecks: {
      tr: [
        'Acil boy ve göz duşunun su akış ve antifriz testi',
        'Rüzgâr gülünün yırtıksız ve döner mekanizmasının serbest olduğunun kontrolü'
      ],
      en: [
        'Weekly operational flush of emergency eyewash/deluge shower',
        'Inspection of windsock fabric integrity and 360-degree swivel bearing'
      ]
    },
    systemConnection: {
      tr: 'Sahanın çevre tel örgüsü sınırında, ana giriş kapısına yakın güvenli açık alandadır.',
      en: 'Positioned at the rig site access road boundary.'
    }
  }
];
