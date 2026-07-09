import { css } from 'styled-components';

/*
 * Surface mixins — the single source of truth for every "box" in the UI.
 *
 * Each mixin reads only the composite --{surface|panel|control}-* tokens
 * defined in styles/critical.css, so the entire visual language (monochrome
 * ⇄ glass ⇄ future themes) swaps at the token layer without touching a
 * component. Never hardcode a background / border / blur / box-shadow in a
 * component — compose one of these instead.
 *
 * Tiers:
 *   glassSurface  → cards, boxes, list rows
 *   glassPanel    → navbar, modals, large containers (strongest blur)
 *   glassControl  → buttons, inputs, chips (lightest blur)
 *
 * Each has a matching *Hover mixin for the hover-state deltas, kept separate
 * so callers opt in (some surfaces are static). The @supports block gives
 * browsers without backdrop-filter an opaque fallback fill.
 */

const NO_BACKDROP =
  '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))';

export const glassSurface = css`
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--surface-radius, var(--radius-xl));
  box-shadow: var(--surface-shadow), var(--surface-highlight);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);

  ${NO_BACKDROP} {
    background: var(--bg-overlay);
  }
`;

export const glassSurfaceHover = css`
  transition: background var(--transition-normal), border-color var(--transition-normal);

  &:hover {
    background: var(--surface-bg-hover);
    border-color: var(--surface-border-hover);
  }
`;

export const glassPanel = css`
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--panel-radius, var(--radius-2xl));
  box-shadow: var(--panel-shadow), var(--panel-highlight);
  backdrop-filter: var(--panel-blur);
  -webkit-backdrop-filter: var(--panel-blur);

  ${NO_BACKDROP} {
    background: var(--bg-overlay);
  }
`;

export const glassControl = css`
  background: var(--control-bg);
  border: 1px solid var(--control-border);
  box-shadow: var(--control-shadow), var(--control-highlight);
  backdrop-filter: var(--control-blur);
  -webkit-backdrop-filter: var(--control-blur);

  ${NO_BACKDROP} {
    background: var(--dark-800);
  }
`;

export const glassControlHover = css`
  transition: background var(--transition-normal), border-color var(--transition-normal);

  &:hover {
    background: var(--control-bg-hover);
    border-color: var(--control-border-hover);
  }
`;
