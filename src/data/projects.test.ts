import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROJECT_CATEGORIES, getProjectBySlug, projectPath, projectsData } from './projects';

describe('projectsData', () => {
  it('uses unique ids', () => {
    const ids = projectsData.map(project => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses known categories', () => {
    for (const project of projectsData) {
      expect(PROJECT_CATEGORIES).toContain(project.category);
    }
  });

  it('has at least one featured project and every project links to source', () => {
    expect(projectsData.some(project => project.featured)).toBe(true);

    for (const project of projectsData) {
      expect(project.github).toMatch(/^https:\/\//);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.caseStudy.problem.length).toBeGreaterThan(0);
      expect(project.caseStudy.solution.length).toBeGreaterThan(0);
      expect(project.caseStudy.impact.length).toBeGreaterThan(0);
      expect(project.caseStudy.learnings.length).toBeGreaterThan(0);
    }
  });

  it('gives every project a unique, URL-safe slug', () => {
    const slugs = projectsData.map(project => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }

    expect(getProjectBySlug('buildwise-ai')?.title).toBe('BuildWise AI');
    expect(getProjectBySlug('does-not-exist')).toBeNull();
    expect(projectPath('buildwise-ai')).toBe('/projects/buildwise-ai');
  });

  it('keeps the prerender and sitemap slug lists in sync with the data', () => {
    const slugs = projectsData.map(project => project.slug);

    for (const script of ['scripts/prerender.mjs', 'scripts/generate-sitemap.mjs', 'scripts/verify-build.mjs']) {
      const source = readFileSync(join(process.cwd(), script), 'utf8');
      for (const slug of slugs) {
        expect(source, `${script} is missing ${slug}`).toContain(`'${slug}'`);
      }
    }
  });

  it('pairs every project image with a responsive source', () => {
    const withImages = projectsData.filter(project => project.image);
    expect(withImages.length).toBeGreaterThan(0);

    for (const project of withImages) {
      expect(project.imageSrcSet, project.title).toContain('400w');
    }
  });
});
