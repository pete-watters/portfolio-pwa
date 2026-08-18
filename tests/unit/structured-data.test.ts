import { describe, it, expect } from 'vitest';
import {
  buildBlogPosting,
  buildBreadcrumbList,
  buildCaseStudy,
  buildGraph,
  buildPerson,
  buildWebSite,
  countWords,
  nodeId,
  PERSON_ID,
  WEBSITE_ID,
} from '../../src/lib/structured-data';

const SITE = 'https://petewatters.ie/';

function get(node: Record<string, unknown>, key: string): unknown {
  return node[key];
}

describe('buildPerson', () => {
  it('is the site entity with a stable @id', () => {
    const person = buildPerson(SITE);
    expect(get(person, '@type')).toBe('Person');
    expect(get(person, '@id')).toBe('https://petewatters.ie/#person');
    expect(get(person, 'name')).toBe('Pete Watters');
    expect(get(person, 'jobTitle')).toBeTruthy();
  });

  it('lists the real stack in knowsAbout', () => {
    const knowsAbout = get(buildPerson(SITE), 'knowsAbout');
    expect(knowsAbout).toContain('Bitcoin');
    expect(knowsAbout).toContain('Stacks');
    expect(knowsAbout).toContain('Solana');
    expect(knowsAbout).toContain('TypeScript');
    expect(knowsAbout).toContain('Astro');
  });

  it('links out to every profile in sameAs', () => {
    const sameAs = get(buildPerson(SITE), 'sameAs');
    expect(Array.isArray(sameAs)).toBe(true);
    if (Array.isArray(sameAs)) {
      expect(sameAs.length).toBeGreaterThanOrEqual(4);
      sameAs.forEach((url) => expect(String(url)).toMatch(/^https:\/\//));
    }
  });
});

describe('buildWebSite', () => {
  it('declares a SearchAction pointing at the real search URL', () => {
    const site = buildWebSite(SITE);
    expect(get(site, '@type')).toBe('WebSite');

    const action = get(site, 'potentialAction');
    expect(action).toMatchObject({
      '@type': 'SearchAction',
      'query-input': 'required name=search_term_string',
    });
    if (action && typeof action === 'object' && 'target' in action) {
      expect(JSON.stringify(action)).toContain(
        'https://petewatters.ie/blog?q={search_term_string}',
      );
    }
  });

  it('is published by the Person node', () => {
    expect(get(buildWebSite(SITE), 'publisher')).toEqual({ '@id': nodeId(PERSON_ID, SITE) });
  });
});

describe('buildBlogPosting', () => {
  const published = new Date('2026-01-02T00:00:00.000Z');

  it('carries dates, author, publisher and keywords', () => {
    const node = buildBlogPosting({
      title: 'A post',
      description: 'About a thing',
      path: '/blog/a-post/',
      publishedDate: published,
      updatedDate: new Date('2026-03-04T00:00:00.000Z'),
      tags: ['bitcoin', 'react'],
      wordCount: 1200,
      siteUrl: SITE,
    });

    expect(get(node, '@type')).toBe('BlogPosting');
    expect(get(node, 'url')).toBe('https://petewatters.ie/blog/a-post/');
    expect(get(node, 'datePublished')).toBe('2026-01-02T00:00:00.000Z');
    expect(get(node, 'dateModified')).toBe('2026-03-04T00:00:00.000Z');
    expect(get(node, 'keywords')).toEqual(['bitcoin', 'react']);
    expect(get(node, 'wordCount')).toBe(1200);
    expect(get(node, 'publisher')).toEqual({ '@id': nodeId(PERSON_ID, SITE) });
    expect(get(node, 'isPartOf')).toEqual({ '@id': nodeId(WEBSITE_ID, SITE) });
  });

  it('falls back to the published date when nothing was updated', () => {
    const node = buildBlogPosting({
      title: 'A post',
      description: 'About a thing',
      path: '/blog/a-post/',
      publishedDate: published,
      siteUrl: SITE,
    });
    expect(get(node, 'dateModified')).toBe(get(node, 'datePublished'));
  });

  it('omits empty keywords and a zero word count', () => {
    const node = buildBlogPosting({
      title: 'A post',
      description: 'About a thing',
      path: '/blog/a-post/',
      publishedDate: published,
      tags: [],
      wordCount: 0,
      siteUrl: SITE,
    });
    expect(node).not.toHaveProperty('keywords');
    expect(node).not.toHaveProperty('wordCount');
  });

  it('embeds the author as a full Person with a url', () => {
    const author = get(
      buildBlogPosting({
        title: 'A post',
        description: 'About a thing',
        path: '/blog/a-post/',
        publishedDate: published,
        siteUrl: SITE,
      }),
      'author',
    );
    expect(author).toMatchObject({ '@type': 'Person', url: 'https://petewatters.ie/' });
  });
});

describe('buildCaseStudy', () => {
  it('is an Article about the project, not about the page', () => {
    const node = buildCaseStudy({
      title: 'Leather Mobile',
      description: 'A wallet',
      path: '/work/leather-mobile/',
      headline: 'Shipped a wallet',
      company: 'Trust Machines',
      project: 'Leather Mobile App',
      tech: ['React Native', 'Bitcoin'],
      repo: 'https://github.com/leather-io',
      siteUrl: SITE,
    });

    expect(get(node, '@type')).toBe('Article');
    expect(get(node, 'url')).toBe('https://petewatters.ie/work/leather-mobile/');
    expect(get(node, 'keywords')).toEqual(['React Native', 'Bitcoin']);
    expect(get(node, 'about')).toMatchObject({
      '@type': 'CreativeWork',
      name: 'Leather Mobile App',
      url: 'https://github.com/leather-io',
      creator: { '@type': 'Organization', name: 'Trust Machines' },
    });
  });

  it('falls back to the page title when there is no named project', () => {
    const about = get(
      buildCaseStudy({
        title: 'Qredo',
        description: 'Institutional DeFi',
        path: '/work/qredo/',
        headline: 'Built it',
        company: 'Qredo',
        tech: ['React'],
        siteUrl: SITE,
      }),
      'about',
    );
    expect(about).toMatchObject({ name: 'Qredo' });
    expect(about).not.toHaveProperty('url');
  });
});

describe('buildBreadcrumbList', () => {
  it('numbers positions from one and resolves absolute URLs', () => {
    const node = buildBreadcrumbList(
      [
        { name: 'Home', path: '/' },
        { name: 'Writing', path: '/blog/' },
        { name: 'A post', path: '/blog/a-post/' },
      ],
      SITE,
    );

    expect(get(node, '@type')).toBe('BreadcrumbList');
    expect(get(node, 'itemListElement')).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petewatters.ie/' },
      { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://petewatters.ie/blog/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'A post',
        item: 'https://petewatters.ie/blog/a-post/',
      },
    ]);
  });
});

describe('buildGraph', () => {
  it('wraps every node in one @context', () => {
    const graph = buildGraph([buildPerson(SITE), buildWebSite(SITE)]);
    expect(get(graph, '@context')).toBe('https://schema.org');
    const nodes = get(graph, '@graph');
    expect(Array.isArray(nodes)).toBe(true);
    if (Array.isArray(nodes)) {
      expect(nodes).toHaveLength(2);
    }
  });
});

describe('countWords', () => {
  it('counts prose words', () => {
    expect(countWords('one two three four')).toBe(4);
  });

  it('ignores fenced code blocks', () => {
    expect(countWords('one two\n\n```ts\nconst a = 1;\nconst b = 2;\n```\n\nthree')).toBe(3);
  });

  it('keeps link text but drops the target', () => {
    expect(countWords('see [the docs](https://example.com/a/b)')).toBe(3);
  });

  it('ignores heading and emphasis punctuation', () => {
    expect(countWords('## A **bold** heading')).toBe(3);
  });
});
