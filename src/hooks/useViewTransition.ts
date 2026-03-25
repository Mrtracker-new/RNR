import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** True when the browser supports the View Transitions API */
const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

/** True when the user prefers reduced motion */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Triggers `document.startViewTransition()` on every route change so the
 * browser handles page cross-fades natively.
 *
 * Returns `{ supported }` so callers can conditionally skip Framer Motion's
 * `AnimatePresence` — which becomes the automatic fallback when unsupported.
 *
 * Reduced-motion: the transition still fires (so React state is committed
 * correctly) but the CSS animation is suppressed via the media query in
 * GlobalStyle, making it instant.
 */
export function useViewTransition(): { supported: boolean } {
  const location = useLocation();
  const pendingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    // If reduced-motion is on we still need the transition to commit the new
    // DOM, but the CSS will suppress the visual animation.
    const transition = (document as Document & {
      startViewTransition: (cb: () => void) => { finished: Promise<void> };
    }).startViewTransition(() => {
      // The callback runs after the browser has captured the "old" snapshot.
      // React has already updated the DOM here, so nothing extra is needed.
      pendingRef.current?.();
      pendingRef.current = null;
    });

    transition.finished.catch(() => {
      // Silently ignore aborted transitions (fast navigations).
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return { supported: isSupported && !prefersReducedMotion() };
}
