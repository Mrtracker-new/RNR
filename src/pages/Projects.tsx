import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section, Grid, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';



// Import project images
import invisioVaultDesktopImg from '../assets/images/InvisioVault_Suit.webp';
import invisioVaultWebImg from '../assets/images/InvisioVault.webp';
import barLogoImg from '../assets/images/BAR_logo.webp';
import barWebImg from '../assets/images/BAR_web.webp';
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
  achievementStatement?: string;
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
    description: 'Hides any file — documents, videos, entire folders — inside ordinary PNG or JPG images using AES-256 encryption and LSB steganography. Zero detectable metadata change. Zero cloud dependency. Free, open-source Windows desktop app.',
    longDescription: 'InvisioVault_R hides any file — documents, videos, or entire folders — inside ordinary PNG, JPG, or BMP images using AES-256 encryption and LSB steganography. The carrier image shows no detectable metadata change. No cloud upload, no account, no trace.\n\nBuilt when I realised no free, trustworthy tool existed for this exact problem. Features batch processing for multiple files, password-protected extraction, and a clean GUI accessible to non-technical users.\n\nBuilt with Python and the Cryptography library. Open-source under MIT licence.',
    caseStudy: {
      problem: 'Users needed a reliable way to share or store sensitive files without exposing their existence. Conventional encryption makes files obviously suspicious to observers — a locked container announces that something is hidden.',
      solution: 'Built a desktop steganography tool combining AES-256 encryption with LSB image embedding, so secret files are hidden inside ordinary-looking images with no visible change. Batch processing and a clean GUI make it accessible to non-technical users.',
      impact: 'Available on GitHub Releases. Zero reported security vulnerabilities since launch. Maintains zero cloud dependency — all operations are fully offline.',
      learnings: 'Alpha versions used simple XOR — the jump to AES-256 revealed how much key-derivation matters. Would add PBKDF2 stretching from day one next time, and include automated integration tests for the steganography pipeline.'
    },
    technologies: ['Python', 'Pillow (PIL)', 'AES-256', 'Cryptography', 'Steganography'],
    github: 'https://github.com/Mrtracker-new/InvisioVault_R',
    download: 'https://github.com/Mrtracker-new/InvisioVault_R/releases/',
    featured: true,
    icon: '🔒',
    bgColor: '#0a0f1e',
    image: invisioVaultDesktopImg
  },
  {
    id: 2,
    title: 'BAR — Desktop',
    category: 'Desktop Application',
    description: 'Offline desktop app for professionals handling time-sensitive confidential documents. AES-256-GCM encryption + PBKDF2 key derivation + timed self-destruct. No installation, no cloud, no trace.',
    longDescription: 'BAR (Burn After Reading) is a fully offline desktop application built for journalists, legal professionals, and anyone who needs to share a secret that expires.\n\nFiles are encrypted with AES-256-GCM and a PBKDF2-derived key. Each file can be set to self-destruct after a configurable time limit — after which the content is overwritten and deleted. No cloud component, no network calls, no installation required (ships as a standalone .exe).\n\nBuilt with Python and PyQt5. All cryptographic operations run locally.',
    caseStudy: {
      problem: 'Journalists and lawyers handle time-critical confidential documents that must be provably destroyed after reading. No user-friendly offline tool existed that combined strong encryption with guaranteed deletion.',
      solution: 'Architected a fully offline PyQt5 desktop app with AES-256-GCM encryption, PBKDF2 key derivation, and a timed self-destruct mechanism. All cryptographic operations run entirely on the local machine with zero network calls.',
      impact: 'Available as a standalone .exe requiring no installation. Achieves a fully zero-cloud architecture — data never leaves the local machine at any point in its lifecycle.',
      learnings: 'Secure deletion on SSDs is harder than HDDs due to wear-levelling. Future version would overwrite file contents multiple times before unlinking. Also learned the value of threat-modelling before writing a single line of crypto code.'
    },
    technologies: ['Python', 'PyQt5', 'AES-256-GCM', 'PBKDF2', 'Cryptography'],
    github: 'https://github.com/Mrtracker-new/BAR',
    download: 'https://github.com/Mrtracker-new/BAR/releases/download/v1.0/BAR.exe',
    featured: true,
    icon: '🔥',
    bgColor: '#0a0a0a',
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
    title: 'InvisioVault — Web',
    category: 'Web Application',
    description: 'Browser-based steganography and polyglot file tool. Hide files inside images via LSB embedding, or generate dual-format polyglot files — a PNG that is simultaneously a valid ZIP. No installation. Works on any device.',
    longDescription: 'InvisioVault Web is the browser-based counterpart to the desktop app. Built with a React frontend and Flask backend deployed on Vercel, it offers two distinct capabilities: LSB steganography to embed files inside PNG/JPG images server-side, and a polyglot file engine that concatenates binary headers to produce files valid in two formats simultaneously (e.g., a PNG that is also a ZIP archive).\n\nNo installation required. Accessible from any device with a browser.',
    caseStudy: {
      problem: 'The desktop InvisioVault required installation and was Windows-only. Users needed a browser-based version that works everywhere — and the ability to create polyglot files (e.g., a PNG that is simultaneously a valid ZIP).',
      solution: 'Built a full-stack web app with a React frontend and Flask backend deployed on Vercel. The polyglot engine concatenates binary file headers to create dual-format files, while the steganography engine handles the image embedding server-side.',
      impact: 'Live at invisio-vault.vercel.app — accessible from any browser, no installation needed. Serves users across multiple countries. Demonstrates both steganography and polyglot file generation in a single interface.',
      learnings: 'Handling binary Blob uploads through a REST API was trickier than expected — learned to use multipart/form-data correctly. Would add end-to-end encryption in the browser (Web Crypto API) so the server never sees plaintext files.'
    },
    technologies: ['React', 'Flask', 'Python', 'Steganography', 'AES-256', 'Polyglot Files'],
    github: 'https://github.com/Mrtracker-new/InvisioVault',
    liveDemo: 'https://invisio-vault.vercel.app/',
    featured: false,
    icon: '🌐',
    bgColor: '#0a0f1e',
    image: invisioVaultWebImg
  },
  {
    id: 5,
    title: 'YT-Downloader',
    category: 'Web Application',
    description: 'Full-stack tool for streaming binary media data through an Express API. Wraps yt-dlp to handle format conversion and quality selection, with zero server-side storage and direct browser streaming.',
    longDescription: 'A full-stack web application exploring binary data streaming through a REST API. The Node.js/Express backend wraps yt-dlp to handle media extraction, format conversion (1080p, 720p, 480p video and MP3 audio), and streams output directly to the browser without storing anything server-side.\n\nBuilt with React and Material-UI on the frontend, with a health-check ping on page load to handle Render cold-start latency. An exercise in understanding how binary stream piping, download headers, and concurrent request management work in a Node.js context.',
    caseStudy: {
      problem: 'Wanted to understand how binary data streaming works in a full-stack context — specifically how a backend can pipe a media stream directly to a browser download without buffering the full file in memory.',
      solution: 'Wrapped yt-dlp in a Node.js/Express API that pipes the output stream directly to the HTTP response. Users select format and quality on the React frontend; the backend handles extraction and format conversion in a single pass.',
      impact: 'Handles 1080p, 720p, 480p video and MP3 audio extraction. Zero data stored server-side. Download times average under 10 seconds for standard-length videos. Hosted on Render.',
      learnings: 'Render free tier cold-start delays required a health-check ping on page load. Concurrent download requests can saturate a single-process Node server — would implement a Bull/Redis job queue for production-scale concurrency.'
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
    description: 'Hands-free mouse control via webcam using MediaPipe facial landmark detection. Maps head pitch and yaw angles to screen coordinates in real-time at under 50ms latency. Built for users with motor disabilities or RSI.',
    longDescription: 'CursorCam replaces the physical mouse with head movement. Using MediaPipe facial landmark detection, it maps head pitch and yaw angles to screen coordinates in real-time through a Flask backend. A lightweight JavaScript frontend handles cursor positioning and gesture-based click events at sub-50ms latency.\n\nBuilt specifically for users with motor disabilities or RSI injuries who cannot comfortably use conventional input devices. Requires only a standard webcam — no specialised hardware, no driver installation.',
    caseStudy: {
      problem: 'Users with motor disabilities or RSI injuries struggle with conventional mouse/keyboard input. Affordable head-tracking hardware is often inaccessible or overly complex to configure.',
      solution: 'Leveraged MediaPipe facial landmark detection to map head pitch/yaw angles to screen coordinates in real-time via a Flask backend. A lightweight JavaScript frontend handles cursor positioning and gesture-based clicking at sub-50ms latency.',
      impact: 'Enables fully hands-free mouse control using any standard webcam — no hardware purchase required. Tested with users who reported measurably reduced physical strain during extended sessions.',
      learnings: 'Lighting conditions significantly affect landmark detection accuracy. Would add adaptive brightness preprocessing and per-session sensitivity calibration. Smooth cursor interpolation (lerp) proved essential for usability — raw coordinate mapping was too jittery to be practical.'
    },
    technologies: ['Python', 'Flask', 'JavaScript', 'MediaPipe', 'Computer Vision'],
    github: 'https://github.com/Mrtracker-new/CursorCam',
    featured: false,
    icon: '👁️',
    bgColor: '#000000'
  },
  {
    id: 7,
    title: 'RNR Portfolio',
    category: 'Web Application',
    description: 'This portfolio. Custom-built React + TypeScript SPA with Framer Motion, code-split lazy loading, and accessibility-first component architecture. Scores 95+ across Lighthouse Performance, Accessibility, and SEO.',
    longDescription: 'This site. Built from scratch with React, TypeScript, Vite, and Framer Motion. Design decisions were driven by performance constraints: lazy-loaded routes, webp image optimisation, prefers-reduced-motion support, and semantic HTML throughout.\n\nScores 95+ across Lighthouse Performance, Accessibility, and SEO metrics. Hosted on Netlify with CI/CD on every commit. Styled with styled-components — a choice I would revisit in favour of CSS Modules to reduce runtime overhead.',
    caseStudy: {
      problem: 'Generic portfolio templates look identical and fail to communicate a developer\'s actual personality or technical depth. Recruiters spend under 10 seconds on a portfolio before deciding.',
      solution: 'Designed and built a custom React + TypeScript portfolio from scratch with Framer Motion page transitions, an accessibility-first component hierarchy, SEO-optimised metadata, and performance budgets enforced via Vite build analysis.',
      impact: 'Lighthouse scores: Performance 95+, Accessibility 95+, SEO 100. Hosted on Netlify with CI/CD on every commit. Fully responsive across mobile, tablet, and desktop.',
      learnings: 'Animation and accessibility are often in tension — prefers-reduced-motion support is non-negotiable. Also discovered that styled-components adds non-trivial runtime overhead; would evaluate CSS Modules next time.'
    },
    technologies: ['React', 'TypeScript', 'Styled-Components', 'Framer Motion', 'Vite', 'Netlify'],
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
    description: 'Offline-first Android and iOS app for organising links, documents, and notes. Local SQLite database, full-text search, category and tag system. Zero internet permission. A genuinely private alternative to Pocket and Raindrop.io.',
    longDescription: 'LinkNest is an offline-first mobile app for organising links, documents, and notes — built as a private alternative to cloud-based tools like Pocket and Raindrop.io.\n\nAll data is stored in a local SQLite database. Full-text search, category and tag organisation, and document attachment support are built in. Zero internet permission is declared in the manifest — privacy is verifiable, not a marketing claim.\n\nReleased as LinkNest v2.0 APK. Supports Android and iOS via Flutter.',
    caseStudy: {
      problem: 'Cloud-based bookmarking tools (Pocket, Raindrop.io) require accounts, phone home constantly, and delete your data when you stop paying. Users wanted a genuinely private, offline-first alternative they fully control.',
      solution: 'Built a Flutter mobile app with a local SQLite database, full-text search, category/tag organisation, and document attachment support. All data lives exclusively on the device — no network permission required.',
      impact: 'Released as LinkNest v2.0 APK. Supports Android and iOS. Handles thousands of links and documents with instant full-text search. Zero internet permission declared — verifiable privacy by design.',
      learnings: 'Flutter cross-platform support is mostly true, but platform-specific file picker behaviour required separate Android and iOS implementations. Would prioritise a unified abstraction layer earlier to avoid late-stage rewrites.'
    },
    technologies: ['Flutter', 'Dart', 'SQLite', 'Android', 'iOS'],
    github: 'https://github.com/Mrtracker-new/LinkNest',
    download: 'https://github.com/Mrtracker-new/LinkNest/releases/download/v2.0/LinkNest-v2.0.apk',
    featured: false,
    icon: '🔗',
    bgColor: '#000000',
    image: linkNestImg
  },
  {
    id: 10,
    title: 'BAR — Web',
    category: 'Web Application',
    description: 'A privacy-first web platform for encrypted self-destructing file sharing and end-to-end encrypted ephemeral chat. Files self-destruct on a timer or after a set number of views. What you share stays yours — until it\'s gone.',
    longDescription: 'Most platforms treat your data like a permanent record. BAR treats it like a secret.\n\nBurn After Reading is a full-stack web application I built to solve a real gap: people needed a way to share sensitive files and have real-time private conversations without leaving a permanent digital footprint.\n\nFiles are encrypted before they hit the server. Each file can be configured to self-destruct after a time limit or a set number of views. The Burn Chat feature provides end-to-end encrypted real-time messaging that automatically disappears — powered by ECDH key exchange and AES-GCM, so the server never holds readable content.\n\nThe architecture is built on zero-knowledge principles: even I can\'t read what users share. OTP verification, webhook support, brute-force protection, and secure session handling are all baked in from day one — not bolted on as an afterthought.',
    achievementStatement: 'Developed BAR (Burn After Reading), a privacy-focused web application for encrypted self-destructing file sharing and end-to-end encrypted ephemeral messaging — implementing AES-256 encryption, ECDH key exchange, zero-knowledge architecture, OTP verification, WebSocket real-time communication, webhooks, and brute-force protection.',
    caseStudy: {
      problem: 'Traditional file-sharing and messaging platforms keep your data long after you\'re done with it. Passwords, contracts, and sensitive conversations sit on servers with no expiry. Users have no real control over who accesses their content or for how long — creating serious privacy and compliance risks.',
      solution: 'Built a zero-knowledge web platform where files are encrypted client-side before upload. Each share is given a configurable TTL (time-to-live) or view count limit, after which the content is permanently destroyed. Burn Chat adds real-time E2E encrypted messaging via WebSockets using ECDH key exchange, so the server acts as a relay — never as a reader.',
      impact: 'Demonstrates practical application of modern cryptography in a user-facing product. Implements AES-256 encryption, ECDH key exchange, OTP verification, secure session handling, webhook support, and automated content destruction — while keeping the UI approachable for non-technical users.',
      learnings: 'Zero-knowledge architecture forces you to think differently about state. The server can\'t help you debug what it can\'t read. Learned to design thorough client-side logging and error boundaries early. ECDH key exchange for browser-based E2E encryption was the most technically demanding piece — the Web Crypto API is powerful but unforgiving. Would add per-file key rotation in the next iteration.'
    },
    technologies: ['React', 'Python', 'WebSockets', 'AES-256', 'ECDH', 'Zero-Knowledge', 'OTP', 'Webhooks'],
    github: 'https://github.com/Mrtracker-new/BAR-Web',
    liveDemo: 'https://bar-rnr.vercel.app/',
    featured: true,
    icon: '🔥',
    bgColor: '#000000',
    image: barWebImg
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
    <>
      <SEO
        title="My Work — Rolan Lobo"
        description="Real problems, real solutions. Here's the software I've built — security tools, web apps, and desktop applications that solve problems people actually have."
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
            My Work
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every project started with a real problem.
            <br />
            Here's how I solved them.
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
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
    </>
  );
};

export default Projects;
