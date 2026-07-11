import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation, AnimatePresence, MotionConfig } from 'framer-motion';
import styled from 'styled-components';
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
import { FullScreenLoading } from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumb from './components/Breadcrumb';
import { useViewTransition } from './hooks/useViewTransition';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './utils/routes';

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 1em;
  background: var(--accent-primary);
  color: black;
  font-weight: bold;

  &:focus {
    left: 50%;
    transform: translateX(-50%);
    top: 1em;
  }
`;

const PageErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary, #aaa);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary, #fff);
  }

  button {
    margin-top: 1.25rem;
    padding: 0.6rem 1.5rem;
    border: 1px solid var(--accent-primary, #3b82f6);
    border-radius: 999px;
    background: transparent;
    color: var(--accent-primary, #3b82f6);
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;

    &:hover {
      background: var(--accent-primary, #3b82f6);
      color: #fff;
    }
  }
`;

function PageError({ message }: { message: string }) {
  return (
    <PageErrorWrapper>
      <h2>⚠️ {message}</h2>
      <p>Please try refreshing the page.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </PageErrorWrapper>
  );
}

const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'));

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  const { supported } = useViewTransition();

  const routes = (
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
  );

  return (
    <Suspense fallback={<FullScreenLoading text="Loading Page..." />}>
      {supported ? (
        routes
      ) : (
        <AnimatePresence mode="wait">
          {routes}
        </AnimatePresence>
      )}
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
