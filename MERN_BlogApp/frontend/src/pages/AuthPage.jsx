import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Eye, Mail, Shield, ShieldCheck } from 'lucide-react';

const AuthPage = ({ isRegister }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await API.post(endpoint, formData);
      login({ _id: data._id, username: data.username, email: data.email }, data.token);
      toast.success(isRegister ? 'Credential sequence verified.' : 'Authorization key active.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access parameters rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl shadow-glow">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-saas-border flex items-center justify-center text-white mb-6 mx-auto shadow-premium">
          {isRegister ? <ShieldCheck size={18} /> : <Shield size={18} />}
        </div>
        
        <h2 className="font-sans text-xl font-bold text-center tracking-tight text-white mb-1">
          {isRegister ? 'Initialize Access Identity' : 'Authorize Core Operator'}
        </h2>
        <p className="text-xs text-center text-saas-muted font-mono mb-8">
          {isRegister ? 'Provision stateless data tokens' : 'Input signed session parameters'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {isRegister && (
            <div>
              <label className="block text-saas-muted font-medium mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <input 
                  type="text" required placeholder="Aman"
                  className="w-full bg-saas-bg border border-saas-border rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-saas-muted font-medium mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <input 
                type="email" required placeholder="aman@blogify.com"
                className="w-full bg-saas-bg border border-saas-border rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-saas-muted font-medium mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type="password" required minLength={6} placeholder="••••••••"
                className="w-full bg-saas-bg border border-saas-border rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="btn-premium w-full !py-2.5 !mt-6 font-sans font-semibold text-sm"
          >
            {loading ? 'Processing Cryptographic Pipeline...' : isRegister ? 'Register Framework Node' : 'Execute System Handshake'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-saas-muted">
          {isRegister ? (
            <span>Linked to infrastructure? <Link to="/login" className="text-white hover:underline font-medium">Verify Identity</Link></span>
          ) : (
            <span>Unprovisioned node terminal? <Link to="/register" className="text-white hover:underline font-medium font-sans">Build Identity</Link></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;