import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles } from "@/lib/constants";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('next', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/validate`, {
            headers: {
                "Cookie": `token=${token}`
            }
        });

        if (!response.ok) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('next', req.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {
            const user = await response.json();
            if (user.role !== Roles.ADMIN) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        return NextResponse.next();

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error("Auth validation failed — network error or server unreachable:", message);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/documents/:path*", "/admin/:path*"],
};
