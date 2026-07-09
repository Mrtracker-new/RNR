import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { glassPanel, glassControl, glassControlHover } from '../styles/surfaces';

interface ExitIntentPopupProps {
  headline?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionPath?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionPath?: string;
  activationDelay?: number;
}

const Overlay = styled(m.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--scrim);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-5);
`;

const Modal = styled(m.div)`
  ${glassPanel};
  width: 100%;
  max-width: 420px;
  position: relative;
  padding: 44px 40px 36px;
  text-align: center;
  overflow: hidden;

  > * { position: relative; z-index: 1; }

  @media (max-width: 480px) {
    padding: 36px 28px 28px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  background: transparent;
  border: none;
  color: var(--dark-600);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--hairline-strong);
    color: var(--dark-300);
  }

  svg { width: 16px; height: 16px; }
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: var(--accent-subtle);
  border-radius: 50%;
  border: 1px solid var(--accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  line-height: 1.25;
`;

const Description = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  line-height: 1.7;
  max-width: 320px;
  margin: 0 auto 28px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 13px 24px;
  background: var(--accent-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: var(--accent-hover); }
  &:active { background: var(--accent-press); }
`;

const SecondaryBtn = styled.button`
  ${glassControl};
  ${glassControlHover};
  width: 100%;
  padding: 13px 24px;
  color: var(--dark-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: var(--dark-100);
  }
`;

const DismissLink = styled.button`
  background: none;
  border: none;
  color: var(--dark-600);
  font-size: var(--text-xs);
  cursor: pointer;
  margin-top: 18px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;

  &:hover { color: var(--dark-400); }
`;

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="var(--accent-primary)" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <path d="M2 12h20" />
  </svg>
);

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  headline = "Before you go —",
  description = "Grab my resume for a one-page summary of everything I've shipped, or head to the contact page to talk directly.",
  primaryActionLabel = "Download Resume",
  onPrimaryAction,
  primaryActionPath,
  secondaryActionLabel = "Start a Conversation →",
  onSecondaryAction,
  secondaryActionPath = "/contact",
  activationDelay = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), activationDelay);
    return () => clearTimeout(timer);
  }, [activationDelay]);

  const handleOpen = useCallback(() => {
    const hasSeen = sessionStorage.getItem('hasSeenExitPopup');
    if (!hasSeen && isActive) {
      setIsVisible(true);
      sessionStorage.setItem('hasSeenExitPopup', 'true');
    }
  }, [isActive]);

  const handleClose = useCallback(() => setIsVisible(false), []);

  const handlePrimaryClick = useCallback(() => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else if (primaryActionPath) {
      navigate(primaryActionPath);
    } else {
      window.open('/resume_rolan_lobo.pdf', '_blank', 'noopener,noreferrer');
    }
    handleClose();
  }, [onPrimaryAction, primaryActionPath, navigate, handleClose]);

  const handleSecondaryClick = useCallback(() => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (secondaryActionPath) {
      navigate(secondaryActionPath);
    }
    handleClose();
  }, [onSecondaryAction, secondaryActionPath, navigate, handleClose]);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) handleOpen(); };
    if (isActive) document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [isActive, handleOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isVisible) handleClose(); };
    if (isVisible) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, handleClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={handleClose}
          role="presentation"
        >
          <Modal
            initial={{ scale: 0.97, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
            aria-describedby="exit-popup-desc"
          >
            <CloseButton onClick={handleClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>

            <IconWrapper aria-hidden="true">
              <BriefcaseIcon />
            </IconWrapper>

            <Title id="exit-popup-title">{headline}</Title>
            <Description id="exit-popup-desc">{description}</Description>

            <ButtonGroup>
              <PrimaryBtn onClick={handlePrimaryClick} id="exit-popup-primary">
                {primaryActionLabel}
              </PrimaryBtn>
              <SecondaryBtn onClick={handleSecondaryClick} id="exit-popup-secondary">
                {secondaryActionLabel}
              </SecondaryBtn>
            </ButtonGroup>

            <DismissLink onClick={handleClose} aria-label="Dismiss this popup">
              No thanks, I'm done browsing
            </DismissLink>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
