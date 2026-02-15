'use client'

import Cookies from "js-cookie";
import { logout } from "@/services/auth";
import { ReactNode } from "react";

interface ILogoutButtonProps {
    children: ReactNode,
    onClick: () => void,
    className: string
}

export function LogoutButton(
    {
        children,
        onClick,
        className
    }: ILogoutButtonProps) {

    const handleLogout = async () => {
        await logout();

        Cookies.remove("username");
        Cookies.remove("email");
        Cookies.remove("role");

        window.location.reload();
    };

    return (
        <button
            className={className}
            onClick={() => {
                onClick();
                handleLogout()
            }}
        >
            {children}

        </button>
    );
}