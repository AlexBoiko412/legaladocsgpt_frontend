'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { authApi } from '@/lib/api';
import { User, Mail, Shield, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Roles } from '@/lib/constants';

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
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("email");
        Cookies.remove("role");
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8 max-w-2xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-48" />
                    <div className="h-32 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p className="text-slate-500">Please log in to view your profile.</p>
            </div>
        );
    }

    const isGoogleUser = user.provider === 'GOOGLE';

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">Account Details</h2>

                <div className="flex items-center gap-3 py-3 border-b">
                    <User size={18} className="text-slate-400 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400">Username</p>
                        <p className="text-slate-800 font-medium">{user.username}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b">
                    <Mail size={18} className="text-slate-400 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-slate-800 font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b">
                    <Shield size={18} className="text-slate-400 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400">Role</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            user.role === Roles.ADMIN
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}>
                            {user.role === Roles.ADMIN ? 'Admin' : 'User'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                    <div className="w-4 h-4 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400">Sign-in method</p>
                        <p className="text-slate-800 font-medium">
                            {isGoogleUser ? 'Google' : 'Email & Password'}
                        </p>
                    </div>
                </div>
            </div>

            {!isGoogleUser ? (
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock size={18} /> Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {pwError && <p className="text-red-600 text-sm">{pwError}</p>}
                        {pwSuccess && <p className="text-green-600 text-sm">Password changed successfully.</p>}

                        <button
                            type="submit"
                            disabled={pwSaving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition"
                        >
                            {pwSaving ? 'Saving...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-sm text-slate-500">
                    Your account is linked to Google. Password management is handled by Google.
                </div>
            )}

            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Session</h2>
                <p className="text-sm text-slate-500 mb-4">
                    Sign out from all devices by logging out.
                </p>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </div>
    );
}
