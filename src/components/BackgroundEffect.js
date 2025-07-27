import React, { useEffect, useState, memo } from 'react';
import styled from 'styled-components';

const BackgroundEffect = memo(() => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Check if device is mobile for reduced animations
  useEffect(() => {
    let timeoutId;
    
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 100); // Debounce resize events
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile, { passive: true });
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Don't render orbs if user prefers reduced motion or on very small screens
  const shouldShowOrbs = !isReducedMotion && window.innerWidth > 480;
  
  return (
    <BackgroundContainer>
      <GradientOverlay />
      <BackgroundPattern isMobile={isMobile} />
      {shouldShowOrbs && (
        <GlowingOrbs isMobile={isMobile}>
          <Orb className="orb-1" isMobile={isMobile} isReducedMotion={isReducedMotion} />
          <Orb className="orb-2" isMobile={isMobile} isReducedMotion={isReducedMotion} />
          <Orb className="orb-3" isMobile={isMobile} isReducedMotion={isReducedMotion} />
        </GlowingOrbs>
      )}
    </BackgroundContainer>
  );
});

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a192f 0%, #0d2240 50%, #102a4c 100%);
  opacity: 0.8;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(100, 255, 218, 0.1) 1px, transparent 1px);
  background-size: ${props => props.isMobile ? '30px 30px' : '50px 50px'};
  opacity: ${props => props.isMobile ? '0.1' : '0.2'};
`;

const GlowingOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${props => props.isMobile ? '0.15' : '0.3'};
  will-change: opacity;
  pointer-events: none;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: ${props => props.isMobile ? 'blur(30px)' : 'blur(50px)'};
  opacity: ${props => props.isMobile ? '0.2' : '0.25'};
  animation: ${props => {
    if (props.isReducedMotion) return 'none';
    return props.isMobile ? 'float 25s' : 'float 20s';
  }} infinite ease-in-out;
  will-change: ${props => props.isReducedMotion ? 'auto' : 'transform'};
  pointer-events: none;
  
  &.orb-1 {
    top: 20%;
    left: 10%;
    width: ${props => props.isMobile ? '150px' : '250px'};
    height: ${props => props.isMobile ? '150px' : '250px'};
    background: rgba(100, 255, 218, 0.2);
    animation-delay: 0s;
  }
  
  &.orb-2 {
    bottom: 10%;
    right: 15%;
    width: ${props => props.isMobile ? '200px' : '300px'};
    height: ${props => props.isMobile ? '200px' : '300px'};
    background: rgba(100, 200, 255, 0.15);
    animation-delay: -8s;
  }
  
  &.orb-3 {
    top: 50%;
    right: 30%;
    width: ${props => props.isMobile ? '120px' : '180px'};
    height: ${props => props.isMobile ? '120px' : '180px'};
    background: rgba(149, 100, 255, 0.15);
    animation-delay: -15s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(${props => props.isMobile ? '10px' : '20px'}, ${props => props.isMobile ? '5px' : '10px'}) scale(${props => props.isMobile ? '1.01' : '1.02'});
    }
    66% {
      transform: translate(${props => props.isMobile ? '-8px' : '-15px'}, ${props => props.isMobile ? '8px' : '15px'}) scale(${props => props.isMobile ? '1.02' : '1.03'});
    }
  }
`;

export default BackgroundEffect;