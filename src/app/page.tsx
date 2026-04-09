import Link from 'next/link';
import {
    Scale,
    Zap,
    Shield,
    FileEdit,
    History,
    Users,
    ArrowRight,
    FileText,
    Sparkles,
} from 'lucide-react';

const FEATURES = [
    {
        icon: FileText,
        color: 'text-indigo-600 bg-indigo-50',
        title: 'Professional Templates',
        desc: 'Every document is built on legally structured templates crafted by experts - not generated from scratch.',
    },
    {
        icon: Zap,
        color: 'text-amber-600 bg-amber-50',
        title: 'Generate in Minutes',
        desc: 'Fill in a short form and let the AI produce a complete, professional draft ready for review.',
    },
    {
        icon: Shield,
        color: 'text-green-600 bg-green-50',
        title: 'Legally Structured',
        desc: 'AI stays within the bounds of the template, ensuring the output meets legal document standards.',
    },
    {
        icon: FileEdit,
        color: 'text-blue-600 bg-blue-50',
        title: 'Built-in Editor',
        desc: 'Review and refine your document in the integrated word processor before exporting.',
    },
    {
        icon: History,
        color: 'text-purple-600 bg-purple-50',
        title: 'Version History',
        desc: 'Every AI refinement and manual edit is versioned so you can always roll back to an earlier draft.',
    },
    {
        icon: Users,
        color: 'text-rose-600 bg-rose-50',
        title: 'White-label Ready',
        desc: 'Built for legal professionals, notaries, and HR teams who need a branded document service.',
    },
];

const STEPS = [
    {
        num: '01',
        title: 'Choose a template',
        desc: 'Select from a growing library of professionally prepared legal document templates.',
    },
    {
        num: '02',
        title: 'Provide the details',
        desc: 'Fill in the short form - names, dates, and any specifics relevant to your document.',
    },
    {
        num: '03',
        title: 'Review and export',
        desc: 'The AI generates a full draft instantly. Edit, refine with AI, then export to PDF or Word.',
    },
];

export default function HomePage() {
    return (
        <div className="text-slate-900">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className="relative mx-auto max-w-4xl px-6 py-28 lg:py-36 text-center">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/25 mb-8">
                        <Sparkles size={12} />
                        AI-Powered Legal Platform
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                        Draft legal documents<br />
                        <span className="text-indigo-400">in minutes, not hours</span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Generate professionally structured agreements, contracts, and notices - with AI that works
                        within expert-crafted legal templates.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
                        >
                            Get Started Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/documents/generate"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                        >
                            <Scale size={16} />
                            Try a Document
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Everything you need to work faster
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
                            From generation to export, every step is handled in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                            <div
                                key={title}
                                className="group rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md hover:border-slate-300 transition-all"
                            >
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-4`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
                        <p className="mt-4 text-lg text-slate-500">Three steps from start to signed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STEPS.map(({ num, title, desc }) => (
                            <div key={num} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg mb-5">
                                    {num}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-24 bg-indigo-600">
                <div className="mx-auto max-w-2xl px-6 text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold">Start drafting smarter</h2>
                    <p className="mt-4 text-indigo-200 text-lg">
                        Join legal professionals who save hours every week with AI-assisted document generation.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            Get Started Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-indigo-400 text-white font-semibold hover:bg-indigo-500 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                    <p className="mt-5 text-indigo-300 text-sm">No credit card required.</p>
                </div>
            </section>
        </div>
    );
}
