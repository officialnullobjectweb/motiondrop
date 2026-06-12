"use client"

import { useEffect, useState, useCallback } from "react"
import { useAppStore } from "@/store/useAppStore"
import { getAPIKey } from "@/lib/storage/apiKeys"
import { PROVIDERS } from "@/constants/providers"
import type { ProviderName } from "@/lib/types/animation"

export default function ProviderSelector() {
  const selected = useAppStore((s) => s.selectedProvider)
  const setSelected = useAppStore((s) => s.setSelectedProvider)
  const storeKeys = useAppStore((s) => s.apiKeys)
  const [available, setAvailable] = useState<ProviderName[]>([])

  const updateAvailable = useCallback(() => {
    const withKeys = PROVIDERS.filter((p) => getAPIKey(p.id) || storeKeys[p.id])
    setAvailable(withKeys.map((p) => p.id))
  }, [storeKeys])

  useEffect(() => {
    updateAvailable()
  }, [updateAvailable])

  // Re-check on window focus too
  useEffect(() => {
    const onFocus = () => updateAvailable()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [updateAvailable])

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
