import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Traps keyboard focus inside `containerRef` while `active` is true:
 * - moves focus to the first focusable element (or the container) on open,
 * - cycles Tab / Shift+Tab within the container,
 * - calls `onEscape` when Escape is pressed,
 * - restores focus to the previously focused element on close.
 *
 * The container should have `tabIndex={-1}` so it can receive focus when it
 * holds no focusable children.
 *
 * `onEscape` is read through a ref so an inline callback doesn't tear down and
 * re-run the trap (which would bounce focus back to the first item) on every
 * parent render.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onEscape?: () => void
): void {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
      );

    // Move focus into the dialog once it is painted.
    const raf = requestAnimationFrame(() => {
      const focusables = getFocusable();
      (focusables[0] ?? container).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !container.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);

      /* Restore on the next task so sibling cleanups (notably removing the
         background's inert attribute) run first — focusing into a still-inert
         subtree is silently ignored by the browser. */
      setTimeout(() => {
        if (
          previouslyFocused &&
          document.contains(previouslyFocused) &&
          typeof previouslyFocused.focus === 'function'
        ) {
          previouslyFocused.focus();
        }
      }, 0);
    };
  }, [active, containerRef]);
}
