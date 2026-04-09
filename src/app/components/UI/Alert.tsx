import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const alertVariants = cva(
    'flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm',
    {
        variants: {
            variant: {
                error:   'bg-red-50   border-red-200   text-red-700',
                success: 'bg-green-50 border-green-200 text-green-700',
                warning: 'bg-amber-50 border-amber-200 text-amber-700',
                info:    'bg-indigo-50 border-indigo-200 text-indigo-700',
            },
        },
        defaultVariants: { variant: 'error' },
    }
);

const icons = {
    error:   AlertCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
    info:    Info,
};

interface AlertProps extends VariantProps<typeof alertVariants> {
    children: ReactNode;
    className?: string;
}

export function Alert({ children, className, variant = 'error' }: AlertProps) {
    const Icon = icons[variant ?? 'error'];
    return (
        <div className={cn(alertVariants({ variant }), className)} role="alert">
            <Icon size={16} className="mt-0.5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}
