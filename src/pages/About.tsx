import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { m, Variants } from 'framer-motion';
import { Container } from '../styles/GlobalStyle';
import { glassSurface, glassSurfaceHover, glassControl } from '../styles/surfaces';
import SEO from '../components/SEO';
import aboutImage from '../assets/images/Aboutme.webp';

const ResumeDownload = lazy(() => import('../components/ResumeDownload'));

/* ─── Motion ──────────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Root ────────────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  padding-top: 128px;
  padding-bottom: var(--spacing-24);

  @media (max-width: 768px) {
    padding-top: 80px;
    padding-bottom: var(--spacing-16);
  }
`;

/* ─── Shared section divider ──────────────────────────────────────────────── */

const Section = styled.section`
  padding: var(--spacing-16) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-of-type { border-bottom: none; padding-bottom: 0; }

  @media (max-width: 768px) { padding: var(--spacing-10) 0; }
  @media (max-width: 480px) { padding: var(--spacing-8) 0; }
`;

/* ─── Section heading row ─────────────────────────────────────────────────── */

const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-10);

  @media (max-width: 640px) { margin-bottom: var(--spacing-7); }
`;

const SectionLabel = styled(m.p)`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dark-600);
`;

const SectionCount = styled.span`
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--dark-700);
`;

/* ══════════════════════════════════════════════════════════════════════════ */
/* HERO                                                                       */
/* ══════════════════════════════════════════════════════════════════════════ */

const HeroSection = styled.section`
  padding: var(--spacing-14) 0 var(--spacing-14);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: var(--spacing-8) 0 var(--spacing-10);
  }

  @media (max-width: 480px) {
    padding: var(--spacing-6) 0 var(--spacing-8);
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--spacing-14);
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 220px;
    gap: var(--spacing-10);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
    /* Centre the image above the text cleanly */
    justify-items: center;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    /* When grid becomes single-column and justify-items:center is active,
     * force text column to fill the full width so text stays left-aligned */
    width: 100%;
    align-self: stretch;
    justify-self: stretch;
  }
`;

const HeroLabel = styled(m.p)`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-4);
`;

const HeroTitle = styled(m.h1)`
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: var(--font-extrabold);
  color: var(--dark-50);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--spacing-6);
`;

const HeroBio = styled(m.p)`
  font-size: var(--text-base);
  color: var(--dark-400);
  line-height: 1.8;
  margin-bottom: var(--spacing-8);
  max-width: 460px;
`;

const HeroImage = styled(m.div)`
  @media (max-width: 640px) {
    order: -1;
    /* Full width of the stacked column, constrained with max-width so it
     * doesn't stretch wall-to-wall. Centred via the parent flex column. */
    width: 100%;
    max-width: 240px;
    align-self: center;
  }

  @media (max-width: 400px) {
    max-width: 200px;
  }
`;

const ImageFrame = styled.div`
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--dark-900);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: brightness(0.85) saturate(0.9);
    transition: filter 0.45s ease;
  }

  &:hover img { filter: brightness(0.95) saturate(1); }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(9, 9, 11, 0.45) 100%);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    border-radius: var(--radius-xl);
    /* 4:5 portrait — taller than a square so the full subject fits without
     * harsh cropping. object-position shifts down so the person is centred
     * rather than anchored to the top (stairs) of the photo. */
    aspect-ratio: 4 / 5;

    img {
      object-position: center 30%;
    }
  }
`;

/* ══════════════════════════════════════════════════════════════════════════ */
/* TIMELINE                                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */

const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  /* Continuous vertical line — sits at the right edge of the year column */
  &::before {
    content: '';
    position: absolute;
    left: 148px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.06);

    @media (max-width: 560px) { display: none; }
  }
`;

const TimelineItem = styled(m.div)`
  display: grid;
  grid-template-columns: 148px 1fr;
  gap: var(--spacing-8);
  padding: var(--spacing-8) 0;
  position: relative;

  & + & { border-top: 1px solid rgba(255, 255, 255, 0.04); }

  /* Dot — centred on the vertical line (148px - 4.5px = ~144px left) */
  &::after {
    content: '';
    position: absolute;
    left: 144px;
    top: calc(var(--spacing-8) + 10px);
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--dark-900);
    border: 2px solid rgba(255, 255, 255, 0.14);
    transition: border-color 0.2s ease;

    @media (max-width: 560px) { display: none; }
  }

  &:hover::after { border-color: var(--accent-primary); }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
    padding: var(--spacing-6) 0;
  }
`;

const TimelineYear = styled.div`
  text-align: right;
  padding-top: 4px;
  /* Right padding creates the visual gap between the pill and the dot */
  padding-right: var(--spacing-8);

  @media (max-width: 560px) {
    text-align: left;
    padding-right: 0;
  }
`;

const YearPill = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--accent-primary);
  background: var(--accent-subtle);
  border: 1px solid var(--accent-border);
  padding: 3px 9px;
  border-radius: var(--radius-md);
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const TimelineContent = styled.div`
  padding-left: var(--spacing-6);

  @media (max-width: 560px) { padding-left: 0; }
`;

const TimelineTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--dark-100);
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin-bottom: 3px;
`;

const TimelineRole = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-600);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-4);
`;

const TimelineDesc = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-400);
  line-height: 1.78;
  margin-bottom: var(--spacing-4);
`;

const TimelineTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
`;

const TimelineTag = styled.span`
  ${glassControl}
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--dark-600);
  padding: 2px 9px;
  border-radius: var(--radius-sm);
`;

/* ══════════════════════════════════════════════════════════════════════════ */
/* SKILLS                                                                     */
/* ══════════════════════════════════════════════════════════════════════════ */

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-5);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
`;

const SkillCard = styled(m.div)`
  ${glassSurface}
  ${glassSurfaceHover}
  padding: var(--spacing-8);

  @media (max-width: 768px) { padding: var(--spacing-6); }
`;

const SkillCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SkillDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0.5;
  flex-shrink: 0;
`;

const SkillCategory = styled.h3`
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dark-500);
`;

const SkillChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillChip = styled.span`
  ${glassControl}
  font-size: 0.82rem;
  font-weight: var(--font-medium);
  color: var(--dark-300);
  padding: 5px 12px;
  border-radius: var(--radius-md);
  transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  cursor: default;
  line-height: 1.4;
  white-space: nowrap;

  &:hover {
    color: var(--accent-primary);
    border-color: var(--accent-border);
    background: var(--accent-subtle);
  }
`;

/* ══════════════════════════════════════════════════════════════════════════ */
/* FOCUS AREAS                                                                */
/* ══════════════════════════════════════════════════════════════════════════ */

const FocusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
`;

const FocusCard = styled(m.div)`
  ${glassSurface}
  ${glassSurfaceHover}
  padding: var(--spacing-8);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  position: relative;
  overflow: hidden;

  /* Left accent line slides up on hover */
  &::before {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    width: 2px;
    height: 0%;
    background: var(--accent-primary);
    opacity: 0.5;
    transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 0 2px 0 0;
  }

  &:hover::before { height: 100%; }

  @media (max-width: 768px) { padding: var(--spacing-6); }
`;

const FocusNumber = styled.span`
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--dark-700);
  letter-spacing: 0.08em;
`;

const FocusTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--dark-100);
  letter-spacing: -0.015em;
  line-height: 1.25;
`;

const FocusBody = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  line-height: 1.75;
  flex: 1;
`;

const FocusDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin-top: var(--spacing-2);
`;

const FocusProjects = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  padding-top: var(--spacing-1);
`;

const FocusProject = styled.span`
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--dark-600);
  letter-spacing: 0.02em;

  /* Dot separator — added via CSS so we don't clutter JSX */
  &:not(:last-child)::after {
    content: '·';
    margin-left: var(--spacing-3);
    color: var(--dark-800);
  }
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const timelineData = [
  {
    year: '2019',
    title: 'The Spark',
    role: 'Self-Taught',
    description:
      'Started self-learning programming — Python, web basics, first lines of code. The beginning of understanding what software can actually do, and why the details matter.',
    tags: ['Python', 'Web Basics', 'Self-Learning'],
  },
  {
    year: '2019 – 2022',
    title: 'Diploma in DTDM',
    role: 'Student',
    description:
      'Graduated with a Diploma in Tool & Die Making. Engineering precision at micron tolerances built a mindset that transferred directly into software: design for edge cases first, test every assumption, measure before you cut.',
    tags: ['Engineering', 'Precision', 'Problem Solving'],
  },
  {
    year: '2022 – 2023',
    title: 'Industry Experience',
    role: 'Tool & Die Designer',
    description:
      'Worked in precision manufacturing where errors are physically costly. This discipline carries into every codebase: validate inputs, handle failures gracefully, never ship what you haven\'t stress-tested under real conditions.',
    tags: ['CAD/CAM', 'Manufacturing', 'Quality Control'],
  },
  {
    year: '2024 – Present',
    title: 'Computer Science Degree',
    role: 'Student & Freelancer',
    description:
      'Pursuing CS while actively shipping real products for clients. Deepening foundations in algorithms, system design, and AI/ML — applied to actual problems, not just coursework exercises.',
    tags: ['Algorithms', 'System Design', 'AI/ML', 'Freelancing'],
  },
];

const skillsData = [
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Styled Components', 'Framer Motion', 'Responsive Design'],
  },
  {
    category: 'Backend',
    skills: ['Python', 'Flask', 'Node.js', 'REST APIs', 'Database Design', 'Authentication'],
  },
  {
    category: 'Tools & Workflow',
    skills: ['Git & GitHub', 'VS Code', 'Postman', 'npm / pip', 'Chrome DevTools', 'Figma'],
  },
  {
    category: 'Security & Systems',
    skills: ['AES-256', 'ECDH Key Exchange', 'Zero-Knowledge Design', 'Steganography', 'File System APIs', 'Cross-Platform'],
  },
];

const focusAreas = [
  {
    number: '01',
    title: 'Privacy & Security Tools',
    body: 'Software where privacy is an architecture constraint, not a feature. AES-256, zero-knowledge design, steganography — built into products people actually use.',
    projects: ['BAR', 'InvisioVault', 'LinkNest'],
  },
  {
    number: '02',
    title: 'Offline-First Software',
    body: 'Cloud dependency is a choice. Local-first architecture with optional sync — full user control, no account required to use the app.',
    projects: ['BAR Desktop', 'LinkNest', 'Contact Manager'],
  },
  {
    number: '03',
    title: 'Computer Vision',
    body: 'Cameras as accessibility input devices. MediaPipe landmark detection mapped to screen coordinates at sub-50ms latency — no specialist hardware.',
    projects: ['CursorCam'],
  },
  {
    number: '04',
    title: 'Cross-Platform Apps',
    body: 'One problem, the right platform. Web, Windows, Android, iOS — choosing the best tool per target rather than forcing a single stack everywhere.',
    projects: ['YT-Downloader', 'Contact Manager', 'Sortify'],
  },
];

const totalSkills = skillsData.reduce((n, g) => n + g.skills.length, 0);

/* ─── Component ───────────────────────────────────────────────────────────── */

const About: React.FC = () => (
  <>
    <SEO
      title="About Rolan Lobo — Software Developer"
      description="Rolan Lobo is a software developer from Karnataka, India, who crossed from precision manufacturing into software engineering. Specialising in privacy-focused tools, AES-256 encryption, zero-knowledge applications, and cross-platform software."
      keywords="About Rolan Lobo, Rolan RNR, Software Developer India, Privacy Tools Developer, Security Software Engineer, Freelance Developer India, Karnataka Developer, Open Source Developer"
      image="https://rolan-rnr.netlify.app/og-social-card.png"
      url="https://rolan-rnr.netlify.app/about"
    />

    <PageWrapper>
      <Container>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <HeroSection>
          <HeroGrid>

            <HeroContent>
              <HeroLabel
                variants={fadeUp}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                About
              </HeroLabel>

              <HeroTitle
                variants={fadeUp}
                custom={0.08}
                initial="hidden"
                animate="visible"
              >
                Engineered,<br />then coded.
              </HeroTitle>

              <HeroBio
                variants={fadeUp}
                custom={0.16}
                initial="hidden"
                animate="visible"
              >
                I crossed from precision manufacturing into software engineering —
                bringing a discipline where edge cases are assumed, not discovered.
                Today I build privacy-first tools, encryption software, and
                cross-platform apps that work without a cloud.
              </HeroBio>

              <m.div
                variants={fadeUp}
                custom={0.24}
                initial="hidden"
                animate="visible"
              >
                <Suspense fallback={null}>
                  <ResumeDownload variant="primary" size="lg" tooltipPosition="right" />
                </Suspense>
              </m.div>
            </HeroContent>

            <HeroImage
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageFrame>
                <img
                  src={aboutImage}
                  alt="Rolan Lobo — Software Developer"
                  loading="lazy"
                  decoding="async"
                />
              </ImageFrame>
            </HeroImage>

          </HeroGrid>
        </HeroSection>

        {/* ══ TIMELINE ══════════════════════════════════════════════════════ */}
        <Section>
          <SectionHeading>
            <SectionLabel
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              The Road Here
            </SectionLabel>
            <SectionCount>{timelineData.length} milestones</SectionCount>
          </SectionHeading>

          <Timeline>
            {timelineData.map((item, i) => (
              <TimelineItem
                key={i}
                custom={i * 0.07}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
              >
                <TimelineYear>
                  <YearPill>{item.year}</YearPill>
                </TimelineYear>

                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineRole>{item.role}</TimelineRole>
                  <TimelineDesc>{item.description}</TimelineDesc>
                  <TimelineTags>
                    {item.tags.map(t => <TimelineTag key={t}>{t}</TimelineTag>)}
                  </TimelineTags>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Section>

        {/* ══ SKILLS ════════════════════════════════════════════════════════ */}
        <Section>
          <SectionHeading>
            <SectionLabel
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              Skills & Stack
            </SectionLabel>
            <SectionCount>{totalSkills} tools</SectionCount>
          </SectionHeading>

          <SkillsGrid>
            {skillsData.map((group, i) => (
              <SkillCard
                key={group.category}
                custom={i * 0.07}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <SkillCardHeader>
                  <SkillDot aria-hidden="true" />
                  <SkillCategory>{group.category}</SkillCategory>
                </SkillCardHeader>
                <SkillChips>
                  {group.skills.map(s => <SkillChip key={s}>{s}</SkillChip>)}
                </SkillChips>
              </SkillCard>
            ))}
          </SkillsGrid>
        </Section>

        {/* ══ FOCUS AREAS ═══════════════════════════════════════════════════ */}
        <Section>
          <SectionHeading>
            <SectionLabel
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              What I Focus On
            </SectionLabel>
            <SectionCount>{focusAreas.length} areas</SectionCount>
          </SectionHeading>

          <FocusGrid>
            {focusAreas.map((area, i) => (
              <FocusCard
                key={area.number}
                custom={i * 0.07}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
              >
                <FocusNumber>{area.number}</FocusNumber>
                <FocusTitle>{area.title}</FocusTitle>
                <FocusBody>{area.body}</FocusBody>
                <FocusDivider aria-hidden="true" />
                <FocusProjects>
                  {area.projects.map(p => (
                    <FocusProject key={p}>{p}</FocusProject>
                  ))}
                </FocusProjects>
              </FocusCard>
            ))}
          </FocusGrid>
        </Section>

      </Container>
    </PageWrapper>
  </>
);

export default About;
