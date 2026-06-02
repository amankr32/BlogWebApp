import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/blog/BlogCard';
import { FeaturedBlogSkeleton, BlogCardSkeleton } from '../components/ui/Skeletons';
import { ArrowRight, Zap, BookOpen, Terminal, Sliders, Layers, ArrowUpRight, TrendingUp, Hash } from 'lucide-react';
import { CATEGORIES } from '../utils';

const CATEGORY_ICONS = {
  Technology:'⚡', Programming:'💻', Design:'🎨', Career:'🚀',
  Tutorial:'📚', Opinion:'💬', News:'📰', Other:'✨',
};

const Home = () => {
  const { user } = useAuth();
  const [featured,   setFeatured]   = useState([]);
  const [trending,   setTrending]   = useState([]);
  const [recent,     setRecent]     = useState([]);
  const [featLoad,   setFeatLoad]   = useState(true);
  const [trendLoad,  setTrendLoad]  = useState(true);
  const [recentLoad, setRecentLoad] = useState(true);

  useEffect(() => {
    Promise.all([
      blogAPI.getFeatured().then(r  => { setFeatured(r.data.data  || []); setFeatLoad(false);  }).catch(() => setFeatLoad(false)),
      blogAPI.getTrending().then(r  => { setTrending(r.data.data  || []); setTrendLoad(false); }).catch(() => setTrendLoad(false)),
      blogAPI.getAll({ limit: 8, sort: 'createdAt', order: 'desc' })
             .then(r  => { setRecent(r.data.data || []);   setRecentLoad(false); }).catch(() => setRecentLoad(false)),
    ]);
  }, []);

  const features = [
    { icon: Terminal, title: 'JWT Authentication',    desc: 'Cryptographically-signed tokens with 30-day expiry, role-based access, and automatic refresh.' },
    { icon: Sliders,  title: 'Rich Editor',           desc: 'Markdown support, live word count, read-time estimation, draft saving, and cover images.' },
    { icon: Layers,   title: 'SEO-Ready Slugs',       desc: 'Auto-generated URL slugs from titles, view counters, and category taxonomy for discoverability.' },
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[--color-brand]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[--color-accent]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-page py-24 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[--color-surface]/80 backdrop-blur-md border border-[--color-border] text-xs px-3.5 py-1.5 rounded-full font-mono text-[--color-text-secondary] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[--color-brand] animate-[pulse_2s_ease-in-out_infinite]" />
            InkFlow v2.0 — Production Ready
          </div>

          <h1 className="font-sans text-5xl md:text-7xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.04] text-balance">
            Where ideas <br />
            <span className="brand-gradient-text">find their words</span>
          </h1>

          <p className="text-[--color-text-secondary] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A high-performance blogging platform for developers and creators. Write, ship, and grow your audience with InkFlow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/create" className="btn-primary px-8 py-3 text-base gap-2">
                Start Writing <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-8 py-3 text-base gap-2">
                  <Zap size={16} /> Get Started Free
                </Link>
                <Link to="/blogs" className="btn-secondary px-8 py-3 text-base gap-2">
                  <BookOpen size={16} /> Explore Articles
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-12 mt-16 pt-10 border-t border-[--color-border]">
            {[['10K+','Articles'],['5K+','Writers'],['50K+','Readers']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-black text-3xl text-white mb-0.5">{v}</div>
                <div className="text-xs text-[--color-text-muted] font-mono uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[--color-border]">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[--color-brand-hover] uppercase tracking-widest mb-2">
                <Zap size={12} /> Editor's Picks
              </div>
              <h2 className="text-3xl font-black text-white">Featured Stories</h2>
            </div>
            <Link to="/blogs" className="btn-ghost text-sm gap-1 hidden sm:flex">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featLoad
              ? [1,2,3].map(n => <FeaturedBlogSkeleton key={n} />)
              : (featured.length > 0 ? featured : recent).slice(0,3).map(b => (
                  <BlogCard key={b._id} blog={b} variant="featured" />
                ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-[--color-border] bg-[--color-surface]/30">
        <div className="container-page">
          <h2 className="text-xl font-bold text-white mb-5">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <Link
                key={cat}
                to={`/blogs?category=${cat}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[--color-card] border border-[--color-border] text-sm font-medium text-[--color-text-secondary] hover:text-white hover:border-[--color-border-strong] transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feed + Trending sidebar ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">

            {/* Feed */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[--color-text-muted] uppercase tracking-widest mb-2">
                <Hash size={11} /> Latest Articles
              </div>
              <h2 className="text-2xl font-black text-white mb-8">Fresh from the community</h2>
              {recentLoad
                ? [1,2,3,4].map(n => <div key={n} className="py-4 border-b border-[--color-border]"><BlogCardSkeleton /></div>)
                : recent.map(b => <BlogCard key={b._id} blog={b} variant="horizontal" />)
              }
              <div className="mt-8">
                <Link to="/blogs" className="btn-secondary gap-2">
                  Browse all articles <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Trending sidebar */}
            <div>
              <div className="sticky top-24">
                <div className="flex items-center gap-2 text-xs font-mono text-[--color-text-muted] uppercase tracking-widest mb-2">
                  <TrendingUp size={11} /> Trending
                </div>
                <h2 className="text-xl font-black text-white mb-6">Most Read</h2>
                <div className="space-y-5">
                  {trendLoad
                    ? [1,2,3,4,5].map(n => (
                        <div key={n} className="flex gap-3 items-start">
                          <div className="skeleton h-7 w-7 rounded" />
                          <div className="flex-1 space-y-2"><div className="skeleton h-4 w-full" /><div className="skeleton h-3 w-16" /></div>
                        </div>
                      ))
                    : trending.slice(0,5).map((b, i) => (
                        <Link key={b._id} to={`/blog/${b.slug}`} className="flex gap-4 group">
                          <span className="text-4xl font-black text-[--color-surface] leading-none mt-0.5 select-none w-8 flex-shrink-0 group-hover:text-[--color-border] transition-colors">
                            {String(i+1).padStart(2,'0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[--color-text-secondary] group-hover:text-white transition-colors line-clamp-2">
                              {b.title}
                            </p>
                            <p className="text-xs text-[--color-text-muted] font-mono mt-0.5">
                              {b.author?.name || b.author?.username}
                            </p>
                          </div>
                        </Link>
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[--color-border]">
        <div className="container-page">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Built for modern developers</h2>
            <p className="text-[--color-text-muted] max-w-xl mx-auto">Everything you need to write, publish, and grow your audience.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 group hover:border-[--color-border-strong] hover:-translate-y-1 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[--color-surface] border border-[--color-border] flex items-center justify-center text-white mb-4 group-hover:border-[--color-brand]/40 group-hover:text-[--color-brand-hover] transition-all">
                  <Icon size={17} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-[--color-border] bg-gradient-to-br from-[--color-surface] to-[--color-card] p-12 text-center">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[--color-brand]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Ready to share your story?</h2>
              <p className="text-[--color-text-muted] mb-8 text-lg max-w-xl mx-auto">
                Join thousands of developers writing on InkFlow. Your next article could change someone's career.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <Link to="/create" className="btn-primary px-8 py-3 text-base gap-2">
                    Write Article <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary px-8 py-3 text-base gap-2">
                      Create Free Account <ArrowRight size={16} />
                    </Link>
                    <Link to="/blogs" className="btn-secondary px-8 py-3 text-base">
                      Browse Articles
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
