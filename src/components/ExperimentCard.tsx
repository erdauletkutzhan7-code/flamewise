import { useState } from 'react'
import { motion } from 'framer-motion'
import { type Experiment, type MissionEnvironment, MISSION_PROFILES } from '../data/experiments'
import { ExternalLink, Beaker, Wind, Flame } from 'lucide-react'
import clsx from 'clsx'

export interface ExperimentCardProps {
  experiment: Experiment
  selectedEnvironment?: MissionEnvironment
  onClick?: () => void
}

function FuelIcon({ type }: { type: Experiment['fuelType'] }) {
  if (type === 'solid') return <Flame className="w-3.5 h-3.5" />
  if (type === 'liquid') return <Beaker className="w-3.5 h-3.5" />
  if (type === 'gaseous') return <Wind className="w-3.5 h-3.5" />
  return <Flame className="w-3.5 h-3.5" />
}

function RiskBadge({ level }: { level: Experiment['riskLevel'] }) {
  const cls = clsx(
    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border',
    {
      'risk-critical': level === 'critical',
      'risk-high': level === 'high',
      'risk-medium': level === 'medium',
      'risk-low': level === 'low',
    }
  )
  return <span className={cls}>{level}</span>
}

function CircularProgress({ score, color }: { score: number; color: string }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
        {/* Track */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white leading-none">{score}</span>
        <span className="text-[9px] text-gray-500 leading-none mt-0.5">risk</span>
      </div>
    </div>
  )
}

function RelevanceBar({
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: string
  icon: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{icon}</span>
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] text-gray-500 w-7 text-right font-mono">{value}%</span>
    </div>
  )
}

export default function ExperimentCard({
  experiment: exp,
  onClick,
}: ExperimentCardProps) {
  const [hovered, setHovered] = useState(false)

  const relevanceEnvs = MISSION_PROFILES.filter(p => p.id !== 'Earth')

  const keyFinding = exp.keyFindings[0]
  const truncatedFinding =
    keyFinding.length > 100 ? keyFinding.slice(0, 100) + '…' : keyFinding

  const o2Min = exp.o2Range[0]
  const o2Max = exp.o2Range[1]
  const o2BarLeft = ((o2Min - 10) / 60) * 100
  const o2BarWidth = ((o2Max - o2Min) / 60) * 100

  return (
    <motion.div
      className="glass-card-flame cursor-pointer flex flex-col h-full relative"
      style={{
        borderLeft: `3px solid ${exp.color}`,
        boxShadow: hovered
          ? `0 8px 40px rgba(0,0,0,0.6), 0 0 30px ${exp.color}22, inset 0 1px 0 rgba(255,107,0,0.12)`
          : undefined,
      }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      layout
    >
      {/* Top glow accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, ${exp.color}80, transparent)` }}
      />

      <div className="p-4 flex flex-col gap-3 h-full">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-bold text-white leading-tight truncate">
              {exp.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300 border border-white/10">
                {exp.category}
              </span>
              <RiskBadge level={exp.riskLevel} />
            </div>
          </div>

          {/* Circular risk score */}
          <CircularProgress score={exp.riskScore} color={exp.color} />
        </div>

        {/* ── Hardware & Facility ── */}
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 border border-white/5 text-gray-400">
            {exp.hardware.split(' (')[0]}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 border border-white/5 text-cyan-400">
            {exp.facility}
          </span>
        </div>

        {/* ── Fuel type ── */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500" style={{ color: exp.color }}>
            <FuelIcon type={exp.fuelType} />
          </span>
          <span className="text-xs text-gray-400 capitalize font-medium">{exp.fuelType}</span>
          <span className="text-gray-600 text-xs">·</span>
          <span className="text-xs text-gray-500 truncate">
            {exp.fuels.slice(0, 2).join(', ')}
            {exp.fuels.length > 2 && (
              <span className="text-gray-600"> +{exp.fuels.length - 2}</span>
            )}
          </span>
        </div>

        {/* ── O₂ Range Bar ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 font-mono">O₂ range</span>
            <span className="text-[10px] text-gray-400 font-mono font-semibold">
              {o2Min}–{o2Max}%
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
            {/* Safe zone marker at 21% */}
            <div
              className="absolute top-0 bottom-0 w-px bg-green-500/40"
              style={{ left: `${((21 - 10) / 60) * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 h-full rounded-full"
              style={{
                left: `${o2BarLeft}%`,
                width: `${o2BarWidth}%`,
                backgroundColor: exp.color,
                opacity: 0.8,
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px] text-gray-700 font-mono">10%</span>
            <span className="text-[9px] text-gray-700 font-mono">70%</span>
          </div>
        </div>

        {/* ── Key Finding ── */}
        <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-2 flex-1">
          "{truncatedFinding}"
        </p>

        {/* ── Environment Relevance bars ── */}
        <div className="space-y-1">
          <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
            Env. Relevance
          </span>
          {relevanceEnvs.map(env => (
            <RelevanceBar
              key={env.id}
              label={env.name}
              value={exp.safetyRelevance[env.id]}
              color={env.color}
              icon={env.icon}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 truncate">{exp.pi}</p>
            <p className="text-[10px] text-gray-600 truncate">{exp.years}</p>
          </div>
          <a
            href={exp.psiLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[10px] text-flame-400 hover:text-flame-300 transition-colors whitespace-nowrap"
          >
            PSI Repo <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
