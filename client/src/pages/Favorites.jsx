
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      if (!localStorage.getItem('token')) {
        setError('Please log in to view your favorites.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/favorites');
        setFavorites(response.data.favorites);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Could not load favorites.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function removeFavorite(id) {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not remove this favorite.'
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/templates"
          className="text-sm font-semibold text-violet-300 hover:text-violet-200"
        >
          ← Back to templates
        </Link>

        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-violet-300">
          YOUR COLLECTION
        </p>
        <h1 className="mt-2 text-4xl font-bold">Favorite templates</h1>
        <p className="mt-3 text-slate-400">
          All your saved designs, together in one place.
        </p>

        {loading ? (
          <p className="mt-10 text-slate-400">Loading favorites...</p>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-white/10 p-6">
            <p className="text-rose-300">{error}</p>
            {!localStorage.getItem('token') && (
              <Link
                to="/login"
                className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
              >
                Log in →
              </Link>
            )}
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 p-10 text-center">
            <p className="text-4xl">♡</p>
            <h2 className="mt-4 text-xl font-semibold">Nothing saved yet</h2>
            <p className="mt-2 text-slate-400">
              Browse the collection and save templates you love.
            </p>
            <Link
              to="/templates"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
            >
              Explore templates →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((template) => (
              <article
                key={template.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src={template.image_url}
                  alt={template.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold text-violet-300">
                    {template.category}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">
                    {template.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {template.description}
                  </p>
                  <button
                    onClick={() => removeFavorite(template.id)}
                    className="mt-5 rounded-xl border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-400/10"
                  >
                    ♡ Remove favorite
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
