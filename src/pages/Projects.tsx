import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Container } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import { projectsData, PROJECT_CATEGORIES, projectPath } from '../data/projects';
import type { Project } from '../data/projects';
import { SectionHeading, TechPill } from '../components/layout/primitives';
import DecryptText from '../components/DecryptText';
import { SITE_URL } from '../utils/site';
import { CategoryIcon, GitHubSVG, ExternalSVG, DownloadSVG } from '../components/icons';
import {
  PageWrapper, HeroRow, HeroLeft, PageLabel, PageTitle, PageSubtitle,
  HeroRight, HeroStatsRow, StatBlock, StatNumber, StatLabel, StatSeparator,
  FilterBar, FilterTab, FilterCount,
  FeaturedList, FeaturedItem, FeaturedContent, FeaturedMeta, FeaturedCategoryTag,
  FeaturedTitle, FeaturedProblem, FeaturedBottom, FeaturedTechRow,
  FeaturedLinksRow, InlineLink, ViewCaseStudyBtn, FeaturedTitleButton, FeaturedImagePane,
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
        description="Real problems, real solutions. AI-assisted construction planning, encryption tools, zero-knowledge platforms, local-first network observability, desktop media utilities, and mobile apps — with case studies for each."
        keywords="BuildWise AI, Site Feasibility, MapLibre, FastAPI, Steganography, AES-256 Encryption, NetPlus, NetPulse, YT Downloader, Rust, Tauri, InvisioVault, BAR, Sortify, React, Python, Privacy Software, Rolan Lobo"
        url={`${SITE_URL}/projects`}
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
                <StatSeparator aria-hidden="true" />                  <StatBlock>
                    <StatNumber>{PROJECT_CATEGORIES.length - 1}</StatNumber>
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
                      >
                        <FeaturedContent>
                          <div>
                            <FeaturedMeta>
                              <FeaturedCategoryTag>{project.category}</FeaturedCategoryTag>
                            </FeaturedMeta>
                            <FeaturedTitle style={{ marginTop: 'var(--spacing-3)' }}>
                              <FeaturedTitleButton
                                as={Link}
                                to={projectPath(project.slug)}
                                aria-label={`Read the ${project.title} case study`}
                              >
                                <DecryptText text={project.title} />
                              </FeaturedTitleButton>
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
                                title="Source code"
                              >
                                <GitHubSVG /> Code
                              </InlineLink>
                              {project.liveDemo && (
                                <InlineLink
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
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
                                  title="Download"
                                >
                                  <DownloadSVG /> Download
                                </InlineLink>
                              )}
                              <ViewCaseStudyBtn
                                as={Link}
                                to={projectPath(project.slug)}
                                aria-label={`Read the ${project.title} case study`}
                              >
                                Case study →
                              </ViewCaseStudyBtn>
                            </FeaturedLinksRow>
                          </FeaturedBottom>
                        </FeaturedContent>

                        <FeaturedImagePane>
                          {project.image ? (
                            <img
                              src={project.image}
                              srcSet={project.imageSrcSet}
                              sizes="(max-width: 960px) 100vw, 360px"
                              alt={project.title}
                              loading={i === 0 ? 'eager' : 'lazy'}
                              fetchPriority={i === 0 ? 'high' : 'auto'}
                              decoding="async"
                              style={project.imageFit === 'contain' ? { objectFit: 'contain' } : undefined}
                            />
                          ) : (
                            <ImagePlaceholder>
                              <PlaceholderIcon aria-hidden="true">
                                <CategoryIcon category={project.category} size={40} />
                              </PlaceholderIcon>
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

                  <TableHeader>
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
                      >
                        <RowTitle>
                          <RowIcon aria-hidden="true">
                            <CategoryIcon category={project.category} size={16} />
                          </RowIcon>
                          <RowTitleText>
                            <RowName>
                              <Link to={projectPath(project.slug)} aria-label={`Read the ${project.title} case study`}>
                                <DecryptText text={project.title} />
                              </Link>
                            </RowName>
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
    </>
  );
};

export default Projects;
