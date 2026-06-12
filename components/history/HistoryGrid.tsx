"use client"

import { Clock, Film } from "lucide-react"
import type { HistoryItem } from "@/lib/types/config"
import HistoryCard from "./HistoryCard"

interface HistoryGridProps {
  items: HistoryItem[]
  onDelete: (id: string) => void
  onClearAll: () => void
}

export default function HistoryGrid({ items, onDelete, onClearAll }: HistoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#333333] flex items-center justify-center mb-6">
          <Film className="w-8 h-8 text-[#444444]" />
        </div>
        <h3 className="text-white text-lg font-medium mb-2">No animations yet</h3>
        <p className="text-[#666666] text-sm text-center max-w-sm">
          Generate your first animation and it will automatically appear here for quick access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <Clock className="w-4 h-4" />
          <span>{items.length} animation{items.length !== 1 ? "s" : ""}</span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500/70 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <HistoryCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}
