import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyle } from './styles/GlobalStyle';
import Navbar from './components/Navbar';
import BackgroundEffect from './components/BackgroundEffect';
import { FullScreenLoading } from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import CursorEffect from './components/CursorEffect';
import ExitIntentPopup from './components/ExitIntentPopup';
import Breadcrumb from './components/Breadcrumb';

// Lazy load pages for code splitting and better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if critical resources are loaded
    const handleLoad = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    // If already loaded, set loading to false immediately
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
        <FullScreenLoading 
          text="Loading Portfolio..."
        />
      </>
    );
  }

  return (
    <Router>
      <GlobalStyle />
      <ScrollToTop />
      <BackgroundEffect />
      <CursorEffect />
      <ExitIntentPopup />
      <Breadcrumb />
      <Navbar />
      <Suspense fallback={
        <FullScreenLoading 
          text="Loading Page..."
        />
      }>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Router>
  );
}

export default App;
