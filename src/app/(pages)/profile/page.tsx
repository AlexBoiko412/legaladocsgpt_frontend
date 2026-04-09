'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { authApi } from '@/lib/api';
import { User, Mail, Shield, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Roles } from '@/lib/constants';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { PageSpinner } from '@/components/ui/Spinner';

export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(false);

        if (newPassword !== confirmPassword) {
            setPwError('New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setPwError('Password must be at least 8 characters');
            return;
        }

        setPwSaving(true);
        try {
            await authApi.changePassword(currentPassword, newPassword);
            setPwSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setPwError(err.response?.data?.message || 'Failed to change password');
            } else {
                setPwError('Failed to change password');
            }
        } finally {
            setPwSaving(false);
        }
    };

    const handleLogout = async () => {
        await authApi.logout();
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('email');
        Cookies.remove('role');
        router.push('/login');
    };

    if (loading) return <PageSpinner label="Loading profile…" />;

    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p className="text-slate-500">Please log in to view your profile.</p>
            </div>
        );
    }

    const isGoogleUser = user.provider === 'GOOGLE';

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

            {/* Account details */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>

                <div className="divide-y divide-slate-100">
                    <div className="flex items-center gap-3 py-3">
                        <User size={16} className="text-slate-400 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400">Username</p>
                            <p className="text-slate-800 font-medium">{user.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                        <Mail size={16} className="text-slate-400 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400">Email</p>
                            <p className="text-slate-800 font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                        <Shield size={16} className="text-slate-400 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Role</p>
                            <Badge variant={user.role === Roles.ADMIN ? 'warning' : 'brand'}>
                                {user.role === Roles.ADMIN ? 'Admin' : 'User'}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                        <div className="w-4 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400">Sign-in method</p>
                            <p className="text-slate-800 font-medium">
                                {isGoogleUser ? 'Google' : 'Email & Password'}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Change password */}
            {!isGoogleUser ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <span className="flex items-center gap-2">
                                <Lock size={16} /> Change Password
                            </span>
                        </CardTitle>
                    </CardHeader>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {pwError && <Alert variant="error">{pwError}</Alert>}
                        {pwSuccess && <Alert variant="success">Password changed successfully.</Alert>}

                        <FormField label="Current Password" id="current-password">
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </FormField>
                        <FormField label="New Password" id="new-password">
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                        </FormField>
                        <FormField label="Confirm New Password" id="confirm-password">
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </FormField>

                        <Button type="submit" loading={pwSaving} className="w-full">
                            {pwSaving ? 'Saving…' : 'Update Password'}
                        </Button>
                    </form>
                </Card>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Your account is linked to Google. Password management is handled by Google.
                </div>
            )}

            {/* Session */}
            <Card>
                <CardHeader>
                    <CardTitle>Session</CardTitle>
                </CardHeader>
                <p className="text-sm text-slate-500 mb-4">Sign out from all devices by logging out.</p>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                >
                    <LogOut size={15} />
                    Sign Out
                </Button>
            </Card>
        </div>
    );
}
