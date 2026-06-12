"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { SkipBack, Play, Pause, Repeat, ChevronDown } from "lucide-react"

interface PlaybackHandlers {
  play: () => void
  pause: () => void
  restart: () => void
  seekTo: (time: number) => void
  setSpeed: (speed: number) => void
  setLooping: (loop: boolean) => void
}

interface PlaybackControlsProps {
  handlers: PlaybackHandlers
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackSpeed: number
  isLooping: boolean
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2]

export default function PlaybackControls({
  handlers,
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  isLooping,
}: PlaybackControlsProps) {
  const [speedOpen, setSpeedOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    if (!speedOpen) return
    const close = (e: MouseEvent) => {
      if (speedRef.current && !speedRef.current.contains(e.target as Node)) {
        setSpeedOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [speedOpen])

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = x / rect.width
      handlers.seekTo(pct * duration)
    },
    [duration, handlers],
  )

  const handleProgressDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragging) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const pct = x / rect.width
      handlers.seekTo(pct * duration)
    },
    [dragging, duration, handlers],
  )

  const handleDragStart = () => setDragging(true)
  const handleDragEnd = () => setDragging(false)

  useEffect(() => {
    if (!dragging) return
    const up = () => setDragging(false)
    window.addEventListener("mouseup", up)
    return () => window.removeEventListener("mouseup", up)
  }, [dragging])

  const formatTime = (t: number) => `${t.toFixed(1)}s`

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={progressRef}
        className="relative h-2 bg-[#222222] rounded-full cursor-pointer group"
        onMouseDown={(e) => { handleDragStart(); handleProgressClick(e) }}
        onMouseMove={handleProgressDrag}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[#6366F1] rounded-full transition-[width] duration-75"
          style={{ width: `${progressPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPct}% - 8px)` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlers.restart}
            className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#888888] hover:text-white transition-colors"
            title="Restart"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => (isPlaying ? handlers.pause() : handlers.play())}
            className="p-2 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={() => handlers.setLooping(!isLooping)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLooping ? "text-[#6366F1] bg-[#6366F1]/10" : "text-[#888888] hover:text-white hover:bg-[#1A1A1A]"
            }`}
            title="Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#666666]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div ref={speedRef} className="relative">
            <button
              onClick={() => setSpeedOpen(!speedOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              {playbackSpeed}x
              <ChevronDown className="w-3 h-3" />
            </button>
            {speedOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-xl">
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => { handlers.setSpeed(speed); setSpeedOpen(false) }}
                    className={`block w-full px-4 py-1.5 text-xs text-left hover:bg-[#222222] transition-colors ${
                      speed === playbackSpeed ? "text-[#6366F1]" : "text-[#888888]"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
