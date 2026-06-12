"use client"

import { useState, useRef, useCallback } from "react"
import { useAppStore } from "@/store/useAppStore"

const EXAMPLES = [
  "Food delivery app, red orange, fast and energetic",
  "Meditation app called Calm, blue purple, peaceful",
  "Fintech app PayFlow, dark blue, professional",
  "Gaming app, neon green black, explosive",
]

const MAX_CHARS = 500

export default function PromptInput() {
  const prompt = useAppStore((s) => s.currentPrompt)
  const setPrompt = useAppStore((s) => s.setCurrentPrompt)
  const [showExamples, setShowExamples] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [])

  function handleChange(value: string) {
    if (value.length > MAX_CHARS) return
    setPrompt(value)
    autoResize()
  }

  function handleExample(text: string) {
    setPrompt(text)
    setShowExamples(false)
  }

  const remaining = MAX_CHARS - prompt.length
  const counterColor =
    remaining <= 0 ? "text-red-500" : remaining <= 100 ? "text-orange-400" : "text-[#555555]"

  return (
    <div className="space-y-2">
      <label className="text-sm text-white font-medium">Describe your animation</label>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g. Fitness app called FitPro, blue and white, energetic and motivating..."
          rows={4}
          className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366F1] placeholder:text-[#555555] resize-none min-h-[100px] max-h-[200px]"
        />
        <span className={`absolute bottom-2 right-3 text-xs ${counterColor}`}>
          {prompt.length} / {MAX_CHARS}
        </span>
      </div>

      <button
        onClick={() => setShowExamples(!showExamples)}
        className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors"
      >
        {showExamples ? "Hide examples" : "Need inspiration? See examples"}
      </button>

      {showExamples && (
        <div className="space-y-1.5 pt-1">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExample(ex)}
              className="block w-full text-left text-xs text-[#888888] hover:text-white hover:bg-[#111111] rounded-lg px-3 py-2 transition-colors"
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
