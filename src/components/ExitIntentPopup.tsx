import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../styles/GlobalStyle';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--spacing-4);
`;

const PopupContainer = styled(motion.div)`
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-10);
  max-width: 600px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px rgba(100, 255, 218, 0.2);
  
  @media (max-width: 768px) {
    padding: var(--spacing-8);
    max-width: 90vw;
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-6);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--dark-300);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    transform: rotate(90deg);
  }
`;

const IconContainer = styled.div`
  text-align: center;
  font-size: 4rem;
  margin-bottom: var(--spacing-4);
  animation: wave 2s ease-in-out infinite;
  
  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const Title = styled.h2`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--dark-50);
  text-align: center;
  margin-bottom: var(--spacing-3);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 480px) {
    font-size: var(--text-2xl);
  }
`;

const Subtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--dark-300);
  text-align: center;
  margin-bottom: var(--spacing-8);
  line-height: 1.6;
  
  @media (max-width: 480px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-6);
  }
`;

const OfferList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: var(--spacing-8);
  
  li {
    color: var(--dark-300);
    margin-bottom: var(--spacing-3);
    padding-left: var(--spacing-8);
    position: relative;
    font-size: var(--text-base);
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-primary);
      font-weight: bold;
      font-size: var(--text-xl);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--spacing-3);
  }
`;

const StyledButton = styled(Button)`
  flex: 1;
  min-width: 150px;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const TimerBadge = styled.div`
  display: inline-block;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-6);
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

interface ExitIntentPopupProps {
  onClose?: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose();
    
    // Store that popup was shown (expires in 24 hours)
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('exitIntentShown', expiryTime.toString());
    setHasShown(true);
  }, [onClose]);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger if mouse leaves from top of screen
    if (e.clientY <= 0 && !hasShown) {
      // Check if popup was already shown today
      const lastShown = localStorage.getItem('exitIntentShown');
      
      if (lastShown) {
        const expiryTime = parseInt(lastShown, 10);
        if (Date.now() < expiryTime) {
          return; // Don't show if within 24 hours
        }
      }
      
      setIsVisible(true);
    }
  }, [hasShown]);

  useEffect(() => {
    // Check if user has seen popup recently
    const lastShown = localStorage.getItem('exitIntentShown');
    if (lastShown) {
      const expiryTime = parseInt(lastShown, 10);
      if (Date.now() < expiryTime) {
        setHasShown(true);
        return;
      }
    }

    // Add event listener with delay to avoid false positives on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  // Don't render if already shown
  if (hasShown) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <PopupContainer
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose} aria-label="Close popup">
              ×
            </CloseButton>

            <IconContainer>👋</IconContainer>

            <Title>Wait! Before You Go...</Title>

            <Subtitle>
              I'd love to help bring your next project to life!
            </Subtitle>

            <div style={{ textAlign: 'center' }}>
              <TimerBadge>⚡ Let's Connect!</TimerBadge>
            </div>

            <OfferList>
              <li>Free project consultation & estimate</li>
              <li>Modern, responsive web applications</li>
              <li>Security-focused desktop applications</li>
              <li>Mobile app development</li>
              <li>Fast turnaround & dedicated support</li>
            </OfferList>

            <ButtonGroup>
              <StyledButton
                as={Link}
                to="/contact"
                variant="primary"
                size="lg"
                onClick={handleClose}
              >
                💬 Get In Touch
              </StyledButton>
              <StyledButton
                as={Link}
                to="/projects"
                variant="outline"
                size="lg"
                onClick={handleClose}
              >
                👀 View Projects
              </StyledButton>
            </ButtonGroup>

            <div style={{ 
              textAlign: 'center', 
              marginTop: 'var(--spacing-6)', 
              fontSize: 'var(--text-sm)', 
              color: 'var(--dark-500)' 
            }}>
              <p>📧 rolanlobo901@gmail.com</p>
              <p style={{ marginTop: 'var(--spacing-2)' }}>
                Available for freelance projects
              </p>
            </div>
          </PopupContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
