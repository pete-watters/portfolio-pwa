import { describe, it, expect } from 'vitest';
import { renderLlmsFullTxt, renderLlmsTxt, renderMarkdownPage } from '../../src/lib/agent-docs';
import type { LlmsSection, SitePage } from '../../src/lib/agent-docs';

const SITE = 'https://petewatters.ie/';

const POST: SitePage = {
  title: 'UTXO consolidation in six lines',
  description: 'Consolidating UTXOs without a rewrite.',
  path: '/blog/utxo-consolidation-six-lines/',
  markdownPath: '/blog/utxo-consolidation-six-lines.md',
  body: '## Why\n\nSome prose.\n',
  date: new Date('2026-01-02T00:00:00.000Z'),
  tags: ['bitcoin', 'utxo'],
};

const CASE_STUDY: SitePage = {
  title: 'Leather Mobile',
  description: 'A Bitcoin wallet on iOS and Android.',
  path: '/work/leather-mobile/',
  markdownPath: '/work/leather-mobile.md',
  body: 'Case study prose.',
};

const SECTIONS: LlmsSection[] = [
  { heading: 'Case studies', pages: [CASE_STUDY] },
  { heading: 'Writing', pages: [POST] },
  { heading: 'Empty', pages: [] },
];

describe('renderMarkdownPage', () => {
  const output = renderMarkdownPage(POST, SITE);

  it('opens with a YAML frontmatter block', () => {
    const lines = output.split('\n');
    expect(lines[0]).toBe('---');
    expect(lines).toContain('title: "UTXO consolidation in six lines"');
    expect(lines).toContain('date: 2026-01-02');
    expect(lines).toContain('tags: ["bitcoin", "utxo"]');
    expect(lines).toContain('canonical: https://petewatters.ie/blog/utxo-consolidation-six-lines/');
    expect(lines).toContain('source: https://petewatters.ie/blog/utxo-consolidation-six-lines.md');
  });

  it('adds an H1 above the body', () => {
    expect(output).toContain('\n# UTXO consolidation in six lines\n');
    expect(output).toContain('## Why');
  });

  it('escapes quotes in frontmatter values', () => {
    const output = renderMarkdownPage({ ...POST, title: 'A "quoted" title' }, SITE);
    expect(output).toContain('title: "A \\"quoted\\" title"');
  });

  it('leaves out fields the page does not have', () => {
    const output = renderMarkdownPage(CASE_STUDY, SITE);
    expect(output).not.toContain('date:');
    expect(output).not.toContain('tags:');
    expect(output).not.toContain('updated:');
  });

  it('records an update date when there is one', () => {
    const output = renderMarkdownPage(
      { ...POST, updated: new Date('2026-05-06T00:00:00.000Z') },
      SITE,
    );
    expect(output).toContain('updated: 2026-05-06');
  });
});

describe('renderLlmsTxt', () => {
  const output = renderLlmsTxt(SECTIONS, SITE);
  const lines = output.split('\n');

  it('starts with an H1 followed by a blockquote summary', () => {
    expect(lines[0]).toBe('# Pete Watters');
    expect(lines[1]).toBe('');
    expect(lines[2]?.startsWith('> ')).toBe(true);
  });

  it('links the Markdown copies, never the HTML pages', () => {
    expect(output).toContain(
      '- [UTXO consolidation in six lines](https://petewatters.ie/blog/utxo-consolidation-six-lines.md): Consolidating UTXOs without a rewrite.',
    );
    expect(output).not.toContain('https://petewatters.ie/blog/utxo-consolidation-six-lines/');
  });

  it('uses H2 sections and skips empty ones', () => {
    expect(output).toContain('## Case studies');
    expect(output).toContain('## Writing');
    expect(output).not.toContain('## Empty');
  });

  it('ends with the Optional section', () => {
    const headings = lines.filter((line) => line.startsWith('## '));
    expect(headings[headings.length - 1]).toBe('## Optional');
    expect(output).toContain('https://petewatters.ie/llms-full.txt');
    expect(output).toContain('https://petewatters.ie/rss.xml');
    expect(output).toContain('https://petewatters.ie/mcp/tools.json');
  });
});

describe('renderLlmsFullTxt', () => {
  const output = renderLlmsFullTxt(SECTIONS, SITE);

  it('keeps the llms.txt header shape', () => {
    const lines = output.split('\n');
    expect(lines[0]).toBe('# Pete Watters');
    expect(lines[2]?.startsWith('> ')).toBe(true);
  });

  it('inlines each page body under its own heading', () => {
    expect(output).toContain('### UTXO consolidation in six lines');
    expect(output).toContain('Source: https://petewatters.ie/blog/utxo-consolidation-six-lines/');
    expect(output).toContain('Published: 2026-01-02');
    expect(output).toContain('Some prose.');
    expect(output).toContain('Case study prose.');
  });
});
