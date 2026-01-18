import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, useInView, Variants } from 'framer-motion';
import { Container, Section, Grid, Card } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import aboutImage from '../assets/images/Aboutme.webp';
import ResumeDownload from '../components/ResumeDownload';
import { StaggerContainer, StaggerItem } from '../components/ScrollReveal';

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
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
`;

const AboutImageContainer = styled.div`
  position: relative;
  width: 450px;
  height: 450px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 2px solid var(--dark-800);
  box-shadow: var(--shadow-lg);
  margin: 0 auto;
  transition: var(--transition-normal);

  &:hover {
    border-color: var(--accent-primary);
  }

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
  }

  @media (max-width: 480px) {
    width: 360px;
    height: 360px;
    margin: 0 auto;
  }
  
  @media (max-width: 360px) {
    width: 320px;
    height: 320px;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-normal);

  &:hover {
    transform: scale(1.05);
  }
`;

/* --- NEW JOURNEY SECTION STYLES --- */

const JourneySection = styled(Section)`
  position: relative;
  overflow: hidden;
`;

const JourneyHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-20);
  position: relative;
  z-index: 2;
`;

const JourneyTitle = styled(motion.h2)`
  font-size: var(--text-4xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
  display: inline-block;
  position: relative; /* For Pseudo-element */
  
  &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: var(--accent-gradient);
      border-radius: var(--radius-full);
  }
`;

const JourneySubtitle = styled(motion.p)`
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
  left: 50%; /* Center on desktop */
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--dark-800);
  transform: translateX(-50%);
  z-index: 1;
  border-radius: var(--radius-full);
  overflow: hidden; 

  @media (max-width: 768px) {
    left: 24px; /* Move to left on mobile */
  }
`;

const ProgressLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: var(--accent-gradient);
  transform-origin: top;
  width: 100%;
  height: 100%;
`;

const JourneyItemWrapper = styled.div<{ align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-end' : 'flex-start'};
  padding-bottom: var(--spacing-16);
  position: relative;
  width: 50%;
  ${props => props.align === 'left' ? 'margin-right: auto; padding-right: 40px;' : 'margin-left: auto; padding-left: 40px;'}

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    padding-left: 60px; /* Space for line */
    padding-right: 0;
    margin: 0;
    padding-bottom: var(--spacing-12);
  }
`;

const Marker = styled(motion.div) <{ align: 'left' | 'right' }>`
    position: absolute;
    top: 24px;
    width: 16px;
    height: 16px;
    background: var(--dark-950);
    border: 3px solid var(--accent-primary);
    border-radius: 50%;
    z-index: 5;
    box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.5), 0 0 15px var(--accent-primary);
    
    /* Desktop Positioning */
    ${props => props.align === 'left' ? 'right: -10px;' : 'left: -10px;'} /* -8px for perfect center + border adj */

    @media (max-width: 768px) {
        /* Mobile Positioning - Independent of align prop */
        left: 18px; /* Line is at 24px center. Marker 16px wide. 24 - 8 = 16. + visual tweak */
        right: auto;
    }
`;


const JourneyCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
  width: 100%;
  position: relative;
  overflow: hidden;
  /* Specific transitions to avoid conflict with Framer Motion */
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  will-change: transform, opacity;
  text-align: left; /* Force clear alignment */

  &:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(100, 255, 218, 0.3);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: var(--accent-gradient);
    opacity: 0.7;
  }
`;

const JourneyYear = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--accent-primary);
  margin-bottom: var(--spacing-2);
  padding: 4px 12px;
  background: rgba(100, 255, 218, 0.1);
  border-radius: var(--radius-md);
  border: 1px solid rgba(100, 255, 218, 0.2);
`;

const JourneyCardTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--dark-50);
  margin-bottom: var(--spacing-2);
  font-weight: 700;
`;

const JourneyCardRole = styled.h4`
  font-size: 1rem;
  color: var(--dark-200);
  margin-bottom: var(--spacing-3);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  
  &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: var(--accent-secondary);
      border-radius: 50%;
  }
`;

const JourneyDescription = styled.p`
  font-size: var(--text-base);
  color: var(--dark-400);
  line-height: 1.6;
`;

const JourneyTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--spacing-4);
`;

const TechTag = styled.span`
  font-size: 0.75rem;
  color: var(--dark-300);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  transition: var(--transition-fast);

  &:hover {
      color: var(--accent-primary);
      background: rgba(100, 255, 218, 0.1);
  }
`;

/* --- SKILLS & SERVICES STYLES (Keep existing or slightly refined) --- */

const SkillsSection = styled(Section)`
  background: rgba(30, 41, 59, 0.3);
  
  @media (max-width: 768px) {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
  
  @media (max-width: 480px) {
    padding-left: var(--spacing-3);
    padding-right: var(--spacing-3);
  }

  /* Optimize for mobile scroll */
  transform: translateZ(0);
  will-change: transform;
`;

const SkillsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-8);
`;

const SkillCard = styled(Card)`
  text-align: center;
  background: rgba(30, 41, 59, 0.4);
  /* backdrop-filter: blur(12px); <-- Expensive! Removed for stability, relying on opacity */
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease; 
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);

  &:hover {
    transform: translateY(-8px);
    background: rgba(30, 41, 59, 0.6);
    border-color: var(--accent-primary);
    box-shadow: 0 10px 30px -10px rgba(100, 255, 218, 0.15);
  }
`;

const SkillName = styled.h3`
  font-size: var(--text-lg);
  color: var(--dark-50);
  margin-bottom: var(--spacing-2);
  font-weight: 700;
`;

const SkillDescription = styled.p`
  color: var(--dark-300);
  font-size: 0.85rem;
  margin-bottom: var(--spacing-5);
  min-height: 40px; /* Alignment fix */
`;

const SkillProgressContainer = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  height: 8px;
  margin-bottom: var(--spacing-3);
  overflow: hidden;
`;

const SkillProgressBar = styled(motion.div) <{ percentage: number }>`
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 3px;
  position: relative;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
    animation: shimmer 2s linear infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-150%); }
    100% { transform: translateX(250%); }
  }
`;

const SkillPercentage = styled.div`
  text-align: right;
  color: var(--accent-primary);
  font-weight: var(--font-bold);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
`;

const ServicesSection = styled(Section)`
  position: relative;
  overflow: hidden;

  /* Ambient Background Effect */
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    right: 0;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%);
    z-index: -1;
    pointer-events: none;
  }
`;

const ServicesGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-8);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  /* Subtle gradient overlay on hover */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(100, 255, 218, 0.03) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(100, 255, 218, 0.4);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3), 0 0 20px rgba(100, 255, 218, 0.1);

    &::after {
      opacity: 1;
    }

    /* Icon Animation Target */
    .service-icon {
      transform: scale(1.1) rotate(5deg);
      color: var(--accent-secondary);
      background: rgba(139, 92, 246, 0.2);
    }
  }
`;

const ServiceIconContainer = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(100, 255, 218, 0.1);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);
  color: var(--accent-primary);
  font-size: 1.75rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(100, 255, 218, 0.2);
`;

const ServiceContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-50);
  margin-bottom: var(--spacing-3);
  letter-spacing: -0.01em;
`;

const ServiceDescription = styled.p`
  color: var(--dark-300);
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: var(--spacing-6);
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  margin-bottom: var(--spacing-6);
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: var(--dark-400);
    margin-bottom: var(--spacing-3);
    padding-left: 24px;
    position: relative;
    font-size: 0.9rem;
    
    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      top: 1px;
      color: var(--accent-primary);
      font-size: 12px;
    }
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: var(--text-4xl);
  text-align: center;
  margin-bottom: var(--spacing-16);
  color: var(--dark-100);
`;

// Data
const timelineData = [
  {
    year: '2024 - Present',
    title: 'Computer Science Degree',
    role: 'Student & Freelancer',
    description: 'Pursuing advanced studies in Computer Science while actively freelancing. Deepening knowledge in algorithms, system design, and AI/ML foundations while building real-world projects for clients.',
    tags: ['Algorithms', 'System Design', 'AI Foundations', 'Freelancing']
  },
  {
    year: '2022 - 2023',
    title: 'Industry Experience',
    role: 'Tool & Die Making Intern/Designer',
    description: 'I worked in the industry, where I developed problem-solving skills and gained a solid understanding of both machines and software.',
    tags: ['Team Collaboration', 'Agile', 'Clean Code', 'Debugging']
  },
  {
    year: '2019 - 2022',
    title: 'Diploma in DTDM',
    role: 'Student',
    description: 'Graduated with a Diploma in Tool & Die Making (DTDM). Developed a strong engineering mindset, precision, and problem-solving skills that translated seamlessly into software engineering.',
    tags: ['Engineering Fundamentals', 'Precision', 'Problem Solving', 'Logic']
  },
  {
    year: '2019',
    title: 'The Spark',
    role: 'Aspiring Developer',
    description: 'The beginning of my journey into technology. Started self-learning programming basics, exploring Python and web technologies, and writing my first lines of code.',
    tags: ['Python Base', 'Web Basics', 'Self-Learning', 'Curiosity']
  }
];

const skillsData = [
  { name: 'HTML/CSS', percentage: 90, description: 'Semantic markup and responsive styling' },
  { name: 'JavaScript', percentage: 85, description: 'Modern ES6+ features and DOM manipulation' },
  { name: 'React', percentage: 80, description: 'Component-based UI development' },
  { name: 'Python', percentage: 90, description: 'Backend development and automation' },
  { name: 'Flask', percentage: 75, description: 'Lightweight web framework for APIs' },
  { name: 'Node.js', percentage: 75, description: 'Server-side JavaScript runtime' },
  { name: 'TypeScript', percentage: 65, description: 'Type-safe JavaScript development' },
  { name: 'Bootstrap', percentage: 80, description: 'Responsive CSS framework' },
  { name: 'UI/UX Design', percentage: 70, description: 'User-centered design principles' },
  { name: 'Git & Version Control', percentage: 85, description: 'Code versioning and collaboration' },
  { name: 'MongoDB', percentage: 70, description: 'NoSQL database management' },
  { name: 'Problem Solving', percentage: 88, description: 'Analytical thinking and debugging' }
];

const servicesData = [
  {
    icon: '💻',
    title: 'Web Development',
    description: 'Creating responsive and interactive web applications using modern technologies.',
    features: [
      'React-based applications',
      'Responsive design',
      'Modern JavaScript frameworks',
      'API integration'
    ]
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    description: 'Building native and cross-platform mobile applications for Android and iOS.',
    features: [
      'React Native / Flutter',
      'Cross-platform compatibility',
      'Native performance',
      'App Store deployment'
    ]
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Designing intuitive and visually appealing user interfaces for better user experience.',
    features: [
      'User-centered design',
      'Prototyping and wireframing',
      'Design system creation',
      'Accessibility considerations'
    ]
  },
  {
    icon: '🖥️',
    title: 'Desktop Applications',
    description: 'Building efficient and secure desktop applications for various platforms.',
    features: [
      'Cross-platform compatibility',
      'Security-focused applications',
      'File management systems',
      'Encryption and data protection'
    ]
  },
  {
    icon: '🛡️',
    title: 'Data Security',
    description: 'Implementing encryption and security measures to protect sensitive data.',
    features: [
      'AES encryption implementation',
      'Secure file management',
      'Data privacy solutions',
      'Steganography applications'
    ]
  },
  {
    icon: '📝',
    title: 'Tech Writing & Blogging',
    description: 'Sharing insights, experiences, and learnings from my journey in tech.',
    features: [
      'Development tutorials',
      'Personal tech journey',
      'Problem-solving insights',
      'Beginner-friendly content'
    ]
  }
];

const About: React.FC = () => {
  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: '-100px' });
  const journeyRef = useRef(null);

  // Scroll Progress Animation for Journey
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start end", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants: Variants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <PageTransition>
      <SEO
        title="About Rolan Lobo (Rolan RNR) - Full Stack Developer & Software Engineer"
        description="Learn about Rolan Lobo (Rolan RNR), a passionate freelance software engineer from Karnataka, India. Specializing in security applications (steganography, file encryption, polyglot files), web development (React, Flask), and desktop applications. Journey through education, work experience, skills, and professional freelance services."
        keywords="About Rolan Lobo, Rolan RNR, Rolan rnr, Software Engineer India, Full Stack Developer India, Freelance Developer India, Karnataka Developer, Freelance Web Developer, Security Software Developer, Steganography Developer, Polyglot Files Developer, React Developer India, Python Developer India"
        image="https://rolan-rnr.netlify.app/about-rolan-lobo.webp"
        url="https://rolan-rnr.netlify.app/about"
      />
      {/* Hero Section */}
      <AboutHero>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle variants={itemVariants}>
              About Me
            </HeroTitle>
            <HeroSubtitle variants={itemVariants}>
              I'm Rolan Lobo (RNR is my handle), an aspiring software engineer and freelancer from Karnataka, India.
              I'm passionate about creating innovative, functional, and visually appealing digital solutions
              that solve real-world problems.
            </HeroSubtitle>

            <ResumeButtonWrapper variants={itemVariants}>
              <ResumeDownload variant="primary" size="lg" />
            </ResumeButtonWrapper>

            <AboutImageSection variants={itemVariants}>
              <AboutImageContainer>
                <AboutImage
                  src={aboutImage}
                  alt="About Rolan Lobo (Rolan RNR)"
                />
              </AboutImageContainer>
            </AboutImageSection>
          </motion.div>
        </Container>
      </AboutHero>

      {/* RE-DESIGNED Journey Section */}
      <JourneySection ref={journeyRef}>
        <JourneyHeader>
          <JourneyTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            My Story
          </JourneyTitle>
          <br />
          <JourneySubtitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            A timeline of my professional growth and milestones.
          </JourneySubtitle>
        </JourneyHeader>

        <JourneyContainer>
          <ProgressLineContainer>
            <ProgressLine style={{ scaleY }} />
          </ProgressLineContainer>

          {timelineData.map((item, index) => (
            <JourneyItemWrapper key={index} align={index % 2 === 0 ? 'left' : 'right'}>
              <Marker align={index % 2 === 0 ? 'left' : 'right'} />
              <JourneyCard
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.1, margin: "-50px" }}
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
      </JourneySection>

      {/* Skills Section */}
      <SkillsSection ref={skillsRef}>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Skills & Expertise
          </SectionTitle>

          <SkillsGrid>
            {skillsData.map((skill, index) => (
              <SkillCard
                key={skill.name}
                as={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SkillName>{skill.name}</SkillName>
                <SkillDescription>{skill.description}</SkillDescription>
                <SkillProgressContainer>
                  <SkillProgressBar
                    percentage={skill.percentage}
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                  />
                </SkillProgressContainer>
                <SkillPercentage>{skill.percentage}%</SkillPercentage>
              </SkillCard>
            ))}
          </SkillsGrid>
        </Container>
      </SkillsSection>

      {/* Services Section */}
      <ServicesSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Services Offered
          </SectionTitle>

          <StaggerContainer staggerDelay={0.1}>
            <ServicesGrid>
              {servicesData.map((service, index) => (
                <StaggerItem key={service.title} variant="fadeInUp">
                  <ServiceCard>
                    <ServiceIconContainer className="service-icon">
                      {service.icon}
                    </ServiceIconContainer>
                    <ServiceContent>
                      <ServiceTitle>{service.title}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                      <Divider />
                      <ServiceFeatures>
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ServiceFeatures>
                    </ServiceContent>
                  </ServiceCard>
                </StaggerItem>
              ))}
            </ServicesGrid>
          </StaggerContainer>
        </Container>
      </ServicesSection>
    </PageTransition>
  );
};

export default About;

