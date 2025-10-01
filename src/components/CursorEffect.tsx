import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const CursorDot = styled(motion.div)`
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 10000;
`;

const CursorRing = styled(motion.div)<{ isHovering: boolean }>`
  position: fixed;
  width: ${props => props.isHovering ? '60px' : '40px'};
  height: ${props => props.isHovering ? '60px' : '40px'};
  border: 2px solid ${props => props.isHovering ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
  border-radius: 50%;
  pointer-events: none;
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
  mix-blend-mode: difference;
  z-index: 9999;
`;

const TrailDot = styled(motion.div)`
  position: fixed;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0.4;
  pointer-events: none;
`;

interface Position {
  x: number;
  y: number;
}

const CursorEffect: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<Position[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const ringX = useSpring(cursorX, { damping: 30, stiffness: 150 });
  const ringY = useSpring(cursorY, { damping: 30, stiffness: 150 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX - 4);
    cursorY.set(e.clientY - 4);
    
    // Add to trail
    setTrail(prev => {
      const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
      return newTrail.slice(-10); // Keep only last 10 positions
    });
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.style.cursor === 'pointer'
    ) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut]);

  // Check if device has a mouse
  const [hasMouse, setHasMouse] = useState(false);
  
  useEffect(() => {
    const checkMouse = () => {
      setHasMouse(window.matchMedia('(pointer: fine)').matches);
    };
    
    checkMouse();
    window.addEventListener('resize', checkMouse);
    
    return () => window.removeEventListener('resize', checkMouse);
  }, []);

  if (!hasMouse) return null;

  return (
    <CursorContainer>
      {/* Trail effect */}
      {trail.map((pos, index) => (
        <TrailDot
          key={`trail-${index}`}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          style={{
            left: pos.x - 2,
            top: pos.y - 2,
          }}
        />
      ))}
      
      {/* Main cursor dot */}
      <CursorDot
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />
      
      {/* Cursor ring */}
      <CursorRing
        isHovering={isHovering}
        style={{
          left: ringX,
          top: ringY,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </CursorContainer>
  );
};

export default CursorEffect;
