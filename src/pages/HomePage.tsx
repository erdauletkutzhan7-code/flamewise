import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flame, Compass, ChevronRight, Activity, ShieldAlert } from 'lucide-react'
import Interactive3DFlame from '../components/Interactive3DFlame'
import { HISTORICAL_INCIDENTS, EXPERIMENTS } from '../data/experiments'
import { useTranslation } from '../context/TranslationContext'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="relative overflow-hidden text-gray-100">
      {/* ─── Immersive Cinematic Hero Section ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-flame-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Narrative */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-flame-400">
              <span className="w-2 h-2 rounded-full bg-flame-500 animate-pulse" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12]">
              {t('hero.title_part1')} <br />
              <span className="italic font-normal text-flame-400">{t('hero.title_part2')}</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed max-w-2xl font-light">
              {t('hero.desc')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/lab" className="btn-primary group">
                <Flame className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                {t('hero.cta_lab')}
                <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <Compass className="w-4 h-4 text-cyan-400" />
                {t('hero.cta_explore')}
              </Link>
            </div>

            {/* Provenance Stat Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-mono font-bold text-white">8</div>
                <div className="text-xs text-gray-400">{t('hero.stat_psi')}</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-flame-400">~600°C</div>
                <div className="text-xs text-gray-400">{t('hero.stat_temp')}</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-cyan-400">0.3–1.0 μm</div>
                <div className="text-xs text-gray-400">{t('hero.stat_smoke')}</div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero 3D Interactive Visualizer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center"
          >
            <Interactive3DFlame initialGravity={0} interactive={true} />
          </motion.div>
        </div>
      </section>

      {/* ─── Section: Microgravity vs Terrestrial Physics ─── */}
      <section className="py-20 px-4 border-t border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-flame-400">FUNDAMENTAL COMBUSTION PHYSICS</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 mb-4">
              Why Fire in Space is a Silent Hazard
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              Without natural convection, the physics of ignition, flame propagation, and extinguishment 
              diverge fundamentally from Earth-based firefighter protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border-l-2 border-l-cyan-500">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Spherical Quiescence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                In microgravity (10⁻⁶ g), the absence of buoyant updraft creates symmetrical spherical diffusion flames. 
                Combustion relies purely on slow molecular diffusion, accumulating thick blankets of CO₂ and H₂O.
              </p>
            </div>

            <div className="glass-card p-6 border-l-2 border-l-flame-500">
              <div className="w-10 h-10 rounded-xl bg-flame-500/10 border border-flame-500/20 flex items-center justify-center text-flame-400 mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Invisible Cool Flames</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Discovered in the FLEX experiment aboard the ISS, droplets can continue burning after visible flame extinction 
                at ~600°C without luminous soot radiation, invisible to standard optical fire detectors.
              </p>
            </div>

            <div className="glass-card p-6 border-l-2 border-l-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Ventilation Acceleration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                As demonstrated in Saffire and BASS, spacecraft environmental control airflow (5–30 cm/s) supplies fresh oxygen 
                and rapidly drives flame spread along cabin materials, requiring suppression in under 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section: Featured NASA Experiments ─── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">EXPERIMENT ARCHIVE</span>
              <h2 className="text-3xl font-serif font-bold text-white mt-1">Sourced NASA PSI Investigations</h2>
            </div>
            <Link to="/dashboard" className="text-xs font-mono text-flame-400 hover:text-flame-300 flex items-center gap-1">
              View all 8 experiments in catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERIMENTS.slice(0, 4).map(exp => (
              <div key={exp.id} className="glass-card p-5 flex flex-col justify-between hover:border-flame-500/40 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/5">{exp.hardware}</span>
                    <span className="text-[11px] font-mono text-gray-500">{exp.years}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-white mb-1">{exp.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">{exp.keyFindings[0]}</p>
                </div>
                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">{exp.pi}</span>
                  <a href={exp.psiLink} target="_blank" rel="noreferrer" className="text-flame-400 hover:underline">
                    PSI Repo ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section: Historical Incidents Case Studies ─── */}
      <section className="py-20 px-4 border-t border-white/5 bg-slate-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400">HISTORICAL LESSONS</span>
            <h2 className="text-3xl font-serif font-bold text-white mt-1 mb-3">Spacecraft Fire Incidents</h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Every microgravity combustion guideline stems from hard-learned spaceflight lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HISTORICAL_INCIDENTS.map(inc => (
              <div key={inc.id} className="glass-card p-6 flex flex-col justify-between border-t-2 border-t-red-500/60">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-mono uppercase text-red-400 tracking-wider font-bold">{inc.severity}</span>
                    <span className="text-xs font-mono text-gray-500">{inc.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1">{inc.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{inc.location}</p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">{inc.cause}</p>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500 block mb-1">Standard Updated:</span>
                  <p className="text-xs text-gray-400 italic">{inc.lessonsLearned[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
