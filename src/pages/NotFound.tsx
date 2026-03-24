import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 60px 20px;
`;

const Code = styled(motion.span)`
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.05em;
`;

const Title = styled(motion.h1)`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  color: var(--dark-200);
  margin: var(--spacing-4) 0 var(--spacing-3);
`;

const Sub = styled(motion.p)`
  color: var(--dark-400);
  font-size: var(--text-base);
  margin-bottom: var(--spacing-8);
`;

const HomeLink = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-8);
  background: var(--accent-gradient);
  color: var(--dark-950);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
    color: var(--dark-950);
  }
`;

const NotFound: React.FC = () => (
  <PageTransition>
    <SEO
      title="404 — Page Not Found | Rolan Lobo"
      description="The page you're looking for doesn't exist."
    />
    <Wrapper>
      <Code
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </Code>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Page not found
      </Title>
      <Sub
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        This page doesn't exist or was moved.
      </Sub>
      <HomeLink
        to="/"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        ← Go Home
      </HomeLink>
    </Wrapper>
  </PageTransition>
);

export default NotFound;
