const STORAGE_KEY = "motiondrop_preferences"

interface Preferences {
  defaultSize: string
  defaultProvider: string
  autoLoop: boolean
  showGrid: boolean
}

function getDefaults(): Preferences {
  return {
    defaultSize: "portrait",
    defaultProvider: "gemini",
    autoLoop: true,
    showGrid: false,
  }
}

export function getPreferences(): Preferences {
  if (typeof window === "undefined") return getDefaults()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaults()
    const parsed = JSON.parse(raw)
    return { ...getDefaults(), ...parsed }
  } catch {
    return getDefaults()
  }
}

export function setPreferences(prefs: Partial<Preferences>): void {
  if (typeof window === "undefined") return
  const current = getPreferences()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...prefs }))
}

export const PREFERENCES_STORAGE_KEY = STORAGE_KEY
