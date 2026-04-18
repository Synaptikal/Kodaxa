/**
 * corp/hq/dispatch/new/page.tsx
 * New transmission editor.
 * One concern: render PostEditor with no existing post.
 */

import type { Metadata } from 'next';
import { PostEditor } from '@/components/dispatch/post-editor';

export const metadata: Metadata = { title: 'New Transmission — Kodaxa HQ' };

export default function NewDispatchPage() {
  return <PostEditor />;
}
