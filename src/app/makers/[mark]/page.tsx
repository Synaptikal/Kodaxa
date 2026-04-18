/**
 * makers/[mark]/page.tsx
 * Single Maker's Mark — brand-level portfolio view for one crafter.
 * One concern: fetch the maker by slug and render header + portfolio grid.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { getMakerByMark } from '@/lib/makers/queries';
import type { MakerPortfolioItem } from '@/types/makers';
import { COMMISSION_COLORS, COMMISSION_LABELS } from '@/types/directory';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ mark: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { mark } = await params;
  const slug = decodeURIComponent(mark);
  const maker = await getMakerByMark(slug);
  if (!maker) return { title: "Maker's Mark — Kodaxa Studios" };

  return {
    title: `${maker.maker_mark} — ${maker.display_name}`,
    description:
      maker.bio ??
      `Portfolio of ${maker.display_name} (${maker.maker_mark}) — Stars Reach crafter.`,
  };
}

export default async function MakerDetailPage({ params }: PageProps) {
  const { mark } = await params;
  const slug = decodeURIComponent(mark);
  const maker = await getMakerByMark(slug);

  if (!maker) notFound();

  const featured = maker.portfolio.filter((i) => i.is_featured);
  const others   = maker.portfolio.filter((i) => !i.is_featured);

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Hero header */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/makers" className="hover:text-amber-400 transition-colors">
              Maker&apos;s Mark Registry
            </Link>
            <span>/</span>
            <span className="text-slate-400">{maker.maker_mark}</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500">
                {maker.maker_mark}
              </p>
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                {maker.display_name}
                {maker.is_kodaxa_member && (
                  <span className="ml-3 text-xs font-mono text-amber-400 bg-amber-900/40 border border-amber-700/50 px-1.5 py-0.5 rounded align-middle">
                    KODAXA
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                @{maker.in_game_name}
                {maker.home_planet && <> · {maker.home_planet}</>}
                {maker.home_sector && <> · {maker.home_sector}</>}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={`text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${COMMISSION_COLORS[maker.commission_status]}`}
              >
                {COMMISSION_LABELS[maker.commission_status]}
              </span>
              {maker.total_reviews > 0 && (
                <span className="text-xs font-mono text-amber-400">
                  ★ {maker.average_rating.toFixed(1)}{' '}
                  <span className="text-sr-muted">({maker.total_reviews})</span>
                </span>
              )}
            </div>
          </div>

          {maker.bio && (
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {maker.bio}
            </p>
          )}

          {maker.contact_method && (
            <p className="text-xs text-slate-500">
              <span className="text-sr-muted font-mono uppercase tracking-wider">Contact:</span>{' '}
              <span className="text-slate-300 font-mono">{maker.contact_method}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/directory/${encodeURIComponent(maker.in_game_name)}`}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              Full profile & reviews →
            </Link>
          </div>
        </div>
      </header>

      {/* Portfolio */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {maker.portfolio.length === 0 ? (
          <EmptyPortfolio />
        ) : (
          <>
            {featured.length > 0 && (
              <PortfolioSection title="Featured Works" items={featured} featured />
            )}
            {others.length > 0 && (
              <PortfolioSection title="Additional Portfolio" items={others} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────

function PortfolioSection({
  title,
  items,
  featured = false,
}: {
  title: string;
  items: MakerPortfolioItem[];
  featured?: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2
        className={`text-xs font-mono uppercase tracking-[0.2em] ${
          featured ? 'text-amber-400' : 'text-slate-400'
        }`}
      >
        {title} <span className="text-sr-muted">· {items.length}</span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <PortfolioItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function PortfolioItemCard({ item }: { item: MakerPortfolioItem }) {
  return (
    <article className="border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-amber-800/50 transition-colors">
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-40 object-cover bg-slate-900"
          loading="lazy"
        />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
          {item.is_featured && (
            <span className="text-xs font-mono text-amber-400 bg-amber-900/40 border border-amber-700/50 px-1 py-0.5 rounded shrink-0">
              ★ FEATURED
            </span>
          )}
        </div>
        {item.item_type && (
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
            {item.item_type}
          </p>
        )}
        {item.description && (
          <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
        )}
        {item.commission_hint && (
          <p className="text-xs text-amber-400 font-mono pt-1 border-t border-slate-800/60">
            {item.commission_hint}
          </p>
        )}
      </div>
    </article>
  );
}

function EmptyPortfolio() {
  return (
    <div className="border border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
      <p className="text-sm text-slate-300 font-medium">Portfolio empty</p>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        This maker has registered their mark but hasn&apos;t posted any
        signature works yet. Reach out via their profile to discuss
        custom commissions.
      </p>
    </div>
  );
}
