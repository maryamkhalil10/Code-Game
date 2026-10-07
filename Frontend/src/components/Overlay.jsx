import { tutors } from '../data/tutors'
export default function Overlay() {
  return (
    <div className="overlay-spacer">
      <section id="approach" className="spacer-section spacer-tall" />
      {tutors.map((t) => (
        <section key={t.id} id={t.ctaHref.replace('#', '')} className="spacer-section spacer-tall" />
      ))}
      <section id="overview" className="spacer-section spacer-end" />
    </div>
  )
}
