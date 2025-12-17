import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import MyNavbar from "./components/MyNavbar";
import PublicNavbar from "./components/PublicNavBar";
import About from "./components/About";
import Profile from "./components/Profile";
import Landing from "./components/Landing";
import Chatbot from './components/Chatbot';
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <>
              <PublicNavbar />
              <Landing />
            </>
          }
        />

        {/* Public About Page */}
        <Route
          path="/about"
          element={
            <>
              {isAuthenticated ? <MyNavbar /> : <PublicNavbar />}
              <About />
            </>
          }
        />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <>
                <PublicNavbar />
                <LoginForm />
              </>
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <>
                <PublicNavbar />
                <RegisterForm />
              </>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <MyNavbar />
                <Dashboard />
                <Chatbot />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <>
                <MyNavbar />
                <Transactions />
                <Chatbot />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <MyNavbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;