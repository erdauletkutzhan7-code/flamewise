import PageWrapper from '../components/PageWrapper'
import { MISSION_PROFILES, SAFETY_RECOMMENDATIONS, HISTORICAL_INCIDENTS } from '../data/experiments'
import { ShieldAlert, BookOpen, AlertTriangle } from 'lucide-react'

export default function InsightsPage() {
  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Fire Safety Insights Engine</h1>
        <p className="text-gray-400">SI-powered decision synthesis grounded in NASA microgravity combustion research.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4 text-flame-400">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Target Environmental Profiles</h2>
          </div>
          <div className="space-y-4">
            {MISSION_PROFILES.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">{p.icon} {p.name}</span>
                  <span className="text-xs font-mono text-cyan-400">{p.pressure} kPa · {p.o2Percent}% O₂</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{p.atmosphere}</p>
                <div className="text-xs text-flame-300"><strong>Risks:</strong> {p.primaryRisks.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4 text-cyan-400">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Key Safety Recommendations</h2>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {SAFETY_RECOMMENDATIONS.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-flame-400">{r.category} · {r.priority}</span>
                </div>
                <h3 className="font-medium text-sm text-white mb-1">{r.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{r.detail}</p>
                <div className="text-[11px] text-gray-500 font-mono">Source: {r.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Historical Spacecraft Fire Incidents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HISTORICAL_INCIDENTS.map(inc => (
            <div key={inc.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-red-400 uppercase tracking-widest">{inc.severity}</span>
                <h3 className="font-bold text-white mt-1 mb-1">{inc.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{inc.date} · {inc.location}</p>
                <p className="text-xs text-gray-300 mb-3">{inc.cause}</p>
              </div>
              <div className="border-t border-white/5 pt-2 text-[11px] text-gray-400">
                <strong>Lessons:</strong> {inc.lessonsLearned[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
