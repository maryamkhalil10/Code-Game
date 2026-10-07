import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const curriculum = [
  {
    id: 'fundamentals',
    title: 'PROGRAMMING FUNDAMENTALS',
    status: 'ACTIVE',
    level: 'ENTRY',
    accent: '#a8d8ff',
    summary: 'Learn how a program is built from its first line of logic and how variables, expressions, and output shape the world.',
    modules: ['Hello world', 'Variables & types', 'Input & output', 'Debugging basics'],
    reward: '120 XP',
  },
  {
    id: 'control-flow',
    title: 'CONTROL FLOW',
    status: 'ACTIVE',
    level: 'EARLY',
    accent: '#ffb86b',
    summary: 'Teach the machine how to make decisions with conditions, branches, and nested logic.',
    modules: ['If / else', 'Switch logic', 'Boolean flow', 'Decision trees'],
    reward: '140 XP',
  },
  {
    id: 'loops',
    title: 'LOOPS & ITERATION',
    status: 'ACTIVE',
    level: 'MID',
    accent: '#ff6b9d',
    summary: 'Repeat intent with purpose. Master loops that automate repetition without losing clarity.',
    modules: ['For loops', 'While loops', 'Nested loops', 'Loop pitfalls'],
    reward: '160 XP',
  },
  {
    id: 'arrays',
    title: 'ARRAYS & STRINGS',
    status: 'ACTIVE',
    level: 'MID',
    accent: '#9b8cff',
    summary: 'Work with collections, text data, and indexing so your programs can organize chaos.',
    modules: ['Array creation', 'Traversal', 'String operations', 'Search patterns'],
    reward: '180 XP',
  },
  {
    id: 'functions',
    title: 'FUNCTIONS & MODULAR CODE',
    status: 'ACTIVE',
    level: 'ADVANCED',
    accent: '#5fd1c4',
    summary: 'Break problems into reusable tools. Build cleaner logic and share solutions across the world.',
    modules: ['Function design', 'Parameters', 'Return values', 'Reuse & refactor'],
    reward: '200 XP',
  },
  {
    id: 'pointers',
    title: 'POINTERS & OBJECT ORIENTED',
    status: 'COMING SOON',
    level: 'NEXT',
    accent: '#ffe66d',
    summary: 'The next frontier. Unlock deeper memory concepts and object-driven systems as the world expands.',
    modules: ['Memory awareness', 'Classes & objects', 'Inheritance', 'Advanced patterns'],
    reward: 'TBD',
  },
]

export default function Curriculum() {
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
          <NavLink to="/curriculum" className={({ isActive }) => `hud-nav-link${isActive ? ' is-active' : ''}`}>CURRICULUM</NavLink>
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

      <main className="forms-main curriculum-main">
        <section className="forms-hero">
          <span className="eyebrow-id">SECTION_02</span>
          <h1 className="eyebrow-title">CURRICULUM</h1>
          <p className="forms-intro">
            Your path through the game is built like a skill web. Each chapter opens new tools, deeper logic, and a stronger sense of what it means to build something real.
          </p>
        </section>

        <section className="curriculum-grid">
          <article className="forms-card curriculum-card curriculum-card--featured">
            <div className="forms-card-head">
              <h2>PATH OF THE RECRUIT</h2>
            </div>
            <p>
              The route is non-linear by design. You can move through chapters in your own order, but each one strengthens the next. Learn the core concepts, solve the challenge, and rise through the tiers.
            </p>
            <div className="curriculum-pills">
              <span className="curriculum-pill">5 CHAPTERS OPEN</span>
              <span className="curriculum-pill">2 CHAPTERS LOCKED</span>
              <span className="curriculum-pill">XP-DRIVEN PROGRESSION</span>
            </div>
          </article>

          {curriculum.map((chapter) => (
            <article key={chapter.id} className="forms-card curriculum-card" style={{ '--accent': chapter.accent }}>
              <div className="forms-card-head">
                <h2>{chapter.title}</h2>
                <span className="curriculum-status">{chapter.status}</span>
              </div>
              <div className="curriculum-meta">
                <span className="curriculum-level">{chapter.level}</span>
                <span className="curriculum-reward">{chapter.reward}</span>
              </div>
              <p>{chapter.summary}</p>
              <ul className="curriculum-list">
                {chapter.modules.map((module) => (
                  <li key={module}>{module}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>

      <style>{`
        .hud-top-bar {
          height: 40px;
          border-bottom: 1px solid rgba(127,255,200,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          background: rgba(8,14,11,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          pointer-events: auto;
        }
        .hud-nav {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hud-nav-link {
          color: rgba(232,244,236,0.55);
          text-decoration: none;
          transition: color 0.2s;
          pointer-events: auto;
        }
        .hud-nav-link:hover,
        .hud-nav-link.is-active {
          color: #7fffd4;
        }
        .hud-user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: 8px;
        }
        .hud-username {
          color: #7fffd4;
        }
        .hud-logout-btn {
          background: transparent;
          border: 1px solid rgba(127,255,200,0.2);
          color: #7fffd4;
          padding: 4px 8px;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
        }
      `}</style>
    </div>
  )
}
