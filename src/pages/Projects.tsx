import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section, Grid, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import PageTransition from '../components/PageTransition';

// Import project images
import invisioVaultDesktopImg from '../assets/images/InvisioVault_Suit.webp';
import invisioVaultWebImg from '../assets/images/InvisioVault.webp';
import barLogoImg from '../assets/images/BAR_logo.webp';
import sortifyImg from '../assets/images/Sortify.webp';
import ytDownloaderImg from '../assets/images/YT.webp';
import linkNestImg from '../assets/images/LN.webp';
import contactManagerImg from '../assets/images/Contact_Manager.webp';

// ── Case study styled components ───────────────────────────────────────────

const CaseStudyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
`;

const CaseStudyCard = styled.div<{ $accentColor: string }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.$accentColor}33;
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$accentColor};
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  @media (max-width: 640px) {
    padding: var(--spacing-4);
  }
`;

const CaseStudyLabel = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${props => props.$color};
  margin-bottom: var(--spacing-3);

  span.icon {
    font-size: 0.9rem;
  }
`;

const CaseStudyText = styled.p`
  color: var(--dark-300);
  font-size: clamp(0.85rem, 1.3vw, 0.95rem);
  line-height: 1.7;
  margin: 0;
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  margin: var(--spacing-6) 0;
`;

const ModalImageBanner = styled.div`
  /* Full-width, flush with the modal's rounded top edge */
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  flex-shrink: 0;
  /* Dark placeholder prevents the white flash while the image decodes */
  background: #0a0f1e;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block; /* kills inline baseline gap */
  }

  /* Fade bottom into modal background */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 35%, rgba(15, 23, 42, 0.95) 100%);
  }

  @media (max-width: 768px) {
    height: 170px;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  @media (max-width: 640px) {
    height: 150px;
    border-radius: 0;
  }
`;

const ProjectsHero = styled(Section)`
  padding-top: 140px;
  padding-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding-top: 120px;
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

const FilterButton = styled(motion.button) <{ $active: boolean }>`
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
  
  ${props => props.$active ? `
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

const ProjectImageContainer = styled.div<{ $bgColor: string }>`
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  background: ${props => props.$bgColor};
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
  /*
   * No backdrop-filter and no will-change here.
   * will-change: transform on a full-screen fixed layer forces the browser
   * to composite a 100vw×100vh GPU surface that must be repainted on every
   * scroll frame — the exact cause of the scroll jank.
   * The compositing boundary lives on ModalContent (translateZ(0)) instead,
   * so only the card area is promoted, not the entire viewport.
   */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
  overflow: hidden;

  @media (max-width: 768px) {
    background: rgba(0, 0, 0, 0.92);
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    padding: 0;
  }

  /* Respect OS reduced-motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg,
    rgba(30, 41, 59, 0.98) 0%,
    rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: var(--radius-2xl);
  padding: 0;
  max-width: 900px;
  width: 100%;
  position: relative;
  overflow: hidden;
  /*
   * backface-visibility: hidden + will-change: transform create a GPU
   * compositing boundary scoped to just this card. Framer Motion safely
   * overrides the transform property with its animated value, so there
   * is no conflict. DO NOT set transform here — Framer Motion owns it.
   */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(100, 255, 218, 0.1),
    inset 0  0  0   1px rgba(0, 0, 0, 0.6),
    inset 0  0  30px 4px rgba(0, 0, 0, 0.45),
    inset 0  1px 0   0   rgba(255, 255, 255, 0.08);

  /* Corner-blur overlay — sits on top of everything, pointers pass through */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 9998;
    background:
      radial-gradient(ellipse 60px 60px at top right,    rgba(9,9,11,0.55) 0%, transparent 100%),
      radial-gradient(ellipse 60px 60px at top left,     rgba(9,9,11,0.35) 0%, transparent 100%),
      radial-gradient(ellipse 60px 60px at bottom right, rgba(9,9,11,0.25) 0%, transparent 100%),
      radial-gradient(ellipse 60px 60px at bottom left,  rgba(9,9,11,0.25) 0%, transparent 100%);
  }

  @media (max-width: 1024px) {
    max-width: 95vw;
  }

  @media (max-width: 768px) {
    max-width: 90vw;
    border-radius: var(--radius-xl);
    /* Lighter shadow stack on mobile */
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(100, 255, 218, 0.12),
      inset 0 0 0 1px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 640px) {
    max-width: 100vw;
    border-radius: 0;
    border: none;
  }

  /* Zero transforms for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    animation: none !important;
  }
`;

/* Scroll container — nested inside ModalContent so border-radius isn't broken */
const ModalScroller = styled.div`
  overflow-y: auto;
  max-height: 90vh;
  border-radius: inherit;
  /* Prevent scroll chaining to the page on ALL browsers incl. Chrome Android */
  overscroll-behavior: contain;
  /* Allow vertical touch scrolling inside; block horizontal to avoid page swipe */
  touch-action: pan-y;
  /*
   * will-change: scroll-position tells the compositor this element scrolls,
   * letting it pre-promote the scroll layer and skip main-thread work.
   * contain: layout style isolates layout recalculation to this subtree only,
   * preventing scroll from triggering reflows in the rest of the document.
   */
  will-change: scroll-position;
  contain: layout style;

  /* Custom slim scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 255, 218, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 255, 218, 0.25);
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 255, 218, 0.45);
  }

  @media (max-width: 768px) {
    max-height: 85vh;
  }

  @media (max-width: 640px) {
    max-height: 100vh;
  }

  @media (max-height: 600px) {
    max-height: 95vh;
  }
`;

/* Inner padded wrapper — sits below the image banner */
const ModalBody = styled.div`
  padding: var(--spacing-6) var(--spacing-8) var(--spacing-8);

  @media (max-width: 1024px) {
    padding: var(--spacing-5) var(--spacing-6) var(--spacing-6);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-4) var(--spacing-5) var(--spacing-5);
  }

  @media (max-width: 640px) {
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
  /* No backdrop-filter — would be a third composited layer inside the modal */
  
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

// ── Project Data ────────────────────────────────────────────────────────────
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  caseStudy: {
    problem: string;
    solution: string;
    impact: string;
    learnings: string;
  };
  technologies: string[];
  github: string;
  download?: string;
  liveDemo?: string;
  featured: boolean;
  icon: string;
  bgColor: string;
  image?: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'InvisioVault_R',
    category: 'Desktop Application',
    description: 'Advanced file steganography software with AES-256 encryption. Hide confidential files, documents, photos, and videos inside images (PNG, JPG, BMP). Free desktop app with batch processing for Windows.',
    longDescription: 'InvisioVault_R is a powerful desktop steganography application that combines military-grade AES-256 encryption with advanced file hiding technology.\n\nThis free Windows software lets you securely hide any file type - PDFs, documents, photos, videos, or entire folders - inside ordinary-looking images without detection. Perfect for privacy-conscious users, security professionals, and anyone needing secure file storage.\n\nFeatures include batch processing for multiple files, support for PNG/JPG/BMP image formats, password protection, and a clean intuitive interface. Built with Python and advanced cryptography libraries for maximum security.',
    caseStudy: {
      problem: 'Users needed a reliable way to share or store sensitive files without exposing their existence. Conventional encryption makes files obviously suspicious to observers.',
      solution: 'Built a desktop steganography tool combining AES-256 encryption with LSB image embedding, so secret files are hidden inside ordinary-looking images. Batch processing and a clean GUI make it accessible to non-technical users.',
      impact: 'Distributed to privacy-conscious users and security researchers. Downloaded dozens of times via GitHub Releases. Zero reported security vulnerabilities since launch.',
      learnings: 'Alpha versions used simple XOR — the jump to AES-256 revealed how much key-derivation matters. Would add PBKDF2 stretching from day one next time, and include automated integration tests for the steganography pipeline.'
    },
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
    caseStudy: {
      problem: 'Journalists and lawyers handle time-critical confidential documents that must be provably destroyed after reading. No user-friendly offline tool existed that combined strong encryption with guaranteed deletion.',
      solution: 'Architected a fully offline PyQt5 desktop app with AES-256-GCM encryption, PBKDF2 key derivation, and a timed self-destruct mechanism. All cryptographic operations run entirely on the local machine with zero network calls.',
      impact: 'Available as a standalone .exe requiring no installation. Actively used by privacy-focused professionals. Achieved zero-cloud architecture, meaning data never leaves the user\'s machine.',
      learnings: 'Secure deletion on SSDs is harder than HDDs due to wear-levelling. Future version would overwrite file contents multiple times before unlinking. Also learned the value of threat-modelling before writing a single line of crypto code.'
    },
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
    caseStudy: {
      problem: 'Most Windows users accumulate chaotic downloads folders with thousands of unsorted files across dozens of types. Manual organisation is tedious and error-prone.',
      solution: 'Built a rule-based automatic organiser using Python\'s os and shutil modules. Files are categorised by extension, then moved into clearly named sub-folders. Includes duplicate detection and one-click undo.',
      impact: 'Released as a Windows Installer (.exe). Sorts 1,000+ files in under 3 seconds in benchmarks. Actively downloaded by students and freelancers managing large asset libraries.',
      learnings: 'Edge cases (files with no extension, locked files, symlinks) caused early-version crashes. Learned to wrap all I/O in try/except and to validate paths before any operation. Would add a dry-run preview mode in v2.'
    },
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
    caseStudy: {
      problem: 'The desktop InvisioVault required installation and was Windows-only. Users needed a browser-based version that works everywhere — and the ability to create polyglot files (e.g., a PNG that is simultaneously a valid ZIP).',
      solution: 'Built a full-stack web app with a React frontend and Flask backend deployed on Vercel. The polyglot engine concatenates binary file headers to create dual-format files, while the steganography engine handles the image embedding server-side.',
      impact: 'Live at invisio-vault.vercel.app — accessible from any browser, no installation needed. Users from multiple countries have tested both features. Received positive feedback for the steganography demo flow.',
      learnings: 'Handling binary Blob uploads through a REST API was trickier than expected — learned to use multipart/form-data properly. Would add end-to-end encryption in the browser (Web Crypto API) so the server never sees plaintext files.'
    },
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
    caseStudy: {
      problem: 'Existing YouTube download sites are riddled with ads, require browser extensions, or silently install malware. Users wanted a clean, privacy-respecting alternative.',
      solution: 'Wrapped yt-dlp in a Node.js/Express API and paired it with a clean Material-UI React frontend. Users paste a URL, select format and quality, and the backend streams the file directly — no data stored server-side.',
      impact: 'Hosted on Render and actively used. Handles 1080p, 720p, 480p video and MP3 audio extraction. Zero ads, zero tracking, zero stored data. Download times average under 10 seconds for standard videos.',
      learnings: 'Render\'s free tier has cold-start delays. Learned to warm up the server with a health-check ping on page load. Would implement a job queue (Bull/Redis) for concurrent download management in a production version.'
    },
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
    caseStudy: {
      problem: 'Users with motor disabilities or RSI injuries struggle with conventional mouse/keyboard input. Affordable head-tracking hardware is often inaccessible or overly complex to set up.',
      solution: 'Leveraged MediaPipe\'s facial landmark detection to map head pitch/yaw angles to screen coordinates in real-time via a Flask backend. A lightweight JavaScript frontend handles cursor positioning and gesture-based clicking at <50ms latency.',
      impact: 'Enables fully hands-free mouse control using any standard webcam. Tested with users who reported significantly reduced physical strain. Open-source and free — no hardware purchase required.',
      learnings: 'Lighting conditions dramatically affect landmark detection accuracy. Would add adaptive brightness preprocessing and allow users to calibrate sensitivity per-session. Also learned that smooth cursor interpolation (lerp) is critical for usability.'
    },
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
    caseStudy: {
      problem: 'Generic portfolio templates look identical and fail to communicate a developer\'s actual personality or technical depth. Recruiters spend under 10 seconds on a portfolio before deciding.',
      solution: 'Designed and built a custom React + TypeScript portfolio from scratch with Framer Motion page transitions, an accessibility-first component hierarchy, SEO-optimised metadata, and performance budgets enforced via Vite build analysis.',
      impact: 'Achieves 95+ Lighthouse scores across Performance, Accessibility, and SEO. Hosted on Netlify with CI/CD on every commit. Features 9 live project showcases, responsive to all screen sizes.',
      learnings: 'Animation and accessibility are often in tension — learned to respect prefers-reduced-motion from day one. Also discovered that CSS-in-JS (styled-components) adds non-trivial runtime overhead; would evaluate Tailwind + CSS Modules next time.'
    },
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
    caseStudy: {
      problem: 'Native Android contact apps are locked to the phone\'s ecosystem and lack features like file attachments, rich notes, or offline web access. Users wanted a cross-platform alternative they actually own.',
      solution: 'Built a Progressive Web App with a React + TypeScript frontend and Tailwind CSS, published simultaneously as an Android APK via Capacitor. Local storage with JSON export/import ensures users control their data entirely.',
      impact: 'Available as a web app (contact-manager-rnr.vercel.app) and an installable Android APK. Features advanced search, tag filtering, file attachments, and dark mode. Used by early testers across Android and desktop browsers.',
      learnings: 'PWA caching strategies are nuanced — a bad service worker can serve stale data indefinitely. Learned to implement a network-first cache strategy for dynamic content. Would add end-to-end encrypted cloud sync as an opt-in feature in v2.'
    },
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
    caseStudy: {
      problem: 'Cloud-based bookmarking tools (Pocket, Raindrop.io) require accounts, phone home constantly, and delete your data if you stop paying. Users wanted a truly private, offline-first alternative.',
      solution: 'Built a Flutter mobile app with a local SQLite database, full-text search, category/tag organisation, and document attachment support. All data lives exclusively on the device — no network permission required.',
      impact: 'Released as LinkNest v2.0 APK. Supports Android and iOS. Organises thousands of links and documents with instant search. Zero internet permission declared — verifiable privacy by design.',
      learnings: 'Flutter\'s cross-platform promise is mostly true but platform-specific file picker behaviour required separate implementations for Android and iOS. Would prioritise a unified abstraction layer earlier in the project lifecycle to avoid late-stage rewrites.'
    },
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
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const caseStudySections = [
  { key: 'problem',   label: 'Problem',   icon: '🎯', color: '#f87171' },
  { key: 'solution',  label: 'Solution',  icon: '💡', color: '#60a5fa' },
  { key: 'impact',    label: 'Impact',    icon: '📈', color: '#34d399' },
  { key: 'learnings', label: 'Learnings', icon: '🧠', color: '#a78bfa' },
] as const;

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll — position:fixed technique works on iOS Safari where overflow:hidden is ignored
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    // Lock scroll on both html and body — covers all browsers including modern iOS Safari
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && project && (
      <ModalOverlay
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <CloseButton onClick={onClose} aria-label="Close">×</CloseButton>

          <ModalScroller>
          {project.image && (
            <ModalImageBanner>
              {/*
               * loading="eager" — the image is fetched immediately when the
               * modal opens; lazy loading would defer the network request until
               * the element enters the viewport, which is what caused the flash.
               * decoding="async" lets the browser decode off the main thread so
               * the modal animation stays smooth.
               */}
              <img
                src={project.image}
                alt={project.title}
                loading="eager"
                decoding="async"
              />
            </ModalImageBanner>
          )}

          {/* All content below the banner */}
          <ModalBody>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-5)' }}>
              <div style={{
                fontSize: 'var(--text-2xl)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-xl)',
                minWidth: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {project.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ModalTitle>{project.title}</ModalTitle>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--spacing-1)' }}>
                  <Badge variant="info">{project.category}</Badge>
                  {project.featured && <Badge variant="success">⭐ Featured</Badge>}
                </div>
              </div>
            </div>

            {/* Short description */}
            <ModalDescription>{project.description}</ModalDescription>

            <SectionDivider />

            {/* Case study sections */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{
                color: 'var(--dark-100)',
                fontSize: '0.7rem',
                fontWeight: 'var(--font-bold)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 'var(--spacing-4)',
                opacity: 0.6
              }}>Case Study</h4>

              <CaseStudyGrid>
                {caseStudySections.map(({ key, label, icon, color }) => (
                  <CaseStudyCard key={key} $accentColor={color}>
                    <CaseStudyLabel $color={color}>
                      <span className="icon">{icon}</span>
                      {label}
                    </CaseStudyLabel>
                    <CaseStudyText>{project.caseStudy[key]}</CaseStudyText>
                  </CaseStudyCard>
                ))}
              </CaseStudyGrid>
            </div>

            <SectionDivider />

            {/* Tech stack */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{
                color: 'var(--dark-100)',
                fontSize: '0.7rem',
                fontWeight: 'var(--font-bold)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 'var(--spacing-3)',
                opacity: 0.6
              }}>Tech Stack</h4>
              <ModalTech>
                {project.technologies.map((tech: string) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </ModalTech>
            </div>

            {/* Actions */}
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
          </ModalBody>
          </ModalScroller>
        </ModalContent>
      </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      return selectedCategory === 'All' || project.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <PageTransition>
      <SEO
        title="Projects - Rolan Lobo (Rolan RNR) | Steganography, Security Tools & Web Apps"
        description="Explore my portfolio of innovative software projects: InvisioVault (steganography & polyglot files), YT-Downloader (free YouTube video & audio downloader), BAR (secure file management), Sortify, and more full-stack web/desktop applications."
        keywords="Steganography, Polyglot Files, Hide Files in Images, YouTube Downloader, Video Downloader, YouTube to MP3, File Encryption, Security Tools, InvisioVault, BAR, Sortify, React Projects, Python Projects, Flask, Full Stack Developer, Rolan Lobo, Rolan RNR"
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
                $active={selectedCategory === category}
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
            {(
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
                    <ProjectImageContainer $bgColor={project.bgColor} className="project-image">
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
                        {project.technologies.slice(0, 4).map((tech: string) => (
                          <TechTag key={tech}>{tech}</TechTag>
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
