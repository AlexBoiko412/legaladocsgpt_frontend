import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => (
        <input
            ref={ref}
            className={cn(
                'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
                'placeholder:text-slate-400 outline-none transition-all',
                'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-transparent dark:border-red-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:focus:ring-indigo-400',
                className
            )}
            {...props}
        />
    )
);
Input.displayName = 'Input';
