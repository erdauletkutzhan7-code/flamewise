import { useRef, useEffect, useState } from 'react'
import usePageVisibility from '../hooks/usePageVisibility'

interface Interactive3DFlameProps {
  initialGravity?: number // 0 (microgravity) to 1 (Earth 1g)
  interactive?: boolean
  className?: string
  width?: number
  height?: number
}

export default function Interactive3DFlame({
  initialGravity = 0,
  interactive = true,
  className = '',
  width = 460,
  height = 420,
}: Interactive3DFlameProps) {
  const isVisible = usePageVisibility()
  const [gravity, setGravity] = useState<number>(initialGravity)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Particle pool for volumetric rendering
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    life: number
    maxLife: number
    color: string
    layer: 'core' | 'mid' | 'glow' | 'soot'
  }>>([])

  useEffect(() => {
    setGravity(initialGravity)
  }, [initialGravity])

  useEffect(() => {
    if (!isVisible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Pre-populate particles
    const particleCount = 120
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 1.5,
        radius: Math.random() * 20 + 10,
        life: Math.random(),
        maxLife: Math.random() * 1.5 + 1.0,
        color: '#ff6b00',
        layer: i < 30 ? 'core' : i < 80 ? 'mid' : 'glow',
      })
    }

    let lastTime = performance.now()
    let contextLost = false

    const render = (now: number) => {
      if (contextLost) return
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      timeRef.current += dt

      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      // Base anchor point for the flame
      const cy = h * (0.64 - gravity * 0.08)

      ctx.clearRect(0, 0, w, h)

      // ─── Procedural Volumetric Canvas Layering ───
      // We combine volumetric radial gradient bodies with physics particles
      const t = timeRef.current
      const g = gravity // 0.0 (ISS) -> 1.0 (Earth)

      // Atmospheric Space / Chamber Vignette
      const chamberVignette = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220)
      chamberVignette.addColorStop(0, 'rgba(15, 32, 64, 0.4)')
      chamberVignette.addColorStop(0.6, 'rgba(5, 12, 22, 0.7)')
      chamberVignette.addColorStop(1, 'rgba(2, 4, 10, 0)')
      ctx.fillStyle = chamberVignette
      ctx.fillRect(0, 0, w, h)

      // Flame scale & morphology factors
      const buoyancyLift = g * 75
      const flameRx = 46 * (1.0 - g * 0.38)
      const flameRy = 48 + buoyancyLift * 1.4

      // Gentle natural micro-fluctuations (quiescent in 0g, dynamic in 1g)
      const flutter = g > 0.05 ? Math.sin(t * 7.5) * 3.5 * g + Math.cos(t * 12.0) * 1.8 * g : Math.sin(t * 1.2) * 0.6

      // 1. Volumetric Ambient Glow Halo (Blue chemiluminescence in 0g / Warm Amber in 1g)
      const outerGlow = ctx.createRadialGradient(cx, cy - flameRy * 0.35, 10, cx, cy - flameRy * 0.35, flameRy * 2.2)
      if (g < 0.1) {
        // Pure ISS Microgravity: Spherical dim blue mantle (excited CH* chemiluminescence)
        outerGlow.addColorStop(0, 'rgba(0, 207, 255, 0.55)')
        outerGlow.addColorStop(0.4, 'rgba(0, 140, 255, 0.28)')
        outerGlow.addColorStop(0.7, 'rgba(255, 107, 0, 0.12)')
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        // Terrestrial 1g / Intermediate Lunar/Mars: Buoyant soot radiation
        outerGlow.addColorStop(0, 'rgba(255, 200, 100, 0.65)')
        outerGlow.addColorStop(0.35, 'rgba(255, 107, 0, 0.38)')
        outerGlow.addColorStop(0.7, 'rgba(180, 40, 0, 0.15)')
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      }
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.ellipse(cx, cy - flameRy * 0.35, flameRx * 2.4, flameRy * 1.8, 0, 0, Math.PI * 2)
      ctx.fill()

      // 2. Volumetric Soft Particle Cloud (Depth & Organic Atmosphere)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      particlesRef.current.forEach(p => {
        // Update particle
        p.life += dt
        if (p.life > p.maxLife) {
          p.life = 0
          p.x = (Math.random() - 0.5) * (flameRx * 0.8)
          p.y = (Math.random() - 0.5) * (flameRy * 0.4)
          // Buoyancy accelerates particles upward in 1g, slow isotropic drift in 0g
          p.vx = (Math.random() - 0.5) * (0.3 + g * 0.5)
          p.vy = - (Math.random() * 25 * g + 2.0)
        }

        p.x += p.vx * (1.0 + g * 2.0)
        p.y += p.vy * dt

        const progress = p.life / p.maxLife
        const alpha = Math.sin(progress * Math.PI) * 0.35
        const px = cx + p.x + (g > 0.1 ? Math.sin(t * 5 + p.y * 0.05) * 4 * g : 0)
        const py = cy + p.y

        const pGrad = ctx.createRadialGradient(px, py, 1, px, py, p.radius * (1 - progress * 0.4))
        if (g < 0.1) {
          pGrad.addColorStop(0, `rgba(100, 220, 255, ${alpha})`)
          pGrad.addColorStop(1, 'rgba(0, 100, 255, 0)')
        } else {
          pGrad.addColorStop(0, `rgba(255, 220, 120, ${alpha * 1.2})`)
          pGrad.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.6})`)
          pGrad.addColorStop(1, 'rgba(150, 20, 0, 0)')
        }
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(px, py, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()

      // 3. Main Organic Flame Geometry (Bézier Morphing)
      ctx.save()
      ctx.beginPath()

      if (g < 0.05) {
        // Near-perfect spherical flame
        ctx.arc(cx, cy - flameRy * 0.15, flameRx * 1.05, 0, Math.PI * 2)
      } else {
        // Teardrop path with dynamic buoyant flickers at apex
        const topY = cy - flameRy * 2.1 + flutter
        const botY = cy + flameRy * 0.25
        const leftX = cx - flameRx + (flutter * 0.3)
        const rightX = cx + flameRx + (flutter * 0.3)

        ctx.moveTo(cx + flutter * 0.8, topY)
        ctx.bezierCurveTo(
          rightX * 1.08, cy - flameRy * 1.1,
          rightX, cy - flameRy * 0.1,
          cx, botY
        )
        ctx.bezierCurveTo(
          leftX, cy - flameRy * 0.1,
          leftX * 0.92, cy - flameRy * 1.1,
          cx + flutter * 0.8, topY
        )
      }

      // Volumetric Radial Gradient
      const coreY = cy - flameRy * (g < 0.05 ? 0.15 : 0.6)
      const flameGrad = ctx.createRadialGradient(
        cx, coreY,
        4,
        cx, coreY,
        flameRy * 1.2
      )

      if (g < 0.05) {
        // Microgravity: Quiescent, cool blue core + thin orange edge
        flameGrad.addColorStop(0, 'rgba(235, 250, 255, 0.98)')
        flameGrad.addColorStop(0.35, 'rgba(0, 180, 255, 0.85)')
        flameGrad.addColorStop(0.75, 'rgba(255, 130, 20, 0.65)')
        flameGrad.addColorStop(0.95, 'rgba(220, 60, 0, 0.3)')
        flameGrad.addColorStop(1, 'rgba(120, 0, 0, 0)')
      } else {
        // Terrestrial 1g / Transition: High luminance yellow-white core + orange flame sheet
        flameGrad.addColorStop(0, 'rgba(255, 255, 255, 0.99)')
        flameGrad.addColorStop(0.2, 'rgba(255, 235, 140, 0.95)')
        flameGrad.addColorStop(0.55, 'rgba(255, 110, 0, 0.88)')
        flameGrad.addColorStop(0.85, 'rgba(200, 30, 0, 0.55)')
        flameGrad.addColorStop(1, 'rgba(80, 10, 0, 0)')
      }

      ctx.fillStyle = flameGrad
      ctx.fill()
      ctx.restore()

      // 4. Burner Platform & Calibration Ring
      ctx.save()
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(cx - 24, cy + flameRy * 0.28, 48, 8)
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1.5
      ctx.strokeRect(cx - 24, cy + flameRy * 0.28, 48, 8)

      // Microgravity calibration ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.arc(cx, cy - flameRy * 0.15, flameRx * 1.35, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      animFrameRef.current = requestAnimationFrame(render)
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      cancelAnimationFrame(animFrameRef.current)
    }
    const onContextRestored = () => {
      contextLost = false
      lastTime = performance.now()
      animFrameRef.current = requestAnimationFrame(render)
    }
    canvas.addEventListener('contextlost', onContextLost)
    canvas.addEventListener('contextrestored', onContextRestored)
    animFrameRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      canvas.removeEventListener('contextlost', onContextLost)
      canvas.removeEventListener('contextrestored', onContextRestored)
    }
  }, [gravity, isVisible])

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* 3D Visualizer Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 backdrop-blur-md shadow-2xl shadow-flame-500/10">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block w-full max-w-full h-auto"
          role="img"
          aria-label="Interactive 3D flame morphology visualization responding to gravity scale"
        />

        {/* Top HUD Badge */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[11px] font-mono pointer-events-none">
          <span className="bg-black/60 px-2.5 py-1 rounded-md text-cyan-400 border border-white/5">
            {gravity < 0.05 ? 'ISS ~10⁻⁶ g (Spherical)' : gravity < 0.25 ? 'Moon 0.166 g (Hybrid)' : gravity < 0.5 ? 'Mars 0.378 g (Intermediate)' : 'Earth 1.0 g (Buoyant Teardrop)'}
          </span>
          <span className="bg-black/60 px-2 py-1 rounded-md text-gray-400 border border-white/5">
            SCHEMATIC · NO MEASURED DATA
          </span>
        </div>

        {/* Interactive Gravity Bar (when enabled) */}
        {interactive && (
          <div className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-400 whitespace-nowrap">GRAVITY:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              aria-label="Gravity slider from microgravity 0g to Earth 1g"
              className="flex-1 accent-flame-500 cursor-pointer"
            />
            <div className="flex gap-1">
              {[
                { label: '0g', val: 0 },
                { label: 'Moon', val: 0.166 },
                { label: 'Mars', val: 0.378 },
                { label: '1g', val: 1.0 },
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setGravity(preset.val)}
                  className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                    Math.abs(gravity - preset.val) < 0.04
                      ? 'bg-flame-500/20 border-flame-500 text-flame-300 font-bold'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] font-mono text-gray-500 mt-2 text-center">
        Illustration, not measurement. Demonstrates buoyancy cessation documented in NASA BASS & Saffire.
      </p>
    </div>
  )
}
