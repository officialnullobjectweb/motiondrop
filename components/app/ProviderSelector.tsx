"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { getAPIKey } from "@/lib/storage/apiKeys"
import { PROVIDERS } from "@/constants/providers"
import type { ProviderName } from "@/lib/types/animation"

export default function ProviderSelector() {
  const selected = useAppStore((s) => s.selectedProvider)
  const setSelected = useAppStore((s) => s.setSelectedProvider)
  const [available, setAvailable] = useState<ProviderName[]>([])

  useEffect(() => {
    const withKeys = PROVIDERS.filter((p) => getAPIKey(p.id))
    setAvailable(withKeys.map((p) => p.id))
  }, [])

  // Also re-check on window focus (user might have added a key in another tab)
  useEffect(() => {
    const onFocus = () => {
      const withKeys = PROVIDERS.filter((p) => getAPIKey(p.id))
      setAvailable(withKeys.map((p) => p.id))
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  if (available.length <= 1) return null

  return (
    <div className="space-y-2">
      <label className="text-sm text-white font-medium">Active Provider</label>
      <div className="flex flex-wrap gap-2">
        {PROVIDERS.filter((p) => available.includes(p.id)).map((p) => {
          const active = selected === p.id
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={
                active
                  ? "flex items-center gap-1.5 bg-[#6366F1] text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                  : "flex items-center gap-1.5 border border-[#333333] text-[#888888] text-xs font-medium px-3 py-1.5 rounded-full hover:border-[#555555] hover:text-white transition-all"
              }
            >
              <p.Icon className="w-3.5 h-3.5" />
              {p.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
