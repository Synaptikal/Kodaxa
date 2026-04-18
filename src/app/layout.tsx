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
        </DeviceProvider>
      </body>
    </html>
  );
}
