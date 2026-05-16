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

import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import GrowthSystemPage from './pages/GrowthSystemPage';
import InvestmentPage from './pages/InvestmentPage';
import TestDeployment from './pages/TestDeployment';
import DataCenterLayout from './layouts/DataCenterLayout';
import DataCenterPage from './pages/DataCenter/DataCenterPage';
import ImportPage from './pages/DataCenter/ImportPage';
import EnrichPage from './pages/DataCenter/EnrichPage';
import ICPPage from './pages/DataCenter/ICPPage';
import ContactabilityPage from './pages/DataCenter/ContactabilityPage';
import CampaignPage from './pages/DataCenter/CampaignPage';
import DatabasePage from './pages/DataCenter/DatabasePage';
import ImportsPage from './pages/DataCenter/ImportsPage';
import StagingPage from './pages/DataCenter/StagingPage';
import ProviderPacksPage from './pages/DataCenter/ProviderPacksPage';
import IntegrationsPage from './pages/DataCenter/IntegrationsPage';
import ProvidersStatusPage from './pages/DataCenter/ProvidersStatusPage';

// Admin Pages
import IntegrationsHub from './pages/Admin/IntegrationsHub';
import WalletPage from './pages/Admin/WalletPage';
import WorkspacesPage from './pages/Admin/WorkspacesPage';
import AuditPage from './pages/Admin/AuditPage';
import { NewDashboardPage } from './pages/NewDashboardPage';

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GrowthSystemPage />} />
          <Route path="/growth" element={<GrowthSystemPage />} />
          <Route path="/investment" element={<InvestmentPage key="v3-forced" />} />
          <Route path="/investment-v3" element={<InvestmentPage key="v3-explicit" />} />
          <Route path="/scanner" element={<LandingPage />} />
          <Route path="/landing-legacy" element={<LandingPage />} />
          <Route path="/diagnosis" element={<NinjaDiagnosisPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/test-deploy" element={<TestDeployment />} />
          <Route path="/dashboard-new" element={<NewDashboardPage />} />

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

            {/* Data Center Module - GTM Pipeline */}
            <Route path="data-center" element={<DataCenterLayout />}>
              {/* Overview */}
              <Route index element={<DataCenterPage />} />

              {/* Pipeline Stages */}
              <Route path="import" element={<ImportPage />} />       {/* Stage 0-1 */}
              <Route path="enrich" element={<EnrichPage />} />       {/* Stage 2 */}
              <Route path="icp" element={<ICPPage />} />             {/* Stage 3-4 */}
              <Route path="contactability" element={<ContactabilityPage />} /> {/* Stage 5 */}
              <Route path="campaign" element={<CampaignPage />} />   {/* Stage 6 */}

              {/* Utilities */}
              <Route path="database" element={<DatabasePage />} />
              <Route path="providers-status" element={<ProvidersStatusPage />} />
              <Route path="integrations" element={<IntegrationsPage />} /> {/* Legacy - redirect to admin */}

              {/* Legacy routes (for backward compatibility) */}
              <Route path="imports" element={<ImportsPage />} />
              <Route path="staging" element={<StagingPage />} />
              <Route path="packs" element={<ProviderPacksPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="p-10 text-2xl font-bold">Admin Dashboard Overview (Coming Soon)</div>} />
            <Route path="integrations/*" element={<IntegrationsHub />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="workspaces" element={<WorkspacesPage />} />
            <Route path="audit" element={<AuditPage />} />
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
