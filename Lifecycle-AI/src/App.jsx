import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';

import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { RiskPredictorPage } from './pages/RiskPredictorPage';
import { ClaimGeneratorPage } from './pages/ClaimGeneratorPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { ResaleEstimatorPage } from './pages/ResaleEstimatorPage';
import { AIChatPage } from './pages/AIChatPage';
import { FamilyVaultPage } from './pages/FamilyVaultPage';
import { AITrainingStudioPage } from './pages/AITrainingStudioPage';
import { SeniorHealthPage } from './pages/SeniorHealthPage';
import { LoginPage } from './pages/LoginPage';

import { api, fetchWithAuth } from './api';

export { fetchWithAuth };

export function MainLayout() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';

  const fetchMetrics = async () => {
    try {
      const data = await api.metrics.get();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [currentUser]);

  const handleDocumentAdded = () => {
    fetchMetrics();
    navigate('/documents');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        metrics={metrics}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar 
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          metrics={metrics}
        />

        <main>
          <Routes>
            {/* 1. Dashboard (All Roles: Admin, Househelp, Senior) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Househelp', 'Senior']}>
                  <DashboardPage onOpenUpload={() => setIsUploadOpen(true)} />
                </ProtectedRoute>
              } 
            />

            {/* 2. All Documents (All Roles: Admin edits, Househelp/Senior view-only) */}
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Househelp', 'Senior']}>
                  <DocumentsPage onOpenUpload={() => setIsUploadOpen(true)} />
                </ProtectedRoute>
              } 
            />

            {/* 3. AI Chat Assistant (All Roles: Tailored to persona) */}
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Househelp', 'Senior']}>
                  <AIChatPage />
                </ProtectedRoute>
              } 
            />

            {/* 4. Senior Health & Wellness Hub (Senior and Admin only) */}
            <Route 
              path="/senior-health" 
              element={
                <ProtectedRoute allowedRoles={['Senior', 'Admin']}>
                  <SeniorHealthPage />
                </ProtectedRoute>
              } 
            />

            {/* 5. Family Vault (Admin and Senior only) */}
            <Route 
              path="/family-vault" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Senior']}>
                  <FamilyVaultPage />
                </ProtectedRoute>
              } 
            />

            {/* 6. AI Risk Prediction Engine (Admin only) */}
            <Route 
              path="/risk-prediction" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <RiskPredictorPage />
                </ProtectedRoute>
              } 
            />

            {/* 7. AI Claim & Dispute Generator (Admin only) */}
            <Route 
              path="/claim-generator" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ClaimGeneratorPage />
                </ProtectedRoute>
              } 
            />

            {/* 8. Extended Warranty Cost-Benefit Advisor (Admin only) */}
            <Route 
              path="/advisor" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdvisorPage />
                </ProtectedRoute>
              } 
            />

            {/* 9. Asset Resale Estimator (Admin only) */}
            <Route 
              path="/resale-estimator" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ResaleEstimatorPage />
                </ProtectedRoute>
              } 
            />

            {/* 10. AI Training Studio (Admin only) */}
            <Route 
              path="/ai-training" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AITrainingStudioPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Upload & AI Scanner Modal (Admin only) */}
      {isAdmin && (
        <DocumentUploadModal 
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      {/* Pastel Theme & Color Picker Modal */}
      <ThemeCustomizerModal 
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
}

export function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
