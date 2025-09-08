import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding: var(--spacing-8);
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  ${props => {
    const size = props.size || 'md';
    const sizes = {
      sm: '20px',
      md: '32px',
      lg: '48px'
    };
    return `width: ${sizes[size]}; height: ${sizes[size]};`;
  }}
  
  border: 2px solid var(--dark-800);
  border-top: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const DotsSpinner = styled.div`
  display: flex;
  gap: var(--spacing-2);
`;

const Dot = styled.div<{ delay: number }>`
  width: 6px;
  height: 6px;
  background: var(--accent-primary);
  border-radius: 50%;
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.8;
`;

const RippleSpinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  position: relative;
  ${props => {
    const size = props.size || 'md';
    const sizes = {
      sm: '40px',
      md: '60px',
      lg: '80px'
    };
    return `width: ${sizes[size]}; height: ${sizes[size]};`;
  }}
`;

const ripple = keyframes`
  0% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

const RippleElement = styled.div<{ delay: number }>`
  position: absolute;
  border: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  animation-delay: ${props => props.delay}s;
`;

const LoadingText = styled.p<{ variant?: 'default' | 'gradient' }>`
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  color: ${props => props.variant === 'gradient' ? 'var(--accent-primary)' : 'var(--dark-400)'};
  opacity: 0.9;
`;

interface LoadingSpinnerProps {
  type?: 'spinner' | 'dots' | 'ripple';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  textVariant?: 'default' | 'gradient';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'spinner',
  size = 'md',
  text = 'Loading...',
  textVariant = 'default',
  className
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <DotsSpinner>
            {[0, 0.2, 0.4].map((delay, index) => (
              <Dot key={index} delay={delay} />
            ))}
          </DotsSpinner>
        );
      case 'ripple':
        return (
          <RippleSpinner size={size}>
            {[0, 0.5].map((delay, index) => (
              <RippleElement key={index} delay={delay} />
            ))}
          </RippleSpinner>
        );
      default:
        return <Spinner size={size} />;
    }
  };

  return (
    <LoadingContainer
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderSpinner()}
      {text && <LoadingText variant={textVariant}>{text}</LoadingText>}
    </LoadingContainer>
  );
};

// Full screen loading overlay
export const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

interface FullScreenLoadingProps {
  text?: string;
  onComplete?: () => void;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  text = 'Loading Portfolio...',
  onComplete
}) => {
  return (
    <LoadingOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <LoadingSpinner
        type="ripple"
        size="lg"
        text={text}
        textVariant="gradient"
      />
    </LoadingOverlay>
  );
};

export default LoadingSpinner;
