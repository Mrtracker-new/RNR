// Performance utilities for better mobile and overall performance

// Device detection utilities
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return {
    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width <= 768,
    isTablet: /ipad|android(?!.*mobile)/i.test(userAgent) || (width > 768 && width <= 1024),
    isDesktop: width > 1024,
    isLowEnd: 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency <= 2,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    screenWidth: width,
    screenHeight: height,
    devicePixelRatio: window.devicePixelRatio || 1,
    touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
  };
};

// Performance monitoring
export const measurePerformance = () => {
  if (!window.performance) return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');
  
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    totalPageLoad: navigation.loadEventEnd - (navigation.fetchStart || 0),
  };
};

// Animation configuration based on device capabilities
export const getAnimationConfig = () => {
  const device = getDeviceInfo();
  
  if (device.prefersReducedMotion) {
    return {
      duration: 0.2,
      stagger: 0.05,
      bounce: 0,
      damping: 30,
      stiffness: 300,
      mass: 1,
      reducedMotion: true,
    };
  }

  if (device.isMobile || device.isLowEnd) {
    return {
      duration: 0.4,
      stagger: 0.1,
      bounce: 0.1,
      damping: 25,
      stiffness: 400,
      mass: 0.8,
      reducedMotion: false,
    };
  }

  return {
    duration: 0.6,
    stagger: 0.15,
    bounce: 0.2,
    damping: 20,
    stiffness: 500,
    mass: 1,
    reducedMotion: false,
  };
};

// Intersection Observer with better performance
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Debounce utility for performance-critical operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for scroll/resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// RequestAnimationFrame utility
export const raf = (callback: () => void): number => {
  return window.requestAnimationFrame(callback);
};

// Memory cleanup utilities
export const cleanup = {
  timers: new Set<NodeJS.Timeout>(),
  intervals: new Set<NodeJS.Timer>(),
  observers: new Set<IntersectionObserver | MutationObserver>(),
  listeners: new Map<EventTarget, { event: string; handler: EventListener }[]>(),
  
  setTimeout: (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      callback();
      cleanup.timers.delete(timer);
    }, delay);
    cleanup.timers.add(timer);
    return timer;
  },
  
  setInterval: (callback: () => void, delay: number) => {
    const interval = setInterval(callback, delay);
    cleanup.intervals.add(interval);
    return interval;
  },
  
  addEventListener: (target: EventTarget, event: string, handler: EventListener, options?: AddEventListenerOptions) => {
    target.addEventListener(event, handler, options);
    
    if (!cleanup.listeners.has(target)) {
      cleanup.listeners.set(target, []);
    }
    cleanup.listeners.get(target)?.push({ event, handler });
  },
  
  observe: (observer: IntersectionObserver | MutationObserver, target?: Element) => {
    if (target && 'observe' in observer) {
      observer.observe(target);
    }
    cleanup.observers.add(observer);
    return observer;
  },
  
  clearAll: () => {
    // Clear all timers
    cleanup.timers.forEach(timer => clearTimeout(timer));
    cleanup.timers.clear();
    
    // Clear all intervals
    cleanup.intervals.forEach(interval => clearInterval(interval));
    cleanup.intervals.clear();
    
    // Disconnect all observers
    cleanup.observers.forEach(observer => observer.disconnect());
    cleanup.observers.clear();
    
    // Remove all event listeners
    cleanup.listeners.forEach((listeners, target) => {
      listeners.forEach(({ event, handler }) => {
        target.removeEventListener(event, handler);
      });
    });
    cleanup.listeners.clear();
  },
};

// Preload critical resources
export const preloadResource = (url: string, type: 'image' | 'script' | 'style' | 'font') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
  }
  
  document.head.appendChild(link);
};

// Web Vitals monitoring (simplified)
export const vitalsMonitor = {
  cls: 0,
  fid: 0,
  lcp: 0,
  
  init: () => {
    // Monitor Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          vitalsMonitor.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Monitor First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            vitalsMonitor.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Monitor Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              vitalsMonitor.cls += entry.value;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }
  },
  
  getMetrics: () => ({
    cls: vitalsMonitor.cls,
    fid: vitalsMonitor.fid,
    lcp: vitalsMonitor.lcp,
  }),
};

// Optimize images based on device capabilities
export const getOptimalImageSettings = (originalWidth: number, originalHeight: number) => {
  const device = getDeviceInfo();
  
  let quality = 85;
  let maxWidth = originalWidth;
  
  if (device.isMobile) {
    quality = 70;
    maxWidth = Math.min(originalWidth, 800);
  } else if (device.isTablet) {
    quality = 80;
    maxWidth = Math.min(originalWidth, 1200);
  }
  
  // Adjust for high DPI screens
  if (device.devicePixelRatio > 1.5) {
    maxWidth *= 1.5;
    quality -= 10;
  }
  
  return {
    quality: Math.max(50, quality),
    maxWidth: Math.round(maxWidth),
    format: device.isMobile ? 'webp' : 'auto',
  };
};

// Scroll performance utilities
export class ScrollOptimizer {
  private isScrolling = false;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private observers = new Set<Function>();
  private lastScrollY = 0;
  private scrollDirection: 'up' | 'down' = 'down';
  private animationFrameId: number | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Optimized scroll listener using passive events
    const handleScroll = () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      this.animationFrameId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = currentScrollY;

        // Notify observers
        this.observers.forEach(callback => {
          callback({
            scrollY: currentScrollY,
            direction: this.scrollDirection,
            isScrolling: true,
          });
        });

        // Set scrolling state
        if (!this.isScrolling) {
          this.isScrolling = true;
          document.body.classList.add('is-scrolling');
        }

        // Clear timeout and reset scrolling state
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
          this.isScrolling = false;
          document.body.classList.remove('is-scrolling');
          
          // Notify observers that scrolling ended
          this.observers.forEach(callback => {
            callback({
              scrollY: currentScrollY,
              direction: this.scrollDirection,
              isScrolling: false,
            });
          });
        }, 150);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
    });
  }

  // Subscribe to scroll events
  subscribe(callback: Function) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Get current scroll info
  getScrollInfo() {
    return {
      scrollY: this.lastScrollY,
      direction: this.scrollDirection,
      isScrolling: this.isScrolling,
    };
  }

  // Smooth scroll to element
  scrollToElement(element: Element | string, offset = 0) {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // Use native smooth scrolling if supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      this.smoothScrollPolyfill(targetPosition);
    }
  }

  private smoothScrollPolyfill(targetPosition: number) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    let start: number | null = null;

    const animation = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const ease = 1 - Math.pow(1 - percentage, 3);
      
      window.scrollTo(0, startPosition + (distance * ease));
      
      if (progress < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}

// Global scroll optimizer instance
export const scrollOptimizer = new ScrollOptimizer();

// Scroll performance CSS injection
export const injectScrollOptimizations = () => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    /* Scroll performance optimizations */
    .is-scrolling {
      pointer-events: none;
    }
    
    .is-scrolling * {
      animation-play-state: paused !important;
    }
    
    /* Optimize transforms during scroll */
    .scroll-optimize {
      will-change: transform;
      backface-visibility: hidden;
      perspective: 1000px;
    }
    
    /* Hide elements during fast scrolling on mobile */
    @media (max-width: 768px) {
      .is-scrolling .scroll-hide-on-mobile {
        opacity: 0.5;
        transition: opacity 0.1s ease;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Initialize scroll optimizations
if (typeof window !== 'undefined') {
  // Inject optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScrollOptimizations);
  } else {
    injectScrollOptimizations();
  }
}

// Intersection Observer for scroll-based animations
export class IntersectionOptimizer {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>();
  private rootMargin = '20% 0px';
  private threshold = [0, 0.25, 0.5, 0.75, 1];

  constructor() {
    this.init();
  }

  private init() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            raf(() => callback(entry));
          }
        });
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );
  }

  observe(element: Element, callback: (entry: IntersectionObserverEntry) => void) {
    if (!this.observer || !element) return;

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    if (!this.observer || !element) return;

    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
}

// Performance-aware animation utilities
export class AnimationOptimizer {
  private animatingElements = new Set<Element>();
  private isScrolling = false;
  private scrollTimeout: number | null = null;

  constructor() {
    this.setupScrollListener();
  }

  private setupScrollListener() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        raf(() => {
          this.isScrolling = true;
          this.pauseExpensiveAnimations();
          
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
          }
          
          this.scrollTimeout = window.setTimeout(() => {
            this.isScrolling = false;
            this.resumeAnimations();
          }, 150);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  registerAnimation(element: Element) {
    this.animatingElements.add(element);
  }

  unregisterAnimation(element: Element) {
    this.animatingElements.delete(element);
  }

  private pauseExpensiveAnimations() {
    this.animatingElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.animationPlayState = 'paused';
        element.classList.add('scroll-paused');
      }
    });
  }

  private resumeAnimations() {
    this.animatingElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.animationPlayState = 'running';
        element.classList.remove('scroll-paused');
      }
    });
  }

  isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }
}

// Initialize performance utilities
export const intersectionOptimizer = new IntersectionOptimizer();
export const animationOptimizer = new AnimationOptimizer();
