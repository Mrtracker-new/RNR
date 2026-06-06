import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const borderPulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 0.8; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-5);
`;

const Modal = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  position: relative;
  border-radius: 20px;
  padding: 44px 40px 36px;
  text-align: center;
  overflow: hidden;
  background: rgba(10, 10, 12, 0.96);
  border: 1px solid rgba(100, 255, 218, 0.12);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 32px 80px rgba(0, 0, 0, 0.6),
    0 0 100px rgba(100, 255, 218, 0.03);

  @supports (backdrop-filter: blur(24px)) {
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(100, 255, 218, 0.45) 0%,
      rgba(139, 92, 246, 0.25) 50%,
      rgba(100, 255, 218, 0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    animation: ${borderPulse} 3.5s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    height: 140px;
    background: radial-gradient(ellipse, rgba(100, 255, 218, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

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
    background: rgba(255, 255, 255, 0.07);
    color: var(--dark-300);
  }

  svg { width: 16px; height: 16px; }
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  border-radius: 50%;
  border: 1px solid rgba(100, 255, 218, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  font-size: 1.35rem;
  font-weight: var(--font-bold);
  color: var(--dark-50);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  line-height: 1.25;
`;

const Description = styled.p`
  font-size: 0.9rem;
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
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  color: #09090b;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: var(--font-semibold);
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  padding: 13px 24px;
  background: transparent;
  color: var(--dark-300);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: var(--font-medium);
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.18);
    color: var(--dark-100);
  }
`;

const DismissLink = styled.button`
  background: none;
  border: none;
  color: var(--dark-600);
  font-size: 0.78rem;
  cursor: pointer;
  margin-top: 18px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;

  &:hover { color: var(--dark-400); }
`;

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="url(#bGrad)" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <defs>
      <linearGradient id="bGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64ffda" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
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
