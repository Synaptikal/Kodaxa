/**
 * layout.tsx
 * Root layout for Kodaxa Studios.
 * One concern: HTML shell, metadata, and global CSS import.
 *
 * Next.js 16 App Router requires a root layout with <html> and <body>.
 * Source: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
 */

import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
import { BootSequence } from '@/components/ui/boot-sequence';
import { CommandConsole } from '@/components/ui/command-console';
import { DeviceProvider } from '@/components/providers/device-provider';
import { getDeviceType } from '@/lib/device';
import { SkipNav } from '@/components/ui/skip-nav';
import { Analytics } from '@vercel/analytics/next';

const CRAWLABLE_LINKS = [
  '/',
  '/planner',
  '/building',
  '/xp-timer',
  '/inventory',
  '/items',
  '/recipes',
  '/directory',
  '/dispatch',
  '/patch-notes',
  '/market',
  '/trade',
  '/makers',
  '/corporation',
];

const WEBAPP_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kodaxa Studios — Stars Reach Data & Tools',
  url: 'https://kodaxa.dev',
  description:
    'Galaxy-scale data. Skill planner, crafting calculator, crafter directory, and more for Stars Reach players.',
  applicationCategory: 'Game',
  operatingSystem: 'Web',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://kodaxa.dev/search?q={query}',
    'query-input': 'required name=query',
  },
};

export const metadata: Metadata = {
  title: {
    default: 'Kodaxa Studios — Stars Reach Data & Tools',
    template: '%s | Kodaxa Studios',
  },
  description:
    'Kodaxa Studios is a multi-planetary data science and software firm operating across the Stars Reach galaxy. Skill planner, crafting calculator, crafter directory, and more.',
  keywords: [
    'Stars Reach',
    'Kodaxa',
    'skill planner',
    'crafting calculator',
    'crafter directory',
    'MMORPG',
    'sandbox',
    'Raph Koster',
    'Playable Worlds',
    'Stars Reach tools',
  ],
  metadataBase: new URL('https://kodaxa.dev'),
  authors: [{ name: 'Kodaxa Studios' }],
  openGraph: {
    title: 'Kodaxa Studios — Stars Reach Data & Tools',
    description:
      'Galaxy-scale data. Crafter-scale precision. Skill planner, crafting calc, and more for Stars Reach.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0f19',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const deviceType = await getDeviceType();

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-sr-bg text-sr-text antialiased">
        <DeviceProvider initialDevice={deviceType}>
          <SkipNav />
          <BootSequence />
          <CommandConsole />
          <main id="main-content">
            {children}
          </main>
          {/* WebApplication JSON-LD for overall site (server-rendered for crawlers) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBAPP_LD) }}
          />

          {/* Off-screen, server-rendered crawlable links so bots see explicit <a> anchors
              Nav is a client component and won't appear in static HTML, so provide
              an accessible list of important tool pages here for indexing. */}
          <nav
            id="crawler-links"
            aria-hidden="true"
            style={{ position: 'absolute', left: -9999, top: 0, width: 1, height: 1, overflow: 'hidden' }}
          >
            {CRAWLABLE_LINKS.map((p) => (
              <a key={p} href={new URL(p, 'https://kodaxa.dev').toString()}>
                {p}
              </a>
            ))}
          </nav>

          <Analytics />
        </DeviceProvider>
      </body>
    </html>
  );
}
