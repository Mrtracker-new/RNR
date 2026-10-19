import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { m, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import FAQSchema from '../components/FAQSchema';
import { glassSurface, glassControl } from '../styles/surfaces';
import { DevToSVG, GitHubSVG, InstagramSVG, LinkedInSVG } from '../components/icons';
import { AVAILABILITY, EMAIL, SITE_URL, SOCIALS } from '../utils/site';
import { FAQ_ITEMS } from '../data/faq';

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

/* ─── FAQ ───────────────────────────────────────────────────────────────── */

const FaqSection = styled.section`
  margin-top: var(--spacing-16);
  padding-top: var(--spacing-12);
  border-top: 1px solid var(--hairline);
`;

const FaqTitle = styled.h2`
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: var(--font-bold);
  color: var(--dark-100);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--spacing-6);
`;

const FaqList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-6) var(--spacing-8);
  margin: 0;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FaqItem = styled.div`
  padding: var(--spacing-4) 0;
  border-top: 1px solid var(--hairline-faint);
`;

const FaqQuestion = styled.dt`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--dark-200);
  margin-bottom: var(--spacing-2);
`;

const FaqAnswer = styled.dd`
  margin: 0;
  font-size: var(--text-sm);
  color: var(--dark-400);
  line-height: var(--leading-body);
`;

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
  background: var(--accent-fill);
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

  &:hover:not(:disabled) { background: var(--accent-fill-hover); }
  &:active:not(:disabled) { background: var(--accent-fill-press); }
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

/* ─── Data ────────────────────────────────────────────────────────────────── */

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  GitHub: GitHubSVG,
  LinkedIn: LinkedInSVG,
  Instagram: InstagramSVG,
  'Dev.to': DevToSVG,
};

const socials = SOCIALS.map(social => ({
  ...social,
  Icon: SOCIAL_ICONS[social.name],
}));

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
    } catch { setStatus({ t: 'error', msg: `Something went wrong. Email me directly at ${EMAIL}` }); }
    finally { setBusy(false); }
  };

  return (
    <>
      <SEO
        title="Work With Me — Rolan Lobo"
        description="Open to freelance, contract, and full-time roles. Privacy-first engineering, cross-platform development, and encryption tools. Reply within 24 hours."
        keywords="Contact Rolan Lobo, Rolan RNR, Hire Software Developer, Freelance Developer India, Privacy Developer, Security Software Consultant"
        url={`${SITE_URL}/contact`}
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
                  {AVAILABILITY}
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
                        placeholder="Your name" value={form.name} onChange={change} $err={!!errs.name} maxLength={100} autoComplete="name"
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
                        placeholder="you@example.com" value={form.email} onChange={change} $err={!!errs.email} maxLength={254} autoComplete="email"
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
                      placeholder="What's on your mind?" value={form.subject} onChange={change} $err={!!errs.subject} maxLength={150}
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
                      value={form.message} onChange={change} $err={!!errs.message} maxLength={5000}
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
                    <DirectLink href={`mailto:${EMAIL}`} aria-label="Email Rolan directly">
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

          <FaqSection aria-labelledby="contact-faq-title">
            <FaqTitle id="contact-faq-title">Common questions</FaqTitle>
            <FaqList>
              {FAQ_ITEMS.map(item => (
                <FaqItem key={item.question}>
                  <FaqQuestion>{item.question}</FaqQuestion>
                  <FaqAnswer>{item.answer}</FaqAnswer>
                </FaqItem>
              ))}
            </FaqList>
          </FaqSection>
        </Wrap>
      </PageWrapper>
    </>
  );
};

export default Contact;
