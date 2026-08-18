import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// public/robots.txt is a static file, not generated, so nothing else would
// notice a dropped group. Losing one is silent: the crawler simply starts
// being allowed. These assertions are the only guard.
const ROBOTS = readFileSync(
  fileURLToPath(new URL('../../public/robots.txt', import.meta.url)),
  'utf8',
);

/** Crawlers refused outright — they take content for training and return nothing. */
const TRAINING_ONLY = [
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'Applebot-Extended',
];

/** Crawlers we want, because they feed search results and answer grounding. */
const DELIBERATELY_ALLOWED = [
  'ClaudeBot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'PerplexityBot',
];

interface RobotsGroup {
  agents: string[];
  rules: string[];
}

/** Minimal robots.txt group parser: consecutive User-agent lines share rules. */
function parseGroups(source: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let collectingAgents = false;

  for (const rawLine of source.split('\n')) {
    const line = rawLine.split('#')[0].trim();
    if (line.length === 0) continue;

    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      if (!collectingAgents || current === null) {
        current = { agents: [], rules: [] };
        groups.push(current);
        collectingAgents = true;
      }
      current.agents.push(value);
      continue;
    }

    if (current) {
      collectingAgents = false;
      current.rules.push(`${field}: ${value}`);
    }
  }

  return groups;
}

function groupFor(agent: string): RobotsGroup | undefined {
  return parseGroups(ROBOTS).find((group) =>
    group.agents.some((name) => name.toLowerCase() === agent.toLowerCase()),
  );
}

describe('public/robots.txt', () => {
  it('reserves rights under the EU copyright directive', () => {
    expect(ROBOTS).toContain(
      '# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF\n' +
        '# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT\n' +
        '# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.',
    );
  });

  it('explains each content signal before using it', () => {
    expect(ROBOTS).toContain('# search:');
    expect(ROBOTS).toContain('# ai-input:');
    expect(ROBOTS).toContain('# ai-train:');
  });

  it('grants search and grounding but not training, for everyone', () => {
    const wildcard = groupFor('*');
    expect(wildcard).toBeDefined();
    expect(wildcard?.rules).toContain('content-signal: search=yes, ai-input=yes, ai-train=no');
    expect(wildcard?.rules).toContain('allow: /');
  });

  it.each(TRAINING_ONLY)('blocks %s outright', (agent) => {
    const group = groupFor(agent);
    expect(group, `${agent} has no group — it is now allowed`).toBeDefined();
    expect(group?.rules).toContain('disallow: /');
  });

  it.each(DELIBERATELY_ALLOWED)('never blocks %s', (agent) => {
    expect(groupFor(agent), `${agent} was blocked — it feeds search and grounding`).toBeUndefined();
  });

  it('names the allowed crawlers so nobody re-blocks them', () => {
    DELIBERATELY_ALLOWED.forEach((agent) => expect(ROBOTS).toContain(agent));
  });

  it('points at the sitemap and the agent index', () => {
    expect(ROBOTS).toContain('Sitemap: https://petewatters.ie/sitemap-index.xml');
    expect(ROBOTS).toContain('Llms-Txt: https://petewatters.ie/llms.txt');
  });
});
