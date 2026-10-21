import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { Button } from '../styles/GlobalStyle';
import { glassSurface, glassControl } from '../styles/surfaces';
import { DownloadSVG } from './icons';

interface ResumeDownloadProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  showTooltip?: boolean;
  /** Notified whenever the preview opens or closes (hover, focus or Escape). */
  onPreviewChange?: (previewing: boolean) => void;
}

const ResumeButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const PreviewTooltip = styled(m.div) <{ $position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  z-index: 1000;
  pointer-events: none;

  ${props => {
    switch (props.$position) {
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const PreviewCard = styled.div<{ $position: 'top' | 'right' | 'bottom' | 'left' }>`
  ${glassSurface}
  padding: var(--spacing-4);
  width: 320px;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;

    ${props => {
      switch (props.$position) {
        case 'top':
          return `
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid var(--bg-overlay);
          `;
        case 'right':
          return `
            left: -8px;
            top: 24px;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-right: 8px solid var(--bg-overlay);
          `;
        case 'bottom':
          return `
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid var(--bg-overlay);
          `;
        case 'left':
          return `
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 8px solid var(--bg-overlay);
          `;
      }
    }}
  }
`;

const PreviewImageContainer = styled.div`
  ${glassControl}
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-3);
  position: relative;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius-md);
  }
`;

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
  showTooltip = true,
  onPreviewChange,
}) => {
  const [previewing, setPreviewing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onPreviewChangeRef = useRef(onPreviewChange);

  useEffect(() => {
    onPreviewChangeRef.current = onPreviewChange;
  }, [onPreviewChange]);

  useEffect(() => {
    onPreviewChangeRef.current?.(previewing);
  }, [previewing]);

  const setPreview = useCallback((next: boolean) => setPreviewing(next), []);

  useEffect(() => {
    if (!previewing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewing(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [previewing]);

  return (
    <ResumeButtonWrapper
      ref={wrapperRef}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      onFocus={() => setPreview(true)}
      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPreview(false);
      }}
    >
      <Button
        as="a"
        href="/Rolan_Lobo_Resume.pdf"
        download="Rolan_Lobo_Resume.pdf"
        $variant={variant}
        $size={size}
        aria-label="Download Resume — Rolan Lobo (PDF)"
      >
        <DownloadSVG /> Download Resume
      </Button>

      <AnimatePresence>
        {showTooltip && previewing && (
          <PreviewTooltip
            $position={tooltipPosition}
            aria-hidden="true"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <PreviewCard $position={tooltipPosition}>
              <PreviewImageContainer>
                <img src="/Resume_preview.avif" alt="" loading="lazy" decoding="async" />
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
