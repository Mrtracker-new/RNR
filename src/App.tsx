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
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
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
