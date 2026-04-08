'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import GoogleAuthButton from '@/components/UI/GoogleAuthButton';
import { useUser } from '@/context/UserContext';
import { authApi } from '@/lib/api';
import { signupSchema, SignupFormData } from '@/lib/schemas';

export default function Signup() {
    const router = useRouter();
    const { refetchUser } = useUser();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

    const onSubmit = async (data: SignupFormData) => {
        try {
            await authApi.signup(data);
            await refetchUser();
            router.push('/');
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Signup failed. Please try again.'
                : 'An unexpected error occurred.';
            setError('root', { message });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

                {errors.root && (
                    <p className="text-red-500 text-sm text-center mb-4">{errors.root.message}</p>
                )}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                    <input
                        {...register('username')}
                        type="text"
                        id="username"
                        className="w-full px-3 py-2 border rounded"
                        aria-describedby={errors.username ? 'username-error' : undefined}
                    />
                    {errors.username && (
                        <p id="username-error" className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border rounded"
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                        {...register('password')}
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border rounded"
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password && (
                        <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="w-full flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating account...' : 'Signup'}
                    </button>
                    <GoogleAuthButton />
                </div>

                <div className="text-center mt-4 text-primary hover:underline">
                    <Link href="/login">Login</Link>
                </div>
            </form>
        </div>
    );
}
