'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import AuthLayout from '@/components/layout/AuthLayout';
import GoogleAuthButton from '@/components/ui/GoogleAuthButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';
import { useUser } from '@/context/UserContext';
import { authApi } from '@/lib/api';
import { signupSchema, SignupFormData } from '@/lib/schemas';

export default function SignupPage() {
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
        <AuthLayout
            title="Create your account"
            subtitle="Start drafting legal documents in minutes"
            footerText="Already have an account?"
            footerLinkLabel="Sign in"
            footerLinkHref="/login"
        >
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

                <FormField label="Email" id="email" error={errors.email?.message} required>
                    <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        error={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                </FormField>

                <FormField
                    label="Password"
                    id="password"
                    error={errors.password?.message}
                    hint="At least 8 characters"
                    required
                >
                    <Input
                        {...register('password')}
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                    />
                </FormField>

                <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? 'Creating account…' : 'Create Account'}
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
        </AuthLayout>
    );
}
