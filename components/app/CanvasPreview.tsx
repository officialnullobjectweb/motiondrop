"use client"

import { type RefObject } from "react"
import { Loader2, Play, AlertCircle } from "lucide-react"
import type { AnimationConfig, AspectRatio } from "@/lib/types/animation"

interface CanvasPreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  config: AnimationConfig | null
  isGenerating: boolean
  isPlaying: boolean
  currentTime: number
  duration: number
  selectedSize: AspectRatio
  generationError: string | null
}

const SIZE_CLASSES: Record<AspectRatio, string> = {
  portrait: "max-w-[400px] aspect-[9/16]",
  square: "max-w-[400px] aspect-square",
  desktop: "max-w-[600px] aspect-[16/9]",
}

export default function CanvasPreview({
  canvasRef,
  config,
  isGenerating,
  isPlaying,
  currentTime,
  duration,
  selectedSize,
  generationError,
}: CanvasPreviewProps) {
  const hasConfig = config !== null
  const showPlaceholder = !hasConfig && !isGenerating && !generationError

  const sizeClass = SIZE_CLASSES[selectedSize]

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div
        className={`relative w-full ${sizeClass} rounded-xl overflow-hidden bg-[#111111]/50 border border-[#222222] flex items-center justify-center`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {showPlaceholder && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full border-2 border-[#333333] flex items-center justify-center">
              <Play className="ml-1 w-5 h-5 text-white/30 fill-white/30" />
            </div>
            <p className="text-white text-sm font-medium">Your animation will appear here</p>
            <p className="text-[#666666] text-xs">Generate an animation to see the preview</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0A0A]/90 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#6366F1]/20 via-[#8B5CF6]/20 to-[#A78BFA]/20 animate-pulse" />
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#888888]" />
              <p className="text-[#888888] text-sm">Generating animation...</p>
            </div>
          </div>
        )}

        {generationError && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0A0A]/90 backdrop-blur-sm">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-red-400 text-sm text-center px-4">{generationError}</p>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-[#888888] border border-white/10 uppercase tracking-wider">
            {selectedSize}
          </span>
        </div>

        {hasConfig && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 text-[#888888] border border-white/10">
              {duration.toFixed(1)}s
            </span>
          </div>
        )}

        {!isGenerating && hasConfig && !isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-10 h-10 text-white/60 fill-white/60" />
          </div>
        )}
      </div>
    </div>
  )
}
