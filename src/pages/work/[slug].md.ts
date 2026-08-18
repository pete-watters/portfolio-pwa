import type { APIContext } from 'astro';
import { renderMarkdownPage } from '../../lib/agent-docs';
import type { SitePage } from '../../lib/agent-docs';
import { getWorkPages } from '../../lib/site-content';
import { SITE_URL } from '../../consts';

export async function getStaticPaths() {
  const pages = await getWorkPages();
  return pages.map((page: SitePage) => ({
    params: { slug: page.markdownPath.replace('/work/', '').replace(/\.md$/, '') },
    props: { page },
  }));
}

interface Props {
  page: SitePage;
}

export function GET(context: APIContext<Props>): Response {
  const siteUrl = context.site?.href ?? SITE_URL;
  return new Response(renderMarkdownPage(context.props.page, siteUrl), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
