import React, { useCallback, useEffect, useRef, useState } from 'react';

/* Scramble glyphs — cipher-flavoured to match the privacy/security brand. */
const GLYPHS = '01<>-_[]{}=+*!#%$&/\\ABCDEF0123456789';

interface DecryptTextProps {
  text: string;
  className?: string;
  /** Element to render as. Defaults to <span>. */
  as?: React.ElementType;
  /** Reveal duration in ms. */
  duration?: number;
  /** Re-run the scramble when the element is hovered. */
  replayOnHover?: boolean;
}

/**
 * Renders `text` with a left-to-right "decrypt" reveal: each character cycles
 * through cipher glyphs, then locks to its final value. Runs once when the
 * element scrolls into view, and replays on hover. Falls back to static text
 * when the user prefers reduced motion. The real string is always exposed via
 * aria-label so assistive tech never reads the scramble.
 */
const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  className,
  as: Tag = 'span',
  duration = 700,
  replayOnHover = true,
}) => {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const playedRef = useRef(false);

  const run = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(text);
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const lock = p * text.length;
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || i < lock) out += ch;
        else out += GLYPHS[(i * 7 + Math.floor(t)) % GLYPHS.length];
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else setDisplay(text);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [text, duration]);

  /* Reset when the label itself changes (e.g. filtered list re-renders). */
  useEffect(() => {
    playedRef.current = false;
    setDisplay(text);
  }, [text]);

  /* Fire once when scrolled into view. */
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [run]);

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      onMouseEnter={replayOnHover ? run : undefined}
    >
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
};

export default DecryptText;
