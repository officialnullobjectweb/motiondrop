import type { AnimationConfig, KeyframeData } from "@/lib/types/animation"
import { drawBackground } from "@/lib/animation/effects/background"
import { drawParticles } from "@/lib/animation/effects/particles"
import { drawLogo } from "@/lib/animation/effects/logo"
import { drawText } from "@/lib/animation/effects/text"

export class AnimationRenderer {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private config: AnimationConfig | null = null
  private keyframes: KeyframeData | null = null

  private _isPlaying = false
  private _currentTime = 0
  private startTimestamp: number | null = null
  private pausedTimestamp: number | null = null
  private animationFrameId: number | null = null
  private _logoImage: HTMLImageElement | null = null

  private _playbackSpeed = 1
  private _isLooping = false
  onComplete: (() => void) | null = null

  get isPlaying(): boolean { return this._isPlaying }
  get currentTime(): number { return this._currentTime }
  get duration(): number { return this.config?.timing.totalDuration ?? 0 }
  get playbackSpeed(): number { return this._playbackSpeed }
  get isLooping(): boolean { return this._isLooping }
  get logoImage(): HTMLImageElement | null { return this._logoImage }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
  }

  load(config: AnimationConfig, keyframes: KeyframeData): void {
    this.config = config
    this.keyframes = keyframes
    this._currentTime = 0
    this.startTimestamp = null
    this.pausedTimestamp = null

    if (this.canvas) {
      this.canvas.width = config.canvas.width
      this.canvas.height = config.canvas.height
    }
  }

  loadImage(src: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => { this._logoImage = img; resolve() }
      img.onerror = () => { this._logoImage = null; resolve() }
      img.src = src
    })
  }

  play(): void {
    if (!this.config || !this.keyframes || !this.ctx || !this.canvas) return
    if (this._isPlaying) return

    this._isPlaying = true

    if (this.pausedTimestamp !== null) {
      const pausedDuration = performance.now() - this.pausedTimestamp
      if (this.startTimestamp !== null) {
        this.startTimestamp += pausedDuration
      }
      this.pausedTimestamp = null
    } else if (this._currentTime >= this.duration) {
      this._currentTime = 0
      this.startTimestamp = performance.now()
    } else {
      this.startTimestamp = performance.now() - this._currentTime * 1000 / this._playbackSpeed
    }

    this.renderLoop(performance.now())
  }

  pause(): void {
    if (!this._isPlaying) return
    this._isPlaying = false
    this.pausedTimestamp = performance.now()
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  restart(): void {
    this._currentTime = 0
    this.startTimestamp = null
    this.pausedTimestamp = null

    if (this._isPlaying) {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      this._isPlaying = true
      this.startTimestamp = performance.now()
      this.renderLoop(performance.now())
    } else {
      this.drawFrame(0)
    }
  }

  seekTo(time: number): void {
    const clamped = Math.max(0, Math.min(time, this.duration))
    this._currentTime = clamped
    this.startTimestamp = performance.now() - clamped * 1000 / this._playbackSpeed

    if (!this._isPlaying) {
      this.drawFrame(clamped)
    }
  }

  setSpeed(speed: number): void {
    const oldSpeed = this._playbackSpeed
    this._playbackSpeed = Math.max(0.1, Math.min(speed, 10))

    if (this._isPlaying && this.startTimestamp !== null) {
      this.startTimestamp = performance.now() - (this._currentTime * 1000 / this._playbackSpeed)
    }
  }

  setLooping(loop: boolean): void {
    this._isLooping = loop
  }

  setLogoImage(img: HTMLImageElement | null): void {
    this._logoImage = img
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this._isPlaying = false
    this.config = null
    this.keyframes = null
    this._logoImage = null
    this.canvas = null
    this.ctx = null
    this.onComplete = null
  }

  private renderLoop(timestamp: number): void {
    if (!this._isPlaying || !this.config || !this.keyframes || !this.ctx || !this.canvas) return

    if (this.startTimestamp === null) {
      this.startTimestamp = timestamp
    }

    const elapsed = (timestamp - this.startTimestamp) * this._playbackSpeed
    const totalDurationMs = this.duration * 1000
    let time = elapsed / 1000

    if (time >= this.duration) {
      if (this._isLooping) {
        time = time % this.duration
        this.startTimestamp = timestamp - time * 1000 / this._playbackSpeed
      } else {
        time = this.duration
        this._currentTime = time
        this.drawFrame(time)
        this._isPlaying = false
        this.animationFrameId = null
        this.onComplete?.()
        return
      }
    }

    this._currentTime = time
    this.drawFrame(time)

    this.animationFrameId = requestAnimationFrame((t) => this.renderLoop(t))
  }

  private drawFrame(time: number): void {
    const { ctx, config, keyframes, canvas } = this
    if (!ctx || !config || !keyframes || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBackground(ctx, config, keyframes.layers.background, time, canvas.width, canvas.height)
    drawParticles(ctx, config, keyframes.layers.particles, time)
    drawLogo(ctx, config, keyframes.layers.logo, time, this._logoImage)
    drawText(ctx, config, keyframes.layers.textPrimary, time, true)
    drawText(ctx, config, keyframes.layers.textSecondary, time, false)
  }
}
