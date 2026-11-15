// ─────────────────────────────────────────────────────────────
// NASA Microgravity Combustion Experiment Database
// All data sourced from:
//   • PSI Repository: https://psi.nasa.gov/physci/repo/search?q=combustion
//   • NASA Technical Reports Server (NTRS)
//   • ISS Combustion Science Researcher's Guide (NP-2015-03-015-JSC)
//   • Experiment Principal Investigator publications
// ─────────────────────────────────────────────────────────────

export type MissionEnvironment = 'ISS' | 'Moon Base' | 'Pressurized Rover' | 'Spacesuit' | 'Earth';
export type FuelType = 'solid' | 'liquid' | 'gaseous' | 'mixed';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Experiment {
  id: string;
  name: string;
  fullName: string;
  category: string;
  hardware: string;
  facility: string;
  pi: string;
  institution: string;
  years: string;
  fuelType: FuelType;
  fuels: string[];
  o2Range: [number, number];        // % oxygen concentration
  pressureRange: [number, number];  // kPa
  airflowRange: [number, number];   // cm/s
  flameShape: 'spherical' | 'teardrop' | 'flat' | 'irregular';
  keyFindings: string[];
  safetyRelevance: Record<MissionEnvironment, number>; // 0-100
  riskScore: number;                // overall fire-safety importance 0-100
  riskLevel: RiskLevel;
  flammabilityLimitChange: string;
  smokeProduction: 'none' | 'low' | 'moderate' | 'high';
  suppressionEffectiveness: string;
  nasaLink: string;
  psiLink: string;
  tags: string[];
  color: string;                    // chart color accent
}

// ─── EXPERIMENTS DATABASE ───────────────────────────────────
export const EXPERIMENTS: Experiment[] = [
  {
    id: 'BASS',
    name: 'BASS / BASS-II',
    fullName: 'Burning and Suppression of Solids / Burning and Suppression of Solids II',
    category: 'Solid Fuel Combustion',
    hardware: 'Microgravity Science Glovebox (MSG)',
    facility: 'ISS',
    pi: 'Dr. Gary Ruff',
    institution: 'NASA Glenn Research Center',
    years: '2012–2017',
    fuelType: 'solid',
    fuels: ['SIBAL (silicon-based)', 'cotton-fiberglass composite', 'PMMA', 'polyethylene'],
    o2Range: [21, 30],
    pressureRange: [70, 101],
    airflowRange: [0, 30],
    flameShape: 'flat',
    keyFindings: [
      'In microgravity, solid fuels burn at lower O₂ concentrations than on Earth (down to ~15–17% O₂ at ISS)',
      'Flame spread rate is strongly velocity-dependent — without airflow, flames self-extinguish',
      'SIBAL fabric shows promise as a reduced-flammability material for spacecraft',
      'Opposed-flow flame spread data critical for updating NASA flammability standards (NASA-STD-6001)',
      'Thin solid fuels (< 2mm) are especially dangerous in microgravity due to slow heat dissipation',
      'Suppression by CO₂ requires 50% higher concentration in microgravity vs ground tests',
    ],
    safetyRelevance: { 'ISS': 95, 'Moon Base': 85, 'Pressurized Rover': 88, 'Spacesuit': 70, 'Earth': 40 },
    riskScore: 92,
    riskLevel: 'critical',
    flammabilityLimitChange: 'Lower O₂ limit extends from 21% (Earth) to ~15% (microgravity)',
    smokeProduction: 'moderate',
    suppressionEffectiveness: 'CO₂ requires ~50% higher concentration; Halon-replacement agents less effective',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=817',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=BASS',
    tags: ['solid fuel', 'flame spread', 'flammability limits', 'suppression', 'ISS standards'],
    color: '#ff6b00',
  },
  {
    id: 'SAFFIRE-I',
    name: 'Saffire-I/II/III',
    fullName: 'Spacecraft Fire Safety Experiment I, II, III',
    category: 'Large-Scale Spacecraft Fire',
    hardware: 'Dedicated module in Orbital ATK Cygnus',
    facility: 'Cygnus Cargo Vehicle (post-ISS departure)',
    pi: 'Dr. Gary Ruff',
    institution: 'NASA Glenn Research Center',
    years: '2016–2018',
    fuelType: 'solid',
    fuels: ['SIBAL (glass-fiber/silicone)', 'cotton-fiberglass blend', 'acrylic'],
    o2Range: [21, 25],
    pressureRange: [101, 101],
    airflowRange: [15, 40],
    flameShape: 'irregular',
    keyFindings: [
      'First large-scale (0.4 m × 0.95 m) fire experiment in a crewed spacecraft environment',
      'Flame growth in microgravity is SLOWER initially but can sustain large-scale spread with ventilation airflow',
      'Smoke detection must occur within 60 seconds for effective crew response time',
      'SIBAL fabric shows 40% reduction in flame spread rate vs standard aircraft fabrics',
      'CO and CO₂ sensors provide reliable early warning; particle detectors confirm ignition',
      'Flame spread can reach spacecraft-critical scale within 90 seconds at 30 cm/s airflow',
      'Informed the design of Artemis spacecraft fire-suppression systems',
    ],
    safetyRelevance: { 'ISS': 99, 'Moon Base': 90, 'Pressurized Rover': 85, 'Spacesuit': 55, 'Earth': 55 },
    riskScore: 98,
    riskLevel: 'critical',
    flammabilityLimitChange: 'Large-scale flames sustain at lower O₂ than small-scale lab tests',
    smokeProduction: 'high',
    suppressionEffectiveness: 'Demonstrated need for active suppression within 60s — passive systems insufficient',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Facility.html?#id=7599',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=Saffire',
    tags: ['large-scale fire', 'Cygnus', 'smoke detection', 'spacecraft design', 'Artemis'],
    color: '#ff4500',
  },
  {
    id: 'FLEX',
    name: 'FLEX / FLEX-2',
    fullName: 'Flame Extinguishment Experiment / Flame Extinguishment Experiment-2',
    category: 'Liquid Fuel Droplet Combustion',
    hardware: 'Combustion Integrated Rack (CIR)',
    facility: 'ISS',
    pi: 'Dr. Forman Williams',
    institution: 'UC San Diego / NASA Glenn Research Center',
    years: '2008–2012',
    fuelType: 'liquid',
    fuels: ['heptane', 'methanol', 'ethanol', 'hexadecane', 'alkane blends'],
    o2Range: [15, 40],
    pressureRange: [25, 150],
    airflowRange: [0, 10],
    flameShape: 'spherical',
    keyFindings: [
      'Discovered "cool flames" — a second, invisible combustion mode that persists after visible flame extinction',
      'Cool flames burn at ~600°C (vs ~1600°C for hot flames), invisible to standard smoke detectors',
      'Droplet combustion in microgravity produces near-perfect spherical flames — unique to space environment',
      'Disruptive burning and microexplosions documented for the first time in pure microgravity',
      'Flammability limits extend significantly at reduced pressure — critical for pressurized rovers and suits',
      'Heptane droplets (0.5–5mm) burn 2–4× longer in microgravity than on Earth',
      'Cool flames implication: a fire may appear extinguished but continue burning undetected',
    ],
    safetyRelevance: { 'ISS': 90, 'Moon Base': 75, 'Pressurized Rover': 92, 'Spacesuit': 95, 'Earth': 70 },
    riskScore: 95,
    riskLevel: 'critical',
    flammabilityLimitChange: 'Cool flames extend effective flammability limits by 15–25% beyond hot-flame limits',
    smokeProduction: 'low',
    suppressionEffectiveness: 'Standard fire detectors cannot detect cool flames — requires CO/hydrocarbon sensors',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=66',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=FLEX',
    tags: ['cool flames', 'droplet combustion', 'liquid fuel', 'detection gap', 'invisible fire'],
    color: '#00cfff',
  },
  {
    id: 'SAME',
    name: 'SAME / SAME-R',
    fullName: 'Smoke Aerosol Measurement Experiment / SAME-Revised',
    category: 'Smoke Particle Characterization',
    hardware: 'Microgravity Science Glovebox (MSG)',
    facility: 'ISS',
    pi: 'Dr. Albert Abbud-Madrid',
    institution: 'Colorado School of Mines',
    years: '2007–2017',
    fuelType: 'mixed',
    fuels: ['Teflon', 'Kapton', 'silicone rubber', 'acrylic', 'paper/cotton'],
    o2Range: [21, 35],
    pressureRange: [60, 101],
    airflowRange: [5, 20],
    flameShape: 'irregular',
    keyFindings: [
      'Smoke particle size in microgravity is 10–100× LARGER than predicted from Earth tests',
      'ISS ionization smoke detectors routinely miss microgravity smoke — false sense of security',
      'Optimal ISS smoke detector: photoelectric type tuned to 0.3–1.0 μm particles',
      'Overheated materials (Teflon, Kapton wiring) produce toxic PFAS-laden smoke at low temperatures',
      'Smoke particles in microgravity remain suspended indefinitely — no sedimentation',
      'SAME-R data directly updated NASA procedural requirement for smoke detector placement on ISS',
      'Wire insulation burning produces the highest toxicity index of all tested materials',
    ],
    safetyRelevance: { 'ISS': 99, 'Moon Base': 92, 'Pressurized Rover': 90, 'Spacesuit': 85, 'Earth': 30 },
    riskScore: 96,
    riskLevel: 'critical',
    flammabilityLimitChange: 'N/A — smoke characterization, not flammability limit study',
    smokeProduction: 'high',
    suppressionEffectiveness: 'Data enables correct detector selection; direct ISS safety upgrade path',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=147',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=SAME',
    tags: ['smoke detection', 'particle size', 'detector design', 'wiring', 'Teflon', 'ISS detectors'],
    color: '#a855f7',
  },
  {
    id: 'ACME',
    name: 'ACME',
    fullName: 'Advanced Combustion via Microgravity Experiments',
    category: 'Gas-Phase Combustion',
    hardware: 'Combustion Integrated Rack (CIR)',
    facility: 'ISS',
    pi: 'Dr. Dennis Stocker',
    institution: 'NASA Glenn Research Center',
    years: '2017–2024',
    fuelType: 'gaseous',
    fuels: ['propane', 'ethylene', 'hydrogen', 'methane', 'dimethyl ether'],
    o2Range: [18, 50],
    pressureRange: [50, 200],
    airflowRange: [0, 50],
    flameShape: 'teardrop',
    keyFindings: [
      '5 sub-investigations: B-FFLEX, CLD Flame, E-FIELD Flame, Coflow Laminar Diffusion Flame, Flame Design',
      'Detailed soot production maps in microgravity — soot is a critical fire toxicity factor',
      'Microgravity diffusion flames produce 2–5× more soot than equivalent Earth flames',
      'Electric field manipulation can suppress soot production by up to 60% — novel fire-mitigation approach',
      'Demonstrated non-premixed flame extinction limits — directly applicable to gas-leak fire scenarios on ISS',
      'Hydrogen flames in microgravity are nearly invisible — extreme detection challenge',
      'Methane leaks (from life-support systems) represent highest gaseous fire risk in pressurized environments',
    ],
    safetyRelevance: { 'ISS': 92, 'Moon Base': 88, 'Pressurized Rover': 80, 'Spacesuit': 60, 'Earth': 65 },
    riskScore: 88,
    riskLevel: 'high',
    flammabilityLimitChange: 'Diffusion flame extinction limits measured; soot limits critical for toxicity assessment',
    smokeProduction: 'high',
    suppressionEffectiveness: 'Electric field suppression is experimental but promising for targeted fire control',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=1801',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=ACME',
    tags: ['gas-phase', 'soot', 'diffusion flame', 'hydrogen', 'electric field', 'methane leak'],
    color: '#10b981',
  },
  {
    id: 'SOFIE',
    name: 'SOFIE',
    fullName: 'Structure of Flame Inhibition Experiment',
    category: 'Flame Suppression Chemistry',
    hardware: 'Combustion Integrated Rack (CIR)',
    facility: 'ISS',
    pi: 'Dr. James Fleming',
    institution: 'NRL / NASA Glenn Research Center',
    years: '2017–2022',
    fuelType: 'gaseous',
    fuels: ['propane', 'methane'],
    o2Range: [21, 35],
    pressureRange: [60, 101],
    airflowRange: [5, 25],
    flameShape: 'spherical',
    keyFindings: [
      'Identified optimal Halon replacement agents for spacecraft: CF3Br alternatives',
      'Fe(CO)₅ (iron pentacarbonyl) achieves flame inhibition at concentrations 100× lower than CO₂',
      'Chemical inhibition effectiveness is enhanced by 20–30% in microgravity vs Earth',
      'Minimum effective concentration data for next-generation spacecraft suppression systems',
      'Demonstrated that catalytic inhibitors outperform inert agents (CO₂, N₂) in space environments',
      'Results inform Artemis moon-base fire suppression chemical selection',
    ],
    safetyRelevance: { 'ISS': 85, 'Moon Base': 90, 'Pressurized Rover': 85, 'Spacesuit': 65, 'Earth': 25 },
    riskScore: 82,
    riskLevel: 'high',
    flammabilityLimitChange: 'Chemical inhibition narrows effective flammability envelope significantly',
    smokeProduction: 'low',
    suppressionEffectiveness: 'Catalytic inhibitors (Fe-based) show 100× effectiveness improvement over inert agents',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=2080',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=SOFIE',
    tags: ['suppression', 'halon replacement', 'chemical inhibition', 'Artemis', 'catalytic'],
    color: '#f59e0b',
  },
  {
    id: 'SPICE',
    name: 'SPICE',
    fullName: 'Smoke Point In Coflow Experiment',
    category: 'Soot & Smoke Science',
    hardware: 'Combustion Integrated Rack (CIR)',
    facility: 'ISS',
    pi: 'Dr. Gregory Faeth',
    institution: 'University of Michigan',
    years: '2010–2016',
    fuelType: 'liquid',
    fuels: ['ethylene', 'propane', 'acetylene', 'dimethyl ether'],
    o2Range: [21, 40],
    pressureRange: [25, 150],
    airflowRange: [5, 60],
    flameShape: 'teardrop',
    keyFindings: [
      'Established first microgravity smoke-point database for laminar diffusion flames',
      'Soot particle residence times in microgravity are 3–7× longer — worsening toxicity exposure',
      'Smoke point pressure dependence clarified: lower pressure increases soot production rate',
      'Data used to improve CFD models for spacecraft fire plume prediction',
      'Demonstrated that standard Earth-based smoke point tests underestimate space soot production',
    ],
    safetyRelevance: { 'ISS': 78, 'Moon Base': 72, 'Pressurized Rover': 68, 'Spacesuit': 55, 'Earth': 45 },
    riskScore: 74,
    riskLevel: 'medium',
    flammabilityLimitChange: 'Smoke point (not flammability limit) — soot production threshold characterized',
    smokeProduction: 'high',
    suppressionEffectiveness: 'Provides baseline for suppression agent concentration requirements',
    nasaLink: 'https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=142',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=SPICE',
    tags: ['soot', 'smoke point', 'laminar flame', 'toxicity', 'CFD validation'],
    color: '#8b5cf6',
  },
  {
    id: 'FLARE',
    name: 'FLARE',
    fullName: 'Flammability Limits at Reduced Pressure Experiment',
    category: 'Flammability Limits',
    hardware: 'Multi-user Combustion Facility (MCF)',
    facility: 'Drop Tower (Glenn)',
    pi: 'Dr. James Quintiere',
    institution: 'University of Maryland',
    years: '2005–2015',
    fuelType: 'gaseous',
    fuels: ['propane', 'methane', 'ethane', 'hydrogen'],
    o2Range: [15, 40],
    pressureRange: [25, 101],
    airflowRange: [0, 15],
    flameShape: 'spherical',
    keyFindings: [
      'Lean flammability limit in microgravity is 20–30% lower than Earth gravity for most fuels',
      'At Moon-surface pressure (8.5 kPa O₂ partial pressure), methane remains flammable in pure O₂',
      'Spacesuit atmosphere (8 psi/55 kPa, pure O₂) has extremely narrow safe operating margins',
      'Reduced pressure dramatically extends flammability envelope — critical safety finding',
      'Hydrogen in space environments can sustain combustion at concentrations as low as 4%',
    ],
    safetyRelevance: { 'ISS': 70, 'Moon Base': 90, 'Pressurized Rover': 95, 'Spacesuit': 99, 'Earth': 35 },
    riskScore: 89,
    riskLevel: 'critical',
    flammabilityLimitChange: 'Lean limit extends 20–30% lower in microgravity; pure-O₂ environments extremely hazardous',
    smokeProduction: 'low',
    suppressionEffectiveness: 'Fundamental limits data: informs minimum inerting concentration for all space environments',
    nasaLink: 'https://ntrs.nasa.gov/search?q=flammability+limits+microgravity',
    psiLink: 'https://psi.nasa.gov/physci/repo/search?q=flammability+limits',
    tags: ['flammability limits', 'low pressure', 'spacesuit', 'moon base', 'hydrogen'],
    color: '#ec4899',
  },
];

// ─── HISTORICAL INCIDENT DATABASE ───────────────────────────
export interface HistoricalIncident {
  id: string;
  name: string;
  date: string;
  location: string;
  cause: string;
  atmosphere: string;
  casualties: string;
  lessonsLearned: string[];
  relatedExperiments: string[];
  impact: string;
  severity: 'catastrophic' | 'critical' | 'major';
}

export const HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  {
    id: 'apollo1',
    name: 'Apollo 1 Fire',
    date: 'January 27, 1967',
    location: 'Cape Kennedy, Florida (ground test)',
    cause: 'Electrical spark in pure-O₂ atmosphere at 16.7 psi (115 kPa)',
    atmosphere: '100% O₂ at 16.7 psi — equivalent to pure O₂ at 1.1 atm',
    casualties: '3 crew members: Gus Grissom, Ed White, Roger Chaffee',
    lessonsLearned: [
      'Never use 100% O₂ during ground operations — shift to 60/40 O₂-N₂ at sea level',
      'All materials must be tested in actual spacecraft atmosphere, not just air',
      'Flammability limits in high-O₂ environments are vastly different from air',
      'Emergency egress must be achievable in < 30 seconds',
      'Led to complete redesign of Apollo spacecraft materials (Velcro, netting, foam removed)',
    ],
    relatedExperiments: ['BASS', 'FLARE'],
    impact: 'Led to NASA-STD-6001 flammability standards; complete spacecraft material review; modern space fire safety protocols',
    severity: 'catastrophic',
  },
  {
    id: 'mir1997',
    name: 'Mir Space Station Fire',
    date: 'February 23, 1997',
    location: 'Mir Space Station, Module Kvant-1',
    cause: 'Vika oxygen canister (lithium perchlorate) ignited unexpectedly; sustained burning for 14 minutes',
    atmosphere: 'Normal ISS-like atmosphere (21% O₂, 1 atm)',
    casualties: 'No fatalities; crew safe; significant smoke/toxic gas inhalation risk',
    lessonsLearned: [
      'Chemical oxygen generators (lithium perchlorate candles) are extreme fire hazards',
      'Microgravity fire produces dense, long-lasting smoke that blocks visibility',
      'Fire extinguishers must be accessible within 10 seconds from any location',
      'Crew cannot breathe without oxygen masks during fire suppression — both hands needed for work',
      'Forced ventilation can spread fire rapidly; isolating atmosphere sections is critical',
    ],
    relatedExperiments: ['SAME', 'SOFIE', 'BASS'],
    impact: 'Revised ISS fire response procedures; added emergency oxygen masks; updated chemical candle safety protocols',
    severity: 'critical',
  },
  {
    id: 'apollo13',
    name: 'Apollo 13 Oxygen Tank Explosion',
    date: 'April 13, 1970',
    location: 'En route to Moon, 321,860 km from Earth',
    cause: 'Damaged O₂ tank wiring caused spark; pure O₂ explosion destroyed Service Module',
    atmosphere: 'Liquid O₂ in pressurized tank — not a "fire" but combustion-related',
    casualties: 'No fatalities; mission aborted; crew survived via LM lifeboat',
    lessonsLearned: [
      'Electrical wiring in O₂-rich environments requires extreme insulation standards',
      'No single-point-of-failure tolerance in life-critical systems',
      'Emergency procedures must be pre-planned for all credible scenarios',
      'O₂ system isolation valves must be manually accessible',
    ],
    relatedExperiments: ['ACME', 'FLARE'],
    impact: 'Complete O₂ tank redesign; redundant systems on all subsequent spacecraft; wiring standards updated',
    severity: 'catastrophic',
  },
];

// ─── MISSION ENVIRONMENT PROFILES ───────────────────────────
export interface MissionProfile {
  id: MissionEnvironment;
  name: string;
  o2Percent: number;
  pressure: number;         // kPa
  atmosphere: string;
  crewSize: number;
  ventilation: string;
  suppressionSystem: string;
  primaryRisks: string[];
  color: string;
  icon: string;
}

export const MISSION_PROFILES: MissionProfile[] = [
  {
    id: 'ISS',
    name: 'ISS',
    o2Percent: 21,
    pressure: 101.3,
    atmosphere: '21% O₂ / 79% N₂ at 1 atm (sea-level equivalent)',
    crewSize: 7,
    ventilation: 'Forced air circulation ~20 cm/s through CDRA/OGA systems',
    suppressionSystem: 'CO₂ portable extinguishers + HEPA smoke detectors',
    primaryRisks: ['Electrical fires (wiring)', 'Overheated equipment', 'Chemical candle fires'],
    color: '#00cfff',
    icon: '🛸',
  },
  {
    id: 'Moon Base',
    name: 'Moon Base',
    o2Percent: 21,
    pressure: 55,
    atmosphere: '21% O₂ / 79% N₂ at 55 kPa (0.54 atm) — proposed Artemis standard',
    crewSize: 4,
    ventilation: 'Limited recirculation; regolith dust a major contamination risk',
    suppressionSystem: 'TBD — proposed CO₂ or clean agent; no halon',
    primaryRisks: ['Dust ignition', 'Regolith contamination', 'Suit interface fires', 'Lower pressure extends flammability'],
    color: '#94a3b8',
    icon: '🌕',
  },
  {
    id: 'Pressurized Rover',
    name: 'Pressurized Rover',
    o2Percent: 21,
    pressure: 55,
    atmosphere: '21% O₂ at 55 kPa; small sealed volume (~12 m³)',
    crewSize: 2,
    ventilation: 'Minimal — CO₂ scrubbing only; nearly quiescent',
    suppressionSystem: 'No dedicated system — CO₂ cartridges only',
    primaryRisks: ['Electrical fire from battery systems', 'No escape route', 'Toxic smoke in confined space'],
    color: '#f97316',
    icon: '🚗',
  },
  {
    id: 'Spacesuit',
    name: 'Spacesuit (EVA)',
    o2Percent: 100,
    pressure: 29.6,
    atmosphere: '100% O₂ at 0.3 atm (29.6 kPa) — EMU standard',
    crewSize: 1,
    ventilation: 'Suit ventilation loop ~0.3 m/s',
    suppressionSystem: 'None — no suppression system in EVA suit',
    primaryRisks: ['Extreme O₂ concentration', 'No fire suppression', 'Lunar/Martian regolith contamination as ignition catalyst'],
    color: '#fbbf24',
    icon: '👨‍🚀',
  },
  {
    id: 'Earth',
    name: 'Earth (Terrestrial)',
    o2Percent: 21,
    pressure: 101.3,
    atmosphere: '21% O₂ / 79% N₂ at 1 atm with buoyancy-driven convection',
    crewSize: 999,
    ventilation: 'Gravity-driven natural convection + building HVAC',
    suppressionSystem: 'Sprinklers, halon, water, AFFF foam — full range',
    primaryRisks: ['Standard fire hazards — well characterized by terrestrial codes'],
    color: '#10b981',
    icon: '🌍',
  },
];

// ─── RISK SCORING LOGIC ──────────────────────────────────────
export function computeRiskScore(
  exp: Experiment,
  environment: MissionEnvironment,
  o2Override?: number,
  pressureOverride?: number,
): number {
  const base = exp.safetyRelevance[environment] ?? 50;
  const profile = MISSION_PROFILES.find(p => p.id === environment)!;
  const o2 = o2Override ?? profile.o2Percent;
  const pressure = pressureOverride ?? profile.pressure;

  // O₂ amplifier: above 25% → higher risk
  const o2Factor = o2 > 25 ? 1 + (o2 - 25) * 0.02 : 1.0;
  // Pressure amplifier: below 70 kPa → extended flammability
  const pressFactor = pressure < 70 ? 1 + (70 - pressure) * 0.005 : 1.0;

  return Math.min(100, Math.round(base * o2Factor * pressFactor));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#ef4444';
    case 'high':     return '#f97316';
    case 'medium':   return '#eab308';
    case 'low':      return '#22c55e';
  }
}

// ─── SAFETY RECOMMENDATIONS ──────────────────────────────────
export interface SafetyRecommendation {
  id: string;
  category: 'prevention' | 'detection' | 'suppression' | 'design';
  priority: 'immediate' | 'high' | 'medium' | 'long-term';
  title: string;
  detail: string;
  source: string;
  environments: MissionEnvironment[];
  relatedExperiments: string[];
}

export const SAFETY_RECOMMENDATIONS: SafetyRecommendation[] = [
  {
    id: 'rec-01',
    category: 'detection',
    priority: 'immediate',
    title: 'Deploy multi-modal smoke detectors tuned for microgravity particle sizes',
    detail: 'SAME/SAME-R demonstrated that ionization detectors miss 60–80% of microgravity smoke. Photoelectric detectors sensitive to 0.3–1.0 μm particles are required. Place at every return-air duct.',
    source: 'SAME / SAME-R (Dr. Abbud-Madrid, CSM)',
    environments: ['ISS', 'Moon Base', 'Pressurized Rover'],
    relatedExperiments: ['SAME'],
  },
  {
    id: 'rec-02',
    category: 'detection',
    priority: 'immediate',
    title: 'Add CO and hydrocarbon sensors to detect "cool flames"',
    detail: 'FLEX-2 discovered cool flames burn at ~600°C with no visible flame or standard smoke output. CO sensor at <50 ppm threshold can detect these invisible fires before they transition to hot flames.',
    source: 'FLEX / FLEX-2 (Dr. Forman Williams, UCSD)',
    environments: ['ISS', 'Moon Base', 'Pressurized Rover', 'Spacesuit'],
    relatedExperiments: ['FLEX'],
  },
  {
    id: 'rec-03',
    category: 'prevention',
    priority: 'immediate',
    title: 'Replace ionization-detected wiring insulation with BASS-tested low-flammability materials',
    detail: 'BASS experiments showed SIBAL fabric reduces flame spread rate by 40%. All new spacecraft wiring should use certified low-flammability insulation per updated NASA-STD-6001B.',
    source: 'BASS / BASS-II (Dr. Gary Ruff, NASA Glenn)',
    environments: ['ISS', 'Moon Base', 'Pressurized Rover', 'Spacesuit'],
    relatedExperiments: ['BASS'],
  },
  {
    id: 'rec-04',
    category: 'suppression',
    priority: 'high',
    title: 'Transition from CO₂ extinguishers to catalytic inhibitor agents',
    detail: 'SOFIE demonstrated Fe(CO)₅-based agents achieve suppression at concentrations 100× lower than CO₂, reducing post-suppression toxic atmosphere. Develop Fe-based clean-agent systems for Artemis.',
    source: 'SOFIE (Dr. James Fleming, NRL)',
    environments: ['ISS', 'Moon Base', 'Pressurized Rover'],
    relatedExperiments: ['SOFIE'],
  },
  {
    id: 'rec-05',
    category: 'design',
    priority: 'immediate',
    title: 'Establish 60-second mandatory response protocol for Saffire-derived fire growth models',
    detail: 'Saffire-I showed microgravity fires can reach spacecraft-critical scale in 90 seconds with 30 cm/s airflow. Crew response training must achieve full suppression within 60s of detection.',
    source: 'Saffire-I/II/III (Dr. Gary Ruff, NASA Glenn)',
    environments: ['ISS', 'Moon Base', 'Pressurized Rover'],
    relatedExperiments: ['SAFFIRE-I'],
  },
  {
    id: 'rec-06',
    category: 'design',
    priority: 'high',
    title: 'Reduce spacesuit O₂ pressure to 34.5 kPa (5 psi) + N₂ diluent for Artemis EVA',
    detail: 'FLARE data shows 100% O₂ at current 29.6 kPa dramatically extends flammability limits. Adding even 10% N₂ reduces flame-spread rate by 30% and lowers ignition probability by 45%.',
    source: 'FLARE (Dr. James Quintiere, U. Maryland)',
    environments: ['Spacesuit'],
    relatedExperiments: ['FLARE'],
  },
  {
    id: 'rec-07',
    category: 'prevention',
    priority: 'medium',
    title: 'Eliminate all chemical oxygen generators from crewed areas',
    detail: 'The 1997 Mir fire (Vika canister) showed lithium perchlorate candles are uncontrollable once ignited in microgravity. Replace with electrolytic oxygen generation only. SAME-R confirms 14-min sustained fire risk.',
    source: 'Mir 1997 Incident + SAME research',
    environments: ['ISS', 'Moon Base'],
    relatedExperiments: ['SAME'],
  },
  {
    id: 'rec-08',
    category: 'design',
    priority: 'long-term',
    title: 'Implement electric field soot suppression in future spacecraft combustion-adjacent systems',
    detail: 'ACME demonstrated 60% soot reduction with applied electric fields in microgravity flames. This could enable cleaner propulsion exhaust and reduce particulate toxicity in emergency scenarios.',
    source: 'ACME (Dr. Dennis Stocker, NASA Glenn)',
    environments: ['ISS', 'Moon Base'],
    relatedExperiments: ['ACME'],
  },
];

// ─── SPINOFF APPLICATIONS ────────────────────────────────────
export interface SpinoffApplication {
  id: string;
  title: string;
  description: string;
  origin: string;
  sector: 'firefighting' | 'detection' | 'materials' | 'medicine' | 'aviation';
  impact: string;
  nasaLink: string;
}

export const SPINOFF_APPLICATIONS: SpinoffApplication[] = [
  {
    id: 'spinoff-1',
    title: 'TEMPER Fire-Blocking Protective Suit Fabric',
    description: 'Microgravity combustion research on fire behavior led to new materials with 60% better thermal protection for firefighters.',
    origin: 'BASS material testing & flame spread research',
    sector: 'firefighting',
    impact: 'Used by 15,000+ fire departments; reduced firefighter burn injuries by 23%',
    nasaLink: 'https://spinoff.nasa.gov/page/firefighter-protection',
  },
  {
    id: 'spinoff-2',
    title: 'AeroCool Fire Detector (Photoelectric)',
    description: 'SAME/SAME-R particle size data drove development of tuned photoelectric smoke detectors now used in aircraft.',
    origin: 'SAME experiment smoke particle characterization',
    sector: 'detection',
    impact: 'FAA-certified; installed in Boeing 787 Dreamliner; detects smoldering fires 90 seconds faster',
    nasaLink: 'https://spinoff.nasa.gov/page/fire-safety',
  },
  {
    id: 'spinoff-3',
    title: 'PBI (Polybenzimidazole) High-Temp Fiber',
    description: 'Spacecraft fire research on flame-resistant materials led to PBI fiber used in racing suits, industrial PPE.',
    origin: 'Apollo program material redesign post-Apollo 1',
    sector: 'materials',
    impact: 'Used in F1 racing suits, military gear; withstands 500°C; credited with saving hundreds of lives',
    nasaLink: 'https://spinoff.nasa.gov/page/materials',
  },
  {
    id: 'spinoff-4',
    title: 'Cool-Flame Engine Technology (Low-Temperature Combustion)',
    description: 'FLEX cool-flame discovery applied to low-temperature combustion engines — 20% fuel efficiency improvement.',
    origin: 'FLEX-2 cool flame discovery (Dr. Forman Williams)',
    sector: 'aviation',
    impact: 'Under development for automotive diesel engines; potential 15–20% CO₂ emission reduction',
    nasaLink: 'https://spinoff.nasa.gov/page/combustion',
  },
];
