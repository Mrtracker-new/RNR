import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { scrollOptimizer, animationOptimizer } from '../utils/performance';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const FloatingElement = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px);
  background-size: 100px 100px;
  opacity: 0.8;
  animation: gridPulse 8s ease-in-out infinite alternate;

  @keyframes gridPulse {
    0% { opacity: 0.4; }
    100% { opacity: 0.8; }
  }
`;

const GlowOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba(100, 255, 218, 0.08) 0%,
      rgba(100, 255, 218, 0.04) 30%,
      transparent 70%
    );
    border-radius: 50%;
    animation: float1 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    right: 15%;
    width: 250px;
    height: 250px;
    background: radial-gradient(
      circle,
      rgba(139, 92, 246, 0.08) 0%,
      rgba(139, 92, 246, 0.04) 30%,
      transparent 70%
    );
    border-radius: 50%;
    animation: float2 25s ease-in-out infinite;
  }

  @keyframes float1 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(20px, -20px) rotate(90deg);
    }
    50% {
      transform: translate(-15px, 15px) rotate(180deg);
    }
    75% {
      transform: translate(15px, 25px) rotate(270deg);
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(-25px, -15px) rotate(120deg);
    }
    66% {
      transform: translate(20px, -25px) rotate(240deg);
    }
  }
`;

const BackgroundEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastCallTime = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldPauseAnimations, setShouldPauseAnimations] = useState(false);

  // Scroll performance optimization
  useEffect(() => {
    const handleScrollUpdate = (scrollData: any) => {
      const { isScrolling: scrolling } = scrollData;
      // Pause animations during scroll on mobile for better performance
      setShouldPauseAnimations(scrolling && isMobile);
    };

    const unsubscribe = scrollOptimizer.subscribe(handleScrollUpdate);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isMobile]);

  // Register with animation optimizer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    animationOptimizer.registerAnimation(container);
    
    return () => {
      animationOptimizer.unregisterAnimation(container);
    };
  }, []);

  useEffect(() => {
    // Check for mobile devices and reduced motion preferences
    const checkMobile = () => window.innerWidth <= 768;
    const checkReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsMobile(checkMobile());
    setPrefersReducedMotion(checkReducedMotion());

    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle to 60fps maximum
      if (now - lastCallTime.current < 16) return;
      lastCallTime.current = now;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const elements = container.querySelectorAll('.mouse-follow');
        elements.forEach((element, index) => {
          const el = element as HTMLElement;
          const speed = (index + 1) * 0.015; // Reduced speed for smoother animation
          const xOffset = (x - rect.width / 2) * speed;
          const yOffset = (y - rect.height / 2) * speed;
          
          el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      });
    };

    // Use passive listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  const floatingElements = [
    { size: 200, color: 'rgba(100, 255, 218, 0.1)', x: '10%', y: '20%', duration: 20 },
    { size: 150, color: 'rgba(139, 92, 246, 0.08)', x: '80%', y: '10%', duration: 25 },
    { size: 100, color: 'rgba(100, 255, 218, 0.06)', x: '20%', y: '80%', duration: 30 },
    { size: 120, color: 'rgba(139, 92, 246, 0.07)', x: '70%', y: '70%', duration: 18 },
    { size: 80, color: 'rgba(100, 255, 218, 0.05)', x: '50%', y: '30%', duration: 22 }
  ];

  // Optimized particle count for better performance
  // Reduced from 15 to 6 on desktop for 60% less animation overhead
  const particleCount = isMobile ? 3 : prefersReducedMotion ? 0 : 6;

  return (
    <BackgroundContainer ref={containerRef}>
      <GridOverlay />
      <GlowOrbs />
      
      {floatingElements.map((element, index) => (
        <FloatingElement
          key={index}
          className="mouse-follow"
          size={element.size}
          color={element.color}
          initial={{ 
            x: element.x, 
            y: element.y,
            opacity: 0 
          }}
          animate={prefersReducedMotion || shouldPauseAnimations ? { 
            opacity: shouldPauseAnimations ? 0.2 : 0.6 
          } : { 
            x: [element.x, `calc(${element.x} + 30px)`, element.x],
            y: [element.y, `calc(${element.y} - 20px)`, element.y],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: element.duration,
            repeat: (prefersReducedMotion || shouldPauseAnimations) ? 0 : Infinity,
            ease: "easeInOut",
            delay: index * 1.5 // Reduced delay
          }}
          style={{
            left: element.x,
            top: element.y,
            willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
          }}
        />
      ))}

      {/* Optimized animated particles */}
      {Array.from({ length: particleCount }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1, // Smaller particles
            height: Math.random() * 3 + 1,
            background: Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--secondary-400)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1, // Reduced opacity
            willChange: shouldPauseAnimations ? 'auto' : 'transform, opacity',
            visibility: shouldPauseAnimations ? 'hidden' : 'visible'
          }}
          animate={shouldPauseAnimations ? {
            opacity: 0.1,
            scale: 1,
            y: 0
          } : {
            y: [0, -20, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shouldPauseAnimations ? 0.2 : Math.random() * 8 + 12, // Faster transition when paused
            repeat: shouldPauseAnimations ? 0 : Infinity,
            ease: "easeInOut",
            delay: shouldPauseAnimations ? 0 : Math.random() * 3,
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default BackgroundEffect;
