'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import GoogleAuthButton from '@/components/ui/GoogleAuthButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';
import { useUser } from '@/context/UserContext';
import { authApi } from '@/lib/api';
import { loginSchema, LoginFormData } from '@/lib/schemas';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') ?? '/';
    const { refetchUser } = useUser();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await authApi.login(data);
            await refetchUser();
            router.push(next);
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Invalid credentials. Please try again.'
                : 'An unexpected error occurred.';
            setError('root', { message });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {errors.root && (
                <Alert variant="error">{errors.root.message}</Alert>
            )}

            <FormField label="Username" id="username" error={errors.username?.message} required>
                <Input
                    {...register('username')}
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="your_username"
                    error={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                />
            </FormField>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    error={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                    <p id="password-error" className="text-xs text-red-600" role="alert">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400 bg-white dark:bg-slate-900 px-3">
                    or
                </div>
            </div>

            <GoogleAuthButton />
        </form>
    );
}

export default function LoginPage() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            footerText="Don't have an account?"
            footerLinkLabel="Sign up for free"
            footerLinkHref="/signup"
        >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100" />}>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
