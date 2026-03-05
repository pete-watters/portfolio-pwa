import { describe, it, expect } from 'vitest';
import { SITE_TITLE, SITE_DESCRIPTION, ROUTES, SOCIAL, GITHUB } from '../../src/consts';

describe('consts', () => {
  it('exports site metadata', () => {
    expect(SITE_TITLE).toBe('Pete Watters');
    expect(SITE_DESCRIPTION).toBe('Pete Watters Portfolio');
  });

  it('exports routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.BLOG).toBe('/blog');
  });

  it('exports valid social URLs', () => {
    Object.values(SOCIAL).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it('includes expected social platforms', () => {
    expect(SOCIAL).toHaveProperty('GITHUB');
    expect(SOCIAL).toHaveProperty('X');
    expect(SOCIAL).toHaveProperty('STACKOVERFLOW');
  });

  it('social URLs point to correct domains', () => {
    expect(SOCIAL.GITHUB).toContain('github.com');
    expect(SOCIAL.X).toContain('x.com');
    expect(SOCIAL.STACKOVERFLOW).toContain('stackoverflow.com');
  });

  it('exports GitHub config with username', () => {
    expect(GITHUB.USERNAME).toBe('pete-watters');
  });

  it('exports GitHub repos', () => {
    expect(GITHUB.REPOS).toHaveLength(2);
    expect(GITHUB.REPOS).toContain('leather-io/extension');
    expect(GITHUB.REPOS).toContain('leather-io/mono');
  });
});
