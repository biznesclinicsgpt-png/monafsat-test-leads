/**
 * Provider Integrations Page - Client View
 *
 * This page was previously used for client-side integration management.
 * Integrations are now managed by administrators only.
 * This page now redirects clients to contact admin for any integration requests.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Shield,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Zap,
} from 'lucide-react';

// Admin WhatsApp contact
const ADMIN_WHATSAPP = '+966545670325';

const ProviderIntegrationsPage = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن التكاملات والمزودين المتاحة لحسابي');
    window.open(`https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8" dir="rtl">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 mx-auto flex items-center justify-center mb-8 shadow-lg">
          <Lock className="w-12 h-12 text-slate-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          التكاملات تُدار من قبل الإدارة
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8">
          لضمان أمان بياناتك وحماية مفاتيح API، يتم إدارة التكاملات ومزودي البيانات
          حصرياً من قبل فريق الإدارة.
        </p>

        {/* Features */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-right">
          <h3 className="font-bold text-slate-800 mb-4">ما يمكنك القيام به:</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-600">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>عرض حالة المزودين المتاحين لحسابك</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>متابعة استهلاك الرصيد والحدود</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>طلب تفعيل مزودين جدد</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>طلب رفع حدود الاستخدام</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
          >
            <MessageCircle className="w-5 h-5" />
            تواصل مع الإدارة
          </button>
          <button
            onClick={() => navigate('/app/data-center/providers-status')}
            className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <Zap className="w-5 h-5" />
            عرض حالة المزودين
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* WhatsApp Number */}
        <p className="text-sm text-slate-500 mt-6">
          رقم الواتساب: <span className="font-medium">{ADMIN_WHATSAPP}</span>
        </p>

        {/* Security Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Shield className="w-4 h-4" />
          <span>بياناتك ومفاتيح API محمية بتشفير AES-256</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderIntegrationsPage;
