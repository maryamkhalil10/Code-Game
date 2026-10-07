import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLeaderboard } from '../api/leaderboard'
import { useAuth } from '../context/AuthContext'

const TIERS = {
  PROGAMER:    { label: 'PROGAMER',    color: '#ffe66d', rank: 4 },
  PROGRAMMER:  { label: 'PROGRAMMER',  color: '#9b8cff', rank: 3 },
  AMATEUR:     { label: 'AMATEUR',     color: '#ffb86b', rank: 2 },
  NEWB:        { label: 'NEWB',        color: '#5fd1c4', rank: 1 },
}

const CHAPTERS = [
  { id: 'all',          label: 'ALL CHAPTERS' },
  { id: 'fundamentals', label: 'FUNDAMENTALS' },
  { id: 'control-flow', label: 'CONTROL FLOW' },
  { id: 'loops',        label: 'LOOPS' },
  { id: 'arrays',       label: 'ARRAYS' },
  { id: 'functions',    label: 'FUNCTIONS' },
]

const SORT_OPTIONS = [
  { id: 'xp',     label: 'XP' },
  { id: 'streak', label: 'STREAK' },
  { id: 'tier',   label: 'TIER' },
]

function TierBadge({ tier }) {
  const t = TIERS[tier] || TIERS.NEWB
  return (
    <span
      className="tier-badge"
      style={{ '--tier-color': t.color }}
    >
      {t.label}
    </span>
  )
}

function RankMedal({ rank }) {
  if (rank === 1) return <span className="rank-medal gold">◆</span>
  if (rank === 2) return <span className="rank-medal silver">◆</span>
  if (rank === 3) return <span className="rank-medal bronze">◆</span>
  return <span className="rank-number">{String(rank).padStart(2, '0')}</span>
}

export default function Leaderboards() {
  const [chapter, setChapter] = useState('all')
  const [sort, setSort]       = useState('xp')
  const [view, setView]       = useState('global') // 'global' | 'friends'
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const data = await getLeaderboard(sort, chapter)
        setPlayers(data)
      } catch (err) {
        console.error("Leaderboard fetch failed:", err)
      }
      setLoading(false)
    }
    fetchLeaderboard()
  }, [sort, chapter])

  return (
    <div className="page-shell">
      {/* ── HUD TOP BAR ── */}
      <header className="hud-top-bar">
        <div className="hud-left">
          <span className="hud-diamond">◆</span>
          <span className="hud-project">PROJECT_CODEGAME</span>
          <span className="hud-sep">/</span>
          <span className="hud-build">BUILD 0.1.0-FYP</span>
        </div>
        <nav className="hud-nav">
          <Link to="/"             className="hud-nav-link">← BACK TO WORLD</Link>
          <Link to="/forums"       className="hud-nav-link">FORUMS</Link>
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

      <main className="lb-main">
        <div className="section-eyebrow">
          <span className="eyebrow-id">SECTION_04</span>
          <h1 className="eyebrow-title">LEADERBOARDS</h1>
          <span className="eyebrow-sub">VOICE_INDEX</span>
        </div>

        <p className="lb-intro">
          Ranking systems initialized. Global standings, chapter STANDINGS, and competitive filters are online.
          XP and STREAK data synchronized with MongoDB.
        </p>

        {/* ── CONTROLS ── */}
        <div className="lb-controls">
          <div className="control-group">
            <span className="control-label">VIEW</span>
            <div className="toggle-row">
              {['global', 'friends'].map(v => (
                <button
                  key={v}
                  className={`toggle-btn ${view === v ? 'active' : ''}`}
                  onClick={() => setView(v)}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">SORT BY</span>
            <div className="toggle-row">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.id}
                  className={`toggle-btn ${sort === s.id ? 'active' : ''}`}
                  onClick={() => setSort(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group control-group--wide">
            <span className="control-label">CHAPTER</span>
            <div className="toggle-row">
              {CHAPTERS.map(c => (
                <button
                  key={c.id}
                  className={`toggle-btn ${chapter === c.id ? 'active' : ''}`}
                  onClick={() => setChapter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="lb-stats-row">
          <div className="lb-stat-card">
            <span className="stat-label">TOTAL RECRUITS</span>
            <span className="stat-value">{players.length}</span>
          </div>
          <div className="lb-stat-card">
            <span className="stat-label">TOP PERFORMANCE</span>
            <span className="stat-value" style={{ color: '#ffe66d' }}>
              {players[0]?.xp.toLocaleString() ?? '—'} <small style={{ fontSize: '10px' }}>XP</small>
            </span>
          </div>
          <div className="lb-stat-card">
            <span className="stat-label">MAX STREAK</span>
            <span className="stat-value" style={{ color: '#ff6b9d' }}>
              {players.length > 0 ? Math.max(...players.map(p => p.streak)) : 0}d
            </span>
          </div>
          <div className="lb-stat-card">
            <span className="stat-label">PROGAMERS</span>
            <span className="stat-value" style={{ color: '#ffe66d' }}>
              {players.filter(p => p.tier === 'PROGAMER').length}
            </span>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="lb-table-wrap">
          <div className="lb-table-head">
            <span className="col-rank">RANK</span>
            <span className="col-player">PLAYER</span>
            <span className="col-tier">TIER</span>
            <span className="col-xp">XP</span>
            <span className="col-streak">STREAK</span>
            <span className="col-levels">LEVELS</span>
          </div>

          <div className="lb-table-body">
            {loading ? (
              <div className="lb-loading">FETCHING_STANDINGS...</div>
            ) : players.length === 0 ? (
              <div className="lb-empty">NO_DATA_AVAILABLE</div>
            ) : (
              players.map((player, i) => (
                <div
                  key={player.username}
                  className={`lb-row ${player.rank <= 3 ? 'lb-row--top' : ''} ${i % 2 === 0 ? 'lb-row--even' : ''}`}
                >
                  <span className="col-rank">
                    <RankMedal rank={player.rank} />
                  </span>
                  <span className="col-player">
                    <span className="player-name">{player.username}</span>
                  </span>
                  <span className="col-tier">
                    <TierBadge tier={player.tier} />
                  </span>
                  <span className="col-xp">
                    <span className="xp-bar-wrap">
                      <span
                        className="xp-bar-fill"
                        style={{ width: `${Math.min(100, (player.xp / (players[0]?.xp || 1)) * 100)}%` }}
                      />
                    </span>
                    <span className="xp-value">{player.xp.toLocaleString()}</span>
                  </span>
                  <span className="col-streak">
                    <span className="streak-val">{player.streak}</span>
                    <span className="streak-unit">d</span>
                  </span>
                  <span className="col-levels">{player.levels}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="hud-bottom-bar">
        <div className="hud-zone-label">
          <span className="zone-key">ZONE</span>
          <span className="zone-val">LEADERBOARDS</span>
        </div>
        <div className="hud-progress-track">
          <div className="hud-tick" style={{ left: '63%', '--c': '#9b8cff' }} />
        </div>
        <div className="hud-scroll-pct">
          <span className="zone-key">STATUS</span>
          <span className="zone-val">SYNCHRONIZED</span>
        </div>
      </footer>

      <style>{`
        :root {
          --bg: #080e0b;
          --surface: #111a14;
          --surface2: #16211a;
          --border: rgba(127,255,200,0.1);
          --mint: #7fffd4;
          --text: #ddeee6;
          --text2: #7a9e8c;
          --text3: #3d6050;
          --mono: 'JetBrains Mono', monospace;
        }
        .page-shell { min-height: 100vh; background: var(--bg); color: var(--text); display: flex; flex-direction: column; }
        .hud-top-bar {
          position: sticky; top: 0; z-index: 100;
          height: 40px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; font-family: var(--mono); font-size: 10px;
          background: rgba(8,14,11,0.9); backdrop-filter: blur(8px);
          pointer-events: auto;
        }
        .hud-nav { display: flex; gap: 20px; align-items: center; pointer-events: auto; }
        .hud-nav-link { color: var(--text2); text-decoration: none; transition: color 0.2s; pointer-events: auto; }
        .hud-nav-link:hover { color: var(--mint); }
        .hud-login-link { color: var(--mint); border: 1px solid var(--mint); padding: 4px 10px; border-radius: 2px; pointer-events: auto; }
        .hud-user-profile { display: flex; align-items: center; gap: 12px; pointer-events: auto; }
        .hud-logout-btn { background: transparent; border: 1px solid var(--text3); color: var(--text3); font-size: 9px; padding: 2px 6px; cursor: pointer; pointer-events: auto; }
        .hud-logout-btn:hover { border-color: var(--mint); color: var(--mint); }
        
        .lb-main { flex: 1; max-width: 1000px; margin: 0 auto; width: 100%; padding: 40px 24px; position: relative; z-index: 10; }
        .section-eyebrow { margin-bottom: 24px; }
        .eyebrow-id { font-size: 10px; color: var(--text3); font-family: var(--mono); }
        .eyebrow-title { font-size: 32px; font-weight: 700; color: var(--mint); letter-spacing: 0.05em; }
        .eyebrow-sub { font-size: 10px; color: var(--text3); font-family: var(--mono); }
        .lb-intro { font-size: 14px; color: var(--text2); max-width: 600px; line-height: 1.6; margin-bottom: 32px; font-family: var(--mono); }

        .lb-controls { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; padding: 20px; background: var(--surface); border: 1px solid var(--border); pointer-events: auto; }
        .control-group { display: flex; flex-direction: column; gap: 8px; }
        .control-label { font-family: var(--mono); font-size: 9px; color: var(--text3); }
        .toggle-row { display: flex; gap: 6px; pointer-events: auto; }
        .toggle-btn { font-family: var(--mono); font-size: 10px; background: transparent; border: 1px solid var(--border); color: var(--text2); padding: 5px 12px; cursor: pointer; pointer-events: auto; }
        .toggle-btn.active { border-color: var(--mint); color: var(--mint); background: rgba(127,255,200,0.05); }

        .lb-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .lb-stat-card { background: var(--surface); border: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; gap: 4px; }
        .stat-label { font-size: 9px; color: var(--text3); font-family: var(--mono); }
        .stat-value { font-size: 20px; font-weight: 700; font-family: var(--mono); }

        .lb-table-wrap { border: 1px solid var(--border); }
        .lb-table-head, .lb-row { display: grid; grid-template-columns: 60px 1fr 120px 180px 80px 70px; align-items: center; padding: 0 20px; gap: 12px; }
        .lb-table-head { height: 36px; background: var(--surface2); font-size: 9px; color: var(--text3); font-family: var(--mono); }
        .lb-row { height: 48px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .lb-row:hover { background: rgba(127,255,200,0.03); }
        .lb-row--top { background: rgba(127,255,200,0.02); }

        .col-rank { font-family: var(--mono); font-size: 12px; }
        .rank-medal { font-size: 14px; }
        .rank-medal.gold { color: #ffe66d; }
        .rank-medal.silver { color: #c0c8d0; }
        .rank-medal.bronze { color: #ffb86b; }
        .player-name { font-family: var(--mono); color: var(--text); }
        .tier-badge { font-size: 8px; font-weight: 700; color: var(--tier-color); border: 1px solid var(--tier-color); padding: 2px 6px; font-family: var(--mono); }
        .xp-bar-wrap { flex: 1; height: 2px; background: var(--border); border-radius: 1px; }
        .xp-bar-fill { height: 100%; background: var(--mint); transition: width 0.5s; }
        .xp-value { font-family: var(--mono); font-size: 11px; min-width: 50px; text-align: right; }
        .col-xp { display: flex; align-items: center; gap: 10px; }

        .hud-bottom-bar { height: 40px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; font-family: var(--mono); font-size: 9px; }
        .hud-zone-label { display: flex; flex-direction: column; margin-right: 20px; }
        .zone-key { color: var(--text3); }
        .zone-val { color: var(--mint); }
        .hud-progress-track { flex: 1; height: 1px; background: var(--border); position: relative; }
        .hud-tick { position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: var(--c); }
      `}</style>
    </div>
  )
}
