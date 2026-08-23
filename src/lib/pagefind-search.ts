// Browser-side bridge from the WebMCP search_site tool to the Pagefind index
// the production build already generates. Pagefind ships no type declarations,
// so every field is narrowed with a guard rather than cast.

import { cleanExcerpt } from './mcp-tools';
import type { SearchBackend, SiteSearchHit } from './mcp-tools';

interface PagefindResultData {
  url: string;
  excerpt: string;
  title: string;
}

interface PagefindResultHandle {
  data: () => Promise<unknown>;
}

interface PagefindModule {
  search: (query: string) => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPagefindModule(value: unknown): value is PagefindModule {
  return isRecord(value) && typeof value.search === 'function';
}

function isResultHandle(value: unknown): value is PagefindResultHandle {
  return isRecord(value) && typeof value.data === 'function';
}

function readResultData(value: unknown): PagefindResultData | null {
  if (!isRecord(value)) return null;
  const { url, excerpt, meta } = value;
  if (typeof url !== 'string') return null;
  const title = isRecord(meta) && typeof meta.title === 'string' ? meta.title : url;
  return {
    url,
    excerpt: typeof excerpt === 'string' ? cleanExcerpt(excerpt) : '',
    title,
  };
}

async function loadPagefind(origin: string): Promise<PagefindModule | null> {
  const moduleUrl = new URL('/pagefind/pagefind.js', origin).href;
  const loaded: unknown = await import(/* @vite-ignore */ moduleUrl);
  return isPagefindModule(loaded) ? loaded : null;
}

/**
 * Lazily loads Pagefind on first call, then answers queries from it. Returns
 * an empty list rather than throwing when the index is missing — the dev
 * server has no Pagefind build.
 */
export function createPagefindBackend(origin: string): SearchBackend {
  let pending: Promise<PagefindModule | null> | null = null;

  return async function search(query: string, limit: number): Promise<SiteSearchHit[]> {
    pending = pending ?? loadPagefind(origin);
    const pagefind = await pending;
    if (!pagefind) return [];

    const response: unknown = await pagefind.search(query);
    if (!isRecord(response) || !Array.isArray(response.results)) return [];

    const handles = response.results.filter(isResultHandle).slice(0, limit);
    const hits: SiteSearchHit[] = [];
    for (const handle of handles) {
      const data = readResultData(await handle.data());
      if (data) {
        hits.push({ title: data.title, url: new URL(data.url, origin).href, excerpt: data.excerpt });
      }
    }
    return hits;
  };
}
