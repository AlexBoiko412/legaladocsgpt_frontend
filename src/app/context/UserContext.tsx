'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import {authApi} from "@/lib/api";

export interface UserInfo {
    username: string;
    email: string;
    role: string;
}

interface UserContextType {
    user: UserInfo | null;
    loading: boolean;
    error: string | null;
    refetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await authApi.me()
            setUser(res.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message|| "Failed to fetch user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refetchUser = () => {
        fetchUser();
    };

    return (
        <UserContext.Provider value={{ user, loading, error, refetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}