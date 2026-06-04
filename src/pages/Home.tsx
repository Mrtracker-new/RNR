import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyle';
import SEO from '../components/SEO';

import { getLatestPosts, BlogPost } from '../utils/devto';

// Profile images served from /public — not imported via webpack so they are
// never bundled into the JS chunk. The browser fetches only the size it needs
// via the srcSet attribute at render time.
const profileImage    = '/images/Home_dp.webp';
const profileImage900 = '/images/Home_dp_900.webp';
const profileImage600 = '/images/Home_dp_600.webp';
const profileImage450 = '/images/Home_dp_450.webp';
const profileImage300 = '/images/Home_dp_300.webp';
const profileImage150 = '/images/Home_dp_150.webp';

// Lazy load components to reduce initial bundle size
const BlogCard = lazy(() => import('../components/BlogCard'));
const ResumeDownload = lazy(() => import('../components/ResumeDownload'));

// --- Styled Components ---

const HeroSection = styled.section`
  /*
   * Desktop: ensure the section is always tall enough to contain both
   * the centered HeroContent AND the absolutely-positioned StatsBar.
   * StatsBar is ~80px tall, sitting at bottom: 24px → needs 104px clearance.
   * We add 20px buffer → 124px minimum bottom pad.
   * min-height uses svh (small viewport height) where supported so mobile
   * browser chrome doesn't swallow content; falls back to 100vh.
   */
  min-height: 100svh;
  min-height: 100vh; /* fallback for browsers without svh */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 100px;
  padding-bottom: 130px; /* explicit px: room for absolute StatsBar (104px) + comfortable buffer */
  
  /* Background Elements */
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 50vw;
    height: 50vw;
    background: radial-gradient(circle, rgba(100, 255, 218, 0.05) 0%, transparent 70%);
    z-index: -1;
    pointer-events: none;
    filter: blur(60px);
  }

  /* Intermediate squeeze: 968px–1280px, 2-col grid still active but tighter */
  @media (min-width: 968px) and (max-width: 1280px) {
    padding-top: 90px;
    padding-bottom: 120px;
  }

  @media (max-width: 968px) {
    /* Mobile: block display for natural page flow, overflow-x to clip background */
    display: block;
    min-height: 0;
    min-height: unset;
    max-height: none;
    height: auto;
    padding-top: 100px;
    padding-bottom: var(--spacing-4);
    overflow-x: clip; /* Clip background gradient, but don't create scroll container */
    
    &::before {
      filter: blur(30px);
      opacity: 0.5;
    }
  }

  @media (max-width: 640px) {
    padding-top: 80px;
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
  /*
   * Do NOT use flex:1 here — it stretches HeroContent to fill the entire
   * HeroSection height, which breaks vertical centering at intermediate
   * viewport widths (968–1280px) and causes the AvailabilityBadge to
   * be clipped behind the absolutely-positioned StatsBar.
   */

  /* Intermediate squeeze zone: still 2-col but reduce column gap */
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

const TextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const ProfileImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
  position: relative;
  margin: 0 auto;
  
  @media (min-width: 968px) and (max-width: 1280px) {
    max-width: 320px;
  }

  @media (max-width: 968px) {
    width: 240px;
    margin-bottom: var(--spacing-2);
  }

  @media (max-width: 480px) {
    width: 200px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%);
    z-index: -1;
    filter: blur(20px);
  }
`;

const StylizedImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  
  /* Glass overlay effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    pointer-events: none;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

// Resume Preview Container
const ResumePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.98);
  backdrop-filter: blur(10px);
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
  border: 1px solid rgba(100, 255, 218, 0.2);
  font-weight: 500;
  letter-spacing: 0.5px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const GreetingPill = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-5);
  /* Accent-tinted background makes the pill read as a role label, not a greeting */
  background: rgba(100, 255, 218, 0.04);
  border: 1px solid rgba(100, 255, 218, 0.18);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
  backdrop-filter: blur(10px);

  @media (min-width: 968px) and (max-width: 1280px) {
    margin-bottom: var(--spacing-3);
  }
`;

const GreetingText = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent-primary);
  /* Sentence-case tracking suits a role label; uppercase would feel like a shout */
  letter-spacing: 0.03em;
`;

const Headline = styled(motion.h1)`
  /*
   * Clamp strategy:
   *   min (2rem / 32px)  → phones
   *   preferred (4.5vw)  → scales with viewport width
   *   max (4.5rem / 72px) → capped on ultra-wide
   *
   * At 1024px: 4.5vw ≈ 46px (2.875rem) — both headline lines fit on one
   * visual line in the left column without wrapping.
   * At 1440px: 4.5vw ≈ 65px (4.0rem) — large and impactful.
   * At 1920px: capped at 4.5rem (72px).
   *
   * Intermediate 968–1280px squeeze zone gets a slightly tighter clamp
   * to ensure neither headline line wraps unexpectedly.
   */
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: var(--font-extrabold);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-5);
  /* Solid fallback for browsers/contexts that don't support background-clip:text.
     Both --dark-50 (#fafafa) and --dark-300 (#d4d4d8) pass WCAG AA against
     the #09090b background at ~19.8:1 and ~13.8:1 respectively. */
  color: var(--dark-50);
  background: linear-gradient(180deg, var(--dark-50) 0%, var(--dark-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 968px) and (max-width: 1280px) {
    font-size: clamp(2rem, 3.8vw, 3.5rem);
    margin-bottom: var(--spacing-4);
  }
  
  span {
    color: var(--accent-primary); /* fallback for span accent text */
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  color: var(--dark-400);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: var(--spacing-8);

  @media (min-width: 968px) and (max-width: 1280px) {
    font-size: 0.95rem;
    line-height: 1.65;
    margin-bottom: var(--spacing-5);
    max-width: 460px;
  }

  @media (max-width: 968px) {
    font-size: clamp(0.95rem, 2.5vw, 1.1rem);
    max-width: 100%;
    margin-bottom: var(--spacing-6);
    padding: 0 var(--spacing-2);
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: var(--spacing-5);
    padding: 0;
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    
    /* Direct children buttons/links */
    > a, > button {
      width: 100%;
      text-align: center;
    }

    /* Wrapper div for ResumeDownload hover effect */
    > div {
      width: 100%;
      
      /* ResumeDownload internal wrapper (ResumeButtonWrapper) */
      > div {
        width: 100%;
        display: block;
        
        /* The actual download button inside ResumeDownload */
        a {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
`;

/* ── Availability signal ───────────────────────────────────────────────────
 * A pulsing green dot + one-liner below the CTAs.
 * Communicates open-to-work status without a modal or banner.
 * The dot uses two pseudo-elements: ::before = solid core, ::after = expanding ring.
 */
const dotPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(2.2);
    opacity: 0;
  }
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

const AvailabilityBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--dark-400);
  font-weight: var(--font-medium);
  margin-top: var(--spacing-4);
  /* overflow:hidden clips the expanding ::after ring on StatusDot so it
     never bleeds visually outside the badge bounds */
  overflow: hidden;
  /* Give the badge its own padding so the clip doesn't cut the dot itself */
  padding: 2px 0;

  @media (min-width: 968px) and (max-width: 1280px) {
    margin-top: var(--spacing-3);
    font-size: var(--text-xs);
  }

  @media (max-width: 968px) {
    justify-content: center;
    margin-top: var(--spacing-3);
  }

  @media (max-width: 480px) {
    font-size: var(--text-xs);
  }
`;

const StatsBar = styled(motion.div)`
  position: absolute;
  bottom: var(--spacing-6);
  left: var(--spacing-4);
  right: var(--spacing-4);
  max-width: calc(var(--breakpoint-lg) - var(--spacing-8));
  margin: 0 auto;
  padding: var(--spacing-5) var(--spacing-6);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 10;
  
  /* Gradient overlay for extra flair */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-2xl);
    padding: 1px;
    background: linear-gradient(135deg, 
      rgba(100, 255, 218, 0.3) 0%, 
      rgba(139, 92, 246, 0.3) 50%,
      rgba(100, 255, 218, 0.3) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.5;
  }
  
  @media (max-width: 1200px) {
    left: var(--spacing-3);
    right: var(--spacing-3);
    padding: var(--spacing-4) var(--spacing-5);
  }
  
  @media (max-width: 968px) {
    /* Mobile: Keep visuals but reduce spacing for unity */
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    max-width: 100%;
    margin: var(--spacing-6) auto 0; /* Tighter spacing for unified feel */
    padding: var(--spacing-5) var(--spacing-4);
    background: rgba(30, 41, 59, 0.4); /* Match About page glassmorphic style */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 640px) {
    left: auto;
    right: auto;
    margin-top: var(--spacing-5); /* Even tighter on small screens */
    margin-left: var(--spacing-2);
    margin-right: var(--spacing-2);
    padding: var(--spacing-4) var(--spacing-3);
  }
`;

const StatsContent = styled(Container)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: var(--spacing-8);
  
  @media (max-width: 768px) {
    gap: var(--spacing-6);
  }
  
  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    text-align: center;
  }
  
  @media (max-width: 480px) {
    gap: var(--spacing-3);
  }
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
    
    @media (max-width: 768px) {
      font-size: var(--text-3xl);
    }
    
    @media (max-width: 640px) {
      font-size: var(--text-2xl);
    }
  }

  p {
    font-size: var(--text-sm);
    color: var(--dark-400);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      font-size: var(--text-xs);
      letter-spacing: 0.05em;
    }
    
    @media (max-width: 640px) {
      font-size: 0.7rem;
      letter-spacing: 0.03em;
      white-space: normal;
    }
  }
`;

const BlogSection = styled.section`
  padding: var(--spacing-20) 0;
  position: relative;
  
  @media (max-width: 968px) {
    padding: var(--spacing-10) 0 var(--spacing-4) 0; /* Balanced spacing on mobile */
  }
  
  @media (max-width: 640px) {
    padding: var(--spacing-8) 0 var(--spacing-3) 0; /* Moderate spacing on small screens */
  }
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-12);
`;

const BlogTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-bold);
  /* Solid fallback — see Headline comment above for contrast rationale */
  color: var(--dark-50);
  background: linear-gradient(180deg, var(--dark-50) 0%, var(--dark-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-3);
`;

const BlogSubtitle = styled(motion.p)`
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

// --- Variant Definitions ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

// --- Component ---

const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(false);



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
        title="Rolan Lobo — Full-Stack Engineer & Security Developer"
        description="Rolan Lobo is a full-stack engineer from Karnataka, India, specializing in AES-256 encryption tools, zero-knowledge applications, and production web software. Available for freelance and full-time remote roles."
        image="https://rolan-rnr.netlify.app/og-social-card.png"
        url="https://rolan-rnr.netlify.app/"
      />

      <HeroSection>
        <HeroContent
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TextContent>
            {/* Role label — reads as a professional identity signal, not a greeting */}
            <GreetingPill variants={itemVariants}>
              <GreetingText>Full-Stack Engineer · Security &amp; Systems</GreetingText>
            </GreetingPill>

            <Headline variants={itemVariants}>
              I ship secure software.<br />
              {/*
               * Line 2 is intentionally short (< 22 chars with dots)
               * so it never wraps even at clamp minimum font sizes
               * across the 968–1280px squeeze zone.
               */}
              <span>Web · Desktop · Mobile.</span>
            </Headline>

            <Subheadline variants={itemVariants}>
              AES-256 file encryption. Zero-knowledge self-destructing files. Hands-free mouse via facial recognition.
              I build full-stack software across web, desktop, Android, and iOS — with security and craft at every layer.
            </Subheadline>

            <CTAContainer variants={itemVariants}>
              <Button
                as={Link}
                to="/projects"
                variant="primary"
                size="lg"
              >
                Explore My Work
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
              >
                Get In Touch
              </Button>
              <div
                onMouseEnter={() => {
                  // Only show preview on desktop (screen width > 968px)
                  if (window.innerWidth > 968) {
                    setShowResumePreview(true);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth > 968) {
                    setShowResumePreview(false);
                  }
                }}
              >
                <Suspense fallback={null}>
                  <ResumeDownload variant="outline" size="lg" showTooltip={false} />
                </Suspense>
              </div>
            </CTAContainer>

            {/* Availability signal — first thing a recruiter wants to know */}
            <AvailabilityBadge variants={itemVariants}>
              <StatusDot aria-hidden="true" />
              <span>Open to new projects · Remote-friendly · Replies within 24h</span>
            </AvailabilityBadge>
          </TextContent>

          <ProfileImageContainer variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!showResumePreview ? (
                <StylizedImage
                  as={motion.div}
                  key="profile"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={profileImage450}
                    srcSet={`${profileImage150} 150w, ${profileImage300} 300w, ${profileImage450} 450w, ${profileImage600} 600w, ${profileImage900} 900w, ${profileImage} 1673w`}
                    sizes="(max-width: 968px) 280px, 450px"
                    alt="Rolan Lobo (Rolan RNR) - Full Stack Developer"
                  />
                </StylizedImage>
              ) : (
                <StylizedImage
                  as={motion.div}
                  key="resume"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResumePreviewContainer>
                    <img src="/Resume_preview.webp" alt="Resume Preview" />
                  </ResumePreviewContainer>
                  <ResumeHintText>
                    Click button to download full resume
                  </ResumeHintText>
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
            {/* 4 = Web · Windows Desktop · Android · iOS — factual platform breadth */}
            <StatItem>
              <h3>4</h3>
              <p>Platforms</p>
            </StatItem>
          </StatsContent>
        </StatsBar>
      </HeroSection>

      {/* Blog Section */}
      {!loadingBlog && blogPosts.length > 0 && (
        <BlogSection>
          <Container>
            <BlogHeader>
              <BlogTitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
              {/*
               * Audit note: 'My Thoughts on Tech' reads as a personal diary.
               * 'Technical Writing' positions the blog as authored work — a professional signal.
               */}
              Technical Writing
              </BlogTitle>
              <BlogSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/*
                 * Audit note: 'figured out the hard way' is self-deprecating and vague.
                 * The new subtitle is a specific topical promise — tells a recruiter
                 * exactly what they'll read about (encryption architecture, accessibility).
                 */}
                From encryption architecture to accessibility trade-offs — things I've shipped, broken, and rebuilt.
              </BlogSubtitle>
            </BlogHeader>

            <BlogGrid>
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Suspense fallback={<div style={{ height: '400px' }} />}>
                    <BlogCard post={post} />
                  </Suspense>
                </motion.div>
              ))}
            </BlogGrid>

            <ViewAllButton
              as={Link}
              to="/blog"
              variant="outline"
              size="md"
            >
              {/* Audit note: 'Read My Technical Writing' positions writing as a skill, not a hobby */}
              Read My Technical Writing →
            </ViewAllButton>
          </Container>
        </BlogSection>
      )}
    </>
  );
};

export default Home;
