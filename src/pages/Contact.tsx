import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import FAQSchema from '../components/FAQSchema';
import { glassSurface, glassControl } from '../styles/surfaces';

/* ══════════════════════════════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════════════════════════════ */

/** Page-level wrapper — accounts for fixed navbar height (≈72px) */
const PageWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding-top: 128px;
  padding-bottom: 96px;

  @media (max-width: 1024px) { padding-top: 108px; padding-bottom: 72px; }
  @media (max-width: 768px)  { padding-top: 92px;  padding-bottom: 56px; }
`;

/** Centred max-width container — matches Navbar island (1200px) */
const Wrap = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--spacing-12);

  @media (max-width: 1024px) { padding: 0 var(--spacing-8); }
  @media (max-width: 640px)  { padding: 0 var(--spacing-5); }
`;

/**
 * Two-column grid.
 * Left  → info panel   (minmax keeps it from shrinking below 320px)
 * Right → form panel   (1fr fills remaining space)
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 420px) 1fr;
  gap: var(--spacing-16);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(280px, 380px) 1fr;
    gap: var(--spacing-10);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
`;

/* ══════════════════════════════════════════════════════════════════════════
   LEFT COLUMN — INFO PANEL
   ══════════════════════════════════════════════════════════════════════════ */

const InfoPanel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

/* ─── Intro ─────────────────────────────────────────────────────────────── */

const IntroSection = styled.div`
  padding-bottom: var(--spacing-10);
  border-bottom: 1px solid var(--hairline);
  margin-bottom: var(--spacing-10);
`;

const PageLabel = styled.p`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dark-600);
  margin: 0 0 var(--spacing-5);
`;

const Headline = styled.h1`
  font-size: clamp(1.85rem, 3vw, 2.6rem);
  font-weight: var(--font-extrabold);
  color: var(--dark-100);
  letter-spacing: var(--tracking-tighter);
  line-height: var(--leading-none);
  margin: 0 0 var(--spacing-4);
`;

const Subline = styled.p`
  font-size: 0.95rem;
  color: var(--dark-400);
  line-height: var(--leading-body);
  margin: 0 0 var(--spacing-6);
  max-width: 360px;
`;

const AvailPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 6px 14px;
  border: 1px solid rgba(var(--success-rgb), 0.22);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: var(--font-medium);
  color: var(--success);
  width: fit-content;
`;

const PulseDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: rgba(var(--success-rgb), 0.2);
    animation: pulse 2s ease-out infinite;
  }

  @keyframes pulse {
    0%   { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.9); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after { animation: none; }
  }
`;

/* ─── Details table ─────────────────────────────────────────────────────── */

const DetailsSection = styled.div`
  padding-bottom: var(--spacing-10);
  border-bottom: 1px solid var(--hairline);
  margin-bottom: var(--spacing-10);
`;

const BlockLabel = styled.p`
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dark-600);
  margin: 0 0 var(--spacing-5);
`;

const DetailsTable = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-4);
  padding: var(--spacing-3) 0;
  border-bottom: 1px solid var(--hairline-faint);

  &:last-child { border-bottom: none; }
`;

const DetailsKey = styled.dt`
  font-size: 0.85rem;
  color: var(--dark-600);
  font-weight: var(--font-medium);
  flex-shrink: 0;
`;

const DetailsVal = styled.dd`
  font-size: 0.85rem;
  color: var(--dark-200);
  text-align: right;
  margin: 0;
`;

/* ─── Social links ──────────────────────────────────────────────────────── */

const SocialsSection = styled.div``;

const SocialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SocialLink = styled.a`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.18s ease, border-color 0.18s ease;
  min-height: 44px; /* a11y touch target */

  &:hover {
    background: var(--hairline-faint);
    border-color: var(--hairline-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
`;

const SocialLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const SocialIconBox = styled.span`
  ${glassControl}
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--dark-500);
  transition: color 0.18s ease, border-color 0.18s ease;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  ${SocialLink}:hover & {
    color: var(--dark-200);
    border-color: var(--control-border-hover);
  }
`;

const SocialName = styled.span`
  font-size: 0.875rem;
  font-weight: var(--font-medium);
  color: var(--dark-500);
  transition: color 0.18s ease;

  ${SocialLink}:hover & { color: var(--dark-400); }
`;

const SocialRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SocialHandle = styled.span`
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--dark-700);
`;

const ArrowSVG = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="var(--dark-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 9 9 2M4 2h5v5" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════
   RIGHT COLUMN — FORM PANEL
   ══════════════════════════════════════════════════════════════════════════ */

const FormCard = styled.div`
  ${glassSurface}
  box-sizing: border-box;
  width: 100%;
  height: auto;
  min-height: fit-content;
  overflow: hidden;
`;

const CardHead = styled.div`
  box-sizing: border-box;
  padding: var(--spacing-8) var(--spacing-8) var(--spacing-6);
  border-bottom: 1px solid var(--hairline);

  @media (max-width: 1024px) { padding: var(--spacing-6) var(--spacing-6) var(--spacing-5); }
  @media (max-width: 768px)  { padding: var(--spacing-5) var(--spacing-5) var(--spacing-4); }
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: var(--font-bold);
  color: var(--dark-200);
  letter-spacing: var(--tracking-tight);
  margin: 0 0 6px;
`;

const CardSubtitle = styled.p`
  font-size: 0.85rem;
  color: var(--dark-600);
  line-height: var(--leading-relaxed);
  margin: 0;
`;

const CardBody = styled.form`
  box-sizing: border-box;
  padding: var(--spacing-8);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);

  @media (max-width: 1024px) { padding: var(--spacing-6); }
  @media (max-width: 768px)  { padding: var(--spacing-5); }
`;

/* Name + Email side-by-side */
const FieldRow = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-4);

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 0.72rem;
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dark-600);
`;

const fieldBase = css`
  ${glassControl}
  /* Composite the translucent control tint over an opaque dark base so the
     backdrop-filter no longer samples the page glow — inputs and the taller
     textarea then read identically regardless of size or position. */
  background-image: linear-gradient(var(--control-bg), var(--control-bg));
  background-color: var(--dark-900);
  box-sizing: border-box;
  width: 100%;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  color: var(--dark-200);
  font-size: 0.875rem;
  font-family: inherit;
  line-height: var(--leading-normal);
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;

  &::placeholder { color: var(--dark-700); }

  &:focus {
    outline: none;
    background-image: linear-gradient(var(--control-bg-hover), var(--control-bg-hover));
    background-color: var(--dark-900);
  }
`;

const FieldInput = styled.input<{ $err?: boolean }>`
  ${fieldBase}
  border: 1px solid ${p => p.$err ? 'rgba(var(--error-rgb), 0.55)' : 'var(--control-border)'};
  height: 44px; /* equal height across all inputs */

  &:focus {
    border-color: ${p => p.$err ? 'rgba(var(--error-rgb), 0.8)' : 'rgba(255,255,255,0.22)'};
    box-shadow: 0 0 0 3px ${p => p.$err ? 'rgba(var(--error-rgb), 0.07)' : 'var(--hairline-faint)'};
  }
`;

const FieldTextarea = styled.textarea<{ $err?: boolean }>`
  ${fieldBase}
  border: 1px solid ${p => p.$err ? 'rgba(var(--error-rgb), 0.55)' : 'var(--control-border)'};
  min-height: 160px;
  resize: vertical;

  &:focus {
    border-color: ${p => p.$err ? 'rgba(var(--error-rgb), 0.8)' : 'rgba(255,255,255,0.22)'};
    box-shadow: 0 0 0 3px ${p => p.$err ? 'rgba(var(--error-rgb), 0.07)' : 'var(--hairline-faint)'};
  }
`;

const FieldError = styled(m.p)`
  font-size: 0.72rem;
  color: rgba(var(--error-rgb), 0.85);
  margin: 0;
  line-height: var(--leading-snug);
`;

/* Submit row — button left, email link right */
const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  padding-top: var(--spacing-1); /* +spacing-1 on top of the parent's spacing-5 gap ≈ spacing-6 from the last field */

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SubmitBtn = styled(m.button)`
  box-sizing: border-box;
  padding: 11px 28px;
  background: var(--accent-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: var(--font-bold);
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  white-space: nowrap;
  min-height: 44px;
  transition: background 0.18s ease, opacity 0.18s ease;

  &:hover:not(:disabled) { background: var(--accent-hover); }
  &:active:not(:disabled) { background: var(--accent-press); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }

  @media (max-width: 480px) { width: 100%; }
`;

const DirectLink = styled.a`
  font-size: 0.85rem;
  color: var(--dark-700);
  text-decoration: none;
  transition: color 0.18s ease;
  min-height: 44px;
  display: flex;
  align-items: center;

  &:hover { color: var(--dark-500); }
  &:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; border-radius: 2px; }

  @media (max-width: 480px) { justify-content: center; }
`;

const StatusBanner = styled(m.div)<{ $t: 'success' | 'error' }>`
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid ${p => p.$t === 'success' ? 'rgba(var(--success-rgb), 0.2)' : 'rgba(var(--error-rgb), 0.2)'};
  background: ${p => p.$t === 'success' ? 'rgba(var(--success-rgb), 0.05)' : 'rgba(var(--error-rgb), 0.05)'};
  color: ${p => p.$t === 'success' ? 'var(--success)' : 'rgba(var(--error-rgb), 0.9)'};
  font-size: 0.875rem;
  line-height: var(--leading-normal);
`;

const Spinner = () => (
  <m.span
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
    style={{ display: 'inline-block', width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#ffffff', borderRadius: '50%' }}
  />
);

/* ─── SVG icons ──────────────────────────────────────────────────────────── */

const GitHubSVG    = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const LinkedInSVG  = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const InstagramSVG = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const DevToSVG     = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.74 0 .74.04 0 .14-1.67 6.38-1.8 6.68z"/></svg>;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const socials = [
  { name: 'GitHub',    handle: 'Mrtracker-new', href: 'https://github.com/Mrtracker-new',        Icon: GitHubSVG    },
  { name: 'LinkedIn',  handle: 'rolan-lobo',     href: 'https://www.linkedin.com/in/rolan-lobo/', Icon: LinkedInSVG  },
  { name: 'Instagram', handle: 'rolan_r_n_r',    href: 'https://www.instagram.com/rolan_r_n_r/',  Icon: InstagramSVG },
  { name: 'Dev.to',    handle: 'rolan_r_n_r',    href: 'https://dev.to/rolan_r_n_r',              Icon: DevToSVG     },
];

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface FD { name: string; email: string; subject: string; message: string; }
interface FE { name?: string; email?: string; subject?: string; message?: string; }

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

const Contact: React.FC = () => {
  const [form, setForm]   = useState<FD>({ name: '', email: '', subject: '', message: '' });
  const [errs, setErrs]   = useState<FE>({});
  const [busy, setBusy]   = useState(false);
  const [status, setStatus] = useState<{ t: 'success' | 'error'; msg: string } | null>(null);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errs[name as keyof FE]) setErrs(p => ({ ...p, [name]: undefined }));
  };

  const validate = (): FE => {
    const e: FE = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.length < 10) e.message = 'At least 10 characters';
    setErrs(e);
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      // Move focus to the first invalid field so keyboard/SR users land on it.
      const order: (keyof FE)[] = ['name', 'email', 'subject', 'message'];
      const firstBad = order.find(k => found[k]);
      if (firstBad) document.getElementById(`c-${firstBad}`)?.focus();
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const body = new URLSearchParams({ 'form-name': 'contact', ...form });
      if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
        await new Promise(r => setTimeout(r, 800));
        setStatus({ t: 'success', msg: "Got it — I'll reply within 24 hours." });
        setForm({ name: '', email: '', subject: '', message: '' });
        return;
      }
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (res.ok) { setStatus({ t: 'success', msg: "Got it — I'll reply within 24 hours." }); setForm({ name: '', email: '', subject: '', message: '' }); }
      else throw new Error();
    } catch { setStatus({ t: 'error', msg: 'Something went wrong. Email me directly at rolanlobo901@gmail.com' }); }
    finally { setBusy(false); }
  };

  return (
    <>
      <SEO
        title="Work With Me — Rolan Lobo"
        description="Open to freelance, contract, and full-time roles. Privacy-first engineering, cross-platform development, and encryption tools. Reply within 24 hours."
        keywords="Contact Rolan Lobo, Rolan RNR, Hire Software Developer, Freelance Developer India, Privacy Developer, Security Software Consultant"
        url="https://rolan-rnr.netlify.app/contact"
      />
      <FAQSchema />

      <PageWrapper>
        <Wrap>
          <Grid>

            {/* ══ LEFT — INFO PANEL ══════════════════════════════════════ */}
            <InfoPanel>

              {/* Intro */}
              <IntroSection>
                <PageLabel>Contact</PageLabel>
                <Headline>Let's build<br />something good.</Headline>
                <Subline>
                  Open to freelance projects, contracts, and collaborations.
                  I read every message and reply within 24 hours with honest
                  thoughts on how I can help.
                </Subline>
                <AvailPill>
                  <PulseDot aria-hidden="true" />
                  Open for Q3 2026
                </AvailPill>
              </IntroSection>

              {/* Details */}
              <DetailsSection>
                <BlockLabel>Details</BlockLabel>
                <DetailsTable>
                  {[
                    ['Location',    'Karnataka, India'],
                    ['Timezone',    'IST · UTC +5:30'],
                    ['Response',    'Within 24 hours'],
                    ['Work type',   'Remote · Async-friendly'],
                    ['Engagements', 'Freelance · Contract · Full-time'],
                  ].map(([k, v]) => (
                    <DetailsRow key={k}>
                      <DetailsKey>{k}</DetailsKey>
                      <DetailsVal>{v}</DetailsVal>
                    </DetailsRow>
                  ))}
                </DetailsTable>
              </DetailsSection>

            </InfoPanel>

            {/* ══ RIGHT — FORM CARD ═════════════════════════════════════ */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <FormCard>
                <CardHead>
                  <CardTitle>Send a message</CardTitle>
                  <CardSubtitle>
                    Tell me what you're working on — I'll respond with honest thoughts on how I can help.
                  </CardSubtitle>
                </CardHead>

                <CardBody
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={submit}
                  noValidate
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p hidden><label>Don't fill this: <input name="bot-field" /></label></p>

                  {/* Name + Email */}
                  <FieldRow>
                    <FieldGroup>
                      <FieldLabel htmlFor="c-name">Name <span aria-hidden="true">*</span></FieldLabel>
                      <FieldInput
                        type="text" id="c-name" name="name" required aria-required="true"
                        aria-invalid={!!errs.name}
                        aria-describedby={errs.name ? 'c-name-err' : undefined}
                        placeholder="Your name" value={form.name} onChange={change} $err={!!errs.name}
                      />
                      <AnimatePresence>
                        {errs.name && <FieldError id="c-name-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errs.name}</FieldError>}
                      </AnimatePresence>
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel htmlFor="c-email">Email <span aria-hidden="true">*</span></FieldLabel>
                      <FieldInput
                        type="email" id="c-email" name="email" required aria-required="true"
                        aria-invalid={!!errs.email}
                        aria-describedby={errs.email ? 'c-email-err' : undefined}
                        placeholder="you@example.com" value={form.email} onChange={change} $err={!!errs.email}
                      />
                      <AnimatePresence>
                        {errs.email && <FieldError id="c-email-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errs.email}</FieldError>}
                      </AnimatePresence>
                    </FieldGroup>
                  </FieldRow>

                  {/* Subject */}
                  <FieldGroup>
                    <FieldLabel htmlFor="c-subject">Subject <span aria-hidden="true">*</span></FieldLabel>
                    <FieldInput
                      type="text" id="c-subject" name="subject" required aria-required="true"
                      aria-invalid={!!errs.subject}
                      aria-describedby={errs.subject ? 'c-sub-err' : undefined}
                      placeholder="What's on your mind?" value={form.subject} onChange={change} $err={!!errs.subject}
                    />
                    <AnimatePresence>
                      {errs.subject && <FieldError id="c-sub-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errs.subject}</FieldError>}
                    </AnimatePresence>
                  </FieldGroup>

                  {/* Message */}
                  <FieldGroup>
                    <FieldLabel htmlFor="c-message">Message <span aria-hidden="true">*</span></FieldLabel>
                    <FieldTextarea
                      id="c-message" name="message" required aria-required="true"
                      aria-invalid={!!errs.message}
                      aria-describedby={errs.message ? 'c-msg-err' : undefined}
                      placeholder="Tell me about the project, what you need, or just say hello…"
                      value={form.message} onChange={change} $err={!!errs.message}
                    />
                    <AnimatePresence>
                      {errs.message && <FieldError id="c-msg-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errs.message}</FieldError>}
                    </AnimatePresence>
                  </FieldGroup>

                  {/* Actions */}
                  <FormActions>
                    <SubmitBtn type="submit" disabled={busy} whileTap={{ scale: 0.97 }}>
                      {busy ? <><Spinner />Sending…</> : 'Send message'}
                    </SubmitBtn>
                    <DirectLink href="mailto:rolanlobo901@gmail.com" aria-label="Email Rolan directly">
                      or email directly
                    </DirectLink>
                  </FormActions>

                  {/* Status banner */}
                  <div aria-live="polite" aria-atomic="true">
                    <AnimatePresence>
                      {status && (
                        <StatusBanner
                          $t={status.t}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28 }}
                        >
                          {status.msg}
                        </StatusBanner>
                      )}
                    </AnimatePresence>
                  </div>
                </CardBody>
              </FormCard>

              {/* Social links — grouped under the form to save left-col space */}
              <SocialsSection style={{ marginTop: 16 }}>
                <BlockLabel>Find me on</BlockLabel>
                <SocialList>
                  {socials.map(({ name, handle, href, Icon }) => (
                    <SocialLink key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} — @${handle}`}>
                      <SocialLeft>
                        <SocialIconBox><Icon /></SocialIconBox>
                        <SocialName>{name}</SocialName>
                      </SocialLeft>
                      <SocialRight>
                        <SocialHandle>@{handle}</SocialHandle>
                        <ArrowSVG />
                      </SocialRight>
                    </SocialLink>
                  ))}
                </SocialList>
              </SocialsSection>
            </m.div>

          </Grid>
        </Wrap>
      </PageWrapper>
    </>
  );
};

export default Contact;
