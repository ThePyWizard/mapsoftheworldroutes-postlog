import { login } from "../actions";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="login-shell">
      <form action={login} className="login-card">
        <svg
          className="login-compass"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="28" />
          <circle cx="32" cy="32" r="22" strokeDasharray="2 3" />
          <g className="login-compass-needle">
            <path d="M32 8 L35 32 L32 56 L29 32 Z" fill="currentColor" />
            <path d="M8 32 L32 30 L56 32 L32 34 Z" fill="currentColor" opacity="0.35" />
          </g>
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>

        <p className="login-eyebrow">Maps of the World Routes</p>

        <h1 className="login-title">The Logbook</h1>

        <div className="login-rule">
          <span className="login-rule-mark">N · S</span>
        </div>

        <div className="input-field">
          <label className="input-label" htmlFor="password">Passphrase</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="..."
            required
            autoFocus
            className="input"
          />
        </div>

        {error && <p className="error" style={{ marginBottom: 0 }}>Incorrect passphrase. Try again.</p>}

        <button type="submit" className="btn-primary">
          Enter the journal →
        </button>
      </form>
    </main>
  );
}
