// Single place that turns content collections into the SitePage shape the
// Markdown endpoints, /llms.txt and /llms-full.txt all share, so the three
// stay in step.

import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { LlmsSection, SitePage } from './agent-docs';

export function entrySlug(id: string): string {
  return id.replace(/\.md$/, '');
}

function bodyOf(entry: { body?: string }): string {
  return entry.body ?? '';
}

export async function getBlogPages(): Promise<SitePage[]> {
  const posts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);
  return posts
    .sort(
      (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
        b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    )
    .map((post: CollectionEntry<'blog'>) => {
      const slug = entrySlug(post.id);
      return {
        title: post.data.title,
        description: post.data.description,
        path: `/blog/${slug}/`,
        markdownPath: `/blog/${slug}.md`,
        body: bodyOf(post),
        date: post.data.pubDate,
        updated: post.data.updatedDate,
        tags: post.data.tags,
      };
    });
}

export async function getWorkPages(): Promise<SitePage[]> {
  const entries = await getCollection('work', ({ data }: CollectionEntry<'work'>) => !data.draft);
  return entries
    .sort((a: CollectionEntry<'work'>, b: CollectionEntry<'work'>) => a.data.order - b.data.order)
    .map((entry: CollectionEntry<'work'>) => {
      const slug = entrySlug(entry.id);
      return {
        title: entry.data.title,
        description: entry.data.subtitle ?? entry.data.headline,
        path: `/work/${slug}/`,
        markdownPath: `/work/${slug}.md`,
        body: bodyOf(entry),
        tags: entry.data.tech,
      };
    });
}

export async function getCvPage(): Promise<SitePage | null> {
  const entry = await getEntry('cv', 'main');
  if (!entry) return null;
  return {
    title: 'Pete Watters — CV',
    description: entry.data.description,
    path: '/cv/',
    markdownPath: '/cv.md',
    body: bodyOf(entry),
  };
}

/** Section order used by both /llms.txt and /llms-full.txt. */
export async function getLlmsSections(): Promise<LlmsSection[]> {
  const [cv, work, blog] = await Promise.all([getCvPage(), getWorkPages(), getBlogPages()]);
  return [
    { heading: 'Profile', pages: cv ? [cv] : [] },
    { heading: 'Case studies', pages: work },
    { heading: 'Writing', pages: blog },
  ];
}
