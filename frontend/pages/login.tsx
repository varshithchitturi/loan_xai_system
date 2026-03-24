import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        await axios.post(`${API_BASE}/auth/register`, {
          username,
          full_name: fullName,
          password,
          role: 'customer'
        });
      }

      const res = await axios.post(
        `${API_BASE}/auth/token`,
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      window.localStorage.setItem('token', res.data.access_token);
      window.location.href = '/';
    } catch {
      setError(mode === 'register' ? 'Registration failed' : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="glass-card max-w-sm w-full p-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Use your credentials to access the XAI loan studio.'
              : 'Create a customer account and enter the portal.'}
          </p>
        </div>
        <div className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 mb-1">Full name</label>
              <input
                className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-slate-300 mb-1">Username</label>
            <input
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-xs text-red-400">{error}</div>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 via-sky-500 to-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 py-2.5 shadow-lg shadow-primary-500/50 disabled:opacity-60"
        >
          {loading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Creating...'
            : mode === 'login'
              ? 'Sign in'
              : 'Create & Sign in'}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900/70 border border-slate-700/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 px-3 py-2 hover:border-primary-500 hover:text-primary-200 transition-colors"
        >
          {mode === 'login' ? 'Create a new account' : 'Back to sign in'}
        </button>
        <div className="text-[10px] text-slate-500 mt-1">
          Demo accounts: <span className="text-slate-300">admin / officer / customer</span> with
          password <span className="text-slate-300">admin123 / officer123 / customer123</span>.
        </div>
      </form>
    </div>
  );
}

