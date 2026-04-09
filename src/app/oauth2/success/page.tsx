'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Scale } from 'lucide-react';
import { PageSpinner } from '@/components/ui/Spinner';

export default function OAuth2Success() {
    const { user, loading, refetchUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        refetchUser();
    }, []);

    useEffect(() => {
        if (!loading) {
            router.replace(user ? '/dashboard' : '/login');
        }
    }, [loading, user, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
            <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">LegaldocsGPT</span>
            </div>
            <PageSpinner label="Completing sign-in…" />
        </div>
    );
}
