import Link from 'next/link';
import { Scale, ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
            <Link href="/" className="flex items-center gap-2 mb-12 text-slate-400 hover:text-slate-600 transition-colors">
                <Scale className="h-5 w-5 text-indigo-600" />
                <span className="font-bold text-slate-700">LegaldocsGPT</span>
            </Link>

            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 mb-6">
                <FileX className="h-10 w-10 text-slate-400" />
            </div>

            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">404</p>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
            <p className="text-slate-500 max-w-sm mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Back to Home
                </Link>
                <Link
                    href="/documents"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                    My Documents
                </Link>
            </div>
        </div>
    );
}
