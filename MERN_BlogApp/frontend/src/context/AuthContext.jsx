
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('inkflow_token');
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authAPI.me();
        setUser(data.data || data);
      } catch {
        localStorage.removeItem('inkflow_token');
        localStorage.removeItem('inkflow_user');
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('inkflow_token', token);
    localStorage.setItem('inkflow_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('inkflow_token');
    localStorage.removeItem('inkflow_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

