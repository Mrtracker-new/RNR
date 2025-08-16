import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
`;

const Image = styled.img<{ isLoaded: boolean }>`
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isLoaded ? 1 : 0};
`;

const Placeholder = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${props => props.isVisible ? 'loading' : 'none'} 1.5s infinite;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  placeholder,
  sizes,
  style,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === 'eager') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const shouldLoadImage = loading === 'eager' || isIntersecting;

  return (
    <ImageContainer 
      ref={containerRef}
      className={className}
      style={{ width, height }}
    >
      {shouldLoadImage && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          isLoaded={isLoaded && !hasError}
          loading={loading}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          fetchPriority={loading === 'eager' ? 'high' : 'low'}
          style={style}
        />
      )}
      <Placeholder isVisible={!isLoaded && !hasError} />
      {hasError && (
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--dark-400)',
          fontSize: 'var(--text-sm)'
        }}>
          Failed to load image
        </div>
      )}
    </ImageContainer>
  );
};

export default OptimizedImage;
