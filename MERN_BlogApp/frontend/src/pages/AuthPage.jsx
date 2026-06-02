import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Command,
  ArrowRight,
  Mail,
  Lock,
  User,
  Github,
} from "lucide-react";

const Field = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
}) => {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--color-text-muted]"
          />
        )}
        <input
          type={isPass ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`input ${Icon ? "!pl-10" : ""} ${isPass ? "!pr-10" : ""} ${error ? "!border-red-500/50 focus:!ring-red-500/20" : ""}`}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted] hover:text-white transition-colors"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

const AuthPage = ({ isRegister }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    const e = {};
    if (isRegister) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.username.trim()) e.username = "Username is required";
      else if (form.username.length < 3) e.username = "Min 3 characters";
      else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
        e.username = "Letters, numbers, _ only";
      if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    }
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const fn = isRegister ? authAPI.register : authAPI.login;
      const { data } = await fn({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.data || data, data.token);
      toast.success(isRegister ? "Welcome to InkFlow! 🎉" : "Welcome back! 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[--shadow-glow]">
            <Command size={18} className="text-black stroke-[2.5]" />
          </div>
          <span className="font-black text-2xl text-white">
            Ink<span className="text-[--color-brand-hover]">Flow</span>
          </span>
        </Link>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-xl font-black text-white mb-1.5">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-xs text-[--color-text-muted]">
              {isRegister
                ? "Join thousands of writers on InkFlow"
                : "Sign in to continue writing and reading"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <Field
                  label="Full Name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="John Doe"
                  icon={User}
                  error={errors.name}
                />
                <Field
                  label="Username"
                  value={form.username}
                  onChange={set("username")}
                  placeholder="johndoe"
                  icon={User}
                  error={errors.username}
                />
              </>
            )}
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="john@example.com"
              icon={Mail}
              error={errors.email}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
            />
            {isRegister && (
              <Field
                label="Confirm Password"
                type="password"
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirm}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-2.5 mt-2 gap-2 text-sm font-semibold"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-[spin_1s_linear_infinite]" />
                  {isRegister ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}{" "}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[--color-border]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[10px] text-[--color-text-muted] uppercase tracking-wider bg-[--color-surface]">
                or
              </span>
            </div>
          </div>

          <button className="btn-secondary w-full gap-3 !py-2.5">
            <Github size={16} /> Continue with GitHub
          </button>

          <p className="text-center text-xs text-[--color-text-muted] mt-6">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-[--color-brand-hover] font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white hover:text-[--color-brand-hover] font-semibold transition-colors"
                >
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
