"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Scale, LogOut, LayoutDashboard, UserCircle, Menu, X, FileText, ChevronDown, Sun, Moon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { Roles } from "@/lib/constants";

export default function Navbar() {
    const { user, loading } = useUser();
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        setDropdownOpen(false);
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
                setMobileOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const navLinks = [
        { href: '/documents', label: 'Documents', icon: FileText },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Scale className="h-6 w-6 text-indigo-600" />
                        <span className="text-base font-bold text-slate-900">LegaldocsGPT</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    pathname?.startsWith(href)
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                        {user?.role === Roles.ADMIN && (
                            <Link
                                href="/admin/templates"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    pathname?.startsWith('/admin')
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-900/20'
                                }`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Desktop right: auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {mounted && (
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                aria-label="Toggle theme"
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
                            >
                                {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                        {loading ? (
                            <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                        ) : user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(v => !v)}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="max-w-32 truncate">{user.username}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-50">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                                        >
                                            <UserCircle size={16} className="text-slate-400" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                                        >
                                            <LayoutDashboard size={16} className="text-slate-400" />
                                            Dashboard
                                        </Link>
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                                        <LogoutButton className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                            <LogOut size={16} />
                                            Sign Out
                                        </LogoutButton>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Icon size={16} className="text-slate-400" />
                                {label}
                            </Link>
                        ))}
                        {user?.role === Roles.ADMIN && (
                            <Link
                                href="/admin/templates"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-900/20"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                        {user ? (
                            <div className="space-y-1">
                                <p className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">
                                    {user.username}
                                </p>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <UserCircle size={16} className="text-slate-400" />
                                    Profile
                                </Link>
                                <LogoutButton className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                    <LogOut size={16} />
                                    Sign Out
                                </LogoutButton>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-1">
                                <Link
                                    href="/login"
                                    className="text-center px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-center px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
