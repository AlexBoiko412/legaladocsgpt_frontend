import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/login', '/signup', '/terms', '/privacy'],
                disallow: [
                    '/dashboard',
                    '/documents',
                    '/profile',
                    '/admin',
                    '/api',
                    '/oauth2',
                ],
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legaldocsgpt.com'}/sitemap.xml`,
    };
}
