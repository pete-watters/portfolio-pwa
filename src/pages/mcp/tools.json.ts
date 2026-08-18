import type { APIContext } from 'astro';
import { buildToolsDocument } from '../../lib/mcp-tools';
import { SITE_URL } from '../../consts';

export function GET(context: APIContext): Response {
  const siteUrl = context.site?.href ?? SITE_URL;
  return new Response(`${JSON.stringify(buildToolsDocument(siteUrl), null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
