import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const team = [
  {
    name: 'Abdullah',
    role: 'Website Designer & Developer',
    bio: 'Abdullah shapes the look, flow, and atmosphere of the experience, turning CodeGame into a world that feels immersive, polished, and easy to explore.',
  },
  {
    name: 'Mussa',
    role: 'Game Developer',
    bio: 'Mussa builds the interactive systems, movement, and game feel that make each chapter feel alive, responsive, and rewarding to play through.',
  },
  {
    name: 'Maryum & Aryan',
    role: 'AI Developers',
    bio: 'Maryum and Aryan create the intelligent layer behind the platform, helping the game adapt to learners and guide them through challenges with smart feedback.',
  },
]

export default function Manifesto() {
  const { user, logout } = useAuth()

  return (
    <div className="page-shell manifesto-shell">
      <header className="hud-top-bar">
        <div className="hud-left">
          <span className="hud-diamond">◆</span>
          <span className="hud-project">PROJECT_CODEGAME</span>
          <span className="hud-sep">/</span>
          <span className="hud-build">BUILD 0.1.0-FYP</span>
        </div>

        <nav className="hud-nav">
          <Link to="/" className="hud-nav-link">← BACK_TO_WORLD</Link>
          <Link to="/forms" className="hud-nav-link">FORMS</Link>
          <Link to="/leaderboards" className="hud-nav-link">LEADERBOARDS</Link>
          {user ? (
            <div className="hud-user-profile">
              <span className="hud-username">[{user.username.toUpperCase()}]</span>
              <button onClick={logout} className="hud-logout-btn">LOGOUT</button>
            </div>
          ) : (
            <Link to="/login" className="hud-nav-link hud-login-link">SIGN IN / REGISTER</Link>
          )}
        </nav>

        <div className="hud-right">
          <span className="hud-sys">SYS <em>ONLINE</em></span>
        </div>
      </header>

      <main className="forms-main manifesto-main">
        <section className="forms-hero">
          <span className="eyebrow-id">SECTION_01</span>
          <h1 className="eyebrow-title">MANIFESTO</h1>
          <p className="forms-intro">
            CodeGame is a futuristic learning experience where players step into a living world of code, discovery, and challenge. Instead of memorizing syntax in isolation, learners move through an interactive journey of missions, puzzles, and conversations that make programming feel meaningful, cinematic, and fun.
          </p>
        </section>

        <section className="forms-grid">
          <article className="forms-card forms-card--intro">
            <div className="forms-card-head">
              <h2>THE VISION</h2>
            </div>
            <p>
              Project CodeGame is designed to turn programming education into an adventure. The goal is to help students learn C++ through exploration, storytelling, and hands-on problem solving, so that every lesson feels like part of a larger journey rather than a dry exercise.
            </p>
            <p className="manifesto-quote">
              We want players to feel that they are not just studying code — they are stepping into a world where every concept becomes part of their growth.
            </p>
          </article>

          {team.map((member) => (
            <article key={member.name} className="forms-card">
              <div className="forms-card-head">
                <h2>{member.name}</h2>
              </div>
              <span className="manifesto-role">{member.role}</span>
              <p>{member.bio}</p>
            </article>
          ))}
        </section>
      </main>

      <style>{`
        .page-shell { min-height: 100vh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
        .hud-top-bar {
          position: sticky; top: 0; z-index: 100;
          height: 40px; border-bottom: 1px solid rgba(127,255,200,0.1);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; font-family: var(--font-mono); font-size: 10px;
          background: rgba(8,14,11,0.9); backdrop-filter: blur(8px);
          pointer-events: auto;
        }
        .hud-nav { display: flex; gap: 20px; align-items: center; pointer-events: auto; }
        .hud-nav-link { color: rgba(232,244,236,0.55); text-decoration: none; pointer-events: auto; }
        .hud-nav-link:hover { color: var(--mint); }
        .hud-login-link { color: var(--mint); border: 1px solid var(--mint); padding: 4px 10px; border-radius: 2px; pointer-events: auto; }
        .hud-user-profile { display: flex; align-items: center; gap: 12px; pointer-events: auto; }
        .hud-logout-btn { background: transparent; border: 1px solid rgba(232,244,236,0.35); color: rgba(232,244,236,0.85); font-size: 9px; padding: 2px 6px; cursor: pointer; pointer-events: auto; }
      `}</style>
    </div>
  )
}
