import type { MetadataRoute } from 'next';
import { getAllPostsMerged } from '@/data/dispatch/merged';

const BASE = 'https://kodaxa.dev';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                          changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/dashboard`,           changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/inventory`,           changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/trade`,               changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/corporation`,         changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/planner`,             changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/building`,            changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/xp-timer`,            changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/items`,               changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/recipes`,             changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/directory`,           changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/crafting`,            changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/dispatch`,            changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/patch-notes`,         changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/corp/join`,           changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/corp/hq/supply`,      changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/corp/hq/skills`,      changeFrequency: 'weekly',  priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsMerged();

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/dispatch/${post.slug}`,
    lastModified: post.updated_at ?? post.published_at,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...postRoutes];
}
