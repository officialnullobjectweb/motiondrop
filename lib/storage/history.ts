import type { HistoryItem } from "@/lib/types/config"

const STORAGE_KEY = "motiondrop_history"
const MAX_ITEMS = 5

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as HistoryItem[]
  } catch {
    return []
  }
}

function saveHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addToHistory(item: HistoryItem): void {
  const items = getHistory()
  items.unshift(item)
  if (items.length > MAX_ITEMS) {
    items.pop()
  }
  saveHistory(items)
}

export function removeFromHistory(id: string): void {
  const items = getHistory()
  const filtered = items.filter((item) => item.id !== id)
  saveHistory(filtered)
}

export function clearHistory(): void {
  saveHistory([])
}
