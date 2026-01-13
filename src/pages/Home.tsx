import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import profileImage from '../assets/images/Home_dp.webp';

// --- Styled Components ---

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  /* Removed overflow: hidden to prevent cropping */
  padding-top: 100px; /* Increased top padding to clear fixed navbar safely */
  padding-bottom: var(--spacing-20); /* Space for StatsBar on desktop */
  
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
    min-height: auto;
    padding-top: 120px; /* More space on mobile */
    padding-bottom: 0;
    justify-content: flex-start;
    overflow-x: hidden; /* Prevent horizontal scroll from background elements */
    
    &::before {
      filter: blur(30px); /* Reduced from 60px */
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
  flex: 1; /* Allow content to take available space */
  
  @media (max-width: 968px) {
    display: flex; /* Switch to flex column for better stacking control */
    flex-direction: column-reverse; /* Image on top */
    text-align: center;
    gap: var(--spacing-8);
    padding-bottom: var(--spacing-12); /* Reduced space for bottom stats */
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
    
    a, button {
      width: 100%;
      text-align: center;
    }
  }
`;

const StatsBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-6) 0;
  background: rgba(9, 9, 11, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
  
  @media (max-width: 968px) {
    position: relative; /* layout flow */
    background: rgba(9, 9, 11, 0.95); /* More solid on mobile */
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: auto; /* Push to bottom if flex container allows */
    padding: var(--spacing-6) 0;
    width: 100%;
    /* Removed negative margin hack */
    bottom: auto;
    left: auto;
    right: auto;
  }
`;

const StatsContent = styled(Container)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  
  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    text-align: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);

  h3 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--dark-100);
    line-height: 1;
    
    @media (max-width: 640px) {
      font-size: var(--text-2xl); /* Smaller on mobile */
    }
  }

  p {
    font-size: var(--text-sm);
    color: var(--dark-400);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    
    @media (max-width: 640px) {
      font-size: var(--text-xs); /* Smaller label */
      letter-spacing: 0.05em;
    }
  }
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
            </CTAContainer>
          </TextContent>

          <ProfileImageContainer variants={itemVariants}>
            <StylizedImage>
              <img src={profileImage} alt="Rolan Lobo (Rolan RNR) - Full Stack Developer" />
            </StylizedImage>
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
    </PageTransition>
  );
};

export default Home;
