'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { PageSpinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Roles } from '@/lib/constants';
import { FileText, Plus, User, Mail, Shield, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const { user, loading } = useUser();

    if (loading) return <PageSpinner label="Loading…" />;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="text-slate-500">Please sign in to view your dashboard.</p>
                <Link href="/login" className={buttonVariants({ variant: 'primary' })}>
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back, {user.username}
                </h1>
                <p className="mt-1 text-slate-500">Here&apos;s a quick overview of your account.</p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/documents/generate"
                    className="group flex items-center gap-4 p-5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-600 text-white shrink-0">
                        <Plus size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-indigo-900">New Document</p>
                        <p className="text-sm text-indigo-600">Generate a legal draft with AI</p>
                    </div>
                    <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                    href="/documents"
                    className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">My Documents</p>
                        <p className="text-sm text-slate-500">View and manage your drafts</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Account info */}
            <Card>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h2>
                <div className="divide-y divide-slate-100">
                    <div className="flex items-center gap-3 py-3">
                        <User size={16} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500 w-24">Username</span>
                        <span className="text-sm font-medium text-slate-800">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                        <Mail size={16} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500 w-24">Email</span>
                        <span className="text-sm font-medium text-slate-800">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                        <Shield size={16} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500 w-24">Role</span>
                        <Badge variant={user.role === Roles.ADMIN ? 'warning' : 'brand'}>
                            {user.role === Roles.ADMIN ? 'Admin' : 'User'}
                        </Badge>
                    </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                        href="/profile"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        Manage account settings →
                    </Link>
                </div>
            </Card>
        </div>
    );
}
