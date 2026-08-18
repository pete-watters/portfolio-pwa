import { describe, it, expect, vi } from 'vitest';
import {
  buildToolsDocument,
  clampLimit,
  cleanExcerpt,
  formatHits,
  MCP_PROTOCOL_VERSION,
  MCP_TOOLS,
  parseSearchSiteArgs,
  runSearchSite,
  SEARCH_RESULT_LIMIT_DEFAULT,
  SEARCH_RESULT_LIMIT_MAX,
  SEARCH_SITE_TOOL,
} from '../../src/lib/mcp-tools';
import type { SiteSearchHit } from '../../src/lib/mcp-tools';

const SITE = 'https://petewatters.ie/';

const HITS: SiteSearchHit[] = [
  {
    title: 'UTXO consolidation in six lines',
    url: 'https://petewatters.ie/blog/utxo-consolidation-six-lines/',
    excerpt: 'Consolidating UTXOs without a rewrite.',
  },
  {
    title: 'Leather Mobile',
    url: 'https://petewatters.ie/work/leather-mobile/',
    excerpt: 'Shipping a Bitcoin wallet to the App Store.',
  },
];

describe('tools document', () => {
  const doc = buildToolsDocument(SITE);

  it('matches the MCP tools/list result shape', () => {
    expect(doc.protocolVersion).toBe(MCP_PROTOCOL_VERSION);
    const tools = doc.tools;
    expect(Array.isArray(tools)).toBe(true);
    if (!Array.isArray(tools)) return;

    expect(tools).toHaveLength(MCP_TOOLS.length);
    tools.forEach((tool) => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      const schema = Reflect.get(Object(tool), 'inputSchema');
      expect(Reflect.get(Object(schema), 'type')).toBe('object');
    });
  });

  it('exposes search_site with a required query argument', () => {
    const tools = doc.tools;
    if (!Array.isArray(tools)) throw new Error('tools must be an array');
    const names = tools.map((tool) => Reflect.get(Object(tool), 'name'));
    expect(names).toContain('search_site');
    expect(Reflect.get(SEARCH_SITE_TOOL.inputSchema, 'required')).toEqual(['query']);
  });

  it('points agents at the companion documents', () => {
    expect(doc.resources).toEqual({
      llmsTxt: 'https://petewatters.ie/llms.txt',
      llmsFullTxt: 'https://petewatters.ie/llms-full.txt',
      sitemap: 'https://petewatters.ie/sitemap-index.xml',
    });
  });

  it('is JSON-serialisable', () => {
    expect(() => JSON.stringify(doc)).not.toThrow();
  });
});

describe('clampLimit', () => {
  it('defaults when the limit is missing or not a number', () => {
    expect(clampLimit(undefined)).toBe(SEARCH_RESULT_LIMIT_DEFAULT);
    expect(clampLimit('10')).toBe(SEARCH_RESULT_LIMIT_DEFAULT);
    expect(clampLimit(Number.NaN)).toBe(SEARCH_RESULT_LIMIT_DEFAULT);
  });

  it('clamps to the documented range', () => {
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
    expect(clampLimit(999)).toBe(SEARCH_RESULT_LIMIT_MAX);
    expect(clampLimit(3.7)).toBe(3);
  });
});

describe('parseSearchSiteArgs', () => {
  it('rejects anything without a usable query', () => {
    expect(parseSearchSiteArgs(null)).toBeNull();
    expect(parseSearchSiteArgs('bitcoin')).toBeNull();
    expect(parseSearchSiteArgs({})).toBeNull();
    expect(parseSearchSiteArgs({ query: '   ' })).toBeNull();
    expect(parseSearchSiteArgs({ query: 42 })).toBeNull();
  });

  it('trims the query and normalises the limit', () => {
    expect(parseSearchSiteArgs({ query: '  utxo  ', limit: 100 })).toEqual({
      query: 'utxo',
      limit: SEARCH_RESULT_LIMIT_MAX,
    });
  });
});

describe('cleanExcerpt', () => {
  it('strips Pagefind mark tags and collapses whitespace', () => {
    expect(cleanExcerpt('a <mark>utxo</mark>  is\n a coin')).toBe('a utxo is a coin');
  });
});

describe('formatHits', () => {
  it('lists title, url and excerpt per hit', () => {
    const text = formatHits(HITS, 'utxo');
    expect(text).toContain('2 result(s) for "utxo"');
    expect(text).toContain('https://petewatters.ie/blog/utxo-consolidation-six-lines/');
    expect(text).toContain('Shipping a Bitcoin wallet to the App Store.');
  });

  it('says so when nothing matched', () => {
    expect(formatHits([], 'quantum')).toContain('No pages');
  });
});

describe('runSearchSite', () => {
  it('returns formatted results from the injected backend', async () => {
    const backend = vi.fn().mockResolvedValue(HITS);
    const result = await runSearchSite(backend, { query: 'utxo', limit: 2 });

    expect(backend).toHaveBeenCalledWith('utxo', 2);
    expect(result.isError).toBeUndefined();
    expect(result.content[0]?.text).toContain('Leather Mobile');
  });

  it('never returns more than the requested limit', async () => {
    const backend = vi.fn().mockResolvedValue(HITS);
    const result = await runSearchSite(backend, { query: 'utxo', limit: 1 });
    expect(result.content[0]?.text).toContain('1 result(s)');
  });

  it('reports bad arguments as a tool error without calling the backend', async () => {
    const backend = vi.fn();
    const result = await runSearchSite(backend, { limit: 3 });

    expect(backend).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('query');
  });

  it('turns a backend failure into a tool error rather than throwing', async () => {
    const backend = vi.fn().mockRejectedValue(new Error('index missing'));
    const result = await runSearchSite(backend, { query: 'utxo' });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('unavailable');
  });
});
