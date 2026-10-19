import { useEffect } from 'react';

/* Marks everything outside an open dialog as inert so screen-reader virtual
   cursors cannot reach the page behind it. Dialogs rendered through a portal
   can pass the default `#root` selector; an in-page dialog should pass the
   regions that sit beside it instead. */

export function useBackgroundInert(active: boolean, selector = '#root'): void {
  useEffect(() => {
    if (!active) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const restore = targets.map(el => ({
      el,
      inert: el.hasAttribute('inert'),
      ariaHidden: el.getAttribute('aria-hidden'),
    }));

    targets.forEach(el => {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    });

    return () => {
      restore.forEach(({ el, inert, ariaHidden }) => {
        if (!inert) el.removeAttribute('inert');
        if (ariaHidden === null) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [active, selector]);
}
