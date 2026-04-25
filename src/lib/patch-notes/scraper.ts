/**
 * scraper.ts
 * Fetches Stars Reach patch notes via the WordPress REST API.
 * One concern: WP API fetch + HTML content parsing into structured bullet points.
 *
 * Stars Reach runs WordPress at starsreach.com.
 * WP REST API returns JSON — no HTML parser dependency needed.
 * Content bullets are extracted from <li> elements via regex.
 */

const WP_API = 'https://starsreach.com/wp-json/wp/v2/posts';
const UA = 'Kodaxa Studios patch-notes importer (kodaxa.dev)';

export interface ScrapedPost {
  sourceUrl: string;
  sourceSlug: string;
  title: string;
  versionLabel: string | null;
  category: 'major' | 'minor' | 'hotfix' | 'balance' | 'alpha';
  releaseDate: string | null;
  summary: string;
  bulletPoints: Array<{ type: 'added' | 'changed' | 'fixed' | 'removed'; text: string }>;
  rawContent: string;
  importHash: string;
}

interface WpPost {
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

export async function fetchLatestPosts(count = 10): Promise<ScrapedPost[]> {
  const url =
    `${WP_API}?per_page=${count}&orderby=date&order=desc` +
    `&_fields=slug,link,date,title,excerpt,content`;

  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`WP API error ${res.status}`);

  const posts: WpPost[] = await res.json();
  return posts.map(parsePost);
}

function parsePost(post: WpPost): ScrapedPost {
  const title = decodeHtml(post.title.rendered);
  const raw = post.content.rendered;
  const summary = decodeHtml(post.excerpt.rendered)
    .replace(/\[…\]/g, '')
    .replace(/\[\s*\.\.\.\s*\]/g, '')
    .trim();

  return {
    sourceUrl: post.link,
    sourceSlug: post.slug,
    title,
    versionLabel: extractVersion(title),
    category: detectCategory(title),
    releaseDate: post.date ? post.date.split('T')[0] : null,
    summary,
    bulletPoints: extractBullets(raw),
    rawContent: raw,
    importHash: crc32hex(title + raw),
  };
}

function extractBullets(html: string): ScrapedPost['bulletPoints'] {
  const bullets: ScrapedPost['bulletPoints'] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[1]).replace(/\s+/g, ' ').trim();
    if (text.length > 4) bullets.push({ type: classifyBullet(text), text });
  }
  return bullets;
}

function classifyBullet(text: string): ScrapedPost['bulletPoints'][number]['type'] {
  const t = text.toLowerCase();
  if (/^(add|new |introduc|implement)/.test(t)) return 'added';
  if (/^(fix|resolv|patch|correct|address)/.test(t)) return 'fixed';
  if (/^(remov|delet|eliminat|disabl)/.test(t)) return 'removed';
  return 'changed';
}

function extractVersion(title: string): string | null {
  const m = title.match(/(\d+\.\d+(?:\.\d+)?)/);
  return m ? m[1] : null;
}

function detectCategory(title: string): ScrapedPost['category'] {
  const t = title.toLowerCase();
  if (t.includes('hotfix')) return 'hotfix';
  if (t.includes('alpha')) return 'alpha';
  if (t.includes('balance')) return 'balance';
  if (t.includes('update') || t.includes('major')) return 'major';
  return 'minor';
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').trim();
}

function decodeHtml(html: string): string {
  return stripTags(html)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function crc32hex(str: string): string {
  let crc = 0xffffffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}
