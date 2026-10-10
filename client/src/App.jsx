import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

function App() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All templates');
  const [templates, setTemplates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  );

  const categories = [
    'All templates',
    'Dashboard',
    'Portfolio',
    'Landing Page',
    'E-commerce',
  ];

  const styles = [
    'from-violet-500 to-indigo-700',
    'from-orange-400 to-rose-500',
    'from-cyan-500 to-blue-700',
    'from-emerald-400 to-teal-700',
    'from-pink-500 to-purple-700',
  ];

  const tags = ['Popular', 'Trending', 'New', 'Minimal', 'Featured'];

  useEffect(() => {
    async function loadTemplates() {
      try {
        const response = await api.get('/templates');
        const items = response.data.templates.map((item, index) => ({
          ...item,
          name: item.title,
          style: styles[index % styles.length],
          icon: '✦',
          tag: tags[index % tags.length],
        }));
        setTemplates(items);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    }

    async function loadFavorites() {
      if (!localStorage.getItem('token')) return;
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data.favorites.map((item) => item.id));
      } catch (error) {
        console.error('Failed to load favorites:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setFavorites([]);
        }
      }
    }

    loadTemplates();
    loadFavorites();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      `${template.name} ${template.description} ${template.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory =
      category === 'All templates' || template.category === category;
    const matchesFavorites =
      !showFavorites || favorites.includes(template.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  async function toggleFavorite(id) {
    if (!localStorage.getItem('token')) {
      alert('Please log in to save your favorite templates.');
      navigate('/login');
      return;
    }

    const alreadyFavorite = favorites.includes(id);
    try {
      if (alreadyFavorite) {
        await api.delete(`/favorites/${id}`);
        setFavorites((current) => current.filter((item) => item !== id));
      } else {
        await api.post(`/favorites/${id}`);
        setFavorites((current) => [...current, id]);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update favorites.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setFavorites([]);
    setShowFavorites(false);
    setMenuOpen(false);
    navigate('/templates');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fd] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            onClick={() => {
              setShowFavorites(false);
              setCategory('All templates');
              setSearch('');
              navigate('/templates');
            }}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-violet-200">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">
              Template<span className="text-violet-600">Hub.</span>
            </span>
          </button>

          <div className="hidden items-center gap-5 md:flex">
            <button
              onClick={() => {
                setShowFavorites(false);
                setCategory('All templates');
                setSearch('');
              }}
              className={!showFavorites ? 'font-semibold text-violet-700' : 'text-slate-500 hover:text-slate-900'}
            >
              Explore
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className={showFavorites ? 'font-semibold text-violet-700' : 'text-slate-500 hover:text-slate-900'}
            >
              My favorites ({favorites.length})
            </button>
            <Link to="/favorites" className="text-slate-500 hover:text-violet-700">
              Saved collection
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
              >
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:text-violet-700">
                  Log in
                </Link>
                <Link to="/register" className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? 'Close' : '☰ Menu'}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-3 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
            <button
              onClick={() => {
                setShowFavorites(false);
                setCategory('All templates');
                setSearch('');
                setMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left"
            >
              Explore templates
            </button>
            <button
              onClick={() => {
                setShowFavorites(true);
                setMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left"
            >
              My favorites ({favorites.length})
            </button>
            <Link to="/favorites" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2">
              Saved collection
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-rose-600">
                Log out
              </button>
            ) : (
              <div className="flex gap-3 px-3 py-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="font-semibold text-violet-700">Log in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="font-semibold text-violet-700">Register</Link>
              </div>
            )}
          </div>
        )}
      </header>
<main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8 lg:pt-12">

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#201344] via-[#38206e] to-[#6345cb] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">

          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />



          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-violet-100">

                <span className="h-2 w-2 rounded-full bg-emerald-300" />

                YOUR CREATIVE STARTING POINT

              </span>



              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">

                Great ideas deserve

                <span className="block text-violet-200">

                  beautiful websites.

                </span>

              </h1>



              <p className="mt-5 max-w-xl text-base leading-7 text-violet-100/80 sm:text-lg">

                Discover thoughtfully designed website templates,

                find your style, and save inspiration for your next project.

              </p>



              <button

                onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}

                className="mt-8 rounded-xl bg-white px-6 py-3.5 font-semibold text-violet-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-50"

              >

                Explore templates <span className="ml-2">→</span>

              </button>



              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-violet-100/80">

                <span>✦ Curated designs</span>

                <span>♡ Personal favorites</span>

                <span>⌘ Easy discovery</span>

              </div>

            </div>



            <div className="relative mx-auto w-full max-w-md">

              <div className="rotate-[-4deg] rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">

                <div className="rounded-xl bg-white p-4 text-slate-900 sm:p-5">

                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                    <div className="flex items-center gap-2">

                      <span className="h-3 w-3 rounded-full bg-rose-400" />

                      <span className="h-3 w-3 rounded-full bg-amber-400" />

                      <span className="h-3 w-3 rounded-full bg-emerald-400" />

                    </div>

                    <span className="text-xs text-slate-400">design-preview.dev</span>

                  </div>

                  <div className="mt-5 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 p-5 sm:p-7">

                    <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Creative studio</span>

                    <div className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">

                      Make your

                      <br />

                      next move.

                    </div>

                    <div className="mt-3 h-2 w-3/4 rounded-full bg-violet-200" />

                    <div className="mt-2 h-2 w-1/2 rounded-full bg-indigo-200" />

                    <div className="mt-6 flex gap-2">

                      <div className="h-8 w-24 rounded-lg bg-violet-600" />

                      <div className="h-8 w-20 rounded-lg border border-violet-200" />

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">

                    <div className="h-14 rounded-lg bg-rose-50" />

                    <div className="h-14 rounded-lg bg-amber-50" />

                    <div className="h-14 rounded-lg bg-emerald-50" />

                  </div>

                </div>

              </div>

              <div className="absolute -bottom-5 -left-3 rounded-xl border border-white/50 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl sm:-left-8">

                ✨ Find your style

              </div>

            </div>

          </div>

        </section>



        <section id="discover" className="pt-14 sm:pt-16">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">

                THE COLLECTION

              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">

                {showFavorites ? 'Your favorites' : 'Find your next design'}

              </h2>

              <p className="mt-2 text-slate-500">

                {showFavorites

                  ? 'Your personally curated inspiration.'

                  : 'Explore designs that bring your ideas to life.'}

              </p>

            </div>



            <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100 sm:w-80">

              <span className="text-lg text-slate-400">⌕</span>

              <input

                value={search}

                onChange={(event) => setSearch(event.target.value)}

                placeholder="Search templates..."

                aria-label="Search templates"

                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"

              />

              {search && (

                <button

                  onClick={() => setSearch('')}

                  className="text-slate-400 hover:text-slate-900"

                  aria-label="Clear search"

                >

                  ×

                </button>

              )}

            </div>

          </div>



          <div className="mt-7 flex gap-2 overflow-x-auto pb-3">

            {categories.map((item) => (

              <button

                key={item}

                onClick={() => setCategory(item)}

                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${

                  category === item

                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'

                    : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'

                }`}

              >

                {item}

              </button>

            ))}

          </div>



          <div className="mt-5 flex items-center justify-between">

            <p className="text-sm text-slate-500">

              Showing <span className="font-semibold text-slate-900">{filteredTemplates.length}</span> designs

            </p>

            <span className="text-xs font-medium text-slate-400">

              MADE FOR YOUR NEXT BIG IDEA

            </span>

          </div>

{loading ? (

  <p className="mt-8 text-center text-slate-500">

    Loading templates...

  </p>

) : filteredTemplates.length > 0 ? (

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredTemplates.map((template) => (

                <article

                  key={template.id}

                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"

                >

                  <div className="relative p-3 pb-0">

                    <div className={`relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${template.style} sm:h-52`}>

                      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/20" />

                      <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-white/20" />

                      <div className="relative w-[78%] rounded-xl border border-white/30 bg-white/15 p-4 text-white shadow-2xl backdrop-blur-sm transition duration-300 group-hover:scale-105">

                        <div className="flex items-center justify-between border-b border-white/25 pb-3">

                          <span className="text-sm font-bold">{template.name}</span>

                          <span className="text-xs opacity-75">MENU ☰</span>

                        </div>

                        <div className="mt-4 text-xl font-bold leading-tight">

                          {template.category === 'Portfolio'

                            ? 'Show your best work.'

                            : template.category === 'E-commerce'

                              ? 'Your store. Your story.'

                              : template.category === 'SaaS'

                                ? 'Build something great.'

                                : template.category === 'Blog'

                                  ? 'Stories worth sharing.'

                                  : template.category === 'Agency'

                                    ? 'Ideas into impact.'

                                    : 'A better way forward.'}

                        </div>

                        <div className="mt-3 h-1.5 w-3/4 rounded-full bg-white/40" />

                        <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/25" />

                        <div className="mt-4 flex gap-2">

                          <div className="h-5 w-16 rounded-md bg-white/80" />

                          <div className="h-5 w-12 rounded-md border border-white/50" />

                        </div>

                      </div>



                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">

                        {template.tag}

                      </span>

                    </div>



                    <button

                      onClick={() => toggleFavorite(template.id)}

                      aria-label={favorites.includes(template.id) ? 'Remove favorite' : 'Add favorite'}

                      aria-pressed={favorites.includes(template.id)}

                      className={`absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-md transition hover:scale-110 ${

                        favorites.includes(template.id)

                          ? 'text-rose-500'

                          : 'text-slate-400 hover:text-rose-500'

                      }`}

                    >

                      {favorites.includes(template.id) ? '♥' : '♡'}

                    </button>

                  </div>



                  <div className="p-5">

                    <div className="flex items-center justify-between gap-2">

                      <h3 className="text-lg font-bold tracking-tight">{template.name}</h3>

                      <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">

                        {template.category}

                      </span>

                    </div>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">

                      {template.description}

                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-xs font-medium text-slate-400">WEB DESIGN</span>

                      <button

                        onClick={() => toggleFavorite(template.id)}

                        className="rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"

                      >

                        {favorites.includes(template.id)

                          ? '♥ Saved'

                          : '+ Add to favorites'}

                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="text-4xl">⌕</div>

              <h3 className="mt-4 text-xl font-bold">No designs found</h3>

              <p className="mt-2 text-sm text-slate-500">

                Try another search or explore a different category.

              </p>

              <button

                onClick={() => {

                  setSearch('')

                  setCategory('All templates')

                  setShowFavorites(false)

                }}

                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"

              >

                Show all templates

              </button>

            </div>

          )}

        </section>



        <section className="mt-16 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-6 py-8 sm:px-10 sm:py-10">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold text-violet-600">YOUR NEXT CHAPTER</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">

                Every great website starts somewhere.

              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

                Discover a style you love, save your inspiration, and start building.

              </p>

            </div>

            <button

              onClick={() => {

                setShowFavorites(false)

                setCategory('All templates')

                setSearch('')

                document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })

              }}

              className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"

            >

              Discover designs →

            </button>

          </div>

        </section>




      </main>

    </div>

  )

}



export default App