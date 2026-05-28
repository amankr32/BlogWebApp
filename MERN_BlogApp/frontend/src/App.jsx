import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Component layout matrices
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import SingleBlog from './pages/SingleBlog';
import AuthPage from './pages/AuthPage';
import BlogForm from './pages/BlogForm';
import Dashboard from './pages/Dashboard';

// Secure route injection interceptor guard
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routing Infrastructure Vector mappings */}
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />
          <Route path="/login" element={<AuthPage isRegister={false} />} />
          <Route path="/register" element={<AuthPage isRegister={true} />} />

          {/* Secure Route intercept guards */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><BlogForm isEdit={false} /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><BlogForm isEdit={true} /></ProtectedRoute>} />
          
          {/* Missing path fallback fallback vector */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1A1A1A', color: '#FFF', border: '1px solid #2C2C2C' } }} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;