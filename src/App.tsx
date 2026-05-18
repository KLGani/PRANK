import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User } from './types';
import { storage } from './utils/storage';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';

// Protected Route wrapper
function ProtectedRoute({ 
  user, 
  allowedRole, 
  children 
}: { 
  user: User | null; 
  allowedRole: 'student' | 'teacher';
  children: React.ReactNode;
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== allowedRole) {
    // Redirect to correct dashboard based on role
    return <Navigate to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />;
  }
  return <>{children}</>;
}

// Login Page with navigation
function LoginPage({ 
  onLogin 
}: { 
  onLogin: (user: User) => void;
}) {
  const navigate = useNavigate();
  
  return (
    <Login 
      onLogin={(user) => {
        onLogin(user);
        // Navigate to appropriate dashboard after login
        if (user.role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/teacher-dashboard');
        }
      }} 
      onSwitchToRegister={() => navigate('/register')} 
    />
  );
}

// Register Page with navigation
function RegisterPage({ 
  onRegister 
}: { 
  onRegister: (user: User) => void;
}) {
  const navigate = useNavigate();
  
  return (
    <Register 
      onRegister={(user) => {
        onRegister(user);
        // Navigate to appropriate dashboard after registration
        if (user.role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/teacher-dashboard');
        }
      }} 
      onSwitchToLogin={() => navigate('/login')} 
    />
  );
}

// Main App Content (inside BrowserRouter)
function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing session on app load
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    setIsLoading(false);
  }, []);

  // Handle redirect for authenticated users on root/login/register paths
  useEffect(() => {
    if (!isLoading && user) {
      const publicPaths = ['/', '/login', '/register'];
      if (publicPaths.includes(location.pathname)) {
        // Redirect to appropriate dashboard
        if (user.role === 'student') {
          navigate('/student-dashboard', { replace: true });
        } else {
          navigate('/teacher-dashboard', { replace: true });
        }
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    storage.setCurrentUser(loggedInUser);
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    storage.setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    storage.setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />
            ) : (
              <RegisterPage onRegister={handleRegister} />
            )
          } 
        />

        {/* Protected Routes - Student Dashboard */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <StudentDashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes - Teacher Dashboard */}
        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRole="teacher">
              <TeacherDashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// Main App Component with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
