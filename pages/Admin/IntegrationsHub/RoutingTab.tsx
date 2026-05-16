/**
 * Routing Tab - Admin Only
 *
 * Configure waterfall enrichment pipelines and provider ordering.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Settings2,
  Play,
  Pause,
  Save,
} from 'lucide-react';
import {
  getWaterfalls,
  saveWaterfall,
  deleteWaterfall,
  createWaterfall,
  getAvailableProviders,
  type Waterfall,
  type Provider,
} from '@/services/integrationsService';

const RoutingTab = () => {
  const [waterfalls, setWaterfalls] = useState<Waterfall[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const allProviders = getAvailableProviders();
    const activeProviders = allProviders.filter((p) => p.status === 'active');
    setProviders(activeProviders);
    const waterfallData = getWaterfalls();
    setWaterfalls(waterfallData);
    setLoading(false);
  };

  const enrichmentTypes = [
    { value: 'email', label: 'بريد إلكتروني', icon: '📧' },
    { value: 'phone', label: 'هاتف', icon: '📱' },
    { value: 'company', label: 'شركة', icon: '🏢' },
    { value: 'linkedin', label: 'لينكدإن', icon: '💼' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">تسلسلات الإثراء (Waterfall)</h2>
          <p className="text-sm text-slate-500 mt-1">
            حدد ترتيب المزودين لكل نوع إثراء - يتم تجربة المزودين بالترتيب حتى الحصول على نتيجة
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          تسلسل جديد
        </button>
      </div>

      {/* Waterfalls List */}
      <div className="space-y-4">
        {waterfalls.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-slate-300 mb-4">
              <Settings2 size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد تسلسلات بعد</h3>
            <p className="text-slate-500 mb-4">
              أنشئ تسلسل إثراء لتحديد كيفية البحث عن البيانات
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              إنشاء تسلسل
            </button>
          </div>
        ) : (
          waterfalls.map((waterfall) => (
            <WaterfallCard
              key={waterfall.id}
              waterfall={waterfall}
              providers={providers}
              isEditing={editingId === waterfall.id}
              onEdit={() => setEditingId(editingId === waterfall.id ? null : waterfall.id)}
              onSave={(updated) => {
                saveWaterfall(updated);
                setEditingId(null);
                loadData();
              }}
              onDelete={() => {
                if (confirm('هل تريد حذف هذا التسلسل؟')) {
                  deleteWaterfall(waterfall.id);
                  loadData();
                }
              }}
            />
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateWaterfallModal
          enrichmentTypes={enrichmentTypes}
          onClose={() => setShowCreate(false)}
          onCreate={(data) => {
            createWaterfall(data);
            setShowCreate(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Waterfall Card Component
const WaterfallCard = ({
  waterfall,
  providers,
  isEditing,
  onEdit,
  onSave,
  onDelete,
}: {
  waterfall: Waterfall;
  providers: Provider[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: (waterfall: Waterfall) => void;
  onDelete: () => void;
}) => {
  const [steps, setSteps] = useState(waterfall.steps);
  const [settings, setSettings] = useState({
    stopOnFirstMatch: waterfall.stopOnFirstMatch,
    maxProviders: waterfall.maxProviders,
    isActive: waterfall.isActive,
  });

  const typeIcons: Record<string, string> = {
    email: '📧',
    phone: '📱',
    company: '🏢',
    linkedin: '💼',
  };

  const typeLabels: Record<string, string> = {
    email: 'بريد إلكتروني',
    phone: 'هاتف',
    company: 'شركة',
    linkedin: 'لينكدإن',
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps.map((s, i) => ({ ...s, priority: i })));
  };

  const toggleStep = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], isEnabled: !newSteps[index].isEnabled };
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addProvider = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    setSteps([
      ...steps,
      {
        id: `new-${Date.now()}`,
        providerId,
        provider: {
          id: provider.id,
          slug: provider.slug,
          name: provider.name,
          logoUrl: provider.logoUrl,
          status: provider.status,
        },
        priority: steps.length,
        isEnabled: true,
      },
    ]);
  };

  const handleSave = () => {
    onSave({
      ...waterfall,
      ...settings,
      steps: steps.map((s, i) => ({ ...s, priority: i })),
    });
  };

  const usedProviderIds = new Set(steps.map((s) => s.providerId));
  const availableProviders = providers.filter((p) => !usedProviderIds.has(p.id));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[waterfall.enrichmentType] || '🔍'}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{waterfall.name}</h3>
            <p className="text-sm text-slate-500">
              {typeLabels[waterfall.enrichmentType] || waterfall.enrichmentType} •{' '}
              {steps.filter((s) => s.isEnabled).length} مزود نشط
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              waterfall.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {waterfall.isActive ? <Play size={12} /> : <Pause size={12} />}
            {waterfall.isActive ? 'نشط' : 'معطل'}
          </span>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            {isEditing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        {steps.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            لا يوجد مزودين - أضف مزودين لهذا التسلسل
          </p>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  step.isEnabled
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                {isEditing && (
                  <div className="text-slate-400 cursor-grab">
                    <GripVertical size={16} />
                  </div>
                )}
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {step.provider.logoUrl ? (
                  <img
                    src={step.provider.logoUrl}
                    alt={step.provider.name}
                    className="w-8 h-8 rounded object-contain bg-slate-50 p-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">
                    {step.provider.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-slate-900 flex-1">{step.provider.name}</span>

                {isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => toggleStep(index)}
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        step.isEnabled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.isEnabled ? 'مفعل' : 'معطل'}
                    </button>
                    <button
                      onClick={() => removeStep(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Provider Dropdown */}
        {isEditing && availableProviders.length > 0 && (
          <div className="mt-3">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addProvider(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 bg-slate-50 hover:bg-slate-100"
            >
              <option value="">+ إضافة مزود...</option>
              {availableProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Settings (when editing) */}
      {isEditing && (
        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                الحد الأقصى للمزودين
              </label>
              <input
                type="number"
                value={settings.maxProviders}
                onChange={(e) =>
                  setSettings({ ...settings, maxProviders: Number(e.target.value) })
                }
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`stop-${waterfall.id}`}
                checked={settings.stopOnFirstMatch}
                onChange={(e) =>
                  setSettings({ ...settings, stopOnFirstMatch: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600"
              />
              <label htmlFor={`stop-${waterfall.id}`} className="text-sm text-slate-700">
                توقف عند أول نتيجة
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`active-${waterfall.id}`}
                checked={settings.isActive}
                onChange={(e) =>
                  setSettings({ ...settings, isActive: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600"
              />
              <label htmlFor={`active-${waterfall.id}`} className="text-sm text-slate-700">
                تفعيل التسلسل
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
            >
              حذف التسلسل
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Save size={16} />
              حفظ التغييرات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Waterfall Modal
const CreateWaterfallModal = ({
  enrichmentTypes,
  onClose,
  onCreate,
}: {
  enrichmentTypes: { value: string; label: string; icon: string }[];
  onClose: () => void;
  onCreate: (data: { name: string; slug: string; enrichmentType: string; description?: string }) => void;
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [enrichmentType, setEnrichmentType] = useState('email');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) return;
    onCreate({ name, slug, enrichmentType, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">إنشاء تسلسل إثراء جديد</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              اسم التسلسل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '')
                );
              }}
              placeholder="مثال: تسلسل البريد الأساسي"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              المعرف (slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="email_primary"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              نوع الإثراء
            </label>
            <select
              value={enrichmentType}
              onChange={(e) => setEnrichmentType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {enrichmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الوصف (اختياري)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || !slug.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            إنشاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutingTab;
