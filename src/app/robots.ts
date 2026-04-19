import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/corp/hq/admin/'],
    },
    sitemap: 'https://kodaxa.dev/sitemap.xml',
  };
}
