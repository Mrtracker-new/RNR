import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../styles/GlobalStyle';

// Import react-pdf stylesheets
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use local worker file from public directory
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface ResumeDownloadProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  showTooltip?: boolean;
}

// Wrapper to position the tooltip relative to the button
const ResumeButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

// Tooltip container that appears on hover
const PreviewTooltip = styled(motion.div) <{ position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  
  /* Position variants */
  ${props => {
    switch (props.position) {
      case 'top':
        return `
          bottom: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'right':
        return `
          left: calc(100% + 16px);
          top: 0;
        `;
      case 'bottom':
        return `
          top: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          right: calc(100% + 16px);
          top: 50%;
          transform: translateY(-50%);
        `;
    }
  }}
  
  /* Responsive positioning */
  @media (max-width: 768px) {
    display: none; /* Hide on mobile to avoid issues */
  }
`;

// Card container for the preview
const PreviewCard = styled.div<{ position: 'top' | 'right' | 'bottom' | 'left' }>`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5),
              0 0 20px rgba(100, 255, 218, 0.15);
  width: 320px;
  
  /* Arrow pointing to button - changes based on position */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    
    ${props => {
    switch (props.position) {
      case 'top':
        return `
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(30, 41, 59, 0.95);
          `;
      case 'right':
        return `
            left: -8px;
            top: 24px;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-right: 8px solid rgba(30, 41, 59, 0.95);
          `;
      case 'bottom':
        return `
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid rgba(30, 41, 59, 0.95);
          `;
      case 'left':
        return `
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 8px solid rgba(30, 41, 59, 0.95);
          `;
    }
  }}
  }
`;

// Preview PDF container
const PreviewPDFContainer = styled.div`
  width: 100%;
  background: var(--dark-800);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
  /* Style the PDF page */
  .react-pdf__Page {
    display: flex;
    justify-content: center;
  }
  
  .react-pdf__Page__canvas {
    max-width: 100%;
    height: auto !important;
    border-radius: var(--radius-md);
  }
`;

// Loading state
const LoadingPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 8.5 / 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  color: var(--dark-400);
  font-size: var(--text-sm);
  
  .icon {
    font-size: 2rem;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

// Error state
const ErrorPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 8.5 / 11;
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
  size = 'lg',
  tooltipPosition = 'top',
  showTooltip = true
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Preload PDF on component mount for instant hover preview
  useEffect(() => {
    // Preload the PDF file in the background
    const preloadPDF = async () => {
      try {
        const response = await fetch('/resume_rolan_lobo.pdf');
        await response.blob(); // Cache the PDF file
      } catch (error) {
        console.error('Error preloading PDF:', error);
      }
    };

    preloadPDF();
  }, []);

  const onDocumentLoadSuccess = () => {
    // PDF loaded successfully
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
  };

  return (
    <ResumeButtonWrapper
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Hidden pre-rendered PDF for instant caching - stays mounted */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        <Document
          file="/resume_rolan_lobo.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          <Page
            pageNumber={1}
            width={288}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

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
        {showTooltip && isHovering && (
          <PreviewTooltip
            position={tooltipPosition}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <PreviewCard position={tooltipPosition}>
              <PreviewPDFContainer>
                <Document
                  file="/resume_rolan_lobo.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <LoadingPlaceholder>
                      <span className="icon">📄</span>
                      <span>Loading preview...</span>
                    </LoadingPlaceholder>
                  }
                  error={
                    <ErrorPlaceholder>
                      <span className="icon">📄</span>
                      <span>Preview unavailable</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                        Click button to download
                      </span>
                    </ErrorPlaceholder>
                  }
                >
                  <Page
                    pageNumber={1}
                    width={288}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </PreviewPDFContainer>
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
