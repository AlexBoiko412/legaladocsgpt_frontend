'use client';

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import GoogleAuthButton from "@/components/UI/GoogleAuthButton";

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {
            const response = await axios.post("http://localhost:8080/api/auth/signup", {
                username,
                password
            })
            console.log(response);
            console.log('Signup:', {username, password});
            router.push('/');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Signup failed. Please try again.';
                console.error('Axios Error:', message);
            } else {
                console.error('Error:', error);
            }
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className={"w-full flex flex-col gap-4"}>
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Sign Up
                    </button>
                    <GoogleAuthButton/>
                </div>

            </form>
        </div>
    );
}