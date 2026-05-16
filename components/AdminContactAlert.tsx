/**
 * Admin Contact Alert Component
 *
 * Displays error/warning messages with WhatsApp contact option
 * Used when credits are exhausted, connections fail, or data extraction issues occur
 */

import React from 'react';
import {
  AlertTriangle,
  XCircle,
  CreditCard,
  Unplug,
  Database,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

// WhatsApp contact for admin support
const ADMIN_WHATSAPP = '+966545670325';
const WHATSAPP_URL = `https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}`;

export type AlertType =
  | 'credits_exhausted'
  | 'connection_failed'
  | 'provider_disabled'
  | 'extraction_error'
  | 'limit_exceeded'
  | 'general_error';

interface AlertConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
  credits_exhausted: {
    icon: CreditCard,
    title: 'الرصيد منتهي',
    description: 'لقد استنفدت رصيدك من الكريدتس. يرجى التواصل مع الإدارة لإعادة الشحن.',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  connection_failed: {
    icon: Unplug,
    title: 'فشل الاتصال بالمزود',
    description: 'لم نتمكن من الاتصال بمزود البيانات. يرجى التواصل مع الإدارة لمراجعة الإعدادات.',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  provider_disabled: {
    icon: XCircle,
    title: 'المزود غير مفعل',
    description: 'هذا المزود غير مفعل حالياً لحسابك. يرجى طلب تفعيله من الإدارة.',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  extraction_error: {
    icon: Database,
    title: 'خطأ في استخراج البيانات',
    description: 'حدث خطأ أثناء استخراج البيانات. يرجى المحاولة مرة أخرى أو التواصل مع الإدارة.',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  limit_exceeded: {
    icon: AlertTriangle,
    title: 'تجاوز الحد المسموح',
    description: 'لقد تجاوزت الحد اليومي أو الشهري المسموح. يرجى الانتظار أو التواصل مع الإدارة لرفع الحد.',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  general_error: {
    icon: AlertTriangle,
    title: 'حدث خطأ',
    description: 'حدث خطأ غير متوقع. يرجى التواصل مع الإدارة للمساعدة.',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

interface AdminContactAlertProps {
  type: AlertType;
  customTitle?: string;
  customDescription?: string;
  details?: string;
  showWhatsApp?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AdminContactAlert: React.FC<AdminContactAlertProps> = ({
  type,
  customTitle,
  customDescription,
  details,
  showWhatsApp = true,
  onDismiss,
  className = '',
}) => {
  const config = ALERT_CONFIGS[type];
  const Icon = config.icon;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `مرحباً، أحتاج مساعدة بخصوص:\n${customTitle || config.title}\n${details || ''}`
    );
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
  };

  return (
    <div
      className={`rounded-xl border ${config.bgColor} ${config.borderColor} p-5 ${className}`}
      dir="rtl"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${config.color}`}>
            {customTitle || config.title}
          </h3>
          <p className={`text-sm mt-1 ${config.color} opacity-80`}>
            {customDescription || config.description}
          </p>

          {details && (
            <div className="mt-3 p-3 bg-white/50 rounded-lg border border-white">
              <p className="text-xs text-slate-600 font-mono">{details}</p>
            </div>
          )}

          {showWhatsApp && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={18} />
                تواصل عبر الواتساب
                <ExternalLink size={14} />
              </button>
              <span className="text-sm text-slate-500 self-center">
                {ADMIN_WHATSAPP}
              </span>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Inline version for smaller spaces
 */
export const AdminContactInline: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className = '' }) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(`مرحباً، ${message}`);
    window.open(`${WHATSAPP_URL}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span className="text-slate-600">{message}</span>
      <button
        onClick={handleWhatsAppClick}
        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
      >
        <MessageCircle size={14} />
        تواصل مع الإدارة
      </button>
    </div>
  );
};

/**
 * Full page error state
 */
export const AdminContactFullPage: React.FC<{
  type: AlertType;
  customTitle?: string;
  customDescription?: string;
}> = ({ type, customTitle, customDescription }) => {
  const config = ALERT_CONFIGS[type];
  const Icon = config.icon;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `مرحباً، أحتاج مساعدة بخصوص: ${customTitle || config.title}`
    );
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8" dir="rtl">
      <div className="max-w-md text-center">
        <div className={`w-20 h-20 rounded-2xl ${config.bgColor} mx-auto flex items-center justify-center mb-6`}>
          <Icon className={`w-10 h-10 ${config.color}`} />
        </div>
        <h1 className={`text-2xl font-bold ${config.color} mb-3`}>
          {customTitle || config.title}
        </h1>
        <p className="text-slate-600 mb-6">
          {customDescription || config.description}
        </p>
        <button
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
        >
          <MessageCircle size={20} />
          تواصل مع الإدارة عبر الواتساب
        </button>
        <p className="text-sm text-slate-500 mt-4">
          رقم الواتساب: {ADMIN_WHATSAPP}
        </p>
      </div>
    </div>
  );
};

export default AdminContactAlert;
