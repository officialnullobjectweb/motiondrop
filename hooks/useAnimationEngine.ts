"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { AnimationRenderer } from "@/lib/animation/renderer"
import type { AnimationConfig, KeyframeData } from "@/lib/types/animation"

interface AnimationControls {
  isPlaying: boolean
  currentTime: number
  duration: number
  play: () => void
  pause: () => void
  restart: () => void
  seekTo: (time: number) => void
  setSpeed: (speed: number) => void
  setLooping: (loop: boolean) => void
}

export function useAnimationEngine(): {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  controls: AnimationControls
  loadAnimation: (config: AnimationConfig, keyframes: KeyframeData) => void
  loadLogoImage: (src: string) => Promise<void>
} {
  const rendererRef = useRef<AnimationRenderer | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const renderer = new AnimationRenderer()
    rendererRef.current = renderer

    if (canvasRef.current) {
      renderer.init(canvasRef.current)
    }

    renderer.onComplete = () => {
      setIsPlaying(false)
    }

    let intervalId: ReturnType<typeof setInterval> | undefined

    const tick = () => {
      if (rendererRef.current) {
        const ct = rendererRef.current.currentTime
        setCurrentTime(ct)
        setIsPlaying(rendererRef.current.isPlaying)
      }
    }

    intervalId = setInterval(tick, 50)

    return () => {
      renderer.destroy()
      rendererRef.current = null
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current && rendererRef.current) {
      rendererRef.current.init(canvasRef.current)
    }
  }, [canvasRef.current])

  const loadAnimation = useCallback((config: AnimationConfig, keyframes: KeyframeData) => {
    const r = rendererRef.current
    if (!r) return
    r.load(config, keyframes)
    setDuration(config.timing.totalDuration)
    setCurrentTime(0)
    setIsPlaying(false)
  }, [])

  const loadLogoImage = useCallback(async (src: string) => {
    await rendererRef.current?.loadImage(src)
  }, [])

  const controls: AnimationControls = {
    isPlaying,
    currentTime,
    duration,
    play: useCallback(() => { rendererRef.current?.play(); setIsPlaying(true) }, []),
    pause: useCallback(() => { rendererRef.current?.pause(); setIsPlaying(false) }, []),
    restart: useCallback(() => {
      rendererRef.current?.restart()
      setCurrentTime(0)
    }, []),
    seekTo: useCallback((time: number) => {
      rendererRef.current?.seekTo(time)
      setCurrentTime(time)
    }, []),
    setSpeed: useCallback((speed: number) => {
      rendererRef.current?.setSpeed(speed)
    }, []),
    setLooping: useCallback((loop: boolean) => {
      rendererRef.current?.setLooping(loop)
    }, []),
  }

  return { canvasRef, controls, loadAnimation, loadLogoImage }
}
