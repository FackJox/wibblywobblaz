class AnimationPool {
  private animations: Set<string> = new Set();
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private cpuThreshold: number = 5;
  private isPaused: boolean = false;

  register(id: string) {
    this.animations.add(id);
    if (!this.isRunning && !this.isPaused) {
      this.start();
    }
  }

  unregister(id: string) {
    this.animations.delete(id);
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  private start() {
    if (this.isRunning || this.isPaused) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  private stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  private tick = () => {
    if (!this.isRunning || this.isPaused) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    // Monitor performance
    if (deltaTime > 20) { // Over 20ms per frame indicates performance issues
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
        if (this.animations.size > 0) {
          this.start();
        }
      }, 100);
      return;
    }

    this.lastTime = currentTime;
    this.rafId = requestAnimationFrame(this.tick);
  };

  get activeCount() {
    return this.animations.size;
  }

  get paused() {
    return this.isPaused;
  }
}

export const animationPool = new AnimationPool();