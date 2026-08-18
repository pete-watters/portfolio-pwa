// JSON-LD builders for the site. Every page emits one schema.org graph made of
// a site-wide Person and WebSite node plus whatever page-specific nodes the
// route passes in. Kept here rather than in BaseHead.astro so the shapes are
// unit-testable.

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SOCIAL } from '../consts';

export type JsonLdNode = Record<string, unknown>;

export const PERSON_ID = '#person';
export const WEBSITE_ID = '#website';

export const JOB_TITLE = 'Web3 Frontend Engineer';

export const KNOWS_ABOUT = [
  'Bitcoin',
  'Stacks',
  'Solana',
  'EVM',
  'TypeScript',
  'React',
  'React Native',
  'Astro',
] as const;

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string, siteUrl: string = SITE_URL): string {
  return new URL(path, siteUrl).href;
}

/** Stable graph identifier for a node, e.g. https://petewatters.ie/#person */
export function nodeId(fragment: string, siteUrl: string = SITE_URL): string {
  return absoluteUrl('/', siteUrl) + fragment;
}

/**
 * The site's owning entity. Emitted on every page so answer engines resolve
 * the site to one person rather than re-deriving it per route.
 */
export function buildPerson(siteUrl: string = SITE_URL): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': nodeId(PERSON_ID, siteUrl),
    name: 'Pete Watters',
    url: absoluteUrl('/', siteUrl),
    jobTitle: JOB_TITLE,
    description: SITE_DESCRIPTION,
    image: absoluteUrl('/img/icon.png', siteUrl),
    knowsAbout: [...KNOWS_ABOUT],
    sameAs: [SOCIAL.GITHUB, SOCIAL.X, SOCIAL.LINKEDIN, SOCIAL.STACKOVERFLOW],
  };
}

/**
 * WebSite node carrying a SearchAction. The site runs a real Pagefind index at
 * /blog, and /blog?q= drives it, so the search box markup describes something
 * that actually works.
 */
export function buildWebSite(siteUrl: string = SITE_URL): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': nodeId(WEBSITE_ID, siteUrl),
    name: SITE_TITLE,
    url: absoluteUrl('/', siteUrl),
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': nodeId(PERSON_ID, siteUrl) },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/blog?q={search_term_string}', siteUrl),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Author reference: a real Person object with a url, carrying the same @id as
 * the site-wide node so the two merge instead of duplicating.
 */
export function buildAuthor(siteUrl: string = SITE_URL): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': nodeId(PERSON_ID, siteUrl),
    name: 'Pete Watters',
    url: absoluteUrl('/', siteUrl),
  };
}

export interface BlogPostingInput {
  title: string;
  description: string;
  path: string;
  publishedDate: Date;
  updatedDate?: Date;
  tags?: readonly string[];
  image?: string;
  wordCount?: number;
  siteUrl?: string;
}

export function buildBlogPosting(input: BlogPostingInput): JsonLdNode {
  const siteUrl = input.siteUrl ?? SITE_URL;
  const url = absoluteUrl(input.path, siteUrl);
  const modified = input.updatedDate ?? input.publishedDate;

  const node: JsonLdNode = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    datePublished: input.publishedDate.toISOString(),
    dateModified: modified.toISOString(),
    author: buildAuthor(siteUrl),
    publisher: { '@id': nodeId(PERSON_ID, siteUrl) },
    isPartOf: { '@id': nodeId(WEBSITE_ID, siteUrl) },
    inLanguage: 'en',
    image: absoluteUrl(input.image ?? '/img/og.png', siteUrl),
  };

  if (input.tags && input.tags.length > 0) {
    node.keywords = [...input.tags];
  }
  if (typeof input.wordCount === 'number' && input.wordCount > 0) {
    node.wordCount = input.wordCount;
  }
  return node;
}

export interface CaseStudyInput {
  title: string;
  description: string;
  path: string;
  headline: string;
  company: string;
  project?: string;
  tech: readonly string[];
  repo?: string;
  wordCount?: number;
  siteUrl?: string;
}

/**
 * Case studies at /work/<slug>/ are authored prose about a shipped project, so
 * Article is the honest type — the project itself hangs off `about` as a
 * CreativeWork rather than being claimed as the page.
 */
export function buildCaseStudy(input: CaseStudyInput): JsonLdNode {
  const siteUrl = input.siteUrl ?? SITE_URL;
  const url = absoluteUrl(input.path, siteUrl);

  const about: JsonLdNode = {
    '@type': 'CreativeWork',
    name: input.project ?? input.title,
    creator: { '@type': 'Organization', name: input.company },
  };
  if (input.repo) {
    about.url = input.repo;
  }

  const node: JsonLdNode = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    name: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    author: buildAuthor(siteUrl),
    publisher: { '@id': nodeId(PERSON_ID, siteUrl) },
    isPartOf: { '@id': nodeId(WEBSITE_ID, siteUrl) },
    inLanguage: 'en',
    about,
    keywords: [...input.tech],
  };

  if (typeof input.wordCount === 'number' && input.wordCount > 0) {
    node.wordCount = input.wordCount;
  }
  return node;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbList(
  items: readonly BreadcrumbItem[],
  siteUrl: string = SITE_URL,
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}

/** Wrap nodes in a single @graph so one script tag covers the whole page. */
export function buildGraph(nodes: readonly JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': [...nodes],
  };
}

/**
 * Rough word count from raw Markdown. Strips fenced code, inline code, link
 * targets and Markdown punctuation so the number reflects prose, not syntax.
 */
export function countWords(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>|~-]/g, ' ');

  const words = prose.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word));
  return words.length;
}
