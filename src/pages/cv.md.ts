import type { APIContext } from 'astro';
import { renderMarkdownPage } from '../lib/agent-docs';
import { getCvPage } from '../lib/site-content';
import { SITE_URL } from '../consts';

export async function GET(context: APIContext): Promise<Response> {
  const page = await getCvPage();
  if (!page) {
    return new Response('Not found', { status: 404 });
  }
  const siteUrl = context.site?.href ?? SITE_URL;
  return new Response(renderMarkdownPage(page, siteUrl), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
