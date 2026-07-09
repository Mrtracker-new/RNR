import styled from 'styled-components';

/*
 * Shared layout primitives.
 *
 * SectionHeading is the one piece every page adopted: it renders a real
 * <h2> (pages previously used styled <p> labels, leaving no h2 in the
 * document outline) with an optional eyebrow and a right-aligned count.
 * MicroLabel is the uppercase mono eyebrow it composes — exported so pages
 * can reuse the exact same eyebrow standalone.
 */

// ── Eyebrow / micro-label ──────────────────────────────────────────────────
export const MicroLabel = styled.p`
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dark-400);
`;

// ── Section heading (real <h2>) ─────────────────────────────────────────────
const SectionHeadRoot = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-10);

  @media (max-width: 640px) {
    margin-bottom: var(--spacing-7);
  }
`;

const SectionHeadMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const SectionH2 = styled.h2`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--dark-50);

  @media (max-width: 640px) {
    font-size: var(--text-2xl);
  }
`;

const SectionAside = styled.div`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dark-500);
`;

interface SectionHeadingProps {
  label?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function SectionHeading({ label, title, aside, className }: SectionHeadingProps) {
  return (
    <SectionHeadRoot className={className}>
      <SectionHeadMain>
        {label && <MicroLabel>{label}</MicroLabel>}
        <SectionH2>{title}</SectionH2>
      </SectionHeadMain>
      {aside && <SectionAside>{aside}</SectionAside>}
    </SectionHeadRoot>
  );
}
