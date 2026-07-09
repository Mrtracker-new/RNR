import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { m } from 'framer-motion';
import SEO from '../components/SEO';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 60px 20px;
`;

const Code = styled(m.span)`
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: var(--font-extrabold);
  line-height: 1;
  color: var(--dark-800);
  letter-spacing: -0.05em;
`;

const Title = styled(m.h1)`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  color: var(--dark-200);
  margin: var(--spacing-4) 0 var(--spacing-3);
`;

const Sub = styled(m.p)`
  color: var(--dark-400);
  font-size: var(--text-base);
  margin-bottom: var(--spacing-8);
`;

const HomeLink = styled(m(Link))`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-8);
  background: var(--accent-primary);
  color: #ffffff;
  font-weight: var(--font-semibold);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background var(--transition-normal);

  &:hover {
    background: var(--accent-hover);
    color: #ffffff;
  }
`;

const NotFound: React.FC = () => (
  <>
    <SEO
      title="404 — Page Not Found | Rolan Lobo"
      description="The page you're looking for doesn't exist. But hey — my homepage does."
      noIndex={true}
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
        Looks like you took a wrong turn
      </Title>
      <Sub
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Even the best explorers get lost. Let me help you find your way back.
      </Sub>
      <HomeLink
        to="/"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        ← Back to Rolan's World
      </HomeLink>
    </Wrapper>
  </>
);

export default NotFound;
