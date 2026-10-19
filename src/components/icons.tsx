/* Inline SVG glyphs shared by the contact list, project cards and the
   case-study modal. All of them inherit currentColor and are decorative. */

interface IconProps {
  size?: number;
}

const baseProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: 'false' as const,
});

export const GitHubSVG = ({ size = 16 }: IconProps) => (
  <svg {...baseProps(size)} fill="currentColor">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

export const LinkedInSVG = ({ size = 16 }: IconProps) => (
  <svg {...baseProps(size)} fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0Z" />
  </svg>
);

export const InstagramSVG = ({ size = 16 }: IconProps) => (
  <svg {...baseProps(size)} fill="currentColor">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);

export const DevToSVG = ({ size = 16 }: IconProps) => (
  <svg {...baseProps(size)} fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18ZM0 4.94v14.12h24V4.94H0Zm8.56 10.36c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3Zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29Zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.74 0 .74.04 0 .14-1.67 6.38-1.8 6.68Z" />
  </svg>
);

export const ExternalSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
    <polyline points="10 3 13 3 13 6" />
    <line x1="7" y1="9" x2="13" y2="3" />
  </svg>
);

export const DownloadSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" />
    <polyline points="4 7 8 11 12 7" />
    <line x1="8" y1="1" x2="8" y2="11" />
  </svg>
);

export const ArrowUpRightSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="12" x2="12" y2="4" />
    <polyline points="6 4 12 4 12 10" />
  </svg>
);

export const ShieldSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2.6 4.6 5.5v6.1c0 4.5 3.1 8.5 7.4 9.8 4.3-1.3 7.4-5.3 7.4-9.8V5.5L12 2.6Z" />
    <path d="m8.9 12 2.1 2.1 4.1-4.2" />
  </svg>
);

const WebAppSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 12h17.6" />
    <path d="M12 3c2.4 2.7 3.7 5.7 3.7 9s-1.3 6.3-3.7 9c-2.4-2.7-3.7-5.7-3.7-9S9.6 5.7 12 3Z" />
  </svg>
);

const DesktopAppSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2.6" y="4" width="18.8" height="12.4" rx="2" />
    <path d="M8.6 20h6.8M12 16.4V20" />
  </svg>
);

const MobileAppSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="7" y="2.6" width="10" height="18.8" rx="2.4" />
    <path d="M10.8 5.6h2.4" />
  </svg>
);

const GenericAppSVG = ({ size = 16 }: IconProps) => (
  <svg
    {...baseProps(size)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 7.5 4.5 12 9 16.5" />
    <polyline points="15 7.5 19.5 12 15 16.5" />
  </svg>
);

/* Project cards show one glyph per category instead of the per-project emoji
   that used to sit in the data file. */
export const CategoryIcon = ({ category, size = 16 }: IconProps & { category: string }) => {
  if (category === 'Web Application') return <WebAppSVG size={size} />;
  if (category === 'Desktop Application') return <DesktopAppSVG size={size} />;
  if (category === 'Android App') return <MobileAppSVG size={size} />;
  return <GenericAppSVG size={size} />;
};
