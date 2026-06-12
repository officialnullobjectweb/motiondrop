"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, EyeOff, X, ExternalLink, AlertTriangle, CheckCircle, Loader2, Zap } from "lucide-react"
import { useAPIKey } from "@/hooks/useAPIKey"
import { useAppStore } from "@/store/useAppStore"
import { PROVIDERS, getProvider } from "@/constants/providers"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"
import { testProviderConnection, getTestErrorMessage } from "@/lib/ai/testConnection"
import type { ProviderName } from "@/lib/types/animation"

export default function APIKeyInput() {
  const [modalOpen, setModalOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [localProvider, setLocalProvider] = useState<ProviderName>("gemini")
  const [localKey, setLocalKey] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "testing" | "pass" | "fail">("idle")

  const selectedProvider = useAppStore((s) => s.selectedProvider)
  const setSelectedProvider = useAppStore((s) => s.setSelectedProvider)
  const setApiKeys = useAppStore((s) => s.setApiKeys)
  const storeApiKeys = useAppStore((s) => s.apiKeys)
  const { apiKey, setKey, clearKey, hasKey } = useAPIKey(selectedProvider)

  const currentProvider = getProvider(selectedProvider)
  const localProviderMeta = getProvider(localProvider)

  useEffect(() => {
    if (modalOpen && hasKey) {
      setLocalProvider(selectedProvider)
      setLocalKey("")
      setTestResult("idle")
    }
  }, [modalOpen, hasKey, selectedProvider])

  const testConnection = useCallback(async () => {
    if (!localKey.trim()) {
      toastError("Enter an API key first")
      return
    }
    setTesting(true)
    setTestResult("testing")

    try {
      const result = await testProviderConnection(localProvider, localKey)

      if (result.ok) {
        setTestResult("pass")
        toastSuccess(`✓ ${localProviderMeta?.name} connection successful`)
      } else {
        setTestResult("fail")
        const msg = getTestErrorMessage(result)
        toastError(`Connection failed: ${msg}`)
      }
    } catch (err) {
      setTestResult("fail")
      toastError(`Connection error: ${err instanceof Error ? err.message : "Network error"}`)
    } finally {
      setTesting(false)
    }
  }, [localKey, localProvider, localProviderMeta])

  const handleSave = useCallback(() => {
    if (!localKey.trim()) {
      toastError("Paste your API key before saving")
      return
    }
    setSelectedProvider(localProvider)
    setKey(localKey.trim())
    // Sync with Zustand store so GenerateButton picks it up immediately
    setApiKeys({ ...storeApiKeys, [localProvider]: localKey.trim() })
    setModalOpen(false)
    setShowKey(false)
    setLocalKey("")
    setTestResult("idle")
    toastSuccess(`${localProviderMeta?.name} API key saved`)
  }, [localKey, localProvider, localProviderMeta, setKey, setSelectedProvider, setApiKeys, storeApiKeys])

  const handleClear = useCallback(() => {
    clearKey()
    // Remove from Zustand store
    const updated = { ...storeApiKeys }
    delete updated[localProvider]
    setApiKeys(updated)
    setModalOpen(false)
    setShowKey(false)
    setLocalKey("")
    setTestResult("idle")
    toastInfo("API key removed")
  }, [clearKey, localProvider, setApiKeys, storeApiKeys])

  function maskKey(key: string): string {
    if (key.length <= 8) return "••••••••"
    return key.slice(0, 4) + "••••••••" + key.slice(-4)
  }

  const LocalIcon = localProviderMeta?.Icon

  return (
    <div className="space-y-3">
      <label className="text-sm text-white font-medium">API Key</label>

      {!hasKey ? (
        <div className="bg-[#111111] border border-yellow-500/30 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
            <p className="text-sm text-[#888888]">Connect an AI provider to start generating animations</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="self-start bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
          >
            Connect API Key
          </button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              {currentProvider && <currentProvider.Icon className="w-4 h-4" />}
            </div>
            <div className="text-sm">
              <span className="text-white font-medium">{currentProvider?.name}: </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#6366F1]" />
                <h2 className="text-white text-base font-semibold">Connect AI Provider</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888888] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-sm text-[#888888] font-medium">Choose Provider</label>
                <div className="grid grid-cols-5 gap-2">
                  {PROVIDERS.map((p) => {
                    const active = localProvider === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setLocalProvider(p.id)
                          setTestResult("idle")
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-lg p-3 transition-all ${
                          active
                            ? "bg-[#6366F1]/10 border-2 border-[#6366F1]"
                            : "bg-[#0A0A0A] border border-[#222222] hover:border-[#444444]"
                        }`}
                      >
                        <p.Icon className={`w-6 h-6 ${active ? "" : "opacity-60"}`} />
                        <span className={`text-[10px] font-medium ${active ? "text-[#6366F1]" : "text-[#666666]"}`}>
                          {p.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-sm text-[#888888] font-medium">
                  {localProviderMeta?.name} API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    placeholder={`Paste your ${localProviderMeta?.name} API key here...`}
                    value={localKey}
                    onChange={(e) => {
                      setLocalKey(e.target.value)
                      setTestResult("idle")
                    }}
                    className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-[#6366F1] placeholder:text-[#555555] transition-colors"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Test Connection Button */}
              {localKey.trim().length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={testConnection}
                    disabled={testing}
                    className={`w-full flex items-center justify-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all ${
                      testResult === "pass"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : testResult === "fail"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white border border-[#333333]"
                    }`}
                  >
                    {testing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Testing connection...
                      </>
                    ) : testResult === "pass" ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Connection successful
                      </>
                    ) : testResult === "fail" ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Connection failed — check your key
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Test Connection
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Get API Key Link */}
              <a
                href={localProviderMeta?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#6366F1] hover:text-[#818CF8] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Get a free {localProviderMeta?.name} API key
              </a>
            </div>

            {/* Footer */}
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
                  className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#333333] disabled:text-[#666666] text-white text-sm font-medium px-5 py-2 rounded-lg transition-all hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
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
