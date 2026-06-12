"use client"

import { useState, useCallback } from "react"
import { History, AlertTriangle } from "lucide-react"
import HistoryGrid from "@/components/history/HistoryGrid"
import { useHistory } from "@/hooks/useHistory"
import { toastSuccess } from "@/lib/toast"

export default function HistoryPage() {
  const { history, removeItem, clearAll } = useHistory()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearAll = useCallback(() => {
    clearAll()
    setShowConfirm(false)
    toastSuccess("History cleared")
  }, [clearAll])

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
            <History className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">History</h1>
            <p className="text-sm text-[#666666]">Your previously generated animations</p>
          </div>
        </div>

        <HistoryGrid
          items={history}
          onDelete={removeItem}
          onClearAll={() => setShowConfirm(true)}
        />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-xl border border-[#222222] bg-[#111111] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Clear all history?</h3>
                <p className="text-[#666666] text-xs mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
