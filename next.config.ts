import type { NextConfig } from "next";

const onlyOfficeOrigin = (process.env.NEXT_PUBLIC_ONLYOFFICE_URL ?? 'http://localhost:8089').replace(/\/$/, '');
const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

// Note: script-src includes 'unsafe-inline' and 'unsafe-eval' because Next.js App Router
// requires them without a nonce setup. The remaining directives (connect-src, frame-src,
// object-src, base-uri, form-action) still provide meaningful protection.
const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${onlyOfficeOrigin}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${onlyOfficeOrigin}`,
    `frame-src 'self' ${onlyOfficeOrigin}`,
    `connect-src 'self' ${apiOrigin} ${onlyOfficeOrigin}`,
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ');

const securityHeaders = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
    images: {},
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
