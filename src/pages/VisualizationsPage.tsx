import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'
import PageWrapper from '../components/PageWrapper'
import { EXPERIMENTS, SPINOFF_APPLICATIONS } from '../data/experiments'
import type { SpinoffApplication } from '../data/experiments'

// ─── Flame Shape SVG ─────────────────────────────────────────

function EarthFlame() {
  return (
    <svg viewBox="0 0 120 180" className="w-full h-full" aria-label="Earth flame">
      <defs>
        <radialGradient id="earthFlameGrad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7a0" />
          <stop offset="30%" stopColor="#ffb300" />
          <stop offset="70%" stopColor="#ff6b00" />
          <stop offset="100%" stopColor="#c62828" stopOpacity="0.3" />
        </radialGradient>
        <filter id="earthGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes flicker {
            0%,100% { transform: scaleX(1) scaleY(1) translateY(0); }
            25% { transform: scaleX(0.95) scaleY(1.04) translateY(-2px); }
            50% { transform: scaleX(1.03) scaleY(0.97) translateY(1px); }
            75% { transform: scaleX(0.97) scaleY(1.03) translateY(-1px); }
          }
          .flicker-anim { animation: flicker 1.6s ease-in-out infinite; transform-origin: 60px 160px; }
        `}</style>
      </defs>
      {/* candle body */}
      <rect x="48" y="155" width="24" height="20" rx="3" fill="#f5f5dc" />
      {/* wick */}
      <line x1="60" y1="155" x2="60" y2="148" stroke="#555" strokeWidth="1.5" />
      {/* flame teardrop */}
      <g className="flicker-anim" filter="url(#earthGlow)">
        <path
          d="M60,20 C80,55 90,90 80,120 C72,145 48,145 40,120 C30,90 40,55 60,20Z"
          fill="url(#earthFlameGrad)"
          opacity="0.95"
        />
        {/* inner hot core */}
        <ellipse cx="60" cy="115" rx="10" ry="20" fill="#fffde7" opacity="0.9" />
      </g>
    </svg>
  )
}

function MicrogravityFlame() {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full" aria-label="Microgravity flame">
      <defs>
        <radialGradient id="ugFlameGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0f7ff" />
          <stop offset="30%" stopColor="#00e5ff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#0066cc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#001a66" stopOpacity="0.1" />
        </radialGradient>
        <filter id="ugGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes ugPulse {
            0%,100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.06); opacity: 1; }
          }
          .ug-pulse { animation: ugPulse 3s ease-in-out infinite; transform-origin: 80px 80px; }
        `}</style>
      </defs>
      <g className="ug-pulse" filter="url(#ugGlow)">
        {/* outer halo */}
        <circle cx="80" cy="80" r="60" fill="url(#ugFlameGrad)" opacity="0.4" />
        {/* main sphere */}
        <circle cx="80" cy="80" r="44" fill="url(#ugFlameGrad)" opacity="0.85" />
        {/* inner bright core */}
        <circle cx="80" cy="80" r="18" fill="#e0f7ff" opacity="0.7" />
      </g>
    </svg>
  )
}

// ─── Heatmap / Bar Chart data ─────────────────────────────────

const heatmapData = EXPERIMENTS.map(exp => ({
  name: exp.id === 'SAFFIRE-I' ? 'Saffire' : exp.id,
  fullName: exp.name,
  ISS: exp.safetyRelevance['ISS'],
  Moon: exp.safetyRelevance['Moon Base'],
  Rover: exp.safetyRelevance['Pressurized Rover'],
  Suit: exp.safetyRelevance['Spacesuit'],
}))

// ─── O₂ Flammability data ────────────────────────────────────

const o2FlammabilityData = [
  { o2: 15,  earth: 0,    ug: 0.15, suit: 0.4  },
  { o2: 20,  earth: 0.05, ug: 0.28, suit: 0.65 },
  { o2: 21,  earth: 0.10, ug: 0.33, suit: 0.72 },
  { o2: 25,  earth: 0.22, ug: 0.48, suit: 0.88 },
  { o2: 30,  earth: 0.40, ug: 0.68, suit: 1.05 },
  { o2: 35,  earth: 0.58, ug: 0.85, suit: 1.25 },
  { o2: 40,  earth: 0.72, ug: 0.98, suit: 1.45 },
  { o2: 50,  earth: 0.90, ug: 1.18, suit: 1.72 },
  { o2: 65,  earth: 1.05, ug: 1.38, suit: 2.05 },
  { o2: 80,  earth: 1.15, ug: 1.55, suit: 2.4  },
  { o2: 100, earth: 1.25, ug: 1.75, suit: 2.8  },
]

// ─── Smoke particle size data ────────────────────────────────

const smokeData = [
  { material: 'Teflon',  earth: 0.08, ug: 0.72, threshold: 0.3 },
  { material: 'Kapton',  earth: 0.12, ug: 0.65, threshold: 0.3 },
  { material: 'Cotton',  earth: 0.18, ug: 0.55, threshold: 0.3 },
  { material: 'PMMA',    earth: 0.14, ug: 0.48, threshold: 0.3 },
]

// ─── Custom Tooltip ───────────────────────────────────────────

function HeatmapTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  const exp = EXPERIMENTS.find(e => (e.id === 'SAFFIRE-I' ? 'Saffire' : e.id) === label)
  return (
    <div className="bg-space-900 border border-white/10 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-white font-semibold mb-1">{exp?.name ?? label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function SmokeTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-space-900 border border-white/10 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill ?? p.stroke }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-medium">{p.value} μm</span>
        </div>
      ))}
      <p className="text-yellow-400 text-xs mt-1">Detector threshold: 0.3 μm</p>
    </div>
  )
}

// ─── Animated counter ────────────────────────────────────────

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!inView) return
    const num = parseFloat(target.replace(/[^0-9.]/g, ''))
    const isDecimal = target.includes('.')
    const duration = 1600
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * num
      setDisplayed(isDecimal ? current.toFixed(1) : Math.round(current).toString())
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{displayed}{suffix}</span>
}

// ─── Spinoff Card ─────────────────────────────────────────────

const sectorColors: Record<string, string> = {
  firefighting: 'bg-red-500/20 text-red-400 border-red-500/30',
  detection: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  materials: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  aviation: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  medicine: 'bg-green-500/20 text-green-400 border-green-500/30',
}

function SpinoffCard({ item, index }: { item: SpinoffApplication; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  // Extract numeric part for the counter
  const numMatch = item.impact.match(/[\d,]+/)
  const numStr = numMatch ? numMatch[0].replace(/,/g, '') : null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-5 flex flex-col gap-3 hover:border-flame-500/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-white font-semibold text-sm leading-tight">{item.title}</h4>
        <span className={`text-xs border rounded-full px-2 py-0.5 whitespace-nowrap ${sectorColors[item.sector] ?? 'bg-white/10 text-white/60 border-white/20'}`}>
          {item.sector}
        </span>
      </div>
      <p className="text-white/60 text-xs leading-relaxed">{item.description}</p>
      <div className="bg-white/5 rounded-lg p-3 text-center">
        <p className="text-flame-400 font-bold text-lg">
          {inView && numStr
            ? <><AnimatedCounter target={numStr} />{item.impact.replace(/[\d,]+/, '').substring(0, 30)}</>
            : item.impact.substring(0, 40) + '…'
          }
        </p>
      </div>
      <p className="text-white/40 text-xs">Source: {item.origin}</p>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function VisualizationsPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-6"
        >
          <span className="section-label">Science &amp; Data</span>
          <h1 className="section-title mt-2">Data Visualizations</h1>
          <p className="text-white/50 max-w-2xl mx-auto text-sm mt-2">
            Interactive charts and scientific visuals drawn from 8 NASA microgravity combustion experiments.
            All data sourced from the PSI Repository and NASA NTRS.
          </p>
        </motion.div>

        {/* ── 1. Flame Shape Comparison ── */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
          >
            <span className="text-flame-500">01</span> Flame Shape: Earth vs Microgravity
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earth Flame */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                  🌍 Earth Gravity (1g)
                </span>
                <span className="text-white/40 text-xs ml-auto">1200°C peak</span>
              </div>
              <div className="h-48 w-32">
                <EarthFlame />
              </div>
              <div className="text-center space-y-1">
                <p className="text-white font-medium text-sm">Teardrop / Candle Shape</p>
                <p className="text-white/50 text-xs">Buoyancy-driven convection pulls hot gases upward, creating the familiar tall narrow flame</p>
                <div className="flex gap-2 justify-center mt-2 flex-wrap">
                  <span className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-2 py-0.5">convection-driven</span>
                  <span className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-2 py-0.5">soot-luminous</span>
                  <span className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-2 py-0.5">CO-lean</span>
                </div>
              </div>
            </motion.div>

            {/* Microgravity Flame */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
                  🛸 Microgravity (μg)
                </span>
                <span className="text-white/40 text-xs ml-auto">800°C (cool: 600°C)</span>
              </div>
              <div className="h-48 w-48">
                <MicrogravityFlame />
              </div>
              <div className="text-center space-y-1">
                <p className="text-white font-medium text-sm">Near-Spherical in μg</p>
                <p className="text-white/50 text-xs">Without gravity, diffusion alone controls the flame — resulting in a perfect sphere that burns cooler and dimmer</p>
                <div className="flex gap-2 justify-center mt-2 flex-wrap">
                  <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded px-2 py-0.5">diffusion-limited</span>
                  <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded px-2 py-0.5">CO-rich ⚠</span>
                  <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded px-2 py-0.5">cool-flame capable</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-xs text-center mt-4"
          >
            Source: FLEX / FLEX-2 (Dr. Forman Williams, UC San Diego / NASA Glenn, 2008–2012)
          </motion.p>
        </section>

        {/* ── 2. Experiment Risk Heatmap ── */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white mb-2 flex items-center gap-2"
          >
            <span className="text-flame-500">02</span> Experiment Safety Relevance by Environment
          </motion.h2>
          <p className="text-white/40 text-xs mb-6">Safety relevance score (0–100) for each experiment across mission environments</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={heatmapData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<HeatmapTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                <Bar dataKey="ISS" name="ISS" fill="#00cfff" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Moon" name="Moon Base" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Rover" name="Pressurized Rover" fill="#f97316" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Suit" name="Spacesuit" fill="#fbbf24" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </section>

        {/* ── 3. O₂ Flammability Limits Chart ── */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white mb-2 flex items-center gap-2"
          >
            <span className="text-flame-500">03</span> O₂ Flammability Limits
          </motion.h2>
          <p className="text-white/40 text-xs mb-6">Normalized flame spread rate vs O₂ concentration for three mission environments</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={o2FlammabilityData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                <XAxis
                  dataKey="o2"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'O₂ Concentration (%)', position: 'insideBottomRight', offset: -10, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'Spread Rate (norm.)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff', fontWeight: 600 }}
                  itemStyle={{ color: '#94a3b8' }}
                  labelFormatter={(v) => `O₂: ${v}%`}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                {/* Danger zone shading */}
                <Area dataKey="suit" name="Spacesuit (100% O₂)" stroke="#ef4444" fill="url(#dangerGrad)" strokeWidth={2} dot={false} />
                <Area dataKey="ug" name="Microgravity (μg)" stroke="#00cfff" fill="none" strokeWidth={2} dot={false} strokeDasharray="6 3" />
                <Area dataKey="earth" name="Earth (1g)" stroke="#10b981" fill="none" strokeWidth={2} dot={false} />
                <ReferenceLine y={1.0} stroke="#ef444488" strokeDasharray="4 2" label={{ value: 'Earth Baseline', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-white/30 text-xs mt-3 text-center">
              Source: BASS (NASA Glenn, 2012–2017) + FLARE (U. Maryland, 2005–2015). Values normalized to Earth 1g at 21% O₂.
            </p>
          </motion.div>
        </section>

        {/* ── 4. Smoke Particle Size Comparison ── */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white mb-1 flex items-center gap-2"
          >
            <span className="text-flame-500">04</span> Why ISS Ionization Detectors Fail
          </motion.h2>
          <p className="text-white/40 text-xs mb-6">
            Smoke particle diameter (μm) — SAME/SAME-R found microgravity smoke is 10–100× larger than Earth predictions.
            Bars exceeding the detector threshold (0.3 μm) are highlighted.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={smokeData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'Particle Diameter (μm)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 11 }}
                  domain={[0, 0.9]}
                />
                <YAxis type="category" dataKey="material" tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                <Tooltip content={<SmokeTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                <ReferenceLine x={0.3} stroke="#fbbf24" strokeDasharray="5 3"
                  label={{ value: 'Detector limit', fill: '#fbbf24', fontSize: 10, position: 'top' }} />
                <Bar dataKey="earth" name="Earth Smoke" fill="#10b981" radius={[0, 2, 2, 0]} />
                <Bar dataKey="ug" name="Microgravity Smoke" fill="#ef4444" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-white/30 text-xs mt-3 text-center">
              Source: SAME / SAME-R (Dr. Albert Abbud-Madrid, Colorado School of Mines, 2007–2017)
            </p>
          </motion.div>
        </section>

        {/* ── 5. Spinoff Impact Cards ── */}
        <section className="pb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-white mb-2 flex items-center gap-2"
          >
            <span className="text-flame-500">05</span> Spinoff Applications
          </motion.h2>
          <p className="text-white/40 text-xs mb-6">Space fire research delivering real-world safety improvements</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPINOFF_APPLICATIONS.map((item, i) => (
              <SpinoffCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>

      </div>
    </PageWrapper>
  )
}
