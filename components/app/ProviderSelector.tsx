"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { getAPIKey } from "@/lib/storage/apiKeys"
import type { ProviderName } from "@/lib/types/animation"

interface ProviderMeta {
  id: ProviderName
  label: string
  icon: React.ReactNode
}

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M12 2C12 2 14 10 16 12C18 14 22 14 22 14C22 14 18 16 16 18C14 20 12 22 12 22" stroke="url(#g_grad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 22C12 22 10 14 8 12C6 10 2 10 2 10C2 10 6 8 8 6C10 4 12 2 12 2" stroke="url(#g_grad2)" strokeWidth="1.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="g_grad" x1="12" y1="2" x2="22" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4"/><stop offset="1" stopColor="#34A853"/>
      </linearGradient>
      <linearGradient id="g_grad2" x1="12" y1="22" x2="2" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EA4335"/><stop offset="1" stopColor="#FBBC05"/>
      </linearGradient>
    </defs>
  </svg>
)

const GroqIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M6 4H18L20 8L12 20L4 8L6 4Z" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 20L8 8H16L12 20Z" fill="#F97316" fillOpacity="0.2" />
    <path d="M12 4V8M8 8L6 4M16 8L18 4" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const OpenRouterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <circle cx="12" cy="6" r="2.5" stroke="#8B5CF6" strokeWidth="1.5"/>
    <circle cx="6" cy="18" r="2.5" stroke="#8B5CF6" strokeWidth="1.5"/>
    <circle cx="18" cy="18" r="2.5" stroke="#8B5CF6" strokeWidth="1.5"/>
    <path d="M12 8.5L8 16M12 8.5L16 16" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const OpenAIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#10A37F" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M8 12L10 10L14 14M10 14L14 10" stroke="#10A37F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="#10A37F" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
)

const AnthropicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#D97706" strokeWidth="1.2"/>
    <path d="M8 16L11 8H13L16 16" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 13H14.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ALL_PROVIDERS: ProviderMeta[] = [
  { id: "gemini", label: "Gemini", icon: <GeminiIcon /> },
  { id: "groq", label: "Groq", icon: <GroqIcon /> },
  { id: "openrouter", label: "OpenRouter", icon: <OpenRouterIcon /> },
  { id: "openai", label: "OpenAI", icon: <OpenAIIcon /> },
  { id: "anthropic", label: "Anthropic", icon: <AnthropicIcon /> },
]

export default function ProviderSelector() {
  const selected = useAppStore((s) => s.selectedProvider)
  const setSelected = useAppStore((s) => s.setSelectedProvider)
  const [available, setAvailable] = useState<ProviderName[]>([])

  useEffect(() => {
    const withKeys = ALL_PROVIDERS.filter((p) => getAPIKey(p.id))
    setAvailable(withKeys.map((p) => p.id))
  }, [])

  if (available.length <= 1) return null

  return (
    <div className="space-y-2">
      <label className="text-sm text-white font-medium">AI Provider</label>
      <div className="flex flex-wrap gap-2">
        {ALL_PROVIDERS.filter((p) => available.includes(p.id)).map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={
              selected === p.id
                ? "flex items-center gap-1.5 bg-[#6366F1] text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors"
                : "flex items-center gap-1.5 border border-[#333333] text-[#888888] text-xs font-medium px-3.5 py-1.5 rounded-full hover:border-[#555555] hover:text-white transition-colors"
            }
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
