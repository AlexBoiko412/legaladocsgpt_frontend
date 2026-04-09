import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    id: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, id, error, hint, required, children, className }: FormFieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-700"
            >
                {label}
                {required && (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
                )}
            </label>
            {children}
            {hint && !error && (
                <p className="text-xs text-slate-500">{hint}</p>
            )}
            {error && (
                <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
