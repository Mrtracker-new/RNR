import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Button, Badge } from '../styles/GlobalStyle';
import { getAnimationConfig, getDeviceInfo } from '../utils/performance';
import profileImage from '../assets/images/Home_dp.jpg';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 120px;
  padding-bottom: var(--spacing-8);
  overflow: hidden;

  @media (max-width: 968px) {
    min-height: auto;
    padding-top: 100px;
    padding-bottom: var(--spacing-12);
  }

  @media (max-width: 768px) {
    padding-top: 80px;
    padding-bottom: var(--spacing-8);
  }

  @media (max-width: 480px) {
    padding-top: 70px;
    padding-bottom: var(--spacing-6);
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-16);
  align-items: center;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-12);
    text-align: center;
  }
`;

const TextContent = styled(motion.div)`
  z-index: 2;
`;

const ProfileSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Greeting = styled(motion.p)`
  font-size: var(--text-lg);
  color: var(--accent-primary);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: var(--font-extrabold);
  line-height: 1.1;
  margin-bottom: var(--spacing-6);
  background: linear-gradient(135deg, var(--dark-50) 0%, var(--accent-primary) 50%, var(--secondary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: var(--font-semibold);
  color: var(--dark-300);
  margin-bottom: var(--spacing-8);
  line-height: 1.3;
`;

const Description = styled(motion.p)`
  font-size: var(--text-lg);
  color: var(--dark-400);
  line-height: 1.8;
  margin-bottom: var(--spacing-10);
  max-width: 500px;

  @media (max-width: 968px) {
    max-width: 100%;
    margin-bottom: var(--spacing-8);
  }

  @media (max-width: 480px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-6);
    line-height: 1.6;
  }
`;

const StatusBadges = styled(motion.div)`
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const LocationInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--dark-400);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-6);

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const LiveTimeDisplay = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--accent-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-6);

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-12);
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
    margin-bottom: var(--spacing-8);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-6);
  }
`;

const TechStack = styled(motion.div)`
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: var(--spacing-4);
  }
`;

const TechStackTitle = styled.h3`
  font-size: var(--text-sm);
  color: var(--dark-400);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-4);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 968px) {
    text-align: center;
    width: 100%;
  }
`;

const TechItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  cursor: pointer;

  &:hover {
    border-color: var(--accent-primary);
    background: rgba(100, 255, 218, 0.1);
    transform: translateY(-2px);
  }

  span:first-child {
    font-size: var(--text-lg);
  }

  span:last-child {
    font-size: var(--text-xs);
    color: var(--dark-300);
    font-weight: var(--font-medium);
  }
`;

const ProfileImageContainer = styled(motion.div)`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: 968px) {
    width: 300px;
    height: 300px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 250px;
  }
`;

const ProfileImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-500) 100%);
  padding: 6px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    background: var(--dark-800);
    border-radius: 50%;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 12px;
    background: url(${profileImage}) center/cover;
    border-radius: 50%;
    z-index: 2;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingIcon = styled(motion.div)<{ top: string; left: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: 60px;
  height: 60px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  color: var(--accent-primary);
  font-size: var(--text-xl);

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: var(--text-base);
  }
`;

const WaveHand = styled(motion.span)`
  display: inline-block;
  font-size: 1.2em;
`;

const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const animConfig = getAnimationConfig();
  const deviceInfo = getDeviceInfo();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animConfig.stagger,
        delayChildren: 0.1,
        duration: animConfig.duration
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: deviceInfo.isMobile ? 10 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: animConfig.duration }
    }
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: animConfig.reducedMotion ? 0 : -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { duration: animConfig.duration * 1.5 }
    }
  };

  const floatingIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: animConfig.duration, delay: 0.8 }
    },
    hover: {
      y: animConfig.reducedMotion ? 0 : -8,
      transition: { duration: animConfig.duration * 0.5 }
    }
  };

  return (
    <HeroSection>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroContent>
            <TextContent>
              <Greeting variants={itemVariants}>
                <WaveHand
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </WaveHand>
                Hello, I'm
              </Greeting>

              <MainTitle variants={itemVariants}>
                Rolan Lobo
              </MainTitle>

              <Subtitle variants={itemVariants}>
                Full Stack Software Developer
              </Subtitle>

              <StatusBadges variants={itemVariants}>
                <Badge variant="success">✅ Available for projects</Badge>
                <Badge variant="info">🚀 Freelancer</Badge>
              </StatusBadges>

              <LocationInfo variants={itemVariants}>
                <span>📍</span>
                <span>Yellapur, Karnataka, India</span>
                <span>•</span>
                <span>IST Timezone</span>
              </LocationInfo>

              <LiveTimeDisplay variants={itemVariants}>
                <span>🕐</span>
                <span>Local Time: {formatTime(currentTime)}</span>
              </LiveTimeDisplay>

              <Description variants={itemVariants}>
                I'm an aspiring software engineer and freelancer passionate about creating 
                innovative, functional, and visually appealing digital solutions. I specialize 
                in security applications and file management systems.
              </Description>

              <ActionButtons variants={itemVariants}>
                <Button as={Link} to="/projects" variant="primary" size="lg">
                  View My Work
                </Button>
                <Button as={Link} to="/contact" variant="outline" size="lg">
                  Get In Touch
                </Button>
              </ActionButtons>

              <motion.div variants={itemVariants}>
                <TechStackTitle>Preferred Tech Stack</TechStackTitle>
                <TechStack>
                  <TechItem
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>⚛️</span>
                    <span>React</span>
                  </TechItem>
                  <TechItem
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🐍</span>
                    <span>Python</span>
                  </TechItem>
                  <TechItem
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🟢</span>
                    <span>Node.js</span>
                  </TechItem>
                  <TechItem
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📊</span>
                    <span>MongoDB</span>
                  </TechItem>
                  <TechItem
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🎨</span>
                    <span>CSS3</span>
                  </TechItem>
                </TechStack>
              </motion.div>
            </TextContent>

            <ProfileSection>
              <ProfileImageContainer variants={profileVariants}>
                <ProfileImage
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                
                {!deviceInfo.isMobile && (
                  <FloatingElements>
                    <FloatingIcon
                      top="10%"
                      left="80%"
                      variants={floatingIconVariants}
                      whileHover="hover"
                      animate={animConfig.reducedMotion ? {} : {
                        y: [0, -10, 0],
                        transition: { duration: 3, repeat: Infinity }
                      }}
                    >
                      ⚛️
                    </FloatingIcon>
                    
                    <FloatingIcon
                      top="70%"
                      left="85%"
                      variants={floatingIconVariants}
                      whileHover="hover"
                      animate={animConfig.reducedMotion ? {} : {
                        y: [0, -15, 0],
                        transition: { duration: 4, repeat: Infinity, delay: 1 }
                      }}
                    >
                      🐍
                    </FloatingIcon>
                    
                    <FloatingIcon
                      top="20%"
                      left="-10%"
                      variants={floatingIconVariants}
                      whileHover="hover"
                      animate={animConfig.reducedMotion ? {} : {
                        y: [0, -12, 0],
                        transition: { duration: 3.5, repeat: Infinity, delay: 0.5 }
                      }}
                    >
                      💻
                    </FloatingIcon>
                    
                    <FloatingIcon
                      top="75%"
                      left="-5%"
                      variants={floatingIconVariants}
                      whileHover="hover"
                      animate={animConfig.reducedMotion ? {} : {
                        y: [0, -8, 0],
                        transition: { duration: 4.5, repeat: Infinity, delay: 2 }
                      }}
                    >
                      🎨
                    </FloatingIcon>
                  </FloatingElements>
                )}
              </ProfileImageContainer>
            </ProfileSection>
          </HeroContent>
        </motion.div>
      </Container>
    </HeroSection>
  );
};

export default Home;
