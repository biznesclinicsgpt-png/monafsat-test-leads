/**
 * Waterfall Configuration Component
 *
 * Manage enrichment waterfalls and their provider ordering.
 */

import { useState, useEffect } from 'react';
import { Icons } from '@/constants';
import {
  getWaterfalls,
  saveWaterfall,
  deleteWaterfall,
  createWaterfall,
  type Waterfall,
  type Provider,
} from '@/services/integrationsService';

interface WaterfallConfigProps {
  providers: Provider[];
}

export const WaterfallConfig = ({ providers }: WaterfallConfigProps) => {
  const [waterfalls, setWaterfalls] = useState<Waterfall[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadWaterfalls();
  }, []);

  const loadWaterfalls = () => {
    const data = getWaterfalls();
    setWaterfalls(data);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">تسلسلات الإثراء</h2>
          <p className="text-sm text-slate-500 mt-1">
            حدد ترتيب المزودين لكل نوع إثراء
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Icons.Projects size={16} />
          إنشاء تسلسل جديد
        </button>
      </div>

      {/* Waterfall List */}
      <div className="grid gap-6">
        {waterfalls.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
            <div className="text-slate-400 mb-2">
              <Icons.Settings size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              لا توجد تسلسلات بعد
            </h3>
            <p className="text-slate-500 mt-1">
              أنشئ تسلسل إثراء لتحديد ترتيب المزودين
            </p>
          </div>
        ) : (
          waterfalls.map((waterfall) => (
            <WaterfallCard
              key={waterfall.id}
              waterfall={waterfall}
              providers={providers}
              isEditing={editingId === waterfall.id}
              onEdit={() => setEditingId(waterfall.id)}
              onCancel={() => setEditingId(null)}
              onSave={() => {
                setEditingId(null);
                loadWaterfalls();
              }}
              onDelete={() => loadWaterfalls()}
            />
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateWaterfallModal
          providers={providers}
          enrichmentTypes={enrichmentTypes}
          onClose={() => setShowCreate(false)}
          onCreate={() => {
            setShowCreate(false);
            loadWaterfalls();
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
  onCancel,
  onSave,
  onDelete,
}: {
  waterfall: Waterfall;
  providers: Provider[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}) => {
  const [steps, setSteps] = useState(waterfall.steps);
  const [settings, setSettings] = useState({
    stopOnFirstMatch: waterfall.stopOnFirstMatch,
    maxProviders: waterfall.maxProviders,
    isActive: waterfall.isActive,
  });
  const [saving, setSaving] = useState(false);

  const typeLabels: Record<string, { label: string; icon: string }> = {
    email: { label: 'بريد', icon: '📧' },
    phone: { label: 'هاتف', icon: '📱' },
    company: { label: 'شركة', icon: '🏢' },
    linkedin: { label: 'لينكدإن', icon: '💼' },
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= steps.length) return;

    [newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ];

    setSteps(newSteps.map((s, i) => ({ ...s, priority: i })));
  };

  const handleToggleStep = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], isEnabled: !newSteps[index].isEnabled };
    setSteps(newSteps);
  };

  const handleAddProvider = (providerId: string) => {
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

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      saveWaterfall({
        ...waterfall,
        ...settings,
        steps: steps.map((s, i) => ({
          ...s,
          priority: i,
        })),
      });
      onSave();
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل تريد حذف هذا التسلسل؟')) return;

    try {
      deleteWaterfall(waterfall.id);
      onDelete();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const usedProviderIds = new Set(steps.map((s) => s.providerId));
  const availableProviders = providers.filter((p) => !usedProviderIds.has(p.id));

  const typeInfo = typeLabels[waterfall.enrichmentType] || {
    label: waterfall.enrichmentType,
    icon: '🔍',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeInfo.icon}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{waterfall.name}</h3>
            <p className="text-sm text-slate-500">
              {typeInfo.label} • {steps.filter((s) => s.isEnabled).length} مزود
              نشط
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              waterfall.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {waterfall.isActive ? 'نشط' : 'معطل'}
          </span>
          {!isEditing && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              تعديل
            </button>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <div className="space-y-2">
          {steps.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              لا يوجد مزودين في هذا التسلسل
            </p>
          ) : (
            steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  step.isEnabled
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>

                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {step.provider.name}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleToggleStep(index)}
                      className={`px-2 py-1 text-xs rounded ${
                        step.isEnabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {step.isEnabled ? 'مفعل' : 'معطل'}
                    </button>
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Provider (when editing) */}
        {isEditing && availableProviders.length > 0 && (
          <div className="mt-4">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddProvider(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 bg-slate-50"
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
          <div className="grid grid-cols-2 gap-4">
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
                checked={settings.stopOnFirstMatch}
                onChange={(e) =>
                  setSettings({ ...settings, stopOnFirstMatch: e.target.checked })
                }
                className="rounded border-slate-300"
              />
              <label className="text-sm text-slate-700">
                توقف عند أول نتيجة
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) =>
                setSettings({ ...settings, isActive: e.target.checked })
              }
              className="rounded border-slate-300"
            />
            <label className="text-sm text-slate-700">تفعيل التسلسل</label>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
            >
              حذف
            </button>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Waterfall Modal
const CreateWaterfallModal = ({
  providers,
  enrichmentTypes,
  onClose,
  onCreate,
}: {
  providers: Provider[];
  enrichmentTypes: { value: string; label: string; icon: string }[];
  onClose: () => void;
  onCreate: () => void;
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [enrichmentType, setEnrichmentType] = useState('email');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      createWaterfall({
        name,
        slug,
        enrichmentType,
        description,
      });
      onCreate();
    } catch (err) {
      console.error('Failed to create:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            إنشاء تسلسل إثراء جديد
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الاسم
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
            disabled={!name.trim() || !slug.trim() || saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'جاري الإنشاء...' : 'إنشاء'}
          </button>
        </div>
      </div>
    </div>
  );
};
