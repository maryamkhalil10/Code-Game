import { useEffect, useRef } from 'react'
import LetterGlitch from './LetterGlitch'
import { heroReveal } from './CameraRig'

export default function Hero() {
  const heroRef = useRef(null)
  const plasmaRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const r = heroReveal.value 
      const hero = heroRef.current
      const plasma = plasmaRef.current
      const content = contentRef.current

      if (hero) {
        const inner = `${r * 110}%`
        const outer = `${r * 110 + 6}%`
        const mask = `radial-gradient(circle at 50% 50%, transparent 0%, transparent ${inner}, black ${outer}, black 100%)`
        hero.style.maskImage = mask
        hero.style.webkitMaskImage = mask
      }

      if (plasma) {
        const peak = 1 - Math.abs(r - 0.5) * 2
        plasma.style.opacity = String(Math.max(0, peak * 1.2))
        const ringRadius = r * 60 // vh-ish
        plasma.style.setProperty('--ring', `${ringRadius}vmax`)
      }

      if (content) {
        const fade = Math.max(0, 1 - r * 1.4)
        const scale = 1 + r * 0.15
        content.style.opacity = String(fade)
        content.style.transform = `translate(-50%, -50%) scale(${scale})`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div ref={heroRef} className="hero-overlay">
        <LetterGlitch />
        <div className="hero-vignette" />
        <div ref={contentRef} className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            PROJECT_CODEGAME // BUILD 0.1.0-FYP
          </div>
          <h1 className="hero-title">
            Learn C++ in a world<br />
            that <em>listens</em>.
          </h1>
          <p className="hero-lede">
            An AI-tutored, game-based C++ learning platform. Six guides.
            One non-linear skill web. Real code, executed live.
          </p>
          <div className="hero-cue">
            <span className="hero-cue-line" />
            scroll to enter the world
            <span className="hero-cue-line" />
          </div>
          <div className="hero-corners">
            <span className="hero-corner tl" />
            <span className="hero-corner tr" />
            <span className="hero-corner bl" />
            <span className="hero-corner br" />
          </div>
        </div>
      </div>

      <div ref={plasmaRef} className="plasma-ring" aria-hidden="true" />
    </>
  )
}
