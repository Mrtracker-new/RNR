import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  ::view-transition-old(root) { animation: vt-fade-out 200ms ease-out both; }
  ::view-transition-new(root) { animation: vt-fade-in  200ms ease-in  both; }
`;

export const Container = styled.div`
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);

  @media (min-width: 640px)  { padding: 0 var(--spacing-6); }
  @media (min-width: 1024px) { padding: 0 var(--spacing-8); }
`;

export const Section = styled.section<{ $padding?: string }>`
  padding: ${props => props.$padding || '80px 0'};
  position: relative;

  @media (max-width: 768px) {
    padding: ${props => props.$padding || '60px 0'};
  }
`;

export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 1}, 1fr);
  gap: ${props => props.$gap || 'var(--spacing-8)'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.$gap || 'var(--spacing-6)'};
  }
`;

export const Card = styled.div<{ $hover?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  transition: var(--transition-normal);

  ${props => props.$hover && `
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

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline'; $size?: 'sm' | 'md' | 'lg' }>`
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
    const size = props.$size || 'md';
    const sizeStyles: Record<string, string> = {
      sm: 'padding: var(--spacing-2) var(--spacing-4); font-size: var(--text-sm);',
      md: 'padding: var(--spacing-3) var(--spacing-6); font-size: var(--text-base);',
      lg: 'padding: var(--spacing-4) var(--spacing-8); font-size: var(--text-lg);'
    };
    return sizeStyles[size];
  }}

  ${props => {
    const variant = props.$variant || 'primary';
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

export const Badge = styled.span<{ $variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-sm);
  border: 1px solid;

  ${props => {
    const variant = props.$variant || 'info';
    const variants: Record<string, string> = {
      success: 'background: var(--dark-900); color: var(--success); border-color: var(--success);',
      warning: 'background: var(--dark-900); color: var(--warning); border-color: var(--warning);',
      error:   'background: var(--dark-900); color: var(--error);   border-color: var(--error);',
      info:    'background: var(--dark-900); color: var(--accent-primary); border-color: var(--accent-primary);'
    };
    return variants[variant];
  }}
`;
