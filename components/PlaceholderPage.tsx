import React from 'react';

export const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="text-4xl mb-4">🚧</div>
        <div className="text-lg font-bold text-slate-600">صفحة {title} قيد التطوير</div>
        <p className="text-sm">نحن نبني هذه التجربة حالياً لتناسب احتياجاتك.</p>
    </div>
);
