/**
 * corp/hq/dispatch/[slug]/edit/page.tsx
 * Edit an existing DB-backed dispatch post.
 * One concern: load post by slug, render PostEditor with existing data.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDbPostBySlug } from '@/lib/dispatch/queries';
import { PostEditor } from '@/components/dispatch/post-editor';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit: ${slug} — Kodaxa HQ` };
}

export default async function EditDispatchPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getDbPostBySlug(slug);

  if (!post) notFound();

  return <PostEditor existing={post} />;
}
