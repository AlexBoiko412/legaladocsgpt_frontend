'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserInfo {
    username: string;
    email: string;
    role: string;
}

export function useUser() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get<UserInfo>("http://localhost:8080/api/auth/me", {
                    withCredentials: true,
                });

                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading };
}
