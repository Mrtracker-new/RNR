import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section, Grid, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import PageTransition from '../components/PageTransition';

// Import project images
import invisioVaultDesktopImg from '../assets/images/InvisioVault_Suit.png';
import invisioVaultWebImg from '../assets/images/InvisioVault.png';
import barLogoImg from '../assets/images/BAR_logo.png';
import sortifyImg from '../assets/images/Sortify.jpg';
import ytDownloaderImg from '../assets/images/YT.png';
import linkNestImg from '../assets/images/LN.png';
import contactManagerImg from '../assets/images/Contact_Manager.png';

const ProjectsHero = styled(Section)`
  padding-top: 100px;
  padding-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding-top: 80px;
    padding-bottom: 20px;
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
  margin: 0 auto var(--spacing-10);
  line-height: 1.7;
`;

const FilterSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button) <{ active: boolean }>`
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
  
  ${props => props.active ? `
    background: var(--accent-gradient);
    color: var(--dark-950);
    border: 1px solid transparent;
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
  ` : `
    background: rgba(30, 41, 59, 0.3);
    color: var(--dark-300);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    
    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: rgba(30, 41, 59, 0.5);
      transform: translateY(-2px);
    }
  `}
`;

const ProjectsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-8);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(30, 41, 59, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: border-color 0.3s ease;
  
  /* Hover State for Card */
  &:hover {
    border-color: rgba(100, 255, 218, 0.3);
    
    .project-image {
      transform: scale(1.05);
    }
    
    .project-overlay {
      opacity: 1;
    }
  }
`;

const ProjectImageContainer = styled.div<{ bgColor: string }>`
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 100%);
    opacity: 0.6;
  }
`;

const ProjectContent = styled.div`
  padding: var(--spacing-6);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-50);
  margin-bottom: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  a {
    transition: color 0.3s ease;
    &:hover {
      color: var(--accent-primary);
    }
  }
`;

const ProjectDescription = styled.p`
  color: var(--dark-300);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: var(--spacing-6);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  margin-bottom: var(--spacing-6);
`;

const TechTag = styled.span`
  font-size: 0.75rem;
  color: var(--dark-200);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    color: var(--accent-primary);
    background: rgba(100, 255, 218, 0.1);
    border-color: rgba(100, 255, 218, 0.2);
  }
`;

const ProjectActions = styled.div`
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-2);
`;

const ActionButton = styled.a<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  ${props => props.variant === 'primary' && `
    background: var(--accent-gradient);
    color: var(--dark-950);
    box-shadow: 0 4px 14px rgba(100, 255, 218, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(100, 255, 218, 0.3);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: rgba(255, 255, 255, 0.05);
    color: var(--dark-100);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--dark-100);
      transform: translateY(-2px);
    }
  `}
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
  overflow-y: auto;
  
  @media (max-width: 640px) {
    align-items: flex-start;
    padding: 0;
  }
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.98) 0%, 
    rgba(15, 23, 42, 0.98) 100%);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(100, 255, 218, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  @media (max-width: 1024px) {
    max-width: 95vw;
    padding: var(--spacing-6);
  }
  
  @media (max-width: 768px) {
    max-width: 90vw;
    padding: var(--spacing-5);
    max-height: 85vh;
    border-radius: var(--radius-xl);
  }
  
  @media (max-width: 640px) {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    border: none;
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
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  color: var(--dark-50);
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-bold);
  letter-spacing: -0.025em;
  line-height: 1.2;
`;

const ModalDescription = styled.p`
  color: var(--dark-300);
  line-height: 1.8; /* Increased line-height for better readability */
  margin-bottom: var(--spacing-6);
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  white-space: pre-line; /* Allows newline characters to create paragraphs */
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

/* ... existing code ... */

// Project Data
const projectsData = [
  {
    id: 1,
    title: 'InvisioVault_R',
    category: 'Desktop Application',
    description: 'Advanced file steganography software with AES-256 encryption. Hide confidential files, documents, photos, and videos inside images (PNG, JPG, BMP). Free desktop app with batch processing for Windows.',
    longDescription: 'InvisioVault_R is a powerful desktop steganography application that combines military-grade AES-256 encryption with advanced file hiding technology.\n\nThis free Windows software lets you securely hide any file type - PDFs, documents, photos, videos, or entire folders - inside ordinary-looking images without detection. Perfect for privacy-conscious users, security professionals, and anyone needing secure file storage.\n\nFeatures include batch processing for multiple files, support for PNG/JPG/BMP image formats, password protection, and a clean intuitive interface. Built with Python and advanced cryptography libraries for maximum security.',
    technologies: ['Python', 'Pillow (PIL)', 'AES-256', 'Cryptography', 'Steganography'],
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
    description: 'Secure file encryption software with self-destruct feature. Offline desktop app with AES-256-GCM encryption, password protection, and automatic file destruction. Perfect for confidential document management.',
    longDescription: 'BAR (Burn After Reading) is an advanced secure file management application designed for maximum privacy and security. This offline-only desktop software features military-grade AES-256-GCM encryption, PBKDF2 key derivation, and unique self-destruction capabilities that automatically delete sensitive files after reading.\n\nIdeal for journalists, lawyers, security professionals, and privacy advocates who handle confidential documents. All operations are performed locally with zero cloud dependency, ensuring your sensitive data never leaves your computer.\n\nFeatures include: timed file deletion, secure password hashing, encrypted storage, intuitive PyQt5 interface, and complete offline functionality.',
    technologies: ['Python', 'PyQt5', 'AES-256-GCM', 'PBKDF2', 'Cryptography'],
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
    description: 'Automatic file organizer and manager for Windows. Smart desktop software that sorts and organizes files by type, date, and format. Clean cluttered folders instantly with one-click file organization.',
    longDescription: 'Sortify is an intelligent automatic file organization software that transforms chaotic folders into perfectly organized file systems. This smart Windows desktop application automatically sorts files by type (documents, images, videos, music), date, size, and custom categories.\n\nPerfect for professionals, students, and anyone struggling with messy downloads folders or disorganized file systems. Features include: one-click automatic sorting, custom organization rules, batch file processing, duplicate file detection, safe file handling with undo support, and lightning-fast performance.\n\nWhether you have thousands of downloads, photos, or documents, Sortify cleans and organizes everything in seconds.',
    technologies: ['Python', 'File Management', 'OS', 'shutil', 'Automation'],
    github: 'https://github.com/Mrtracker-new/Sortify',
    download: 'https://github.com/Mrtracker-new/Sortify/releases/download/v1.0/Sortify_Setup.exe',
    featured: true,
    icon: '📁',
    bgColor: '#000000',
    image: sortifyImg
  },
  {
    id: 4,
    title: 'InvisioVault',
    category: 'Web Application',
    description: 'Hide anything inside images, or create wild dual-format polyglot files — all in a slick React + Flask app. 🔐✨',
    longDescription: 'InvisioVault is your secret-keeping Swiss Army knife! Hide files in images like a digital magician using steganography, OR go full inception mode with polyglot files that work as TWO formats at once.\n\nBuilt with a slick React frontend and Flask backend because we\'re fancy like that. 🎩✨',
    technologies: ['React', 'Flask', 'Python', 'Steganography', 'AES-256', 'Polyglot Files'],
    github: 'https://github.com/Mrtracker-new/InvisioVault',
    liveDemo: 'https://invisio-vault.vercel.app/',
    featured: false,
    icon: '🌐',
    bgColor: '#000000',
    image: invisioVaultWebImg
  },
  {
    id: 5,
    title: 'YT-Downloader',
    category: 'Web Application',
    description: 'Free YouTube video downloader - Download YouTube videos in HD quality or extract MP3 audio. Fast, simple, and ad-free using React, Node.js, and yt-dlp.',
    longDescription: 'YT-Downloader is a powerful full-stack web application for downloading YouTube videos and audio in multiple formats and quality options. Built with React, Node.js, Express, and yt-dlp, this free online tool lets you download HD videos (1080p, 720p, 480p) or extract high-quality MP3 audio from YouTube videos instantly. Features a clean Material-UI interface, fast processing, no ads, and complete privacy - your downloads are processed securely without storing any data.',
    technologies: ['React', 'Node.js', 'Express', 'yt-dlp', 'Material-UI'],
    github: 'https://github.com/Mrtracker-new/YT-Downloader',
    liveDemo: 'https://yt-rnr.onrender.com/',
    featured: false,
    icon: '📺',
    bgColor: '#000000',
    image: ytDownloaderImg
  },
  {
    id: 6,
    title: 'CursorCam',
    category: 'Web Application',
    description: 'Hands-free mouse control using facial recognition. Accessibility software that controls your computer mouse with head movements via webcam. AI-powered assistive technology for accessible computing.',
    longDescription: 'CursorCam is an innovative accessibility application that enables hands-free computer control using facial recognition technology. This AI-powered assistive software transforms your laptop webcam into a mouse controller by tracking head movements and facial gestures. Perfect for users with mobility impairments, RSI (Repetitive Strain Injury), or anyone seeking alternative computer interaction methods. Built with computer vision and machine learning, CursorCam offers: real-time facial tracking, customizable sensitivity settings, gesture-based clicking, user profile calibration, smooth cursor movement, low latency response, and cross-platform compatibility. Features advanced Flask backend with JavaScript frontend for seamless performance. Ideal for accessibility needs, hands-free presentations, or innovative human-computer interaction. Free assistive technology that makes computing accessible to everyone.',
    technologies: ['Python', 'Flask', 'JavaScript', 'Computer Vision', 'AI', 'Facial Recognition'],
    github: 'https://github.com/Mrtracker-new/CursorCam',
    featured: false,
    icon: '👁️',
    bgColor: '#000000'
  },
  {
    id: 7,
    title: 'RNR Portfolio',
    category: 'Web Application',
    description: 'Modern developer portfolio website built with React and Framer Motion. Responsive web design showcasing projects, skills, and experience with smooth animations and SEO optimization.',
    longDescription: 'RNR Portfolio is a professional full-stack developer portfolio website built with modern web technologies. This responsive, mobile-first portfolio showcases software projects, technical skills, and professional experience with stunning animations and optimized performance. Features include: React-based single-page application (SPA), smooth page transitions with Framer Motion, styled-components for modern CSS-in-JS styling, SEO-optimized with React Helmet, responsive design for all devices, fast loading times with code splitting, integrated contact form with Netlify Forms, dark theme design, and accessibility-focused UI. Perfect example of modern web development best practices including performance optimization, semantic HTML, and user experience design. Hosted on Netlify with continuous deployment. View source code to learn React, TypeScript, and modern frontend development patterns.',
    technologies: ['React', 'TypeScript', 'Styled-Components', 'Framer Motion', 'SEO', 'Netlify'],
    github: 'https://github.com/Mrtracker-new/RNR',
    featured: false,
    icon: '💼',
    bgColor: '#000000'
  },
  {
    id: 8,
    title: 'Contact-Manager',
    category: 'Android App',
    description: 'Free contact management app for Android. Organize contacts with notes, files, and links. Clean, responsive contact manager with search, edit, and backup features. APK available for download.',
    longDescription: 'Contact Manager is a modern, feature-rich contact management application for Android and web. This free app helps you organize personal and professional contacts with advanced features beyond basic phone contacts. Store detailed contact information, attach files and documents, add notes and reminders, save useful links, and efficiently search through your contacts. Built with TypeScript and Tailwind CSS for a clean, responsive, and fast user interface. Features include: add/edit/delete contacts, advanced search and filtering, attach multiple files per contact, rich text notes, categorization with tags, favorites system, dark mode support, local storage with export/import, and cross-platform support (Android APK + Web). Perfect for professionals, entrepreneurs, and anyone needing robust contact organization. Download the free Android APK or use the web version online.',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Progressive Web App', 'Android'],
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
    description: 'LinkNest is your personal knowledge vault that lives entirely on your device. Organize links, documents, and notes with categories, tags, and search. Free offline-first digital resource manager APK.',
    longDescription: 'LinkNest is your personal knowledge vault that lives entirely on your device. No cloud sync to betray your secrets, no subscription fees to drain your wallet, no "oops we got hacked" emails. Just you, your data, and sweet, sweet privacy. 🔒',
    technologies: ['Flutter', 'Dart', 'C++', 'Android', 'iOS'],
    github: 'https://github.com/Mrtracker-new/LinkNest',
    download: 'https://github.com/Mrtracker-new/LinkNest/releases/download/v2.0/LinkNest-v2.0.apk',
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
      return selectedCategory === 'All' || project.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <PageTransition>
      <SEO
        title="Projects - Rolan Lobo Portfolio | Steganography, Security Tools & Web Apps"
        description="Explore my portfolio of innovative software projects: InvisioVault (steganography & polyglot files), YT-Downloader (free YouTube video & audio downloader), BAR (secure file management), Sortify, and more full-stack web/desktop applications."
        keywords="Steganography, Polyglot Files, Hide Files in Images, YouTube Downloader, Video Downloader, YouTube to MP3, File Encryption, Security Tools, InvisioVault, BAR, Sortify, React Projects, Python Projects, Flask, Full Stack Developer, Rolan Lobo"
        url="https://rolan-rnr.netlify.app/projects"
      />
      <ProjectsHero>
        <Container>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Projects
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A curated showcase of applications, tools, and experiments.
            <br />
            Built with a focus on performance, security, and user experience.
          </HeroSubtitle>

          <FilterSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {categories.map((category) => (
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
        </Container>
      </ProjectsHero>

      <Section style={{ paddingTop: 0 }}>
        <Container>
          <AnimatePresence mode="wait">
            {!isLoading && (
              <ProjectsGrid
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={selectedCategory} // Force re-render on category change for stagger effect
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                  >
                    <ProjectImageContainer bgColor={project.bgColor} className="project-image">
                      {project.image ? (
                        <OptimizedImage
                          src={project.image}
                          alt={project.title}
                          width="100%"
                          height="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ fontSize: '4rem' }}>{project.icon}</div>
                      )}
                    </ProjectImageContainer>

                    <ProjectContent>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>{project.description}</ProjectDescription>

                      <ProjectTech>
                        {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                          <TechTag key={i}>{tech}</TechTag>
                        ))}
                        {project.technologies.length > 4 && (
                          <TechTag>+{project.technologies.length - 4}</TechTag>
                        )}
                      </ProjectTech>

                      <ProjectActions>
                        <ActionButton
                          as="a"
                          href={project.github}
                          target="_blank"
                          variant="secondary"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          GitHub
                        </ActionButton>
                        {project.liveDemo && (
                          <ActionButton
                            as="a"
                            href={project.liveDemo}
                            target="_blank"
                            variant="primary"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            Live Demo
                          </ActionButton>
                        )}
                        {!project.liveDemo && project.download && (
                          <ActionButton
                            as="a"
                            href={project.download}
                            target="_blank"
                            variant="primary"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            Download
                          </ActionButton>
                        )}
                      </ProjectActions>
                    </ProjectContent>
                  </ProjectCard>
                ))}
              </ProjectsGrid>
            )}
          </AnimatePresence>
        </Container>
      </Section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageTransition>
  );
};

export default Projects;
