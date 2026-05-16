/**
 * Integrations Page - Data Center
 *
 * This page was previously used for client-side integration management.
 * Integrations are now managed by administrators only.
 * Redirects to ProvidersStatusPage for read-only view.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const IntegrationsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to providers status page
    navigate('/app/data-center/providers-status', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand mx-auto mb-4" />
        <p className="text-slate-600">جاري التحويل...</p>
      </div>
    </div>
  );
};

export default IntegrationsPage;
