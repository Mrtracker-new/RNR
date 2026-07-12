import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query and re-render on change.
 *
 * Prefer this over reading window.innerWidth in event handlers: it stays in
 * sync on resize / orientation change and reads the same breakpoints the CSS
 * uses, instead of sampling the width once at the moment a handler fires.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
