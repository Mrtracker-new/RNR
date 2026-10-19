import { useEffect } from 'react';

/* Reference-counted page scroll lock. Several overlays can be open at the same
   time (mobile menu + case study modal), so the first lock captures the
   original styles and the last release restores them exactly once. */

let activeLocks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;

    if (activeLocks === 0) {
      saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
    }
    activeLocks += 1;

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0 && saved) {
        root.style.overflow = saved.overflow;
        root.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [active]);
}
