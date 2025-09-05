'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function OAuth2Success() {
    const router = useRouter();

    useEffect(() => {
    }, [router]);

    return <div>Processing login...</div>;
}