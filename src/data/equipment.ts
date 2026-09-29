import { EquipmentItem } from '../types';

export const EQUIPMENT_LIST: EquipmentItem[] = [
  {
    id: 'derrick',
    name: 'Derrick (Mast)',
    turkishName: 'Sondaj Kulesi (Derrick/Mast)',
    category: 'hoisting',
    position: [0, 12, 0],
    cameraTarget: [0, 12, 0],
    cameraPosition: [0, 16, 28],
    description: 'The primary load-bearing structural framework supporting the hoisting system, travelling equipment, and drill string handling.',
    technicalSpecs: {
      'Gross Nominal Capacity': '1,000,000 lbs (450 tonnes)',
      'Clear Height': '147 ft (44.8 m)',
      'Base Spread': '30 ft x 30 ft',
      'Wind Load Capacity': '100 knots (full pipe set-back)',
      'API Specification': 'API Spec 4F (4th Edition)'
    },
    workingPrinciple: 'Truss structural design distributing compressive axial loads from the crown block through four main vertical leg columns directly into the rig substructure.',
    drillingRole: 'Provides vertical clearance to hoist and rack 90-ft pipe stands (triples) during trips in and out of the borehole.',
    safetyHazards: [
      'Dropped objects from elevated heights onto the rig floor',
      'High wind loads causing mast deflection or structural stress',
      'Corrosion and fatigue in load-carrying lattice joints'
    ],
    maintenanceChecks: [
      'Daily visual inspection of pins, safety locks, and derrick ladder cages',
      'API 4F Category III & IV non-destructive magnetic particle structural inspections',
      'Crown bumper block alignment and crown safety line integrity'
    ],
    systemConnection: 'Anchored to the Substructure; supports the Crown Block at the water table, Travelling Block via wireline, and Fingerboard at 85 ft.'
  },
  {
    id: 'crown-block',
    name: 'Crown Block',
    turkishName: 'Sabit Makara (Crown Block)',
    category: 'hoisting',
    position: [0, 26.5, 0],
    cameraTarget: [0, 26.5, 0],
    cameraPosition: [0, 28, 8],
    description: 'Fixed assembly of sheaves mounted at the apex of the derrick over which the drilling wireline is reeved to create mechanical advantage.',
    technicalSpecs: {
      'Number of Sheaves': '7 sheaves (including fastline & deadline)',
      'Sheave Diameter': '60 in (1524 mm)',
      'Wireline Diameter': '1-3/8 in (35 mm) EIPS',
      'Max Static Hook Load': '1,000,000 lbs',
      'Lubrication': 'Centralized automatic grease manifold'
    },
    workingPrinciple: 'Acts as the fixed pulley cluster in a compound block-and-tackle system, multiplying hoisting force by the number of active wireline lines reeved (typically 10 or 12 lines).',
    drillingRole: 'Transfers drawworks pull to the travelling block, allowing hundreds of tons of drill string or casing to be lifted with manageable drawworks line tension.',
    safetyHazards: [
      'Severe pinch point hazards during wireline travel',
      'Extreme elevation (140+ ft) working-at-height exposure',
      'Catastrophic sheave groove wear leading to wireline premature fatigue'
    ],
    maintenanceChecks: [
      'API RP 9B sheave groove radius caliper measurement (prevent line flattening)',
      'Bearing temperature monitoring and weekly grease flushing',
      'Crown safety saver limit switch testing before tripping pipe'
    ],
    systemConnection: 'Bolted to derrick water table; reeved with drilling line connected to Drawworks drum and deadline anchor.'
  },
  {
    id: 'travelling-block',
    name: 'Travelling Block & Hook',
    turkishName: 'Hareketli Makara ve Kanca Grubu',
    category: 'hoisting',
    position: [0, 16, 0],
    cameraTarget: [0, 16, 0],
    cameraPosition: [0, 17, 7],
    description: 'The movable pulley block suspended in the derrick that moves vertically between the rig floor and the crown block, supporting the top drive and drill string.',
    technicalSpecs: {
      'Static Capacity': '500 tonnes (1,100,000 lbs)',
      'Number of Sheaves': '6 sheaves matched to crown block',
      'Gross Weight': '32,000 lbs (with integrated adapter)',
      'Speed': 'Up to 350 ft/min hoisting speed'
    },
    workingPrinciple: 'Vertical motion induced by spooling wireline onto or off the drawworks drum. Provides mechanical velocity and force trade-off for controlled pipe raising and lowering.',
    drillingRole: 'Carries the entire suspended weight of drill pipe, drill collars, bit, and hydraulic top drive unit inside the well.',
    safetyHazards: [
      'Crown-out (collision with crown block) if anti-collision limit fails',
      'Floor collision (ramming into rig floor rotary table)',
      'Swing momentum during rough sea heave or rig vibration'
    ],
    maintenanceChecks: [
      'Verify crown-o-matic and floor-saver pneumatic trip levers',
      'Check sheave bearings for axial play and seal leakage',
      'Inspect hook lock mechanism and load links for fatigue cracks'
    ],
    systemConnection: 'Suspended from Crown Block via 12-line drilling rope; directly coupled to the Top Drive and guide rails.'
  },
  {
    id: 'top-drive',
    name: 'Top Drive System (TDS)',
    turkishName: 'Üstten Döndürme Sistemi (Top Drive)',
    category: 'rotating',
    position: [0, 12.5, 0],
    cameraTarget: [0, 12.5, 0],
    cameraPosition: [0, 13, 6],
    description: 'High-torque electric motor unit suspended in the derrick that rotates the drill string directly from the top, replacing traditional rotary tables and kellys.',
    technicalSpecs: {
      'Continuous Torque': '51,000 ft-lbs @ 110 RPM',
      'Breakout Torque': '85,000 ft-lbs',
      'Electric Motor Power': '1,150 HP AC variable frequency drive',
      'Circulation Pressure Rating': '7,500 psi working pressure',
      'Pipe Handling': 'Integrated hydraulic link tilt and pipe handler'
    },
    workingPrinciple: 'AC frequency drive motor converts electrical energy into controlled rotary speed (0-220 RPM) applied directly to the top of the drill pipe, while pumping high-pressure mud through the internal washpipe swivel.',
    drillingRole: 'Rotates the drill string to cut rock, allows back-reaming while tripping out in 90-ft stands, and enables instant circulation during pipe movement to prevent sticking.',
    safetyHazards: [
      'High-pressure mud swivel washpipe failure (7,500 psi jet hazard)',
      'Extreme rotating torque pinch point if personnel enter derrick zone',
      'Guide track derailment or hydraulic hose snags'
    ],
    maintenanceChecks: [
      'Inspect washpipe packing seal leakage rate and replace every 150-200 hours',
      'Check IBOP (Internal Blowout Preventer) remote actuator valve operation',
      'Torque calibration verification on pipe breakout grabber wrench'
    ],
    systemConnection: 'Suspended from Travelling Block; guided by torque track rails; fed mud by Rotary Hose from Standpipe Manifold.'
  },
  {
    id: 'drawworks',
    name: 'Drawworks',
    turkishName: 'Sondaj Vinci (Drawworks)',
    category: 'hoisting',
    position: [0, 3.8, -4.5],
    cameraTarget: [0, 3.8, -4.5],
    cameraPosition: [4, 5, -2],
    description: 'The core hoisting engine containing a grooved spooling drum, disc brakes, and electric motors that reels the drilling wireline in and out.',
    technicalSpecs: {
      'Input Power': '2,000 HP (2 x 1,000 HP AC Motors)',
      'Drum Type': 'Lebus grooved drum for 1-3/8" wireline',
      'Braking System': 'Dual water-cooled disc brakes + regenerative dynamic electric braking',
      'Single Line Pull': '95,000 lbs maximum'
    },
    workingPrinciple: 'Electric motors drive a heavy cylindrical drum via planetary reduction gears. Controlled motor direction and regenerative braking enable millimeter-precision string positioning.',
    drillingRole: 'Controls hook load, lowers the drill bit into contact with rock under controlled Weight on Bit (WOB), and pulls heavy pipe stands during round trips.',
    safetyHazards: [
      'Brake failure causing runaway free-fall of drill string',
      'Improper wireline wrap overlapping or crushing on the drum',
      'Severe pinch point hazards near rotating spool drum'
    ],
    maintenanceChecks: [
      'Inspect disc brake pad thickness and hydraulic actuator pressure daily',
      'Measure wireline ton-miles and perform slip-and-cut cycle per API RP 9B',
      'Test emergency auxiliary brake cutoff circuit'
    ],
    systemConnection: 'Mounted on rig floor or lower substructure; connected to Crown Block via fastline and Deadline Anchor via deadline.'
  },
  {
    id: 'drill-string',
    name: 'Drill String & Rotary Table',
    turkishName: 'Sondaj Dizisi ve Döner Masa',
    category: 'rotating',
    position: [0, 2.5, 0],
    cameraTarget: [0, 1.5, 0],
    cameraPosition: [2.5, 3.5, 3],
    description: 'The assembly of drill pipe, heavy-weight drill pipe, drill collars, bottom-hole assembly (BHA), and the rotary table slip bowl on the rig floor.',
    technicalSpecs: {
      'Drill Pipe Spec': '5 in OD, S-135 grade, NC50 connections, 19.5 lb/ft',
      'Drill Collar Size': '8 in OD x 2-13/16 in ID spiral collars (147 lb/ft)',
      'Rotary Table Diameter': '37.5 in with master bushings',
      'Tensile Yield Capacity': '712,000 lbs (Class 1)',
      'Torsional Yield': '63,000 ft-lbs'
    },
    workingPrinciple: 'Transfers rotational torque and axial weight down to the bit, provides hydraulic conduit for drilling fluid, and allows borehole survey tools (MWD/LWD) to send telemetry pulses to surface.',
    drillingRole: 'Penetrates geological formations, transfers drill bit weight (WOB), and delivers high-velocity hydraulic mud jets to clean the rock face and flush cuttings upwards.',
    safetyHazards: [
      'Pipe twist-off or washout under high cyclic bending and fatigue',
      'Pinch/crush hazards on rig floor during pipe connection and slip setting',
      'Stored torque recoil when breaking tight tool joints'
    ],
    maintenanceChecks: [
      'Full-length electromagnetic inspection (EMI) for wall thinning & fatigue cracks',
      'Tool joint thread and shoulder profile visual check and API thread dope application',
      'Check rotary slip die inserts for wear to prevent pipe gouging'
    ],
    systemConnection: 'Coupled to Top Drive quill; passes through Rotary Table slips, Bell Nipple, BOP stack, Casing, and deep wellbore.'
  },
  {
    id: 'bop-stack',
    name: 'Blowout Preventer (BOP Stack)',
    turkishName: 'Kuyu Başı Emniyet Vanası (BOP Grubu)',
    category: 'wellcontrol',
    position: [0, -1.2, 0],
    cameraTarget: [0, -1.2, 0],
    cameraPosition: [3.5, 0.5, 3.5],
    description: 'Specialized high-pressure safety valve stack mounted on top of the wellhead casing under the rig floor, capable of sealing the well during a high-pressure gas or fluid kick.',
    technicalSpecs: {
      'Working Pressure Rating': '10,000 psi (68.9 MPa) WP',
      'Bore Diameter': '13-5/8 in (346 mm)',
      'Configuration': 'Annular Preventer (top) + Blind Shear Ram + Variable Bore Pipe Ram (VBR)',
      'Control System': '3,000 psi hydraulic accumulator unit (Koomey Unit)',
      'API Standard': 'API Spec 16A and API Standard 53'
    },
    workingPrinciple: 'Hydraulic pistons drive reinforced elastomer packing elements or forged steel ram blades across the wellbore to isolate formation pressure from the atmosphere within seconds.',
    drillingRole: 'Primary defense against catastrophic blowouts. Closes around drill pipe (annular or pipe ram) or completely shears the pipe (shear ram) during severe kicks to shut in the well.',
    safetyHazards: [
      'Catastrophic blowout if valves fail under unexpected formation kick',
      'High-pressure accumulator hydraulic lines pinhole leaks',
      'Erosion by abrasive sand/gas during well kill circulation'
    ],
    maintenanceChecks: [
      'Daily function test of pipe rams and annular preventer',
      'Bi-weekly low-pressure (250-350 psi) and high-pressure (10,000 psi) hydrostatic stump tests',
      'Koomey accumulator bottle nitrogen pre-charge pressure verification (1,000 psi ± 10%)'
    ],
    systemConnection: 'Mounted on wellhead casing spool; connected to Choke Line manifold, Kill Line pumps, and Koomey hydraulic remote panels.'
  },
  {
    id: 'mud-pumps',
    name: 'Triplex Mud Pumps',
    turkishName: 'Üç Silindirli Çamur Pompaları (Triplex Mud Pumps)',
    category: 'circulating',
    position: [-10, 1.6, -1],
    cameraTarget: [-10, 1.6, -1],
    cameraPosition: [-7, 3.5, 5],
    description: 'Heavy-duty reciprocating positive-displacement pumps that inject high-pressure drilling mud down the standpipe, through the drill string, and out the bit nozzles.',
    technicalSpecs: {
      'Configuration': 'Triplex (3 single-acting horizontal pistons)',
      'Rated Power': '1,600 HP (1,193 kW) per pump',
      'Max Working Pressure': '5,000 to 7,500 psi (with 6" liners)',
      'Max Flow Rate': '680 gpm (2,574 l/min) per pump',
      'Pulsation Dampener': 'Nitrogen bladder dampener charged to 600 psi'
    },
    workingPrinciple: 'Electric motors turn a crankshaft reciprocating three ceramic-lined pistons. Unidirectional suction and discharge valves pump a fixed volume of mud per stroke regardless of resistance.',
    drillingRole: 'Generates circulation velocity to lift heavy drill cuttings up the annulus, cools the drill bit, drives downhole mud motors, and maintains bottom-hole overbalance.',
    safetyHazards: [
      'Extreme high pressure (5,000+ psi) pipe rupture risk',
      'Over-pressurization if shear relief valve is blocked or improperly pinned',
      'Pulsation line vibration leading to weld fatigue failure'
    ],
    maintenanceChecks: [
      'Inspect piston rubber cups and ceramic cylinder liners for scoring',
      'Verify discharge pressure relief valve shear pin rating (never exceed rated WP)',
      'Check nitrogen pre-charge in pulsation dampeners with calibrated gauge'
    ],
    systemConnection: 'Draws mud from Suction Tank; discharges into high-pressure Standpipe Manifold line to rig floor.'
  },
  {
    id: 'mud-tanks',
    name: 'Mud Tanks & Agitators',
    turkishName: 'Çamur Tankları ve Karıştırıcılar',
    category: 'circulating',
    position: [-9, 0.9, 6.5],
    cameraTarget: [-9, 0.9, 6.5],
    cameraPosition: [-4, 3.5, 10],
    description: 'Compartmentalized steel tanks holding active, reserve, and suction volumes of weighted drilling fluid, equipped with mechanical paddle agitators.',
    technicalSpecs: {
      'Total Capacity': '1,800 bbls (286 m³ across 4 tanks)',
      'Compartments': 'Shaker tank, Degasser tank, Desander/Desilter tank, Suction tank, Pill tank',
      'Agitator Power': '15 HP explosion-proof electric drive motors',
      'Level Sensors': 'Ultrasonic PVT (Pit Volume Totalizer) continuous level transducers'
    },
    workingPrinciple: 'Mud flows sequentially through solids control cleaning compartments into the final suction pit. Mechanical impellers keep heavy weighting agents (barite) in suspension.',
    drillingRole: 'Stores fluid, allows chemical treatment (viscosifiers, fluid loss additives, pH control), and serves as the primary kick detection tool via pit volume tracking.',
    safetyHazards: [
      'Toxic H2S gas accumulation in enclosed tank vapor spaces',
      'Slip/fall into deep open mud pits containing heavy drilling slurry',
      'Barite settling (barite sag) causing sudden loss of hydrostatic head'
    ],
    maintenanceChecks: [
      'Calibrate ultrasonic pit volume sensors daily against manual gauge tape',
      'Clean settled sand and solids from compartment bottoms during each casing run',
      'Check agitator shaft seals and gearbox oil levels'
    ],
    systemConnection: 'Receives cleaned mud from Shale Shakers; connects to Mud Pump suction manifolds; monitored by Mud Logging unit.'
  },
  {
    id: 'shale-shakers',
    name: 'Shale Shakers',
    turkishName: 'Titreşimli Elekler (Shale Shakers)',
    category: 'circulating',
    position: [-8.5, 2.2, 12],
    cameraTarget: [-8.5, 2.2, 12],
    cameraPosition: [-5, 4, 15],
    description: 'High-G vibrating screen separators that represent the first and most critical stage of solids removal, separating drill cuttings from the returning mud flow.',
    technicalSpecs: {
      'Vibrational Motion': 'Linear motion or balanced elliptical (up to 7.5 G acceleration)',
      'Screen Mesh Size': 'API 80 to API 230 composite mesh screens',
      'Throughput Capacity': 'Up to 900 gpm per shaker unit (3 shakers installed)',
      'Vibrator Motors': '2 x 2.5 HP dual explosion-proof vibrator motors'
    },
    workingPrinciple: 'High-frequency vibratory G-forces accelerate fluid through fine mesh screens into the collection ditch below, while oversized rock fragments are thrown off the discharge end into the cuttings ditch.',
    drillingRole: 'Removes formation cuttings before they can be recirculated and erode pumps, nozzles, and reduce penetration rate; first site where geologists inspect drill cuttings.',
    safetyHazards: [
      'H2S gas release from drilled gas bubbles breaking across vibrating screens',
      'High noise levels and vibration fatigue',
      'Chemical splash from hot synthetic-base mud or oil-base mud (OBM)'
    ],
    maintenanceChecks: [
      'Check screen cloth tensioning and look for tears/holes every 2 hours',
      'Inspect rubber support channel buffers and motor hold-down bolts',
      'Ensure explosion-proof exhaust hoods and H2S detector sensors are active'
    ],
    systemConnection: 'Connected directly to Flowline (Possom Belly) coming from the wellbore bell nipple; discharges into Mud Tank #1 and Cuttings Augers.'
  },
  {
    id: 'generators',
    name: 'Diesel Power Generator Skid',
    turkishName: 'Dizel Jeneratör Güç Ünitesi',
    category: 'power',
    position: [11, 1.2, -6],
    cameraTarget: [11, 1.2, -6],
    cameraPosition: [8, 3, -1],
    description: 'Heavy industrial diesel generator plant paired with an SCR (Silicon Controlled Rectifier) or VFD house, delivering all electrical power for rig systems.',
    technicalSpecs: {
      'Engine Model': '3 x Caterpillar 3512B / 3516 diesel engines',
      'Continuous Output': '3 x 1,475 kVA @ 600V, 60 Hz (Total ~4.4 MW)',
      'Fuel Consumption': 'Approx. 85 gal/hr per engine at 80% load',
      'Emissions Control': 'Equipped with hospital-grade silencers and spark arrestors'
    },
    workingPrinciple: 'Turbocharged diesel engines drive synchronous alternators generating 600V 3-phase AC. The VFD/SCR switchgear rectifies and modulates this power to run variable speed motors on pumps, drawworks, and top drive.',
    drillingRole: 'Powers the entire drilling operation, mud pumps, top drive, air compressors, explosion-proof lighting, and life support systems.',
    safetyHazards: [
      'High voltage electrical hazard (600V switchgear and 480V distribution)',
      'Fire hazard from hot exhaust manifolds and diesel fuel leaks',
      'Engine overspeed/runaway if gas cloud is sucked into air intake'
    ],
    maintenanceChecks: [
      'Test emergency air intake shut-off valves (Rig Saver valves) weekly',
      'Verify insulation resistance (megger test) on main generator windings',
      'Check fuel water-separator filters and cooling radiator heat exchangers'
    ],
    systemConnection: 'Feeds SCR/VFD Power Control House; supplies power cables to Drawworks, Mud Pumps, Top Drive, and Camp.'
  },
  {
    id: 'mud-logging',
    name: 'Mud Logging Cabin',
    turkishName: 'Çamur Kayıt Kabini (Mud Logging Unit)',
    category: 'monitoring',
    position: [9, 1.4, 3],
    cameraTarget: [9, 1.4, 3],
    cameraPosition: [6, 2.8, 6],
    description: 'Pressurized instrumentation cabin where mud loggers monitor real-time drilling parameters, chromatograph hydrocarbon gas levels, and analyze lithology cuttings.',
    technicalSpecs: {
      'Gas Detection': 'FID (Flame Ionization Detector) + Total Hydrocarbon Analyzer',
      'Chromatograph Cycle': 'Methane (C1) to Pentane (C5) analysis every 30 seconds',
      'Telemetry Sensors': 'Pit volume, pump strokes, standpipe pressure, torque, hookload, ROP, gas in/out',
      'Cabin Atmosphere': 'Class 1 Div 2 positive-pressure purge system with auto-alarm'
    },
    workingPrinciple: 'A continuous gas trap agitator at the shaker flowline extracts dissolved gases from return mud. Gas is pulled via vacuum line into gas detectors while drill sensors stream to digital logs.',
    drillingRole: 'Crucial early warning for formation kicks, geopressure detection, reservoir gas presence, and real-time geological formation evaluation.',
    safetyHazards: [
      'Toxic gas ingress if positive-pressure ventilation system trips',
      'Hydrogen fuel cylinder storage for FID gas chromatographs',
      'Hazardous zone sensor electrical faults'
    ],
    maintenanceChecks: [
      'Calibrate FID and infrared gas detectors daily with certified calibration gas mixtures',
      'Clean gas sample suction line moisture traps and vacuum pump diaphragms',
      'Verify audio/visual H2S external beacon alarms'
    ],
    systemConnection: 'Connected by sensor cables to Flowline gas trap, Pit sensors, Standpipe transducer, and Rig Floor Driller console.'
  },
  {
    id: 'company-man',
    name: 'Company Man & Toolpusher Office',
    turkishName: 'Şirket Temsilcisi ve Sondör Amiri Ofisi',
    category: 'surface',
    position: [9.5, 1.4, 9.5],
    cameraTarget: [9.5, 1.4, 9.5],
    cameraPosition: [6.5, 2.8, 13],
    description: 'On-site supervisory command trailer housing the operating oil company representative (Company Man) and drilling contractor superintendent (Toolpusher).',
    technicalSpecs: {
      'Communications': 'Real-time satellite link (VSAT) sending daily drilling reports (DDR)',
      'Display Systems': 'Dual 55-inch real-time rig telemetry and geosteering monitors',
      'Safety': 'Equipped with emergency rig shut-down (ESD) push button and muster radios'
    },
    workingPrinciple: 'Central operational decision node where drilling programs, bit records, casing designs, and cost tracking are managed in direct coordination with company headquarters.',
    drillingRole: 'Oversees safety compliance, verifies well control calculations, authorizes drilling decisions, and manages vendor services.',
    safetyHazards: [
      'Mustering communication failure during rig site emergencies',
      'Radio frequency interference during explosive perforating operations'
    ],
    maintenanceChecks: [
      'Verify satellite communications redundancy and uninterrupted power supply (UPS)',
      'Check emergency evacuation maps and radio battery charging stations'
    ],
    systemConnection: 'Linked via network fiber to Mud Logging cabin, Driller console, and Operator HQ remote operations center.'
  },
  {
    id: 'waste-pit',
    name: 'Reserve Waste Pit & Flare Line',
    turkishName: 'Atık Çukuru ve Meşale Hattı',
    category: 'surface',
    position: [-13, 0.2, -9],
    cameraTarget: [-13, 0.2, -9],
    cameraPosition: [-9, 2.5, -4],
    description: 'Engineered containment pit lined with high-density polyethylene (HDPE) geofilm for temporary drill cuttings and waste mud, situated downwind beside the emergency flare igniter.',
    technicalSpecs: {
      'Liner Spec': '60-mil double HDPE synthetic geomembrane with leak detection layer',
      'Containment Volume': '12,000 bbls emergency catchment capacity',
      'Flare Line': '6 in nominal diameter line leading to high-pressure electronic igniter flare'
    },
    workingPrinciple: 'Safely stores drill cuttings separated from synthetic or water-based mud for drying and off-site disposal, while providing safe discharge distance for emergency gas flaring.',
    drillingRole: 'Protects surrounding soil and groundwater tables from chemical contamination; burns emergency gas venting from the mud-gas separator (poor boy degasser).',
    safetyHazards: [
      'Spontaneous combustion of gas plumes at the flare tip in shifting winds',
      'Pond drowning or toxic slurry exposure',
      'Environmental liner punctures causing subsurface aquifer contamination'
    ],
    maintenanceChecks: [
      'Monitor groundwater test wells around pit perimeter weekly',
      'Inspect flare pilot automatic ignition spark igniters and propane supply bottles',
      'Check berm integrity and freeboard water level height'
    ],
    systemConnection: 'Connected to Mud-Gas Separator (Poor Boy) gas vent line and Choke Manifold emergency dump line.'
  },
  {
    id: 'choke-manifold',
    name: 'Choke Manifold & Standpipe',
    turkishName: 'Choke Manifoldu ve Standpipe Hattı',
    category: 'wellcontrol',
    position: [3.8, 1.2, 0.5],
    cameraTarget: [3.8, 1.2, 0.5],
    cameraPosition: [6, 2.5, 3],
    description: 'Array of high-pressure control valves, adjustable chokes, and hydraulic chokes used to safely circulate out high-pressure gas kicks and regulate bottom-hole backpressure.',
    technicalSpecs: {
      'Pressure Rating': '10,000 psi WP (tested to 15,000 psi)',
      'Chokes': '1 x Manual needle choke + 1 x Hydraulic remote console choke (Super Choke)',
      'Valves': 'API 6A gate valves with tungsten carbide trims to resist sand erosion'
    },
    workingPrinciple: 'By incrementally constricting or opening the choke orifice, the operator exerts calibrated backpressure on the wellbore annulus while circulating kill mud into the hole.',
    drillingRole: 'Crucial equipment during Well Control operations (Wait & Weight or Drillers Method) to keep constant bottom-hole pressure above formation pressure while venting gas.',
    safetyHazards: [
      'Choke washout or blockage by cuttings leading to sudden pressure spike or burst',
      'High-velocity gas erosion creating severe washouts on manifold elbows'
    ],
    maintenanceChecks: [
      'Test hydraulic remote choke actuator response time from driller console',
      'Perform ultrasonic wall thickness testing on erosion-prone downstream bends',
      'Verify calibrated digital and hydraulic pressure gauges for drill pipe and casing'
    ],
    systemConnection: 'Receives mud from BOP stack choke line; routes gas-cut mud to Mud-Gas Separator or Waste Pit flare.'
  },
  {
    id: 'catwalk-piperacks',
    name: 'Catwalk & Pipe Racks',
    turkishName: 'Catwalk ve Boru Sahası (Pipe Racks)',
    category: 'hoisting',
    position: [0, -1.2, 18],
    cameraTarget: [0, 0, 18],
    cameraPosition: [12, 6, 26],
    description: 'Elevated staging runway and triangular steel bolsters flanking the rig front, used for storing, inspecting, and transferring drill pipes and casing stands to the rig floor via the V-Door.',
    technicalSpecs: {
      'Catwalk Length': '55 ft (16.8 m) with automated skate trough',
      'Pipe Rack Capacity': 'Up to 180,000 lbs (80 tonnes) per side',
      'Supported Tubulars': 'Drill Pipe (3-1/2" to 5-1/2"), Drill Collars, Casing up to 20" OD',
      'Safety Standard': 'API RP 54 (Occupational Safety for Oil & Gas Well Drilling)'
    },
    workingPrinciple: 'Tubulars are staged horizontally on timber-spaced tiers. Hydraulic pipe pushers or cranes roll joints onto the catwalk skate, which elevates and propels them up the sloped V-Door ramp directly to the rig floor elevator.',
    drillingRole: 'Ensures safe, organized tubular inventory management and high-speed pipe feeding during casing runs and drilling trips.',
    safetyHazards: [
      'Uncontrolled rolling of heavy drill pipes causing crush or amputation injuries',
      'Pinch points along automated catwalk skate track',
      'Slips, trips, and falls from elevated catwalk grating without safety harness'
    ],
    maintenanceChecks: [
      'Inspect timber spacers and end-stop safety pins on every rack bolster daily',
      'Check catwalk skate winch cable for fraying or broken strands',
      'Test emergency stop (E-stop) trip cords along both catwalk walkways'
    ],
    systemConnection: 'Connects directly to the Rig Floor via the sloped V-Door ramp and V-Door safety barrier.'
  },
  {
    id: 'doghouse',
    name: "Doghouse (Driller's Cabin)",
    turkishName: 'Sondör Kabini (Doghouse)',
    category: 'monitoring',
    position: [3.1, 4.8, -2.1],
    cameraTarget: [3.1, 4.8, -2.1],
    cameraPosition: [6.5, 7.0, 1.5],
    description: 'Sound-insulated, climate-controlled command cabin on the rig floor housing the driller ergonomic cyber-chair, digital instrumentation joysticks, and rig automation controls.',
    technicalSpecs: {
      'Purge Rating': 'Class 1 Division 1 / Zone 1 explosion-proof pressurized cabin',
      'Viewing Glass': 'Laminated ballistic high-impact polycarbonate glass',
      'Instrumentation': 'Touchscreen SCADA, cyber-chair dual joysticks, digital choke controls',
      'Emergency Controls': 'Direct Emergency Rig Shut Down (ESD) and Crown-o-matic override'
    },
    workingPrinciple: 'The driller operates all drilling functions (drawworks hoisting, top drive rotation, pump strokes, auto-driller WOB) via digital joystick signals through a programmable logic controller (PLC).',
    drillingRole: 'Central nervous system of the drilling rig. The driller monitors live downhole telemetry (WOB, RPM, ROP, Standpipe Pressure, Torque, Flow Out) and responds immediately to well kicks or formation changes.',
    safetyHazards: [
      'Loss of cabin positive pressure purge allowing flammable vapors inside',
      'Distracted operation leading to downhole or floor collision incidents',
      'Ergonomic operator fatigue during long 12-hour drilling tours'
    ],
    maintenanceChecks: [
      'Verify cabin positive pressure sensor differential and alarm horns daily',
      'Calibrate driller console touchscreen and joystick dead-band centers weekly',
      'Inspect emergency escape secondary exit door and quick-release latch'
    ],
    systemConnection: 'Mounted on rig floor deck; communicates via industrial fieldbus to VFD House, Top Drive, Drawworks, and Mud Pumps.'
  },
  {
    id: 'poor-boy-degasser',
    name: 'Mud-Gas Separator (Poor Boy Degasser)',
    turkishName: 'Çamur-Gaz Ayırıcısı (Poor Boy Degasser)',
    category: 'wellcontrol',
    position: [-6.2, 3.6, 3.8],
    cameraTarget: [-6.2, 3.6, 3.8],
    cameraPosition: [-2.5, 5.5, 8.5],
    description: 'Vertical atmospheric separation vessel containing internal baffle plates, designed to separate large volumes of free formation gas from drilling mud during a well control kick circulation.',
    technicalSpecs: {
      'Vessel Dimensions': '48 in OD x 22 ft height (1.2 m x 6.7 m)',
      'Gas Handling Capacity': 'Up to 25 MMSCFD (million standard cubic feet per day)',
      'Liquid Mud Throughput': 'Up to 1,000 gpm (3,785 l/min)',
      'Liquid Seal Height': '10 ft (3.05 m) U-tube hydrostatic leg (approx. 5-7 psi backpressure)'
    },
    workingPrinciple: 'Gas-cut mud from the choke manifold enters tangentially. Mud cascades downward across internal baffle plates, breaking gas bubbles. Gas rises into the top vent stack, while degassed mud exits via the liquid U-tube seal loop to the shale shakers.',
    drillingRole: 'Vital well control barrier. Prevents toxic and flammable gas from flooding the mud pits and shale shakers during gas kick circulation using the Driller or Wait & Weight method.',
    safetyHazards: [
      'Gas blow-by: If gas pressure exceeds the mud U-tube hydrostatic seal, gas blows into the mud pits',
      'Freezing/hydrate formation in the gas vent line in cold weather operations',
      'Internal baffle plate erosion from high-velocity sand and gas mixtures'
    ],
    maintenanceChecks: [
      'Check liquid seal U-tube mud level and ensure clean mud is maintained inside leg',
      'Ultrasonic wall thickness measurement on inlet target baffle and top elbow',
      'Verify flame arrester and purge valve on the overhead gas vent line'
    ],
    systemConnection: 'Fed by high-pressure line from Choke Manifold; discharges gas to Flare Line / Vent Stack, and mud to Shale Shaker header box.'
  },
  {
    id: 'muster-point',
    name: 'Emergency Muster Point & Safety Station',
    turkishName: 'Acil Durum Toplanma Noktası ve Güvenlik İstasyonu',
    category: 'surface',
    position: [14, -0.2, 14],
    cameraTarget: [14, -0.2, 14],
    cameraPosition: [18, 3.0, 20],
    description: 'Designated safe assembly area upwind of the drilling rig, equipped with emergency alarms, muster roll board, explosion-proof radios, and life-safety equipment.',
    technicalSpecs: {
      'Signage Standard': 'ISO 7010-E007 Emergency Muster Station',
      'Orientation': 'Positioned upwind based on prevailing winds and real-time windsock direction',
      'Safety Gear': 'Emergency breathing apparatus (SCBA cascade), loudhailer, muster roll sheet',
      'Alarm Beacon': 'Audible siren (120 dB) paired with flashing green/amber beacon'
    },
    workingPrinciple: 'Upon hearing continuous general emergency or H2S horns, all non-essential personnel immediately cease operations, note the windsock direction, and assemble here for headcount verification.',
    drillingRole: 'Preserves life and accountability during catastrophic rig emergencies including well kicks, H2S gas release, structural failure, or fire.',
    safetyHazards: [
      'Downwind gas drift if personnel choose a muster station incorrect for current wind direction',
      'Panic or bottlenecking along egress stairways and walkways during blackouts',
      'Missing muster personnel unaccounted for in hazardous red zones'
    ],
    maintenanceChecks: [
      'Conduct weekly scheduled and unannounced rig emergency muster drills',
      'Inspect SCBA cylinder pressures (minimum 2,216 or 4,500 psi) and mask seal integrity',
      'Test emergency beacon siren batteries and solar backup charging system'
    ],
    systemConnection: 'Linked to Rig Public Address (PA) system, ESD sirens, and Company Man emergency dispatch.'
  }
];
