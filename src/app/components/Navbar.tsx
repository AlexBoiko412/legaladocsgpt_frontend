"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { User, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { LogoutButton } from "@/components/UI/LogoutButton";
import { Roles } from "@/lib/constants";

export default function Navbar() {
    const { user, loading } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-6 py-3">
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-primary">
                    LegaldocsGPT
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/documents" className="text-text-light hover:text-primary transition-colors">
                    Documents
                </Link>
                <Link href="/dashboard" className="text-text-light hover:text-primary transition-colors">
                    Dashboard
                </Link>
                {user?.role === Roles.ADMIN && (
                    <Link href="/admin/templates"
                          className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                          onClick={() => setIsDropdownOpen(false)}>
                        Admin
                    </Link>
                )}
                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <span>{user.username}</span>
                            <User className="h-5 w-5" />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                                <div className="border-t my-1"></div>
                                <LogoutButton
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="container flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </LogoutButton>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-text-light hover:text-primary transition-colors">
                            Login
                        </Link>
                        <Link href="/signup" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}