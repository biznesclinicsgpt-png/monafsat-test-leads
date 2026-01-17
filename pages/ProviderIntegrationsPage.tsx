
import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useData } from '../context/DataContext';
import { IntegrationProvider } from '../types';

const SortableItem = ({ integration, onToggle, onKeyChange }: {
    integration: IntegrationProvider,
    onToggle: (id: string, enabled: boolean) => void,
    onKeyChange: (id: string, key: string) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: integration.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm mb-3">
            {/* Drag Handle */}
            <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl shadow-inner border border-slate-100">
                {integration.icon}
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{integration.name}</h3>
                    {integration.costPerMatch && (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 rounded border border-emerald-100 font-bold">
                            ${integration.costPerMatch} / row
                        </span>
                    )}
                </div>

                {/* API Key Input */}
                <div className="mt-2 flex items-center gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">API Key:</label>
                    <input
                        type="password"
                        value={integration.apiKey}
                        onChange={(e) => onKeyChange(integration.id, e.target.value)}
                        placeholder={integration.enabled ? "Enter API Key" : "Disabled"}
                        className={`text-xs px-2 py-1 rounded border outline-none transition-all w-64 ${integration.enabled
                            ? 'bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                        disabled={!integration.enabled}
                    />
                </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${integration.enabled ? 'text-blue-600' : 'text-slate-400'}`}>
                    {integration.enabled ? 'Active' : 'Off'}
                </span>
                <button
                    onClick={() => onToggle(integration.id, !integration.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${integration.enabled ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                >
                    <span
                        className={`${integration.enabled ? 'translate-x-1' : 'translate-x-6'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
            </div>

            {/* Delete (Mock) */}
            <button className="text-slate-300 hover:text-red-500 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    );
};

const ProviderIntegrationsPage = () => {
    const { integrations, updateIntegrations } = useData();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && over?.id) {
            const oldIndex = integrations.findIndex(i => i.id === active.id);
            const newIndex = integrations.findIndex(i => i.id === over.id);

            const newOrder = arrayMove(integrations, oldIndex, newIndex) as IntegrationProvider[];
            // Re-assign priorities
            const ranked = newOrder.map((item, index) => {
                const updated: IntegrationProvider = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    apiKey: item.apiKey,
                    enabled: item.enabled,
                    priority: index,
                    costPerMatch: item.costPerMatch
                };
                return updated;
            });
            updateIntegrations(ranked);
        }
    };

    const handleToggle = (id: string, enabled: boolean) => {
        const updated = integrations.map(i =>
            i.id === id ? { ...i, enabled } : i
        );
        updateIntegrations(updated);
    };

    const handleKeyChange = (id: string, key: string) => {
        const updated = integrations.map(i =>
            i.id === id ? { ...i, apiKey: key } : i
        );
        updateIntegrations(updated);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6" dir="ltr">
            <div className="flex items-center justify-between" dir="rtl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">تكاملات مزودي البيانات (Integrations)</h1>
                    <p className="text-slate-500 mt-1">
                        قم بترتيب وتفعيل أدوات البحث عن البريد الإلكتروني. سيقوم النظام بتجربتها بالتسلسل (Waterfall) للعثور على بيانات التواصل.
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-bold border border-blue-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Active Waterfall Strategy
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="text-lg font-bold text-slate-700 mb-4 px-1" dir="rtl">ترتيب الأولويات (Drag to Reorder)</h2>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={integrations.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {integrations.map((integration) => (
                            <SortableItem
                                key={integration.id}
                                integration={integration}
                                onToggle={handleToggle}
                                onKeyChange={handleKeyChange}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default ProviderIntegrationsPage;
