import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
};

export function Card({ children, className, padding = 'md' }: CardProps) {
    return (
        <div className={cn(
            'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm',
            paddingMap[padding],
            className
        )}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('mb-5 pb-4 border-b border-slate-100 dark:border-slate-700', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)}>
            {children}
        </h2>
    );
}
