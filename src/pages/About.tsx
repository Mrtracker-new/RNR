import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { Container, Section, Grid, Card } from '../styles/GlobalStyle';
import aboutImage from '../assets/images/Aboutme.jpg';

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
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: var(--text-xl);
  color: var(--dark-400);
  max-width: 600px;
  margin: 0 auto var(--spacing-8);
  line-height: 1.7;
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
  border: 3px solid var(--accent-primary);
  box-shadow: 0 20px 40px rgba(100, 255, 218, 0.2);
  margin: 0 auto;

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

const TimelineSection = styled(Section)`
  position: relative;
  
  @media (max-width: 768px) {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
  
  @media (max-width: 480px) {
    padding-left: var(--spacing-3);
    padding-right: var(--spacing-3);
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: var(--text-4xl);
  text-align: center;
  margin-bottom: var(--spacing-16);
  color: var(--dark-100);
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent-primary) 0%, var(--secondary-500) 100%);
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)<{ index: number }>`
  position: relative;
  margin-bottom: var(--spacing-12);
  display: flex;
  align-items: center;
  justify-content: ${props => props.index % 2 === 0 ? 'flex-start' : 'flex-end'};

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 80px;
    padding-top: var(--spacing-8);
  }
`;

const TimelineContent = styled(Card)<{ direction: 'left' | 'right' }>`
  width: 45%;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.direction === 'left' ? 'right: -15px;' : 'left: -15px;'}
    width: 0;
    height: 0;
    border: 15px solid transparent;
    ${props => props.direction === 'left' ? 
      'border-left-color: var(--dark-700);' : 
      'border-right-color: var(--dark-700);'
    }

    @media (max-width: 768px) {
      left: -15px;
      border-right-color: var(--dark-700);
      border-left-color: transparent;
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 60px);
  }
`;

const TimelineDate = styled.div`
  position: absolute;
  left: 50%;
  top: 15px;
  transform: translateX(-50%);
  background: var(--dark-800);
  color: var(--accent-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 2px solid var(--accent-primary);
  white-space: nowrap;
  z-index: 2;

  @media (max-width: 768px) {
    left: 10px;
    top: 10px;
    transform: none;
    font-size: var(--text-xs);
    padding: var(--spacing-1) var(--spacing-3);
  }
`;

const TimelineTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-3);
`;

const TimelineDescription = styled.p`
  color: var(--dark-400);
  line-height: 1.6;
  margin-bottom: var(--spacing-3);
`;

const TimelineCategory = styled.span`
  background: rgba(100, 255, 218, 0.1);
  color: var(--accent-primary);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
`;

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
`;

const SkillsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-8);
`;

const SkillCard = styled(Card)`
  text-align: center;
`;

const SkillName = styled.h3`
  font-size: var(--text-lg);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
`;

const SkillDescription = styled.p`
  color: var(--dark-400);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-6);
`;

const SkillProgressContainer = styled.div`
  position: relative;
  background: var(--dark-700);
  border-radius: var(--radius-full);
  height: 8px;
  margin-bottom: var(--spacing-4);
  overflow: hidden;
`;

const SkillProgressBar = styled(motion.div)<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary) 0%, var(--secondary-500) 100%);
  border-radius: var(--radius-full);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 100%);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const SkillPercentage = styled.div`
  text-align: right;
  color: var(--accent-primary);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
`;

const ServicesSection = styled(Section)`
  @media (max-width: 768px) {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
  
  @media (max-width: 480px) {
    padding-left: var(--spacing-3);
    padding-right: var(--spacing-3);
  }
`;

const ServicesGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const ServiceCard = styled(Card)`
  text-align: center;
  transition: var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-primary);
    box-shadow: 0 20px 40px rgba(100, 255, 218, 0.1);
  }
`;

const ServiceIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-500) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  margin: 0 auto var(--spacing-6);
  color: var(--dark-900);
`;

const ServiceTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
`;

const ServiceDescription = styled.p`
  color: var(--dark-400);
  line-height: 1.6;
  margin-bottom: var(--spacing-4);
`;

const ServiceFeatures = styled.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  
  li {
    color: var(--dark-400);
    margin-bottom: var(--spacing-2);
    position: relative;
    padding-left: var(--spacing-6);
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-primary);
      font-weight: bold;
    }
  }
`;

// Data
const timelineData = [
  {
    year: '2024 - Present',
    title: 'Computer Science Degree — ready for what\'s next.',
    description: 'Studying advanced programming concepts, algorithms, and software development methodologies.',
    category: 'Education'
  },
  {
    year: '2022 - 2023',
    title: 'Hands-on industry experience — and the journey continues.',
    description: 'I worked in the industry, where I developed problem-solving skills and gained a solid understanding of both machines and software.',
    category: 'Work Experience'
  },
  {
    year: '2019 - 2022',
    title: 'Diploma done — this is just the beginning of what\'s next.',
    description: 'With a diploma in DTDM and a strong base in practical skills, I\'ve now started my journey into software — learning, building, and exploring new technologies.',
    category: 'Education'
  },
  {
    year: '2019',
    title: 'Started my journey — this is where it begins.',
    description: 'Every journey starts somewhere — I began mine by truly learning, coding, creating, and exploring new technologies.',
    category: 'Career Beginning'
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
  }
];

const About: React.FC = () => {
  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: '-100px' });

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

  return (
    <>
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
              I'm Rolan, an aspiring software engineer and freelancer from Yellapur, India. 
              I'm passionate about creating innovative, functional, and visually appealing digital solutions 
              that solve real-world problems.
            </HeroSubtitle>
            
            <AboutImageSection variants={itemVariants}>
              <AboutImageContainer>
                <AboutImage 
                  src={aboutImage} 
                  alt="About Rolan Lobo" 
                />
              </AboutImageContainer>
            </AboutImageSection>
          </motion.div>
        </Container>
      </AboutHero>

      {/* Timeline Section */}
      <TimelineSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            My Journey
          </SectionTitle>
          
          <TimelineContainer>
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                index={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <TimelineContent 
                  direction={index % 2 === 0 ? 'right' : 'left'}
                  hover
                >
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                  <TimelineCategory>{item.category}</TimelineCategory>
                </TimelineContent>
                <TimelineDate>{item.year}</TimelineDate>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </Container>
      </TimelineSection>

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
                hover
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
          
          <ServicesGrid>
            {servicesData.map((service, index) => (
              <ServiceCard
                key={service.title}
                as={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ServiceIcon>{service.icon}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceFeatures>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ServiceFeatures>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesSection>
    </>
  );
};

export default About;
