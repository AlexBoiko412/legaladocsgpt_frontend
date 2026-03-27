'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import GoogleAuthButton from "@/components/UI/GoogleAuthButton";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import {authApi} from "@/lib/api";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { refetchUser } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authApi.login({
                username,
                password
            });

            console.log('Login successful for:', username);
            await refetchUser();
            router.push('/');

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Login failed. Please try again.';
                setError(message);
                console.error('Axios Error:', message);
            } else {
                setError('An unexpected error occurred.');
                console.error('Error:', error);
            }
        }
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (error) {
            setError('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>


                <div className={"w-full flex flex-col gap-4"}>
                    <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Login
                    </button>
                    <GoogleAuthButton/>
                </div>

                <div className={"text-center cursor-pointer mt-4 text-primary hover:underline"}>
                    <Link href={"/signup"}>Signup</Link>
                </div>
            </form>
        </div>
    );
}