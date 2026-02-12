import { describe, it, expect } from 'vitest';
import { SITE_TITLE, SITE_DESCRIPTION, ROUTES, SOCIAL } from '../../src/consts';

describe('consts', () => {
  it('exports site metadata', () => {
    expect(SITE_TITLE).toBe('Pete Watters');
    expect(SITE_DESCRIPTION).toBe('Pete Watters Portfolio');
  });

  it('exports routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.ABOUT).toBe('/about');
    expect(ROUTES.BLOG).toBe('/blog');
  });

  it('exports valid social URLs', () => {
    Object.values(SOCIAL).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it('includes expected social platforms', () => {
    expect(SOCIAL).toHaveProperty('GITHUB');
    expect(SOCIAL).toHaveProperty('LINKEDIN');
    expect(SOCIAL).toHaveProperty('STACKOVERFLOW');
    expect(SOCIAL).toHaveProperty('MEDIUM');
    expect(SOCIAL).toHaveProperty('INSTAGRAM');
  });

  it('social URLs point to correct domains', () => {
    expect(SOCIAL.GITHUB).toContain('github.com');
    expect(SOCIAL.LINKEDIN).toContain('linkedin.com');
    expect(SOCIAL.STACKOVERFLOW).toContain('stackoverflow.com');
    expect(SOCIAL.MEDIUM).toContain('medium.com');
    expect(SOCIAL.INSTAGRAM).toContain('instagram.com');
  });
});
