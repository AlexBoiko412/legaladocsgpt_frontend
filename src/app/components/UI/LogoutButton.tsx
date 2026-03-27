'use client'

import Cookies from "js-cookie";
import { ReactNode } from "react";
import {authApi} from "@/lib/api";

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
        await authApi.logout();

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