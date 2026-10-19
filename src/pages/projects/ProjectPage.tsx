import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Container } from '../../styles/GlobalStyle';
import { glassControl } from '../../styles/surfaces';
import SEO from '../../components/SEO';
import { PageWrapper, PageLabel, PageTitle, PageSubtitle } from './styled';
import { projectsData, getProjectBySlug, projectPath } from '../../data/projects';
import type { Project } from '../../data/projects';
import { SITE_URL } from '../../utils/site';
import { GitHubSVG, ExternalSVG, DownloadSVG } from '../../components/icons';

/* ─── Styling ─────────────────────────────────────────────────────────────── */

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--dark-500);
  margin: var(--spacing-4) 0 var(--spacing-6);

  &:hover { color: var(--accent-primary); }
`;

const Hero = styled.header`
  padding: var(--spacing-10) 0 var(--spacing-8);
  border-bottom: 1px solid var(--hairline);
  margin-bottom: var(--spacing-10);
`;

const Category = styled.p`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-3);
`;

const Title = styled(PageTitle)`
  margin-bottom: var(--spacing-5);
`;

const Lede = styled(PageSubtitle)`
  max-width: 720px;
  font-size: var(--text-lg);
  color: var(--dark-400);
`;

const HeroImage = styled.figure`
  margin: 0 0 var(--spacing-10);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--dark-900);

  img {
    width: 100%;
    height: auto;
    max-height: 380px;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

const Section = styled.section`
  padding: var(--spacing-8) 0;
  border-bottom: 1px solid var(--hairline);

  &:last-of-type { border-bottom: none; }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dark-500);
  margin-bottom: var(--spacing-3);
`;

const Prose = styled.p`
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--dark-300);
  max-width: 760px;
  white-space: pre-line;
`;

const TechRow = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TechTag = styled.li`
  ${glassControl}
  border-radius: var(--radius-sm);
  padding: 3px 9px;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--dark-400);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  padding-top: var(--spacing-8);
`;

const ActionLink = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 11px 22px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  svg { width: 15px; height: 15px; flex-shrink: 0; }

  ${props => (props.$primary
    ? `background: var(--accent-fill); color: #fff; border: 1px solid transparent;
       &:hover { background: var(--accent-fill-hover); color: #fff; }`
    : `background: transparent; color: var(--dark-300); border: 1px solid var(--border-strong);
       &:hover { border-color: var(--hairline-bright); color: var(--dark-100); }`)}
`;

const PrevNext = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding-top: var(--spacing-10);
  margin-top: var(--spacing-10);
  border-top: 1px solid var(--hairline);
  flex-wrap: wrap;
`;

const NeighbourLink = styled(Link)<{ $align?: 'right' }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: ${props => props.$align ?? 'left'};
  margin-left: ${props => (props.$align === 'right' ? 'auto' : '0')};

  span:first-child {
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--dark-600);
  }

  span:last-child {
    font-size: var(--text-sm);
    color: var(--dark-200);
  }

  &:hover span:last-child { color: var(--accent-primary); }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const CASE_STUDY_SECTIONS: { key: keyof Project['caseStudy']; label: string }[] = [
  { key: 'problem', label: 'The problem' },
  { key: 'solution', label: 'The solution' },
  { key: 'impact', label: 'Outcome' },
  { key: 'learnings', label: 'What I learned' },
];

const APPLICATION_TYPE: Record<string, string> = {
  'Web Application': 'WebApplication',
  'Desktop Application': 'DesktopApplication',
  'Android App': 'MobileApplication',
};

const OPERATING_SYSTEM: Record<string, string> = {
  'Web Application': 'Any',
  'Desktop Application': 'Windows',
  'Android App': 'Android',
};

/** Meta descriptions get truncated around 160 characters, so cut on a word. */
function clampDescription(text: string, limit = 158): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 100 ? lastSpace : limit).replace(/[,.;:\s]+$/, '')}…`;
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/projects" replace />;

  const url = `${SITE_URL}${projectPath(project.slug)}`;
  const description = clampDescription(project.description);
  const index = projectsData.findIndex(p => p.slug === project.slug);
  const previous = index > 0 ? projectsData[index - 1] : projectsData[projectsData.length - 1];
  const next = index < projectsData.length - 1 ? projectsData[index + 1] : projectsData[0];

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.longDescription.split('\n\n')[0],
    applicationCategory: APPLICATION_TYPE[project.category] ?? 'SoftwareApplication',
    operatingSystem: OPERATING_SYSTEM[project.category] ?? 'Any',
    url,
    image: `${SITE_URL}${project.image ?? '/Social_card.jpg'}`,
    author: { '@type': 'Person', name: 'Rolan Lobo', url: `${SITE_URL}/about` },
    keywords: project.technologies.join(', '),
    ...(project.github ? { codeRepository: project.github } : {}),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: url },
    ],
  };

  return (
    <>
      <SEO
        title={`${project.title} — ${project.category} Case Study | Rolan Lobo`}
        description={description}
        keywords={`${project.title}, ${project.technologies.join(', ')}, Rolan Lobo, ${project.category}`}
        url={url}
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <PageWrapper>
        <Container>
          <BackLink to="/projects">
            <span aria-hidden="true">←</span> All work
          </BackLink>

          <Hero>
            <PageLabel>Case study</PageLabel>
            <Category>{project.category}</Category>
            <Title>{project.title}</Title>
            <Lede>{project.description}</Lede>
          </Hero>

          {project.image && (
            <HeroImage>
              <img
                src={project.image}
                srcSet={project.imageSrcSet}
                sizes="(max-width: 768px) 100vw, 960px"
                alt={`${project.title} — ${project.category} by Rolan Lobo`}
                width={1200}
                height={630}
                loading="eager"
                decoding="async"
                style={project.imageFit === 'contain' ? { objectFit: 'contain' } : undefined}
              />
            </HeroImage>
          )}

          {CASE_STUDY_SECTIONS.map(({ key, label }) => (
            <Section key={key}>
              <SectionTitle>{label}</SectionTitle>
              <Prose>{project.caseStudy[key]}</Prose>
            </Section>
          ))}

          <Section>
            <SectionTitle>Stack</SectionTitle>
            <TechRow>
              {project.technologies.map(tech => (
                <TechTag key={tech}>{tech}</TechTag>
              ))}
            </TechRow>
          </Section>

          <Actions>
            <ActionLink $primary href={project.github} target="_blank" rel="noopener noreferrer">
              <GitHubSVG /> Source code
            </ActionLink>
            {project.liveDemo && (
              <ActionLink href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                <ExternalSVG /> Live demo
              </ActionLink>
            )}
            {project.download && !project.liveDemo && (
              <ActionLink href={project.download} target="_blank" rel="noopener noreferrer">
                <DownloadSVG /> Download
              </ActionLink>
            )}
          </Actions>

          <PrevNext aria-label="More case studies">
            <NeighbourLink to={projectPath(previous.slug)}>
              <span>Previous</span>
              <span>{previous.title}</span>
            </NeighbourLink>
            <NeighbourLink $align="right" to={projectPath(next.slug)}>
              <span>Next</span>
              <span>{next.title}</span>
            </NeighbourLink>
          </PrevNext>
        </Container>
      </PageWrapper>
    </>
  );
};

export default ProjectPage;
