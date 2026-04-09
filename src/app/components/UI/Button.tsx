'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:     'bg-indigo-600 text-white hover:bg-indigo-700',
                secondary:   'bg-slate-100 text-slate-700 hover:bg-slate-200',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
                outline:     'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                ghost:       'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                link:        'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto rounded-none',
            },
            size: {
                sm:   'h-8 px-3 text-xs',
                md:   'h-10 px-4 text-sm',
                lg:   'h-11 px-6 text-base',
                icon: 'h-9 w-9 p-0',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </button>
    )
);
Button.displayName = 'Button';
