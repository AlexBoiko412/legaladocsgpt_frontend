'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useUser} from "@/hooks/useUser";

export default function OAuth2Success() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
        }
    }, [loading, user, router]);

    return <div>Processing login...</div>;
}
