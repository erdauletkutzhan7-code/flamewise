import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  alpha: number
  speed: number
  twinkleOffset: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef  = useRef<Star[]>([])
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // Re-generate stars on resize
      starsRef.current = Array.from({ length: 220 }, () => ({
        x:            Math.random() * canvas.width,
        y:            Math.random() * canvas.height,
        r:            Math.random() * 1.5 + 0.3,
        alpha:        Math.random() * 0.6 + 0.2,
        speed:        Math.random() * 0.3 + 0.05,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.008
      starsRef.current.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.twinkleOffset))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #02040a 0%, #050c16 50%, #02040a 100%)' }}
    />
  )
}
