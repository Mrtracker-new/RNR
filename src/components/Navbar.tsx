import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollOptimizer } from '../utils/performance';

const NavbarContainer = styled(motion.nav)<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 'rgba(9, 9, 11, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(12px)' : 'none'};
  border-bottom: ${props => props.scrolled ? '1px solid var(--dark-800)' : '1px solid transparent'};
  transition: var(--transition-normal);
  padding: var(--spacing-5) 0;

  @media (max-width: 768px) {
    padding: var(--spacing-4) 0;
  }

  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
    background: ${props => props.scrolled ? 'var(--dark-950)' : 'transparent'};
  }
`;

const NavContent = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 0 var(--spacing-4);
  }

  @media (max-width: 360px) {
    padding: 0 var(--spacing-3);
  }

  @media (min-width: 640px) {
    padding: 0 var(--spacing-6);
  }

  @media (min-width: 1024px) {
    padding: 0 var(--spacing-8);
  }
`;

const Logo = styled(Link)`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: var(--transition-normal);
  letter-spacing: -0.025em;

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(100, 255, 218, 0.3));
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-6);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  position: relative;
  padding: var(--spacing-2) var(--spacing-3);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--dark-400)'};
  text-decoration: none;
  transition: var(--transition-fast);
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--dark-200);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: ${props => props.active ? '20px' : '0'};
    height: 2px;
    background: var(--accent-primary);
    transform: translateX(-50%);
    transition: var(--transition-fast);
    border-radius: var(--radius-full);
  }

  &:hover::after {
    width: 20px;
  }
`;

const MobileMenuButton = styled.button<{ open: boolean }>`
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background: var(--dark-800);
  }

  span {
    display: block;
    width: 18px;
    height: 2px;
    background: var(--dark-300);
    margin: 2px 0;
    transition: var(--transition-fast);
    transform-origin: center;
    border-radius: var(--radius-full);

    &:nth-child(1) {
      transform: ${props => props.open ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${props => props.open ? '0' : '1'};
    }

    &:nth-child(3) {
      transform: ${props => props.open ? 'rotate(-45deg) translate(5px, -5px)' : 'none'};
    }
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(9, 9, 11, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--dark-800);
  padding: var(--spacing-4) 0;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ active: boolean }>`
  display: block;
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--dark-400)'};
  text-decoration: none;
  transition: var(--transition-fast);
  border-left: ${props => props.active ? '2px solid var(--accent-primary)' : '2px solid transparent'};

  &:hover {
    color: var(--dark-200);
    border-left-color: var(--accent-primary);
    background: var(--dark-900);
  }
`;

const ScrollProgress = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  transform-origin: left;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
`;

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' }
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScrollUpdate = (scrollData: any) => {
      const { scrollY } = scrollData;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / Math.max(docHeight, 1)) * 100;
      
      setScrolled(scrollY > 50);
      setScrollProgress(scrollPercent);
    };

    const unsubscribe = scrollOptimizer.subscribe(handleScrollUpdate);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <NavbarContainer
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavContent>
        <Logo to="/" onClick={closeMobileMenu}>
          RNR
        </Logo>

        <NavLinks>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <MobileMenuButton
          open={mobileMenuOpen}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </NavContent>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map(item => (
              <MobileNavLink
                key={item.path}
                to={item.path}
                active={location.pathname === item.path}
                onClick={closeMobileMenu}
              >
                {item.label}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>

      <ScrollProgress
        style={{ scaleX: scrollProgress / 100 }}
      />
    </NavbarContainer>
  );
};

export default Navbar;
