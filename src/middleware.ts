import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token");
    console.log("Middleware: ", token)

    if (!token?.value) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const response = await fetch("http://localhost:8080/api/auth/validate", {
            method: "GET",
            headers: {
                "Cookie": `token=${token.value}`,
            },
        });
        if (!response.ok) {
            console.error(`Token validation failed: ${response.status}`);
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const userInfo = await response.json();

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-info", JSON.stringify(userInfo));

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
        console.error("Middleware error:", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/documents/:path*"],
};
