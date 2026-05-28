import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, LayoutDashboard, LogOut, Command } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 bg-saas-bg/60 border-x-0 border-t-0 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-sans font-bold text-sm tracking-wider text-white group">
          <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center group-hover:scale-105 duration-300 shadow-glow">
            <Command size={14} className="stroke-[2.5]" />
          </div>
          <span className="font-semibold tracking-tight text-base">BLOGIFY</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            to="/blogs" 
            className={`text-sm font-medium transition-colors ${isActive('/blogs') ? 'text-white' : 'text-saas-muted hover:text-white'}`}
          >
            Explore
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-saas-border pl-4">
              <Link to="/dashboard" className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive('/dashboard') ? 'text-white' : 'text-saas-muted hover:text-white'}`}>
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/create" className="btn-premium !py-1.5 !px-3 !rounded-md gap-1">
                <Plus size={14} className="stroke-[2.5]" />
                <span>Write</span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="text-saas-muted hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-saas-border pl-4">
              <Link to="/login" className="text-sm font-medium text-saas-muted hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="btn-premium !py-1.5 !px-3 !rounded-md">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;