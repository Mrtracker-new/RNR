import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import { scrollOptimizer } from '../utils/performance';
import { glassPanel } from '../styles/surfaces';

const FixedContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* Raised above MobileMenu (1100) so the toggle child stays tappable over the open menu. */
  z-index: 1200;
  padding: var(--spacing-4);
  pointer-events: none;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const NavbarIsland = styled(m.nav)<{ $scrolled: boolean }>`
  ${glassPanel}
  pointer-events: auto;
  width: 100%;
  max-width: 1200px;
  padding: var(--spacing-3) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 769px) {
    margin-top: ${props => props.$scrolled ? 'var(--spacing-2)' : 'var(--spacing-4)'};
    background: ${props => props.$scrolled ? 'var(--panel-bg-hover)' : 'var(--panel-bg)'};
    min-width: 600px;
  }

  @media (max-width: 768px) {
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: var(--spacing-3) var(--spacing-4);
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
    color: var(--dark-50);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-1);
  position: relative;
  background: var(--hairline-faint);
  padding: var(--spacing-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--divider);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--dark-400)'};
  text-decoration: none;
  transition: color 0.3s ease;
  z-index: 1;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--dark-100);
  }
`;

const ActivePill = styled(m.div)`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  background: var(--hairline-strong);
  z-index: -1;
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--dark-100);
  padding: var(--spacing-2);
  cursor: pointer;
  z-index: 20;
  font-size: var(--text-2xl);

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(m.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-950);
  /* Sits above page content but just below the nav island (z:1200) so the
     logo + toggle stay visible/tappable over the open menu. */
  z-index: 1100;
  /* Top pad clears the fixed nav island so the first link isn't hidden. */
  padding: var(--spacing-20) var(--spacing-6) var(--spacing-6);
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
  border-bottom: 1px solid var(--divider);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:active {
    color: var(--accent-primary);
    background: var(--hairline-faint);
  }
`;

const navItems = [
  { path: '/',         label: 'Home'    },
  { path: '/about',    label: 'About'   },
  { path: '/projects', label: 'Work'    },
  { path: '/blog',     label: 'Blog'    },
  { path: '/contact',  label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScrollUpdate = ({ scrollY }: { scrollY: number }) => {
      setScrolled(scrollY > 20);
    };
    const unsubscribe = scrollOptimizer.subscribe(handleScrollUpdate);
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
  }, [mobileMenuOpen]);

  return (
    <>
      <FixedContainer>
        <NavbarIsland
          $scrolled={scrolled}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Logo to="/" onClick={() => setMobileMenuOpen(false)}>
            <span>RNR</span>
          </Logo>

          <NavLinks>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} style={{ position: 'relative' }}>
                  <NavItem to={item.path} $active={isActive}>
                    {item.label}
                    {isActive && (
                      <ActivePill
                        layoutId="nav-pill"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ inset: 0 }}
                      />
                    )}
                  </NavItem>
                </div>
              );
            })}
          </NavLinks>

          <MobileToggle
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </MobileToggle>
        </NavbarIsland>
      </FixedContainer>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {navItems.map((item, index) => (
              <m.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MobileLink to={item.path} onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <m.span
                      layoutId="mobile-dot"
                      style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}
                    />
                  )}
                </MobileLink>
              </m.div>
            ))}

            <m.div
              style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--dark-500)', fontSize: '0.85rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              © {new Date().getFullYear()} Rolan Lobo
            </m.div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
