import { useState, useEffect, useRef } from 'react'
import PageWrapper from '../components/PageWrapper'
import { Play, Pause, RotateCcw, AlertTriangle, Info, Zap } from 'lucide-react'
import { useTranslation } from '../context/TranslationContext'

interface Preset {
  name: string
  label: string
  g: number // g fraction
  gDesc: string
  pressure: number // kPa
  oxygen: number // %
  scenario: string
}

const PRESETS: Preset[] = [
  { name: 'iss', label: 'ISS (Microgravity)', g: 0.000001, gDesc: '~10⁻⁶ g', pressure: 101.3, oxygen: 21, scenario: 'Microgravity Glovebox' },
  { name: 'moon', label: 'Moon Surface', g: 0.166, gDesc: '0.166 g', pressure: 55, oxygen: 21, scenario: 'Artemis Surface Base' },
  { name: 'mars', label: 'Mars Habitat', g: 0.378, gDesc: '0.378 g', pressure: 70, oxygen: 21, scenario: 'Pressurized Rover / Habitat' },
  { name: 'earth', label: 'Earth (1g)', g: 1.0, gDesc: '1.0 g', pressure: 101.3, oxygen: 21, scenario: 'Terrestrial Testing' },
]

export default function FlameLabPage() {
  const { t } = useTranslation()
  // Simulation parameters
  const [gravityPreset, setGravityPreset] = useState<string>('iss')
  const [flameHeightL, setFlameHeightL] = useState<number>(3.0) // cm
  const [oxygen, setOxygen] = useState<number>(21) // %
  const [pressure, setPressure] = useState<number>(101.3) // kPa
  const [material, setMaterial] = useState<string>('PMMA')
  const [airflow, setAirflow] = useState<number>(5) // cm/s
  const [, setScenario] = useState<string>('ISS')

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [simSpeed, setSimSpeed] = useState<number>(1)
  const [simTime, setSimTime] = useState<number>(0)
  const [autoDemo, setAutoDemo] = useState<boolean>(false)
  const [eventLogs, setEventLogs] = useState<string[]>([
    '[00:00.0] Simulation initialized at microgravity (ISS ~10⁻⁶ g).',
    '[00:00.0] Quiescent spherical diffusion flame established.'
  ])

  // Current g calculation
  const currentPreset = PRESETS.find(p => p.name === gravityPreset) || PRESETS[0]
  const gVal = currentPreset.g

  // Educational calculations:
  // Buoyant flow scale u = sqrt(g * 981 * L) in cm/s
  const buoyantFlowU = Math.sqrt(gVal * 981 * flameHeightL)
  // Oxygen partial pressure pp = (O2% * P) / 100 kPa
  const oxygenPartialPressure = (oxygen * pressure) / 100

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const uHistoryRef = useRef<number[]>([])

  // Event logger
  const logEvent = (msg: string) => {
    const min = Math.floor(timeRef.current / 60).toString().padStart(2, '0')
    const sec = (timeRef.current % 60).toFixed(1).padStart(4, '0')
    setEventLogs(prev => [`[${min}:${sec}] ${msg}`, ...prev.slice(0, 19)])
  }

  // Handle Preset change
  const applyPreset = (presetName: string) => {
    const p = PRESETS.find(item => item.name === presetName)
    if (!p) return
    setGravityPreset(p.name)
    setPressure(p.pressure)
    setOxygen(p.oxygen)
    setScenario(p.scenario)
    logEvent(`Preset switched to ${p.label}. g-level: ${p.gDesc}.`)
  }

  // Auto demo cycle: ISS -> Moon -> Mars -> Earth
  useEffect(() => {
    if (!autoDemo) return
    const order = ['iss', 'moon', 'mars', 'earth']
    const interval = setInterval(() => {
      setGravityPreset(current => {
        const nextIdx = (order.indexOf(current) + 1) % order.length
        const nextPreset = order[nextIdx]
        applyPreset(nextPreset)
        return nextPreset
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [autoDemo])

  // Simulation loop & canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTimestamp = performance.now()

    const render = (now: number) => {
      const dt = ((now - lastTimestamp) / 1000) * (isPlaying ? simSpeed : 0)
      lastTimestamp = now
      timeRef.current += dt
      setSimTime(timeRef.current)

      // Record u(t) history for live chart
      uHistoryRef.current.push(buoyantFlowU)
      if (uHistoryRef.current.length > 50) {
        uHistoryRef.current.shift()
      }

      // Canvas dimensions
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      // Background scientific chamber grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(y, 0)
        ctx.lineTo(y, height)
        ctx.stroke()
      }

      // Flame center coordinate
      const cx = width / 2
      const cy = height * 0.65

      // Time variables for flicker
      const t = timeRef.current * 4
      const flickerFactor = gVal > 0.1 ? Math.sin(t * 3.5) * 0.08 * gVal + Math.cos(t * 7.2) * 0.04 * gVal : 0

      // Flame morphology interpolation:
      // In 0g (ISS): aspect ratio ~ 1.0 (Sphere), dim blue/amber glow
      // In 1g (Earth): aspect ratio ~ 2.8 (Elongated teardrop), intense yellow/orange, flickering
      const elongation = 1.0 + (gVal * 1.8) * (flameHeightL / 3.0) + flickerFactor
      const baseRadius = 38 * (oxygen / 21) * Math.sqrt(pressure / 101.3)
      const flameRx = baseRadius * (1.0 - gVal * 0.35)
      const flameRy = baseRadius * elongation

      // 1. Outer Glow
      const glowGrad = ctx.createRadialGradient(cx, cy - flameRy * 0.2, 5, cx, cy - flameRy * 0.2, flameRy * 1.5)
      if (gVal < 0.05) {
        // Microgravity spherical sootless/dim chemiluminescence (blue & amber halo)
        glowGrad.addColorStop(0, 'rgba(0, 207, 255, 0.45)')
        glowGrad.addColorStop(0.5, 'rgba(255, 107, 0, 0.25)')
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        // Buoyant flame with soot radiation (bright yellow/orange)
        glowGrad.addColorStop(0, 'rgba(255, 230, 120, 0.55)')
        glowGrad.addColorStop(0.5, 'rgba(255, 90, 0, 0.35)')
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      }
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.ellipse(cx, cy - flameRy * 0.2, flameRx * 1.6, flameRy * 1.6, 0, 0, Math.PI * 2)
      ctx.fill()

      // 2. Main Flame Body
      ctx.save()
      ctx.beginPath()
      if (gVal < 0.05) {
        // ISS: Near-perfect Sphere
        ctx.ellipse(cx, cy - flameRy * 0.3, flameRx, flameRy, 0, 0, Math.PI * 2)
      } else {
        // Teardrop path: bottom rounded, top tapered
        const topY = cy - flameRy * 2.2
        const botY = cy + flameRy * 0.3
        const leftX = cx - flameRx
        const rightX = cx + flameRx

        ctx.moveTo(cx, topY)
        ctx.bezierCurveTo(rightX * 1.05, cy - flameRy * 1.1, rightX, cy, cx, botY)
        ctx.bezierCurveTo(leftX, cy, leftX * 0.95, cy - flameRy * 1.1, cx, topY)
      }

      const bodyGrad = ctx.createRadialGradient(cx, cy - flameRy * 0.4, 4, cx, cy - flameRy * 0.2, flameRy * 1.1)
      if (gVal < 0.05) {
        // μg: Cool inner blue + faint outer reaction zone
        bodyGrad.addColorStop(0, 'rgba(180, 240, 255, 0.95)')
        bodyGrad.addColorStop(0.4, 'rgba(0, 160, 255, 0.75)')
        bodyGrad.addColorStop(0.85, 'rgba(255, 120, 30, 0.6)')
        bodyGrad.addColorStop(1, 'rgba(200, 50, 0, 0.1)')
      } else {
        // 1g: White hot core + luminous yellow + orange mantle
        bodyGrad.addColorStop(0, 'rgba(255, 255, 240, 0.98)')
        bodyGrad.addColorStop(0.25, 'rgba(255, 215, 0, 0.9)')
        bodyGrad.addColorStop(0.7, 'rgba(255, 80, 0, 0.8)')
        bodyGrad.addColorStop(1, 'rgba(160, 20, 0, 0.2)')
      }
      ctx.fillStyle = bodyGrad
      ctx.fill()
      ctx.restore()

      // 3. Burner / Sample Base
      ctx.fillStyle = '#334155'
      ctx.fillRect(cx - 16, cy + flameRy * 0.32, 32, 8)
      ctx.strokeStyle = '#64748b'
      ctx.strokeRect(cx - 16, cy + flameRy * 0.32, 32, 8)

      // 4. In-canvas HUD Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillText(`CHAMBER: ${currentPreset.label}`, 14, 24)
      ctx.fillText(`g-LEVEL : ${currentPreset.gDesc}`, 14, 40)
      ctx.fillText(`u(buoy) : ${buoyantFlowU.toFixed(1)} cm/s`, 14, 56)

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameRef.current)
  }, [gravityPreset, flameHeightL, oxygen, pressure, buoyantFlowU, isPlaying, simSpeed])

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title & NASA Disclaimer */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-flame-400 tracking-widest uppercase">{t('lab.subtitle')}</span>
            <h1 className="text-3xl font-serif font-bold text-white mt-1">{t('lab.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoDemo(!autoDemo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                autoDemo 
                  ? 'bg-flame-500/20 border-flame-500 text-flame-300 shadow-lg shadow-flame-500/20' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1" /> {autoDemo ? t('lab.auto_demo_stop') : t('lab.auto_demo_start')}
            </button>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>{t('lab.disclaimer_title')}</strong> {t('lab.disclaimer_text')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Viewport & Real-Time Analytics (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={440}
              className="w-full h-[380px] sm:h-[440px] bg-slate-950 block"
            />

            {/* Playback Overlay Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-primary !p-2 !rounded-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { timeRef.current = 0; setSimTime(0) }}
                  className="btn-secondary !p-2 !rounded-lg text-xs"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="text-xs font-mono text-gray-300 ml-2">
                  T+ {Math.floor(simTime / 60).toString().padStart(2, '0')}:{(simTime % 60).toFixed(1).padStart(4, '0')}s
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-gray-500 mr-1">SPEED:</span>
                {[1, 5, 10].map(s => (
                  <button
                    key={s}
                    onClick={() => setSimSpeed(s)}
                    className={`px-2 py-1 rounded text-xs ${
                      simSpeed === s ? 'bg-flame-500 text-white font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    ×{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Calculation Gauges & Live u(t) Chart */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" /> Educational Physics Scale Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[11px] text-gray-400 uppercase font-mono">Buoyant Velocity Scale</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {buoyantFlowU.toFixed(1)} <span className="text-xs font-normal text-gray-400">cm/s</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">u = √(g · 981 · L)</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[11px] text-gray-400 uppercase font-mono">O₂ Partial Pressure</div>
                <div className="text-xl font-bold font-mono text-flame-400 mt-1">
                  {oxygenPartialPressure.toFixed(1)} <span className="text-xs font-normal text-gray-400">kPa</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">ppO₂ = (O₂% · P) / 100</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[11px] text-gray-400 uppercase font-mono">NASA Benchmark Ref</div>
                <div className="text-xs font-mono text-amber-300 mt-2">BASS: 5–50 cm/s</div>
                <div className="text-xs font-mono text-amber-300">Saffire-I: 20 cm/s</div>
              </div>
            </div>

            {/* Live calculated demonstration curve u(t) */}
            <div className="border-t border-white/5 pt-3">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                <span>Calculated Velocity Scale u(t) History</span>
                <span className="text-[10px] text-gray-500 font-mono">DEMONSTRATION CALCULATION · NOT MEASURED DATA</span>
              </div>
              <div className="h-16 flex items-end gap-1 bg-black/30 p-2 rounded-lg border border-white/5">
                {uHistoryRef.current.map((val, idx) => {
                  const maxVal = 60
                  const heightPercent = Math.min(100, Math.max(5, (val / maxVal) * 100))
                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPercent}%` }}
                      className="flex-1 bg-cyan-500/40 hover:bg-cyan-400 rounded-t-xs transition-all"
                      title={`${val.toFixed(1)} cm/s`}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Controls & Live Log (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide">Simulation Controls</h2>

            {/* Gravity Preset Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Target Gravity Field (g)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      gravityPreset === p.name
                        ? 'bg-flame-500/20 border-flame-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[11px] font-mono text-cyan-400">{p.gDesc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Flame Height L & Airflow */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Characteristic Length L</span>
                  <span className="font-mono text-flame-400">{flameHeightL.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={flameHeightL}
                  onChange={(e) => setFlameHeightL(parseFloat(e.target.value))}
                  className="w-full accent-flame-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Ventilation Airflow</span>
                  <span className="font-mono text-cyan-400">{airflow} cm/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={airflow}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setAirflow(val)
                    logEvent(`Forced airflow set to ${val} cm/s.`)
                  }}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Oxygen Radio Choices */}
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Oxygen Concentration (O₂ %)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 21, 30, 35].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setOxygen(opt)
                      logEvent(`Oxygen concentration adjusted to ${opt}%.`)
                    }}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border text-center transition-all ${
                      oxygen === opt
                        ? 'bg-flame-500/20 border-flame-500 text-flame-300'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {opt}%
                  </button>
                ))}
              </div>
            </div>

            {/* Selectors: Pressure, Material, Scenario */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Pressure (kPa)</label>
                <select
                  value={pressure}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    setPressure(val)
                    logEvent(`Chamber pressure set to ${val} kPa.`)
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                >
                  <option value={101.3}>101.3 kPa (Standard 1 atm)</option>
                  <option value={70}>70.0 kPa (Sub-atmospheric)</option>
                  <option value={55}>55.0 kPa (Artemis Standard)</option>
                  <option value={30}>30.0 kPa (EVA Spacesuit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Fuel Material</label>
                <select
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value)
                    logEvent(`Material selected: ${e.target.value}.`)
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                >
                  <option value="PMMA">PMMA (Acrylic)</option>
                  <option value="Cotton">Cotton / Fiberglass</option>
                  <option value="SIBAL">SIBAL Fabric</option>
                  <option value="Heptane">Heptane Droplet (FLEX)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Event Log */}
          <div className="glass-card p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Simulation Event Log</span>
              <button
                onClick={() => setEventLogs([])}
                className="text-[10px] text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="h-36 overflow-y-auto font-mono text-[11px] space-y-1 pr-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
              {eventLogs.map((log, i) => (
                <div key={i} className="text-gray-400 border-b border-white/[0.02] pb-0.5">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
