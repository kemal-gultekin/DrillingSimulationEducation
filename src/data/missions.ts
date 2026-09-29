import { GuidedMission } from '../types';

export const GUIDED_MISSIONS: GuidedMission[] = [
  {
    id: 'mission-bop',
    stepNumber: 1,
    title: 'Find the BOP Stack & Wellhead',
    turkishTitle: 'BOP Kuyu Kontrol Ünitesini ve Kuyu Başını Bul',
    targetEquipmentId: 'bop-stack',
    instruction: 'Walk towards the center of the rig substructure to locate the Blowout Preventer (BOP Stack) positioned over the wellhead cellar.',
    turkishInstruction: 'Kule platformunun altındaki kuyu başına (BOP Cellar) ilerleyin ve Blowout Preventer yığınını bulun.',
    hint: 'Located at ground center directly below the rig floor. Walk close and press [E] to inspect.',
    turkishHint: 'Platformun tam altındaki kuyu başı çukurundadır. Yaklaşıp [E] tuşu ile inceleyin.'
  },
  {
    id: 'mission-mud-pumps',
    stepNumber: 2,
    title: 'Go to the Mud Pumps',
    turkishTitle: 'Çamur Pompalarına Git',
    targetEquipmentId: 'mud-pumps',
    instruction: 'Head west from the wellhead to locate the high-pressure Triplex Mud Pumps that circulate drilling fluid through the wellbore.',
    turkishInstruction: 'Kuyu başından batı yönüne doğru ilerleyin ve sondaj çamurunu kuyuya basan yüksek basınçlı tripleks çamur pompalarını bulun.',
    hint: 'Look for the large dark green pump skid with electric drive motors and pulsation dampeners.',
    turkishHint: 'Kulenin batısındaki elektrik motorlu ve basınç sönümleyicili yeşil pompa ünitesidir.'
  },
  {
    id: 'mission-shale-shakers',
    stepNumber: 3,
    title: 'Locate the Shale Shakers',
    turkishTitle: 'Shale Shaker Titreşimli Elekleri Bul',
    targetEquipmentId: 'shale-shakers',
    instruction: 'Walk along the mud processing tank line to inspect the vibrating shale shaker screens where rock cuttings are separated from mud.',
    turkishInstruction: 'Çamur tankları hattı boyunca yürüyerek kuyudan dönen kırıntıları sıvıdan ayıran titreşimli elekleri (shale shakers) inceleyin.',
    hint: 'Elevated on top of the mud pits, north of the pumps. Walk up and press [E] to inspect.',
    turkishHint: 'Çamur tanklarının üzerinde yer alan titreşimli elek ünitesidir. Yaklaşıp [E] ile inceleyin.'
  },
  {
    id: 'mission-poor-boy',
    stepNumber: 4,
    title: 'Inspect the Mud-Gas Separator',
    turkishTitle: 'Çamur-Gaz Seperatörünü (Poor Boy) İncele',
    targetEquipmentId: 'poor-boy-degasser',
    instruction: 'Locate the vertical Poor Boy Degasser tower designed to safely separate and vent free formation gas during well control.',
    turkishInstruction: 'Kuyu kontrolü sırasında sondaj çamurundaki serbest gazı güvenle ayıran dikey Poor Boy degasser kulesini bulun.',
    hint: 'The tall vertical cylindrical vessel standing next to the shale shaker possum belly.',
    turkishHint: 'Shale shaker girişinin yanında yükselen dikey silindirik tanktır.'
  },
  {
    id: 'mission-drill-string',
    stepNumber: 5,
    title: 'Climb to Rig Floor & Inspect the Drill String',
    turkishTitle: 'Kule Platformuna Çık ve Sondaj Dizisini İncele',
    targetEquipmentId: 'drill-string',
    instruction: 'Use the access stairs or the V-door ramp to climb up to the elevated Rig Floor (+3.5m) and inspect the drill string & rotary table.',
    turkishInstruction: 'Merdivenleri veya V-door rampasını kullanarak kule platformuna (+3.5m) çıkın; döner masa ve sondaj dizisini inceleyin.',
    hint: 'Walk up the ramp or stairs to deck elevation, approach the rotary table at the center, and press [E].',
    turkishHint: 'Rampa veya merdivenle platforma çıkın, merkezdeki döner masaya yaklaşıp [E] tuşuna basın.'
  },
  {
    id: 'mission-doghouse',
    stepNumber: 6,
    title: 'Visit the Driller Doghouse',
    turkishTitle: 'Driller Kabini (Doghouse) Ziyareti',
    targetEquipmentId: 'doghouse',
    instruction: 'While on the rig floor, enter or approach the Driller Doghouse cabin where telemetry displays and drilling controls are housed.',
    turkishInstruction: 'Kule platformundayken, telemetri ekranları ve sondaj kumanda masasının bulunduğu driller kabinine (Doghouse) yaklaşın.',
    hint: 'The enclosed control cabin situated directly on the rig floor adjacent to the drawworks.',
    turkishHint: 'Platform üzerinde drawworks vinç sisteminin hemen yanındaki kontrol kabinidir.'
  },
  {
    id: 'mission-catwalk',
    stepNumber: 7,
    title: 'Check the Catwalk & Pipe Racks',
    turkishTitle: 'Catwalk ve Boru Raflarını İncele',
    targetEquipmentId: 'catwalk-piperacks',
    instruction: 'Descend via the V-door ramp to the long horizontal catwalk where drill pipe and casing stands are prepared before hoisting.',
    turkishInstruction: 'V-door rampasından inerek sondaj ve muhafaza borularının kuleye verilmeden önce hazırlandığı uzun catwalk platformunu inceleyin.',
    hint: 'Extends to the south of the rig floor with triangular pipe racks on both sides.',
    turkishHint: 'Kulenin güneyine doğru uzanan uzun yatay çelik yol ve iki yanındaki boru sehpalarıdır.'
  },
  {
    id: 'mission-muster-point',
    stepNumber: 8,
    title: 'Find the Emergency Muster Point',
    turkishTitle: 'Acil Durum Toplanma Noktası (Muster Point) Bul',
    targetEquipmentId: 'muster-point',
    instruction: 'Walk towards the safe southeastern perimeter to identify the designated Emergency Muster Point, windsock, and decontamination station.',
    turkishInstruction: 'Sahanın güneydoğu sınırındaki acil toplanma noktası, rüzgâr gülü ve acil boy/göz duşu istasyonuna gidin.',
    hint: 'Look for the green and white Muster Point sign and orange windsock on the southeastern gravel boundary.',
    turkishHint: 'Güneydoğu çevre sınırındaki yeşil-beyaz toplanma levhası ve turuncu rüzgâr tulumuna gidin.'
  }
];
