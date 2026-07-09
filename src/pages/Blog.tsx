import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Container } from '../styles/GlobalStyle';
import { glassSurface } from '../styles/surfaces';
import SEO from '../components/SEO';
import { getAllPosts, BlogPost } from '../utils/devto';

const BlogCard = lazy(() => import('../components/BlogCard'));

/* ─── Layout ──────────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: var(--spacing-20);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding-top: 90px;
    padding-bottom: var(--spacing-16);
  }
`;

const HeroRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-8);
  padding: var(--spacing-12) 0 var(--spacing-10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: var(--spacing-10);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
    padding: var(--spacing-8) 0 var(--spacing-8);
    margin-bottom: var(--spacing-8);
  }
`;

const HeroLeft = styled(m.div)``;

const PageLabel = styled.p`
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-3);
`;

const PageTitle = styled(m.h1)`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: var(--font-extrabold);
  color: var(--dark-50);
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: var(--spacing-4);
`;

const PageSubtitle = styled(m.p)`
  font-size: var(--text-base);
  color: var(--dark-500);
  max-width: 480px;
  line-height: 1.65;
`;

const HeroRight = styled(m.div)`
  flex-shrink: 0;
`;

const DevToLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-500);
  text-decoration: none;
  transition: color 0.18s ease;

  svg { width: 14px; height: 14px; opacity: 0.6; transition: opacity 0.18s ease; }

  &:hover {
    color: var(--dark-200);
    svg { opacity: 1; }
  }
`;

/* ─── Filter bar ──────────────────────────────────────────────────────────── */

const FilterRow = styled(m.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
  /* Prevents the row itself from stretching the page on mobile */
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    width: 100%;
  }
`;

const FilterBar = styled.div`
  ${glassSurface}
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: var(--radius-lg);
  padding: 4px;
  /* Scroll horizontally if tags overflow — never break layout */
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 640px) {
    /* Stretch to full container width so it doesn't force horizontal page scroll */
    width: 100%;
    max-width: 100%;
  }
`;

const FilterTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s ease, color 0.18s ease;
  border: none;
  font-family: inherit;

  ${props => props.$active ? `
    background: rgba(255, 255, 255, 0.09);
    color: var(--dark-100);
  ` : `
    background: transparent;
    color: var(--dark-500);
    &:hover { background: rgba(255, 255, 255, 0.04); color: var(--dark-300); }
  `}
`;

const PostCount = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-600);
  font-family: var(--font-mono);
`;

/* ─── Post list ───────────────────────────────────────────────────────────── */

const PostList = styled(m.div)`
  /* BlogCard rows handle their own borders — no wrapper border needed */
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: var(--spacing-6);
  padding: var(--spacing-6) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const SkeletonLine = styled.div<{ $w?: string; $h?: string; $mb?: string }>`
  height: ${p => p.$h ?? '14px'};
  width: ${p => p.$w ?? '100%'};
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
  margin-bottom: ${p => p.$mb ?? '0'};

  @keyframes shimmer {
    0%   { opacity: 0.4; }
    50%  { opacity: 0.7; }
    100% { opacity: 0.4; }
  }
  animation: shimmer 1.6s ease-in-out infinite;
`;

const SkeletonThumb = styled.div`
  width: 100px;
  height: 68px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  animation: shimmer 1.6s ease-in-out infinite;

  @keyframes shimmer {
    0%   { opacity: 0.4; }
    50%  { opacity: 0.7; }
    100% { opacity: 0.4; }
  }

  @media (max-width: 640px) { display: none; }
`;

/* ─── States ──────────────────────────────────────────────────────────────── */

const StateBox = styled(m.div)`
  padding: var(--spacing-20) 0;
  text-align: center;
`;

const StateTitle = styled.p`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--dark-300);
  margin-bottom: var(--spacing-3);
`;

const StateBody = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-600);
  margin-bottom: var(--spacing-6);
`;

const StateLink = styled.a`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--accent-primary);
  text-decoration: none;
  transition: opacity 0.18s ease;
  &:hover { opacity: 0.75; }
`;

/* ─── Footer strip ────────────────────────────────────────────────────────── */

const FooterStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--spacing-12);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: var(--spacing-4);
`;

const FooterStripLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-500);
  text-decoration: none;
  transition: color 0.18s ease;

  svg { width: 13px; height: 13px; }
  &:hover { color: var(--dark-200); }
`;

/* ─── SVG ─────────────────────────────────────────────────────────────────── */

const ExternalSVG = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
    <polyline points="10 3 13 3 13 6" />
    <line x1="7" y1="9" x2="13" y2="3" />
  </svg>
);

/* ─── Constants ───────────────────────────────────────────────────────────── */

const SKELETON_COUNT = 6;

// All unique tags found in a post list (used for filtering)
function collectTags(posts: BlogPost[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      if (!seen.has(tag.name)) {
        seen.add(tag.name);
        tags.push(tag.name);
      }
    }
  }
  return tags.slice(0, 5); // cap at 5 filter options
}

/* ─── Component ───────────────────────────────────────────────────────────── */

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(false);
        const fetched = await getAllPosts();
        setPosts(fetched);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const tags = collectTags(posts);

  const visiblePosts = activeTag
    ? posts.filter(p => p.tags?.some(t => t.name === activeTag))
    : posts;

  return (
    <>
      <SEO
        title="Technical Writing — Rolan Lobo"
        description="Technical articles on encryption, React, Python, security engineering, and privacy-first software. Published on Dev.to."
        keywords="Rolan Lobo blog, Dev.to articles, web development, React, Python, AES-256, security tools, steganography, software engineering"
        url="https://rolan-rnr.netlify.app/blog"
        type="website"
      />

      {/* JSON-LD — CollectionPage for Google */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Technical Writing — Rolan Lobo',
            description:
              'Technical articles by Rolan Lobo published on Dev.to. Topics include encryption, React, Python, TypeScript, security tools, and software engineering.',
            url: 'https://rolan-rnr.netlify.app/blog',
            inLanguage: 'en-US',
            author: {
              '@type': 'Person',
              name: 'Rolan Lobo',
              alternateName: 'Rolan RNR',
              url: 'https://rolan-rnr.netlify.app/',
              sameAs: [
                'https://dev.to/rolan_r_n_r',
                'https://github.com/Mrtracker-new',
                'https://www.linkedin.com/in/rolan-lobo/',
              ],
            },
          })}
        </script>
      </Helmet>

      <PageWrapper>
        <Container>

          {/* ── Hero ── */}
          <HeroRow>
            <HeroLeft
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PageLabel>Writing</PageLabel>
              <PageTitle>Technical Writing</PageTitle>
              <PageSubtitle>
                From encryption architecture to accessibility trade-offs —
                things I've shipped, broken, and rebuilt.
              </PageSubtitle>
            </HeroLeft>

            <HeroRight
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DevToLink
                href="https://dev.to/rolan_r_n_r"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read on Dev.to <ExternalSVG />
              </DevToLink>
            </HeroRight>
          </HeroRow>

          {/* ── Filters + count ── */}
          {!loading && !error && posts.length > 0 && (
            <FilterRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {tags.length > 0 && (
                <FilterBar role="group" aria-label="Filter by topic">
                  <FilterTab
                    $active={activeTag === null}
                    onClick={() => setActiveTag(null)}
                    aria-pressed={activeTag === null}
                  >
                    All
                  </FilterTab>
                  {tags.map(tag => (
                    <FilterTab
                      key={tag}
                      $active={activeTag === tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      aria-pressed={activeTag === tag}
                    >
                      #{tag}
                    </FilterTab>
                  ))}
                </FilterBar>
              )}
              <PostCount>
                {visiblePosts.length} article{visiblePosts.length !== 1 ? 's' : ''}
              </PostCount>
            </FilterRow>
          )}

          {/* ── Loading skeletons ── */}
          {loading && (
            <div>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonRow key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <SkeletonLine $w="80px" $h="10px" />
                    <SkeletonLine $w="75%" $h="18px" />
                    <SkeletonLine $w="55%" $h="18px" />
                    <SkeletonLine $w="90%" $h="13px" />
                  </div>
                  <SkeletonThumb />
                </SkeletonRow>
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <StateBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <StateTitle>Couldn't load articles</StateTitle>
              <StateBody>The Dev.to API may be temporarily unavailable.</StateBody>
              <StateLink
                href="https://dev.to/rolan_r_n_r"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read directly on Dev.to →
              </StateLink>
            </StateBox>
          )}

          {/* ── Empty ── */}
          {!loading && !error && posts.length === 0 && (
            <StateBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <StateTitle>No articles yet</StateTitle>
              <StateBody>Check back soon — I publish regularly on Dev.to.</StateBody>
              <StateLink
                href="https://dev.to/rolan_r_n_r"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on Dev.to →
              </StateLink>
            </StateBox>
          )}

          {/* ── Post list ── */}
          {!loading && !error && visiblePosts.length > 0 && (
            <AnimatePresence mode="wait">
              <PostList
                key={activeTag ?? 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {visiblePosts.map((post, index) => (
                  <m.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                  >
                    <Suspense
                      fallback={
                        <SkeletonRow>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <SkeletonLine $w="80px" $h="10px" />
                            <SkeletonLine $w="75%" $h="18px" />
                            <SkeletonLine $w="90%" $h="13px" />
                          </div>
                          <SkeletonThumb />
                        </SkeletonRow>
                      }
                    >
                      <BlogCard post={post} />
                    </Suspense>
                  </m.div>
                ))}
              </PostList>
            </AnimatePresence>
          )}

          {/* ── Footer strip ── */}
          {!loading && !error && posts.length > 0 && (
            <FooterStrip>
              <FooterStripLink
                href="https://dev.to/rolan_r_n_r"
                target="_blank"
                rel="noopener noreferrer"
              >
                All articles on Dev.to <ExternalSVG />
              </FooterStripLink>
            </FooterStrip>
          )}

          {/* Static fallback for crawlers */}
          <noscript>
            <p style={{ color: 'var(--dark-400)', marginTop: '2rem', fontSize: '0.875rem' }}>
              Articles are loaded from Dev.to.{' '}
              <a href="https://dev.to/rolan_r_n_r" rel="noopener noreferrer">
                Read all articles by Rolan Lobo on Dev.to →
              </a>
            </p>
          </noscript>

        </Container>
      </PageWrapper>
    </>
  );
};

export default Blog;
