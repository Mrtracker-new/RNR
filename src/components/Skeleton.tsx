import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    var(--dark-800) 0%,
    var(--dark-700) 50%,
    var(--dark-800) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: var(--radius-md);
`;

// Skeleton Card for Project Cards
export const SkeletonCard = styled(motion.div)`
  background: var(--dark-800);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  padding: 0;
  overflow: hidden;
  min-height: 520px;
  display: flex;
  flex-direction: column;
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 240px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-6);

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  margin-bottom: var(--spacing-3);
`;

export const SkeletonTitle = styled(SkeletonBase)`
  width: 70%;
  height: 24px;
  margin-bottom: var(--spacing-4);
`;

export const SkeletonParagraph = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
`;

export const SkeletonButton = styled(SkeletonBase)`
  width: 120px;
  height: 40px;
  border-radius: var(--radius-lg);
`;

export const SkeletonBadge = styled(SkeletonBase)`
  width: 80px;
  height: 24px;
  border-radius: var(--radius-md);
  display: inline-block;
  margin-right: var(--spacing-2);
`;

// Project Card Skeleton
export const ProjectCardSkeleton: React.FC = () => {
  return (
    <SkeletonCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ padding: '0' }}>
        <SkeletonImage />
      </div>
      
      <div style={{ padding: 'var(--spacing-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SkeletonTitle />
        
        <SkeletonParagraph>
          <SkeletonText width="100%" />
          <SkeletonText width="95%" />
          <SkeletonText width="80%" />
        </SkeletonParagraph>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'auto' }}>
          <SkeletonButton style={{ flex: 1 }} />
          <SkeletonButton style={{ flex: 1 }} />
        </div>
      </div>
    </SkeletonCard>
  );
};

// Grid of Skeleton Cards
interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
};

// Service Card Skeleton for About Page
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <SkeletonCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '300px', padding: 'var(--spacing-6)' }}
    >
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'linear-gradient(90deg, var(--dark-800) 0%, var(--dark-700) 50%, var(--dark-800) 100%)',
        backgroundSize: '1000px 100%',
        animation: `${shimmer} 2s infinite linear`,
        margin: '0 auto var(--spacing-6)'
      }} />
      
      <SkeletonTitle style={{ margin: '0 auto var(--spacing-4)', width: '60%' }} />
      
      <SkeletonParagraph>
        <SkeletonText />
        <SkeletonText width="90%" />
        <SkeletonText width="85%" />
      </SkeletonParagraph>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
        <SkeletonText width="80%" height="12px" />
        <SkeletonText width="75%" height="12px" />
        <SkeletonText width="85%" height="12px" />
        <SkeletonText width="70%" height="12px" />
      </div>
    </SkeletonCard>
  );
};

// Skill Card Skeleton
export const SkillCardSkeleton: React.FC = () => {
  return (
    <SkeletonCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '150px', padding: 'var(--spacing-6)', textAlign: 'center' }}
    >
      <SkeletonTitle style={{ margin: '0 auto var(--spacing-4)', width: '50%' }} />
      <SkeletonText width="80%" style={{ margin: '0 auto var(--spacing-6)' }} />
      
      <div style={{ 
        width: '100%', 
        height: '10px', 
        borderRadius: 'var(--radius-sm)',
        background: 'var(--dark-800)',
        marginBottom: 'var(--spacing-4)',
        overflow: 'hidden'
      }}>
        <SkeletonBase style={{ height: '100%', width: '70%' }} />
      </div>
      
      <SkeletonText width="30%" style={{ margin: '0 auto' }} />
    </SkeletonCard>
  );
};

const SkeletonComponents = {
  ProjectCardSkeleton,
  SkeletonGrid,
  ServiceCardSkeleton,
  SkillCardSkeleton,
  SkeletonCard,
  SkeletonImage,
  SkeletonText,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonButton,
  SkeletonBadge
};

export default SkeletonComponents;
