
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await api.post('/auth/login', form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/templates');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <Link to="/templates" className="mb-8 block text-2xl font-black">
          <span className="text-violet-400">✦</span> TemplateHub
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-2 text-sm font-semibold text-violet-300">
            WELCOME BACK
          </p>
          <h1 className="text-3xl font-bold">Log in to TemplateHub</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your next great design starts here.
          </p>

          {error && (
            <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-violet-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
