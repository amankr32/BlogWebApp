import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import SingleBlog from "./pages/SingleBlog";
import AuthPage from "./pages/AuthPage";

// Secure route guard
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
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />
          <Route path="/login" element={<AuthPage isRegister={false} />} />
          <Route path="/register" element={<AuthPage isRegister={true} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#FFF",
            border: "1px solid #2C2C2C",
          },
        }}
      />
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
