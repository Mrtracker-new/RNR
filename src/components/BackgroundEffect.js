import React from 'react';
import styled from 'styled-components';

const BackgroundEffect = () => {
  return (
    <BackgroundContainer>
      <GradientOverlay />
      <BackgroundPattern />
      <GlowingOrbs>
        <Orb className="orb-1" />
        <Orb className="orb-2" />
        <Orb className="orb-3" />
      </GlowingOrbs>
    </BackgroundContainer>
  );
};

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
  background-size: 50px 50px;
  opacity: 0.2;
`;

const GlowingOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.4;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 15s infinite ease-in-out;
  
  &.orb-1 {
    top: 20%;
    left: 10%;
    width: 300px;
    height: 300px;
    background: rgba(100, 255, 218, 0.3);
    animation-delay: 0s;
  }
  
  &.orb-2 {
    bottom: 10%;
    right: 15%;
    width: 400px;
    height: 400px;
    background: rgba(100, 200, 255, 0.2);
    animation-delay: -5s;
  }
  
  &.orb-3 {
    top: 50%;
    right: 30%;
    width: 200px;
    height: 200px;
    background: rgba(149, 100, 255, 0.2);
    animation-delay: -10s;
  }
  
  @keyframes float {
    0% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(30px, 20px) scale(1.05);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }
`;

export default BackgroundEffect;