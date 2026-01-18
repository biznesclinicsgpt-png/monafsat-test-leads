import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AdminLayout from './layouts/AdminLayout';
import AdminNinjaPage from './pages/AdminNinjaPage';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import ContactsManager from './components/Contacts/ContactsManager';
import LeadsPage from './pages/LeadsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import MessagesPage from './pages/MessagesPage';
import LandingPage from './pages/LandingPage';
import NinjaDiagnosisPage from './pages/NinjaDiagnosisPage';
import { PlaceholderPage } from './components/PlaceholderPage';

// Placeholder Pages for Phase 3 implementation
import FinancialPage from './pages/FinancialPage';
import ReviewsPage from './pages/ReviewsPage';
import ProviderIntegrationsPage from './pages/ProviderIntegrationsPage';
// import { PlaceholderPage } from './components/PlaceholderPage'; // Unused

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagnosis" element={<NinjaDiagnosisPage />} />

          {/* App Routes (Protected/Layout Wrapped) */}
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="contacts" element={<ContactsManager />} />
            <Route path="diagnosis" element={<NinjaDiagnosisPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Placeholder Routes */}
            <Route path="leads" element={<LeadsPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="financial" element={<FinancialPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="integrations" element={<ProviderIntegrationsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="p-10 text-2xl font-bold">Admin Dashboard Overview (Coming Soon)</div>} />
            <Route path="ninja" element={<AdminNinjaPage />} />
            <Route path="providers" element={<div className="p-10 text-2xl font-bold">Providers Management (Coming Soon)</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
};

export default App;
