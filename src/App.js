import React, { useState, useEffect, lazy, Suspense, useCallback, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import styled from 'styled-components';

// Styles
import GlobalStyle from './styles/GlobalStyle';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundEffect from './components/BackgroundEffect';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// ScrollToTop component to handle scrolling to top on page change
const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  
  return null;
});

// Main App component that wraps everything in Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// App content component that has access to location
const AppContent = memo(() => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Handle scroll effect with throttled passive event listener for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setShowScrollTop(scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <BackgroundEffect />
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
      
      <AnimatePresence>
        {showScrollTop && (
          <ScrollTopButton
            as={motion.button}
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            aria-label="Scroll to top"
          >
            <FiArrowUp size={20} />
          </ScrollTopButton>
        )}
      </AnimatePresence>
    </>
  );
});

// Page wrapper for consistent transitions
const PageWrapper = memo(({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
});

// Loading fallback component for lazy-loaded routes
const LoadingFallback = memo(() => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText>Loading...</LoadingText>
  </LoadingContainer>
));

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid rgba(100, 255, 218, 0.2);
  border-radius: 50%;
  border-top-color: #64ffda;
  animation: spin 0.8s linear infinite;
  will-change: transform;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64ffda;
  font-size: 14px;
  margin: 0;
`;

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 15px;
  right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #64ffda;
  color: #0a192f;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 999;
  transition: all 0.3s ease;
  will-change: transform; /* Optimize for animations */
  
  &:hover {
    transform: translateY(-5px);
    background-color: #a8ffe0;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    bottom: 10px;
    right: 10px;
  }
`;

export default App;
