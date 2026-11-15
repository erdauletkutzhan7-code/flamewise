import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  ChevronDown, ChevronUp, Info, BarChart2, Sliders,
} from 'lucide-react'
import clsx from 'clsx'
import PageWrapper from '../components/PageWrapper'
import {
  EXPERIMENTS,
  MISSION_PROFILES,
  computeRiskScore,
  getRiskLevel,
  getRiskColor,
  type MissionEnvironment,
} from '../data/experiments'

// ── helpers ──────────────────────────────────────────────────────────────────

const RISK_BADGE: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border border-red-500/40',
  high:     'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  medium:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  low:      'bg-green-500/20 text-green-400 border border-green-500/40',
}

const RANK_WHY: Record<string, string> = {
  1: 'Highest combined relevance score for the selected environment and atmosphere conditions.',
  2: 'Second-highest risk contribution — directly addresses the most likely ignition scenario.',
  3: 'Third-critical finding — covers a detection or suppression gap specific to this environment.',
}

const ENV_ICONS: Record<MissionEnvironment, string> = {
  'ISS':              '🛸',
  'Moon Base':        '🌕',
  'Pressurized Rover':'🚗',
  'Spacesuit':        '👨‍🚀',
  'Earth':            '🌍',
}

// ── component ─────────────────────────────────────────────────────────────────

export default function RankingPage() {
  const [selectedEnv, setSelectedEnv] = useState<MissionEnvironment>('ISS')
  const [showChart, setShowChart] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const profile = useMemo(
    () => MISSION_PROFILES.find(p => p.id === selectedEnv)!,
    [selectedEnv],
  )

  const [o2, setO2]           = useState<number>(profile.o2Percent)
  const [pressure, setPressure] = useState<number>(profile.pressure)

  // when environment changes, reset sliders to that profile's defaults
  function selectEnv(env: MissionEnvironment) {
    const p = MISSION_PROFILES.find(x => x.id === env)!
    setSelectedEnv(env)
    setO2(p.o2Percent)
    setPressure(p.pressure)
    setExpandedId(null)
  }

  const o2Factor   = o2 > 25 ? 1 + (o2 - 25) * 0.02 : 1.0
  const pressFactor = pressure < 70 ? 1 + (70 - pressure) * 0.005 : 1.0
  const riskModifier = +(o2Factor * pressFactor).toFixed(2)

  const ranked = useMemo(() => {
    return [...EXPERIMENTS]
      .map(exp => ({
        exp,
        score: computeRiskScore(exp, selectedEnv, o2, pressure),
      }))
      .sort((a, b) => b.score - a.score)
  }, [selectedEnv, o2, pressure])

  // chart data: compare all experiments across all environments
  const chartData = useMemo(() =>
    EXPERIMENTS.map(exp => ({
      name: exp.name.split('/')[0].trim(),
      ISS:            exp.safetyRelevance['ISS'],
      'Moon Base':    exp.safetyRelevance['Moon Base'],
      'Rover':        exp.safetyRelevance['Pressurized Rover'],
      'Spacesuit':    exp.safetyRelevance['Spacesuit'],
    })),
  [])

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-flame-500/15 border border-flame-500/30 text-flame-400 text-xs font-mono uppercase tracking-widest mb-3">
            Dynamic Ranking Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
            Scenario-Based{' '}
            <span className="text-flame-400">
              Investigation Relevance
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Deterministic matching of NASA microgravity combustion investigations against specific exploration 
            mission profiles (ISS, Moon, Mars rover, EVA suit).
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded bg-slate-900/80 border border-white/10 text-[11px] font-mono text-cyan-400">
            TRANSPARENCY NOTE: Scores indicate contextual research relevance; they do not calculate statistical probability of real spacecraft fire.
          </div>
        </motion.div>

        {/* SCENARIO SELECTOR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-flame-500/50" />
            Mission Environment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MISSION_PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => selectEnv(p.id)}
                className={clsx(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center group',
                  selectedEnv === p.id
                    ? 'border-flame-500/60 bg-flame-500/10 shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                    : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]',
                )}
              >
                <span className="text-3xl">{ENV_ICONS[p.id]}</span>
                <span className="font-semibold text-sm text-white">{p.name}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{p.atmosphere.split('(')[0].trim()}</span>
                <span className="text-[10px] text-orange-400 mt-1 leading-tight">{p.primaryRisks[0]}</span>
                {selectedEnv === p.id && (
                  <motion.div
                    layoutId="env-indicator"
                    className="absolute inset-0 rounded-xl ring-1 ring-flame-500/40"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* SLIDER PANEL */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sliders size={16} className="text-flame-400" />
            <h2 className="font-semibold text-white">Environment Conditions</h2>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-flame-500/10 border border-flame-500/30">
              <span className="text-xs text-gray-400">Risk Modifier:</span>
              <span
                className="font-mono font-bold text-sm"
                style={{ color: riskModifier > 1.3 ? '#ef4444' : riskModifier > 1.1 ? '#f97316' : '#22c55e' }}
              >
                ×{riskModifier}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* O2 Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  O₂ Concentration
                </label>
                <span className="font-mono text-flame-400 font-bold">{o2}%</span>
              </div>
              <input
                type="range" min={15} max={100} step={1} value={o2}
                onChange={e => setO2(Number(e.target.value))}
                className="w-full accent-flame-500 h-2 rounded-lg appearance-none cursor-pointer bg-white/10"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>15% (min viable)</span><span>21% (Earth)</span><span>100% (EVA)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Above 25% O₂, flammability limits widen dramatically — FLARE/BASS show ignition probability
                rises by {Math.round((o2Factor - 1) * 100)}% at current setting.
              </p>
            </div>

            {/* Pressure Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Cabin Pressure
                </label>
                <span className="font-mono text-flame-400 font-bold">{pressure} kPa</span>
              </div>
              <input
                type="range" min={20} max={101} step={1} value={pressure}
                onChange={e => setPressure(Number(e.target.value))}
                className="w-full accent-flame-500 h-2 rounded-lg appearance-none cursor-pointer bg-white/10"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>20 kPa</span><span>55 kPa (Moon)</span><span>101 kPa (Earth)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Below 70 kPa, FLARE data shows lean flammability limits extend 20–30% lower — fires
                ignite in thinner atmospheres. Current amplifier: {pressFactor > 1 ? `+${Math.round((pressFactor - 1) * 100)}%` : 'nominal'}.
              </p>
            </div>
          </div>
        </motion.section>

        {/* RANKED LIST */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-flame-500/50" />
            Ranked by Risk Score — {profile.name}
          </h2>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {ranked.map(({ exp, score }, idx) => {
                const level = getRiskLevel(score)
                const color = getRiskColor(level)
                const isExpanded = expandedId === exp.id
                const rank = idx + 1

                return (
                  <motion.div
                    key={exp.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30, delay: idx * 0.03 }}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className={clsx(
                        'w-full text-left glass-card p-4 hover:border-white/15 transition-all duration-200',
                        isExpanded && 'border-white/15',
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank number */}
                        <div
                          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm"
                          style={{ background: `${color}20`, color }}
                        >
                          #{rank}
                        </div>

                        {/* Experiment name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{exp.name}</span>
                            <span className="text-xs text-gray-500">{exp.category}</span>
                            {rank <= 3 && (
                              <span className="relative group/tooltip">
                                <Info size={12} className="text-flame-400 cursor-help" />
                                <span className="absolute left-0 bottom-5 z-20 w-56 p-2 rounded-lg bg-space-800 border border-white/10 text-xs text-gray-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl">
                                  {RANK_WHY[rank]}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* Score bar */}
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.05 }}
                              />
                            </div>
                            <span className="font-mono text-sm font-bold" style={{ color }}>{score}</span>
                          </div>
                        </div>

                        {/* Risk badge */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className={clsx('px-2 py-0.5 rounded-md text-xs font-mono uppercase', RISK_BADGE[level])}>
                            {level}
                          </span>
                          {isExpanded
                            ? <ChevronUp size={14} className="text-gray-500" />
                            : <ChevronDown size={14} className="text-gray-500" />}
                        </div>
                      </div>

                      {/* Expanded findings */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
                                Key Findings Relevant to {profile.name}
                              </p>
                              <ul className="space-y-2">
                                {exp.keyFindings.slice(0, 3).map((finding, fi) => (
                                  <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                                    {finding}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                <span>PI: {exp.pi}</span>
                                <span>·</span>
                                <span>{exp.institution}</span>
                                <span>·</span>
                                <span>{exp.years}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* RANK HISTORY CHART TOGGLE */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button
            onClick={() => setShowChart(v => !v)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-flame-400 transition-colors"
          >
            <BarChart2 size={16} />
            {showChart ? 'Hide' : 'Show'} ranking comparison across environments
            {showChart ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {showChart && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-6 mt-4">
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Safety Relevance by Environment
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Base relevance scores (before O₂/pressure modifiers) across all environments
                  </p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: '#050c16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: '#d1d5db' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }} />
                      <Bar dataKey="ISS"       fill="#00cfff" radius={[2,2,0,0]} />
                      <Bar dataKey="Moon Base" fill="#94a3b8" radius={[2,2,0,0]} />
                      <Bar dataKey="Rover"     fill="#f97316" radius={[2,2,0,0]} />
                      <Bar dataKey="Spacesuit" fill="#fbbf24" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

      </div>
    </PageWrapper>
  )
}
