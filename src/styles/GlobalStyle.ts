import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* CSS Variables - Design System */
  :root {
    /* Primary Colors */
    --primary-50: #f0f9ff;
    --primary-600: #2563eb;
    --primary-900: #1e3a8a;

    /* Accent Colors */
    --accent-primary: #64ffda;
    --secondary-400: #a78bfa;
    --secondary-500: #8b5cf6;
    --secondary-600: #7c3aed;

    /* Dark Theme Colors */
    --dark-50: #f8fafc;
    --dark-100: #f1f5f9;
    --dark-300: #cbd5e1;
    --dark-400: #94a3b8;
    --dark-600: #475569;
    --dark-700: #334155;
    --dark-800: #1e293b;
    --dark-900: #0f172a;

    /* Status Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;

    /* Font Families */
    --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

    /* Font Sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;
    --text-6xl: 3.75rem;

    /* Font Weights */
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;

    /* Spacing Scale */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;

    /* Breakpoints */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Border Radius */
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    --transition-slow: 500ms ease;
  }

  /* Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Hardware acceleration for smooth scrolling */
    -webkit-backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    overflow-x: hidden;
    scroll-padding-top: 80px;
    /* Scroll performance optimizations */
    -webkit-text-size-adjust: 100%;
    contain: layout style;
  }

  body {
    font-family: var(--font-sans);
    background: linear-gradient(135deg, var(--dark-900) 0%, var(--dark-800) 100%);
    color: var(--dark-100);
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
    
    /* iOS smooth scrolling */
    -webkit-overflow-scrolling: touch;
    /* Prevent bounce scrolling */
    overscroll-behavior: none;
    /* GPU acceleration */
    will-change: scroll-position;
    transform: translateZ(0);
    contain: layout style;
  }
  
  /* Optimize elements that commonly cause scroll jank */
  section, div, main, article {
    contain: layout;
  }
  
  /* Performance-critical elements */
  img, video, iframe {
    will-change: auto;
    contain: layout;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--dark-800);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: var(--radius-full);
    transition: var(--transition-normal);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #4dd0e1;
  }

  /* Selection */
  ::selection {
    background: var(--accent-primary);
    color: var(--dark-900);
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-bold);
    line-height: 1.2;
    color: var(--dark-50);
  }

  h1 {
    font-size: var(--text-5xl);
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-400) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    font-size: var(--text-4xl);
    color: var(--dark-100);
  }

  h3 {
    font-size: var(--text-3xl);
    color: var(--dark-200);
  }

  /* Links */
  a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: #4dd0e1;
    text-decoration: underline;
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: inherit;
    transition: var(--transition-normal);
  }

  /* Input styles */
  input, textarea {
    font-family: inherit;
    border: 1px solid var(--dark-600);
    background: var(--dark-800);
    color: var(--dark-100);
    border-radius: var(--radius-lg);
    padding: var(--spacing-3) var(--spacing-4);
    transition: var(--transition-normal);
  }

  input:focus, textarea:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.1);
  }

  /* Responsive Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Container */
  .container {
    max-width: var(--breakpoint-xl);
    margin: 0 auto;
    padding: 0 var(--spacing-4);
  }

  @media (min-width: var(--breakpoint-sm)) {
    .container {
      padding: 0 var(--spacing-6);
    }
  }

  @media (min-width: var(--breakpoint-lg)) {
    .container {
      padding: 0 var(--spacing-8);
    }
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
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-400) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Background Pattern */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(100, 255, 218, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(100, 255, 218, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
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
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  backdrop-filter: blur(10px);
  transition: var(--transition-normal);

  ${props => props.hover && `
    &:hover {
      transform: translateY(-5px);
      border-color: var(--accent-primary);
      box-shadow: 0 20px 40px rgba(100, 255, 218, 0.1);
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
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: var(--transition-normal);
  cursor: pointer;
  text-decoration: none;

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
        background: linear-gradient(135deg, var(--accent-primary) 0%, var(--secondary-500) 100%);
        color: var(--dark-900);
        border: 2px solid transparent;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
      `;
    } else if (variant === 'secondary') {
      return `
        background: var(--dark-700);
        color: var(--dark-100);
        border: 2px solid var(--dark-600);

        &:hover {
          background: var(--dark-600);
          border-color: var(--accent-primary);
        }
      `;
    } else if (variant === 'outline') {
      return `
        background: transparent;
        color: var(--accent-primary);
        border: 2px solid var(--accent-primary);

        &:hover {
          background: var(--accent-primary);
          color: var(--dark-900);
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
  border-radius: var(--radius-full);

  ${props => {
    const variant = props.variant || 'info';
    const variants = {
      success: 'background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3);',
      warning: 'background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3);',
      error: 'background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.3);',
      info: 'background: rgba(100, 255, 218, 0.1); color: var(--accent-primary); border: 1px solid rgba(100, 255, 218, 0.3);'
    };
    return variants[variant];
  }}
`;
