import type { APIContext } from 'astro';
import { renderLlmsFullTxt } from '../lib/agent-docs';
import { getLlmsSections } from '../lib/site-content';
import { SITE_URL } from '../consts';

export async function GET(context: APIContext): Promise<Response> {
  const siteUrl = context.site?.href ?? SITE_URL;
  const sections = await getLlmsSections();
  return new Response(renderLlmsFullTxt(sections, siteUrl), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
