import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { EMAIL, NAV, SOCIALS } from '../utils/site';

const FooterWrapper = styled.footer`
  border-top: 1px solid var(--hairline);
  background: var(--dark-950);
  padding: var(--spacing-12) 0 var(--spacing-8);

  @media (max-width: 768px) { padding: var(--spacing-8) 0 var(--spacing-6); }
  @media (max-width: 480px) { padding: var(--spacing-6) 0 var(--spacing-5); }
`;

const Inner = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-6);

  @media (max-width: 480px) { padding: 0 var(--spacing-4); }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-8);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--spacing-6);
    margin-bottom: var(--spacing-6);
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex-shrink: 0;

  @media (max-width: 640px) { gap: var(--spacing-1); }
`;

const BrandName = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BrandFullName = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--dark-100);
  letter-spacing: -0.01em;
  line-height: 1;

  @media (max-width: 640px) { font-size: var(--text-sm); }
`;

const BrandShorthand = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-extrabold);
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--accent-primary);
`;

const BrandTagline = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-500);
  max-width: 260px;
  line-height: 1.55;
  margin-top: var(--spacing-2);

  @media (max-width: 640px) { display: none; }
`;

const LinksBlock = styled.div`
  display: flex;
  gap: var(--spacing-12);

  @media (max-width: 640px) {
    width: 100%;
    gap: 0;
    justify-content: space-between;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);

  @media (max-width: 640px) { gap: var(--spacing-2); }
`;

const LinkGroupLabel = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--dark-600);
  margin-bottom: var(--spacing-1);

  @media (max-width: 640px) { font-size: 0.6rem; }
`;

const NavLink = styled(Link)`
  font-size: var(--text-sm);
  color: var(--dark-400);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover { color: var(--accent-primary); }

  @media (max-width: 640px) { font-size: var(--text-xs); }
`;

const ExternalLink = styled.a`
  font-size: var(--text-sm);
  color: var(--dark-400);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover { color: var(--accent-primary); }

  @media (max-width: 640px) { font-size: var(--text-xs); }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  padding-top: var(--spacing-5);
  border-top: 1px solid var(--hairline-faint);

  @media (max-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    padding-top: var(--spacing-4);
  }

  @media (max-width: 380px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
  }
`;

const Copyright = styled.span`
  font-size: var(--text-xs);
  color: var(--dark-600);
`;

const AvailabilityNote = styled(Link)`
  font-size: var(--text-xs);
  color: var(--dark-600);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 6px rgba(63, 185, 80, 0.6);
    flex-shrink: 0;
  }

  &:hover { color: var(--accent-primary); }

  @media (max-width: 380px) { display: none; }
`;

const CopyEmailButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--dark-400);
  text-align: left;
  transition: color var(--transition-fast);
  font-family: inherit;

  &:hover { color: var(--accent-primary); }

  @media (max-width: 640px) { font-size: var(--text-xs); }
`;

type CopyState = 'idle' | 'copied' | 'failed';

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Permission denied / insecure context — fall through to the legacy path.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const handleCopyEmail = async () => {
    const copied = await copyText(EMAIL);
    setCopyState(copied ? 'copied' : 'failed');

    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (copied) {
      resetTimer.current = setTimeout(() => setCopyState('idle'), 2500);
    }
  };

  const copyLabel = copyState === 'copied' ? '✓ Copied!' : 'Email';
  const statusMessage =
    copyState === 'copied'
      ? 'Email address copied to clipboard.'
      : copyState === 'failed'
        ? 'Could not copy — use the email link instead.'
        : '';

  return (
    <FooterWrapper>
      <Inner>
        <TopRow>
          <BrandBlock>
            <BrandName to="/">
              <BrandFullName>Rolan Lobo</BrandFullName>
              <BrandShorthand>RNR</BrandShorthand>
            </BrandName>
            <BrandTagline>
              Software for people who care about their data.
            </BrandTagline>
          </BrandBlock>

          <LinksBlock>
            <LinkGroup>
              <LinkGroupLabel>Navigation</LinkGroupLabel>
              {NAV.map(item => (
                <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
              ))}
            </LinkGroup>

            <LinkGroup>
              <LinkGroupLabel>Connect</LinkGroupLabel>
              {SOCIALS.map(social => (
                <ExternalLink
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </ExternalLink>
              ))}
              {copyState === 'failed' ? (
                <ExternalLink href={`mailto:${EMAIL}`} title={EMAIL}>
                  Email
                </ExternalLink>
              ) : (
                <CopyEmailButton
                  onClick={handleCopyEmail}
                  aria-label={copyState === 'copied' ? 'Email address copied' : 'Copy email address to clipboard'}
                  title={EMAIL}
                >
                  {copyLabel}
                </CopyEmailButton>
              )}
              <span role="status" aria-live="polite" className="sr-only">
                {statusMessage}
              </span>
            </LinkGroup>
          </LinksBlock>
        </TopRow>

        <BottomRow>
          <Copyright>© {year} Rolan Lobo. All rights reserved.</Copyright>
          <AvailabilityNote to="/contact">Open to new projects</AvailabilityNote>
        </BottomRow>
      </Inner>
    </FooterWrapper>
  );
};

export default Footer;
