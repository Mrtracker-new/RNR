const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useViewTransition(): { supported: boolean } {
  return { supported: isSupported && !prefersReducedMotion() };
}
