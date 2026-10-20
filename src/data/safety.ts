import { SafetyQuestion } from '../types';

export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  {
    id: 'safe-ppe-1',
    category: 'ppe',
    difficulty: 'Temel',
    title: {
      tr: 'Kişisel Koruyucu Donanım (KKD) - Saha Girişi',
      en: 'Personal Protective Equipment (PPE) - Site Entry'
    },
    question: {
      tr: 'Sondaj sahasına adım atan her mühendis ve personelin üzerinde istisnasız bulunması gereken temel Kişisel Koruyucu Donanım (Minimum PPE) grubu hangisidir?',
      en: 'Which minimum Personal Protective Equipment (PPE) package is strictly mandatory for every engineer and personnel entering an active drilling rig site?'
    },
    options: {
      tr: [
        'Yalnızca çelik burunlu çizme ve baret yeterlidir.',
        'Baret, darbe emici gözlük (koruyucu gözlük), çelik burunlu İSG botu, alev geciktirici tulum (FRC) ve mekanik eldiven.',
        'Sadece reflektörlü yelek ve kulaklık takmak yeterlidir.',
        'Toz maskesi, yağmurluk ve pamuklu normal iş kıyafeti.'
      ],
      en: [
        'Only steel-toe boots and a hard hat are sufficient.',
        'Hard hat, impact-resistant safety glasses, steel-toe boots, flame-retardant coveralls (FRC), and impact gloves.',
        'Only a high-visibility vest and ear muffs are needed.',
        'Dust mask, rain poncho, and standard cotton streetwear.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'Sondaj sahalarında API RP 54 ve uluslararası IADC/OSHA kurallarına göre asgari KKD standardı: EN 397/ANSI Z89.1 onaylı baret, EN 166 darbe dayanımlı yan korumalı gözlük, EN ISO 20345 S3 çelik burunlu bot, EN ISO 11612 onaylı Alev Geciktirici Tulum (FRC) ve EN 388 darbeye dayanıklı eldivendir.',
      en: 'Per API RP 54 and IADC/OSHA regulations, standard mandatory minimum PPE includes ANSI/EN certified hard hat, side-shield safety glasses, steel-toe puncture-resistant boots, certified Flame Retardant Coveralls (FRC), and heavy impact gloves.'
    },
    equipmentFocusId: 'derrick',
    regulationRef: 'API RP 54 / OSHA 1910.132'
  },
  {
    id: 'safe-h2s-1',
    category: 'h2s',
    difficulty: 'İleri',
    title: {
      tr: 'Hidrojen Sülfür (H2S) Gazı ve Tahliye',
      en: 'Hydrogen Sulfide (H2S) Gas & Evacuation'
    },
    question: {
      tr: 'Kuyu dibinden gelen çamurda H2S gazı tespit edildiğinde ve kişisel dedektörünüz 10 ppm alarmı verdiğinde ilk yapılması gereken acil eylem ne olmalıdır?',
      en: 'When H2S is detected in mud returns and personal electronic monitors trigger a 10 ppm alarm, what is the mandatory immediate emergency action?'
    },
    options: {
      tr: [
        'H2S kokusunu takip ederek sızıntının kaynağını bulmaya çalışmak.',
        'Rüzgar gülüne (wind sock) bakıp rüzgarı hemen arkaya veya çapraza alarak (upwind / crosswind), yüksekte bulunan belirlenmiş toplanma alanına (Muster Point) hızla tahliye olmak.',
        'Hemen çamur tanklarına inip kimyasal scavanger (H2S tutucu) dökmek.',
        'Kuyuyu terk etmeden önce tüm aletleri tek tek kutularına kaldırmak.'
      ],
      en: [
        'Attempt to locate the leak source by sniffing for rotten egg odor.',
        'Check the windsock and immediately evacuate crosswind and upwind to the designated elevated Muster Point.',
        'Immediately climb into the mud pits to pour chemical H2S scavenger bags.',
        'Pack and organize all hand tools before initiating evacuation.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'H2S (Hidrojen Sülfür) havadan ağır (bağıl yoğunluk 1.19), renksiz ve ölümcül toksik bir gazdır. 10 ppm TLV-TWA eşiğinde alarm çaldığında derhal rüzgar yönü tespit edilir (rüzgar gülü) ve rüzgara karşı veya çapraz (upwind/crosswind) yönde, çukur alanlardan kaçınarak acil toplanma noktasına intikal edilir.',
      en: 'H2S is heavier than air (specific gravity 1.19), colorless, and lethal. At the 10 ppm permissible exposure threshold, personnel must immediately determine wind direction from the windsock and evacuate crosswind/upwind away from low-lying cellar areas.'
    },
    equipmentFocusId: 'mud-logging',
    regulationRef: 'API RP 49 (Drilling and Servicing Operations Involving H2S)'
  },
  {
    id: 'safe-heights-1',
    category: 'heights',
    difficulty: 'Orta',
    title: {
      tr: 'Yüksekte Çalışma - Kule (Derrick) ve Monkey Board',
      en: 'Working at Heights - Derrick & Monkey Board'
    },
    question: {
      tr: 'Kule üzerindeki monkey board platformunda (yaklaşık 25 metre yükseklikte) boru dizecek olan Kule İşçisi (Derrickman) hangi güvenlik önlemini eksiksiz almak zorundadır?',
      en: 'What fall protection equipment is mandatory for the Derrickman racking drill pipe stands on the monkey board platform (~25 meters aloft)?'
    },
    options: {
      tr: [
        'Sadece ayakkabısının kaymaz taban olmasına dikkat etmesi yeterlidir.',
        'Paraşüt tipi emniyet kemeri (Full-body harness) giymeli, şok emicili lanyardı kule ankraj noktasına veya dikey yaşam hattına (inertia reel) %100 bağlı tutmalıdır.',
        'Bel tipi tek noktalı emniyet kemeri takması yeterlidir.',
        'Kulede merdiven korkulukları olduğu için kemer takmasına gerek yoktur.'
      ],
      en: [
        'Only slip-resistant footwear is required.',
        'Wear an approved full-body harness with shock-absorbing lanyards and maintain 100% tie-off to certified fall arrest inertia reels or anchors.',
        'A single-point waist position belt is acceptable.',
        'No harness is needed because the platform has handrails.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'Yüksekte çalışma kuralları (1.8 m üzeri) gereğince kulede görev yapan personelin çift bacaklı şok emicili paraşüt tipi emniyet kemeri (EN 361) kullanması ve her zaman en az bir karabinasının taşıyıcı ankraja bağlı olması (%100 tie-off) zorunludur. Bel kemerleri omurga yaralanması riski nedeniyle kesinlikle yasaktır.',
      en: 'Falls from heights above 6 ft (1.8 m) require an ANSI/EN certified full-body harness with double-leg shock-absorbing lanyards ensuring continuous 100% tie-off. Waist belts are prohibited due to severe lumbar injury risks during suspension.'
    },
    equipmentFocusId: 'derrick',
    regulationRef: 'OSHA 1926.502 / IADC Safety Manual'
  },
  {
    id: 'safe-loto-1',
    category: 'loto',
    difficulty: 'Orta',
    title: {
      tr: 'Enerji İzolasyonu - LOTO (Lockout / Tagout)',
      en: 'Energy Isolation - LOTO (Lockout / Tagout)'
    },
    question: {
      tr: 'Üç silindirli çamur pompasının (Triplex Mud Pump) piston ve layner bakımı yapılmadan önce hangi kritik güvenlik prosedürü uygulanmalıdır?',
      en: 'Which vital safety procedure must be executed prior to inspecting or servicing liners and valves on a Triplex Mud Pump?'
    },
    options: {
      tr: [
        'Pompanın açma-kapama butonunu kapatmak ve yanına bir uyarı kağıdı koymak yeterlidir.',
        'Pompa motorunun elektrik panosu kilitlenmeli (Padlock), etiketlenmeli (Danger Tag), yardımcı kontrol panelleri izole edilmeli ve hidrolik/pnömatik artık basınç sıfırlanmalıdır (LOTO).',
        'Pompacıya "pompaya dokunma" diye sözlü bilgi vermek yeterlidir.',
        'Sadece pompanın emiş vanasını kapatmak yeterlidir.'
      ],
      en: [
        'Switch off the local start button and leave a sticky note on the frame.',
        'Perform complete LOTO: padlocking the main electrical breaker, attaching danger tags, and bleeding residual hydraulic/discharge dampener pressure to zero.',
        'Provide a verbal warning to the pump man not to start the unit.',
        'Close only the fluid suction valve.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'LOTO (Kilitleme/Etiketleme) prosedürü, bakım sırasında makinenin beklenmedik şekilde çalışmasını veya depolanmış basıncın açığa çıkmasını önler. Elektrik şalterine yetkili personelin asma kilidi takılır, uyarı etiketi iliştirilir ve hatlardaki basınç tamamen tahliye edilir (Zero Energy State doğrulanır).',
      en: 'Lockout/Tagout (LOTO) isolates hazardous electrical, hydraulic, and pneumatic energy. Breakers must be padlocked by maintenance crew, tagged with danger notices, and all pressurized accumulators depressurized to achieve a Zero Energy State.'
    },
    equipmentFocusId: 'mud-pumps',
    regulationRef: 'OSHA 1910.147'
  },
  {
    id: 'safe-ptw-1',
    category: 'rigfloor',
    difficulty: 'Temel',
    title: {
      tr: 'Çalışma İzni Sistemi (Permit to Work - PTW)',
      en: 'Permit to Work System (PTW) - Hot Work'
    },
    question: {
      tr: 'Sondaj sahasında kıvılcım çıkarabilecek kaynak, kesme veya taşlama işi (Hot Work) yapılmadan önce kimden yazılı onay alınmalıdır?',
      en: 'Who must authorize and sign a written Hot Work Permit before any welding, torch cutting, or grinding can proceed on a drilling location?'
    },
    options: {
      tr: [
        'Herhangi bir saha işçisinden.',
        'Şirket Temsilcisi (Company Man) ve Sondör Amiri (Toolpusher) onaylı Sıcak İş İzin Belgesi (Hot Work Permit) alınmalı ve patlayıcı gaz ölçümü (LEL testi) yapılmalıdır.',
        'İzin gerekmez, sadece yakına bir yangın söndürücü koyulması kafidir.',
        'Yalnızca malzeme deposu sorumlusuna haber verilir.'
      ],
      en: [
        'Any nearby roustabout or floorhand.',
        'The Operator Representative (Company Man) and Toolpusher must sign a formal Hot Work Permit following atmospheric LEL gas testing.',
        'No permit is needed if a fire extinguisher is placed nearby.',
        'Only the warehouse clerk needs to be notified.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'Sondaj sahası patlama riskli (ATEX Zone 1/2) bir alandır. Sıcak çalışma yapılmadan önce ortamda metan/hidrokarbon gazı bulunmadığı gaz dedektörü ile ölçülmeli (%0 LEL), yangın gözlemcisi (Fire Watch) atanmalı ve Şirket Temsilcisi tarafından imzalı Sıcak Çalışma İzni düzenlenmelidir.',
      en: 'Drilling wellsites contain classified hazardous explosive zones. Prior to hot work, continuous Lower Explosive Limit (LEL 0%) gas testing is verified, a designated fire watch is assigned, and a signed PTW is authorized by leadership.'
    },
    equipmentFocusId: 'company-man',
    regulationRef: 'API RP 500 / NFPA 51B'
  },
  {
    id: 'safe-confined-1',
    category: 'confined',
    difficulty: 'İleri',
    title: {
      tr: 'Kapalı Alanlara Giriş (Confined Space Entry) - Çamur Tankı',
      en: 'Confined Space Entry - Mud Tank Cleaning'
    },
    question: {
      tr: 'Barit veya katı birikintilerini temizlemek amacıyla çamur tankının içine girmeden önce hangisi HAYATİ öneme sahip DEĞİLDİR?',
      en: 'Before personnel enter a drained mud tank to clean barite settled solids, which of the following is NOT a vital safety prerequisite?'
    },
    options: {
      tr: [
        'Tankın içindeki oksijen (%19.5 - 23.5), H2S ve yanıcı gaz (LEL) seviyelerinin kalibre edilmiş cihazla ölçülmesi.',
        'Tankın girişinde sürekli bir gözlemci (Standby Person) bekletilmesi ve acil durum kurtarma tripodunun hazır olması.',
        'Tank karıştırıcılarının (agitator) elektrikten LOTO ile izole edilmesi.',
        'Tankın dış yüzeyinin yeni boyanmış olması.'
      ],
      en: [
        'Atmospheric testing verifying oxygen between 19.5% - 23.5%, zero H2S, and 0% LEL.',
        'Stationing a dedicated standby entrant attendant with rescue retrieval equipment.',
        'Physical LOTO isolation of internal mechanical agitator impeller motors.',
        'Ensuring the exterior tank wall has fresh paint.'
      ]
    },
    correctIndex: 3,
    explanation: {
      tr: 'Kapalı alanlara girişte (Confined Space) ölümcül riskler: oksijen yetersizliği (<%19.5), zehirli gaz (H2S), yanıcı gazlar ve mekanik mikserlerin dönmesidir. Dış yüzey boyası operasyonel güvenlik açısından bir önkoşul değildir; gaz testi, sürekli havalandırma, LOTO ve giriş gözlemcisi zorunludur.',
      en: 'Confined space entry hazards involve oxygen deficiency (<19.5%), toxic vapors (H2S), explosive gases, and mechanical entrapment. Exterior aesthetics are irrelevant; multi-gas testing, active mechanical ventilation, LOTO, and safety standby watchers are strictly mandatory.'
    },
    equipmentFocusId: 'mud-tanks',
    regulationRef: 'OSHA 1910.146'
  },
  {
    id: 'safe-fire-1',
    category: 'fire',
    difficulty: 'Orta',
    title: {
      tr: 'Jeneratör ve Yakıt Sahası Yangın Güvenliği',
      en: 'Diesel Generators & Fuel Storage Fire Safety'
    },
    question: {
      tr: 'Dizel jeneratör bölgesinde meydana gelebilecek bir akaryakıt (B Sınıfı) yangınına müdahalede hangi yangın söndürücü tipi KESİNLİKLE KULLANILMAMALIDIR?',
      en: 'Which extinguishing medium must NEVER be discharged directly onto a Class B flammable diesel or lube oil pool fire?'
    },
    options: {
      tr: [
        'Kuru Kimyevi Tozlu (KKT / ABC)',
        'Karbondioksitli (CO2)',
        'Düz Basınçlı Su Jeti (Water Stream)',
        'Köpüklü Söndürücü (AFFF Foam)'
      ],
      en: [
        'Dry Chemical Powder (ABC / Purple-K)',
        'Carbon Dioxide (CO2)',
        'Solid Direct Water Stream',
        'Aqueous Film-Forming Foam (AFFF)'
      ]
    },
    correctIndex: 2,
    explanation: {
      tr: 'Sıvı yakıt yangınlarına basınçlı su sıkılması yangını söndürmez; aksine yanan yakıtın etrafa sıçramasına ve alevlerin yayılmasına (boilover / splatter) neden olur. Ayrıca elektrikli aksam varsa elektrik çarpması riski doğurur. B sınıfı yangınlarda Kuru Kimyevi Toz, Köpük veya CO2 kullanılmalıdır.',
      en: 'Direct water streams onto liquid hydrocarbon fires cause violent splattering and rapid fire spread because oil floats on water. Class B fires require smothering agents like Dry Chemical Powder, AFFF Foam, or CO2 gas.'
    },
    equipmentFocusId: 'generators',
    regulationRef: 'NFPA 10'
  },
  {
    id: 'safe-env-1',
    category: 'environmental',
    difficulty: 'Temel',
    title: {
      tr: 'Çevre Koruma ve Sondaj Atık Yönetimi',
      en: 'Environmental Protection & Cuttings Waste Management'
    },
    question: {
      tr: 'Sentetik veya petrol bazlı sondaj çamuru (OBM/SBM) ile delinen bir kuyuda, titreşimli eleklerden çıkan kırıntılar (drill cuttings) nasıl yönetilmelidir?',
      en: 'How must oil-wetted rock cuttings discharged from shale shakers be handled when drilling with Oil-Based Mud (OBM)?'
    },
    options: {
      tr: [
        'Doğrudan komşu tarım arazisine veya açık dere yatağına dökülebilir.',
        'Sızdırmaz HDPE jeomembran kaplı atık havuzuna veya kapalı çamur konteynerlerine alınmalı, kurutma fırınları (thermal desorption) veya lisanslı bertaraf tesislerine sevk edilmelidir.',
        'Rig sahasının zeminine serilip üzerinden iş makineleriyle geçilerek gömülmelidir.',
        'Su ile inceltilip yerel kanalizasyona basılmalıdır.'
      ],
      en: [
        'Discharged directly into adjacent waterways or open farmland.',
        'Collected in double-lined HDPE containment pits or sealed cuttings skips for thermal desorption treatment or certified hazardous waste disposal.',
        'Graded into the caliche rig pad soil and packed down by machinery.',
        'Diluted with fresh water and pumped into municipal sewer drains.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'Petrol ve sentetik bazlı çamur artıkları hidrokarbon ve ağır metaller içerdiğinden yeraltı sularını kirletme potansiyeline sahiptir. Sıfır Deşarj prensibiyle sızdırmaz havuzlarda veya konteynerlerde toplanır, termal desorpsiyon ünitelerinde yağ geri kazanılarak lisanslı tesislerde bertaraf edilir.',
      en: 'Oil-based mud cuttings contain hydrocarbons and chemical additives that threaten groundwater tables. Under Zero Discharge guidelines, cuttings are stored in impervious lined pits or skips, stripped via thermal desorption, and treated at certified facilities.'
    },
    equipmentFocusId: 'waste-pit',
    regulationRef: 'EPA Drilling Waste Guidelines / MARPOL'
  },
  {
    id: 'safe-rigfloor-1',
    category: 'rigfloor',
    difficulty: 'Orta',
    title: {
      tr: 'Kule Tabanı (Rig Floor) - Kırmızı Bölge (Red Zone)',
      en: 'Rig Floor Red Zone Safety Discipline'
    },
    question: {
      tr: 'Sondaj sahasında "Red Zone" (Kırmızı Tehlike Bölgesi) nedir ve bu bölgeye giriş kuralı nasıldır?',
      en: 'What defines the "Red Zone" on an active rig floor and what is the strict protocol regarding entry?'
    },
    options: {
      tr: [
        'Yemekhanenin mutfak bölümüdür, herkes serbestçe girebilir.',
        'Kule tabanında dönen ve hareket eden makinelerin (döner masa, iron roughneck, boru kolları, askı halatları) bulunduğu yüksek riskli alandır; ancak sondörün (driller) açık izniyle ve zorunlu hallerde girilebilir.',
        'Sadece mühendislerin oturup çizim yaptığı dinlenme alanıdır.',
        'Çamur pompalarının yanındaki boş otopark alanıdır.'
      ],
      en: [
        'The galley kitchen prep area open to all personnel.',
        'High-risk line-of-fire areas surrounding rotating equipment (rotary table, iron roughneck, winches); entry is forbidden without direct Driller authorization.',
        'An observation lounge where engineers review mud logs.',
        'The empty equipment storage yard next to the water tanks.'
      ]
    },
    correctIndex: 1,
    explanation: {
      tr: 'Red Zone, kule tabanında boru kaldırma, dönme ve bağlama makinelerinin aktif olduğu, personele çarpma, sıkışma veya yukarıdan malzeme düşme riskinin en yüksek olduğu alandır. Görsel bariyerler ve zemin boyası ile işaretlenir; bu alana operasyon sürerken ancak sondörün (driller) onayıyla adım atılabilir.',
      en: 'The Red Zone encompasses rotating machinery, elevated hoisted loads, and moving pipe tongs. Entry is strictly restricted by physical barriers, red anti-slip paint, and mandatory verbal/radio clearance from the Driller once machinery is halted.'
    },
    equipmentFocusId: 'drill-string',
    regulationRef: 'Dropping Objects Prevention Scheme (DROPS) / IADC'
  }
];
