import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
                'placeholder:text-slate-400 outline-none transition-all resize-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                    : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                className
            )}
            {...props}
        />
    )
);
Textarea.displayName = 'Textarea';
