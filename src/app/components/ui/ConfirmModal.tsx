'use client';

import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    variant?: 'destructive' | 'primary';
}

export function ConfirmModal({
    title,
    description,
    confirmLabel = 'Confirm',
    onConfirm,
    onCancel,
    loading,
    variant = 'destructive',
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full shadow-2xl p-6 border border-transparent dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{description}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
