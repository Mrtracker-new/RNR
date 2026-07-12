import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { Badge } from '../../styles/GlobalStyle';
import { glassControl, glassPanel } from '../../styles/surfaces';
import type { Project } from '../../data/projects';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { GitHubSVG, ExternalSVG, DownloadSVG } from './icons';
import { FeaturedDot } from './styled';

/* ─── Modal styling ───────────────────────────────────────────────────────── */

const ModalOverlay = styled(m.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  /* Above the nav island (z:1200) and mobile menu (z:1100) so the modal —
     and its close button — are never clipped by the fixed header. */
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
`;

const ModalPanel = styled(m.div)`
  ${glassPanel}
  max-width: 860px;
  width: 100%;
  position: relative;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;

  @media (max-width: 1024px) { max-width: 95vw; }
  @media (max-width: 768px) { max-width: 90vw; border-radius: var(--radius-xl); }
  @media (max-width: 640px) {
    max-width: 100vw;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    border-bottom: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    animation: none !important;
  }
`;

const ModalScroller = styled.div`
  overflow-y: auto;
  max-height: 88vh;
  overscroll-behavior: contain;
  touch-action: pan-y;
  will-change: scroll-position;
  contain: layout style;
  scrollbar-width: thin;
  scrollbar-color: var(--hairline-strong) transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--hairline-strong);
    border-radius: 99px;
  }

  @media (max-width: 768px) { max-height: 85vh; }
  @media (max-width: 640px) { max-height: 92vh; }
  @media (max-height: 600px) { max-height: 95vh; }
`;

const ModalImageStrip = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    filter: brightness(0.6);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, var(--bg-overlay) 100%);
  }

  @media (max-width: 768px) { height: 160px; }
  @media (max-width: 640px) { height: 140px; }
`;

const ModalBody = styled.div`
  padding: var(--spacing-8) var(--spacing-8) var(--spacing-10);

  @media (max-width: 768px) { padding: var(--spacing-6) var(--spacing-6) var(--spacing-8); }
  @media (max-width: 640px) { padding: var(--spacing-5) var(--spacing-5) var(--spacing-8); }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-strong);
  color: var(--dark-300);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.18s ease, color 0.18s ease;
  font-family: inherit;

  &:hover { background: var(--border-strong); color: var(--dark-50); }
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
`;

const ModalCatTag = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--accent-primary);
  opacity: 0.8;
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  letter-spacing: var(--tracking-tight);
  line-height: 1.2;
  margin-bottom: var(--spacing-4);
`;

const ModalLede = styled.p`
  font-size: var(--text-base);
  color: var(--dark-400);
  line-height: 1.75;
  margin-bottom: var(--spacing-8);
  white-space: pre-line;
`;

const ModalDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--hairline);
  margin: var(--spacing-6) 0;
`;

// Case study as a clean reading layout — not coloured emoji cards
const CaseStudySection = styled.div`
  margin-bottom: var(--spacing-8);
`;

const CaseStudyItem = styled.div`
  padding: var(--spacing-5) 0;
  border-bottom: 1px solid var(--divider);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
`;

const CaseStudyItemLabel = styled.p`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-2);
`;

const CaseStudyItemText = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-400);
  line-height: 1.75;
`;

const ModalSectionLabel = styled.p`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-3);
`;

const ModalTechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
`;

const ModalTechTag = styled.span`
  ${glassControl}
  border-radius: var(--radius-sm);
  font-size: var(--text-2xs);
  font-family: var(--font-mono);
  color: var(--dark-400);
  padding: 3px 10px;
`;

const ModalActionsRow = styled.div`
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
`;

const ModalActionLink = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;

  ${props => props.$primary ? `
    background: var(--accent-primary);
    color: #ffffff;
    border: 1px solid transparent;
    &:hover { background: var(--accent-hover); }
    &:active { background: var(--accent-press); }
  ` : `
    background: transparent;
    color: var(--dark-300);
    border: 1px solid var(--border-strong);
    &:hover { border-color: var(--hairline-bright); background: var(--hairline-faint); color: var(--dark-100); }
  `}
`;

/* ─── Component ───────────────────────────────────────────────────────────── */

interface ModalProps { project: Project | null; isOpen: boolean; onClose: () => void; }

const caseStudyFields: { key: keyof Project['caseStudy']; label: string }[] = [
  { key: 'problem',   label: 'The Problem'   },
  { key: 'solution',  label: 'The Solution'  },
  { key: 'impact',    label: 'Outcome'       },
  { key: 'learnings', label: 'What I Learned'},
];

const ProjectModal: React.FC<ModalProps> = ({ project, isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Trap focus in the dialog, close on Escape, and restore focus to the trigger.
  useFocusTrap(isOpen, panelRef, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prevH = html.style.overflow;
    const prevB = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevH;
      document.body.style.overflow = prevB;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <ModalOverlay
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <ModalPanel
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <CloseButton onClick={onClose} aria-label="Close case study">×</CloseButton>

            <ModalScroller>
              {project.image && (
                <ModalImageStrip>
                  <img src={project.image} alt={project.title} loading="eager" decoding="async" />
                </ModalImageStrip>
              )}

              <ModalBody>
                <ModalMeta>
                  <ModalCatTag>{project.category}</ModalCatTag>
                  {project.featured && (
                    <>
                      <FeaturedDot aria-hidden="true" />
                      <Badge $variant="success">Featured</Badge>
                    </>
                  )}
                </ModalMeta>

                <ModalTitle id="modal-title">{project.title}</ModalTitle>
                <ModalLede>{project.description}</ModalLede>

                <ModalDivider />

                <ModalSectionLabel>Case Study</ModalSectionLabel>
                <CaseStudySection>
                  {caseStudyFields.map(({ key, label }) => (
                    <CaseStudyItem key={key}>
                      <CaseStudyItemLabel>{label}</CaseStudyItemLabel>
                      <CaseStudyItemText>{project.caseStudy[key]}</CaseStudyItemText>
                    </CaseStudyItem>
                  ))}
                </CaseStudySection>

                <ModalDivider />

                <ModalSectionLabel>Stack</ModalSectionLabel>
                <ModalTechRow>
                  {project.technologies.map(t => <ModalTechTag key={t}>{t}</ModalTechTag>)}
                </ModalTechRow>

                <ModalActionsRow>
                  <ModalActionLink
                    $primary
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubSVG /> Source Code
                  </ModalActionLink>
                  {project.liveDemo && (
                    <ModalActionLink
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalSVG /> Live Demo
                    </ModalActionLink>
                  )}
                  {project.download && (
                    <ModalActionLink
                      href={project.download}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DownloadSVG /> Download
                    </ModalActionLink>
                  )}
                </ModalActionsRow>
              </ModalBody>
            </ModalScroller>
          </ModalPanel>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
