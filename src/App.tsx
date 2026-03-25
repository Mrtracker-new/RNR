import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FullScreenLoading } from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumb from './components/Breadcrumb';
import { useViewTransition } from './hooks/useViewTransition';
import ErrorBoundary from './components/ErrorBoundary';

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
    border: 1px solid var(--accent-primary, #667eea);
    border-radius: 999px;
    background: transparent;
    color: var(--accent-primary, #667eea);
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;

    &:hover {
      background: var(--accent-primary, #667eea);
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

// Lazy load visual enhancement components to reduce initial bundle size
const BackgroundEffect = lazy(() => import('./components/BackgroundEffect'));
const CursorEffect = lazy(() => import('./components/CursorEffect'));
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'));

// Lazy load pages for code splitting and better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Inner component that must live *inside* <Router> so it can call
 * useViewTransition() (which needs useLocation() from React Router).
 */
function AppRoutes() {
  const { supported } = useViewTransition();

  const routes = (
    <Routes>
      <Route path="/" element={
        <ErrorBoundary fallback={<PageError message="Home page failed to load" />}>
          <Home />
        </ErrorBoundary>
      } />
      <Route path="/about" element={
        <ErrorBoundary fallback={<PageError message="About page failed to load" />}>
          <About />
        </ErrorBoundary>
      } />
      <Route path="/projects" element={
        <ErrorBoundary fallback={<PageError message="Projects page failed to load" />}>
          <Projects />
        </ErrorBoundary>
      } />
      <Route path="/blog" element={
        <ErrorBoundary fallback={<PageError message="Blog page failed to load" />}>
          <Blog />
        </ErrorBoundary>
      } />
      <Route path="/contact" element={
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
        // View Transitions API handles the cross-fade natively — no wrapper needed.
        routes
      ) : (
        // Framer Motion AnimatePresence as fallback (Firefox, older Safari, etc.).
        <AnimatePresence mode="wait">
          {routes}
        </AnimatePresence>
      )}
    </Suspense>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <FullScreenLoading text="Loading Portfolio..." />
      </>
    );
  }

  return (
    <Router>
      <GlobalStyle />
      <ScrollToTop />
      <Suspense fallback={null}>
        <BackgroundEffect />
        <CursorEffect />
        <ExitIntentPopup />
      </Suspense>
      <Breadcrumb />
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Navbar />
      <main id="main-content" role="main" tabIndex={-1} style={{ minHeight: 'calc(100vh - 80px)' }}>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
