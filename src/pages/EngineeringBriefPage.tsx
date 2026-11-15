import PageWrapper from '../components/PageWrapper'
import { FileText, Printer, CheckCircle2 } from 'lucide-react'

export default function EngineeringBriefPage() {
  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-flame-400 tracking-widest uppercase">NASA RESEARCH SPECIFICATION</span>
          <h1 className="text-3xl font-display font-bold text-white mt-1">Microgravity Combustion Engineering Brief</h1>
        </div>
        <button 
          onClick={() => window.print()} 
          className="btn-secondary text-xs flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Document
        </button>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4 border-l-flame-500">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-flame-400" /> Executive Summary
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Terrestrial fire safety protocols fail to capture the physics of microgravity combustion. In low-g or 
            zero-g environments, the absence of natural buoyant convection eliminates the primary flame-stretching 
            and soot-dispersal mechanism, creating quiescent spherical diffusion flames. Under low airflow (0.5–20 cm/s), 
            flames sustain at lower ambient oxygen concentrations than predicted by 1g standard tests (NASA-STD-6001).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-3 text-sm tracking-wide uppercase text-cyan-400">Core Engineering Takeaways</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Quiescent Extinction:</strong> In pure zero-airflow conditions, flames often self-extinguish due to combustion product blanket.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Ventilation Hazard:</strong> Cabin circulation airflow (10–30 cm/s) dramatically accelerates flame spread rate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Detection Gap:</strong> Ionization detectors exhibit delayed response to large agglomerated microgravity soot particulates.</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-3 text-sm tracking-wide uppercase text-flame-400">Artemis & Lunar Habitats</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-flame-400 shrink-0 mt-0.5" />
                <span><strong>Partial Gravity (0.166g):</strong> Weak buoyant flow persists, creating hybrid teardrop flames with prolonged residence time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-flame-400 shrink-0 mt-0.5" />
                <span><strong>Reduced Pressure (55 kPa):</strong> Enhances molecular diffusion, expanding lean flammability limits.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
