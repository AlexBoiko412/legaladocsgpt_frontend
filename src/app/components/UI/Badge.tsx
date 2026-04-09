import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
    {
        variants: {
            variant: {
                success: 'bg-green-100 text-green-700',
                danger:  'bg-red-100   text-red-700',
                warning: 'bg-amber-100 text-amber-700',
                info:    'bg-blue-100  text-blue-700',
                brand:   'bg-indigo-100 text-indigo-700',
                default: 'bg-slate-100 text-slate-600',
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
