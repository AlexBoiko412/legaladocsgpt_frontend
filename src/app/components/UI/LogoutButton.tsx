'use client'

import Cookies from "js-cookie";
import { logout } from "@/services/auth";
import { ReactNode } from "react";

export function LogoutButton({children}: { children: ReactNode }) {

    const handleLogout = async () => {
        await logout();

        Cookies.remove("username");
        Cookies.remove("email");
        Cookies.remove("role");

        window.location.reload();
    };

    return (
        <button className={"text-amber-50 cursor-pointer"} onClick={handleLogout}>
            {children}
        </button>
    );
}