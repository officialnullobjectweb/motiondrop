import { useState, useEffect, useCallback } from "react"
import { getAPIKey, setAPIKey, clearAPIKey } from "@/lib/storage/apiKeys"

interface UseAPIKeyReturn {
  apiKey: string | null
  setKey: (key: string) => void
  clearKey: () => void
  hasKey: boolean
}

export function useAPIKey(provider: string): UseAPIKeyReturn {
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    setApiKey(getAPIKey(provider))
  }, [provider])

  const setKey = useCallback(
    (key: string) => {
      setAPIKey(provider, key)
      setApiKey(key)
    },
    [provider],
  )

  const clearKey = useCallback(() => {
    clearAPIKey(provider)
    setApiKey(null)
  }, [provider])

  return {
    apiKey,
    setKey,
    clearKey,
    hasKey: apiKey !== null && apiKey.length > 0,
  }
}
