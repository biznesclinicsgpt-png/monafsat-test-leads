/**
 * Sources & Import Page (Stage 0-1)
 *
 * Clay-like Sources Marketplace:
 * - Find (People, Companies, Jobs)
 * - Import (CSV, Apollo, Lemlist, Master DB)
 * - Signals (Job postings, News)
 * - Integrations (CRM, Warehouse)
 * - Custom (Webhook, API)
 *
 * All sources → Ingest API → Normalized Lead Object
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/constants';

// ==========================================
// TYPES
// ==========================================

type SourceCategory = 'find' | 'import' | 'signals' | 'integrations' | 'custom';
type SourceStatus = 'available' | 'coming_soon' | 'upgrade_required' | 'beta';

interface SourceConfig {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  category: SourceCategory;
  icon: string;
  status: SourceStatus;
  provider?: string;
  requiresApiKey?: boolean;
  fields?: string[];
}

type WizardStep = 'source' | 'config' | 'preview' | 'mapping' | 'normalize' | 'dedup' | 'commit' | 'complete';

interface FieldMapping {
  source: string;
  target: string;
  confidence: number;
  sample: string;
}

// ==========================================
// SOURCE DEFINITIONS
// ==========================================

const SOURCE_CATEGORIES: { id: SourceCategory; name: string; name_ar: string; icon: React.ComponentType<any> }[] = [
  { id: 'find', name: 'Find', name_ar: 'اكتشف', icon: Icons.Search },
  { id: 'import', name: 'Import', name_ar: 'استيراد', icon: Icons.Folder },
  { id: 'signals', name: 'Signals', name_ar: 'إشارات', icon: Icons.Zap },
  { id: 'integrations', name: 'Integrations', name_ar: 'تكاملات', icon: Icons.Link },
  { id: 'custom', name: 'Custom', name_ar: 'مخصص', icon: Icons.Code },
];

const SOURCES: SourceConfig[] = [
  // Find
  {
    id: 'find_people',
    name: 'Find People',
    name_ar: 'اكتشف أشخاص',
    description: 'Search for people by title, company, location',
    description_ar: 'ابحث عن أشخاص بالمسمى، الشركة، الموقع',
    category: 'find',
    icon: '👤',
    status: 'available',
    provider: 'apollo',
    fields: ['title', 'company', 'location', 'seniority'],
  },
  {
    id: 'find_companies',
    name: 'Find Companies',
    name_ar: 'اكتشف شركات',
    description: 'Search for companies by industry, size, location',
    description_ar: 'ابحث عن شركات بالقطاع، الحجم، الموقع',
    category: 'find',
    icon: '🏢',
    status: 'available',
    provider: 'apollo',
    fields: ['industry', 'size', 'location', 'technologies'],
  },
  {
    id: 'find_jobs',
    name: 'Find Jobs',
    name_ar: 'اكتشف وظائف',
    description: 'Find job postings for intent signals',
    description_ar: 'اكتشف إعلانات التوظيف كإشارات شراء',
    category: 'find',
    icon: '💼',
    status: 'beta',
    provider: 'linkedin',
    fields: ['job_title', 'company', 'location', 'posted_date'],
  },
  {
    id: 'find_google',
    name: 'Google Search',
    name_ar: 'بحث جوجل',
    description: 'Find leads with custom Google queries',
    description_ar: 'اكتشف عملاء محتملين عبر بحث مخصص',
    category: 'find',
    icon: '🌐',
    status: 'coming_soon',
  },
  {
    id: 'find_maps',
    name: 'Google Maps',
    name_ar: 'خرائط جوجل',
    description: 'Local businesses for GCC markets',
    description_ar: 'الأعمال المحلية لأسواق الخليج',
    category: 'find',
    icon: '🗺️',
    status: 'coming_soon',
  },

  // Import
  {
    id: 'import_csv',
    name: 'CSV / JSON File',
    name_ar: 'ملف CSV / JSON',
    description: 'Upload any CSV or JSON file',
    description_ar: 'ارفع أي ملف CSV أو JSON',
    category: 'import',
    icon: '📄',
    status: 'available',
  },
  {
    id: 'import_sheets',
    name: 'Google Sheets',
    name_ar: 'جوجل شيتس',
    description: 'Import from Google Sheets',
    description_ar: 'استيراد من جداول بيانات جوجل',
    category: 'import',
    icon: '📊',
    status: 'coming_soon',
  },
  {
    id: 'import_lemlist',
    name: 'Lemlist',
    name_ar: 'Lemlist',
    description: 'Import leads from Lemlist campaigns',
    description_ar: 'استيراد من حملات Lemlist',
    category: 'import',
    icon: '🧩',
    status: 'available',
    provider: 'lemlist',
    requiresApiKey: true,
  },
  {
    id: 'import_apollo',
    name: 'Apollo.io',
    name_ar: 'Apollo',
    description: 'Import from Apollo lists or exports',
    description_ar: 'استيراد من قوائم Apollo',
    category: 'import',
    icon: '🚀',
    status: 'available',
    provider: 'apollo',
    requiresApiKey: true,
  },
  {
    id: 'import_phantombuster',
    name: 'Phantombuster',
    name_ar: 'Phantombuster',
    description: 'Import Phantom outputs',
    description_ar: 'استيراد مخرجات Phantombuster',
    category: 'import',
    icon: '👻',
    status: 'available',
  },
  {
    id: 'import_master_db',
    name: 'Master Database',
    name_ar: 'قاعدة البيانات الرئيسية',
    description: 'Import from your internal database',
    description_ar: 'استيراد من قاعدة بياناتك الداخلية',
    category: 'import',
    icon: '🏦',
    status: 'available',
  },

  // Signals
  {
    id: 'signal_job_posting',
    name: 'Job Posting Signals',
    name_ar: 'إشارات التوظيف',
    description: 'Companies actively hiring for your ICP',
    description_ar: 'شركات توظف في مجالك المستهدف',
    category: 'signals',
    icon: '📌',
    status: 'beta',
  },
  {
    id: 'signal_job_change',
    name: 'Job Changes',
    name_ar: 'تغييرات وظيفية',
    description: 'New hires, promotions, role changes',
    description_ar: 'توظيف جديد، ترقيات، تغيير مناصب',
    category: 'signals',
    icon: '🔁',
    status: 'coming_soon',
  },
  {
    id: 'signal_news',
    name: 'News & Funding',
    name_ar: 'أخبار وتمويل',
    description: 'Fundraising, acquisitions, expansions',
    description_ar: 'جولات تمويل، استحواذات، توسعات',
    category: 'signals',
    icon: '📰',
    status: 'coming_soon',
  },
  {
    id: 'signal_intent',
    name: 'Web Intent',
    name_ar: 'نوايا الويب',
    description: 'Website visits, content downloads',
    description_ar: 'زيارات الموقع، تحميل المحتوى',
    category: 'signals',
    icon: '🧠',
    status: 'upgrade_required',
  },

  // Integrations
  {
    id: 'int_salesforce',
    name: 'Salesforce',
    name_ar: 'Salesforce',
    description: 'Sync from Salesforce CRM',
    description_ar: 'مزامنة من Salesforce',
    category: 'integrations',
    icon: '☁️',
    status: 'coming_soon',
  },
  {
    id: 'int_hubspot',
    name: 'HubSpot',
    name_ar: 'HubSpot',
    description: 'Sync from HubSpot CRM',
    description_ar: 'مزامنة من HubSpot',
    category: 'integrations',
    icon: '🧡',
    status: 'coming_soon',
  },
  {
    id: 'int_airtable',
    name: 'Airtable',
    name_ar: 'Airtable',
    description: 'Import from Airtable bases',
    description_ar: 'استيراد من قواعد Airtable',
    category: 'integrations',
    icon: '📋',
    status: 'coming_soon',
  },

  // Custom
  {
    id: 'custom_webhook',
    name: 'Webhook',
    name_ar: 'Webhook',
    description: 'Receive data via webhook endpoint',
    description_ar: 'استقبال بيانات عبر webhook',
    category: 'custom',
    icon: '🔗',
    status: 'available',
  },
  {
    id: 'custom_api',
    name: 'HTTP API Pull',
    name_ar: 'سحب API',
    description: 'Pull data from any REST API',
    description_ar: 'سحب بيانات من أي REST API',
    category: 'custom',
    icon: '🌐',
    status: 'beta',
  },
  {
    id: 'custom_sdk',
    name: 'Custom Connector',
    name_ar: 'موصل مخصص',
    description: 'Build your own connector with SDK',
    description_ar: 'ابني موصلك الخاص مع SDK',
    category: 'custom',
    icon: '🧩',
    status: 'upgrade_required',
  },
];

// ==========================================
// STATUS BADGE COMPONENT
// ==========================================

const StatusBadge = ({ status }: { status: SourceStatus }) => {
  const configs = {
    available: { label: 'متاح', labelEn: 'Available', bg: 'bg-green-100', text: 'text-green-700' },
    beta: { label: 'تجريبي', labelEn: 'Beta', bg: 'bg-purple-100', text: 'text-purple-700' },
    coming_soon: { label: 'قريباً', labelEn: 'Soon', bg: 'bg-amber-100', text: 'text-amber-700' },
    upgrade_required: { label: 'ترقية', labelEn: 'Pro', bg: 'bg-blue-100', text: 'text-blue-700' },
  };
  const config = configs[status];

  return (
    <span className={`px-2 py-0.5 ${config.bg} ${config.text} text-xs font-bold rounded-full`}>
      {config.label}
    </span>
  );
};

// ==========================================
// SOURCE CARD COMPONENT
// ==========================================

interface SourceCardProps {
  source: SourceConfig;
  onClick: () => void;
  disabled?: boolean;
}

const SourceCard = ({ source, onClick, disabled }: SourceCardProps) => {
  const isDisabled = disabled || source.status === 'coming_soon' || source.status === 'upgrade_required';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        p-4 rounded-xl border-2 text-right transition-all w-full
        ${isDisabled
          ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
          : 'border-slate-200 hover:border-brand hover:shadow-lg hover:shadow-brand/10 bg-white cursor-pointer'
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <StatusBadge status={source.status} />
        <span className="text-2xl">{source.icon}</span>
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{source.name_ar}</h4>
      <p className="text-xs text-slate-500 line-clamp-2">{source.description_ar}</p>
      {source.provider && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">via {source.provider}</span>
        </div>
      )}
    </button>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const ImportPage = () => {
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('source');
  const [selectedCategory, setSelectedCategory] = useState<SourceCategory>('import');
  const [selectedSource, setSelectedSource] = useState<SourceConfig | null>(null);

  // Source-specific state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Data state
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [normalizedCount, setNormalizedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Config state (for API sources)
  const [sourceConfig, setSourceConfig] = useState<Record<string, any>>({});

  // Wizard steps
  const wizardSteps = [
    { id: 'source', label: 'اختر المصدر', icon: Icons.Layers },
    { id: 'config', label: 'إعداد المصدر', icon: Icons.Settings },
    { id: 'preview', label: 'معاينة', icon: Icons.Eye },
    { id: 'mapping', label: 'ربط الحقول', icon: Icons.Link },
    { id: 'normalize', label: 'التطبيع', icon: Icons.Filter },
    { id: 'dedup', label: 'التكرارات', icon: Icons.Users },
    { id: 'commit', label: 'التأكيد', icon: Icons.Check },
  ];

  const filteredSources = SOURCES.filter(s => s.category === selectedCategory);

  // Handlers
  const handleSourceSelect = (source: SourceConfig) => {
    setSelectedSource(source);
    setCurrentStep('config');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    // Simulate file parsing and preview
    setTimeout(() => {
      setPreviewData([
        { first_name: 'محمد', last_name: 'العمري', email: 'mohammed@example.com', company: 'شركة التقنية', title: 'مدير التسويق' },
        { first_name: 'سارة', last_name: 'الحربي', email: 'sara@example.com', company: 'مؤسسة النجاح', title: 'رئيس المبيعات' },
        { first_name: 'أحمد', last_name: 'القحطاني', email: 'ahmed@example.com', company: 'شركة البناء', title: 'المدير العام' },
        { first_name: 'فاطمة', last_name: 'السيد', email: 'fatima@example.com', company: 'الرياض للتقنية', title: 'مدير العمليات' },
        { first_name: 'خالد', last_name: 'المنصور', email: 'khalid@example.com', company: 'شركة الطاقة', title: 'نائب الرئيس' },
      ]);
      setIsProcessing(false);
      setCurrentStep('preview');
    }, 1500);
  };

  const handleProceedToMapping = () => {
    setIsProcessing(true);

    // Simulate AI field mapping detection
    setTimeout(() => {
      setMappings([
        { source: 'first_name', target: 'first_name', confidence: 98, sample: 'محمد' },
        { source: 'last_name', target: 'last_name', confidence: 95, sample: 'العمري' },
        { source: 'email', target: 'email', confidence: 99, sample: 'mohammed@example.com' },
        { source: 'company', target: 'company_name', confidence: 92, sample: 'شركة التقنية' },
        { source: 'title', target: 'title_raw', confidence: 88, sample: 'مدير التسويق' },
      ]);
      setIsProcessing(false);
      setCurrentStep('mapping');
    }, 1000);
  };

  const handleNormalize = () => {
    setIsProcessing(true);

    // Simulate normalization
    setTimeout(() => {
      setNormalizedCount(previewData.length);
      setIsProcessing(false);
      setCurrentStep('normalize');
    }, 1500);
  };

  const handleDedup = () => {
    setIsProcessing(true);

    // Simulate dedup
    setTimeout(() => {
      setDuplicateCount(1); // Mock: found 1 duplicate
      setIsProcessing(false);
      setCurrentStep('dedup');
    }, 1000);
  };

  const handleCommit = () => {
    setIsProcessing(true);

    // Simulate commit
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('complete');
    }, 2000);
  };

  const resetWizard = () => {
    setCurrentStep('source');
    setSelectedSource(null);
    setFile(null);
    setPreviewData([]);
    setMappings([]);
    setNormalizedCount(0);
    setDuplicateCount(0);
    setSourceConfig({});
  };

  const goBack = () => {
    const stepOrder: WizardStep[] = ['source', 'config', 'preview', 'mapping', 'normalize', 'dedup', 'commit'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const currentStepIndex = wizardSteps.findIndex(s => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-bold">0-1</span>
            مصادر البيانات والتطبيع
          </h2>
          <p className="text-slate-500 mt-1">اختر مصدر البيانات واستورد إلى Pipeline الموحد</p>
        </div>
        {currentStep !== 'source' && currentStep !== 'complete' && (
          <button
            onClick={resetWizard}
            className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2"
          >
            <Icons.X className="w-4 h-4" />
            إلغاء
          </button>
        )}
      </div>

      {/* Progress Steps (only show after source selection) */}
      {currentStep !== 'source' && currentStep !== 'complete' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            {wizardSteps.slice(1).map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = currentStepIndex > index + 1;
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm
                      ${isActive ? 'bg-brand text-white' : isPast ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}
                    `}>
                      {isPast ? <Icons.Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium hidden lg:block ${isActive ? 'text-brand' : isPast ? 'text-green-600' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < wizardSteps.length - 2 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isPast ? 'bg-green-500' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Step: Source Selection */}
        {currentStep === 'source' && (
          <div className="p-6">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4 overflow-x-auto">
              {SOURCE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                const count = SOURCES.filter(s => s.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                      ${isActive ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name_ar}
                    <span className={`text-xs px-1.5 rounded ${isActive ? 'bg-white/20' : 'bg-slate-200'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Source Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSources.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onClick={() => handleSourceSelect(source)}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <StatusBadge status="available" />
                <span className="text-xs text-slate-500">جاهز للاستخدام</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="beta" />
                <span className="text-xs text-slate-500">نسخة تجريبية</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="coming_soon" />
                <span className="text-xs text-slate-500">قادم قريباً</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="upgrade_required" />
                <span className="text-xs text-slate-500">يتطلب ترقية</span>
              </div>
            </div>
          </div>
        )}

        {/* Step: Source Config */}
        {currentStep === 'config' && selectedSource && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">{selectedSource.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedSource.name_ar}</h3>
                <p className="text-sm text-slate-500">{selectedSource.description_ar}</p>
              </div>
            </div>

            {/* CSV/JSON Upload */}
            {selectedSource.id === 'import_csv' && (
              <div
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center transition-all
                  ${isDragging ? 'border-brand bg-blue-50' : 'border-slate-300 hover:border-brand hover:bg-slate-50'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin w-12 h-12 border-4 border-brand border-t-transparent rounded-full mb-4" />
                    <p className="text-slate-600 font-medium">جاري تحليل الملف...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.Folder className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      قم بسحب وإفلات ملف CSV أو JSON هنا
                    </h4>
                    <p className="text-slate-500 mb-6">
                      ندعم ملفات Apollo, Sales Navigator, Clay, Lemlist والمزيد
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".csv,.json"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                      <span className="px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors inline-block shadow-lg shadow-brand/20">
                        استعراض الملفات
                      </span>
                    </label>
                  </>
                )}
              </div>
            )}

            {/* API Source Config (Apollo, Lemlist, etc.) */}
            {selectedSource.requiresApiKey && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    ⚠️ تحتاج لإضافة API Key في <a href="/app/data-center/integrations" className="underline font-bold">إعدادات التكاملات</a>
                  </p>
                </div>

                {selectedSource.id === 'import_apollo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        نوع الاستيراد
                      </label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                        value={sourceConfig.importType || 'search'}
                        onChange={(e) => setSourceConfig({ ...sourceConfig, importType: e.target.value })}
                      >
                        <option value="search">بحث جديد (Search)</option>
                        <option value="list">قائمة محفوظة (Saved List)</option>
                        <option value="export">تصدير سابق (Export)</option>
                      </select>
                    </div>

                    {sourceConfig.importType === 'search' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            المسمى الوظيفي
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: CEO, CTO, VP Sales"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                            value={sourceConfig.titles || ''}
                            onChange={(e) => setSourceConfig({ ...sourceConfig, titles: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            الموقع
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: Saudi Arabia, UAE, Riyadh"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                            value={sourceConfig.location || ''}
                            onChange={(e) => setSourceConfig({ ...sourceConfig, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            عدد النتائج (Max)
                          </label>
                          <input
                            type="number"
                            placeholder="100"
                            min="10"
                            max="1000"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                            value={sourceConfig.limit || 100}
                            onChange={(e) => setSourceConfig({ ...sourceConfig, limit: parseInt(e.target.value) })}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {selectedSource.id === 'import_lemlist' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        اختر Campaign
                      </label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                        value={sourceConfig.campaignId || ''}
                        onChange={(e) => setSourceConfig({ ...sourceConfig, campaignId: e.target.value })}
                      >
                        <option value="">اختر...</option>
                        <option value="camp_1">Q1 2024 Outreach - KSA CTOs</option>
                        <option value="camp_2">Healthcare Decision Makers</option>
                        <option value="camp_3">Real Estate GCC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        حالة العملاء
                      </label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                        value={sourceConfig.leadStatus || 'all'}
                        onChange={(e) => setSourceConfig({ ...sourceConfig, leadStatus: e.target.value })}
                      >
                        <option value="all">الكل</option>
                        <option value="not_contacted">لم يتم التواصل</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="replied">رد</option>
                        <option value="interested">مهتم</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsProcessing(true);
                    // Simulate API fetch
                    setTimeout(() => {
                      setPreviewData([
                        { first_name: 'عبدالله', last_name: 'الراشد', email: 'abdullah@company.sa', company: 'شركة الطاقة المتجددة', title: 'CEO' },
                        { first_name: 'نورة', last_name: 'الفهد', email: 'noura@tech.sa', company: 'تقنية المستقبل', title: 'CTO' },
                        { first_name: 'سلطان', last_name: 'العتيبي', email: 'sultan@build.sa', company: 'البناء الذكي', title: 'VP Operations' },
                      ]);
                      setIsProcessing(false);
                      setCurrentStep('preview');
                    }, 2000);
                  }}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      جاري السحب...
                    </>
                  ) : (
                    <>
                      <Icons.Download className="w-5 h-5" />
                      سحب البيانات
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Master DB */}
            {selectedSource.id === 'import_master_db' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      فلترة حسب ICP
                    </label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                      value={sourceConfig.icpStatus || 'all'}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, icpStatus: e.target.value })}
                    >
                      <option value="all">الكل</option>
                      <option value="yes">ICP: نعم</option>
                      <option value="no">ICP: لا</option>
                      <option value="unknown">ICP: غير محدد</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      فلترة حسب Stage
                    </label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                      value={sourceConfig.stage || 'all'}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, stage: e.target.value })}
                    >
                      <option value="all">الكل</option>
                      <option value="1">Stage 1: Normalized</option>
                      <option value="2">Stage 2: Enriched</option>
                      <option value="3">Stage 3-4: ICP Verified</option>
                      <option value="5">Stage 5: Contactable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    عدد السجلات (Max)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    min="10"
                    max="5000"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                    value={sourceConfig.limit || 500}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, limit: parseInt(e.target.value) })}
                  />
                </div>

                <button
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setPreviewData([
                        { first_name: 'محمد', last_name: 'العمري', email: 'mohammed@example.com', company: 'شركة التقنية', title: 'مدير التسويق' },
                        { first_name: 'سارة', last_name: 'الحربي', email: 'sara@example.com', company: 'مؤسسة النجاح', title: 'رئيس المبيعات' },
                      ]);
                      setIsProcessing(false);
                      setCurrentStep('preview');
                    }, 1000);
                  }}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <Icons.Database className="w-5 h-5" />
                      تحميل من قاعدة البيانات
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Webhook */}
            {selectedSource.id === 'custom_webhook' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-3">استخدم الـ Webhook التالي لإرسال البيانات:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-sm font-mono break-all">
                      https://api.manafeth.com/ingest/webhook/abc123
                    </code>
                    <button className="p-3 bg-brand text-white rounded-lg hover:bg-brand-dark">
                      <Icons.Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    أو ألصق JSON مباشرة
                  </label>
                  <textarea
                    placeholder='[{"first_name": "محمد", "email": "m@example.com"}]'
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand h-40 font-mono text-sm"
                    value={sourceConfig.jsonData || ''}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, jsonData: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => {
                    try {
                      const data = JSON.parse(sourceConfig.jsonData || '[]');
                      setPreviewData(data);
                      setCurrentStep('preview');
                    } catch {
                      alert('خطأ في تنسيق JSON');
                    }
                  }}
                  className="w-full px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Code className="w-5 h-5" />
                  تحليل البيانات
                </button>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep('source')}
              className="mt-6 px-4 py-2 text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2"
            >
              <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
              اختيار مصدر آخر
            </button>
          </div>
        )}

        {/* Step: Preview */}
        {currentStep === 'preview' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">معاينة البيانات</h3>
                <p className="text-sm text-slate-500">تم استخراج {previewData.length} سجل - عرض أول 20</p>
              </div>
              {file && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  {file.name}
                </span>
              )}
            </div>

            {/* Field Stats */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'البريد', pct: 95, color: 'green' },
                { label: 'الاسم', pct: 100, color: 'green' },
                { label: 'الشركة', pct: 88, color: 'green' },
                { label: 'المسمى', pct: 76, color: 'yellow' },
                { label: 'الهاتف', pct: 42, color: 'red' },
              ].map((stat) => (
                <div key={stat.label} className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className={`text-xl font-bold ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{stat.pct}%</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-right font-bold text-slate-700">#</th>
                    <th className="p-3 text-right font-bold text-slate-700">الاسم الأول</th>
                    <th className="p-3 text-right font-bold text-slate-700">الاسم الأخير</th>
                    <th className="p-3 text-right font-bold text-slate-700">البريد</th>
                    <th className="p-3 text-right font-bold text-slate-700">الشركة</th>
                    <th className="p-3 text-right font-bold text-slate-700">المسمى</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.slice(0, 20).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">{i + 1}</td>
                      <td className="p-3 text-slate-900">{row.first_name}</td>
                      <td className="p-3 text-slate-900">{row.last_name}</td>
                      <td className="p-3 text-slate-600 font-mono text-xs">{row.email}</td>
                      <td className="p-3 text-slate-600">{row.company}</td>
                      <td className="p-3 text-slate-600">{row.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button onClick={goBack} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2">
                <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                السابق
              </button>
              <button
                onClick={handleProceedToMapping}
                disabled={isProcessing}
                className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    التالي: ربط الحقول
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Mapping */}
        {currentStep === 'mapping' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">ربط الحقول (AI-Detected)</h3>
                <p className="text-sm text-slate-500">تم اكتشاف الحقول تلقائياً - يمكنك تعديلها</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-1">
                <Icons.Zap className="w-3 h-3" />
                AI Mapping
              </span>
            </div>

            <div className="space-y-3">
              {mappings.map((mapping, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{mapping.source}</p>
                    <p className="text-xs text-slate-500">مثال: {mapping.sample}</p>
                  </div>
                  <Icons.ChevronLeft className="w-5 h-5 text-slate-300 rotate-180" />
                  <select
                    value={mapping.target}
                    onChange={(e) => {
                      const updated = [...mappings];
                      updated[index].target = e.target.value;
                      setMappings(updated);
                    }}
                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                  >
                    <option value="first_name">first_name</option>
                    <option value="last_name">last_name</option>
                    <option value="full_name">full_name</option>
                    <option value="email">email</option>
                    <option value="phone">phone</option>
                    <option value="company_name">company_name</option>
                    <option value="title_raw">title_raw</option>
                    <option value="linkedin_url">linkedin_url</option>
                    <option value="country">country</option>
                    <option value="city">city</option>
                    <option value="industry">industry</option>
                    <option value="skip">⏭️ تخطي</option>
                  </select>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    mapping.confidence >= 90 ? 'bg-green-100 text-green-700' :
                    mapping.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {mapping.confidence}%
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Icons.Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">حفظ قالب الربط؟</p>
                  <p className="text-blue-600 text-sm">يمكنك حفظ هذا الربط لاستخدامه في الاستيرادات القادمة من نفس المصدر</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button onClick={goBack} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2">
                <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                السابق
              </button>
              <button
                onClick={handleNormalize}
                disabled={isProcessing}
                className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    جاري التطبيع...
                  </>
                ) : (
                  <>
                    التالي: التطبيع
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Normalize */}
        {currentStep === 'normalize' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">التطبيع (AI Normalize)</h3>
                <p className="text-sm text-slate-500">تم تطبيع البيانات وفق المعايير الموحدة</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                {normalizedCount} سجل تم تطبيعه
              </span>
            </div>

            {/* Normalization Examples */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-700">أمثلة على التطبيع:</h4>

              <div className="grid gap-3">
                {[
                  { field: 'المسمى الوظيفي', before: 'VP of Sales & Marketing', after: 'VP Sales', change: 'Normalized + Seniority detected' },
                  { field: 'رقم الهاتف', before: '0551234567', after: '+966551234567', change: 'E.164 Format' },
                  { field: 'البريد', before: 'Ahmed@COMPANY.COM', after: 'ahmed@company.com', change: 'Lowercase + Trim' },
                  { field: 'حجم الشركة', before: '250', after: '201-500', change: 'Size Bracket' },
                ].map((example, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 mb-2">{example.field}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm line-through">{example.before}</span>
                      <Icons.ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm font-bold">{example.after}</span>
                      <span className="text-xs text-slate-400">{example.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{normalizedCount - 1}</p>
                <p className="text-sm text-slate-500">سجلات صالحة</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-slate-500">تحذيرات</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">0</p>
                <p className="text-sm text-slate-500">أخطاء</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button onClick={goBack} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2">
                <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                السابق
              </button>
              <button
                onClick={handleDedup}
                disabled={isProcessing}
                className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                التالي: فحص التكرارات
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Dedup */}
        {currentStep === 'dedup' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">فحص التكرارات</h3>
                <p className="text-sm text-slate-500">تم اكتشاف {duplicateCount} تكرار محتمل</p>
              </div>
            </div>

            {duplicateCount > 0 ? (
              <div className="space-y-4">
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icons.AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800">تم اكتشاف {duplicateCount} تكرار</p>
                      <p className="text-amber-700 text-sm">هذه السجلات موجودة مسبقاً في قاعدة البيانات</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900">mohammed@example.com</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">تكرار</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">السجل الحالي</p>
                      <p className="text-slate-700">محمد العمري - شركة التقنية</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">السجل الجديد</p>
                      <p className="text-slate-700">محمد العمري - شركة التقنية المتقدمة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1 bg-brand text-white text-sm font-bold rounded hover:bg-brand-dark">
                      دمج
                    </button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded hover:bg-slate-200">
                      تخطي
                    </button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded hover:bg-slate-200">
                      إضافة كسجل جديد
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Check className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-slate-900">لا توجد تكرارات</p>
                <p className="text-slate-500">جميع السجلات فريدة وجاهزة للإضافة</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button onClick={goBack} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2">
                <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
                السابق
              </button>
              <button
                onClick={handleCommit}
                disabled={isProcessing}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <Icons.Check className="w-4 h-4" />
                    تأكيد الاستيراد
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {currentStep === 'complete' && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Icons.Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">تم الاستيراد بنجاح!</h3>
              <p className="text-slate-500 mb-8">
                تم استيراد {previewData.length} سجل إلى Stage 1 (Normalized)
              </p>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{previewData.length}</p>
                  <p className="text-xs text-slate-500">إجمالي</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{previewData.length - duplicateCount}</p>
                  <p className="text-xs text-slate-500">جديد</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{duplicateCount}</p>
                  <p className="text-xs text-slate-500">مُدمج</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-slate-500">مرفوض</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/app/data-center/enrich')}
                  className="px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                >
                  الانتقال للإثراء (Stage 2)
                </button>
                <button
                  onClick={resetWizard}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  استيراد آخر
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Imports (only show on source selection) */}
      {currentStep === 'source' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-700">آخر عمليات الاستيراد</span>
            <button className="text-sm text-brand font-medium hover:underline">عرض الكل</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'KSA_CTOs_Apollo.csv', source: 'Apollo', count: 1250, status: 'success', time: 'منذ ساعتين' },
              { name: 'Lemlist Campaign Export', source: 'Lemlist', count: 450, status: 'success', time: 'منذ يوم' },
              { name: 'Healthcare_Leads.json', source: 'CSV', count: 820, status: 'partial', time: 'منذ 3 أيام' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded ${
                    item.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {item.status === 'success' ? <Icons.Check className="w-5 h-5" /> : <Icons.AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.source} • {item.time}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    item.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {item.status === 'success' ? 'مكتمل' : 'جزئي'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{item.count.toLocaleString()} صف</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
