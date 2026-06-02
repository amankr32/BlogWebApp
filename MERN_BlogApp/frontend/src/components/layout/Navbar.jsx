import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDebounce, useOutsideClick } from "../../hooks";
import { blogAPI } from "../../services/api";
import {
  Command,
  Plus,
  LayoutDashboard,
  LogOut,
  User,
  Search,
  X,
  Moon,
  Sun,
  BookmarkCheck,
  ChevronDown,
  Menu,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  const debouncedQ = useDebounce(searchQ, 400);
  const searchRef = useOutsideClick(() => {
    setSearchOpen(false);
    setResults([]);
  });
  const userMenuRef = useOutsideClick(() => setUserMenu(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!debouncedQ.trim()) {
      setResults([]);
      return;
    }
    const run = async () => {
      setSearching(true);
      try {
        const { data } = await blogAPI.getAll({ search: debouncedQ, limit: 5 });
        setResults(data.data || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    };
    run();
  }, [debouncedQ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  const navLinkCls = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-white"
        : "text-[--color-text-muted] hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-[--color-bg]/80 backdrop-blur-xl border-[--color-border]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-200">
            <Command size={14} className="text-black stroke-[2.5]" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            Ink<span className="text-[--color-brand-hover]">Flow</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link
            to="/blogs"
            className={
              navLinkCls("/blogs") + " px-3 py-2 rounded-lg hover:bg-white/5"
            }
          >
            Explore
          </Link>
          <Link
            to="/blogs?category=Technology"
            className="text-sm font-medium text-[--color-text-muted] hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Technology
          </Link>
          <Link
            to="/blogs?category=Programming"
            className="text-sm font-medium text-[--color-text-muted] hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Programming
          </Link>
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative" ref={searchRef}>
          {searchOpen ? (
            <div className="flex items-center gap-2 w-64 sm:w-80">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]"
                />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search articles..."
                  className="input !pl-9 !py-2 !text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQ("");
                }}
                className="btn-ghost !p-2"
              >
                <X size={15} />
              </button>
              {(results.length > 0 || searching) && (
                <div className="absolute top-full left-0 right-0 mt-2 card p-2 z-50 animate-[scaleIn_0.2s_ease-out]">
                  {searching ? (
                    <p className="text-xs text-[--color-text-muted] text-center py-3">
                      Searching…
                    </p>
                  ) : (
                    results.map((b) => (
                      <Link
                        key={b._id}
                        to={`/blog/${b.slug}`}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQ("");
                        }}
                      >
                        {b.coverImage && (
                          <img
                            src={b.coverImage}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {b.title}
                          </p>
                          <p className="text-xs text-[--color-text-muted]">
                            {b.author?.name || b.author?.username}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-ghost !p-2"
            >
              <Search size={17} />
            </button>
          )}
        </div>

        {/* Write button (desktop) */}
        {user && (
          <Link
            to="/create"
            className="btn-primary hidden sm:inline-flex !py-1.5 !px-3.5 gap-1.5"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Write
          </Link>
        )}

        {/* Auth */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`
                }
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[--color-border-strong]"
              />
              <ChevronDown
                size={13}
                className={`text-[--color-text-muted] hidden sm:block transition-transform duration-200 ${userMenu ? "rotate-180" : ""}`}
              />
            </button>

            {userMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 card p-1.5 z-50 animate-[scaleIn_0.2s_ease-out]">
                <div className="px-3 py-2 border-b border-[--color-border] mb-1">
                  <p className="font-semibold text-sm text-white">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-[--color-text-muted] truncate">
                    {user.email}
                  </p>
                </div>
                {[
                  {
                    to: `/profile/${user.username}`,
                    icon: User,
                    label: "Profile",
                  },
                  {
                    to: "/dashboard",
                    icon: LayoutDashboard,
                    label: "Dashboard",
                  },
                  { to: "/bookmarks", icon: BookmarkCheck, label: "Bookmarks" },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[--color-text-secondary] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Icon size={14} /> {label}
                  </Link>
                ))}
                <div className="border-t border-[--color-border] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary !py-1.5 !px-3.5 text-sm"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="sm:hidden btn-ghost !p-2"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu size={19} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="sm:hidden border-t border-[--color-border] bg-[--color-surface] px-5 py-4 space-y-1 animate-[fadeIn_0.2s_ease]">
          {[
            { to: "/blogs", label: "Explore" },
            { to: "/blogs?category=Technology", label: "Technology" },
            { to: "/blogs?category=Programming", label: "Programming" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-3 py-2 rounded-lg text-sm text-[--color-text-secondary] hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[--color-border] flex gap-2">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="btn-primary  flex-1 justify-center"
                >
                  <Plus size={14} /> Write
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-danger flex-1 justify-center"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-secondary flex-1 justify-center text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary   flex-1 justify-center text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
