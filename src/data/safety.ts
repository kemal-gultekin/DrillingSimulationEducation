import { SafetyQuestion } from '../types';

export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  {
    id: 'safe-ppe-1',
    category: 'ppe',
    difficulty: 'Temel',
    title: 'Kişisel Koruyucu Donanım (KKD) - Saha Girişi',
    question: 'Sondaj sahasına adım atan her mühendis ve personelin üzerinde istisnasız bulunması gereken temel Kişisel Koruyucu Donanım (Minimum PPE) grubu hangisidir?',
    options: [
      'Yalnızca çelik burunlu çizme ve baret yeterlidir.',
      'Baret, darbe emici gözlük (koruyucu gözlük), çelik burunlu İSG botu, alev geciktirici tulum (FRC) ve mekanik eldiven.',
      'Sadece reflektörlü yelek ve kulaklık takmak yeterlidir.',
      'Toz maskesi, yağmurluk ve pamuklu normal iş kıyafeti.'
    ],
    correctIndex: 1,
    explanation: 'Sondaj sahalarında API RP 54 ve uluslararası IADC/OSHA kurallarına göre asgari KKD standardı: EN 397/ANSI Z89.1 onaylı baret, EN 166 darbe dayanımlı yan korumalı gözlük, EN ISO 20345 S3 çelik burunlu ve orta taban korumalı bot, EN ISO 11612 onaylı Alev Geciktirici Tulum (FRC - Fire Retardant Coverall) ve EN 388 darbeye dayanıklı eldivendir.',
    equipmentFocusId: 'derrick',
    regulationRef: 'API RP 54 / OSHA 1910.132'
  },
  {
    id: 'safe-h2s-1',
    category: 'h2s',
    difficulty: 'İleri',
    title: 'Hidrojen Sülfür (H2S) Gazı ve Tahliye',
    question: 'Kuyu dibinden gelen çamurda H2S gazı tespit edildiğinde ve kişisel dedektörünüz 10 ppm alarmı verdiğinde ilk yapılması gereken acil eylem ne olmalıdır?',
    options: [
      'H2S kokusunu takip ederek sızıntının kaynağını bulmaya çalışmak.',
      'Rüzgar gülüne (wind sock) bakıp rüzgarı hemen arkaya veya çapraza alarak (upwind / crosswind), yüksekte bulunan belirlenmiş toplanma alanına (Muster Point) hızla tahliye olmak.',
      'Hemen çamur tanklarına inip kimyasal scavanger (H2S tutucu) dökmek.',
      'Kuyuyu terk etmeden önce tüm aletleri tek tek kutularına kaldırmak.'
    ],
    correctIndex: 1,
    explanation: 'H2S (Hidrojen Sülfür) havadan ağır (bağıl yoğunluk 1.19), renksiz ve ölümcül toksik bir gazdır. Düşük konsantrasyonlarda çürük yumurta gibi koksa da 50-100 ppm üzerinde koku alma sinirlerini saniyeler içinde felç eder. 10 ppm TLV-TWA eşiğinde alarm çaldığında derhal rüzgar yönü tespit edilir (rüzgar gülü) ve rüzgara karşı veya çapraz (upwind/crosswind) yönde, çukur alanlardan kaçınarak acil toplanma noktasına intikal edilir.',
    equipmentFocusId: 'mud-logging',
    regulationRef: 'API RP 49 (Drilling and Servicing Operations Involving H2S)'
  },
  {
    id: 'safe-heights-1',
    category: 'heights',
    difficulty: 'Orta',
    title: 'Yüksekte Çalışma - Kule (Derrick) ve Monkey Board',
    question: 'Kule üzerindeki monkey board platformunda (yaklaşık 25 metre yükseklikte) boru dizecek olan Kule İşçisi (Derrickman) hangi güvenlik önlemini eksiksiz almak zorundadır?',
    options: [
      'Sadece ayakkabısının kaymaz taban olmasına dikkat etmesi yeterlidir.',
      'Paraşüt tipi emniyet kemeri (Full-body harness) giymeli, şok emicili lanyardı kule ankraj noktasına veya dikey yaşam hattına (inertia reel) %100 bağlı tutmalıdır.',
      'Bel tipi tek noktalı emniyet kemeri takması yeterlidir.',
      'Kulede merdiven korkulukları olduğu için kemer takmasına gerek yoktur.'
    ],
    correctIndex: 1,
    explanation: 'Yüksekte çalışma kuralları (1.8 m veya 6 ft üzeri) gereğince kulede görev yapan personelin çift bacaklı şok emicili paraşüt tipi emniyet kemeri (EN 361) kullanması ve her zaman en az bir karabinasının taşıyıcı ankraja bağlı olması (%100 tie-off) zorunludur. Bel tipi tek nokta kemerler omurga yaralanması riski nedeniyle derrick operasyonlarında kesinlikle yasaktır.',
    equipmentFocusId: 'derrick',
    regulationRef: 'OSHA 1926.502 / IADC Safety Manual'
  },
  {
    id: 'safe-loto-1',
    category: 'loto',
    difficulty: 'Orta',
    title: 'Enerji İzolasyonu - LOTO (Lockout / Tagout)',
    question: 'Üç silindirli çamur pompasının (Triplex Mud Pump) piston ve layner bakımı yapılmadan önce hangi kritik güvenlik prosedürü uygulanmalıdır?',
    options: [
      'Pompanın açma-kapama butonunu kapatmak ve yanına bir uyarı kağıdı koymak yeterlidir.',
      'Pompa motorunun elektrik panosu kilitlenmeli (Padlock), etiketlenmeli (Danger Tag), yardımcı kontrol panelleri izole edilmeli ve hidrolik/pnömatik artık basınç sıfırlanmalıdır (LOTO).',
      'Pompacıya "pompaya dokunma" diye sözlü bilgi vermek yeterlidir.',
      'Sadece pompanın emiş vanasını kapatmak yeterlidir.'
    ],
    correctIndex: 1,
    explanation: 'LOTO (Kilitleme/Etiketleme) prosedürü, bakım sırasında makinenin beklenmedik şekilde çalışmasını veya depolanmış basıncın açığa çıkmasını önler. Elektrik şalterine yetkili personelin kişisel asma kilidi takılır, uyarı etiketi iliştirilir ve hatlardaki basınç (pulsation dampener vb.) tamamen tahliye edilir (Zero Energy State doğrulanır).',
    equipmentFocusId: 'mud-pumps',
    regulationRef: 'OSHA 1910.147'
  },
  {
    id: 'safe-ptw-1',
    category: 'rigfloor',
    difficulty: 'Temel',
    title: 'Çalışma İzni Sistemi (Permit to Work - PTW)',
    question: 'Sondaj sahasında kıvılcım çıkarabilecek kaynak, kesme veya taşlama işi (Hot Work) yapılmadan önce kimden yazılı onay alınmalıdır?',
    options: [
      'Herhangi bir saha işçisinden.',
      'Şirket Temsilcisi (Company Man) ve Sondör Amiri (Toolpusher) onaylı Sıcak İş İzin Belgesi (Hot Work Permit) alınmalı ve patlayıcı gaz ölçümü (LEL testi) yapılmalıdır.',
      'İzin gerekmez, sadece yakına bir yangın söndürücü koyulması kafidir.',
      'Yalnızca malzeme deposu sorumlusuna haber verilir.'
    ],
    correctIndex: 1,
    explanation: 'Sondaj kuyusu çevresi Zone 0, Zone 1 ve Zone 2 patlama riskli (ATEX) bölgelerdir. Sıcak çalışma yapılmadan önce ortamda metan/hidrokarbon gazı bulunmadığı calibrated gas detector ile ölçülmeli (LEL %0 olmalı), yangın gözlemcisi (Fire Watch) atanmalı ve Şirket Temsilcisi tarafından imzalı Sıcak Çalışma İzni (PTW) düzenlenmelidir.',
    equipmentFocusId: 'company-man',
    regulationRef: 'API RP 500 / NFPA 51B'
  },
  {
    id: 'safe-confined-1',
    category: 'confined',
    difficulty: 'İleri',
    title: 'Kapalı Alanlara Giriş (Confined Space Entry) - Çamur Tankı',
    question: 'Barite veya katı birikintilerini temizlemek amacıyla çamur tankının içine girmeden önce hangisi HAYATİ öneme sahip DEĞİLDİR?',
    options: [
      'Tankın içindeki oksijen (%19.5 - 23.5), H2S ve yanıcı gaz (LEL) seviyelerinin kalibre edilmiş cihazla ölçülmesi.',
      'Tankın girişinde sürekli bir gözlemci (Standby Person) bekletilmesi ve acil durum kurtarma tripodunun hazır olması.',
      'Tank karıştırıcılarının (agitator) elektrikten LOTO ile izole edilmesi.',
      'Tankın dış yüzeyinin yeni boyanmış olması.'
    ],
    correctIndex: 3,
    explanation: 'Kapalı alanlara girişte (Confined Space) ölümcül riskler: oksijen yetersizliği (<%19.5), zehirli gaz (H2S), yanıcı gazlar ve mekanik mikserlerin dönmesidir. Dış yüzey boyası operasyonel güvenlik açısından bir önkoşul değildir; gaz testi, sürekli havalandırma, LOTO ve giriş gözlemcisi zorunludur.',
    equipmentFocusId: 'mud-tanks',
    regulationRef: 'OSHA 1910.146'
  },
  {
    id: 'safe-fire-1',
    category: 'fire',
    difficulty: 'Orta',
    title: 'Jeneratör ve Yakıt Sahası Yangın Güvenliği',
    question: 'Dizel jeneratör bölgesinde meydana gelebilecek bir akaryakıt (B Sınıfı) yangınına müdahalede hangi yangın söndürücü tipi KESİNLİKLE KULLANILMAMALIDIR?',
    options: [
      'Kuru Kimyevi Tozlu (KKT / ABC)',
      'Karbondioksitli (CO2)',
      'Düz Basınçlı Su Jeti (Water Stream)',
      'Köpüklü Söndürücü (AFFF Foam)'
    ],
    correctIndex: 2,
    explanation: 'Sıvı yakıt (dizel, yağ) yangınlarına basınçlı su sıkılması yangını söndürmez; aksine yanan yakıtın etrafa sıçramasına ve alevlerin yayılmasına (boilover / splatter) neden olur. Ayrıca elektrikli aksam varsa elektrik çarpması riski doğurur. B sınıfı yangınlarda Kuru Kimyevi Toz, Köpük veya CO2 kullanılmalıdır.',
    equipmentFocusId: 'generators',
    regulationRef: 'NFPA 10'
  },
  {
    id: 'safe-env-1',
    category: 'environmental',
    difficulty: 'Temel',
    title: 'Çevre Koruma ve Sondaj Atık Yönetimi',
    question: 'Sentetik veya petrol bazlı sondaj çamuru (OBM/SBM) ile delinen bir kuyuda, titreşimli eleklerden çıkan kırıntılar (drill cuttings) nasıl yönetilmelidir?',
    options: [
      'Doğrudan komşu tarım arazisine veya açık dere yatağına dökülebilir.',
      'Sızdırmaz HDPE jeomembran kaplı atık havuzuna veya kapalı çamur konteynerlerine alınmalı, kurutma fırınları (thermal desorption) veya lisanslı bertaraf tesislerine sevk edilmelidir.',
      'Rig sahasının zeminine serilip üzerinden iş makineleriyle geçilerek gömülmelidir.',
      'Su ile inceltilip yerel kanalizasyona basılmalıdır.'
    ],
    correctIndex: 1,
    explanation: 'Petrol ve sentetik bazlı çamur artıkları hidrokarbon ve ağır metaller içerdiğinden yeraltı sularını ve toprağı kirletme potansiyeline sahiptir. Sıfır Deşarj (Zero Discharge) prensibiyle sızdırmaz jeomembran kaplı havuzlarda toplanır, santrifüj ve termal desorpsiyon ünitelerinde yağ geri kazanılarak lisanslı atık tesislerine sevk edilir.',
    equipmentFocusId: 'waste-pit',
    regulationRef: 'EPA Drilling Waste Guidelines / MARPOL'
  },
  {
    id: 'safe-rigfloor-1',
    category: 'rigfloor',
    difficulty: 'Orta',
    title: 'Kule Tabanı (Rig Floor) - Kırmızı Bölge (Red Zone)',
    question: 'Sondaj sahasında "Red Zone" (Kırmızı Tehlike Bölgesi) nedir ve bu bölgeye giriş kuralı nasıldır?',
    options: [
      'Yemekhanenin mutfak bölümüdür, herkes serbestçe girebilir.',
      'Kule tabanında dönen ve hareket eden makinelerin (döner masa, iron roughneck, boru kolları, askı halatları) bulunduğu yüksek riskli alandır; ancak sondörün (driller) açık izniyle ve zorunlu hallerde girilebilir.',
      'Sadece mühendislerin oturup çizim yaptığı dinlenme alanıdır.',
      'Çamur pompalarının yanındaki boş otopark alanıdır.'
    ],
    correctIndex: 1,
    explanation: 'Red Zone, kule tabanında boru kaldırma, dönme ve bağlama makinelerinin aktif olduğu, personele çarpma, sıkışma veya yukarıdan malzeme düşme riskinin en yüksek olduğu alandır. Görsel bariyerler ve zemin boyası ile işaretlenir; bu alana operasyon sürerken ancak sondörün (driller) onayı ve makine durdurulduktan sonra adım atılabilir.',
    equipmentFocusId: 'drill-string',
    regulationRef: 'Dropping Objects Prevention Scheme (DROPS) / IADC'
  }
];
