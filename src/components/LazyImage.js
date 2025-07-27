import React, { useState, useRef, useEffect, memo } from 'react';
import styled from 'styled-components';

const LazyImage = memo(({ src, alt, placeholder, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <ImageContainer ref={imgRef} {...props}>
      {!isInView && (
        <PlaceholderDiv>
          {placeholder || <LoadingSpinner />}
        </PlaceholderDiv>
      )}
      
      {isInView && !error && (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loaded={isLoaded}
        />
      )}
      
      {error && (
        <ErrorDiv>
          <span>Failed to load image</span>
        </ErrorDiv>
      )}
    </ImageContainer>
  );
});

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ loaded }) => loaded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const PlaceholderDiv = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(100, 255, 218, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64ffda;
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid rgba(100, 255, 218, 0.2);
  border-radius: 50%;
  border-top-color: #64ffda;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorDiv = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 100, 100, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6464;
  font-size: 14px;
`;

export default LazyImage;
