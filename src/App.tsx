import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyle } from './styles/GlobalStyle';
import Navbar from './components/Navbar';
import BackgroundEffect from './components/BackgroundEffect';
import { FullScreenLoading } from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import CursorEffect from './components/CursorEffect';
import ExitIntentPopup from './components/ExitIntentPopup';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

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
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
