import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import styled from 'styled-components';
import { FullScreenLoading } from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumb from './components/Breadcrumb';
import ErrorBoundary, { PageError } from './components/ErrorBoundary';
import { ROUTES } from './utils/routes';

const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'));

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectPage = lazy(() => import('./pages/projects/ProjectPage'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const NotFound = lazy(() => import('./pages/NotFound'));

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 1em;
  background: var(--accent-fill);
  color: #ffffff;
  font-weight: bold;

  &:focus {
    left: 50%;
    transform: translateX(-50%);
    top: 1em;
  }
`;

function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoading text="Loading Page..." />}>
      <Routes>
        <Route path={ROUTES.HOME} element={
          <ErrorBoundary fallback={<PageError message="Home page failed to load" />}>
            <Home />
          </ErrorBoundary>
        } />
        <Route path={ROUTES.ABOUT} element={
          <ErrorBoundary fallback={<PageError message="About page failed to load" />}>
            <About />
          </ErrorBoundary>
        } />
        <Route path={ROUTES.PROJECTS} element={
          <ErrorBoundary fallback={<PageError message="Projects page failed to load" />}>
            <Projects />
          </ErrorBoundary>
        } />
        <Route path={`${ROUTES.PROJECTS}/:slug`} element={
          <ErrorBoundary fallback={<PageError message="Case study failed to load" />}>
            <ProjectPage />
          </ErrorBoundary>
        } />
        <Route path={ROUTES.BLOG} element={
          <ErrorBoundary fallback={<PageError message="Blog page failed to load" />}>
            <Blog />
          </ErrorBoundary>
        } />
        <Route path={ROUTES.CONTACT} element={
          <ErrorBoundary fallback={<PageError message="Contact page failed to load" />}>
            <Contact />
          </ErrorBoundary>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Router>
          <ScrollToTop />
          <Suspense fallback={null}>
            <ExitIntentPopup />
          </Suspense>
          <Breadcrumb />
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main id="main-content" role="main" tabIndex={-1} style={{ minHeight: 'calc(100vh - 80px)' }}>
            <AppRoutes />
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Router>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
