import { useState, useEffect, useCallback } from "react"
import type { HistoryItem } from "@/lib/types/config"
import {
  getHistory,
  addToHistory as addToStorage,
  removeFromHistory as removeFromStorage,
  clearHistory as clearStorage,
} from "@/lib/storage/history"

interface UseHistoryReturn {
  history: HistoryItem[]
  addItem: (item: HistoryItem) => void
  removeItem: (id: string) => void
  clearAll: () => void
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const addItem = useCallback((item: HistoryItem) => {
    addToStorage(item)
    setHistory(getHistory())
  }, [])

  const removeItem = useCallback((id: string) => {
    removeFromStorage(id)
    setHistory(getHistory())
  }, [])

  const clearAll = useCallback(() => {
    clearStorage()
    setHistory([])
  }, [])

  return {
    history,
    addItem,
    removeItem,
    clearAll,
  }
}
