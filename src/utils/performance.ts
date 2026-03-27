// Scroll performance utilities

export class ScrollOptimizer {
  private isScrolling = false;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
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
