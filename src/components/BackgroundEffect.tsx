import React, { memo, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { getDeviceInfo } from '../utils/performance';

const moveInCircle = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

const moveVertical = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
`;

const moveHorizontal = keyframes`
  0% { transform: translateX(0) translateY(-10%); }
  50% { transform: translateX(-50%) translateY(10%); }
  100% { transform: translateX(0) translateY(-10%); }
`;

const GradientBg = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  background: var(--dark-950);
  top: 0;
  left: 0;
  z-index: -1; /* Behind everything */
  pointer-events: none;
`;



const GradientsContainer = styled.div<{ $isMobile: boolean }>`
  filter: blur(${props => props.$isMobile ? '40px' : '80px'}); /* Reduced blur for mobile performance */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6; /* Subtle visibility */
  transform: translateZ(0); /* Force hardware acceleration */
`;

const Orb1 = styled.div`
  position: absolute;
  background: radial-gradient(circle at center, rgba(100, 255, 218, 0.4) 0, rgba(100, 255, 218, 0) 50%); /* Teal */
  width: var(--orb-size, 80vw);
  height: var(--orb-size, 80vw);
  top: calc(50% - var(--orb-size, 80vw) / 2);
  left: calc(50% - var(--orb-size, 80vw) / 2);
  transform-origin: center center;
  animation: ${moveVertical} 30s ease infinite;
  opacity: 0.4;
  will-change: transform;
`;

const Orb2 = styled.div`
  position: absolute;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0, rgba(139, 92, 246, 0) 50%); /* Violet */
  width: var(--orb-size, 70vw);
  height: var(--orb-size, 70vw);
  top: calc(50% - var(--orb-size, 70vw) / 2);
  left: calc(50% - var(--orb-size, 70vw) / 2);
  transform-origin: calc(50% - 400px);
  animation: ${moveInCircle} 20s reverse infinite;
  opacity: 0.4;
  will-change: transform;
`;

const Orb3 = styled.div`
  position: absolute;
  background: radial-gradient(circle at center, rgba(37, 99, 235, 0.4) 0, rgba(37, 99, 235, 0) 50%); /* Blue */
  width: var(--orb-size, 60vw);
  height: var(--orb-size, 60vw);
  top: calc(50% - var(--orb-size, 60vw) / 2 + 200px);
  left: calc(50% - var(--orb-size, 60vw) / 2 - 500px);
  transform-origin: calc(50% + 400px);
  animation: ${moveHorizontal} 40s linear infinite;
  opacity: 0.4;
  will-change: transform;
`;

/* 
 * A purely CSS approach ensures:
 * 1. Animation runs on compositor thread (performance)
 * 2. No React re-renders for animation frames
 * 3. No heavy SVG noise filters causing lag
 */
const BackgroundEffect: React.FC = () => {
  const isMobile = useMemo(() => {
    const device = getDeviceInfo();
    return device.isMobile || device.isLowEnd;
  }, []);

  return (
    <GradientBg>
      <GradientsContainer $isMobile={isMobile}>
        <Orb1 />
        {!isMobile && <Orb2 />} {/* Reduce orb count on mobile */}
        <Orb3 />
      </GradientsContainer>
    </GradientBg>
  );
};

export default memo(BackgroundEffect);
