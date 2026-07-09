import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { m, Variants, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import { projectsData } from '../data/projects';
import type { Project } from '../data/projects';
import { glassSurface, glassControl } from '../styles/surfaces';

import { getLatestPosts, BlogPost } from '../utils/devto';

const profileImage    = '/images/Home_dp.webp';
const profileImage900 = '/images/Home_dp_900.webp';
const profileImage600 = '/images/Home_dp_600.webp';
const profileImage450 = '/images/Home_dp_450.webp';
const profileImage300 = '/images/Home_dp_300.webp';
const profileImage150 = '/images/Home_dp_150.webp';

const BlogCard     = lazy(() => import('../components/BlogCard'));
const ResumeDownload = lazy(() => import('../components/ResumeDownload'));

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const HeroSection = styled.section`
  min-height: 100svh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 130px;
  padding-bottom: 130px;

  @media (min-width: 968px) and (max-width: 1280px) {
    padding-top: 130px;
    padding-bottom: 40px;
  }

  @media (max-width: 968px) {
    display: block;
    min-height: 0;
    min-height: unset;
    max-height: none;
    height: auto;
    padding-top: 120px;
    padding-bottom: var(--spacing-4);
    overflow-x: clip;
  }

  @media (max-width: 640px) {
    padding-top: 100px;
  }
`;

const HeroContent = styled(Container)`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--spacing-12);
  align-items: center;
  z-index: 2;
  position: relative;
  width: 100%;

  @media (min-width: 968px) and (max-width: 1280px) {
    gap: var(--spacing-8);
    grid-template-columns: 1.3fr 0.7fr;
  }

  @media (max-width: 968px) {
    display: flex;
    flex-direction: column-reverse;
    text-align: center;
    gap: var(--spacing-6);
    padding-bottom: var(--spacing-8);
  }

  @media (max-width: 640px) {
    gap: var(--spacing-4);
    padding-bottom: var(--spacing-6);
  }
`;

const TextContent = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const ProfileImageContainer = styled(m.div)`
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
  position: relative;
  margin: 0 auto;

  @media (min-width: 968px) and (max-width: 1280px) { max-width: 320px; }

  @media (max-width: 968px) {
    width: 240px;
    margin-bottom: var(--spacing-2);
  }

  @media (max-width: 480px) { width: 200px; }

`;

const StylizedImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img { transform: scale(1.04); }
`;

const ResumePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-overlay);
  padding: 20px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
  }
`;

const ResumeHintText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--accent-primary);
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 18px;
  border-radius: var(--radius-lg);
  z-index: 10;
  border: 1px solid var(--accent-border);
  font-weight: 500;
  letter-spacing: 0.5px;
  pointer-events: none;
`;

const RolePill = styled(m.div)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-5);
  background: var(--accent-subtle);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);

  @media (min-width: 968px) and (max-width: 1280px) {
    margin-bottom: var(--spacing-3);
  }
`;

const RoleText = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent-primary);
  letter-spacing: 0.03em;
`;

const Headline = styled(m.h1)`
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: var(--font-extrabold);
  line-height: 1.08;
  letter-spacing: -0.035em;
  margin-bottom: var(--spacing-5);
  color: var(--dark-50);

  @media (min-width: 968px) and (max-width: 1280px) {
    font-size: clamp(2rem, 3.8vw, 3.5rem);
    margin-bottom: var(--spacing-4);
  }

  /* Second line uses the neutral hierarchy — dimmed, not gradient-filled.
     Emphasis comes from weight + color contrast, not a colored gradient. */
  span {
    color: var(--dark-400);
    font-weight: var(--font-bold);
  }
`;

const Subheadline = styled(m.p)`
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  color: var(--dark-400);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: var(--spacing-8);

  @media (min-width: 968px) and (max-width: 1280px) {
    font-size: 1rem;
    line-height: 1.65;
    margin-bottom: var(--spacing-8);
    max-width: 480px;
  }

  @media (max-width: 968px) {
    font-size: clamp(0.95rem, 2.5vw, 1.1rem);
    max-width: 100%;
    margin-bottom: var(--spacing-8);
    padding: 0 var(--spacing-2);
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: var(--spacing-6);
    padding: 0;
  }
`;

const CTAContainer = styled(m.div)`
  display: flex;
  gap: var(--spacing-3) var(--spacing-4);
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-start;

  @media (max-width: 968px) {
    justify-content: center;
    align-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-3);

    > a, > button { width: 100%; text-align: center; }

    > div {
      width: 100%;
      > div { width: 100%; display: block; a { width: 100%; justify-content: center; } }
    }
  }
`;

const dotPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%       { transform: scale(2.2); opacity: 0; }
`;

const StatusDot = styled.span`
  position: relative;
  display: inline-block;
  width: 8px;
  height: 8px;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--success);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: rgba(34, 197, 94, 0.4);
    border-radius: 50%;
    animation: ${dotPulse} 2.4s ease-in-out infinite;
  }
`;

const AvailabilityBadge = styled(m.div)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--dark-400);
  font-weight: var(--font-medium);
  margin-top: var(--spacing-6);
  overflow: hidden;
  padding: 2px 0;

  @media (min-width: 968px) and (max-width: 1280px) {
    margin-top: var(--spacing-6);
    font-size: var(--text-xs);
  }

  @media (max-width: 968px) {
    justify-content: center;
    margin-top: var(--spacing-6);
  }

  @media (max-width: 480px) { font-size: var(--text-xs); }
`;

/* ─── Stats bar ───────────────────────────────────────────────────────────── */

const StatsBar = styled(m.div)`
  ${glassSurface}
  border-radius: var(--radius-2xl);
  position: relative;
  bottom: auto;
  left: auto;
  right: auto;
  max-width: 100%;
  margin: var(--spacing-12) auto 0;
  padding: var(--spacing-5) var(--spacing-6);
  z-index: 10;

  @media (min-width: 1280px) {
    position: absolute;
    bottom: var(--spacing-6);
    left: var(--spacing-4);
    right: var(--spacing-4);
    max-width: calc(var(--breakpoint-lg) - var(--spacing-8));
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    margin-top: var(--spacing-10);
    margin-left: var(--spacing-2);
    margin-right: var(--spacing-2);
    padding: var(--spacing-4) var(--spacing-3);
  }
`;

const StatsContent = styled(Container)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: var(--spacing-8);

  @media (max-width: 768px) { gap: var(--spacing-6); }

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    text-align: center;
  }

  @media (max-width: 480px) { gap: var(--spacing-3); }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
  min-width: 100px;

  @media (max-width: 640px) {
    min-width: 0;
    width: 100%;
  }

  h3 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--dark-100);
    line-height: 1;
    white-space: nowrap;

    @media (max-width: 768px) { font-size: var(--text-3xl); }
    @media (max-width: 640px) { font-size: var(--text-2xl); }
  }

  p {
    font-size: var(--text-sm);
    color: var(--dark-400);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;

    @media (max-width: 768px) { font-size: var(--text-xs); letter-spacing: 0.05em; }
    @media (max-width: 640px) { font-size: 0.7rem; letter-spacing: 0.03em; white-space: normal; }
  }
`;

/* ─── Featured projects strip ─────────────────────────────────────────────── */

const FeaturedSection = styled.section`
  padding: var(--spacing-20) 0;

  @media (max-width: 768px) { padding: var(--spacing-16) 0; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--spacing-10);
  gap: var(--spacing-4);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-8);
  }
`;

const SectionLabel = styled.p`
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dark-500);
`;

const SectionLink = styled(Link)`
  font-size: var(--text-sm);
  color: var(--dark-400);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover { color: var(--accent-primary); }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
`;

const FeaturedCard = styled(Link)`
  ${glassSurface}
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  transition: border-color 0.25s ease, background 0.25s ease;
  text-decoration: none;

  &:hover {
    border-color: var(--accent-border);
    background: var(--bg-overlay);
  }
`;

const FeaturedCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
`;

const FeaturedCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const FeaturedCardCategory = styled.span`
  font-size: 0.7rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dark-500);
`;

const FeaturedCardIcon = styled.span`
  font-size: 1.1rem;
  line-height: 1;
`;

const FeaturedCardTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--dark-100);
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const FeaturedCardDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-400);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FeaturedCardTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: auto;
`;

const TechPill = styled.span`
  ${glassControl}
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  color: var(--dark-400);
  padding: 2px 8px;
`;

const ArrowIcon = styled.span`
  font-size: var(--text-lg);
  color: var(--dark-600);
  transition: color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;

  ${FeaturedCard}:hover & {
    color: var(--accent-primary);
    transform: translate(2px, -2px);
  }
`;

/* ─── Blog section ────────────────────────────────────────────────────────── */

const BlogSection = styled.section`
  padding: var(--spacing-20) 0;
  position: relative;

  @media (max-width: 968px) { padding: var(--spacing-10) 0 var(--spacing-4) 0; }
  @media (max-width: 640px)  { padding: var(--spacing-8) 0 var(--spacing-3) 0; }
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-12);
`;

const BlogTitle = styled(m.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  margin-bottom: var(--spacing-3);
`;

const BlogSubtitle = styled(m.p)`
  font-size: var(--text-base);
  color: var(--dark-400);
  max-width: 600px;
  margin: 0 auto var(--spacing-8);
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-10);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const ViewAllButton = styled(Button)`
  margin: 0 auto;
  display: block;
`;

/* ─── Animation variants ──────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 20 }
  }
};

/* ─── Component ───────────────────────────────────────────────────────────── */

const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(false);

  const featuredProjects = projectsData.filter((p: Project) => p.featured);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getLatestPosts(3);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <>
      <SEO
        title="Rolan Lobo — Software Developer"
        description="Rolan Lobo builds privacy-focused software — AES-256 encryption tools, zero-knowledge file sharing platforms, and offline-first applications. Open source. Karnataka, India."
        image="https://rolan-rnr.netlify.app/og-social-card.png"
        url="https://rolan-rnr.netlify.app/"
      />

      <HeroSection>
        <HeroContent
          as={m.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TextContent>
            <RolePill variants={itemVariants}>
              <RoleText>Software Developer · Privacy &amp; Security Tools</RoleText>
            </RolePill>

            <Headline variants={itemVariants}>
              I ship secure software.<br />
              <span>Web · Desktop · Mobile.</span>
            </Headline>

            <Subheadline variants={itemVariants}>
              I build software that doesn't overshare — file encryption tools, zero-knowledge sharing
              platforms, and privacy-first desktop apps. From web to Windows to Android, with security
              at every layer.
            </Subheadline>

            <CTAContainer variants={itemVariants}>
              <Button as={Link} to="/projects" $variant="primary" $size="lg">
                Explore My Work
              </Button>
              <Button as={Link} to="/contact" $variant="outline" $size="lg">
                Start a Conversation
              </Button>
              <div
                onMouseEnter={() => { if (window.innerWidth > 968) setShowResumePreview(true); }}
                onMouseLeave={() => { if (window.innerWidth > 968) setShowResumePreview(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowResumePreview(prev => !prev);
                  }
                }}
                onBlur={() => setShowResumePreview(false)}
              >
                <Suspense fallback={null}>
                  <ResumeDownload variant="outline" size="lg" showTooltip={false} />
                </Suspense>
              </div>
            </CTAContainer>

            <AvailabilityBadge variants={itemVariants}>
              <StatusDot aria-hidden="true" />
              <span>Open to new projects · Remote-friendly · Replies within 24h</span>
            </AvailabilityBadge>
          </TextContent>

          <ProfileImageContainer variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!showResumePreview ? (
                <StylizedImage
                  as={m.div}
                  key="profile"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={profileImage450}
                    srcSet={`${profileImage150} 150w, ${profileImage300} 300w, ${profileImage450} 450w, ${profileImage600} 600w, ${profileImage900} 900w, ${profileImage} 1673w`}
                    sizes="(max-width: 968px) 280px, 450px"
                    alt="Rolan Lobo — Software Developer"
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    width={450}
                    height={450}
                  />
                </StylizedImage>
              ) : (
                <StylizedImage
                  as={m.div}
                  key="resume"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResumePreviewContainer>
                    <img src="/Resume_preview.webp" alt="Resume Preview" />
                  </ResumePreviewContainer>
                  <ResumeHintText>Click button to download full resume</ResumeHintText>
                </StylizedImage>
              )}
            </AnimatePresence>
          </ProfileImageContainer>
        </HeroContent>

        <StatsBar
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <StatsContent>
            <StatItem>
              <h3>10+</h3>
              <p>Products Shipped</p>
            </StatItem>
            <StatItem>
              <h3>3+</h3>
              <p>Years Building</p>
            </StatItem>
            <StatItem>
              <h3>4</h3>
              <p>Platforms</p>
            </StatItem>
          </StatsContent>
        </StatsBar>
      </HeroSection>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <FeaturedSection>
          <Container>
            <SectionHeader>
              <SectionLabel>Featured Work</SectionLabel>
              <SectionLink to="/projects">View all projects →</SectionLink>
            </SectionHeader>

            <FeaturedGrid>
              {featuredProjects.map((project: Project, index: number) => (
                <m.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <FeaturedCard to="/projects">
                    <FeaturedCardHeader>
                      <FeaturedCardMeta>
                        <FeaturedCardIcon aria-hidden="true">{project.icon}</FeaturedCardIcon>
                        <FeaturedCardCategory>{project.category}</FeaturedCardCategory>
                      </FeaturedCardMeta>
                      <ArrowIcon aria-hidden="true">↗</ArrowIcon>
                    </FeaturedCardHeader>

                    <FeaturedCardTitle>{project.title}</FeaturedCardTitle>
                    <FeaturedCardDescription>{project.description}</FeaturedCardDescription>

                    <FeaturedCardTech>
                      {project.technologies.slice(0, 4).map((tech: string) => (
                        <TechPill key={tech}>{tech}</TechPill>
                      ))}
                    </FeaturedCardTech>
                  </FeaturedCard>
                </m.div>
              ))}
            </FeaturedGrid>
          </Container>
        </FeaturedSection>
      )}

      {/* Blog */}
      {!loadingBlog && blogPosts.length > 0 && (
        <BlogSection>
          <Container>
            <BlogHeader>
              <BlogTitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Technical Writing
              </BlogTitle>
              <BlogSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                From encryption architecture to accessibility trade-offs — things I've shipped, broken, and rebuilt.
              </BlogSubtitle>
            </BlogHeader>

            <BlogGrid>
              {blogPosts.map((post, index) => (
                <m.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Suspense fallback={<div style={{ height: '400px' }} />}>
                    <BlogCard post={post} />
                  </Suspense>
                </m.div>
              ))}
            </BlogGrid>

            <ViewAllButton as={Link} to="/blog" $variant="outline" $size="md">
              Read My Technical Writing →
            </ViewAllButton>
          </Container>
        </BlogSection>
      )}
    </>
  );
};

export default Home;
