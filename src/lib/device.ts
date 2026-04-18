/**
 * device.ts
 * Server-side device type detection via User-Agent header.
 * One concern: parse UA string → return device category.
 *
 * Uses Next.js built-in `userAgent` helper (next/server).
 * Call only from Server Components or middleware — never from client bundles.
 */

import { userAgent } from 'next/server';
import { headers } from 'next/headers';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Reads the incoming UA header and returns the device category.
 * Falls back to 'desktop' when headers are unavailable (static generation).
 */
export async function getDeviceType(): Promise<DeviceType> {
  const headersList = await headers();
  const ua = headersList.get('user-agent') ?? '';

  if (!ua) return 'desktop';

  const { device } = userAgent({ headers: new Headers({ 'user-agent': ua }) });

  if (device.type === 'mobile') return 'mobile';
  if (device.type === 'tablet') return 'tablet';
  return 'desktop';
}
