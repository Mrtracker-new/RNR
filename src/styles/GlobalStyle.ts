import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* CSS Variables - Minimal Design System */
  :root {
    /* Primary Colors - More sophisticated palette */
    --primary-50: #fafafa;
    --primary-600: #2563eb;
    --primary-900: #0f172a;

    /* Accent Colors - Vibrant but professional */
    --accent-primary: #64ffda;
    --accent-secondary: #8b5cf6;
    --accent-tertiary: #f59e0b;
    --accent-gradient: linear-gradient(135deg, #64ffda 0%, #8b5cf6 100%);
    --accent-glow: rgba(100, 255, 218, 0.3);

    /* Dark Theme Colors - Better contrast and minimal */
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

    /* Status Colors - Refined */
    --success: #22c55e;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: var(--accent-primary);

    /* Font Families - Clean and modern */
    --font-sans: 'Inter', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;

    /* Font Sizes - Refined scale */
    --text-xs: 0.75rem;      /* 12px */
    --text-sm: 0.875rem;     /* 14px */
    --text-base: 1rem;       /* 16px */
    --text-lg: 1.125rem;     /* 18px */
    --text-xl: 1.25rem;      /* 20px */
    --text-2xl: 1.5rem;      /* 24px */
    --text-3xl: 1.875rem;    /* 30px */
    --text-4xl: 2.25rem;     /* 36px */
    --text-5xl: 3rem;        /* 48px */
    --text-6xl: 3.75rem;     /* 60px */
    --text-7xl: 4.5rem;      /* 72px */

    /* Font Weights */
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;

    /* Spacing Scale - Refined */
    --spacing-px: 1px;
    --spacing-0: 0;
    --spacing-1: 0.25rem;    /* 4px */
    --spacing-2: 0.5rem;     /* 8px */
    --spacing-3: 0.75rem;    /* 12px */
    --spacing-4: 1rem;       /* 16px */
    --spacing-5: 1.25rem;    /* 20px */
    --spacing-6: 1.5rem;     /* 24px */
    --spacing-8: 2rem;       /* 32px */
    --spacing-10: 2.5rem;    /* 40px */
    --spacing-12: 3rem;      /* 48px */
    --spacing-16: 4rem;      /* 64px */
    --spacing-20: 5rem;      /* 80px */
    --spacing-24: 6rem;      /* 96px */
    --spacing-32: 8rem;      /* 128px */

    /* Breakpoints - Standard */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;

    /* Shadows - Enhanced with personality */
    --shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    --shadow-md: 0 8px 16px -4px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    --shadow-accent: 0 8px 32px rgba(100, 255, 218, 0.25);
    --shadow-glow: 0 0 40px rgba(100, 255, 218, 0.15);
    --shadow-hover: 0 15px 35px rgba(100, 255, 218, 0.2);
    
    /* Border Radius - Minimal approach */
    --radius-none: 0;
    --radius-sm: 0.25rem;    /* 4px */
    --radius-md: 0.5rem;     /* 8px */
    --radius-lg: 0.75rem;    /* 12px */
    --radius-xl: 1rem;       /* 16px */
    --radius-2xl: 1.5rem;    /* 24px */
    --radius-full: 50%;

    /* Transitions - Smooth and refined */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-spring: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* Global Styles - Minimal and Clean */
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
  /* Custom Scrollbar - Minimal */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--dark-900);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--dark-600);
    border-radius: var(--radius-full);
    transition: var(--transition-fast);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--dark-500);
  }

  /* Selection - Clean */
  ::selection {
    background: rgba(0, 217, 255, 0.2);
    color: var(--dark-50);
  }

  /* Focus styles - Subtle */
  *:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Typography - Clean and minimal */
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-bold);
    line-height: 1.1;
    color: var(--dark-50);
    letter-spacing: -0.025em;
  }

  h1 {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    color: var(--dark-50);
  }

  h2 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--dark-100);
  }

  h3 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--dark-200);
  }

  p {
    color: var(--dark-300);
    line-height: 1.7;
  }

  /* Links - Subtle */
  a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: var(--dark-200);
  }

  /* Buttons - Clean */
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

  /* Input styles - Minimal */
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

  /* Images - Responsive */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility Classes */
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

  .text-gradient {
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Enhanced Background Pattern */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(100, 255, 218, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(100, 255, 218, 0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    opacity: 0.7;
  }

  /* Essential Animation Classes Only */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Performance optimizations */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Styled Components
export const Container = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);

  @media (min-width: 640px) {
    padding: 0 var(--spacing-6);
  }

  @media (min-width: 1024px) {
    padding: 0 var(--spacing-8);
  }
`;

export const Section = styled.section<{ padding?: string }>`
  padding: ${props => props.padding || '80px 0'};
  position: relative;

  @media (max-width: 768px) {
    padding: ${props => props.padding || '60px 0'};
  }
`;

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  backdrop-filter: blur(10px);
  transition: var(--transition-normal);

  ${props => props.hover && `
    &:hover {
      transform: translateY(-8px);
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-accent);
      background: rgba(30, 41, 59, 0.8);
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
    const sizeStyles = {
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
        position: relative;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        &:active {
          transform: translateY(0);
        }
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
    const variants = {
      success: 'background: var(--dark-900); color: var(--success); border-color: var(--success);',
      warning: 'background: var(--dark-900); color: var(--warning); border-color: var(--warning);',
      error: 'background: var(--dark-900); color: var(--error); border-color: var(--error);',
      info: 'background: var(--dark-900); color: var(--accent-primary); border-color: var(--accent-primary);'
    };
    return variants[variant];
  }}
`;
