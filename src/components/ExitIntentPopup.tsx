import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../styles/GlobalStyle';

// --- Types & Interfaces ---

interface ExitIntentPopupProps {
  /**
   * Main headline text.
   * @default "Wait, before you go..."
   */
  headline?: string;

  /**
   * Subtext or value proposition.
   * @default "I'm currently open for new opportunities. Let's connect!"
   */
  description?: string;

  /**
   * Primary Action Label
   * @default "View My Resume"
   */
  primaryActionLabel?: string;

  /**
   * Primary Action Handler
   */
  onPrimaryAction?: () => void;

  /**
   * Path to navigate to on primary action.
   */
  primaryActionPath?: string;

  /**
   * Delay in ms before the exit intent logic becomes active after mount.
   * Prevents popup from appearing immediately if user moves mouse up.
   * @default 2000
   */
  activationDelay?: number;
}

// --- Styled Components ---

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
`;

const Modal = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  background: rgba(23, 23, 23, 0.95); /* dark-950 equivalent but slightly lighter/transparent */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-2xl), 0 0 0 1px rgba(255, 255, 255, 0.05); /* Glowy effect */
  position: relative;
  overflow: hidden;
  text-align: center;

  /* Premium Glass Effect override if needed */
  @supports (backdrop-filter: blur(20px)) {
     background: rgba(9, 9, 11, 0.85); /* var(--dark-950) */
     backdrop-filter: blur(24px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  background: transparent;
  border: none;
  color: var(--dark-400);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--dark-100);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-6);
  color: var(--accent-primary);
  font-size: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Title = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  margin-bottom: var(--spacing-3);
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: var(--dark-300);
  margin-bottom: var(--spacing-8);
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  width: 100%;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: var(--spacing-4);
  }
`;

// --- Logic & Component ---

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  headline = "Wait, before you go...",
  description = "I'm currently available for new projects. Check out my latest work or grab a copy of my resume!",
  primaryActionLabel = "View Projects",
  onPrimaryAction,
  activationDelay = 2000,
  primaryActionPath
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // Activate the listener after a delay to prevent immediate triggers
  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), activationDelay);
    return () => clearTimeout(timer);
  }, [activationDelay]);

  const handleOpen = useCallback(() => {
    // Check if we've already shown it this session
    const hasSeen = sessionStorage.getItem('hasSeenExitPopup');
    if (!hasSeen && isActive) {
      setIsVisible(true);
      sessionStorage.setItem('hasSeenExitPopup', 'true');
    }
  }, [isActive]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else if (primaryActionPath) {
      navigate(primaryActionPath);
    } else {
      // Default fallback if nothing provided: Go to projects
      navigate('/projects');
    }
    handleClose();
  };

  // 1. Desktop Mouse Exit Listener
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse leaves the top of the viewport
      if (e.clientY <= 0) {
        handleOpen();
      }
    };

    if (isActive) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive, handleOpen]);

  // 2. Mobile/Focus Listener (Simulated "Exit" via visibility change or blur often too aggressive, using specific logic if needed)
  // For this "Premium" version, we keep it simple: Mouse leave on desktop is the gold standard for "Intent".
  // Optionally add a "Scroll Up Fast" trigger for mobile here if requested, but avoiding spam is priority.

  // 3. Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);


  return (
    <AnimatePresence>
      {isVisible && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose} // Click outside to close
        >
          <Modal
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
          >
            <CloseButton onClick={handleClose} aria-label="Close popup">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>

            <IconWrapper>
              <span role="img" aria-label="wave">👋</span>
            </IconWrapper>

            <Title id="exit-popup-title">{headline}</Title>
            <Description>{description}</Description>

            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ width: '100%' }}
              >
                Maybe Later
              </Button>
              <Button
                variant="primary"
                onClick={handlePrimaryClick}
                style={{ width: '100%' }}
              >
                {primaryActionLabel}
              </Button>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
