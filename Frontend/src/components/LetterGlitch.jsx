import { useEffect, useRef } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>/?{}[]()|;:.,+-=*^~`'
const COLORS = [
  '#a8e0c4', // primary green-mint
  '#5fd1c4', // teal
  '#3a7d4e', // jungle dim
  '#1f5a3a', // deep
  '#9bd9b4', // pale
  '#ffd28a', // occasional warm flicker
]

const CELL_SIZE = 16
const FONT_SIZE = 14

export default function LetterGlitch() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    let cells = []
    let cols = 0
    let rows = 0

    const setup = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.font = `${FONT_SIZE}px ui-monospace, "JetBrains Mono", "SF Mono", Consolas, monospace`
      ctx.textBaseline = 'top'

      cols = Math.ceil(w / CELL_SIZE)
      rows = Math.ceil(h / CELL_SIZE)
      cells = new Array(cols * rows)
      for (let i = 0; i < cells.length; i++) {
        cells[i] = {
          char: CHARSET[(Math.random() * CHARSET.length) | 0],
          color: COLORS[(Math.random() * (COLORS.length - 1)) | 0], // exclude warm flicker on init
          opacity: 0.2 + Math.random() * 0.55,
        }
      }
      ctx.fillStyle = '#0a1410'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < cells.length; i++) {
        const col = i % cols
        const row = (i / cols) | 0
        ctx.globalAlpha = cells[i].opacity
        ctx.fillStyle = cells[i].color
        ctx.fillText(cells[i].char, col * CELL_SIZE + 1, row * CELL_SIZE + 1)
      }
      ctx.globalAlpha = 1
    }

    const draw = () => {
      const K = Math.min(180, (cells.length * 0.018) | 0)
      for (let n = 0; n < K; n++) {
        const i = (Math.random() * cells.length) | 0
        cells[i].char = CHARSET[(Math.random() * CHARSET.length) | 0]
        if (Math.random() < 0.2) {
          cells[i].color = COLORS[(Math.random() * COLORS.length) | 0]
        }
        if (Math.random() < 0.1) {
          cells[i].opacity = 0.2 + Math.random() * 0.7
        }
        const col = i % cols
        const row = (i / cols) | 0
        const x = col * CELL_SIZE
        const y = row * CELL_SIZE
        ctx.fillStyle = '#0a1410'
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        ctx.globalAlpha = cells[i].opacity
        ctx.fillStyle = cells[i].color
        ctx.fillText(cells[i].char, x + 1, y + 1)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    setup()
    draw()

    let resizeTimeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(setup, 80)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return <canvas ref={canvasRef} className="letter-glitch-canvas" aria-hidden="true" />
}
