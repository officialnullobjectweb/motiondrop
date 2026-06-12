"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Loader2, Check, X } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { getAPIKey } from "@/lib/storage/apiKeys"

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

  return (
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
      {status === "generating" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {GENERATION_MESSAGES[msgIndex]}
        </>
      ) : status === "success" ? (
        <>
          <Check className="w-4 h-4" />
          Animation Ready!
        </>
      ) : status === "error" ? (
        <>
          <X className="w-4 h-4" />
          Generation Failed &mdash; Try Again
        </>
      ) : !hasKey ? (
        "Add API Key First"
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate Animation
        </>
      )}
    </button>
  )
}
