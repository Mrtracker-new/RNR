import styled from 'styled-components';
import { m } from 'framer-motion';
import { glassControl } from '../../styles/surfaces';

/* Styled-components for the Projects page shell: hero, filter bar, the featured
   list, and the "more projects" table. Modal styling lives in ProjectModal. */

/* ─── Page hero ───────────────────────────────────────────────────────────── */

export const PageWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: var(--spacing-20);

  @media (max-width: 768px) {
    padding-top: 90px;
    padding-bottom: var(--spacing-16);
  }
`;

export const HeroRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-8);
  padding: var(--spacing-12) 0 var(--spacing-10);
  border-bottom: 1px solid var(--hairline);
  margin-bottom: var(--spacing-10);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-5);
    padding: var(--spacing-8) 0 var(--spacing-8);
    margin-bottom: var(--spacing-8);
  }
`;

export const HeroLeft = styled(m.div)``;

export const PageLabel = styled.p`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-3);
`;

export const PageTitle = styled(m.h1)`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: var(--font-extrabold);
  color: var(--dark-50);
  letter-spacing: var(--tracking-tighter);
  line-height: 1.05;
  margin-bottom: var(--spacing-4);
`;

export const PageSubtitle = styled(m.p)`
  font-size: var(--text-base);
  color: var(--dark-500);
  max-width: 480px;
  line-height: 1.65;
`;

export const HeroRight = styled(m.div)`
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

export const StatBlock = styled.div`
  text-align: right;

  @media (max-width: 768px) { text-align: left; }
`;

export const StatNumber = styled.span`
  display: block;
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--dark-100);
  letter-spacing: var(--tracking-tighter);
  line-height: 1;
`;

export const StatLabel = styled.span`
  display: block;
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dark-600);
  margin-top: 3px;
`;

export const StatSeparator = styled.div`
  width: 1px;
  height: 32px;
  background: var(--hairline-strong);
  margin: 0 var(--spacing-4);

  @media (max-width: 768px) { display: none; }
`;

export const HeroStatsRow = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) { gap: var(--spacing-6); }
`;

/* ─── Filter bar ──────────────────────────────────────────────────────────── */

export const FilterBar = styled(m.div)`
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

export const FilterTab = styled.button<{ $active: boolean }>`
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
    background: var(--hairline-strong);
    color: var(--dark-100);
  ` : `
    background: transparent;
    color: var(--dark-500);
    &:hover { background: var(--hairline-faint); color: var(--dark-300); }
  `}
`;

export const FilterCount = styled.span<{ $active: boolean }>`
  font-size: var(--text-2xs);
  font-family: var(--font-mono);
  padding: 1px 6px;
  border-radius: 99px;
  background: ${props => props.$active ? 'var(--accent-subtle)' : 'var(--hairline)'};
  color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--dark-600)'};
  font-weight: var(--font-semibold);
  transition: background 0.18s ease, color 0.18s ease;
`;

/* ─── Featured section ────────────────────────────────────────────────────── */

export const FeaturedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: var(--spacing-16);
  background: var(--divider);
  border-radius: var(--radius-xl);
  overflow: hidden;

  @media (max-width: 768px) { margin-bottom: var(--spacing-12); }
`;

export const FeaturedItem = styled(m.div)`
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

export const FeaturedContent = styled.div`
  padding: var(--spacing-10) var(--spacing-10);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-6);
  border-right: 1px solid var(--divider);

  @media (max-width: 960px) {
    border-right: none;
    border-bottom: 1px solid var(--divider);
    padding: var(--spacing-8) var(--spacing-6);
  }

  @media (max-width: 640px) { padding: var(--spacing-6); }
`;

export const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

export const FeaturedCategoryTag = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dark-500);
`;

export const FeaturedDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--dark-700);
  flex-shrink: 0;
`;

export const FeaturedTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  letter-spacing: var(--tracking-tight);
  line-height: 1.15;
`;

export const FeaturedProblem = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  line-height: 1.7;
  max-width: 520px;
`;

export const FeaturedBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  flex-wrap: wrap;
`;

export const FeaturedTechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
`;

export const FeaturedLinksRow = styled.div`
  display: flex;
  gap: var(--spacing-3);
  flex-shrink: 0;
`;

export const InlineLink = styled.a`
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

export const ViewCaseStudyBtn = styled.button`
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

export const FeaturedImagePane = styled.div`
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
    /* Keep thumbnails rich — slight contrast/saturation lift, near-full brightness. */
    filter: contrast(1.05) saturate(1.06) brightness(0.98);
  }

  /* Edge vignette — melts bright/white thumbnails (e.g. Sortify) into the dark
     frame without dulling the image centre. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    box-shadow: inset 0 0 70px 12px rgba(0, 0, 0, 0.55);
  }

  &:hover img { transform: scale(1.04); filter: contrast(1.05) saturate(1.06) brightness(1.05); }

  @media (max-width: 960px) { min-height: 200px; }
`;

export const ImagePlaceholder = styled.div`
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

export const PlaceholderIcon = styled.span`
  font-size: 2.5rem;
  opacity: 0.25;
`;

export const PlaceholderCat = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--dark-700);
`;

/* ─── All projects table ──────────────────────────────────────────────────── */

export const ProjectsTableSection = styled.div``;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 160px 180px 120px;
  gap: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-4) var(--spacing-3);
  border-bottom: 1px solid var(--hairline);
  margin-bottom: 2px;

  @media (max-width: 960px) { grid-template-columns: 1fr 140px 100px; }
  @media (max-width: 640px) { display: none; }
`;

export const TableHeaderCell = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--dark-600);
`;

export const TableBody = styled(m.div)`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--hairline-faint);
  border-radius: var(--radius-xl);
  overflow: hidden;
`;

export const TableRow = styled(m.div)`
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

export const RowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 0;
`;

export const RowIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
  line-height: 1;
`;

export const RowTitleText = styled.div`
  min-width: 0;
`;

export const RowName = styled.h3`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--dark-100);
  letter-spacing: var(--tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

export const RowProblem = styled.p`
  font-size: var(--text-xs);
  color: var(--dark-500);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 640px) { display: none; }
`;

export const RowCategory = styled.span`
  font-size: var(--text-xs);
  color: var(--dark-500);
  font-weight: var(--font-medium);
  white-space: nowrap;

  @media (max-width: 640px) { display: none; }
`;

export const RowTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  @media (max-width: 960px) { display: none; }
`;

export const SmallTechPill = styled.span`
  ${glassControl}
  border-radius: var(--radius-sm);
  font-size: var(--text-2xs);
  font-family: var(--font-mono);
  color: var(--dark-600);
  padding: 1px 6px;
`;

export const RowArrow = styled.span`
  font-size: var(--text-base);
  color: var(--dark-700);
  transition: color 0.18s ease, transform 0.18s ease;
  justify-self: end;
  flex-shrink: 0;
`;
