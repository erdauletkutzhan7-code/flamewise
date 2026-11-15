import clsx from 'clsx'
import type { RiskLevel } from '../data/experiments'

interface RiskBadgeProps {
  level: RiskLevel
  score?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function RiskBadge({ level, score, size = 'md', className }: RiskBadgeProps) {
  const labels: Record<RiskLevel, string> = {
    critical: 'CRITICAL',
    high:     'HIGH',
    medium:   'MEDIUM',
    low:      'LOW',
  }
  const styles: Record<RiskLevel, string> = {
    critical: 'bg-red-500/20 border-red-500/50 text-red-300',
    high:     'bg-orange-500/20 border-orange-500/50 text-orange-300',
    medium:   'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    low:      'bg-green-500/20 border-green-500/50 text-green-300',
  }
  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5 font-bold',
  }

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-full border font-semibold tracking-wider',
      styles[level], sizes[size], className
    )}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {labels[level]}
      {score !== undefined && <span className="opacity-60 font-mono ml-0.5">· {score}</span>}
    </span>
  )
}

/* ─── RiskGauge ─── */
interface RiskGaugeProps {
  score: number         // 0-100
  size?: number         // svg px
  strokeWidth?: number
  label?: string
  color?: string
}

export function RiskGauge({ score, size = 120, strokeWidth = 10, label, color }: RiskGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const autoColor = score >= 85 ? '#ef4444'
                  : score >= 65 ? '#f97316'
                  : score >= 40 ? '#eab308'
                  : '#22c55e'

  const c = color ?? autoColor

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={c} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${c})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold" style={{ color: c }}>{score}</span>
        {label && <span className="text-[9px] text-gray-500 tracking-wider uppercase mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
