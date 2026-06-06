import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* ─── Design Tokens ───────────────────────────────────────────────────── */
  :root {
    --primary-50: #fafafa;
    --primary-600: #2563eb;
    --primary-900: #0f172a;

    /* Accent — teal is the primary signal colour; purple is used sparingly */
    --accent-primary: #64ffda;
    --accent-secondary: #8b5cf6;
    --accent-tertiary: #f59e0b;
    /* Gradient reserved for CTA buttons and active states only */
    --accent-gradient: linear-gradient(135deg, #64ffda 0%, #8b5cf6 100%);
    --accent-glow: rgba(100, 255, 218, 0.3);

    /* Dark-theme scale */
    --dark-50: #fafafa;
    --dark-100: #f4f4f5;
    --dark-200: #e4e4e7;
    --dark-300: #d4d4d8;
    --dark-400: #a1a1aa;
    --dark-500: #71717a;
    --dark-600: #52525b;
    --dark-700: #3f3f46;
    --dark-800: #27272a;
    --dark-850: #1f1f23;
    --dark-900: #18181b;
    --dark-950: #09090b;

    /* Status */
    --success: #22c55e;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: var(--accent-primary);

    /* Typography */
    --font-sans: 'Inter', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;

    /* Type scale */
    --text-xs:   0.75rem;
    --text-sm:   0.875rem;
    --text-base: 1rem;
    --text-lg:   1.125rem;
    --text-xl:   1.25rem;
    --text-2xl:  1.5rem;
    --text-3xl:  1.875rem;
    --text-4xl:  2.25rem;
    --text-5xl:  3rem;
    --text-6xl:  3.75rem;
    --text-7xl:  4.5rem;

    /* Weight */
    --font-normal:    400;
    --font-medium:    500;
    --font-semibold:  600;
    --font-bold:      700;
    --font-extrabold: 800;

    /* Spacing */
    --spacing-px: 1px;
    --spacing-0:  0;
    --spacing-1:  0.25rem;
    --spacing-2:  0.5rem;
    --spacing-3:  0.75rem;
    --spacing-4:  1rem;
    --spacing-5:  1.25rem;
    --spacing-6:  1.5rem;
    --spacing-8:  2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;
    --spacing-32: 8rem;

    /* Breakpoints */
    --breakpoint-sm:  640px;
    --breakpoint-md:  768px;
    --breakpoint-lg:  1024px;
    --breakpoint-xl:  1280px;
    --breakpoint-2xl: 1536px;

    /* Shadows */
    --shadow-sm:     0 2px 4px 0 rgba(0, 0, 0, 0.15);
    --shadow-md:     0 8px 16px -4px rgba(0, 0, 0, 0.3);
    --shadow-lg:     0 20px 25px -5px rgba(0, 0, 0, 0.4);
    --shadow-xl:     0 25px 50px -12px rgba(0, 0, 0, 0.5);
    --shadow-accent: 0 8px 32px rgba(100, 255, 218, 0.15);
    --shadow-hover:  0 12px 28px rgba(100, 255, 218, 0.15);

    /* Border radius */
    --radius-none: 0;
    --radius-sm:   0.25rem;
    --radius-md:   0.5rem;
    --radius-lg:   0.75rem;
    --radius-xl:   1rem;
    --radius-2xl:  1.5rem;
    --radius-full: 50%;

    /* Transitions */
    --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow:   500ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-spring: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* ─── Reset ───────────────────────────────────────────────────────────── */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    overflow-x: hidden;
    scroll-padding-top: 80px;
  }

  body {
    font-family: var(--font-sans);
    background: var(--dark-950);
    color: var(--dark-100);
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  }

  #root {
    overflow-x: hidden;
    max-width: 100vw;
  }

  /*
   * Ambient background — two subtle radial gradients anchored to opposite
   * corners. Fixed so they don't repaint on scroll. Opacity kept low so
   * content remains the clear focal point.
   */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(100, 255, 218, 0.06) 0%, transparent 100%),
      radial-gradient(ellipse 50% 40% at 85% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
    pointer-events: none;
    z-index: -1;
  }

  /* ─── Scrollbar ───────────────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--dark-900); }
  ::-webkit-scrollbar-thumb { background: var(--dark-600); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

  /* ─── Selection ───────────────────────────────────────────────────────── */
  ::selection {
    background: rgba(100, 255, 218, 0.2);
    color: var(--dark-50);
  }

  /* ─── Focus — keyboard users see a clear ring; mouse users do not ─────── */
  :focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* ─── Typography ──────────────────────────────────────────────────────── */
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-bold);
    line-height: 1.1;
    color: var(--dark-50);
    letter-spacing: -0.025em;
  }

  h1 { font-size: var(--text-6xl); font-weight: var(--font-extrabold); }
  h2 { font-size: var(--text-4xl); font-weight: var(--font-bold); color: var(--dark-100); }
  h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); color: var(--dark-200); }

  p {
    color: var(--dark-300);
    line-height: 1.7;
  }

  /* ─── Links ───────────────────────────────────────────────────────────── */
  a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover { color: var(--dark-200); }

  /* ─── Buttons ─────────────────────────────────────────────────────────── */
  button {
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: inherit;
    transition: var(--transition-normal);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ─── Form elements ───────────────────────────────────────────────────── */
  input, textarea {
    font-family: inherit;
    border: 1px solid var(--dark-700);
    background: var(--dark-900);
    color: var(--dark-100);
    border-radius: var(--radius-md);
    padding: var(--spacing-3) var(--spacing-4);
    transition: var(--transition-normal);
  }

  input:focus, textarea:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px var(--accent-primary);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ─── Utility ─────────────────────────────────────────────────────────── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Used only in hero headline — intentional, limited to one instance */
  .text-gradient {
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ─── Keyframes ───────────────────────────────────────────────────────── */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-spin  { animation: spin 1s linear infinite; }

  /* ─── View Transitions API ────────────────────────────────────────────── */
  /* Chrome 111+ / Safari 18+ — other browsers ignore these rules */
  @keyframes vt-fade-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }

  @keyframes vt-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  ::view-transition-old(root) { animation: vt-fade-out 200ms ease-out both; }
  ::view-transition-new(root) { animation: vt-fade-in  200ms ease-in  both; }

  /* ─── Reduced Motion ──────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001s !important;
    }

    html { scroll-behavior: auto; }

    ::view-transition-old(root),
    ::view-transition-new(root) { animation: none !important; }
  }
`;

/* ─── Shared Layout Components ────────────────────────────────────────────── */

export const Container = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);

  @media (min-width: 640px)  { padding: 0 var(--spacing-6); }
  @media (min-width: 1024px) { padding: 0 var(--spacing-8); }
`;

export const Section = styled.section<{ padding?: string }>`
  padding: ${props => props.padding || '80px 0'};
  position: relative;

  @media (max-width: 768px) {
    padding: ${props => props.padding || '60px 0'};
  }
`;

export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || 'var(--spacing-8)'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.gap || 'var(--spacing-6)'};
  }
`;

export const Card = styled.div<{ hover?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  transition: var(--transition-normal);

  ${props => props.hover && `
    &:hover {
      transform: translateY(-4px);
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-accent);
      background: rgba(30, 41, 59, 0.7);
    }
  `}

  @media (max-width: 768px) {
    padding: var(--spacing-6);
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline'; size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: var(--transition-normal);
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;

  ${props => {
    const size = props.size || 'md';
    const sizeStyles: Record<string, string> = {
      sm: 'padding: var(--spacing-2) var(--spacing-4); font-size: var(--text-sm);',
      md: 'padding: var(--spacing-3) var(--spacing-6); font-size: var(--text-base);',
      lg: 'padding: var(--spacing-4) var(--spacing-8); font-size: var(--text-lg);'
    };
    return sizeStyles[size];
  }}

  ${props => {
    const variant = props.variant || 'primary';
    if (variant === 'primary') {
      return `
        background: var(--accent-gradient);
        color: var(--dark-950);
        border: 1px solid transparent;
        box-shadow: var(--shadow-md);

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        &:active { transform: translateY(0); }
      `;
    } else if (variant === 'secondary') {
      return `
        background: var(--dark-800);
        color: var(--dark-200);
        border-color: var(--dark-700);

        &:hover {
          background: var(--dark-700);
          border-color: var(--dark-600);
        }
      `;
    } else if (variant === 'outline') {
      return `
        background: transparent;
        color: var(--dark-300);
        border-color: var(--dark-700);

        &:hover {
          background: var(--dark-800);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
      `;
    }
  }}
`;

export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-sm);
  border: 1px solid;

  ${props => {
    const variant = props.variant || 'info';
    const variants: Record<string, string> = {
      success: 'background: var(--dark-900); color: var(--success); border-color: var(--success);',
      warning: 'background: var(--dark-900); color: var(--warning); border-color: var(--warning);',
      error:   'background: var(--dark-900); color: var(--error);   border-color: var(--error);',
      info:    'background: var(--dark-900); color: var(--accent-primary); border-color: var(--accent-primary);'
    };
    return variants[variant];
  }}
`;
