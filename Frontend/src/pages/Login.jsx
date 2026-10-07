import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "LOGIN_FAILURE: INVALID_CREDENTIALS");
    }
  };

  return (
    <div className="auth-page">
      <header className="hud-top-bar">
        <div className="hud-left">
          <span className="hud-diamond">◆</span>
          <span className="hud-project">PROJECT_CODEGAME</span>
        </div>
        <nav className="hud-nav">
          <Link to="/" className="hud-nav-link">← BACK_TO_WORLD</Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-container">
          <div className="section-eyebrow">
            <span className="eyebrow-id">SECTION_AUTH</span>
            <h1 className="eyebrow-title">ACCESS_TERMINAL</h1>
            <span className="eyebrow-sub">SIGN_IN_V1.0</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">!! {error.toUpperCase()} !!</div>}
            
            <div className="auth-input-group">
              <label>CODENAME / EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="RECRUIT_EMAIL@DOMAIN.NET"
                required
              />
            </div>

            <div className="auth-input-group">
              <label>ACCESS_KEY</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              [ EXECUTE_LOGIN ]
            </button>

            <p className="auth-footer">
              NEW_RECRUIT? <Link to="/register">INITIALIZE_ACCOUNT</Link>
            </p>
          </form>
        </div>
      </main>

      <div className="auth-scanlines"></div>

      <style>{`
        :root {
          --bg: #080e0b;
          --surface: #111a14;
          --mint: #7fffd4;
          --text: #ddeee6;
          --text2: #7a9e8c;
          --text3: #3d6050;
          --mono: 'JetBrains Mono', monospace;
        }

        .auth-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Space Grotesk', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .hud-top-bar {
          height: 40px;
          border-bottom: 1px solid rgba(127,255,200,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          background: rgba(8,14,11,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          pointer-events: auto;
        }

        .hud-nav-link {
          color: var(--text2);
          text-decoration: none;
          transition: color 0.2s;
          pointer-events: auto;
        }

        .hud-nav-link:hover {
          color: var(--mint);
        }

        .auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          z-index: 50;
          position: relative;
        }

        .auth-container {
          width: 100%;
          max-width: 420px;
          z-index: 60;
          position: relative;
          pointer-events: auto;
        }

        .section-eyebrow {
          margin-bottom: 32px;
          text-align: center;
        }

        .eyebrow-id {
          font-size: 10px;
          color: var(--text3);
          font-family: var(--mono);
          display: block;
          margin-bottom: 4px;
        }

        .eyebrow-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--mint);
          letter-spacing: 0.05em;
          margin: 0;
          text-shadow: 0 0 15px rgba(127,255,212,0.3);
        }

        .eyebrow-sub {
          font-size: 10px;
          color: var(--text3);
          font-family: var(--mono);
        }

        .auth-form {
          background: var(--surface);
          border: 1px solid rgba(127,255,200,0.1);
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          position: relative;
          pointer-events: auto;
        }

        .auth-form::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; width: 20px; height: 20px;
          border-top: 2px solid var(--mint); border-left: 2px solid var(--mint);
        }

        .auth-form::after {
          content: '';
          position: absolute;
          bottom: -1px; right: -1px; width: 20px; height: 20px;
          border-bottom: 2px solid var(--mint); border-right: 2px solid var(--mint);
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-input-group label {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 0.1em;
        }

        .auth-input-group input {
          background: #080e0b;
          border: 1px solid rgba(127,255,200,0.1);
          padding: 14px;
          color: var(--mint);
          font-family: var(--mono);
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          pointer-events: auto;
        }

        .auth-input-group input:focus {
          border-color: var(--mint);
          background: rgba(127,255,200,0.02);
          box-shadow: 0 0 10px rgba(127,255,200,0.1);
        }

        .auth-submit-btn {
          background: rgba(127,255,200,0.05);
          border: 1px solid var(--mint);
          color: var(--mint);
          padding: 16px;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
          pointer-events: auto;
        }

        .auth-submit-btn:hover {
          background: var(--mint);
          color: var(--bg);
          box-shadow: 0 0 20px rgba(127,255,212,0.4);
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

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(127,255,200,0.1);
        }

        .divider-text {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
        }

        .auth-footer {
          text-align: center;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text2);
        }

        .auth-footer a {
          color: var(--mint);
          text-decoration: none;
          font-weight: 700;
          margin-left: 4px;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        .auth-scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
}
