"use client";

import "./Navbar.css";
import Link from "next/link";
import { User } from "lucide-react";
import {UserInfo, useUser} from "@/hooks/useUser";
import {LogoutButton} from "@/components/UI/Logout";


export default function Navbar({ initialUser }: { initialUser: UserInfo }) {
    const { user, loading } = useUser();

    return (
        <div className={"navbar"}>
            <ul className={"navbar__links"}>
                <li>
                    <Link href={"/"}>Home</Link>
                </li>
                <li>
                    <Link href={"/dashboard"}>Dashboard</Link>
                </li>
                {loading && !initialUser ? (
                    <></>
                ) : (initialUser || user) ? (
                    <li>
                        <LogoutButton>Logout</LogoutButton>
                    </li>
                ): <>
                    <li>
                        <Link href={"/login"}>Login</Link>
                    </li>
                    <li>
                        <Link href={"/signup"}>Signup</Link>
                    </li>
                </>}

            </ul>
            {loading && !initialUser ? (
                <div className={"navbar__user"}>Loading...</div>
            ) : (initialUser || user) ? (
                <div className={"navbar__user"}>
                    {(initialUser || user)?.username} <User />
                </div>
            ): null}

        </div>
    );
}