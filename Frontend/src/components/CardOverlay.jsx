import { useEffect, useRef } from 'react'
import { tutors } from '../data/tutors'
import { scrollProgress } from './CameraRig'

function sideForIndex(index) {
  return index % 2 === 0 ? 'right' : 'left'
}

function useCardAnimation({ rootRef, headerRef, bodyRef, index }) {
  useEffect(() => {
    let raf
    let lastActive = null
    const segments = tutors.length + 1
    const myCenter = (index + 1) / segments
    const threshold = 0.18 / segments

    const apply = (active) => {
      const root = rootRef.current
      if (root) {
        if (active) {
          root.classList.add('is-active')
          root.style.pointerEvents = 'auto'
        } else {
          root.classList.remove('is-active')
          root.style.pointerEvents = 'none'
        }
      }
      const header = headerRef?.current
      if (header) header.classList.toggle('is-active', active)
      const body = bodyRef?.current
      if (body) body.classList.toggle('is-active', active)
    }

    const tick = () => {
      const p = scrollProgress.value
      const distance = Math.abs(p - myCenter)
      const active = distance < threshold
      if (active !== lastActive) {
        lastActive = active
        apply(active)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [index])
}

function CardFrame({ tutor, index }) {
  const rootRef = useRef(null)
  useCardAnimation({ rootRef, index })
  const side = sideForIndex(index)
  return (
    <div
      ref={rootRef}
      className={`card-slot card-slot-frame card-${side}`}
      style={{ '--accent': tutor.color }}
    >
      <span className="card-bracket br-tl" />
      <span className="card-bracket br-tr" />
      <span className="card-bracket br-bl" />
      <span className="card-bracket br-br" />
    </div>
  )
}

function CardContent({ tutor, index }) {
  const rootRef = useRef(null)
  const headerRef = useRef(null)
  const bodyRef = useRef(null)
  useCardAnimation({ rootRef, headerRef, bodyRef, index })
  const side = sideForIndex(index)

  return (
    <div
      ref={rootRef}
      className={`card-slot card-slot-content card-${side}`}
      style={{ '--accent': tutor.color }}
    >
      <div ref={headerRef} className="card-head">
        <h2 className="card-name">
          <span className="card-name-prefix">//</span>
          {tutor.name}
        </h2>
        <span className="card-tagline">{tutor.tagline}</span>
      </div>

      <div className="card-spacer" aria-hidden="true" />

      <div ref={bodyRef} className="card-foot">
        <div className="card-divider">
          <span className="card-divider-line" />
          <span className="card-divider-tag">TRANSMISSION</span>
          <span className="card-divider-line" />
        </div>
        <p className="card-body">{tutor.body}</p>
      </div>
    </div>
  )
}

export function CardFrames() {
  return (
    <div className="card-overlay card-frames-layer" aria-hidden="true">
      {tutors.map((tutor, i) => (
        <CardFrame key={tutor.id} tutor={tutor} index={i} />
      ))}
    </div>
  )
}

export function CardContents() {
  return (
    <div className="card-overlay card-contents-layer">
      {tutors.map((tutor, i) => (
        <CardContent key={tutor.id} tutor={tutor} index={i} />
      ))}
    </div>
  )
}
