import { test, expect } from '@playwright/test';

test.describe('Agent endpoints', () => {
  test('llms.txt follows the llmstxt.org structure', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    const lines = body.split('\n');
    expect(lines[0]).toBe('# Pete Watters');
    expect(lines[2].startsWith('> ')).toBe(true);
    expect(body).toContain('## Writing');
    expect(body).toContain('## Optional');
  });

  test('llms.txt links Markdown copies, not HTML pages', async ({ request }) => {
    const body = await (await request.get('/llms.txt')).text();
    const links = [...body.matchAll(/\]\((https:\/\/petewatters\.ie[^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(links.length).toBeGreaterThan(10);
    const contentLinks = links.filter(
      (url) => url.includes('/blog/') || url.includes('/work/') || url.endsWith('/cv.md'),
    );
    expect(contentLinks.length).toBeGreaterThan(10);
    contentLinks.forEach((url) => expect(url.endsWith('.md')).toBe(true));
  });

  test('llms-full.txt inlines page bodies', async ({ request }) => {
    const response = await request.get('/llms-full.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body.startsWith('# Pete Watters')).toBe(true);
    expect(body).toContain('### The Six-Line Fix');
    expect(body.length).toBeGreaterThan(50_000);
  });

  test('a blog post has a Markdown sibling with frontmatter', async ({ request }) => {
    const response = await request.get('/blog/utxo-consolidation-six-lines.md');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body.startsWith('---\n')).toBe(true);
    expect(body).toContain('canonical: https://petewatters.ie/blog/utxo-consolidation-six-lines/');
    expect(body).toContain('# The Six-Line Fix');
    expect(body).not.toContain('<html');
  });

  test('a case study and the CV have Markdown siblings', async ({ request }) => {
    const work = await request.get('/work/leather-mobile.md');
    expect(work.status()).toBe(200);
    expect(await work.text()).toContain('canonical: https://petewatters.ie/work/leather-mobile/');

    const cv = await request.get('/cv.md');
    expect(cv.status()).toBe(200);
    expect(await cv.text()).toContain('canonical: https://petewatters.ie/cv/');
  });

  test('blog post HTML advertises its Markdown sibling', async ({ page }) => {
    await page.goto('/blog/utxo-consolidation-six-lines');
    const link = page.locator('link[rel="alternate"][type="text/markdown"]');
    await expect(link).toHaveAttribute('href', '/blog/utxo-consolidation-six-lines.md');
  });

  test('mcp/tools.json exposes search_site in tools/list shape', async ({ request }) => {
    const response = await request.get('/mcp/tools.json');
    expect(response.status()).toBe(200);

    const doc = await response.json();
    expect(Array.isArray(doc.tools)).toBe(true);
    const searchTool = doc.tools.find((tool: { name: string }) => tool.name === 'search_site');
    expect(searchTool).toBeTruthy();
    expect(searchTool.inputSchema.type).toBe('object');
    expect(searchTool.inputSchema.required).toEqual(['query']);
  });

  test('robots.txt carries the content signals and the sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=no');
    expect(body).toContain('Sitemap: https://petewatters.ie/sitemap-index.xml');
    expect(body).toContain('https://petewatters.ie/llms.txt');
    expect(body).toContain('EXPRESS RESERVATIONS OF');
  });

  test('the deployed robots.txt still refuses the training-only crawlers', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    ['CCBot', 'Bytespider', 'Amazonbot', 'meta-externalagent', 'Applebot-Extended'].forEach(
      (agent) => expect(body).toContain(`User-agent: ${agent}\nDisallow: /`),
    );
    ['ClaudeBot', 'Google-Extended', 'GPTBot', 'OAI-SearchBot', 'PerplexityBot'].forEach((agent) =>
      expect(body).not.toContain(`User-agent: ${agent}\nDisallow: /`),
    );
  });

  test('every page carries a Person and WebSite graph', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(raw).toBeTruthy();

    const graph = JSON.parse(raw ?? '{}');
    expect(graph['@context']).toBe('https://schema.org');
    const types = graph['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toContain('Person');
    expect(types).toContain('WebSite');
  });

  test('search prefills from the ?q= parameter the SearchAction advertises', async ({ page }) => {
    await page.goto('/blog?q=utxo');
    await expect(page.locator('#search input.pagefind-ui__search-input')).toHaveValue('utxo');
  });
});
