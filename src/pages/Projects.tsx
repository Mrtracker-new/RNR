import React, { useState, useMemo, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Container } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import { projectsData, PROJECT_CATEGORIES } from '../data/projects';
import type { Project } from '../data/projects';
import { SectionHeading, TechPill } from '../components/layout/primitives';
import DecryptText from '../components/DecryptText';
import { GitHubSVG, ExternalSVG, DownloadSVG } from './projects/icons';
import ProjectModal from './projects/ProjectModal';
import {
  PageWrapper, HeroRow, HeroLeft, PageLabel, PageTitle, PageSubtitle,
  HeroRight, HeroStatsRow, StatBlock, StatNumber, StatLabel, StatSeparator,
  FilterBar, FilterTab, FilterCount,
  FeaturedList, FeaturedItem, FeaturedContent, FeaturedMeta, FeaturedCategoryTag,
  FeaturedDot, FeaturedTitle, FeaturedProblem, FeaturedBottom, FeaturedTechRow,
  FeaturedLinksRow, InlineLink, ViewCaseStudyBtn, FeaturedImagePane,
  ImagePlaceholder, PlaceholderIcon, PlaceholderCat,
  ProjectsTableSection, TableHeader, TableHeaderCell, TableBody, TableRow,
  RowTitle, RowIcon, RowTitleText, RowName, RowProblem, RowCategory, RowTech,
  SmallTechPill, RowArrow,
} from './projects/styled';

/* Category → display metadata */
const CATEGORY_META: Record<string, { label: string; count: (p: Project[]) => number }> = {
  'All':                 { label: 'All',       count: (p) => p.length },
  'Desktop Application': { label: 'Desktop',   count: (p) => p.filter(x => x.category === 'Desktop Application').length },
  'Web Application':     { label: 'Web',       count: (p) => p.filter(x => x.category === 'Web Application').length },
  'Android App':         { label: 'Mobile',    count: (p) => p.filter(x => x.category === 'Android App').length },
};

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProject = useCallback((p: Project) => {
    setSelectedProject(p);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Counts are derived from the static projectsData — compute once, not per render.
  const categoryCounts = useMemo(
    () => Object.fromEntries(
      PROJECT_CATEGORIES.map(cat => [cat, CATEGORY_META[cat]?.count(projectsData) ?? 0])
    ) as Record<string, number>,
    []
  );

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
                  {categoryCounts[cat] ?? 0}
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
                  <SectionHeading
                    title="Featured"
                    aside={`${featuredProjects.length} project${featuredProjects.length !== 1 ? 's' : ''}`}
                  />
                  <FeaturedList>
                    {featuredProjects.map((project, i) => (
                      <FeaturedItem
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                        onClick={() => openProject(project)}
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
                              <DecryptText text={project.title} />
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
                              <ViewCaseStudyBtn
                                onClick={e => { e.stopPropagation(); openProject(project); }}
                                aria-label={`Read the ${project.title} case study`}
                              >
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
                  <SectionHeading
                    title={featuredProjects.length > 0 ? 'More Projects' : 'All Projects'}
                    aside={`${otherProjects.length} total`}
                  />

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
                        aria-label={`${project.title}, ${project.category}. Open case study.`}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openProject(project);
                          }
                        }}
                      >
                        <RowTitle>
                          <RowIcon aria-hidden="true">{project.icon}</RowIcon>
                          <RowTitleText>
                            <RowName><DecryptText text={project.title} /></RowName>
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
