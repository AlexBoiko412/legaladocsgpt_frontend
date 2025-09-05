import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {

    const token = req.cookies.get("token");
    console.log(token);

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const response = await fetch("http://localhost:8080/api/auth/validate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Token validation failed: ${response.status}`);
            return NextResponse.redirect(new URL("/login", req.url));
        }


        const userInfo = await response.json();
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-info", JSON.stringify(userInfo));
        console.log(userInfo);
        return NextResponse.next({ headers: requestHeaders });
    } catch (err) {
        console.error("Middleware error:", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/documents/:path*"],
};