'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';
import { authApi } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(email.trim());
            setSubmitted(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                // Don't reveal whether the email exists
                setSubmitted(true);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you a reset link"
            footerText="Remember your password?"
            footerLinkLabel="Sign in"
            footerLinkHref="/login"
        >
            {submitted ? (
                <div className="space-y-5">
                    <Alert variant="success">
                        If an account with that email exists, you&apos;ll receive a reset link shortly.
                        Check your inbox (and spam folder).
                    </Alert>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        <ArrowLeft size={14} />
                        Back to sign in
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {error && <Alert variant="error">{error}</Alert>}

                    <FormField label="Email address" id="email" required>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </FormField>

                    <Button type="submit" loading={loading} className="w-full" size="lg">
                        {loading ? 'Sending…' : 'Send Reset Link'}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
