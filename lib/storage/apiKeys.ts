const STORAGE_KEY = "motiondrop_apikeys"

function getAllKeys(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}
    return parsed
  } catch {
    return {}
  }
}

function saveAllKeys(keys: Record<string, string>): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function getAPIKey(provider: string): string | null {
  const keys = getAllKeys()
  return keys[provider] ?? null
}

export function setAPIKey(provider: string, key: string): void {
  const keys = getAllKeys()
  keys[provider] = key
  saveAllKeys(keys)
}

export function clearAPIKey(provider: string): void {
  const keys = getAllKeys()
  delete keys[provider]
  saveAllKeys(keys)
}

export function clearAllAPIKeys(): void {
  saveAllKeys({})
}
