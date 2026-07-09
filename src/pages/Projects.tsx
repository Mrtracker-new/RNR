import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { Container, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import { projectsData, PROJECT_CATEGORIES } from '../data/projects';
import type { Project } from '../data/projects';
import { glassControl, glassPanel } from '../styles/surfaces';

/* ─── Design tokens used locally ─────────────────────────────────────────── */

// Category → display metadata
const CATEGORY_META: Record<string, { label: string; count: (p: Project[]) => number }> = {
  'All':                 { label: 'All',       count: (p) => p.length },
  'Desktop Application': { label: 'Desktop',   count: (p) => p.filter(x => x.category === 'Desktop Application').length },
  'Web Application':     { label: 'Web',       count: (p) => p.filter(x => x.category === 'Web Application').length },
  'Android App':         { label: 'Mobile',    count: (p) => p.filter(x => x.category === 'Android App').length },
};

/* ─── Page hero ───────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: var(--spacing-20);

  @media (max-width: 768px) {
    padding-top: 90px;
    padding-bottom: var(--spacing-16);
  }
`;

const HeroRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-8);
  padding: var(--spacing-12) 0 var(--spacing-10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: var(--spacing-10);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-5);
    padding: var(--spacing-8) 0 var(--spacing-8);
    margin-bottom: var(--spacing-8);
  }
`;

const HeroLeft = styled(m.div)``;

const PageLabel = styled.p`
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-3);
`;

const PageTitle = styled(m.h1)`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: var(--font-extrabold);
  color: var(--dark-50);
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: var(--spacing-4);
`;

const PageSubtitle = styled(m.p)`
  font-size: var(--text-base);
  color: var(--dark-500);
  max-width: 480px;
  line-height: 1.65;
`;

const HeroRight = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-2);
  flex-shrink: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-4);
  }
`;

const StatBlock = styled.div`
  text-align: right;

  @media (max-width: 768px) { text-align: left; }
`;

const StatNumber = styled.span`
  display: block;
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--dark-100);
  letter-spacing: -0.03em;
  line-height: 1;
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.7rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dark-600);
  margin-top: 3px;
`;

const StatSeparator = styled.div`
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 var(--spacing-4);

  @media (max-width: 768px) { display: none; }
`;

const HeroStatsRow = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) { gap: var(--spacing-6); }
`;

/* ─── Filter bar ──────────────────────────────────────────────────────────── */

const FilterBar = styled(m.div)`
  ${glassControl}
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  width: fit-content;
  margin-bottom: var(--spacing-10);

  @media (max-width: 640px) {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const FilterTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s ease, color 0.18s ease;
  border: none;
  position: relative;

  ${props => props.$active ? `
    background: rgba(255, 255, 255, 0.09);
    color: var(--dark-100);
  ` : `
    background: transparent;
    color: var(--dark-500);
    &:hover { background: rgba(255, 255, 255, 0.04); color: var(--dark-300); }
  `}
`;

const FilterCount = styled.span<{ $active: boolean }>`
  font-size: 0.65rem;
  font-family: var(--font-mono);
  padding: 1px 6px;
  border-radius: 99px;
  background: ${props => props.$active ? 'var(--accent-subtle)' : 'rgba(255,255,255,0.06)'};
  color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--dark-600)'};
  font-weight: var(--font-semibold);
  transition: background 0.18s ease, color 0.18s ease;
`;

/* ─── Featured section ────────────────────────────────────────────────────── */

const SectionLabel = styled.p`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-6);
`;

const FeaturedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: var(--spacing-16);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  overflow: hidden;

  @media (max-width: 768px) { margin-bottom: var(--spacing-12); }
`;

const FeaturedItem = styled(m.div)`
  display: grid;
  grid-template-columns: 1fr 360px;
  background: var(--dark-950);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: var(--bg-overlay); }

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedContent = styled.div`
  padding: var(--spacing-10) var(--spacing-10);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-6);
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 960px) {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: var(--spacing-8) var(--spacing-6);
  }

  @media (max-width: 640px) { padding: var(--spacing-6); }
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const FeaturedCategoryTag = styled.span`
  font-size: 0.68rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dark-500);
`;

const FeaturedDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--dark-700);
  flex-shrink: 0;
`;

const FeaturedTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  letter-spacing: -0.025em;
  line-height: 1.15;
`;

const FeaturedProblem = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  line-height: 1.7;
  max-width: 520px;
`;

const FeaturedBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  flex-wrap: wrap;
`;

const FeaturedTechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
`;

const TechPill = styled.span`
  ${glassControl}
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--dark-500);
  padding: 2px 8px;
`;

const FeaturedLinksRow = styled.div`
  display: flex;
  gap: var(--spacing-3);
  flex-shrink: 0;
`;

const InlineLink = styled.a`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-400);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.18s ease;

  &:hover { color: var(--accent-primary); }

  svg { width: 14px; height: 14px; opacity: 0.7; }
`;

const ViewCaseStudyBtn = styled.button`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-400);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  transition: color 0.18s ease;
  font-family: inherit;

  &:hover { color: var(--accent-primary); }
`;

const FeaturedImagePane = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--dark-900);
  min-height: 260px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(0.75);
  }

  &:hover img { transform: scale(1.04); filter: brightness(0.85); }

  @media (max-width: 960px) { min-height: 200px; }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  background: var(--dark-900);
  min-height: 260px;
`;

const PlaceholderIcon = styled.span`
  font-size: 2.5rem;
  opacity: 0.25;
`;

const PlaceholderCat = styled.span`
  font-size: 0.65rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dark-700);
`;

/* ─── All projects table ──────────────────────────────────────────────────── */

const ProjectsTableSection = styled.div``;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 160px 180px 120px;
  gap: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-4) var(--spacing-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2px;

  @media (max-width: 960px) { grid-template-columns: 1fr 140px 100px; }
  @media (max-width: 640px) { display: none; }
`;

const TableHeaderCell = styled.span`
  font-size: 0.65rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dark-600);
`;

const TableBody = styled(m.div)`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-xl);
  overflow: hidden;
`;

const TableRow = styled(m.div)`
  display: grid;
  grid-template-columns: 1fr 160px 180px 120px;
  gap: var(--spacing-4);
  align-items: center;
  padding: var(--spacing-5) var(--spacing-6);
  background: var(--dark-950);
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover {
    background: var(--bg-overlay);

    .row-arrow { color: var(--accent-primary); transform: translateX(3px); }
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr 140px 100px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr auto;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
  }
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 0;
`;

const RowIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
  line-height: 1;
`;

const RowTitleText = styled.div`
  min-width: 0;
`;

const RowName = styled.h3`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--dark-100);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const RowProblem = styled.p`
  font-size: var(--text-xs);
  color: var(--dark-500);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 640px) { display: none; }
`;

const RowCategory = styled.span`
  font-size: var(--text-xs);
  color: var(--dark-500);
  font-weight: var(--font-medium);
  white-space: nowrap;

  @media (max-width: 640px) { display: none; }
`;

const RowTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  @media (max-width: 960px) { display: none; }
`;

const SmallTechPill = styled.span`
  ${glassControl}
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  font-family: var(--font-mono);
  color: var(--dark-600);
  padding: 1px 6px;
`;

const RowArrow = styled.span`
  font-size: var(--text-base);
  color: var(--dark-700);
  transition: color 0.18s ease, transform 0.18s ease;
  justify-self: end;
  flex-shrink: 0;
`;

/* ─── Modal ───────────────────────────────────────────────────────────────── */

const ModalOverlay = styled(m.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
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
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--dark-300);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.18s ease, color 0.18s ease;
  font-family: inherit;

  &:hover { background: rgba(255, 255, 255, 0.1); color: var(--dark-50); }
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
`;

const ModalCatTag = styled.span`
  font-size: 0.65rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  opacity: 0.8;
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  letter-spacing: -0.025em;
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
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: var(--spacing-6) 0;
`;

// Case study as a clean reading layout — not coloured emoji cards
const CaseStudySection = styled.div`
  margin-bottom: var(--spacing-8);
`;

const CaseStudyItem = styled.div`
  padding: var(--spacing-5) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
`;

const CaseStudyItemLabel = styled.p`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
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
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
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
  font-size: 0.72rem;
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
    border: 1px solid rgba(255,255,255,0.1);
    &:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); color: var(--dark-100); }
  `}
`;

/* ─── SVG icons ───────────────────────────────────────────────────────────── */

const GitHubSVG = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const ExternalSVG = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
    <polyline points="10 3 13 3 13 6" />
    <line x1="7" y1="9" x2="13" y2="3" />
  </svg>
);

const DownloadSVG = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" />
    <polyline points="4 7 8 11 12 7" />
    <line x1="8" y1="1" x2="8" y2="11" />
  </svg>
);

/* ─── Modal component ─────────────────────────────────────────────────────── */

interface ModalProps { project: Project | null; isOpen: boolean; onClose: () => void; }

const caseStudyFields: { key: keyof Project['caseStudy']; label: string }[] = [
  { key: 'problem',   label: 'The Problem'   },
  { key: 'solution',  label: 'The Solution'  },
  { key: 'impact',    label: 'Outcome'       },
  { key: 'learnings', label: 'What I Learned'},
];

const ProjectModal: React.FC<ModalProps> = ({ project, isOpen, onClose }) => {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleKey]);

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

/* ─── Main page component ─────────────────────────────────────────────────── */

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProject = useCallback((p: Project) => {
    setSelectedProject(p);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projectsData;
    return projectsData.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const featuredProjects = useMemo(
    () => filteredProjects.filter(p => p.featured),
    [filteredProjects]
  );

  const otherProjects = useMemo(
    () => filteredProjects.filter(p => !p.featured),
    [filteredProjects]
  );

  return (
    <>
      <SEO
        title="My Work — Rolan Lobo"
        description="Real problems, real solutions. Encryption tools, zero-knowledge platforms, offline-first mobile apps, and computer vision experiments — with case studies for each."
        keywords="Steganography, AES-256 Encryption, File Encryption, InvisioVault, BAR, Sortify, CursorCam, React, Python, Flask, Privacy Software, Open Source, Rolan Lobo"
        url="https://rolan-rnr.netlify.app/projects"
      />

      <PageWrapper>
        <Container>

          {/* ── Hero ── */}
          <HeroRow>
            <HeroLeft
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PageLabel>Projects</PageLabel>
              <PageTitle>Work that ships.</PageTitle>
              <PageSubtitle>
                Every project here started with a real problem. The case studies explain the
                decision-making — not just the tech used.
              </PageSubtitle>
            </HeroLeft>

            <HeroRight
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HeroStatsRow>
                <StatBlock>
                  <StatNumber>{projectsData.length}</StatNumber>
                  <StatLabel>Total Projects</StatLabel>
                </StatBlock>
                <StatSeparator aria-hidden="true" />
                <StatBlock>
                  <StatNumber>{projectsData.filter(p => p.featured).length}</StatNumber>
                  <StatLabel>Featured</StatLabel>
                </StatBlock>
                <StatSeparator aria-hidden="true" />
                <StatBlock>
                  <StatNumber>4</StatNumber>
                  <StatLabel>Platforms</StatLabel>
                </StatBlock>
              </HeroStatsRow>
            </HeroRight>
          </HeroRow>

          {/* ── Filter bar ── */}
          <FilterBar
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {PROJECT_CATEGORIES.map(cat => (
              <FilterTab
                key={cat}
                $active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {CATEGORY_META[cat]?.label ?? cat}
                <FilterCount $active={selectedCategory === cat}>
                  {CATEGORY_META[cat]?.count(projectsData) ?? 0}
                </FilterCount>
              </FilterTab>
            ))}
          </FilterBar>

          <AnimatePresence mode="wait">
            <m.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── Featured projects ── */}
              {featuredProjects.length > 0 && (
                <div>
                  <SectionLabel>
                    Featured — {featuredProjects.length} project{featuredProjects.length !== 1 ? 's' : ''}
                  </SectionLabel>
                  <FeaturedList>
                    {featuredProjects.map((project, i) => (
                      <FeaturedItem
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                        onClick={() => openProject(project)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open case study for ${project.title}`}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openProject(project)}
                      >
                        <FeaturedContent>
                          <div>
                            <FeaturedMeta>
                              <FeaturedCategoryTag>{project.category}</FeaturedCategoryTag>
                              {project.icon && (
                                <>
                                  <FeaturedDot aria-hidden="true" />
                                  <span aria-hidden="true" style={{ fontSize: '0.9rem' }}>{project.icon}</span>
                                </>
                              )}
                            </FeaturedMeta>
                            <FeaturedTitle style={{ marginTop: 'var(--spacing-3)' }}>
                              {project.title}
                            </FeaturedTitle>
                            <FeaturedProblem style={{ marginTop: 'var(--spacing-3)' }}>
                              {project.caseStudy.problem}
                            </FeaturedProblem>
                          </div>

                          <FeaturedBottom>
                            <FeaturedTechRow>
                              {project.technologies.slice(0, 5).map(t => (
                                <TechPill key={t}>{t}</TechPill>
                              ))}
                            </FeaturedTechRow>
                            <FeaturedLinksRow>
                              <InlineLink
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                title="Source code"
                              >
                                <GitHubSVG /> Code
                              </InlineLink>
                              {project.liveDemo && (
                                <InlineLink
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  title="Live demo"
                                >
                                  <ExternalSVG /> Demo
                                </InlineLink>
                              )}
                              {project.download && !project.liveDemo && (
                                <InlineLink
                                  href={project.download}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  title="Download"
                                >
                                  <DownloadSVG /> Download
                                </InlineLink>
                              )}
                              <ViewCaseStudyBtn onClick={() => openProject(project)}>
                                Case study →
                              </ViewCaseStudyBtn>
                            </FeaturedLinksRow>
                          </FeaturedBottom>
                        </FeaturedContent>

                        <FeaturedImagePane>
                          {project.image ? (
                            <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                          ) : (
                            <ImagePlaceholder>
                              <PlaceholderIcon aria-hidden="true">{project.icon}</PlaceholderIcon>
                              <PlaceholderCat>{project.category}</PlaceholderCat>
                            </ImagePlaceholder>
                          )}
                        </FeaturedImagePane>
                      </FeaturedItem>
                    ))}
                  </FeaturedList>
                </div>
              )}

              {/* ── All / other projects table ── */}
              {otherProjects.length > 0 && (
                <ProjectsTableSection>
                  <SectionLabel>
                    {featuredProjects.length > 0 ? 'More Projects' : 'All Projects'} — {otherProjects.length}
                  </SectionLabel>

                  <TableHeader aria-hidden="true">
                    <TableHeaderCell>Project</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Stack</TableHeaderCell>
                    <TableHeaderCell />
                  </TableHeader>

                  <TableBody>
                    {otherProjects.map((project, i) => (
                      <TableRow
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => openProject(project)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open case study for ${project.title}`}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openProject(project)}
                      >
                        <RowTitle>
                          <RowIcon aria-hidden="true">{project.icon}</RowIcon>
                          <RowTitleText>
                            <RowName>{project.title}</RowName>
                            <RowProblem>{project.caseStudy.problem}</RowProblem>
                          </RowTitleText>
                        </RowTitle>

                        <RowCategory>{project.category}</RowCategory>

                        <RowTech>
                          {project.technologies.slice(0, 3).map(t => (
                            <SmallTechPill key={t}>{t}</SmallTechPill>
                          ))}
                          {project.technologies.length > 3 && (
                            <SmallTechPill>+{project.technologies.length - 3}</SmallTechPill>
                          )}
                        </RowTech>

                        <RowArrow className="row-arrow" aria-hidden="true">→</RowArrow>
                      </TableRow>
                    ))}
                  </TableBody>
                </ProjectsTableSection>
              )}

              {/* Edge case: filtered to a category with no results */}
              {filteredProjects.length === 0 && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: 'var(--spacing-20) 0', color: 'var(--dark-600)' }}
                >
                  No projects in this category yet.
                </m.div>
              )}

            </m.div>
          </AnimatePresence>
        </Container>
      </PageWrapper>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Projects;
