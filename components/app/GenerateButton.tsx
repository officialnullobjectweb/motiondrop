"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Loader2, Check, X } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { getAPIKey } from "@/lib/storage/apiKeys"
import { getProvider } from "@/constants/providers"

const GENERATION_MESSAGES = [
  "Reading your prompt...",
  "Understanding your brand...",
  "Building motion design...",
  "Generating your animation...",
  "Almost ready...",
]

const MESSAGE_INTERVAL = 3000

export default function GenerateButton() {
  const selectedProvider = useAppStore((s) => s.selectedProvider)
  const isGenerating = useAppStore((s) => s.isGenerating)
  const prompt = useAppStore((s) => s.currentPrompt)
  const storeKey = useAppStore((s) => s.apiKeys[s.selectedProvider])
  // Check both Zustand store and localStorage (backward compat with existing saved keys)
  const hasKey = !!storeKey || !!getAPIKey(selectedProvider)

  const providerMeta = getProvider(selectedProvider)

  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle")
  const [msgIndex, setMsgIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isGenerating) {
      setStatus("generating")
      setMsgIndex(0)
      intervalRef.current = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % GENERATION_MESSAGES.length)
      }, MESSAGE_INTERVAL)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isGenerating])

  useEffect(() => {
    if (status === "generating" && !isGenerating) {
      setStatus("success")
      const t = setTimeout(() => setStatus("idle"), 1500)
      return () => clearTimeout(t)
    }
  }, [isGenerating, status])

  const disabled = !hasKey || !prompt.trim() || isGenerating

  const buttonContent = (() => {
    if (status === "generating") {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {GENERATION_MESSAGES[msgIndex]}
        </>
      )
    }
    if (status === "success") {
      return (
        <>
          <Check className="w-4 h-4" />
          Animation Ready!
        </>
      )
    }
    if (status === "error") {
      return (
        <>
          <X className="w-4 h-4" />
          Generation Failed &mdash; Try Again
        </>
      )
    }
    if (!hasKey) {
      return "Add API Key First"
    }
    return (
      <>
        <Sparkles className="w-4 h-4" />
        Generate Animation
      </>
    )
  })()

  return (
    <div className="relative group">
      <button
        disabled={disabled}
        className={
          status === "generating"
            ? "w-full bg-[#333333] text-[#888888] text-sm font-medium rounded-full py-3 flex items-center justify-center gap-2 cursor-not-allowed"
            : status === "success"
              ? "w-full bg-green-600 text-white text-sm font-medium rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
              : status === "error"
                ? "w-full bg-red-600 text-white text-sm font-medium rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
                : disabled
                  ? "w-full bg-[#1A1A1A] text-[#555555] text-sm font-medium rounded-full py-3 flex items-center justify-center gap-2 cursor-not-allowed"
                  : "w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium rounded-full py-3 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
        }
      >
        {buttonContent}
      </button>

      {/* Provider status tooltip */}
      {hasKey && providerMeta && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 mb-2">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2 shadow-xl shadow-black/30 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <providerMeta.Icon className="w-3.5 h-3.5" />
              <span className="text-xs text-white font-medium">{providerMeta.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-[#888888]">Key connected</span>
            </div>
            {prompt.trim() && (
              <p className="text-[10px] text-[#555555] mt-1 max-w-[200px] truncate">
                &ldquo;{prompt.trim()}&rdquo;
              </p>
            )}
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#333333] rotate-45 mx-auto -mt-1" />
        </div>
      )}

      {/* No key tooltip */}
      {!hasKey && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 mb-2">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2 shadow-xl shadow-black/30 whitespace-nowrap">
            <p className="text-[10px] text-yellow-500">
              Connect an API key above to start generating
            </p>
          </div>
          <div className="w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#333333] rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  )
}
