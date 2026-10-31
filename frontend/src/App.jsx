import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Startup Pages
import StartupDashboard from './pages/startup/StartupDashboard';
import StartupProfile from './pages/startup/StartupProfile';
import StartupPitchDeck from './pages/startup/StartupPitchDeck';

// Investor Pages
import InvestorDashboard from './pages/investor/InvestorDashboard';
import StartupDiscovery from './pages/investor/StartupDiscovery';
import SavedStartups from './pages/investor/SavedStartups';
import InvestorMeetings from './pages/investor/InvestorMeetings';
import AiRecommendations from './pages/investor/AiRecommendations';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStartups from './pages/admin/AdminStartups';
import AdminInvestors from './pages/admin/AdminInvestors';
import AdminMeetings from './pages/admin/AdminMeetings';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Protected Route Guard
const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080415]">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'STARTUP') return <Navigate to="/dashboard" replace />;
    if (user.role === 'INVESTOR') return <Navigate to="/investor" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with Sidebar for Dashboard Pages
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080415] text-slate-100">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Standard Public Layout
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080415] text-slate-100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />

          {/* Startup Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="STARTUP">
                <DashboardLayout>
                  <StartupDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRole="STARTUP">
                <DashboardLayout>
                  <StartupProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pitch-deck"
            element={
              <ProtectedRoute allowedRole="STARTUP">
                <DashboardLayout>
                  <StartupPitchDeck />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Investor Routes */}
          <Route
            path="/investor"
            element={
              <ProtectedRoute allowedRole="INVESTOR">
                <DashboardLayout>
                  <InvestorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/recommendations"
            element={
              <ProtectedRoute allowedRole="INVESTOR">
                <DashboardLayout>
                  <AiRecommendations />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/startups"
            element={
              <PublicLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <StartupDiscovery />
                </div>
              </PublicLayout>
            }
          />
          <Route
            path="/investor/saved"
            element={
              <ProtectedRoute allowedRole="INVESTOR">
                <DashboardLayout>
                  <SavedStartups />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/meetings"
            element={
              <ProtectedRoute allowedRole="INVESTOR">
                <DashboardLayout>
                  <InvestorMeetings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/startups"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <DashboardLayout>
                  <AdminStartups />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/investors"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <DashboardLayout>
                  <AdminInvestors />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/meetings"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <DashboardLayout>
                  <AdminMeetings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <DashboardLayout>
                  <AdminAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
