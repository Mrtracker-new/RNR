import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../styles/GlobalStyle';

interface ResumeDownloadProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// Wrapper to position the tooltip relative to the button
const ResumeButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

// Tooltip container that appears on hover
const PreviewTooltip = styled(motion.div)`
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
  
  /* Responsive positioning */
  @media (max-width: 768px) {
    display: none; /* Hide on mobile to avoid issues */
  }
`;

// Card container for the preview
const PreviewCard = styled.div`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5),
              0 0 20px rgba(100, 255, 218, 0.15);
  width: 320px;
  
  /* Arrow pointing down to button */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(30, 41, 59, 0.95);
  }
`;

// Preview image container
const PreviewImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 8.5 / 11; /* Standard letter size ratio */
  background: var(--dark-800);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// Placeholder for when no preview image exists
const PreviewPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  color: var(--dark-400);
  font-size: var(--text-sm);
  text-align: center;
  padding: var(--spacing-4);
  
  .icon {
    font-size: 3rem;
    opacity: 0.5;
  }
`;

// Hint text
const HintText = styled.p`
  font-size: var(--text-xs);
  color: var(--dark-400);
  text-align: center;
  margin: 0;
  
  span {
    color: var(--accent-primary);
    font-weight: var(--font-medium);
  }
`;

const ResumeDownload: React.FC<ResumeDownloadProps> = ({
  variant = 'outline',
  size = 'lg'
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Check if preview image exists (you'll add this file later)
  const previewImagePath = '/resume_preview.png';
  const hasPreviewImage = false; // Set to true once you add the image

  return (
    <ResumeButtonWrapper
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        as="a"
        href="/resume_rolan_lobo.pdf"
        download="Rolan_Lobo_Resume.pdf"
        variant={variant}
        size={size}
        aria-label="Download Rolan Lobo's Resume"
      >
        📄 Download Resume
      </Button>

      <AnimatePresence>
        {isHovering && (
          <PreviewTooltip
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <PreviewCard>
              <PreviewImageContainer>
                {hasPreviewImage ? (
                  <img
                    src={previewImagePath}
                    alt="Resume Preview"
                    aria-hidden="true"
                  />
                ) : (
                  <PreviewPlaceholder>
                    <span className="icon">📄</span>
                    <span>Resume Preview</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                      Add resume_preview.png to public folder
                    </span>
                  </PreviewPlaceholder>
                )}
              </PreviewImageContainer>
              <HintText>
                <span>Click</span> to download full resume
              </HintText>
            </PreviewCard>
          </PreviewTooltip>
        )}
      </AnimatePresence>
    </ResumeButtonWrapper>
  );
};

export default ResumeDownload;
