"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, X, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import { useAPIKey } from "@/hooks/useAPIKey"
import { useAppStore } from "@/store/useAppStore"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"

const PROVIDERS = [
  { id: "gemini", name: "Gemini", url: "https://aistudio.google.com/apikey", icon: "✦" },
  { id: "groq", name: "Groq", url: "https://console.groq.com/keys", icon: "⚡" },
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/keys", icon: "◎" },
  { id: "openai", name: "OpenAI", url: "https://platform.openai.com/api-keys", icon: "◆" },
  { id: "anthropic", name: "Anthropic", url: "https://console.anthropic.com/settings/keys", icon: "▲" },
] as const

export default function APIKeyInput() {
  const [modalOpen, setModalOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [localProvider, setLocalProvider] = useState("gemini")
  const [localKey, setLocalKey] = useState("")

  const selectedProvider = useAppStore((s) => s.selectedProvider)
  const setSelectedProvider = useAppStore((s) => s.setSelectedProvider)
  const { apiKey, setKey, clearKey, hasKey } = useAPIKey(selectedProvider)

  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider)
  const localProviderMeta = PROVIDERS.find((p) => p.id === localProvider)

  useEffect(() => {
    if (modalOpen && hasKey) {
      setLocalProvider(selectedProvider)
      setLocalKey("")
    }
  }, [modalOpen, hasKey, selectedProvider])

  function handleSave() {
    if (!localKey.trim()) {
      toastError("Paste your API key before saving")
      return
    }
    setSelectedProvider(localProvider as typeof selectedProvider)
    setKey(localKey.trim())
    setModalOpen(false)
    setShowKey(false)
    setLocalKey("")
    toastSuccess(`${localProviderMeta?.name} API key saved`)
  }

  function handleClear() {
    clearKey()
    setModalOpen(false)
    setShowKey(false)
    setLocalKey("")
    toastInfo("API key removed")
  }

  function maskKey(key: string): string {
    if (key.length <= 8) return "••••••••"
    return key.slice(0, 4) + "••••••••" + key.slice(-4)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-white font-medium">API Key</label>

      {!hasKey ? (
        <div className="bg-[#111111] border border-yellow-500/30 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
            <p className="text-sm text-[#888888]">Add an API key to start generating</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="self-start bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
          >
            Add API Key
          </button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <div className="text-sm">
              <span className="text-white">{currentProvider?.name}: </span>
              <span className="text-[#666666]">{maskKey(apiKey!)}</span>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-[#888888] hover:text-white transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <h2 className="text-white text-base font-semibold">Configure AI Provider</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888888] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-[#888888]">Provider</label>
                <select
                  value={localProvider}
                  onChange={(e) => setLocalProvider(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366F1] appearance-none"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#888888]">API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    placeholder="Paste your API key here..."
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-[#6366F1] placeholder:text-[#555555]"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <a
                href={localProviderMeta?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#6366F1] hover:text-[#818CF8] transition-colors"
              >
                Get a free {localProviderMeta?.name} API key
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="px-6 py-4 border-t border-[#222222] flex items-center justify-between">
              {hasKey && (
                <button
                  onClick={handleClear}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove Key
                </button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-sm text-[#888888] hover:text-white transition-colors px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!localKey.trim()}
                  className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#333333] disabled:text-[#666666] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
