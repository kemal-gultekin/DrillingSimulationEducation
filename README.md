# PetroSim - 3D Kara Sondaj Sahası Eğitim Simülasyonu

> **Petrol ve Doğalgaz Mühendisliği öğrencileri ve eğitmenleri için React, TypeScript ve Three.js ile geliştirilmiş, 3D oyun benzeri interaktif kara (onshore) sondaj sahası eğitim simülasyonu.**

---

<!-- Ekran Görüntüsü Yer Tutucusu -->
![PetroSim Ana Ekran Görüntüsü](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80)
*PetroSim 3D Onshore Sondaj Sahası Genel Görünümü*

---

## 🎯 Amaç ve Hedef Kitle

**PetroSim**, petrol ve doğalgaz mühendisliği lisans/lisansüstü öğrencileri ile sondaj sektörü eğitmenlerine güvenli, görsel ve matematiksel olarak doğrulanmış bir dijital laboratuvar sunmak amacıyla geliştirilmiştir.

- **Öğrenciler:** Ağır sondaj ekipmanlarını sahaya çıkmadan 3D ortamda birebir ölçekli tanır, hidrostatik basınç ve kuyu kontrolü hesaplamalarını interaktif formüllerle pekiştirir, dallanan kuyu içi senaryolarında (kick, boru sıkışması, kaçak) anlık mühendislik kararları vererek sonuçlarını simüle eder.
- **Eğitmenler:** Müfredata uygun ödev ve görevler atayabilir, öğrencilerin ekipman tanıma oranlarını, ISG güvenlik quiz puanlarını ve kill-sheet tamamlama başarılarını Eğitmen Portalı üzerinden canlı olarak takip edebilir.

---

## ✨ Temel Özellikler

### 1. Üç Ana Mod ve Kapsamlı Modüller
- **🔭 Keşfet Modu (Explore):** 
  - Kule platformu (Rig Floor), Derrick kulesi, BOP kuyu kontrol ünitesi, tripleks çamur pompaları, titreşimli elekler (Shale Shakers), çamur tankları, Drawworks vinci, Top Drive ve Doghouse kontrol kabini gibi tüm kritik ekipmanların 3D interaktif keşfi.
  - ANSI/API standartlarında hazırlanmış kapsamlı teknik özellikler, çalışma prensibi, güvenlik riskleri ve bakım kontrolleri içeren **Ekipman Bilgi Kartları**.
  - Sesli/yazılı talimatlarla aşama aşama sahayı gezdiren 8 adımlı **Rehberli Saha Turu (Guided Mission Tour)**.

- **🦺 Güvenlik Modu (Safety & HSE):**
  - IADC, OSHA ve API standartlarına uygun ISG/HSE güvenlik sınavı.
  - Kişisel koruyucu donanım (KKD/PPE), H2S gazı güvenliği, kuyu başı riskleri, yangınla mücadele ve LOTO (Kilitleme/Etiketleme) kategorilerinde detaylı soru bankası ve teknik çözümler.

- **⚙️ Mühendislik Modu (Engineering):**
  - **Sondaj Hidroliği Hesaplayıcıları:** Hidrostatik Basınç ($P = 0.052 \times MW \times TVD$), Basınç Gradyanı, Gerekli Çamur Ağırlığı, Dinamik Kuyu Dibi Basıncı (BHP), Eşdeğer Dolaşım Yoğunluğu (ECD) ve Overbalance marjı. Adım adım formül dökümü ve mühendislik yorumu.
  - **IWCF & IADC Standartlarında Kill-Sheet Hesaplayıcı:** Kuyu kapatma (Shut-in) sonrası SIDPP, SICP ve çamur tankı kazancından (Pit Gain) hareketle Kill Mud Weight (KMW), İlk ve Son Dolaşım Basınçları (ICP / FCP), MAASP ve gaz/petrol/su akışı tespiti.
  - **Dallanan Senaryo & Karar Motoru (Scenario Engine):** Formasyon akışı (Kick Tespiti & Yumuşak Kapatma), Şiddetli Çamur Kaçağı (Lost Circulation), Diferansiyel Boru Sıkışması (Differential Sticking) ve Gazlı Çamur senaryolarında canlı kule telemetrisi ile anlık karar verme ağacı.

- **📊 Öğrenci İlerleme & Performans Takibi:**
  - Keşfedilen ekipman sayısı, ISG puanı, tamamlanan hesaplamalar ve senaryo başarılarının `localStorage` ile kalıcı olarak saklanması.

- **🎓 Eğitmen Portalı (Instructor Portal):**
  - Sınıf başarı grafikleri, öğrencilerin modül tamamlama yüzdeleri, ödev atama paneli ve kuyu kontrolü simülasyon karneleri.

---

## 🎮 Kontroller Tablosu

Simülasyondaki gerçek klavye ve fare kontrolleri aşağıdaki gibidir:

| Kontrol / Tuş | Mod | İşlem Açıklaması |
| :--- | :--- | :--- |
| **W** / **Yukarı Ok** | Yürüyüş (Walk) | İleri yürüme |
| **S** / **Aşağı Ok** | Yürüyüş (Walk) | Geri yürüme |
| **A** / **Sol Ok** | Yürüyüş (Walk) | Sola kayma (Strafe Left) |
| **D** / **Sağ Ok** | Yürüyüş (Walk) | Sağa kayma (Strafe Right) |
| **Shift (Sol/Sağ)** | Yürüyüş (Walk) | Hızlı koşma (Sprint - 8.2 m/s) |
| **Fare Hareketi** | Yürüyüş (Walk) | 360° etrafa bakış (Pointer Lock devredeyken) |
| **Sol Tık (Sahne)** | Yürüyüş (Walk) | Fare imlecini ekrana kilitleme (Pointer Lock) |
| **[E] Tuşu** | Yürüyüş (Walk) | Yakındaki ekipmanı inceleme / Bilgi kartını açıp kapatma |
| **[V] Tuşu** | Yürüyüş (Walk) | Kamera perspektifi değiştirme (1P Birinci Şahıs ↔ 3P Üçüncü Şahıs) |
| **ESC** | Tümü | Açık bilgi kartını kapatma veya fare imlecini serbest bırakma |
| **Sol Tık + Sürükle** | Yörünge (Orbit) | Kule etrafında 360° dönme (Rotate / Tumble) |
| **Sağ Tık + Sürükle** | Yörünge (Orbit) | Kamerayı paralel kaydırma (Pan) |
| **Fare Tekerleği** | Yörünge (Orbit) | Yakınlaşma / Uzaklaşma (Zoom) |
| **Ekipmana Tıkla** | Yörünge (Orbit) | Ekipmana odaklanma ve detaylı bilgi kartını açma |
| **Kamera Butonu** | Üst Menü | Orbit (Serbest Görünüm) ve Walk (Yürüyüş) modları arası geçiş |
| **Pompa Butonu** | Üst Menü | Çamur dolaşım pompalarını ve akış animasyonunu durdurma/başlatma |

---

## 🏗️ Klasör Yapısı Özeti

```text
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages otomatik dağıtım iş akışı
├── src/
│   ├── components/                 # UI ve Saha Bileşenleri
│   │   ├── navigation/             # Yürüyüş HUD, Görev HUD, Karakter & Kontrolcü
│   │   ├── site/                   # Kule zemini, çamur tankları, güvenlik bölgeleri
│   │   ├── EngineeringPanel.tsx    # Mühendislik hesaplamaları arayüzü
│   │   ├── EquipmentPanel.tsx      # Ekipman listesi ve kamera odakları
│   │   ├── InfoCard.tsx            # Teknik ekipman kartı
│   │   ├── InstructorPanel.tsx     # Eğitmen kontrol paneli
│   │   ├── NavigationHeader.tsx    # Üst navigasyon barı
│   │   ├── ProgressPanel.tsx       # Öğrenci ilerleme paneli
│   │   ├── QuizPanel.tsx           # Güvenlik quiz arayüzü
│   │   ├── Rig.tsx                 # 3D Sondaj kulesi ana sahne montajı
│   │   ├── ScenarioPanel.tsx       # Karar motoru arayüzü
│   │   ├── Scene.tsx               # Three.js Canvas & kamera yöneticisi
│   │   ├── SceneEffects.tsx        # Post-processing, sis ve aydınlatma
│   │   └── WellControlPanel.tsx    # Kill sheet arayüzü
│   ├── data/                       # Statik veri setleri (ekipmanlar, quiz, senaryolar)
│   ├── hooks/                      # Özel React hook'ları (useScenarioEngine, useStudentProgress)
│   ├── materials/                  # Prosedürel Three.js materyal kütüphanesi
│   ├── scene/                      # Sahne export modülü
│   ├── simulation/                 # Saf TypeScript simülasyon ve hesaplama motoru
│   │   ├── __tests__/              # Vitest birim testleri (drilling & kill sheet)
│   │   ├── drillingCalculations.ts # Hidrostatik, BHP, ECD, Gradyan formülleri
│   │   ├── killSheetEngine.ts      # IWCF/IADC Kill-Sheet hesaplama motoru
│   │   ├── scenarioEngine.ts       # Dallanan karar ağacı mantığı
│   │   └── types.ts                # Simülasyon veri tipleri
│   ├── utils/                      # Arazi yüksekliği ve çarpışma kontrolü
│   ├── App.tsx                     # Ana uygulama bileşeni
│   ├── index.css                   # Tailwind CSS stilleri
│   ├── main.tsx                    # React DOM giriş noktası
│   └── types.ts                    # Genel uygulama tipleri
├── index.html                      # HTML başlığı, meta etiketleri ve SEO
├── package.json                    # Bağımlılıklar ve npm betikleri
├── tsconfig.json                   # TypeScript yapılandırması
├── vite.config.ts                  # Vite yapılandırması (base: './')
└── README.md                       # Proje dokümantasyonu
```

---

## 🛠️ Kullanılan Teknolojiler

- **Arayüz & Çatı:** [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **3D Render & Grafikler:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Stil & Tasarım:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Derleme & Paketleme:** [Vite 8](https://vitejs.dev/)
- **Test Çerçevesi:** [Vitest](https://vitest.dev/)
- **CI/CD:** GitHub Actions & GitHub Pages

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
- Node.js (v18 veya üzeri) veya Bun

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici-adi/petrosim.git
cd petrosim
```

### 2. Çevre Değişkenleri (.env) Kurulumu
`.env.example` dosyasını referans alarak `.env` dosyanızı oluşturun:
```bash
cp .env.example .env
```

### 3A. npm ile Çalıştırma
```bash
# Bağımlılıkları yükleyin
npm install

# Birim testleri çalıştırın
npm test

# Geliştirme sunucusunu başlatın (port 3000)
npm run dev

# Üretim (production) derlemesi alın
npm run build
```

### 3B. bun ile Çalıştırma
```bash
# Bağımlılıkları yükleyin
bun install

# Birim testleri çalıştırın
bun test

# Geliştirme sunucusunu başlatın
bun run dev

# Üretim derlemesi alın
bun run build
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 🧪 Birim Testleri (Unit Tests)

Petrol mühendisliği hesaplama fonksiyonlarının doğruluğu Vitest ile test edilmektedir:

```bash
npm test
```

Test Kapsamı:
- Hidrostatik Basınç Formülü ($P = 0.052 \times MW \times TVD$)
- Basınç Gradyanı ($G = 0.052 \times MW$)
- Hedef Formasyon Basıncı & Güvenlik Marjı ile Gerekli Çamur Yoğunluğu
- Statik & Dinamik Kuyu Dibi Basıncı (BHP & APL)
- SIDPP üzerinden Formasyon Basıncı ve Kill Mud Weight (KMW)
- Aşırı Denge (Overbalance) / Yetersiz Denge (Underbalance) durum tespitleri
- Eşdeğer Dolaşım Yoğunluğu (ECD)
- IWCF Kill Sheet Motoru (ICP, FCP, MAASP, Gaz/Sıvı akış tespiti, Pabuk Basıncı, Kick Toleransı)

---

## 🗺️ Gelecek Yol Haritası (Roadmap)

- [ ] **Offshore (Deniz) Sondajı Modülü:** Yarı-yarıya batar (Semi-submersible) platformlar, Jack-up kuleleri, denizaltı BOP (Subsea BOP) ve Riser sistemi simülasyonu.
- [ ] **Backend Mimarisi (Java + Spring Boot + PostgreSQL):** 
  - Öğrenci kayıt ve yetkilendirme (JWT Authentication).
  - Gerçek zamanlı sınıf ve eğitmen veri senkronizasyonu.
  - Sınav sonuçları ve kill-sheet ödevlerinin ilişkisel veritabanında saklanması.
- [ ] **Gerçek Zamanlı Çoklu Kullanıcı (Multiplayer Drill Crew):** Sondör (Driller), Çamur Mühendisi ve Kule Sorumlusunun (Toolpusher) aynı kuyuda eşzamanlı çalışabileceği sanal kule operasyonu.
- [ ] **VR (Virtual Reality) Desteği:** WebXR entegrasyonu ile VR gözlük desteği.

---

## 📷 Ekran Görüntüleri & Görseller

<!-- Ekran Görüntüsü Yer Tutucuları -->
| Kule Platformu & Döner Masa | Canlı Kule Telemetrisi & Senaryolar |
| :---: | :---: |
| ![Rig Floor](https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80) | ![Telemetry](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80) |

| IWCF Kill-Sheet Paneli | Eğitmen Portalı & Sınıf Takibi |
| :---: | :---: |
| ![Kill Sheet](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80) | ![Instructor Portal](https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80) |

---

## 🏷️ Önerilen GitHub Konu Etiketleri (Topics)

Deponun bulunabilirliğini artırmak için GitHub repo ayarlarında aşağıdaki konu etiketlerinin eklenmesi önerilir:
`react`, `threejs`, `typescript`, `drilling`, `petroleum-engineering`, `education`, `simulation`

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Eğitim ve akademik amaçlı kullanımlarda serbestçe geliştirilebilir ve paylaşılabilir.
