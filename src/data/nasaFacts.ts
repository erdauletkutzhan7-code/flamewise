// Sourced NASA Experiment Facts, Ranges & Evidence Records
// Sourced strictly from NASA PSI, NTRS, and Glenn Research Center

export interface ScientificFact {
  id: string
  experiment: string
  subInvestigation?: string
  topic: string
  headline: string
  detail: string
  statedUnit?: string
  rangeMin?: number
  rangeMax?: number
  unitLabel?: string
  secondaryNote?: string
  evidenceType: 'measured result' | 'test setting' | 'experiment count' | 'source summary'
  sourceUrl: string
  sourceTitle: string
  limitations: string
}

export const NASA_SCIENTIFIC_FACTS: ScientificFact[] = [
  {
    id: 'fact-acme-cld',
    experiment: 'ACME',
    subInvestigation: 'CLD Flame (Coflow Laminar Diffusion Flame)',
    topic: 'Soot Comparison',
    headline: '5–8×',
    detail: 'NASA NTRS reports sooty microgravity flames had 5–8× more soot than equivalent 1g flames in the cited CLD Flame work.',
    rangeMin: 5,
    rangeMax: 8,
    unitLabel: '× soot ratio',
    evidenceType: 'measured result',
    sourceUrl: 'https://ntrs.nasa.gov/api/citations/20220007191/downloads/ACME%20CSSCI%2020220509.pdf',
    sourceTitle: 'NASA NTRS · ACME CSSCI Results',
    limitations: 'Limited strictly to the cited CLD Flame investigation; not a universal soot ratio for all ACME flames or fuels.'
  },
  {
    id: 'fact-bass-airflow',
    experiment: 'BASS / BASS-II',
    topic: 'Forced Air Velocity Range',
    headline: '5–50 cm/s',
    detail: 'Supplied experimental test range for forced airflow inside the Microgravity Science Glovebox. Nitrogen coflow: 0–500 cm³/min.',
    rangeMin: 5,
    rangeMax: 50,
    unitLabel: 'cm/s airflow',
    secondaryNote: 'Nitrogen flow setting: 0–500 cm³/min',
    evidenceType: 'test setting',
    sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2025/07/burning-and-suppression-of-solids-bass.pdf',
    sourceTitle: 'NASA BASS Factsheet',
    limitations: 'Represents flow chamber operational envelope; does not imply real cabin drafts always fall within this range.'
  },
  {
    id: 'fact-bass-ii-samples',
    experiment: 'BASS-II',
    topic: 'Sample Count',
    headline: '100 samples',
    detail: 'NASA PSI record documents approx. 100 fuel samples prepared and burned under varying oxygen and flow regimes.',
    rangeMin: 0,
    rangeMax: 100,
    unitLabel: 'samples',
    evidenceType: 'experiment count',
    sourceUrl: 'https://psi.nasa.gov/physci/repo/data/investigations/PSI-25',
    sourceTitle: 'NASA PSI-25 · BASS-II Investigation',
    limitations: 'Experiment sample inventory; not a measured physical quantity.'
  },
  {
    id: 'fact-saffire-airflow',
    experiment: 'Saffire-I',
    topic: 'Test Tunnel Airflow & Sample Size',
    headline: '0.94 × 0.4 m · 20 cm/s',
    detail: 'Nominal tunnel flow velocity in Saffire-I large-scale burn (0.94 m × 0.4 m SIBAL fabric sample, verified per NASA NTRS 20140011433) inside the Cygnus vehicle.',
    rangeMin: 20,
    rangeMax: 20,
    unitLabel: 'cm/s nominal',
    secondaryNote: 'Verified sample dimensions: 0.94 m × 0.4 m SIBAL fabric',
    evidenceType: 'test setting',
    sourceUrl: 'https://ntrs.nasa.gov/api/citations/20140011433/downloads/20140011433.pdf',
    sourceTitle: 'NASA NTRS · Saffire-I Test Card',
    limitations: 'Conducted post-departure in uncrewed Cygnus; large-scale result specific to SIBAL blend and flow channel geometry.'
  },
  {
    id: 'fact-flex-oxygen',
    experiment: 'FLEX / FLEX-2',
    topic: 'Oxygen Fraction Range',
    headline: '0.10–0.50 (10–50%)',
    detail: 'Supplied oxygen fraction test range in the Combustion Integrated Rack (CIR). Ambient chamber pressure: 0.5–1.0 atm (50–101 kPa).',
    rangeMin: 0.10,
    rangeMax: 0.50,
    unitLabel: 'O₂ fraction',
    secondaryNote: 'Chamber pressure: 0.5–1.0 atm (50–101 kPa)',
    evidenceType: 'test setting',
    sourceUrl: 'https://gipoc.grc.nasa.gov/wp/fcf-cir/flex/',
    sourceTitle: 'NASA Glenn · FLEX Overview',
    limitations: 'Droplet combustion of isolated liquid fuels (alkanes/alcohols); limits not directly transferable to bulk solids.'
  },
  {
    id: 'fact-same-samples',
    experiment: 'SAME / SAME-R',
    topic: 'Particulate Material Test Matrix',
    headline: '30 samples · 5 materials',
    detail: 'Provided sample count across spacecraft materials (Teflon, Kapton, silicone rubber, acrylic, cotton) evaluating smoke detector performance.',
    rangeMin: 5,
    rangeMax: 30,
    unitLabel: 'samples across 5 materials',
    evidenceType: 'experiment count',
    sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf',
    sourceTitle: 'NASA SAME Factsheet',
    limitations: 'Sample counts demonstrate breadth of testing; aerosol properties vary with overheating temperature and airflow.'
  },
  {
    id: 'fact-spice-tests',
    experiment: 'SPICE',
    topic: 'Tests & Smoke-Point Measurements',
    headline: '250 tests · 70+ measurements',
    detail: 'SPICE recorded 250 tests and more than 70 distinct smoke-point measurements in the ISS Combustion Integrated Rack (CIR).',
    rangeMin: 70,
    rangeMax: 250,
    unitLabel: 'tests / measurements',
    secondaryNote: 'More than 70 smoke-point measurements, as supplied by NASA SPICE factsheet',
    evidenceType: 'experiment count',
    sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2025/07/smoke-point-in-co-flow-experiment-spice.pdf',
    sourceTitle: 'NASA SPICE Factsheet',
    limitations: 'Investigation volume metric; smoke point data specific to laminar gas coflow nozzles.'
  },
  {
    id: 'fact-fm2-lunar',
    experiment: 'FM2',
    topic: 'Lunar Gravity Testing Target',
    headline: '0.166 g (Scenario Setting)',
    detail: 'NASA Glenn describes combustion studies of material flammability at lunar gravity. Note: 0.166 g is an environmental test setting/target, not a measured experimental outcome.',
    rangeMin: 0.166,
    rangeMax: 0.166,
    unitLabel: 'g lunar target setting',
    evidenceType: 'test setting',
    sourceUrl: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-of-materials-on-the-moon-fm2/',
    sourceTitle: 'NASA Glenn · FM2 Lunar Flammability',
    limitations: 'Environmental target setting for lunar gravity flammability regimes; this is not a Martian or terrestrial simulation, nor a measured quantity.'
  }
]

// Curated NASA Research Assistant Knowledge Base
export interface CuratedAssistantResponse {
  keys: string[]
  title: string
  text: string
  source: string
  url: string
  relevanceTag: string
}

export const CURATED_ASSISTANT_RESPONSES: CuratedAssistantResponse[] = [
  {
    keys: ['microgravity', 'gravity', 'shape', 'earth', 'sphere', 'teardrop'],
    title: 'Why does flame shape change in microgravity?',
    text: 'On Earth, hot gases rise due to buoyancy differences, and cooler denser air rushes in, creating an elongated teardrop flame. In microgravity, buoyancy-driven natural convection vanishes, so diffusion-controlled flames on the ISS become rounded and near-spherical.',
    source: 'NASA · Studying Combustion and Fire Safety',
    url: 'https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/',
    relevanceTag: 'Fundamental Physics'
  },
  {
    keys: ['spread', 'airflow', 'flow', 'ventilation', 'wind'],
    title: 'What affects flame spread in spacecraft?',
    text: 'NASA BASS-II research demonstrates that flame growth, propagation, and extinction depend heavily on low-velocity forced flows. In pure stagnant air, flames can self-extinguish as combustion products smother the reaction zone, but cabin ventilation (10–30 cm/s) supplies fresh oxidizer, accelerating spread.',
    source: 'NASA PSI-25 · BASS-II Investigation',
    url: 'https://psi.nasa.gov/physci/repo/data/investigations/PSI-25',
    relevanceTag: 'Ventilation Dynamics'
  },
  {
    keys: ['pressure', 'reduced', 'kpa', 'vacuum', 'artemis'],
    title: 'How does pressure affect combustion?',
    text: 'NASA reports that reduced pressure slowed flame spread in Saffire studies. However, reduced total pressure also increases molecular diffusion rates, and in low-pressure oxygen-rich exploration atmospheres (e.g. Artemis 55 kPa / 34% O₂), the flammability envelope can shift significantly. Material-specific testing is always required.',
    source: 'NASA · Saffire Fire Safety Demonstration',
    url: 'https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf',
    relevanceTag: 'Exploration Atmospheres'
  },
  {
    keys: ['smoke', 'same', 'particle', 'detector', 'optical', 'ionization'],
    title: 'What did NASA discover regarding spacecraft smoke?',
    text: 'The SAME (Smoke Aerosol Measurement Experiment) on the ISS measured smoke-particle agglomeration from spacecraft materials. Because particles in microgravity do not settle or disperse via buoyant drafts, they form clusters 10–100× larger than terrestrial soot, rendering standard ionization detectors less sensitive than optical photoelectric sensors.',
    source: 'NASA · SAME Factsheet',
    url: 'https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf',
    relevanceTag: 'Early Detection'
  },
  {
    keys: ['saffire', 'large', 'cygnus', 'scale'],
    title: 'What was the breakthrough of the Saffire series?',
    text: 'Previous microgravity combustion tests were strictly confined to gloveboxes with millimeter-scale samples. Saffire conducted the first large-scale (0.4 m × 0.95 m) material burns inside automated Cygnus cargo vehicles after unberthing from the ISS, measuring realistic spacecraft fire propagation before destructive atmospheric re-entry.',
    source: 'NASA · Spacecraft Fire Safety Demonstration (Saffire)',
    url: 'https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf',
    relevanceTag: 'Large-Scale Fire Safety'
  },
  {
    keys: ['flex', 'cool flame', 'droplet', 'extinguish', 'suppress'],
    title: 'What are cool flames discovered in FLEX?',
    text: 'FLEX (Flame Extinguishment Experiment) isolated liquid fuel droplets in microgravity and discovered that after visible hot-flame radiation extinguished, droplets continued burning steadily at low temperatures (~600°C) with no visible soot emission. This revealed that spacecraft fires can persist in an undetected state if only optical or thermal cameras are used.',
    source: 'NASA Glenn · FLEX Overview',
    url: 'https://gipoc.grc.nasa.gov/wp/fcf-cir/flex/',
    relevanceTag: 'Cool Flame Science'
  },
  {
    keys: ['calculator', 'formula', 'velocity', 'buoyant', 'partial pressure'],
    title: 'How does the Live Flame Lab calculate scale parameters?',
    text: 'The Live Flame Lab uses standard dimensional scaling: buoyant velocity scale u = √(g · 981 · L) cm/s and oxygen partial pressure ppO₂ = (O₂% · P)/100 kPa. These are educational scaling cues to illustrate buoyancy cessation and oxidizer density; they are not CFD numerical solutions or predictive risk models.',
    source: 'NASA Researcher’s Guide to Combustion Science',
    url: 'https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/',
    relevanceTag: 'Educational Models'
  }
]
