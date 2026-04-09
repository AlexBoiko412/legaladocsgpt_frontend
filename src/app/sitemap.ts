import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legaldocsgpt.com';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE}/signup`,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE}/login`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE}/terms`,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE}/privacy`,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
