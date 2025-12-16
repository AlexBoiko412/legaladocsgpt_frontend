'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export interface UserInfo {
    username: string;
    email: string;
    role: string;
}

export function useUser() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function fetchUser() {
            try {
                const res = await axios.get<UserInfo>("http://localhost:8080/api/auth/me", {
                    withCredentials: true
                });
                setUser(res.data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading, error };
}