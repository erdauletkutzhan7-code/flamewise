import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ru' | 'en'

interface TranslationContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.dashboard': 'Каталог NASA',
    'nav.ranking': 'Ранжирование',
    'nav.insights': 'Инсайты',
    'nav.engineering': 'Инженерный бриф',
    'nav.lab': 'Лаборатория пламени',
    'nav.visualizations': 'Графики',
    'nav.copilot': 'Ассистент NASA',
    'nav.about': 'О проекте',

    // Hero
    'hero.badge': 'NASA SPACE APPS CHALLENGE 2026 · ПЛАМЯ В НЕВЕСОМОСТИ',
    'hero.title_part1': 'Пламя ведет себя иначе,',
    'hero.title_part2': 'когда гравитация исчезает.',
    'hero.desc': 'В условиях микрогравитации исчезает естественная плавучесть. Пламя горит в виде почти идеальных неподвижных сфер, создает невидимые низкотемпературные холодные пламена и существует при уровнях кислорода, при которых на Земле огонь гаснет.',
    'hero.cta_lab': 'Запустить Лабораторию',
    'hero.cta_explore': 'Исследовать базу NASA',
    'hero.stat_psi': 'Миссий NASA PSI',
    'hero.stat_temp': 'Холодные пламена FLEX',
    'hero.stat_smoke': 'Размер сажи SAME',

    // Lab Page
    'lab.title': 'Лаборатория динамики пламени',
    'lab.subtitle': 'ИНТЕРАКТИВНЫЙ НАУЧНЫЙ СИМУЛЯТОР NASA',
    'lab.disclaimer_title': 'Научная прозрачность:',
    'lab.disclaimer_text': 'Этот интерактивный визуализатор является образовательной схематической моделью, а не расчетным CFD-кодом. Он демонстрирует качественную трансформацию формы пламени при исчезновении плавучести согласно данным NASA (BASS, Saffire, FLEX). Вероятности риска не выдумываются.',
    'lab.auto_demo_start': 'Запустить авто-демо',
    'lab.auto_demo_stop': 'Остановить авто-демо',
    'lab.gravity_target': 'Целевое гравитационное поле (g)',
    'lab.length_scale': 'Характерный размер L',
    'lab.airflow': 'Вентиляционный обдув',
    'lab.oxygen_conc': 'Концентрация кислорода (O₂ %)',
    'lab.pressure': 'Давление (кПа)',
    'lab.fuel': 'Материал топлива',
    'lab.event_log': 'Лог событий симуляции',
    'lab.clear': 'Очистить',
    'lab.speed': 'СКОРОСТЬ:',
    'lab.buoyant_scale': 'Масштаб скорости плавучести',
    'lab.po2_scale': 'Парциальное давление O₂',
    'lab.nasa_benchmarks': 'Ориентиры NASA',
    'lab.history_chart_title': 'История расчетной скорости u(t)',
    'lab.history_chart_note': 'ДЕМОНСТРАЦИОННЫЙ РАСЧЕТ · НЕ ИЗМЕРЕННЫЕ ДАННЫЕ',

    // Data Explorer
    'data.title': 'Научный исследователь данных',
    'data.badge': 'ВЕРИФИЦИРОВАННЫЙ АРХИВ NASA',
    'data.desc': 'Диапазоны параметров, условия тестов и количество образцов строго из официальных отчетов NASA.',
    'data.export_csv': 'Экспорт в CSV',
    'data.filter_label': 'Фильтр исследования:',
    'data.scope_limitation': 'Границы и ограничения:',
    'data.source_link': 'Открыть источник NASA ↗',

    // Copilot / Assistant
    'copilot.title': 'Исследовательский ассистент NASA',
    'copilot.badge': 'КУРИРУЕМЫЕ ОТВЕТЫ ИЗ ИСТОЧНИКОВ · БЕЗ ГАЛЛЮЦИНАЦИЙ',
    'copilot.notice_title': 'Архитектурное уведомление:',
    'copilot.notice_text': 'Все ответы строго курируются из рецензируемых научных публикаций и отчетов NASA. Для обеспечения академической достоверности ассистент отвечает только в рамках верифицированных экспериментов.',
    'copilot.placeholder': 'Спросите о форме пламени, дыме, Saffire, FLEX, BASS...',
    'copilot.topics_title': 'Курируемые темы вопросов',
    'copilot.scope_title': 'Научный охват источников',
    'copilot.scope_desc': 'Охватывает эксперименты BASS (горение твердых тел), Saffire (масштаб корабля), FLEX (капли и холодное пламя), SAME (частицы дыма), ACME (диффузия газов и сажа) и FM2 (лунное горение).',

    // Ranking Page
    'ranking.title': 'Ранжирование применимости исследований',
    'ranking.badge': 'ДЕТЕРМИНИРОВАННОЕ РАНЖИРОВАНИЕ',
    'ranking.desc': 'Детерминированное сопоставление исследований горения NASA с конкретными профилями пилотируемых миссий (МКС, Луна, марсианский ровер, скафандр).',
    'ranking.transparency': 'ПРИМЕЧАНИЕ: Оценки отражают научную релевантность исследований; они не вычисляют вероятность реального пожара.',
    'ranking.mission_env': 'Среда миссии',

    // Common
    'common.source': 'Источник:',
    'common.limitations': 'Ограничения:',
    'common.reset': 'Сброс',
    'common.apply': 'Применить'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'NASA Catalog',
    'nav.ranking': 'Ranking',
    'nav.insights': 'Insights',
    'nav.engineering': 'Engineering Brief',
    'nav.lab': 'Flame Lab',
    'nav.visualizations': 'Charts',
    'nav.copilot': 'NASA Copilot',
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
    'copilot.badge': 'SOURCE-BOUNDED CURATED RESPONSES · ZERO UNVERIFIED HALLUCINATIONS',
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
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Default language is Russian per requirements
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('solforge_lang') as Language
    return saved === 'en' || saved === 'ru' ? saved : 'ru'
  })

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('solforge_lang', newLang)
  }

  const t = (key: string): string => {
    return DICTIONARY[lang][key] || DICTIONARY['en'][key] || key
  }

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
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
