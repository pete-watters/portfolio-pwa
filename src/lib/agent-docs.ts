// Builders for the plain-Markdown copies of each page and for /llms.txt and
// /llms-full.txt. The site's content is already Markdown, so these endpoints
// hand an agent the source instead of making it strip HTML.

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';

export interface SitePage {
  /** Page title, used as the Markdown H1. */
  title: string;
  description: string;
  /** Canonical HTML path, e.g. /blog/utxo-consolidation-six-lines/ */
  path: string;
  /** Markdown sibling path, e.g. /blog/utxo-consolidation-six-lines.md */
  markdownPath: string;
  /** Raw Markdown body, without frontmatter. */
  body: string;
  date?: Date;
  updated?: Date;
  tags?: readonly string[];
}

export interface LlmsSection {
  heading: string;
  pages: readonly SitePage[];
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** Plain-Markdown rendering of a page: YAML frontmatter, H1, then the body. */
export function renderMarkdownPage(page: SitePage, siteUrl: string = SITE_URL): string {
  const lines: string[] = ['---', `title: ${yamlQuote(page.title)}`];

  if (page.description) {
    lines.push(`description: ${yamlQuote(page.description)}`);
  }
  if (page.date) {
    lines.push(`date: ${isoDate(page.date)}`);
  }
  if (page.updated) {
    lines.push(`updated: ${isoDate(page.updated)}`);
  }
  if (page.tags && page.tags.length > 0) {
    lines.push(`tags: [${page.tags.map(yamlQuote).join(', ')}]`);
  }

  lines.push(`canonical: ${new URL(page.path, siteUrl).href}`);
  lines.push(`source: ${new URL(page.markdownPath, siteUrl).href}`);
  lines.push('---', '', `# ${page.title}`, '', page.body.trim(), '');

  return lines.join('\n');
}

const SUMMARY =
  `${SITE_TITLE} — ${SITE_DESCRIPTION} This file indexes the site for agents. ` +
  'Every link points at a plain-Markdown copy of the page, not the HTML.';

function header(): string[] {
  return [`# ${SITE_TITLE}`, '', `> ${SUMMARY}`, ''];
}

function optionalSection(siteUrl: string): string[] {
  return [
    '## Optional',
    '',
    `- [Full text of every page](${new URL('/llms-full.txt', siteUrl).href}): the whole corpus in one fetch`,
    `- [RSS feed](${new URL('/rss.xml', siteUrl).href}): new writing, as it publishes`,
    `- [Agent tool contract](${new URL('/mcp/tools.json', siteUrl).href}): tools this site exposes, in MCP tools/list shape`,
    `- [Sitemap](${new URL('/sitemap-index.xml', siteUrl).href}): every HTML URL`,
    '',
  ];
}

/** /llms.txt — the llmstxt.org structure: H1, blockquote, H2 link sections. */
export function renderLlmsTxt(
  sections: readonly LlmsSection[],
  siteUrl: string = SITE_URL,
): string {
  const lines = header();

  for (const section of sections) {
    if (section.pages.length === 0) continue;
    lines.push(`## ${section.heading}`, '');
    for (const page of section.pages) {
      const url = new URL(page.markdownPath, siteUrl).href;
      const note = page.description ? `: ${page.description}` : '';
      lines.push(`- [${page.title}](${url})${note}`);
    }
    lines.push('');
  }

  lines.push(...optionalSection(siteUrl));
  return lines.join('\n');
}

/** /llms-full.txt — same header, then the full Markdown of every page inline. */
export function renderLlmsFullTxt(
  sections: readonly LlmsSection[],
  siteUrl: string = SITE_URL,
): string {
  const lines = header();
  lines.push(
    'Full text of every page follows, grouped by section. Each entry starts with',
    'its canonical URL.',
    '',
  );

  for (const section of sections) {
    if (section.pages.length === 0) continue;
    lines.push(`## ${section.heading}`, '');
    for (const page of section.pages) {
      lines.push(`### ${page.title}`, '');
      lines.push(`Source: ${new URL(page.path, siteUrl).href}`, '');
      if (page.date) {
        lines.push(`Published: ${isoDate(page.date)}`, '');
      }
      lines.push(page.body.trim(), '', '---', '');
    }
  }

  return lines.join('\n');
}
