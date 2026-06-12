"use client"

import { FileJson, FileImage, FileVideo, FileCode, Loader2, AlertCircle } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"

interface ExportPanelProps {
  onExportLottie: () => void
  onExportGIF: () => void
  onExportMP4: () => void
  onExportCSS: () => void
  isExporting: boolean
  exportProgress: number
  currentFormat: string
}

const FORMATS = [
  { key: "lottie", label: "Lottie", icon: FileJson, desc: "JSON animation data", color: "border-[#6366F1]/30 hover:border-[#6366F1] text-[#6366F1]" },
  { key: "gif", label: "GIF", icon: FileImage, desc: "Animated image", color: "border-emerald-500/30 hover:border-emerald-500 text-emerald-500" },
  { key: "mp4", label: "MP4", icon: FileVideo, desc: "Video file", color: "border-rose-500/30 hover:border-rose-500 text-rose-500" },
  { key: "css", label: "CSS", icon: FileCode, desc: "Code snippet", color: "border-amber-500/30 hover:border-amber-500 text-amber-500" },
]

export default function ExportPanel({
  onExportLottie,
  onExportGIF,
  onExportMP4,
  onExportCSS,
  isExporting,
  exportProgress,
  currentFormat,
}: ExportPanelProps) {
  const currentConfig = useAppStore((s) => s.currentConfig)
  if (!currentConfig) return null

  const handlers: Record<string, () => void> = {
    lottie: onExportLottie,
    gif: onExportGIF,
    mp4: onExportMP4,
    css: onExportCSS,
  }

  return (
    <div className="border border-[#222222] rounded-xl bg-[#111111]/80 p-4 space-y-3">
      <h3 className="text-sm font-medium text-white">Export</h3>

      <div className="flex flex-col gap-2">
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon
          const active = currentFormat === fmt.key
          const disabled = isExporting

          return (
            <button
              key={fmt.key}
              onClick={handlers[fmt.key]}
              disabled={disabled}
              className={`flex items-center gap-2.5 rounded-lg border bg-[#0A0A0A] px-3 py-2.5 text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${fmt.color} relative`}
            >
              {fmt.key === "lottie" && (
                <span className="absolute -top-2 -right-2 bg-[#6366F1] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended
                </span>
              )}
              <div className="shrink-0">
                {active && isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium">{fmt.label}</span>
                <span className="text-[10px] opacity-60">{fmt.desc}</span>
              </div>
            </button>
          )
        })}
      </div>

      {isExporting && exportProgress >= 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#666666]">
            <span>Exporting {currentFormat.toUpperCase()}...</span>
            <span>{exportProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6366F1] rounded-full transition-[width] duration-200"
              style={{ width: `${Math.min(exportProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {exportProgress === -1 && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-500">
          <AlertCircle className="w-3 h-3" />
          Export failed
        </div>
      )}
    </div>
  )
}
