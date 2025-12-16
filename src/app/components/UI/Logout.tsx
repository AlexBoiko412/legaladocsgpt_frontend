'use client'

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logout } from "@/services/auth";

export function LogoutButton({children}: { children: string }) {
    const router = useRouter();

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