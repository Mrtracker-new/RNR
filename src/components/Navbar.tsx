import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollOptimizer } from '../utils/performance';

// Fixed container ensuring it stays on top
const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--spacing-4);
  pointer-events: none; /* Let clicks pass through the padding area */
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

// The actual "Island" navbar
const NavbarIsland = styled(motion.nav) <{ scrolled: boolean }>`
  pointer-events: auto; /* Re-enable clicks */
  width: 100%;
  max-width: var(--breakpoint-lg);
  background: rgba(9, 9, 11, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-3) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* Desktop: Floating Island */
  @media (min-width: 769px) {
    margin-top: ${props => props.scrolled ? 'var(--spacing-2)' : 'var(--spacing-4)'};
    background: ${props => props.scrolled ? 'rgba(9, 9, 11, 0.8)' : 'rgba(9, 9, 11, 0.5)'};
    width: ${props => props.scrolled ? 'auto' : '100%'}; /* Shrink on scroll? maybe just stay wide */
    min-width: 600px;
  }

  /* Mobile: Full width top bar */
  @media (max-width: 768px) {
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    background: rgba(9, 9, 11, 0.9);
    padding: var(--spacing-4);
  }
`;

const Logo = styled(Link)`
  font-size: var(--text-lg);
  font-weight: var(--font-extrabold);
  color: var(--dark-100);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  z-index: 10;
  position: relative;
  
  span {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-1);
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: var(--radius-lg); // Changed from radius-full
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link) <{ active: boolean }>`
  position: relative;
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--dark-400)'};
  text-decoration: none;
  transition: color 0.3s ease;
  z-index: 1;
  border-radius: var(--radius-md);
  display: flex; // Ensure block model
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--dark-100);
  }
`;

const NavItemExternal = styled.a`
  position: relative;
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-400);
  text-decoration: none;
  transition: color 0.3s ease;
  z-index: 1;
  border-radius: var(--radius-md);
  display: flex; // Ensure block model
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--dark-100);
  }
`;

const ActivePill = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.08);
  z-index: -1; // Behind content
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--dark-100);
  padding: var(--spacing-2);
  cursor: pointer;
  z-index: 20;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-950);
  z-index: 15;
  padding: 80px var(--spacing-6) var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const MobileLink = styled(Link)`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--dark-200);
  text-decoration: none;
  padding: var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:active {
    color: var(--accent-primary);
    background: rgba(255, 255, 255, 0.02);
  }
`;

const MobileLinkExternal = styled.a`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--dark-200);
  text-decoration: none;
  padding: var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: 'https://rnr-still-figuring-things-out.hashnode.dev/', label: 'Blog', external: true },
  { path: '/contact', label: 'Contact' }
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScrollUpdate = ({ scrollY }: { scrollY: number }) => {
      setScrolled(scrollY > 20);
    };
    const unsubscribe = scrollOptimizer.subscribe(handleScrollUpdate);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <FixedContainer>
        <NavbarIsland
          scrolled={scrolled}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Logo to="/" onClick={() => setMobileMenuOpen(false)}>
            <span>RNR</span>
          </Logo>

          <NavLinks>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} style={{ position: 'relative' }}>
                  {item.external ? (
                    <NavItemExternal
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}  <span style={{ fontSize: '0.8em', opacity: 0.5 }}>↗</span>
                    </NavItemExternal>
                  ) : (
                    <NavItem
                      to={item.path}
                      active={isActive}
                    >
                      {item.label}
                      {isActive && (
                        <ActivePill
                          layoutId="nav-pill"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          style={{ inset: 0 }} // Ensure pill covers the item area
                        />
                      )}
                    </NavItem>
                  )}
                </div>
              );
            })}
          </NavLinks>

          <MobileToggle onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </MobileToggle>
        </NavbarIsland>
      </FixedContainer>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {item.external ? (
                  <MobileLinkExternal
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label} ↗
                  </MobileLinkExternal>
                ) : (
                  <MobileLink to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.span layoutId="mobile-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </MobileLink>
                )}
              </motion.div>
            ))}

            <motion.div
              style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--dark-400)', fontSize: '0.9rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              © {new Date().getFullYear()} Rolan Lobo
            </motion.div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
