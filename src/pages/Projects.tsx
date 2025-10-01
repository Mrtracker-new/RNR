import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section, Grid, Card, Button, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import PageTransition from '../components/PageTransition';
import { SkeletonGrid } from '../components/Skeleton';
import { StaggerContainer, StaggerItem } from '../components/ScrollReveal';

// Import project images
import invisioVaultDesktopImg from '../assets/images/InvisioVault_Suit.png';
import barLogoImg from '../assets/images/BAR_logo.png';
import sortifyImg from '../assets/images/Sortify.jpg';
import linkNestImg from '../assets/images/LinkNest.png';
import contactManagerImg from '../assets/images/Contact_Manager.png';

const ProjectsHero = styled(Section)`
  padding-top: 140px;
  text-align: center;
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
  margin: 0 auto var(--spacing-16);
  line-height: 1.7;
`;

const FilterSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-16);
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${props => props.active ? `
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    color: var(--dark-950);
    border: 1px solid transparent;
    box-shadow: var(--shadow-accent);
  ` : `
    background: rgba(30, 41, 59, 0.6);
    color: var(--dark-300);
    border: 1px solid var(--dark-700);
    backdrop-filter: blur(10px);
    
    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: rgba(100, 255, 218, 0.1);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  `}
`;

const SearchContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-16);
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--text-base);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-lg);
  background: var(--dark-900);
  color: var(--dark-100);
  transition: var(--transition-normal);

  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px var(--accent-primary);
  }

  &::placeholder {
    color: var(--dark-500);
  }
`;

const ProjectsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-8);
`;

const ProjectCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  height: 600px;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 520px;
  }
  
  @media (max-width: 480px) {
    height: auto;
    min-height: 480px;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: var(--accent-primary);
    box-shadow: 0 30px 60px rgba(100, 255, 218, 0.15);
  }
`;

const ProjectImageContainer = styled.div<{ bgColor: string }>`
  width: 100%;
  height: 240px;
  background: ${props => props.bgColor};
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-6);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
    z-index: 1;
    pointer-events: none;
  }
`;


const ProjectIconOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-6xl);
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ProjectBadge = styled(Badge)`
  position: absolute;
  top: var(--spacing-4);
  left: var(--spacing-4);
  z-index: 2;
`;

const FeaturedBadge = styled(Badge)`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: 2;
`;

const ProjectContent = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    flex: none;
  }
`;

const ProjectTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-semibold);
`;

const ProjectDescription = styled.p`
  color: var(--dark-400);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 72px;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 72px;
  }
`;

const ProjectTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
  height: 32px;
  align-items: flex-start;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 32px;
  }
`;

const TechTag = styled.span`
  background: rgba(139, 92, 246, 0.1);
  color: var(--accent-secondary);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const ProjectActions = styled.div`
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
  margin-top: auto;
`;

const ActionButton = styled(Button)`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
  
  @media (max-width: 1024px) {
    max-width: 95vw;
    padding: var(--spacing-6);
  }
  
  @media (max-width: 768px) {
    max-width: 90vw;
    padding: var(--spacing-5);
    max-height: 85vh;
  }
  
  @media (max-height: 600px) {
    max-height: 95vh;
    padding: var(--spacing-4);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--dark-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: 20px;
  font-weight: normal;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  /* Refined mobile design */
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
    top: var(--spacing-4);
    right: var(--spacing-4);
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Touch-friendly on mobile */
  @media (hover: none) and (pointer: coarse) {
    &:active {
      background: rgba(255, 255, 255, 0.2);
      color: var(--accent-primary);
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
`;

const ModalDescription = styled.p`
  color: var(--dark-400);
  line-height: 1.7;
  margin-bottom: var(--spacing-6);
`;

const ModalTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
`;

// Project Data
const projectsData = [
  {
    id: 1,
    title: 'InvisioVault_R',
    category: 'Desktop Application',
    description: 'Desktop app that hides files (PDFs, media, etc.) inside images using AES-256 encryption. Supports PNG, JPG, BMP formats and offers batch processing with a clean, user-friendly interface.',
    longDescription: 'InvisioVault is My daily learning sandbox for mastering steganography. Hide any files from documents and photos to videos and full folders inside ordinary images that look perfectly normal. Built with curiosity, crafted with passion.',
    technologies: ['Python', 'Pillow (PIL)', 'AES-256'],
    github: 'https://github.com/Mrtracker-new/InvisioVault_R',
    download: 'https://github.com/Mrtracker-new/InvisioVault_R/releases/',
    featured: true,
    icon: '🔒',
    bgColor: '#000000',
    image: invisioVaultDesktopImg
  },
  {
    id: 2,
    title: 'BAR (Burn After Reading)',
    category: 'Desktop Application',
    description: 'BAR (Burn After Reading) is my project to showcase skills in security, cryptography, and logic design. It’s an offline desktop app for sensitive file management with encryption and self-destruction features.',
    longDescription: 'BAR (Burn After Reading) is a powerful desktop application designed for secure file management with advanced security features including self-destruction capabilities. Operating entirely offline with no server dependencies, BAR ensures your sensitive data never leaves your machine.',
    technologies: ['Python', 'PyQt5', 'AES-256-GCM', 'PBKDF2'],
    github: 'https://github.com/Mrtracker-new/BAR',
    download: 'https://github.com/Mrtracker-new/BAR/releases/download/v1.0/BAR.exe',
    featured: true,
    icon: '🔥',
    bgColor: '#000000',
    image: barLogoImg
  },
  {
    id: 3,
    title: 'Sortify',
    category: 'Desktop Application',
    description: 'Sortify helps you automatically organize your files with easy-to-use commands. Clean up cluttered folders by sorting files based on type, — all in just a few clicks.',
    longDescription: 'Sortify is an intelligent file organization tool that automatically categorizes and organizes your files based on their formats, content, and metadata. It leverages AI and machine learning to understand file content and context, going beyond simple extension-based sorting.',
    technologies: ['Python', 'OS', 'shutil'],
    github: 'https://github.com/Mrtracker-new/Sortify',
    download: 'https://github.com/Mrtracker-new/Sortify/releases/download/v1.0/Sortify_Setup.exe',
    featured: true,
    icon: '📁',
    bgColor: '#000000',
    image: sortifyImg
  },
  {
    id: 4,
    title: 'InvisioVault (Web Version)',
    category: 'Web Application',
    description: 'This is a Flask-based web application for file steganography, where users can hide a file within an image or extract a hidden file from an image.',
    longDescription: 'InvisioVault is a cutting-edge file-hiding web-application that allows you to securely embed files of any type into images. With its compression capabilities, even larger files can be seamlessly hidden in smaller images. Whether youre looking to protect sensitive data or explore creative file storage, InvisioVault has got you covered.',
    technologies: ['Python', 'HTML', 'CSS', 'Flask'],
    github: 'https://github.com/Mrtracker-new/InvisioVault',
    liveDemo: 'https://invisio-vault.vercel.app/',
    featured: false,
    icon: '🌐',
    bgColor: '#000000'
  },
  {
    id: 5,
    title: 'YT-Downloader',
    category: 'Web Application',
    description: 'A modern YouTube video/audio downloader web application with theme support, preview functionality, and download management.',
    longDescription: 'A modern and user-friendly YouTube video and audio downloader web application featuring both dark and light themes, video preview functionality, and advanced download management with progress tracking, real-time speed monitoring, and resume/pause capabilities.',
    technologies: ['Python', 'JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/Mrtracker-new/YT-Downloader',
    featured: false,
    icon: '📺',
    bgColor: '#000000'
  },
  {
    id: 6,
    title: 'CursorCam',
    category: 'Web Application',
    description: 'CursorCam: Hands-Free Mouse Control CursorCam uses facial recognition to control the mouse via your laptop\'s camera, providing a hands-free, accessible way to navigate your computer.',
    longDescription: 'CursorCam is a Flask-based web application that transforms your laptops camera into a mouse controller using facial recognition. By tracking facial movements, the application mimics mouse movements, allowing you to control your device hands-free. The system incorporates advanced calibration and user profiles for customization and accuracy.',
    technologies: ['Python', 'JavaScript'],
    github: 'https://github.com/Mrtracker-new/CursorCam',
    featured: false,
    icon: '👁️',
    bgColor: '#000000'
  },
  {
    id: 7,
    title: 'RNR Portfolio',
    category: 'Web Application',
    description: 'MY portfolio Website built with React',
    longDescription: 'RNR is my portfolio website, where I showcase my skills, projects, and experiences. Its built with React, Styled Components, and Framer Motion, and its hosted on Vercel. You can explore my work, learn about my background, and get in touch with me through the contact form.',
    technologies: ['React', 'HTML', 'CSS'],
    github: 'https://github.com/Mrtracker-new/RNR',
    featured: false,
    icon: '💼',
    bgColor: '#000000'
  },
  {
    id: 8,
    title: 'Contact-Manager',
    category: 'Android App',
    description: 'Contact Manager is a clean and responsive web application for managing contacts with ease. It lets users add, edit, delete, and search contacts efficiently.',
    longDescription: 'Contact Manager is a simple and responsive web application built to manage and organize your personal or professional contacts. It allows users to add, update, delete, and search contacts efficiently. Each contact can have files, notes, and useful links attached for better organization. Built with modern web technologies and a minimal UI for a seamless experience.',
    technologies: ['TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/Mrtracker-new/Contact-manager',
    liveDemo: 'https://contact-manager-rnr.vercel.app/',
    download: 'https://github.com/Mrtracker-new/Contact-manager/releases/download/v1.0/Contact-Manager.apk',
    featured: false,
    icon: '📱',
    bgColor: '#000000',
    image: contactManagerImg
  },
  {
    id: 9,
    title: 'LinkNest',
    category: 'Android App',
    description: 'LinkNest is a React Native app that helps users organize and manage their digital resources—like links, notes, and documents—locally with an elegant, user-friendly interface.',
    longDescription: 'LinkNest is a comprehensive React Native application designed for efficient digital resource management. It features link management with custom titles and descriptions, rich text note-taking capabilities, document storage with preview support, smart categorization using customizable categories and tags, a favorites system for quick access, powerful full-text search, advanced filtering options, dark mode support, and cross-platform compatibility. Built with modern technologies including TypeScript, React Navigation, and Material Design 3 components, LinkNest offers native performance on both iOS and Android platforms.',
    technologies: ['React Native', 'TypeScript', 'React Navigation', 'Material Design 3', 'AsyncStorage'],
    github: 'https://github.com/Mrtracker-new/LinkNest',
    download: 'https://github.com/Mrtracker-new/LinkNest/releases/download/v1.0/LinkNest.apk',
    featured: false,
    icon: '🔗',
    bgColor: '#000000',
    image: linkNestImg
  }
];

const categories = ['All', 'Desktop Application', 'Web Application', 'Android App'];

interface ProjectModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-3xl)', 
              background: project.bgColor, 
              padding: 'var(--spacing-4)', 
              borderRadius: '50%', 
              width: '70px', 
              height: '70px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {project.icon}
            </div>
            <div>
              <ModalTitle>{project.title}</ModalTitle>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge variant="info">{project.category}</Badge>
                {project.featured && <Badge variant="success">⭐ Featured</Badge>}
              </div>
            </div>
          </div>

          <ModalDescription>{project.longDescription}</ModalDescription>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <h4 style={{ color: 'var(--dark-100)', marginBottom: 'var(--spacing-3)' }}>Technologies Used:</h4>
            <ModalTech>
              {project.technologies.map((tech: string, index: number) => (
                <TechTag key={index}>{tech}</TechTag>
              ))}
            </ModalTech>
          </div>

          <ModalActions>
            <ActionButton 
              as="a" 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              variant="primary"
            >
              📂 View Code
            </ActionButton>
            {project.liveDemo && (
              <ActionButton 
                as="a" 
                href={project.liveDemo} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="secondary"
              >
                🚀 Live Demo
              </ActionButton>
            )}
            {project.download && (
              <ActionButton 
                as="a" 
                href={project.download} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="outline"
              >
                💾 Download
              </ActionButton>
            )}
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate loading time
    
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Prevent body scroll but don't change scroll position
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <SEO
        title="Projects - Rolan Lobo Portfolio"
        description="Explore my portfolio of software projects including desktop applications, web development, and security tools. InvisioVault, BAR, Sortify, and more."
        url="https://rolan-rnr.netlify.app/projects"
      />
      <ProjectsHero>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle variants={itemVariants}>
              My Projects
            </HeroTitle>
            <HeroSubtitle variants={itemVariants}>
              A showcase of my work spanning desktop applications, web development, 
              and mobile apps. Each project represents a unique solution to real-world problems.
            </HeroSubtitle>

            <FilterSection variants={itemVariants}>
              {categories.map(category => (
                <FilterButton
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </FilterButton>
              ))}
            </FilterSection>

            <SearchContainer variants={itemVariants}>
              <SearchInput
                type="text"
                placeholder="🔍 Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </motion.div>
        </Container>
      </ProjectsHero>

      <Section>
        <Container>
          {isLoading ? (
            <ProjectsGrid>
              <SkeletonGrid count={6} />
            </ProjectsGrid>
          ) : (
            <StaggerContainer staggerDelay={0.15}>
              <ProjectsGrid>
                <AnimatePresence>
                  {filteredProjects.map((project, index) => (
                  <StaggerItem key={project.id} variant="scaleUp">
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => openModal(project)}
                    >
                    <ProjectCard>
                  <ProjectImageContainer bgColor={project.bgColor}>
                    {project.image && (
                      <OptimizedImage 
                        src={project.image} 
                        alt={project.title}
                        loading="lazy"
                        style={{
                          width: '85%',
                          height: '85%',
                          maxWidth: '300px',
                          maxHeight: '180px',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          borderRadius: 'var(--radius-md)',
                          position: 'relative',
                          zIndex: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          padding: 'var(--spacing-2)',
                        }}
                      />
                    )}
                    {!project.image && (
                      <ProjectIconOverlay>
                        {project.icon}
                      </ProjectIconOverlay>
                    )}
                    <ProjectBadge variant="info">{project.category}</ProjectBadge>
                    {project.featured && (
                      <FeaturedBadge variant="success">⭐ Featured</FeaturedBadge>
                    )}
                  </ProjectImageContainer>

                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <ProjectTech>
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <TechTag key={techIndex}>{tech}</TechTag>
                      ))}
                      {project.technologies.length > 3 && (
                        <TechTag>+{project.technologies.length - 3} more</TechTag>
                      )}
                    </ProjectTech>
                    <ProjectActions>
                      <ActionButton variant="primary" size="sm">
                        View Details
                      </ActionButton>
                      <ActionButton 
                        as="a" 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        variant="outline" 
                        size="sm"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        📂 Code
                      </ActionButton>
                    </ProjectActions>
                  </ProjectContent>
                  </ProjectCard>
                  </motion.div>
                </StaggerItem>
                  ))}
                </AnimatePresence>
              </ProjectsGrid>
            </StaggerContainer>
          )}

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-16)', 
                color: 'var(--dark-400)' 
              }}
            >
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>
                No projects found
              </h3>
              <p>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </Container>
      </Section>

      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </PageTransition>
  );
};

export default Projects;
