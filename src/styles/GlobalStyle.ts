import styled, { css } from 'styled-components';
import { glassControl, glassControlHover } from './surfaces';

/* NB: global resets, keyframes, and ::view-transition rules live in
   styles/critical.css (imported once via index.css). Don't re-declare them
   here — this file exports layout primitives only. */

export const Container = styled.div`
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--spacing-4);

  @media (min-width: 640px)  { padding: 0 var(--spacing-6); }
  @media (min-width: 1024px) { padding: 0 var(--spacing-8); }
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
        background: var(--accent-primary);
        color: #ffffff;
        border: 1px solid transparent;
        box-shadow: var(--shadow-sm), var(--control-highlight);

        &:hover { background: var(--accent-hover); }
        &:active { background: var(--accent-press); }
      `;
    } else if (variant === 'secondary') {
      return css`
        ${glassControl}
        ${glassControlHover}
        color: var(--dark-100);
      `;
    } else if (variant === 'outline') {
      return `
        background: transparent;
        color: var(--dark-200);
        border-color: var(--border-strong);

        &:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        &:active { background: var(--accent-subtle); }
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
      success: 'background: rgba(63,185,80,0.10); color: var(--success); border-color: rgba(63,185,80,0.30);',
      warning: 'background: rgba(210,153,34,0.10); color: var(--warning); border-color: rgba(210,153,34,0.30);',
      error:   'background: rgba(248,81,73,0.10);  color: var(--error);   border-color: rgba(248,81,73,0.30);',
      info:    'background: var(--accent-subtle); color: var(--accent-primary); border-color: var(--accent-border);'
    };
    return variants[variant];
  }}
`;
