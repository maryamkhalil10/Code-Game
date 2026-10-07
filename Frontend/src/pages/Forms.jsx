import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getThreads, createThread, getThread, addReply, solveThread, markReplyAsSolution, upvoteThread, upvoteReply } from '../api/forum'
import { useAuth } from '../context/AuthContext'

const CHAPTERS = [
  { id: 'all',          label: 'ALL',          color: '#7fffd4' },
  { id: 'fundamentals', label: 'FUNDAMENTALS',  color: '#a8d8ff' },
  { id: 'control-flow', label: 'CONTROL FLOW',  color: '#ffb86b' },
  { id: 'loops',        label: 'LOOPS',         color: '#ff6b9d' },
  { id: 'arrays',       label: 'ARRAYS',        color: '#9b8cff' },
  { id: 'functions',    label: 'FUNCTIONS',     color: '#5fd1c4' },
]

const TIERS = {
  PROGAMER:   '#ffe66d',
  PROGRAMMER: '#9b8cff',
  AMATEUR:    '#ffb86b',
  NEWB:       '#5fd1c4',
}

const SORT_OPTIONS = [
  { id: 'recent',  label: 'RECENT'  },
  { id: 'replies', label: 'REPLIES' },
  { id: 'xp',      label: 'TOP XP'  },
]

function TierBadge({ tier }) {
  // Don't render a "NEW" badge next to new users (remove clutter)
  if (!tier || tier === 'NEWB') return null
  return (
    <span
      className="f-tier-badge"
      style={{ '--tc': TIERS[tier] || TIERS.NEWB }}
    >
      {tier}
    </span>
  )
}

function ChapterTag({ chapter }) {
  const ch = CHAPTERS.find(c => c.id === chapter)
  return (
    <span className="f-chapter-tag" style={{ '--tc': ch?.color ?? '#7fffd4' }}>
      {ch?.label ?? chapter.toUpperCase()}
    </span>
  )
}

export default function Forms() {
  const [chapter, setChapter] = useState('all')
  const [sort, setSort]       = useState('recent')
  const [search, setSearch]   = useState('')
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [selectedThread, setSelectedThread] = useState(null)
  const [loadingThread, setLoadingThread] = useState(false)

  const [replyContent, setReplyContent] = useState('')
  const [replyError, setReplyError] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newThreadData, setNewThreadData] = useState({
    title: '',
    chapter: 'fundamentals',
    tags: '',
    content: ''
  })
  const [createError, setCreateError] = useState('')

  const { user, logout } = useAuth()

  const fetchThreads = async () => {
    setLoading(true)
    try {
      const data = await getThreads(chapter, search, sort, page)
      setThreads(data.threads || [])
      setTotalPages(data.pages || 1)
    } catch (err) {
      console.error("Forum fetch failed:", err)
    }
    setLoading(false)
  }

  const fetchThreadDetail = async (id) => {
    setLoadingThread(true)
    try {
      const data = await getThread(id)
      setSelectedThread(data)
    } catch (err) {
      console.error("Failed to fetch thread detail:", err)
    }
    setLoadingThread(false)
  }

  useEffect(() => {
    fetchThreads()
  }, [chapter, search, sort, page])

  useEffect(() => {
    setPage(1)
  }, [chapter, search, sort])

  useEffect(() => {
    if (selectedThreadId) {
      fetchThreadDetail(selectedThreadId)
    } else {
      setSelectedThread(null)
    }
  }, [selectedThreadId])

  const handleCreateThread = async (e) => {
    e.preventDefault()
    setCreateError('')
    if (!newThreadData.title.trim() || !newThreadData.content.trim()) {
      setCreateError("Title and content are required")
      return
    }
    try {
      const token = localStorage.getItem("cg_token")
      const tagsArray = newThreadData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await createThread(token, {
        title: newThreadData.title,
        content: newThreadData.content,
        chapter: newThreadData.chapter,
        tags: tagsArray
      })
      setShowCreateModal(false)
      setNewThreadData({
        title: '',
        chapter: 'fundamentals',
        tags: '',
        content: ''
      })
      setPage(1)
      fetchThreads()
    } catch (err) {
      setCreateError(err.message || "Failed to create thread")
    }
  }

  const handleAddReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    setReplyError('')
    try {
      const token = localStorage.getItem("cg_token")
      await addReply(token, selectedThreadId, replyContent)
      setReplyContent('')
      fetchThreadDetail(selectedThreadId)
      fetchThreads()
    } catch (err) {
      setReplyError(err.message || "Failed to submit reply")
    }
  }

  const handleSolveThread = async () => {
    try {
      const token = localStorage.getItem("cg_token")
      await solveThread(token, selectedThreadId)
      setSelectedThread(prev => ({
        ...prev,
        thread: { ...prev.thread, solved: true }
      }))
      fetchThreads()
    } catch (err) {
      alert("Failed to solve thread: " + err.message)
    }
  }

  const handleMarkReplySolution = async (replyId) => {
    try {
      const token = localStorage.getItem("cg_token")
      await markReplyAsSolution(token, selectedThreadId, replyId)
      fetchThreadDetail(selectedThreadId)
      fetchThreads()
    } catch (err) {
      alert("Failed to mark solution: " + err.message)
    }
  }

  const handleUpvoteThread = async (threadId, e) => {
    e?.stopPropagation()
    try {
      const token = localStorage.getItem('cg_token')
      await upvoteThread(token, threadId)
      setThreads(prev => prev.map(t => t._id === threadId ? { ...t, upvotes: (t.upvotes||0) + 1 } : t))
      if (selectedThread && selectedThread.thread._id === threadId) {
        setSelectedThread(prev => ({ ...prev, thread: { ...prev.thread, upvotes: (prev.thread.upvotes||0) + 1 } }))
      }
    } catch (err) {
      console.error('Upvote thread failed', err)
      alert(err.message || 'Failed to upvote')
    }
  }

  const handleUpvoteReply = async (threadId, replyId, e) => {
    e?.stopPropagation()
    try {
      const token = localStorage.getItem('cg_token')
      await upvoteReply(token, threadId, replyId)
      if (selectedThread) {
        setSelectedThread(prev => ({
          ...prev,
          replies: prev.replies.map(r => r._id === replyId ? { ...r, upvotes: (r.upvotes||0) + 1 } : r)
        }))
      }
    } catch (err) {
      console.error('Upvote reply failed', err)
      alert(err.message || 'Failed to upvote reply')
    }
  }

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

      <main className="f-main">
        <div className="section-eyebrow">
          <span className="eyebrow-id">SECTION_05</span>
          <h1 className="eyebrow-title">FORMS</h1>
          <span className="eyebrow-sub">ASK_AND_ANSWER</span>
        </div>

        {selectedThreadId ? (
          /* Render Thread Detail View */
          <div className="f-detail-view">
            <button className="f-back-btn" onClick={() => setSelectedThreadId(null)}>
              ← BACK_TO_LOGS
            </button>

            {loadingThread || !selectedThread ? (
              <div className="f-loading">RETRIEVING_DATA_DECRYPTING...</div>
            ) : (
              <>
                <article className={`f-thread-detail-card ${selectedThread.thread.solved ? 'f-thread--solved' : ''}`}>
                  <div className="f-thread-meta-top">
                    <span className="f-author">
                      <TierBadge tier={selectedThread.thread.author?.tier} />
                      <span className="f-author-name">{selectedThread.thread.author?.username || 'ANON_USER'}</span>
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <ChapterTag chapter={selectedThread.thread.chapter} />
                      {selectedThread.thread.solved && <span className="f-solution-badge">✓ RESOLVED</span>}
                    </div>
                  </div>

                  <h2 className="eyebrow-title" style={{ fontSize: '24px', marginTop: '6px' }}>{selectedThread.thread.title}</h2>
                  
                  <div className="f-thread-meta-bottom" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button className="f-upvote-btn" onClick={(e) => handleUpvoteThread(selectedThread.thread._id, e)}>{selectedThread.thread.upvotes || 0} ▲</button>
                      <span className="f-tstat-label" style={{ fontSize: '10px', color: 'var(--text3)' }}>UPVOTES</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <span className="f-time f-time-right">{new Date(selectedThread.thread.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="f-thread-preview" style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text)', whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)' }}>
                    {selectedThread.thread.content}
                  </p>

                  {user && selectedThread.thread.author?._id === user._id && !selectedThread.thread.solved && (
                    <button className="f-new-post-btn" onClick={handleSolveThread} style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                      [ MARK_AS_SOLVED ]
                    </button>
                  )}
                </article>

                <div className="f-replies-section">
                  <h3 className="f-replies-title">REPLIES ({selectedThread.replies?.length || 0})</h3>
                  
                  {selectedThread.replies?.length === 0 ? (
                    <div className="f-empty" style={{ padding: '24px' }}>
                      <p>NO_RESPONSES_RECORDED</p>
                    </div>
                  ) : (
                    selectedThread.replies.map(reply => (
                      <div key={reply._id} className={`f-reply-card ${reply.isSolution ? 'f-reply-card--solution' : ''}`}>
                            <div className="f-reply-meta">
                              <span className="f-author">
                                <TierBadge tier={reply.author?.tier} />
                                <span className="f-author-name">{reply.author?.username || 'ANON_USER'}</span>
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="f-upvote-btn" onClick={(e) => handleUpvoteReply(selectedThread.thread._id, reply._id, e)}>{reply.upvotes || 0} ▲</button>
                                <span className="f-time">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                {reply.isSolution && <span className="f-solution-badge">✓ SOLUTION</span>}
                                {user && selectedThread.thread.author?._id === user._id && !reply.isSolution && (
                                  <button 
                                    className="f-mark-solution-btn"
                                    onClick={() => handleMarkReplySolution(reply._id)}
                                  >
                                    [ MARK SOLUTION ]
                                  </button>
                                )}
                              </div>
                            </div>
                        <p className="f-reply-content">{reply.content}</p>
                      </div>
                    ))
                  )}

                  {user ? (
                    <form onSubmit={handleAddReply} className="f-reply-form">
                      {replyError && <div className="auth-error">!! {replyError.toUpperCase()} !!</div>}
                      <textarea
                        className="f-reply-textarea"
                        placeholder="ENTER_RESPONSE_LOG..."
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        required
                      />
                      <button type="submit" className="f-reply-submit-btn">
                        [ TRANSMIT_RESPONSE ]
                      </button>
                    </form>
                  ) : (
                    <div className="f-empty" style={{ padding: '20px', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                      <p>AUTHENTICATION_REQUIRED_TO_REPLY. <Link to="/login" style={{ color: 'var(--mint)', textDecoration: 'none' }}>SIGN_IN_V1.0</Link></p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Render Thread List View */
          <>
            <p className="f-intro">
              Knowledge base initialized. Share questions, exchange code fragments, solve logic puzzles, and earn community XP.
              Posts and replies stay synchronized via MongoDB.
            </p>

            <div className="f-topbar">
              <div className="f-search-wrap">
                <span className="f-search-icon">⌕</span>
                <input
                  className="f-search"
                  type="text"
                  placeholder="SEARCH_LOGS..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="f-new-post-btn" onClick={() => {
                if (!user) {
                  alert("UNAUTHORIZED: ACCESS TERMINAL REQUIRED. Please sign in to initialize a thread.");
                  return;
                }
                setShowCreateModal(true);
              }}>
                [ + CREATE_POST ]
              </button>
            </div>

            <div className="f-controls">
              <div className="control-group">
                <span className="control-label">FILTER_CHAPTER</span>
                <div className="toggle-row">
                  {CHAPTERS.map(c => (
                    <button
                      key={c.id}
                      className={`toggle-btn ${chapter === c.id ? 'active' : ''}`}
                      style={chapter === c.id ? { '--ac': c.color } : {}}
                      onClick={() => setChapter(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="control-group">
                <span className="control-label">SORT_ORDER</span>
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
            </div>

            <div className="f-stats-row">
              <div className="f-stat">
                <span className="fstat-label">ACTIVE_THREADS</span>
                <span className="fstat-val">{threads.length}</span>
              </div>
              <div className="f-stat">
                <span className="fstat-label">RESOLVED</span>
                <span className="fstat-val" style={{ color: '#7fffd4' }}>
                  {threads.filter(t => t.solved).length}
                </span>
              </div>
              <div className="f-stat">
                <span className="fstat-label">COMMUNITY_REPLIES</span>
                <span className="fstat-val">
                  {threads.reduce((s, t) => s + (t.repliesCount || 0), 0)}
                </span>
              </div>
              <div className="f-stat">
                <span className="fstat-label">AGGREGATE_XP</span>
                <span className="fstat-val" style={{ color: '#ffe66d' }}>
                  {threads.reduce((s, t) => s + (t.xp || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="f-thread-list">
              {loading ? (
                <div className="f-loading">QUERYING_THREADS...</div>
              ) : threads.length === 0 ? (
                <div className="f-empty">
                  <span className="f-empty-icon">[ ]</span>
                  <p>NO_DATA_MATCHES_QUERY</p>
                </div>
              ) : (
                threads.map(thread => (
                  <article 
                    key={thread._id} 
                    className={`f-thread ${thread.solved ? 'f-thread--solved' : ''}`}
                    onClick={() => setSelectedThreadId(thread._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="f-thread-status">
                      {thread.solved ? <span className="status-solved">✓</span> : <span className="status-open">○</span>}
                    </div>

                      <div className="f-thread-body">
                        <div className="f-thread-meta-top">
                          <span className="f-author">
                            <TierBadge tier={thread.author?.tier} />
                            <span className="f-author-name">{thread.author?.username || 'ANON_USER'}</span>
                          </span>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <ChapterTag chapter={thread.chapter} />
                          </div>
                        </div>

                        <h2 className="f-thread-title">{thread.title}</h2>
                        <p className="f-thread-preview">{thread.content.slice(0, 100)}...</p>

                        <div className="f-thread-meta-bottom" style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ flex: 1 }} />
                          <span className="f-time f-time-right">{new Date(thread.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="f-thread-stats">
                        <div className="f-tstat">
                          <span className="f-tstat-val">{thread.repliesCount || 0}</span>
                          <span className="f-tstat-label">REPLIES</span>
                        </div>
                        <div className="f-tstat">
                          <button className="f-upvote-btn" onClick={(e) => { e.stopPropagation(); handleUpvoteThread(thread._id, e); }}>{thread.upvotes || 0} ▲</button>
                          <span className="f-tstat-label">UPVOTES</span>
                        </div>
                        <div className="f-tstat">
                          <span className="f-tstat-val" style={{ color: '#ffe66d' }}>+{thread.xp || 0}</span>
                          <span className="f-tstat-label">XP</span>
                        </div>
                      </div>
                  </article>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="f-pagination">
                <button 
                  className="f-pag-btn" 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  [ PREV ]
                </button>
                <span>PAGE {page} OF {totalPages}</span>
                <button 
                  className="f-pag-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  [ NEXT ]
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── CREATE THREAD MODAL ── */}
      {showCreateModal && (
        <div className="f-modal-overlay">
          <div className="f-modal">
            <h3 className="f-modal-title">INITIALIZE_NEW_THREAD</h3>
            <form onSubmit={handleCreateThread}>
              {createError && <div className="auth-error" style={{ marginBottom: '16px' }}>!! {createError.toUpperCase()} !!</div>}
              
              <div className="f-form-group">
                <label>THREAD_TITLE</label>
                <input 
                  type="text" 
                  className="f-form-input" 
                  placeholder="E.g., How does bubble sort compare to quicksort?"
                  value={newThreadData.title}
                  onChange={e => setNewThreadData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="f-form-group">
                <label>ASSOCIATED_CHAPTER</label>
                <select 
                  className="f-form-select"
                  value={newThreadData.chapter}
                  onChange={e => setNewThreadData(prev => ({ ...prev, chapter: e.target.value }))}
                >
                  {CHAPTERS.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="f-form-group">
                <label>TAGS (COMMA_SEPARATED)</label>
                <input 
                  type="text" 
                  className="f-form-input" 
                  placeholder="algorithms, sort, complexity"
                  value={newThreadData.tags}
                  onChange={e => setNewThreadData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="f-form-group">
                <label>CONTENT_BODY</label>
                <textarea 
                  className="f-form-textarea" 
                  placeholder="Write thread description and code fragments here..."
                  value={newThreadData.content}
                  onChange={e => setNewThreadData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>

              <div className="f-modal-actions">
                <button type="button" className="f-modal-btn" onClick={() => setShowCreateModal(false)}>
                  [ CANCEL ]
                </button>
                <button type="submit" className="f-modal-btn f-modal-btn--primary">
                  [ SUBMIT_THREAD ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="hud-bottom-bar">
        <div className="hud-zone-label">
          <span className="zone-key">ZONE</span>
          <span className="zone-val">FORMS</span>
        </div>
        <div className="hud-progress-track">
          <div className="hud-tick" style={{ '--l': '78%', '--c': '#5fd1c4' }} />
        </div>
        <div className="hud-scroll-pct">
          <span className="zone-key">STATUS</span>
          <span className="zone-val">ONLINE_SYNC</span>
        </div>
      </footer>

      <style>{`
        :root {
          --bg: #080e0b;
          --surface: #111a14;
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
        .hud-nav-link { color: var(--text2); text-decoration: none; pointer-events: auto; }
        .hud-nav-link:hover { color: var(--mint); }
        .hud-login-link { color: var(--mint); border: 1px solid var(--mint); padding: 4px 10px; border-radius: 2px; pointer-events: auto; }
        .hud-user-profile { display: flex; align-items: center; gap: 12px; pointer-events: auto; }
        .hud-logout-btn { background: transparent; border: 1px solid var(--text3); color: var(--text3); font-size: 9px; padding: 2px 6px; cursor: pointer; pointer-events: auto; }

        .f-main { flex: 1; max-width: 900px; margin: 0 auto; width: 100%; padding: 40px 24px; position: relative; z-index: 10; }
        .section-eyebrow { margin-bottom: 24px; }
        .eyebrow-id { font-size: 10px; color: var(--text3); font-family: var(--mono); }
        .eyebrow-title { font-size: 32px; font-weight: 700; color: var(--mint); letter-spacing: 0.05em; }
        .f-intro { font-size: 14px; color: var(--text2); max-width: 600px; line-height: 1.6; margin-bottom: 32px; font-family: var(--mono); }

        .f-topbar { display: flex; gap: 12px; margin-bottom: 20px; pointer-events: auto; }
        .f-search-wrap { flex: 1; position: relative; display: flex; align-items: center; pointer-events: auto; }
        .f-search-icon { position: absolute; left: 12px; color: var(--text3); font-size: 14px; }
        .f-search { width: 100%; padding: 10px 12px 10px 34px; background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--mono); font-size: 11px; outline: none; pointer-events: auto; }
        .f-new-post-btn { font-family: var(--mono); font-size: 11px; color: var(--mint); background: rgba(127,255,200,0.05); border: 1px solid var(--mint); padding: 10px 18px; cursor: pointer; transition: all 0.2s; pointer-events: auto; }
        .f-new-post-btn:hover { background: rgba(127,255,200,0.15); }

        .f-controls { display: flex; gap: 24px; margin-bottom: 24px; padding: 20px; background: var(--surface); border: 1px solid var(--border); pointer-events: auto; }
        .control-group { display: flex; flex-direction: column; gap: 8px; }
        .control-label { font-family: var(--mono); font-size: 9px; color: var(--text3); }
        .toggle-row { display: flex; gap: 6px; flex-wrap: wrap; pointer-events: auto; }
        .toggle-btn { font-family: var(--mono); font-size: 10px; background: transparent; border: 1px solid var(--border); color: var(--text2); padding: 5px 12px; cursor: pointer; pointer-events: auto; }
        .toggle-btn.active { border-color: var(--ac, var(--mint)); color: var(--ac, var(--mint)); background: rgba(127,255,200,0.05); }

        .f-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .f-stat { background: var(--surface); border: 1px solid var(--border); padding: 14px; display: flex; flex-direction: column; gap: 4px; }
        .fstat-label { font-size: 9px; color: var(--text3); font-family: var(--mono); }
        .fstat-val { font-size: 18px; font-weight: 700; font-family: var(--mono); }

        .f-thread { display: grid; grid-template-columns: 44px 1fr 100px; border: 1px solid var(--border); background: #0c1510; transition: background 0.15s; margin-bottom: -1px; }
        .f-thread:hover { background: rgba(127,255,200,0.03); }
        .f-thread--solved { border-left: 2px solid var(--mint); }
        .f-thread-status { display: flex; justify-content: center; padding-top: 20px; border-right: 1px solid var(--border); }
        .status-solved { color: var(--mint); }
        .status-open { color: var(--text3); }
        .f-thread-body { padding: 16px 20px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .f-thread-meta-top { display: flex; gap: 8px; align-items: center; }
        .f-chapter-tag { font-size: 8px; font-weight: 700; color: var(--tc); border: 1px solid var(--tc); padding: 2px 6px; font-family: var(--mono); }
        .f-tag { font-size: 8px; color: var(--text3); font-family: var(--mono); }
        .f-thread-title { font-size: 16px; color: var(--text); }
        .f-thread-preview { font-size: 12px; color: var(--text2); line-height: 1.5; font-family: var(--mono); }
        .f-author-name { font-size: 11px; color: var(--text2); font-family: var(--mono); display: inline-block; margin-left: 8px; }
        .f-tier-badge { font-size: 7px; border: 1px solid var(--tc); color: var(--tc); padding: 1px 4px; font-family: var(--mono); }
        .f-thread-stats { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        .f-tstat { text-align: center; }
        .f-tstat-val { font-size: 14px; font-weight: 700; font-family: var(--mono); }
        .f-tstat-label { font-size: 8px; color: var(--text3); font-family: var(--mono); }

        .hud-bottom-bar { height: 40px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; font-family: var(--mono); font-size: 9px; }
        .hud-zone-label { display: flex; flex-direction: column; margin-right: 20px; }
        .zone-key { color: var(--text3); }
        .zone-val { color: var(--mint); }
        .hud-progress-track { flex: 1; height: 1px; background: var(--border); position: relative; }
        .hud-tick { position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: var(--c); }

        /* Detail View and Modal styles */
        .f-detail-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .f-back-btn {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--mint);
          background: transparent;
          border: 1px solid var(--mint);
          padding: 8px 16px;
          cursor: pointer;
          align-self: flex-start;
          transition: all 0.2s;
        }
        .f-back-btn:hover {
          background: rgba(127,255,200,0.1);
        }
        .f-thread-detail-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }
        .f-thread-detail-card::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; width: 10px; height: 10px;
          border-top: 2px solid var(--mint); border-left: 2px solid var(--mint);
        }
        .f-replies-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .f-replies-title {
          font-family: var(--mono);
          font-size: 14px;
          color: var(--text2);
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-top: 16px;
        }
        .f-reply-card {
          background: #0c1510;
          border: 1px solid var(--border);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .f-reply-card--solution {
          border: 1px solid var(--mint);
          background: rgba(127,255,200,0.02);
        }
        .f-reply-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-family: var(--mono);
          color: var(--text3);
        }

        .f-upvote-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--mint);
          padding: 6px 8px;
          font-family: var(--mono);
          cursor: pointer;
          font-size: 11px;
        }
        .f-upvote-btn:hover { background: rgba(127,255,200,0.06); border-color: var(--mint); }

        .f-time-right { color: var(--mint); font-size: 11px; font-family: var(--mono); }
        .f-reply-content {
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.5;
          color: var(--text);
          white-space: pre-wrap;
        }
        .f-solution-badge {
          background: rgba(127,255,200,0.1);
          color: var(--mint);
          border: 1px solid var(--mint);
          padding: 2px 6px;
          font-size: 8px;
          font-weight: 700;
          font-family: var(--mono);
        }
        .f-mark-solution-btn {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--mint);
          border: 1px solid var(--mint);
          background: transparent;
          padding: 4px 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .f-mark-solution-btn:hover {
          background: var(--mint);
          color: var(--bg);
        }
        .f-reply-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .f-reply-textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--mono);
          font-size: 12px;
          outline: none;
          resize: vertical;
        }
        .f-reply-textarea:focus {
          border-color: var(--mint);
        }
        .f-reply-submit-btn {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--mint);
          background: rgba(127,255,200,0.05);
          border: 1px solid var(--mint);
          padding: 8px 16px;
          cursor: pointer;
          align-self: flex-end;
          transition: all 0.2s;
        }
        .f-reply-submit-btn:hover {
          background: rgba(127,255,200,0.15);
        }

        /* Modal / Overlay */
        .f-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(8,14,11,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .f-modal {
          background: var(--surface);
          border: 1px solid rgba(127,255,200,0.22);
          width: 100%;
          max-width: 600px;
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .f-modal::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; width: 20px; height: 20px;
          border-top: 2px solid var(--mint); border-left: 2px solid var(--mint);
        }
        .f-modal-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: var(--mint);
          margin-bottom: 20px;
          letter-spacing: 0.05em;
        }
        .f-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .f-form-group label {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text3);
          letter-spacing: 0.1em;
        }
        .f-form-input, .f-form-select, .f-form-textarea {
          background: #080e0b;
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--mono);
          font-size: 12px;
          padding: 10px;
          outline: none;
        }
        .f-form-input:focus, .f-form-select:focus, .f-form-textarea:focus {
          border-color: var(--mint);
        }
        .f-form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .f-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .f-modal-btn {
          font-family: var(--mono);
          font-size: 11px;
          padding: 10px 20px;
          cursor: pointer;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text2);
          transition: all 0.2s;
        }
        .f-modal-btn--primary {
          border-color: var(--mint);
          color: var(--mint);
          background: rgba(127,255,200,0.05);
        }
        .f-modal-btn--primary:hover {
          background: rgba(127,255,200,0.15);
        }
        .f-modal-btn:not(.f-modal-btn--primary):hover {
          border-color: var(--text2);
          color: var(--text);
        }
        
        .f-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text2);
        }
        .f-pag-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 6px 12px;
          cursor: pointer;
          font-family: var(--mono);
          font-size: 10px;
          transition: all 0.2s;
        }
        .f-pag-btn:hover:not(:disabled) {
          border-color: var(--mint);
          color: var(--mint);
        }
        .f-pag-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .auth-error {
          color: #ff6b9d;
          font-family: var(--mono);
          font-size: 11px;
          padding: 12px;
          border: 1px solid #ff6b9d;
          background: rgba(255,107,157,0.05);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
