import { useState, useMemo, type ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EXPERIMENTS,
  MISSION_PROFILES,
  SAFETY_RECOMMENDATIONS,
  type Experiment,
  type MissionEnvironment,
  type FuelType,
  type RiskLevel,
} from '../data/experiments'
import {
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Beaker,
  Wind,
  Gauge,
  X,
  ShieldAlert,
  Layers,
  Droplets,
} from 'lucide-react'
import clsx from 'clsx'
import PageWrapper from '../components/PageWrapper'
import ExperimentCard from '../components/ExperimentCard'
import ScientificDataExplorer from '../components/ScientificDataExplorer'

// ─── Types ──────────────────────────────────────────────────
type SortOption = 'risk-desc' | 'risk-asc' | 'name-asc'

type Filters = {
  search: string
  fuel: FuelType | 'all'
  mission: MissionEnvironment | 'all'
  risk: RiskLevel | 'all'
  sort: SortOption
}

// ─── Helpers ────────────────────────────────────────────────
const FUEL_OPTIONS: Array<{ value: FuelType | 'all'; label: string; icon?: ReactElement }> = [
  { value: 'all', label: 'All' },
  { value: 'solid', label: 'Solid', icon: <Flame className="w-3 h-3" /> },
  { value: 'liquid', label: 'Liquid', icon: <Beaker className="w-3 h-3" /> },
  { value: 'gaseous', label: 'Gaseous', icon: <Wind className="w-3 h-3" /> },
  { value: 'mixed', label: 'Mixed', icon: <Layers className="w-3 h-3" /> },
]

const MISSION_OPTIONS: Array<{ value: MissionEnvironment | 'all'; label: string; icon?: string }> =
  [
    { value: 'all', label: 'All' },
    { value: 'ISS', label: 'ISS', icon: '🛸' },
    { value: 'Moon Base', label: 'Moon Base', icon: '🌕' },
    { value: 'Pressurized Rover', label: 'Rover', icon: '🚗' },
    { value: 'Spacesuit', label: 'Spacesuit', icon: '👨‍🚀' },
  ]

const RISK_OPTIONS: Array<{
  value: RiskLevel | 'all'
  label: string
  cls: string
}> = [
  { value: 'all', label: 'All', cls: 'border-white/20 text-gray-400 hover:border-white/40' },
  {
    value: 'critical',
    label: 'Critical',
    cls: 'border-red-500/40 text-red-300 data-[active=true]:bg-red-500/20',
  },
  {
    value: 'high',
    label: 'High',
    cls: 'border-orange-500/40 text-orange-300 data-[active=true]:bg-orange-500/20',
  },
  {
    value: 'medium',
    label: 'Medium',
    cls: 'border-yellow-500/40 text-yellow-300 data-[active=true]:bg-yellow-500/20',
  },
  {
    value: 'low',
    label: 'Low',
    cls: 'border-green-500/40 text-green-300 data-[active=true]:bg-green-500/20',
  },
]

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'risk-desc', label: 'Risk Score ↓' },
  { value: 'risk-asc', label: 'Risk Score ↑' },
  { value: 'name-asc', label: 'Name A–Z' },
]

function activeFilterCount(f: Filters): number {
  let n = 0
  if (f.search.trim()) n++
  if (f.fuel !== 'all') n++
  if (f.mission !== 'all') n++
  if (f.risk !== 'all') n++
  return n
}

// ─── Detail Modal ───────────────────────────────────────────
function DetailModal({
  experiment,
  onClose,
}: {
  experiment: Experiment
  onClose: () => void
}) {
  const exp = experiment
  const recs = SAFETY_RECOMMENDATIONS.filter(r => r.relatedExperiments.includes(exp.id))
  const envOrder: MissionEnvironment[] = ['ISS', 'Moon Base', 'Pressurized Rover', 'Spacesuit', 'Earth']

  const smokeBadge = {
    none: 'bg-green-500/20 text-green-300 border-green-500/40',
    low: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    moderate: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    high: 'bg-red-500/20 text-red-300 border-red-500/40',
  }[exp.smokeProduction]

  const shapeBadge: Record<string, string> = {
    spherical: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    teardrop: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    flat: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    irregular: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card"
        style={{ borderLeft: `4px solid ${exp.color}` }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: exp.color }}
              >
                {exp.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/10">
                {exp.category}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {exp.fullName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {exp.pi} · {exp.institution} · {exp.years}
            </p>
          </div>

          {/* Key Findings */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Key Findings
            </h3>
            <ul className="space-y-2">
              {exp.keyFindings.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                  <span style={{ color: exp.color }} className="mt-1 flex-shrink-0 text-xs">▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'O₂ Range',
                value: `${exp.o2Range[0]}% – ${exp.o2Range[1]}%`,
                icon: <Droplets className="w-4 h-4" />,
                color: '#00cfff',
              },
              {
                label: 'Pressure Range',
                value: `${exp.pressureRange[0]} – ${exp.pressureRange[1]} kPa`,
                icon: <Gauge className="w-4 h-4" />,
                color: '#f59e0b',
              },
              {
                label: 'Airflow Range',
                value: `${exp.airflowRange[0]} – ${exp.airflowRange[1]} cm/s`,
                icon: <Wind className="w-4 h-4" />,
                color: '#10b981',
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="glass-card p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5" style={{ color }}>
                  {icon}
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {label}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize',
                shapeBadge[exp.flameShape]
              )}
            >
              <Flame className="w-3 h-3" />
              {exp.flameShape} flame
            </span>
            <span
              className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize',
                smokeBadge
              )}
            >
              Smoke: {exp.smokeProduction}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-gray-300 capitalize">
              Fuel: {exp.fuelType}
            </span>
          </div>

          {/* Suppression Effectiveness */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Suppression Effectiveness
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">{exp.suppressionEffectiveness}</p>
          </div>

          {/* Environment Relevance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Environment Relevance
            </h3>
            <div className="space-y-2.5">
              {envOrder.map(envId => {
                const profile = MISSION_PROFILES.find(p => p.id === envId)!
                const val = exp.safetyRelevance[envId]
                return (
                  <div key={envId} className="flex items-center gap-3">
                    <span className="text-sm w-4">{profile.icon}</span>
                    <span className="text-xs text-gray-400 w-28 flex-shrink-0">{profile.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: profile.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-400 w-9 text-right">{val}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Safety Recommendations */}
          {recs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Safety Recommendations
              </h3>
              <div className="space-y-3">
                {recs.map(rec => (
                  <div
                    key={rec.id}
                    className="glass-card p-3 border-l-2"
                    style={{
                      borderLeftColor:
                        rec.priority === 'immediate'
                          ? '#ef4444'
                          : rec.priority === 'high'
                          ? '#f97316'
                          : rec.priority === 'medium'
                          ? '#eab308'
                          : '#22c55e',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <ShieldAlert className="w-3 h-3 text-flame-400" />
                      <span className="text-xs font-semibold text-white">{rec.title}</span>
                      <span
                        className={clsx(
                          'text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold',
                          {
                            'border-red-500/40 text-red-300 bg-red-500/10':
                              rec.priority === 'immediate',
                            'border-orange-500/40 text-orange-300 bg-orange-500/10':
                              rec.priority === 'high',
                            'border-yellow-500/40 text-yellow-300 bg-yellow-500/10':
                              rec.priority === 'medium',
                            'border-green-500/40 text-green-300 bg-green-500/10':
                              rec.priority === 'long-term',
                          }
                        )}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{rec.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
            <a
              href={exp.psiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4"
            >
              <ExternalLink className="w-3.5 h-3.5" /> PSI Repository
            </a>
            <a
              href={exp.nasaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-4"
            >
              <ExternalLink className="w-3.5 h-3.5" /> NASA Explorer
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Pill Button ─────────────────────────────────────────────
function PillButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
        active
          ? 'bg-flame-500/20 border-flame-500/60 text-flame-300'
          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200',
        className
      )}
      data-active={active}
    >
      {children}
    </button>
  )
}

// ─── Empty State ─────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 rounded-full bg-flame-500/10 border border-flame-500/20 flex items-center justify-center mb-4">
        <Flame className="w-7 h-7 text-flame-500/60" />
      </div>
      <h3 className="text-lg font-display font-bold text-white mb-2">No experiments found</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        Your filters returned no results. Try adjusting the search or clearing some filters.
      </p>
      <button onClick={onReset} className="btn-secondary text-sm">
        Clear all filters
      </button>
    </motion.div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
const DEFAULT_FILTERS: Filters = {
  search: '',
  fuel: 'all',
  mission: 'all',
  risk: 'all',
  sort: 'risk-desc',
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...EXPERIMENTS]
    const q = filters.search.trim().toLowerCase()

    if (q) {
      list = list.filter(e => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.fullName.toLowerCase().includes(q) ||
          e.fuels.some(f => f.toLowerCase().includes(q)) ||
          e.tags.some(t => t.toLowerCase().includes(q)) ||
          e.keyFindings.some(kf => kf.toLowerCase().includes(q))
        )
      })
    }

    if (filters.fuel !== 'all') {
      list = list.filter(e => e.fuelType === filters.fuel)
    }

    if (filters.mission !== 'all') {
      // filter: relevance >= 70 for selected mission
      list = list.filter(e => (e.safetyRelevance[filters.mission as MissionEnvironment] ?? 0) >= 50)
    }

    if (filters.risk !== 'all') {
      list = list.filter(e => e.riskLevel === filters.risk)
    }

    // Sort
    if (filters.sort === 'risk-desc') list.sort((a, b) => b.riskScore - a.riskScore)
    else if (filters.sort === 'risk-asc') list.sort((a, b) => a.riskScore - b.riskScore)
    else if (filters.sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [filters])

  const activeBadgeCount = activeFilterCount(filters)

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label block mb-2">PSI Repository</span>
          <h1 className="section-title">
            Experiment{' '}
            <span className="gradient-text-flame">Explorer</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Catalog of <strong className="text-white">8 NASA microgravity combustion experiments</strong>{' '}
            from the Physical Sciences Informatics (PSI) repository — with fire-safety relevance
            scores for every mission environment.
          </p>
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.div
          className="glass-card mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Filter header / toggle */}
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setFiltersOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-flame-400" />
              <span className="text-sm font-semibold text-gray-200">Filters & Search</span>
              {activeBadgeCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-flame-500 text-[10px] font-bold text-white">
                  {activeBadgeCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeBadgeCount > 0 && (
                <button
                  onClick={e => { e.stopPropagation(); resetFilters() }}
                  className="text-xs text-gray-500 hover:text-flame-400 transition-colors px-2 py-0.5 rounded hover:bg-flame-500/10"
                >
                  Clear all
                </button>
              )}
              {filtersOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4 border-t border-white/5">
                  {/* Search input */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search experiments, fuels, tags, findings…"
                      value={filters.search}
                      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-flame-500/50 focus:bg-flame-500/5 transition-all"
                    />
                    {filters.search && (
                      <button
                        onClick={() => setFilters(f => ({ ...f, search: '' }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filters row */}
                  <div className="flex flex-wrap gap-y-4 gap-x-6">
                    {/* Fuel type */}
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2">
                        Fuel Type
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {FUEL_OPTIONS.map(opt => (
                          <PillButton
                            key={opt.value}
                            active={filters.fuel === opt.value}
                            onClick={() =>
                              setFilters(f => ({
                                ...f,
                                fuel: opt.value === f.fuel ? 'all' : opt.value,
                              }))
                            }
                          >
                            {opt.icon}
                            {opt.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Mission */}
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2">
                        Mission
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {MISSION_OPTIONS.map(opt => (
                          <PillButton
                            key={opt.value}
                            active={filters.mission === opt.value}
                            onClick={() =>
                              setFilters(f => ({
                                ...f,
                                mission: opt.value === f.mission ? 'all' : opt.value,
                              }))
                            }
                          >
                            {opt.icon && <span>{opt.icon}</span>}
                            {opt.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Risk level */}
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2">
                        Risk Level
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {RISK_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              setFilters(f => ({
                                ...f,
                                risk: opt.value === f.risk ? 'all' : opt.value,
                              }))
                            }
                            className={clsx(
                              'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                              opt.cls,
                              filters.risk === opt.value
                                ? 'opacity-100'
                                : 'opacity-70 bg-white/5 hover:opacity-100'
                            )}
                            data-active={filters.risk === opt.value}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="ml-auto">
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2">
                        Sort By
                      </p>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                        <select
                          value={filters.sort}
                          onChange={e =>
                            setFilters(f => ({ ...f, sort: e.target.value as SortOption }))
                          }
                          className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-flame-500/50 appearance-none cursor-pointer"
                        >
                          {SORT_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Results header ── */}
        <motion.div
          className="flex items-center justify-between mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="text-white font-semibold">{filtered.length}</span>
            {' '}of{' '}
            <span className="text-white font-semibold">{EXPERIMENTS.length}</span>
            {' '}experiments
            {filters.mission !== 'all' && (
              <span className="text-flame-400 ml-1">
                · {MISSION_OPTIONS.find(m => m.value === filters.mission)?.icon}{' '}
                {filters.mission}
              </span>
            )}
          </p>

          {activeBadgeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-flame-400 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </motion.div>

        {/* ── Experiment Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <div className="grid grid-cols-1">
              <EmptyState onReset={resetFilters} />
            </div>
          ) : (
            <motion.div
              key={JSON.stringify(filters)}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filtered.map(exp => (
                <motion.div key={exp.id} variants={cardVariants} layout>
                  <ExperimentCard
                    experiment={exp}
                    selectedEnvironment={
                      filters.mission !== 'all' ? (filters.mission as MissionEnvironment) : undefined
                    }
                    onClick={() => setSelectedExp(exp)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scientific Data Explorer (Facts & Ranges) ── */}
      <div className="mt-16 pt-12 border-t border-white/10">
        <ScientificDataExplorer />
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedExp && (
          <DetailModal
            experiment={selectedExp}
            onClose={() => setSelectedExp(null)}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
