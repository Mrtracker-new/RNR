import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    /* Move keyboard/screen-reader focus to the new page rather than leaving it
       on the nav link that was activated. Skipped on first paint so the initial
       load doesn't steal focus. */
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      const main = document.getElementById('main-content');
      main?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
