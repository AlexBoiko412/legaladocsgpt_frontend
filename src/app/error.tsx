'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Unhandled route error:', error);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">Something went wrong</h1>
            <p className="text-slate-500 max-w-sm mb-2">
                An unexpected error occurred. Our team has been notified.
            </p>
            {error.digest && (
                <p className="text-xs text-slate-400 font-mono mb-8">Error ID: {error.digest}</p>
            )}
            {!error.digest && <div className="mb-8" />}

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <RotateCcw size={15} />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
