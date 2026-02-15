import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    console.log(token)
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const response = await fetch("http://localhost:8080/api/auth/validate", {
            credentials: "include",
            headers: {
                "Cookie": `token=${token}`
            }
        })
        if (!response.ok) {
            console.log("Validation failed with status:", response.status);
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();

    } catch (e: any) {
        console.error("Network error or server unreachable", e);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/documents/:path*"],
};
