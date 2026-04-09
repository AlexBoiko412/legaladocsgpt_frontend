import { ReactNode } from 'react';
import { Scale, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    'Legally structured document templates',
    'AI-assisted generation in minutes',
    'Built-in editor with version history',
    'Export to PDF or Word',
];

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkLabel: string;
    footerLinkHref: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    footerText,
    footerLinkLabel,
    footerLinkHref,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-12 text-white">
                <Link href="/" className="flex items-center gap-2.5">
                    <Scale className="h-7 w-7 text-indigo-300" />
                    <span className="text-xl font-bold tracking-tight">LegaldocsGPT</span>
                </Link>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight">
                            Draft legal documents<br />in minutes, not hours
                        </h1>
                        <p className="text-indigo-200 text-lg leading-relaxed">
                            AI-powered generation built on professional legal templates - accurate, fast, and secure.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        {FEATURES.map(item => (
                            <li key={item} className="flex items-center gap-3 text-indigo-100">
                                <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-indigo-400 text-sm">
                    Trusted by legal professionals and businesses.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 px-6 py-12 sm:px-12">
                <div className="w-full max-w-sm space-y-8">

                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        <Scale className="h-6 w-6 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">LegaldocsGPT</span>
                    </Link>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                    </div>

                    {children}

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        {footerText}{' '}
                        <Link href={footerLinkHref} className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {footerLinkLabel}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
