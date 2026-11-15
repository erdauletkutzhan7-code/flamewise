import { createContext, useContext, type ReactNode } from 'react'

interface TranslationContextType {
  t: (key: string) => string
}

const DICTIONARY: Record<string, string> = {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'NASA Catalog',
    'nav.ranking': 'Ranking',
    'nav.insights': 'Insights',
    'nav.engineering': 'Engineering Brief',
    'nav.lab': 'Flame Lab',
    'nav.visualizations': 'Charts',
    'nav.copilot': 'NASA Research Assistant',
    'nav.about': 'About',

    // Hero
    'hero.badge': 'NASA SPACE APPS CHALLENGE 2026 · FLAME IN FREEFALL',
    'hero.title_part1': 'Fire behaves differently',
    'hero.title_part2': 'when gravity disappears.',
    'hero.desc': 'In orbital freefall, buoyancy vanishes. Flames burn as near-perfect quiescent spheres, generate invisible low-temperature cool flames, and sustain at oxygen levels that would extinguish on Earth.',
    'hero.cta_lab': 'Launch Live Flame Lab',
    'hero.cta_explore': 'Explore NASA Experiments',
    'hero.stat_psi': 'NASA PSI Missions',
    'hero.stat_temp': 'FLEX Cool Flames',
    'hero.stat_smoke': 'SAME Soot Cluster Scale',

    // Lab Page
    'lab.title': 'Live Flame Dynamics Lab',
    'lab.subtitle': 'NASA COMBUSTION SIMULATION LAB',
    'lab.disclaimer_title': 'Scientific Transparency:',
    'lab.disclaimer_text': 'This interactive visualizer is an educational schematic, not a CFD physical simulation or predictive numerical code. It visualizes qualitative morphology transformations based on buoyancy cessation documented in NASA PSI experiments (BASS, Saffire, FLEX). No risk probabilities are invented.',
    'lab.auto_demo_start': 'Start Auto-Demo',
    'lab.auto_demo_stop': 'Stop Auto-Demo',
    'lab.gravity_target': 'Target Gravity Field (g)',
    'lab.length_scale': 'Characteristic Length L',
    'lab.airflow': 'Ventilation Airflow',
    'lab.oxygen_conc': 'Oxygen Concentration (O₂ %)',
    'lab.pressure': 'Chamber Pressure (kPa)',
    'lab.fuel': 'Fuel Material',
    'lab.event_log': 'Simulation Event Log',
    'lab.clear': 'Clear',
    'lab.speed': 'SPEED:',
    'lab.buoyant_scale': 'Buoyant Velocity Scale',
    'lab.po2_scale': 'O₂ Partial Pressure',
    'lab.nasa_benchmarks': 'NASA Benchmark Ref',
    'lab.history_chart_title': 'Calculated Velocity Scale u(t) History',
    'lab.history_chart_note': 'DEMONSTRATION CALCULATION · NOT MEASURED DATA',

    // Data Explorer
    'data.title': 'Scientific Data Explorer',
    'data.badge': 'VERIFIED NASA ARCHIVE',
    'data.desc': 'Range values, test conditions, and counts sourced strictly from official NASA documentation.',
    'data.export_csv': 'Export Data (CSV)',
    'data.filter_label': 'Filter Investigation:',
    'data.scope_limitation': 'Scope & Limitation:',
    'data.source_link': 'View NASA Source ↗',

    // Copilot / Assistant
    'copilot.title': 'NASA Combustion Research Assistant',
    'copilot.badge': 'SOURCE-BASED ANSWERS · VERIFIED REFERENCES',
    'copilot.notice_title': 'Architecture Notice:',
    'copilot.notice_text': 'Responses are curated directly from peer-reviewed NASA microgravity papers and technical reports. To maintain scientific integrity and prevent hallucination, answers are restricted to verified investigation domains.',
    'copilot.placeholder': 'Ask about microgravity flame shape, smoke, Saffire, FLEX, BASS...',
    'copilot.topics_title': 'Curated Inquiry Topics',
    'copilot.scope_title': 'Sourced Scientific Scope',
    'copilot.scope_desc': 'Covers BASS (solid flame spread), Saffire (spacecraft scale), FLEX (droplet & cool flames), SAME (smoke particles), ACME (gas diffusion & soot), and FM2 (lunar combustion).',

    // Ranking Page
    'ranking.title': 'Scenario-Based Investigation Relevance',
    'ranking.badge': 'DETERMINISTIC RANKING',
    'ranking.desc': 'Deterministic matching of NASA microgravity combustion investigations against specific exploration mission profiles (ISS, Moon, Mars rover, EVA suit).',
    'ranking.transparency': 'TRANSPARENCY NOTE: Scores indicate contextual research relevance; they do not calculate statistical probability of real spacecraft fire.',
    'ranking.mission_env': 'Mission Environment',

    // Common
    'common.source': 'Source:',
    'common.limitations': 'Limitations:',
    'common.reset': 'Reset',
    'common.apply': 'Apply'
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const t = (key: string): string => DICTIONARY[key] || key

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
