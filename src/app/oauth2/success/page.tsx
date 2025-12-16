'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useUser} from "@/hooks/useUser";
import Cookies from "js-cookie";

export default function OAuth2Success() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                Cookies.set("username", user.username, { path: "/", expires: 3600 });
                Cookies.set("email", user.email, { path: "/", expires: 3600 });
                Cookies.set("role", user.role, { path: "/", expires: 3600 });

                router.replace('/dashboard');
            } else {
                Cookies.remove("username");
                Cookies.remove("email");

                router.replace('/login');
            }
        }
    }, [loading, user, router]);

    return <div>Processing login...</div>;
}
