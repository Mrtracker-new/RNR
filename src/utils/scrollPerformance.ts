// Scroll performance monitoring and debugging utilities
interface PerformanceStats {
  fps: number;
  frameTime: number;
  isScrolling: boolean;
  memoryUsage?: number;
}

export class ScrollPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private isMonitoring = false;
  private rafId: number | null = null;
  private observers: Array<(stats: PerformanceStats) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    this.startMonitoring();
    
    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryUsage();
      }, 5000);
    }
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitorFrame();
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private monitorFrame = () => {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.frameCount++;

    // Calculate FPS every 100ms
    if (deltaTime >= 100) {
      this.fps = Math.round((this.frameCount / deltaTime) * 1000);
      this.frameCount = 0;
      this.lastTime = now;

      // Notify observers
      const stats: PerformanceStats = {
        fps: this.fps,
        frameTime: deltaTime,
        isScrolling: document.body.classList.contains('is-scrolling'),
      };

      // Add memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        stats.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
      }

      this.observers.forEach(callback => callback(stats));
    }

    this.rafId = requestAnimationFrame(this.monitorFrame);
  };

  private checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1048576; // MB
      const limit = memory.jsHeapSizeLimit / 1048576; // MB
      
      if (used / limit > 0.8) {
        console.warn(`High memory usage: ${used.toFixed(2)}MB / ${limit.toFixed(2)}MB`);
      }
    }
  }

  subscribe(callback: (stats: PerformanceStats) => void) {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  getCurrentFPS(): number {
    return this.fps;
  }
}

// Debug panel component for development
export const createPerformancePanel = () => {
  if (typeof document === 'undefined' || process.env.NODE_ENV === 'production') return;

  const panel = document.createElement('div');
  panel.id = 'perf-panel';
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #00ff00;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    min-width: 200px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  const fpsElement = document.createElement('div');
  const memElement = document.createElement('div');
  const scrollElement = document.createElement('div');

  fpsElement.textContent = 'FPS: --';
  memElement.textContent = 'Memory: --';
  scrollElement.textContent = 'Scrolling: No';

  panel.appendChild(fpsElement);
  panel.appendChild(memElement);
  panel.appendChild(scrollElement);

  document.body.appendChild(panel);

  const monitor = new ScrollPerformanceMonitor();
  monitor.subscribe((stats) => {
    fpsElement.textContent = `FPS: ${stats.fps}`;
    fpsElement.style.color = stats.fps >= 50 ? '#00ff00' : stats.fps >= 30 ? '#ffff00' : '#ff0000';
    
    if (stats.memoryUsage) {
      memElement.textContent = `Memory: ${stats.memoryUsage.toFixed(1)}MB`;
    }
    
    scrollElement.textContent = `Scrolling: ${stats.isScrolling ? 'Yes' : 'No'}`;
    scrollElement.style.color = stats.isScrolling ? '#ff6600' : '#00ff00';
  });

  return {
    panel,
    monitor,
    destroy: () => {
      monitor.stopMonitoring();
      panel.remove();
    }
  };
};

// Scroll jank detector
export const detectScrollJank = () => {
  let lastScrollTime = 0;
  let jankCount = 0;
  
  const handleScroll = () => {
    const now = performance.now();
    const deltaTime = now - lastScrollTime;
    
    // Consider it jank if more than 16.67ms (60fps threshold) between scroll events
    if (lastScrollTime > 0 && deltaTime > 50) {
      jankCount++;
      console.warn(`Scroll jank detected: ${deltaTime.toFixed(2)}ms gap`);
    }
    
    lastScrollTime = now;
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    console.log(`Total scroll jank events: ${jankCount}`);
  };
};

// Global performance monitor instance
export const performanceMonitor = new ScrollPerformanceMonitor();

// Initialize debug panel in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    // Add toggle for performance panel with keyboard shortcut
    let debugPanel: ReturnType<typeof createPerformancePanel> | null = null;
    
    const togglePanel = () => {
      if (debugPanel) {
        debugPanel.destroy();
        debugPanel = null;
      } else {
        debugPanel = createPerformancePanel();
      }
    };
    
    // Toggle with Ctrl+Shift+P
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        togglePanel();
      }
    });
    
    // Auto-start jank detection
    detectScrollJank();
  });
}
