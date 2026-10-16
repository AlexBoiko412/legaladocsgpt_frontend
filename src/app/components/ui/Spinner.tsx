import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: number;
    className?: string;
    label?: string;
}

export function Spinner({ size = 24, className, label = 'Loading...' }: SpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3" aria-label={label}>
            <Loader2
                size={size}
                className={cn('animate-spin text-indigo-600', className)}
            />
        </div>
    );
}

export function PageSpinner({ label }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            {label && <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>}
        </div>
    );
}
