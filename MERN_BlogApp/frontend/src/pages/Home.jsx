import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Sliders, Layers, ArrowUpRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
      {/* SaaS Premium Ambient Background Blur effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-saas-brand to-[#4338ca] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-saas-border text-xs px-3 py-1.5 rounded-full font-mono text-gray-300 mb-8 shadow-premium">
          <span className="w-1.5 h-1.5 rounded-full bg-saas-brand animate-pulse" />
          Nexus Production Core Engine 2.0 Active
        </div>
        
        <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 max-w-4xl mx-auto leading-[1.05]">
          Architectural ideas <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-600">
            rendered with precision.
          </span>
        </h1>
        
        <p className="text-saas-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans tracking-normal leading-relaxed">
          A high-performance writing ecosystem designed around structural markdown generation layout patterns, stateless token layers, and Vercel-speed rendering pipelines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
          <Link to="/blogs" className="btn-premium w-full group">
            Explore Publications 
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/register" className="btn-secondary w-full">
            Initialize Account
          </Link>
        </div>

        {/* Premium Feature Grid Panel sets */}
        <div className="grid sm:grid-cols-3 gap-6 mt-32 text-left border-t border-saas-border pt-16">
          <div className="p-6 rounded-xl bg-saas-surface/40 border border-saas-border backdrop-blur-sm group hover:bg-saas-surface/80 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-saas-border flex items-center justify-center text-white mb-4 group-hover:border-saas-brand duration-300">
              <Terminal size={16} />
            </div>
            <h3 className="font-semibold text-white mb-2 text-base flex items-center gap-1">
              Stateless Architecture <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-saas-muted leading-relaxed">Cryptographically signed JSON Web Tokens handle local identification validation operations natively without database lookup bloat.</p>
          </div>

          <div className="p-6 rounded-xl bg-saas-surface/40 border border-saas-border backdrop-blur-sm group hover:bg-saas-surface/80 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-saas-border flex items-center justify-center text-white mb-4 group-hover:border-saas-brand duration-300">
              <Sliders size={16} />
            </div>
            <h3 className="font-semibold text-white mb-2 text-base flex items-center gap-1">
              Micro-shadow Layouts <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-saas-muted leading-relaxed">UI component models render cleanly under sub-pixel border constraints inspired directly by modern enterprise engineering tools.</p>
          </div>

          <div className="p-6 rounded-xl bg-saas-surface/40 border border-saas-border backdrop-blur-sm group hover:bg-saas-surface/80 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-saas-border flex items-center justify-center text-white mb-4 group-hover:border-saas-brand duration-300">
              <Layers size={16} />
            </div>
            <h3 className="font-semibold text-white mb-2 text-base flex items-center gap-1">
              SEO Slug Execution <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-saas-muted leading-relaxed">Mongoose validation structures dynamically evaluate payload tracking paths to automate beautiful URL string structures cleanly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;