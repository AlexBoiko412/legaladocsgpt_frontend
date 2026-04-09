'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
            <div className="mx-auto max-w-3xl bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-sm text-slate-300 flex-1 leading-relaxed">
                    We use a strictly necessary session cookie to keep you signed in. No advertising or
                    tracking cookies.{' '}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                        Privacy Policy
                    </Link>
                </p>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={decline}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        onClick={accept}
                        aria-label="Dismiss cookie banner"
                        className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors ml-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
