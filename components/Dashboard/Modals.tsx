import React from 'react';
import { DashboardTheme } from '../../lib/theme';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100 translate-y-0"
                style={{
                    fontFamily: DashboardTheme.Typography.FontFamily.Sans,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                    <h3 className="text-lg font-semibold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-slate-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50 rounded-b-xl" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg border bg-white hover:bg-slate-50 transition-colors"
                        style={{ borderColor: DashboardTheme.Colors.Neutrals.Border, color: DashboardTheme.Colors.Neutrals.TextSecondary }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                </>
            }
        >
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
