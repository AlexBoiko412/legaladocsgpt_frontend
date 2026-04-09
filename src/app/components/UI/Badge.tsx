import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
    {
        variants: {
            variant: {
                success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                danger:  'bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400',
                warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                info:    'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400',
                brand:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
                default: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
    children: ReactNode;
    className?: string;
    pulse?: boolean;
}

export function Badge({ children, className, variant, pulse }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), pulse && 'animate-pulse', className)}>
            {children}
        </span>
    );
}
