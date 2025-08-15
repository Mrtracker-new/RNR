import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  opacity: 0.1;
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
  animation: gridPulse 10s ease-in-out infinite alternate;

  @keyframes gridPulse {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
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
      transform: translate(30px, -30px) rotate(90deg);
    }
    50% {
      transform: translate(-20px, 20px) rotate(180deg);
    }
    75% {
      transform: translate(20px, 40px) rotate(270deg);
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(-40px, -20px) rotate(120deg);
    }
    66% {
      transform: translate(30px, -40px) rotate(240deg);
    }
  }
`;

const BackgroundEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const elements = container.querySelectorAll('.mouse-follow');
      elements.forEach((element, index) => {
        const el = element as HTMLElement;
        const speed = (index + 1) * 0.02;
        const xOffset = (x - rect.width / 2) * speed;
        const yOffset = (y - rect.height / 2) * speed;
        
        el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { size: 200, color: 'rgba(100, 255, 218, 0.1)', x: '10%', y: '20%', duration: 20 },
    { size: 150, color: 'rgba(139, 92, 246, 0.1)', x: '80%', y: '10%', duration: 25 },
    { size: 100, color: 'rgba(100, 255, 218, 0.08)', x: '20%', y: '80%', duration: 30 },
    { size: 120, color: 'rgba(139, 92, 246, 0.08)', x: '70%', y: '70%', duration: 18 },
    { size: 80, color: 'rgba(100, 255, 218, 0.06)', x: '50%', y: '30%', duration: 22 }
  ];

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
          animate={{ 
            x: [element.x, `calc(${element.x} + 50px)`, element.x],
            y: [element.y, `calc(${element.y} - 30px)`, element.y],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2
          }}
          style={{
            left: element.x,
            top: element.y,
          }}
        />
      ))}

      {/* Animated particles */}
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            background: Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--secondary-400)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default BackgroundEffect;
