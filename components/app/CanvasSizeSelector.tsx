"use client"

import { useAppStore } from "@/store/useAppStore"
import type { AspectRatio } from "@/lib/types/animation"

const OPTIONS: { id: AspectRatio; label: string; size: string; aspect: string }[] = [
  { id: "portrait", label: "Portrait", size: "1080×1920", aspect: "aspect-[9/16]" },
  { id: "square", label: "Square", size: "1080×1080", aspect: "aspect-square" },
  { id: "desktop", label: "Desktop", size: "1920×1080", aspect: "aspect-[16/9]" },
]

export default function CanvasSizeSelector() {
  const selected = useAppStore((s) => s.selectedSize)
  const setSelected = useAppStore((s) => s.setSelectedSize)

  return (
    <div className="space-y-2">
      <label className="text-sm text-white font-medium">Canvas Size</label>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={
                active
                  ? "bg-[#6366F1]/10 border border-[#6366F1] rounded-lg p-3 flex flex-col items-center gap-2 transition-colors"
                  : "bg-[#111111] border border-[#222222] rounded-lg p-3 flex flex-col items-center gap-2 hover:border-[#444444] transition-colors"
              }
            >
              <div
                className={
                  active
                    ? "w-8 border-2 border-[#6366F1] rounded-sm " + opt.aspect
                    : "w-8 border-2 border-[#555555] rounded-sm " + opt.aspect
                }
              />
              <div className="flex flex-col items-center">
                <span className={active ? "text-white text-xs font-medium" : "text-[#888888] text-xs"}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-[#555555]">{opt.size}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
