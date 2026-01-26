import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { getLatestPosts, BlogPost } from '../utils/hashnode';

// Lazy load components to reduce initial bundle size
import profileImage from '../assets/images/Home_dp.webp';
import profileImage900 from '../assets/images/Home_dp_900.webp';
import profileImage600 from '../assets/images/Home_dp_600.webp';
import profileImage450 from '../assets/images/Home_dp_450.webp';
import profileImage300 from '../assets/images/Home_dp_300.webp';
import profileImage150 from '../assets/images/Home_dp_150.webp';

// Lazy load components to reduce initial bundle size
const BlogCard = lazy(() => import('../components/BlogCard'));
const ResumeDownload = lazy(() => import('../components/ResumeDownload'));

// --- Styled Components ---

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 100px;
  padding-bottom: var(--spacing-20);
  
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

  @media (max-width: 968px) {
    /* Mobile: block display for natural page flow, overflow-x to clip background */
    display: block;
    min-height: 0;
    max-height: none;
    height: auto;
    padding-top: 120px;
    padding-bottom: var(--spacing-4);
    overflow-x: clip; /* Clip background gradient, but don't create scroll container */
    
    &::before {
      filter: blur(30px);
      opacity: 0.5;
    }
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
  flex: 1; /* Allow content to take available space on desktop */
  
  @media (max-width: 968px) {
    display: flex;
    flex-direction: column-reverse;
    text-align: center;
    gap: var(--spacing-8);
    padding-bottom: var(--spacing-12);
    flex: none; /* Remove flex:1 on mobile to prevent scroll issues */
  }
`;

const TextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  
  @media (max-width: 968px) {
    align-items: center;
  }
`;

const ProfileImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1;
  position: relative;
  margin: 0 auto;
  
  @media (max-width: 968px) {
    width: 280px;
    margin-bottom: var(--spacing-4);
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
  padding: var(--spacing-2) var(--spacing-4);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-6);
  backdrop-filter: blur(10px);
`;

const GreetingText = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--accent-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const Headline = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 5rem); /* Slightly smaller min */
  font-weight: var(--font-extrabold);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--spacing-6);
  background: linear-gradient(180deg, var(--dark-50) 0%, var(--dark-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  span {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: clamp(1.1rem, 3vw, 1.25rem);
  color: var(--dark-400);
  line-height: 1.6;
  max-width: 540px;
  margin-bottom: var(--spacing-10);
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
    <PageTransition>
      <SEO
        title="Rolan Lobo (Rolan RNR) - Full Stack Developer | Building Digital Experiences"
        description="I'm Rolan Lobo (Rolan RNR), a Full Stack Developer specializing in building exceptional digital experiences, software, and mobile apps. Explore my portfolio of projects, skills, and services."
        image="https://rolan-rnr.netlify.app/rolan-lobo-home.webp"
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
            <GreetingPill variants={itemVariants}>
              <span style={{ fontSize: '1.2em' }}>👋</span>
              <GreetingText>Hi, I am Rolan Lobo</GreetingText>
            </GreetingPill>

            <Headline variants={itemVariants}>
              Building digital experiences<br />
              <span>that matter.</span>
            </Headline>

            <Subheadline variants={itemVariants}>
              I craft accessible web experiences, software, and mobile apps using modern technologies. Let's turn your ideas into reality.
            </Subheadline>

            <CTAContainer variants={itemVariants}>
              <Button
                as={Link}
                to="/projects"
                variant="primary"
                size="lg"
              >
                View My Work
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
              >
                Contact Me
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
              <h3>3+</h3>
              <p>Years Experience</p>
            </StatItem>
            <StatItem>
              <h3>10+</h3>
              <p>Projects Built</p>
            </StatItem>
            <StatItem>
              <h3>100%</h3>
              <p>Commitment</p>
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
                Latest from my blog
              </BlogTitle>
              <BlogSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Thoughts, tutorials, and insights on development and technology
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
              View All Posts →
            </ViewAllButton>
          </Container>
        </BlogSection>
      )}
    </PageTransition>
  );
};

export default Home;
