import React, { useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { Container, Section } from '../styles/GlobalStyle';
import SEO from '../components/SEO';

import aboutImage from '../assets/images/Aboutme.webp';

const ResumeDownload = lazy(() => import('../components/ResumeDownload'));

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const AboutHero = styled(Section)`
  padding-top: 140px;
  text-align: center;

  @media (max-width: 768px) {
    padding-top: 120px;
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  @media (max-width: 480px) {
    padding-top: 100px;
    padding-left: var(--spacing-3);
    padding-right: var(--spacing-3);
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  margin-bottom: var(--spacing-6);
  color: var(--dark-50);
  font-weight: var(--font-extrabold);
  letter-spacing: -0.025em;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: var(--text-xl);
  color: var(--dark-400);
  max-width: 600px;
  margin: 0 auto var(--spacing-8);
  line-height: 1.7;
`;

const ResumeButtonWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-8);
`;

const AboutImageSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-16);

  @media (max-width: 968px) { margin-bottom: var(--spacing-8); }
  @media (max-width: 640px) { margin-bottom: var(--spacing-6); }
`;

const AboutImageContainer = styled.div`
  position: relative;
  width: 450px;
  height: 450px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-lg);
  margin: 0 auto;
  transition: border-color var(--transition-normal);

  &:hover { border-color: rgba(100, 255, 218, 0.3); }

  @media (max-width: 768px) { width: 400px; height: 400px; }
  @media (max-width: 480px) { width: 360px; height: 360px; margin: 0 auto; }
  @media (max-width: 360px) { width: 320px; height: 320px; }
`;

const AboutImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);

  &:hover { transform: scale(1.04); }
`;

/* ─── Journey ─────────────────────────────────────────────────────────────── */

const JourneySection = styled(Section)`
  position: relative;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-20);
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: var(--text-4xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
  display: inline-block;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: var(--accent-primary);
    border-radius: var(--radius-sm);
  }
`;

const SectionSubtitle = styled(motion.p)`
  color: var(--dark-400);
  font-size: var(--text-lg);
  max-width: 500px;
  margin: 0 auto;
`;

const JourneyContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  padding: var(--spacing-4) 0;
`;

const ProgressLineContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--dark-800);
  transform: translateX(-50%);
  z-index: 1;
  border-radius: var(--radius-full);
  overflow: hidden;

  @media (max-width: 768px) { left: 24px; }
`;

const ProgressLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: var(--accent-primary);
  transform-origin: top;
  width: 100%;
  height: 100%;
`;

const JourneyItemWrapper = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.$align === 'left' ? 'flex-end' : 'flex-start'};
  padding-bottom: var(--spacing-16);
  position: relative;
  width: 50%;
  ${props => props.$align === 'left'
    ? 'margin-right: auto; padding-right: 40px;'
    : 'margin-left: auto; padding-left: 40px;'}

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    padding-left: 60px;
    padding-right: 0;
    margin: 0;
    padding-bottom: var(--spacing-12);
  }
`;

const Marker = styled(motion.div)<{ $align: 'left' | 'right' }>`
  position: absolute;
  top: 24px;
  width: 14px;
  height: 14px;
  background: var(--dark-950);
  border: 2px solid var(--accent-primary);
  border-radius: 50%;
  z-index: 5;
  box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.8);

  ${props => props.$align === 'left' ? 'right: -9px;' : 'left: -9px;'}

  @media (max-width: 768px) {
    left: 18px;
    right: auto;
  }
`;

const JourneyCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
  text-align: left;

  &:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(100, 255, 218, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: var(--accent-primary);
    opacity: 0.6;
  }
`;

const JourneyYear = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--accent-primary);
  margin-bottom: var(--spacing-2);
  padding: 3px 10px;
  background: rgba(100, 255, 218, 0.08);
  border-radius: var(--radius-md);
  border: 1px solid rgba(100, 255, 218, 0.15);
`;

const JourneyCardTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--dark-50);
  margin-bottom: var(--spacing-1);
  font-weight: var(--font-bold);
`;

const JourneyCardRole = styled.h4`
  font-size: 0.9rem;
  color: var(--dark-300);
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: var(--accent-secondary);
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

const JourneyDescription = styled.p`
  font-size: var(--text-base);
  color: var(--dark-400);
  line-height: 1.65;
`;

const JourneyTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--spacing-4);
`;

const TechTag = styled.span`
  font-size: 0.72rem;
  color: var(--dark-400);
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

/* ─── Skills ──────────────────────────────────────────────────────────────── */

const SkillsSection = styled(Section)`
  position: relative;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-5);
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: var(--spacing-8);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, background 0.3s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(100, 255, 218, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    opacity: 0.5;
  }

  @media (max-width: 768px) { padding: var(--spacing-6); }
`;

const SkillCategory = styled.h3`
  font-size: var(--text-base);
  color: var(--dark-200);
  margin-bottom: var(--spacing-5);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  letter-spacing: -0.01em;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
`;

const SkillItem = styled.li`
  color: var(--dark-300);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color var(--transition-fast), color var(--transition-fast);
  cursor: default;

  &:hover {
    color: var(--accent-primary);
    border-color: rgba(100, 255, 218, 0.25);
  }
`;

/* ─── Focus Areas — editorial format (option c) ───────────────────────────── */

const FocusSection = styled(Section)`
  position: relative;
`;

const FocusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-xl);
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FocusArea = styled(motion.div)`
  background: var(--dark-950);
  padding: var(--spacing-10) var(--spacing-8);
  transition: background 0.25s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.4);
  }

  @media (max-width: 768px) { padding: var(--spacing-8) var(--spacing-6); }
`;

const FocusAreaNumber = styled.span`
  display: block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-primary);
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-4);
  opacity: 0.7;
`;

const FocusAreaTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-3);
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const FocusAreaBody = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  line-height: 1.7;
`;

const FocusAreaProjects = styled.div`
  margin-top: var(--spacing-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
`;

const FocusProject = styled.span`
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--dark-500);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1px;
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const timelineData = [
  {
    year: '2019',
    title: 'The Spark',
    role: 'Aspiring Developer',
    description: 'The beginning of my journey into technology. Started self-learning programming basics, exploring Python and web technologies, and writing my first lines of code.',
    tags: ['Python Base', 'Web Basics', 'Self-Learning', 'Curiosity']
  },
  {
    year: '2019 – 2022',
    title: 'Diploma in DTDM',
    role: 'Student',
    description: 'Graduated with a Diploma in Tool & Die Making. Developed a strong engineering mindset, precision thinking, and problem-solving habits that translated directly into software engineering.',
    tags: ['Engineering Fundamentals', 'Precision', 'Problem Solving', 'Logic']
  },
  {
    year: '2022 – 2023',
    title: 'Industry Experience',
    role: 'Tool & Die Designer',
    description: 'Worked as a Tool & Die designer in precision manufacturing. Tolerances are measured in microns and errors are physically costly. This built an engineering mindset that carries directly into software: design for edge cases first, validate assumptions constantly, and never ship code you have not tested under real load.',
    tags: ['Precision Engineering', 'CAD/CAM', 'Manufacturing Tolerances', 'Quality Control']
  },
  {
    year: '2024 – Present',
    title: 'Computer Science Degree',
    role: 'Student & Freelancer',
    description: 'Pursuing advanced studies in Computer Science while actively freelancing. Deepening knowledge in algorithms, system design, and AI/ML foundations while building real-world projects for clients.',
    tags: ['Algorithms', 'System Design', 'AI Foundations', 'Freelancing']
  }
];

const skillsData = [
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Styled Components', 'Framer Motion', 'Responsive Design']
  },
  {
    category: 'Backend',
    skills: ['Python', 'Flask', 'Node.js', 'REST APIs', 'Database Design', 'Authentication']
  },
  {
    category: 'Tools & Workflow',
    skills: ['Git & GitHub', 'VS Code', 'Postman', 'npm/pip', 'Chrome DevTools', 'Figma']
  },
  {
    category: 'Security & Systems',
    skills: ['AES-256 Encryption', 'ECDH Key Exchange', 'Zero-Knowledge Design', 'Steganography', 'File System APIs', 'Cross-Platform Architecture']
  }
];

const focusAreas = [
  {
    number: '01',
    title: 'Privacy & Security Tools',
    body: 'Software that takes privacy seriously as an architecture constraint, not a feature. AES-256 encryption, zero-knowledge design, and steganography — built into products people actually use.',
    projects: ['BAR', 'InvisioVault', 'LinkNest']
  },
  {
    number: '02',
    title: 'Offline-First Software',
    body: 'Applications that work without the cloud because cloud dependency is a choice, not a requirement. Local-first architecture with optional sync — full user control over data.',
    projects: ['BAR Desktop', 'LinkNest', 'Contact Manager']
  },
  {
    number: '03',
    title: 'Computer Vision Experiments',
    body: 'Using cameras as input devices for accessibility and novel interaction. MediaPipe, facial landmark detection, and real-time coordinate mapping at sub-50ms latency.',
    projects: ['CursorCam']
  },
  {
    number: '04',
    title: 'Cross-Platform Applications',
    body: 'One problem, multiple platforms. Web, Windows desktop, Android, and iOS — choosing the right tool for each target rather than forcing a single stack everywhere.',
    projects: ['YT-Downloader', 'Contact Manager', 'Sortify']
  }
];

/* ─── Animation variants ──────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

/*
 * No bounce on timeline cards — a precision engineering background calls for
 * restrained motion, not playful overshoot.
 */
const cardVariants: Variants = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0, duration: 0.6 }
  }
};

/* ─── Component ───────────────────────────────────────────────────────────── */

const About: React.FC = () => {
  const journeyRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start end', 'end center']
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <SEO
        title="About Rolan Lobo — Software Developer"
        description="Rolan Lobo is a software developer from Karnataka, India, who crossed from precision manufacturing into software engineering. He specialises in privacy-focused tools, AES-256 encryption, zero-knowledge applications, and cross-platform software."
        keywords="About Rolan Lobo, Rolan RNR, Software Developer India, Privacy Tools Developer, Security Software Engineer, Freelance Developer India, Karnataka Developer, Open Source Developer"
        image="https://rolan-rnr.netlify.app/og-social-card.png"
        url="https://rolan-rnr.netlify.app/about"
      />

      {/* Hero */}
      <AboutHero>
        <Container>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <HeroTitle variants={itemVariants}>
              Engineered, Then Coded.
            </HeroTitle>
            <HeroSubtitle variants={itemVariants}>
              From tool and die manufacturing to security software — I bring
              physical-world precision to digital systems. Today that means
              encryption tools, privacy-first applications, and cross-platform
              software that works without a cloud.
            </HeroSubtitle>

            <ResumeButtonWrapper variants={itemVariants}>
              <Suspense fallback={null}>
                <ResumeDownload variant="primary" size="lg" tooltipPosition="right" />
              </Suspense>
            </ResumeButtonWrapper>

            <AboutImageSection variants={itemVariants}>
              <AboutImageContainer>
                <AboutImage
                  src={aboutImage}
                  alt="Rolan Lobo"
                  loading="lazy"
                  decoding="async"
                />
              </AboutImageContainer>
            </AboutImageSection>
          </motion.div>
        </Container>
      </AboutHero>

      {/* Journey Timeline */}
      <JourneySection ref={journeyRef}>
        <Container>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              The Road Here
            </SectionTitle>
            <br />
            <SectionSubtitle
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              From precision manufacturing to production-grade software — every step sharpened the craft.
            </SectionSubtitle>
          </SectionHeader>

          <JourneyContainer>
            <ProgressLineContainer aria-hidden="true">
              <ProgressLine style={{ scaleY }} />
            </ProgressLineContainer>

            {timelineData.map((item, index) => (
              <JourneyItemWrapper key={index} $align={index % 2 === 0 ? 'left' : 'right'}>
                <Marker
                  $align={index % 2 === 0 ? 'left' : 'right'}
                  aria-hidden="true"
                />
                <JourneyCard
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.1, margin: '-50px' }}
                  variants={cardVariants}
                >
                  <JourneyYear>{item.year}</JourneyYear>
                  <JourneyCardTitle>{item.title}</JourneyCardTitle>
                  <JourneyCardRole>{item.role}</JourneyCardRole>
                  <JourneyDescription>{item.description}</JourneyDescription>
                  <JourneyTechStack>
                    {item.tags.map(tag => (
                      <TechTag key={tag}>{tag}</TechTag>
                    ))}
                  </JourneyTechStack>
                </JourneyCard>
              </JourneyItemWrapper>
            ))}
          </JourneyContainer>
        </Container>
      </JourneySection>

      {/* Skills */}
      <SkillsSection>
        <Container>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Skills &amp; Technologies
            </SectionTitle>
            <br />
            <SectionSubtitle
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Tools and technologies I work with across the full stack
            </SectionSubtitle>
          </SectionHeader>

          <SkillsGrid>
            {skillsData.map((skillGroup, index) => (
              <SkillCard
                key={skillGroup.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <SkillCategory>{skillGroup.category}</SkillCategory>
                <SkillsList>
                  {skillGroup.skills.map((skill) => (
                    <SkillItem key={skill}>{skill}</SkillItem>
                  ))}
                </SkillsList>
              </SkillCard>
            ))}
          </SkillsGrid>
        </Container>
      </SkillsSection>

      {/* Focus Areas — editorial grid, option (c) */}
      <FocusSection>
        <Container>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What I Focus On
            </SectionTitle>
            <br />
            <SectionSubtitle
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Areas where my projects and interests converge
            </SectionSubtitle>
          </SectionHeader>

          <FocusGrid>
            {focusAreas.map((area, index) => (
              <FocusArea
                key={area.number}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <FocusAreaNumber>{area.number}</FocusAreaNumber>
                <FocusAreaTitle>{area.title}</FocusAreaTitle>
                <FocusAreaBody>{area.body}</FocusAreaBody>
                <FocusAreaProjects>
                  {area.projects.map(p => (
                    <FocusProject key={p}>{p}</FocusProject>
                  ))}
                </FocusAreaProjects>
              </FocusArea>
            ))}
          </FocusGrid>
        </Container>
      </FocusSection>
    </>
  );
};

export default About;
