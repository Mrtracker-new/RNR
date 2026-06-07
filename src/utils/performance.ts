

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
    const handleScroll = () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      this.animationFrameId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = currentScrollY;

        this.observers.forEach(callback => {
          callback({
            scrollY: currentScrollY,
            direction: this.scrollDirection,
            isScrolling: true,
          });
        });

        if (!this.isScrolling) {
          this.isScrolling = true;
          document.body.classList.add('is-scrolling');
        }

        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
          this.isScrolling = false;
          document.body.classList.remove('is-scrolling');

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

    window.addEventListener('pagehide', () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
    });
  }

  subscribe(callback: Function) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  getScrollInfo() {
    return {
      scrollY: this.lastScrollY,
      direction: this.scrollDirection,
      isScrolling: this.isScrolling,
    };
  }

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

      const ease = 1 - Math.pow(1 - percentage, 3);

      window.scrollTo(0, startPosition + (distance * ease));

      if (progress < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}

export const scrollOptimizer = new ScrollOptimizer();
