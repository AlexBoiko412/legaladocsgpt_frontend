'use client';

import {Suspense, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';
import { authApi } from '@/lib/api';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/schemas';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [succeeded, setSucceeded] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await authApi.resetPassword(token!, data.newPassword);
            setSucceeded(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                setError('root', {
                    message: 'This reset link is invalid or has expired.',
                });
            } else {
                setError('root', { message: 'Something went wrong. Please try again.' });
            }
        }
    };

    if (!token) {
        return (
            <AuthLayout
                title="Invalid link"
                subtitle="This reset link is missing or malformed"
                footerText="Remember your password?"
                footerLinkLabel="Sign in"
                footerLinkHref="/login"
            >
                <div className="space-y-5">
                    <Alert variant="error">
                        Invalid or missing reset link. Please request a new one.
                    </Alert>
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        <ArrowLeft size={14} />
                        Request a new reset link
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    if (succeeded) {
        return (
            <AuthLayout
                title="Password updated"
                subtitle="Your password has been changed successfully"
                footerText=""
                footerLinkLabel=""
                footerLinkHref="/login"
            >
                <div className="space-y-5">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <p className="text-sm">Password reset successfully. You can now sign in.</p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        Go to sign in →
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Choose a strong password for your account"
            footerText="Remember your password?"
            footerLinkLabel="Sign in"
            footerLinkHref="/login"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {errors.root && (
                    <div className="space-y-3">
                        <Alert variant="error">{errors.root.message}</Alert>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                            <ArrowLeft size={14} />
                            Request a new reset link
                        </Link>
                    </div>
                )}

                <FormField
                    label="New Password"
                    id="new-password"
                    error={errors.newPassword?.message}
                    hint="At least 8 characters"
                    required
                >
                    <Input
                        {...register('newPassword')}
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={!!errors.newPassword}
                    />
                </FormField>

                <FormField
                    label="Confirm New Password"
                    id="confirm-password"
                    error={errors.confirmPassword?.message}
                    required
                >
                    <Input
                        {...register('confirmPassword')}
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={!!errors.confirmPassword}
                    />
                </FormField>

                <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? 'Resetting…' : 'Reset Password'}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
