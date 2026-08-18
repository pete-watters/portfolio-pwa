// Tool contract for agents visiting this site.
//
// The site is built with output: 'static', so there is no server runtime to
// answer a JSON-RPC POST. Instead the tool list is published as a build-time
// document at /mcp/tools.json in the shape of an MCP `tools/list` result, and
// the tools themselves run in the browser through WebMCP. Same descriptors
// either way, so the published contract matches what actually executes.

import { SITE_TITLE, SITE_URL } from '../consts';

/** MCP spec revision the published tool document is shaped against. */
export const MCP_PROTOCOL_VERSION = '2026-07-28';

export const SEARCH_RESULT_LIMIT_DEFAULT = 5;
export const SEARCH_RESULT_LIMIT_MAX = 20;

export interface McpToolDescriptor {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const SEARCH_SITE_TOOL: McpToolDescriptor = {
  name: 'search_site',
  title: 'Search petewatters.ie',
  description:
    "Search Pete Watters' portfolio — blog posts, work case studies and CV — and " +
    'return matching pages with their titles, URLs and a short excerpt. Use it to ' +
    'answer questions about his writing, projects or experience.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Free-text search terms, e.g. "react native" or "utxo".',
        minLength: 1,
      },
      limit: {
        type: 'number',
        description: `Maximum results to return (1–${SEARCH_RESULT_LIMIT_MAX}).`,
        default: SEARCH_RESULT_LIMIT_DEFAULT,
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
};

export const MCP_TOOLS: readonly McpToolDescriptor[] = [SEARCH_SITE_TOOL];

/**
 * The document served at /mcp/tools.json. `tools` is exactly an MCP
 * `tools/list` result; the surrounding fields say how to reach them, because a
 * static host cannot offer a JSON-RPC transport.
 */
export function buildToolsDocument(siteUrl: string = SITE_URL): Record<string, unknown> {
  const origin = new URL('/', siteUrl).href;
  return {
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: {
      name: SITE_TITLE,
      version: '1.0.0',
      websiteUrl: origin,
    },
    transport: {
      type: 'webmcp',
      description:
        'Static site — no JSON-RPC endpoint. Tools are registered in the page via ' +
        'document.modelContext and can be called by an in-browser agent. This ' +
        'document is the inspectable contract.',
      registration: 'document.modelContext.registerTool',
    },
    resources: {
      llmsTxt: new URL('/llms.txt', siteUrl).href,
      llmsFullTxt: new URL('/llms-full.txt', siteUrl).href,
      sitemap: new URL('/sitemap-index.xml', siteUrl).href,
    },
    tools: MCP_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
}

export interface SearchSiteArgs {
  query: string;
  limit: number;
}

export interface SiteSearchHit {
  title: string;
  url: string;
  excerpt: string;
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Clamp an untrusted limit to the documented range. */
export function clampLimit(limit: unknown): number {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return SEARCH_RESULT_LIMIT_DEFAULT;
  }
  const rounded = Math.floor(limit);
  if (rounded < 1) return 1;
  if (rounded > SEARCH_RESULT_LIMIT_MAX) return SEARCH_RESULT_LIMIT_MAX;
  return rounded;
}

/**
 * Validate raw tool arguments. The WebMCP draft says the browser validates
 * against inputSchema first, but nothing guarantees that, so validate here too.
 */
export function parseSearchSiteArgs(raw: unknown): SearchSiteArgs | null {
  if (!isRecord(raw)) return null;
  const { query, limit } = raw;
  if (typeof query !== 'string') return null;
  const trimmed = query.trim();
  if (trimmed.length === 0) return null;
  return { query: trimmed, limit: clampLimit(limit) };
}

/** Collapse whitespace and drop the <mark> tags Pagefind puts in excerpts. */
export function cleanExcerpt(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatHits(hits: readonly SiteSearchHit[], query: string): string {
  if (hits.length === 0) {
    return `No pages on ${SITE_TITLE}'s site matched "${query}".`;
  }
  const lines = hits.map((hit) => `- ${hit.title} — ${hit.url}\n  ${hit.excerpt}`);
  return `${hits.length} result(s) for "${query}":\n${lines.join('\n')}`;
}

export function toToolResult(hits: readonly SiteSearchHit[], query: string): McpToolResult {
  return { content: [{ type: 'text', text: formatHits(hits, query) }] };
}

export function toErrorResult(message: string): McpToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

export type SearchBackend = (query: string, limit: number) => Promise<SiteSearchHit[]>;

/**
 * The tool body, with the search backend injected so it can be tested without
 * a browser or a built Pagefind index.
 */
export async function runSearchSite(search: SearchBackend, raw: unknown): Promise<McpToolResult> {
  const args = parseSearchSiteArgs(raw);
  if (!args) {
    return toErrorResult('search_site needs a non-empty "query" string.');
  }
  try {
    const hits = await search(args.query, args.limit);
    return toToolResult(hits.slice(0, args.limit), args.query);
  } catch {
    return toErrorResult('Site search is unavailable right now.');
  }
}
