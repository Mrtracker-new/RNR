import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { Container, Section } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import aboutImage from '../assets/images/Aboutme.webp';
import ResumeDownload from '../components/ResumeDownload';

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
  
  @media (max-width: 968px) {
    margin-bottom: var(--spacing-8); /* Reduced gap on mobile */
  }
  
  @media (max-width: 640px) {
    margin-bottom: var(--spacing-6); /* Even tighter on small screens */
  }
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
      border-radius: var(--radius-sm);
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

const JourneyItemWrapper = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.$align === 'left' ? 'flex-end' : 'flex-start'};
  padding-bottom: var(--spacing-16);
  position: relative;
  width: 50%;
  ${props => props.$align === 'left' ? 'margin-right: auto; padding-right: 40px;' : 'margin-left: auto; padding-left: 40px;'}

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    padding-left: 60px; /* Space for line */
    padding-right: 0;
    margin: 0;
    padding-bottom: var(--spacing-12);
  }
`;

const Marker = styled(motion.div) <{ $align: 'left' | 'right' }>`
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
    ${props => props.$align === 'left' ? 'right: -10px;' : 'left: -10px;'} /* -8px for perfect center + border adj */

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

/* --- SKILLS SECTION STYLES --- */

const SkillsSection = styled(Section)`
  position: relative;
`;

const SkillsHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-16);
`;

const SkillsTitle = styled(motion.h2)`
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
    width: 60px;
    height: 4px;
    background: var(--accent-gradient);
    border-radius: var(--radius-sm);
  }
`;

const SkillsSubtitle = styled(motion.p)`
  color: var(--dark-400);
  font-size: var(--text-lg);
  max-width: 500px;
  margin: 0 auto;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-8);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const SkillCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: var(--spacing-8);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  will-change: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%);
    border-color: rgba(100, 255, 218, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(100, 255, 218, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--accent-gradient);
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: radial-gradient(circle at top right, rgba(100, 255, 218, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const SkillCategory = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-50);
  margin-bottom: var(--spacing-6);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  letter-spacing: -0.02em;

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: var(--accent-gradient);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(100, 255, 218, 0.6);
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
`;

const SkillItem = styled.li`
  color: var(--dark-200);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: var(--transition-fast);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  background: rgba(100, 255, 218, 0.08);
  border: 1px solid rgba(100, 255, 218, 0.15);
  cursor: default;

  &:hover {
    color: var(--accent-primary);
    background: rgba(100, 255, 218, 0.15);
    border-color: rgba(100, 255, 218, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
  }
`;

/* --- SERVICES SECTION STYLES --- */

const ServicesSection = styled(Section)`
  position: relative;
  background: rgba(15, 23, 42, 0.3);
`;

const ServicesHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-16);
`;

const ServicesTitle = styled(motion.h2)`
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
    width: 60px;
    height: 4px;
    background: var(--accent-gradient);
    border-radius: var(--radius-sm);
  }
`;

const ServicesSubtitle = styled(motion.p)`
  color: var(--dark-400);
  font-size: var(--text-lg);
  max-width: 500px;
  margin: 0 auto;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-8);
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--spacing-8);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
  will-change: auto;

  &:hover {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(100, 255, 218, 0.3);
    transform: translateY(-6px);
    box-shadow: 0 10px 40px -10px rgba(100, 255, 218, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ServiceIcon = styled.div`
  width: 56px;
  height: 56px;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-5);
  font-size: 1.75rem;
  transition: var(--transition-normal);

  ${ServiceCard}:hover & {
    background: rgba(100, 255, 218, 0.15);
    border-color: rgba(100, 255, 218, 0.4);
    transform: scale(1.05);
  }
`;

const ServiceTitle = styled.h3`
  font-size: var(--text-2xl);
  color: var(--dark-50);
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-semibold);
`;

const ServiceDescription = styled.p`
  color: var(--dark-400);
  font-size: var(--text-base);
  line-height: 1.7;
  margin-bottom: var(--spacing-4);
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const ServiceFeature = styled.li`
  color: var(--dark-300);
  font-size: var(--text-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);

  &::before {
    content: '✓';
    color: var(--accent-primary);
    font-weight: var(--font-bold);
    margin-top: 2px;
  }
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

// Skills Data
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
    category: 'Other Skills',
    skills: ['Problem Solving', 'Clean Code', 'Debugging', 'System Design', 'UI/UX Design', 'Performance Optimization']
  }
];

// Services Data
const servicesData = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications built with the latest technologies.',
    features: ['Custom web applications', 'E-commerce platforms', 'Landing pages', 'Performance optimization']
  },
  {
    icon: '💻',
    title: 'Full-Stack Applications',
    description: 'End-to-end solutions from database design to polished user interfaces.',
    features: ['RESTful API development', 'Database architecture', 'User authentication', 'Real-time features']
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that prioritize user experience and accessibility.',
    features: ['Responsive design', 'Wireframing & prototyping', 'Design systems', 'Brand consistency']
  },
  {
    icon: '🔒',
    title: 'Security Applications',
    description: 'Specialized tools for data security, encryption, and secure file handling.',
    features: ['Steganography tools', 'File encryption', 'Polyglot file creation', 'Secure data transmission']
  },
  {
    icon: '⚡',
    title: 'Performance Optimization',
    description: 'Speed up your application and improve user experience through strategic optimizations.',
    features: ['Code optimization', 'Bundle size reduction', 'Caching strategies', 'Load time improvements']
  },
  {
    icon: '🛠️',
    title: 'Consultation & Support',
    description: 'Technical guidance and ongoing support for your development projects.',
    features: ['Code review', 'Architecture planning', 'Technical mentoring', 'Troubleshooting']
  }
];



const About: React.FC = () => {
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
              <ResumeDownload variant="primary" size="lg" tooltipPosition="right" />
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
            <JourneyItemWrapper key={index} $align={index % 2 === 0 ? 'left' : 'right'}>
              <Marker $align={index % 2 === 0 ? 'left' : 'right'} />
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
      <SkillsSection>
        <Container>
          <SkillsHeader>
            <SkillsTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Skills & Technologies
            </SkillsTitle>
            <br />
            <SkillsSubtitle
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Tools and technologies I use to bring ideas to life
            </SkillsSubtitle>
          </SkillsHeader>

          <SkillsGrid>
            {skillsData.map((skillGroup, index) => (
              <SkillCard
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
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

      {/* Services Section */}
      <ServicesSection>
        <Container>
          <ServicesHeader>
            <ServicesTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Services Offered
            </ServicesTitle>
            <br />
            <ServicesSubtitle
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Professional services tailored to your needs
            </ServicesSubtitle>
          </ServicesHeader>

          <ServicesGrid>
            {servicesData.map((service, index) => (
              <ServiceCard
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <ServiceIcon>{service.icon}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceFeatures>
                  {service.features.map((feature) => (
                    <ServiceFeature key={feature}>{feature}</ServiceFeature>
                  ))}
                </ServiceFeatures>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesSection>

    </PageTransition>
  );
};

export default About;

