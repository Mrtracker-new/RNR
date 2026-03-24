import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  border-top: 1px solid var(--dark-800);
  background: var(--dark-950);
  padding: var(--spacing-8) 0;
`;

const Inner = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-4);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Brand = styled.span`
  font-size: var(--text-sm);
  color: var(--dark-400);

  span {
    color: var(--accent-primary);
    font-weight: var(--font-semibold);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--spacing-6);
`;

const NavLink = styled(Link)`
  font-size: var(--text-sm);
  color: var(--dark-400);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-primary);
  }
`;

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Inner>
        <Brand>© {year} <span>Rolan Lobo</span></Brand>
        <Nav aria-label="Footer navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </Nav>
      </Inner>
    </FooterWrapper>
  );
};

export default Footer;
