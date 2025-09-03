# Story: Create Sound Wave Visualizers

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want to see animated waveforms on music-related links and content,
so that I get visual hints about audio content and feel engaged with the music.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Music visualization pattern
- Existing System Impact: Enhances music links and audio content
- Satisfaction Score: 72/100

## Acceptance Criteria

1. Music links show animated waveform visualizers
2. Waveforms animate smoothly on hover/interaction
3. Different patterns for different music types/moods
4. Sync with actual audio when playing
5. Fallback static waveform when not animating
6. Performance maintained at 60fps
7. Works without audio API support
8. Mobile touch interactions supported
9. Visually appealing in both themes

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Music platform links (Instagram, streaming)
- Event/party information
- Electronic music brand identity
- Social media integration

**Visualization Targets:**
- Spotify/streaming links
- Event announcement cards
- Music player controls
- Social media music posts
- Background ambience

### Integration Approach

1. **Basic Wave Visualizer Component:**
```typescript
// components/ui/sound-wave.tsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export const SoundWave = ({ 
  isActive = false,
  variant = 'default',
  color = 'currentColor',
  bars = 20
}) => {
  const [heights, setHeights] = useState<number[]>(
    Array(bars).fill(0).map(() => Math.random() * 100)
  )
  
  useEffect(() => {
    if (!isActive) return
    
    const interval = setInterval(() => {
      setHeights(Array(bars).fill(0).map(() => 
        20 + Math.random() * 80
      ))
    }, 150)
    
    return () => clearInterval(interval)
  }, [isActive, bars])
  
  return (
    <div className="flex items-center gap-0.5 h-8">
      {heights.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 bg-current rounded-full"
          animate={{ height: `${height}%` }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            delay: i * 0.02
          }}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}
```

2. **Canvas-based Advanced Visualizer:**
```typescript
// lib/animations/audio-visualizer.ts
export class AudioVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array
  private animationId: number | null = null
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.setupCanvas()
  }
  
  async connectAudio(audioElement: HTMLAudioElement) {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(audioElement)
    this.analyser = audioContext.createAnalyser()
    
    source.connect(this.analyser)
    this.analyser.connect(audioContext.destination)
    
    this.analyser.fftSize = 256
    const bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    
    this.draw()
  }
  
  private draw = () => {
    if (!this.analyser) return
    
    this.animationId = requestAnimationFrame(this.draw)
    this.analyser.getByteFrequencyData(this.dataArray)
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    const barWidth = (this.canvas.width / this.dataArray.length) * 2.5
    let x = 0
    
    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = (this.dataArray[i] / 255) * this.canvas.height
      
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(1, '#764ba2')
      
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight)
      
      x += barWidth + 1
    }
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}
```

3. **Preset Wave Patterns:**
```typescript
// lib/animations/wave-patterns.ts
export const wavePatterns = {
  calm: {
    amplitude: 0.3,
    frequency: 0.02,
    speed: 0.5,
    bars: 30
  },
  energetic: {
    amplitude: 0.8,
    frequency: 0.05,
    speed: 2,
    bars: 40
  },
  bass: {
    amplitude: 1,
    frequency: 0.01,
    speed: 1,
    bars: 15
  },
  treble: {
    amplitude: 0.5,
    frequency: 0.1,
    speed: 3,
    bars: 50
  }
}

export const generateWaveform = (pattern: WavePattern, time: number) => {
  const { amplitude, frequency, speed, bars } = pattern
  return Array(bars).fill(0).map((_, i) => {
    const x = (i / bars) * Math.PI * 2
    const wave = Math.sin(x * frequency + time * speed) * amplitude
    return Math.abs(wave) * 100
  })
}
```

4. **Music Link Wrapper:**
```typescript
// components/ui/music-link.tsx
export const MusicLink = ({ 
  href, 
  children, 
  audioPreview,
  wavePattern = 'energetic' 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  return (
    <Link 
      href={href}
      className="relative inline-flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SoundWave 
        isActive={isHovered || isPlaying}
        variant={wavePattern}
      />
      {children}
      {audioPreview && (
        <button 
          onClick={(e) => {
            e.preventDefault()
            setIsPlaying(!isPlaying)
          }}
          className="ml-2"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}
    </Link>
  )
}
```

### Technical Constraints

- Web Audio API not available in all browsers
- Canvas performance on mobile devices
- Audio context restrictions (user interaction required)
- Memory management for continuous animations
- Cross-origin audio restrictions

### Implementation Details

```typescript
// Visualizer configurations
const visualizerConfig = {
  fps: 60,
  smoothing: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
  fftSize: 2048
}

// Animation styles
const animationStyles = {
  bars: 'vertical bars',
  wave: 'continuous waveform',
  circle: 'circular visualization',
  particles: 'particle system'
}
```

## Tasks / Subtasks

- [ ] Task 1: Create basic wave component
  - [ ] Build SoundWave component
  - [ ] Add animation logic
  - [ ] Create preset patterns
  - [ ] Style for both themes

- [ ] Task 2: Implement canvas visualizer
  - [ ] Setup canvas rendering
  - [ ] Add frequency analysis
  - [ ] Create gradient effects
  - [ ] Optimize performance

- [ ] Task 3: Web Audio API integration
  - [ ] Create audio context manager
  - [ ] Handle permissions
  - [ ] Connect to audio sources
  - [ ] Add fallback for unsupported

- [ ] Task 4: Apply to music links
  - [ ] Wrap streaming service links
  - [ ] Add to event cards
  - [ ] Enhance social media embeds
  - [ ] Create hover interactions

- [ ] Task 5: Create pattern library
  - [ ] Define wave patterns
  - [ ] Genre-specific visualizations
  - [ ] Mood-based animations
  - [ ] Random pattern generation

- [ ] Task 6: Mobile optimization
  - [ ] Touch interaction support
  - [ ] Reduced complexity option
  - [ ] Battery-conscious mode
  - [ ] Performance monitoring

- [ ] Task 7: Advanced features
  - [ ] Beat detection
  - [ ] Color synchronization
  - [ ] Multi-track visualization
  - [ ] Export as animation

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Browser audio API limitations
- **Mitigation**: Fallback to animated patterns
- **Verification**: Cross-browser testing

### Performance Risks

- **Risk**: Continuous animation battery drain
- **Mitigation**: Pause when not visible, reduce complexity
- **Verification**: Battery usage monitoring

### UX Risks

- **Risk**: Distraction from content
- **Mitigation**: Subtle animations, user control
- **Verification**: User feedback sessions

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_VISUALIZER=false`
2. Static waveform images as fallback
3. Component prop: `disableAnimation`
4. Progressive enhancement approach

### Safety Checks

- [ ] Performance targets met
- [ ] Battery usage acceptable
- [ ] Audio permissions handled
- [ ] Fallbacks working
- [ ] Accessibility preserved
- [ ] Memory leaks prevented

## Definition of Done

- [ ] Wave visualizer components created
- [ ] Canvas rendering optimized
- [ ] Audio API integration complete
- [ ] Pattern library established
- [ ] Music links enhanced
- [ ] Mobile experience optimized
- [ ] Performance validated
- [ ] Cross-browser tested
- [ ] Code reviewed and approved
- [ ] Visual QA completed

## Notes

- Core to music brand identity
- Can extend to background ambience
- Consider Spotify API integration
- May add beat-matching later
- Good for social media previews

---

*Story Points: 5*
*Priority: Medium (Music brand enhancement)*
*Sprint: Current*