import { ROUTES } from './routes';
import brand from '../data/brand.json';

/* Single source of truth for every brand, contact and URL constant. The values
   live in data/brand.json so copy and the production origin stay in one place.
   Import this instead of writing the origin or the email inline. */

export const SITE_URL = brand.siteUrl;
export const SITE_NAME = brand.name;
export const SITE_TITLE = `${brand.name} — ${brand.role}`;
export const SITE_DESCRIPTION = brand.description;

export const EMAIL = brand.email;
export const TWITTER_HANDLE = brand.twitterHandle;
export const DEVTO_USERNAME = (brand as { devtoUsername?: string }).devtoUsername ?? 'rolan_r_n_r';

export const OG_IMAGE = `${SITE_URL}/Social_card.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/jpeg';

export const AVAILABILITY = brand.availability;

export const BLOG_INTRO =
  "From encryption architecture to accessibility trade-offs — things I've shipped, broken, and rebuilt.";

/* The year the first line of code was written (see the About timeline). */
export const CODING_START_YEAR = 2019;

export const NAV = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.ABOUT, label: 'About' },
  { path: ROUTES.PROJECTS, label: 'Work' },
  { path: ROUTES.BLOG, label: 'Blog' },
  { path: ROUTES.CONTACT, label: 'Contact' },
] as const;

export interface Social {
  name: string;
  handle: string;
  href: string;
}

export const SOCIALS: Social[] = [
  { name: 'GitHub', handle: 'rolan-r-n-r', href: 'https://github.com/rolan-r-n-r' },
  { name: 'LinkedIn', handle: 'rolan-lobo', href: 'https://www.linkedin.com/in/rolan-lobo/' },
  { name: 'Instagram', handle: 'rolan_r_n_r', href: 'https://www.instagram.com/rolan_r_n_r/' },
  { name: 'Dev.to', handle: 'rolan_r_n_r', href: 'https://dev.to/rolan_r_n_r' },
];

export const SOCIAL_PROFILE_URLS = SOCIALS.map(social => social.href);
