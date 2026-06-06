export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  BLOG: '/blog',
  CONTACT: '/contact',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
