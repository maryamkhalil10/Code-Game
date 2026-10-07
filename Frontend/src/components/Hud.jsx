import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tutors } from '../data/tutors'
import { scrollProgress, heroReveal } from './CameraRig'
import { useAuth } from '../context/AuthContext'

function sideForIndex(index) {
  return index % 2 === 0 ? 'right' : 'left'
}

export default function Hud() {
  const [progress, setProgress] = useState(0)
  const [hero, setHero] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [time, setTime] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let raf
    const segments = tutors.length + 1
    const threshold = 0.12 / segments
    const tick = () => {
      const p = scrollProgress.value
      setProgress(p)
      setHero(heroReveal.value)

      let nextIdx = -1
      for (let i = 0; i < tutors.length; i++) {
        const center = (i + 1) / segments
        const distance = Math.abs(p - center)
        if (distance < threshold) {
          nextIdx = i
          break
        }
      }

      if (nextIdx === -1) {
        const fallback = Math.min(tutors.length - 1, Math.max(0, Math.round(p * segments) - 1))
        if (p > 0.98) {
          nextIdx = tutors.length - 1
        } else if (p < 0.02) {
          nextIdx = -1
        } else {
          nextIdx = fallback
        }
      }
      setActiveIdx((cur) => (cur === nextIdx ? cur : nextIdx))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const update = () => {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const activeTutor = activeIdx >= 0 ? tutors[activeIdx] : null
  const cardSide = activeTutor ? sideForIndex(activeIdx) : null
  const oppositeSide = cardSide === 'left' ? 'right' : 'left'

  const zone = activeTutor
    ? activeTutor.sectionTitle.toUpperCase()
    : progress < 0.05
      ? 'APPROACH'
      : progress > 0.92
        ? 'OVERVIEW'
        : 'TRANSIT'

  const handleCtaClick = (event) => {
    const targetHref = activeTutor?.ctaHref ?? '#'

    if (!targetHref) return

    if (targetHref.startsWith('/')) {
      event.preventDefault()
      navigate(targetHref)
      return
    }

    if (targetHref.startsWith('#')) {
      event.preventDefault()
      const id = targetHref.slice(1)
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.location.hash = targetHref
      }
    }
  }

  // HUD stays fully hidden during hero. Fades in only once the radial reveal
  // is mostly complete (after ~70% of the hero scroll).
  const hudOpacity = Math.min(1, Math.max(0, (hero - 0.7) / 0.25))

  return (
    <div className="hud" style={{ opacity: hudOpacity }}>
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />

      <div className="hud-top">
        <div className="hud-top-left">
          <span className="hud-logo">◆ PROJECT_CODEGAME</span>
          <span className="hud-divider">/</span>
          <span className="hud-build">BUILD 0.1.0-FYP</span>
        </div>

        <nav className="hud-center-nav">
          <Link to="/leaderboards" className="hud-nav-item">LEADERBOARDS</Link>
          <Link to="/forms" className="hud-nav-item">FORMS</Link>
          <Link to="/curriculum" className="hud-nav-item">CURRICULUM</Link>
        </nav>

        <div className="hud-top-right">
          {user ? (
            <div className="hud-user-info">
              <span className="hud-username">[{user.username.toUpperCase()}]</span>
              <button onClick={logout} className="hud-logout-btn">LOGOUT</button>
            </div>
          ) : (
            <Link to="/login" className="hud-login-btn">SIGN IN / REGISTER</Link>
          )}
          <span className="hud-stat">
            <span className="hud-stat-label">SYS</span>
            <span className="hud-stat-value hud-pulse">ONLINE</span>
          </span>
          <span className="hud-stat">
            <span className="hud-stat-label">T</span>
            <span className="hud-stat-value">{time}</span>
          </span>
        </div>
      </div>

      <div
        className={`hud-section-badge ${activeTutor ? 'is-active' : ''} ${oppositeSide ? `badge-${oppositeSide}` : ''}`}
        style={activeTutor ? { '--accent': activeTutor.color } : undefined}
        aria-hidden={activeTutor ? 'false' : 'true'}
      >
        <span className="badge-id">SECTION_{activeTutor?.sectionId ?? '00'}</span>
        <h3 className="badge-title">{activeTutor?.sectionTitle?.toUpperCase() ?? '—'}</h3>
        <span className="badge-voice">VOICE_{activeTutor?.name?.toUpperCase() ?? '—'}</span>
      </div>

      <div
        className={`hud-cta-panel ${activeTutor ? 'is-active' : ''} ${oppositeSide ? `cta-${oppositeSide}` : ''}`}
        style={activeTutor ? { '--accent': activeTutor.color } : undefined}
      >
        <div className="cta-panel-header">
          <span className="cta-panel-eyebrow">// ACCESS_POINT</span>
          <span className="cta-panel-id">[{String(activeIdx + 1).padStart(2, '0')}/86]</span>
        </div>

        <div className="cta-panel-info">
          <div className="cta-panel-stat">
            <span className="stat-label">CHAPTER</span>
            <span className="stat-value">{activeTutor?.chapter ?? '—'}</span>
          </div>
          <div className="cta-panel-stat">
            <span className="stat-label">VOICE</span>
            <span className="stat-value">{activeTutor?.name?.toUpperCase() ?? '—'}</span>
          </div>
          <div className="cta-panel-stat">
            <span className="stat-label">DISCIPLINE</span>
            <span className="stat-value">{activeTutor?.sectionTitle ?? '—'}</span>
          </div>
        </div>

        <a
          className="cta-panel-button"
          href={activeTutor?.ctaHref ?? '#'}
          onClick={handleCtaClick}
          aria-label={activeTutor ? `${activeTutor.ctaLabel} — ${activeTutor.sectionTitle}` : undefined}
        >
          <span className="cta-button-bracket">[</span>
          <span className="cta-button-label">{activeTutor?.ctaLabel ?? '—'}</span>
          <span className="cta-button-arrow">→</span>
          <span className="cta-button-bracket">]</span>
        </a>
      </div>

      <div className="hud-bottom">
        <div className="hud-zone">
          <span className="hud-stat-label">ZONE</span>
          <span className="hud-stat-value hud-zone-name">{zone}</span>
        </div>

        <div className="hud-progress-track">
          <div className="hud-progress-fill" style={{ width: `${progress * 100}%` }} />
          {tutors.map((t, i) => {
            const at = ((i + 1) / (tutors.length + 1)) * 100
            const reached = progress * (tutors.length + 1) >= i + 1
            return (
              <div
                key={t.id}
                className={`hud-progress-tick ${reached ? 'reached' : ''}`}
                style={{ left: `${at}%`, '--tick-color': t.color }}
              >
                <span className="hud-progress-tick-label">{t.sectionTitle}</span>
              </div>
            )
          })}
        </div>

        <div className="hud-progress-readout">
          <span className="hud-stat-label">SCROLL</span>
          <span className="hud-stat-value">
            {Math.floor(progress * 100).toString().padStart(3, '0')}%
          </span>
        </div>
      </div>

      <div className="hud-scanlines" />

      <style>{`
        .hud-center-nav {
          display: flex; gap: 24px; pointer-events: auto;
        }
        .hud-nav-item {
          color: #7a9e8c; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
          transition: color 0.2s; pointer-events: auto;
        }
        .hud-nav-item:hover { color: #7fffd4; }
        .hud-user-info { display: flex; align-items: center; gap: 12px; margin-right: 16px; pointer-events: auto; }
        .hud-username { color: #7fffd4; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
        .hud-logout-btn {
          background: transparent; border: 1px solid #3d6050; color: #3d6050;
          font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 2px 6px; cursor: pointer; pointer-events: auto;
        }
        .hud-logout-btn:hover { border-color: #7fffd4; color: #7fffd4; }
        .hud-login-btn {
          margin-right: 16px; color: #7fffd4; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 10px;
          border: 1px solid #7fffd4; padding: 4px 10px; border-radius: 2px; pointer-events: auto;
        }
        .hud-top-left, .hud-top-right { pointer-events: auto; }
      `}</style>
    </div>
  )
}