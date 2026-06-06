import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section, Grid, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import { projectsData, PROJECT_CATEGORIES } from '../data/projects';
import type { Project } from '../data/projects';

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
  color: var(--dark-50);
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



// Named components replacing previous inline styles in the modal header
const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-5);
`;

const ModalIconWrapper = styled.div`
  font-size: var(--text-2xl);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-3);
  border-radius: var(--radius-xl);
  min-width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ModalHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModalBadgeRow = styled.div`
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--spacing-1);
`;

/* Structured placeholder for project cards that have no screenshot */
const ProjectIconPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
`;

const PlaceholderIcon = styled.span`
  font-size: 2.5rem;
  line-height: 1;
  opacity: 0.6;
`;

const PlaceholderCategory = styled.span`
  font-size: 0.68rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`;

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
            <ModalHeader>
              <ModalIconWrapper aria-hidden="true">{project.icon}</ModalIconWrapper>
              <ModalHeaderContent>
                <ModalTitle>{project.title}</ModalTitle>
                <ModalBadgeRow>
                  <Badge variant="info">{project.category}</Badge>
                  {project.featured && <Badge variant="success">Featured</Badge>}
                </ModalBadgeRow>
              </ModalHeaderContent>
            </ModalHeader>

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
        description="Real problems, real solutions. Here's the software I've built — encryption tools, zero-knowledge platforms, desktop applications, and cross-platform apps that solve problems people actually have."
        keywords="Steganography, Polyglot Files, AES-256 Encryption, File Encryption, Security Tools, InvisioVault, BAR, Sortify, CursorCam, React Projects, Python Projects, Flask, Software Developer, Rolan Lobo, Rolan RNR, Privacy Software, Open Source"
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
            {PROJECT_CATEGORIES.map((category) => (
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
                    whileHover={{ y: -4 }}
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
                        <ProjectIconPlaceholder>
                          <PlaceholderIcon aria-hidden="true">{project.icon}</PlaceholderIcon>
                          <PlaceholderCategory>{project.category}</PlaceholderCategory>
                        </ProjectIconPlaceholder>
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
