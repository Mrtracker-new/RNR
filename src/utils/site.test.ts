import { describe, expect, it } from 'vitest';
import { NAV, SITE_URL, SOCIALS } from './site';

describe('site config', () => {
  it('has a unique, absolute nav path per item', () => {
    const paths = NAV.map(item => item.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const item of NAV) {
      expect(item.path.startsWith('/')).toBe(true);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it('uses https for the site and every social profile', () => {
    expect(SITE_URL.startsWith('https://')).toBe(true);
    for (const social of SOCIALS) {
      expect(social.href.startsWith('https://')).toBe(true);
      expect(social.handle.length).toBeGreaterThan(0);
    }
  });
});
