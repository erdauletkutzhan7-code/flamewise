import PageWrapper from '../components/PageWrapper'
import { Rocket, Target, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <PageWrapper className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <span className="text-xs font-mono text-flame-400 tracking-widest uppercase">NASA Space Apps Challenge 2026</span>
        <h1 className="text-3xl font-display font-bold text-white mt-1 mb-2">About Flame in Freefall · SOLFORGE</h1>
        <p className="text-gray-400 text-sm">Grounded scientific translation of microgravity combustion research for real-world space fire safety.</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-flame-400" /> Mission Statement
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            SOLFORGE (Flame in Freefall) bridges NASA Physical Sciences Informatics (PSI) combustion datasets with 
            practical spacecraft safety engineering. In extraterrestrial missions (ISS, Lunar Gateway, Artemis Moon Base, 
            and Mars transfer vehicles), atmospheric fires behave with lethality distinct from terrestrial fire risks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="p-3 bg-white/[0.02] rounded-lg">
              <div className="text-flame-400 font-bold text-lg font-mono">100%</div>
              <div className="text-xs text-gray-400">NASA Sourced Data</div>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-lg">
              <div className="text-cyan-400 font-bold text-lg font-mono">8+</div>
              <div className="text-xs text-gray-400">Major ISS Experiments</div>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-lg">
              <div className="text-amber-400 font-bold text-lg font-mono">Zero</div>
              <div className="text-xs text-gray-400">Fabricated Metrics</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" /> Official NASA Data References
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-center justify-between p-2 bg-white/[0.02] rounded border border-white/5">
              <span>NASA Physical Sciences Informatics (PSI) Repository — Combustion Science</span>
              <a href="https://psi.nasa.gov/physci/repo/search?q=combustion" target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 hover:underline">
                psi.nasa.gov <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li className="flex items-center justify-between p-2 bg-white/[0.02] rounded border border-white/5">
              <span>NASA Technical Reports Server (NTRS) Combustion Science Collections</span>
              <a href="https://ntrs.nasa.gov" target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 hover:underline">
                ntrs.nasa.gov <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li className="flex items-center justify-between p-2 bg-white/[0.02] rounded border border-white/5">
              <span>ISS Researcher Guide to Combustion Science (NASA Glenn Research Center)</span>
              <a href="https://www.nasa.gov/mission_pages/station/research/experiments/explorer" target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 hover:underline">
                nasa.gov <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  )
}
