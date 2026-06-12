"use client"

import { useCallback, useRef, useState } from "react"
import { Clock, Trash2, Download, Edit3, Play, FileJson, FileImage, FileVideo, FileCode, ChevronDown } from "lucide-react"
import type { HistoryItem } from "@/lib/types/config"
import { useAppStore } from "@/store/useAppStore"
import { exportToLottie } from "@/lib/export/toLottie"
import { exportToGIF } from "@/lib/export/toGIF"
import { exportToMP4 } from "@/lib/export/toMP4"
import { exportToCSS } from "@/lib/export/toCSS"
import { toastSuccess, toastError } from "@/lib/toast"

const ASPECT_LABELS: Record<string, string> = {
  portrait: "9:16",
  square: "1:1",
  desktop: "16:9",
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadString(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  downloadBlob(blob, filename)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + "…"
}

interface HistoryCardProps {
  item: HistoryItem
  onDelete: (id: string) => void
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const downloadRef = useRef<HTMLDivElement>(null)

  const setCurrentConfig = useAppStore((s) => s.setCurrentConfig)
  const setCurrentKeyframes = useAppStore((s) => s.setCurrentKeyframes)

  const handleLoad = useCallback(() => {
    setCurrentConfig(item.config)
    setCurrentKeyframes(item.keyframes)
    window.location.href = "/app"
  }, [item.config, item.keyframes, setCurrentConfig, setCurrentKeyframes])

  const handleDownload = useCallback(async (format: string) => {
    setIsDownloading(format)
    setDownloadOpen(false)
    try {
      const name = item.config.brand.name || "animation"
      switch (format) {
        case "lottie": {
          const json = exportToLottie(item.config, item.keyframes)
          downloadString(json, `${name}.json`, "application/json")
          break
        }
        case "gif": {
          const offscreen = document.createElement("canvas")
          offscreen.width = 300
          offscreen.height = Math.round(300 / (item.config.canvas.width / item.config.canvas.height))
          const { AnimationRenderer } = await import("@/lib/animation/renderer")
          const r = new AnimationRenderer()
          r.init(offscreen)
          r.load(item.config, item.keyframes)
          const blob = await exportToGIF(item.config, item.keyframes, offscreen, () => {})
          r.destroy()
          downloadBlob(blob, `${name}.gif`)
          break
        }
        case "mp4": {
          const offscreen = document.createElement("canvas")
          offscreen.width = item.config.canvas.width
          offscreen.height = item.config.canvas.height
          const { AnimationRenderer } = await import("@/lib/animation/renderer")
          const r = new AnimationRenderer()
          r.init(offscreen)
          r.load(item.config, item.keyframes)
          const blob = await exportToMP4(item.config, item.keyframes, offscreen, () => {})
          r.destroy()
          const ext = blob.type.includes("mp4") ? "mp4" : "webm"
          downloadBlob(blob, `${name}.${ext}`)
          break
        }
        case "css": {
          const css = exportToCSS(item.config, item.keyframes)
          downloadString(css, `${name}.css`, "text/css")
          break
        }
      }
      toastSuccess(`${format.toUpperCase()} downloaded`)
    } catch (e) {
      toastError(e instanceof Error ? e.message : `${format.toUpperCase()} download failed`)
    } finally {
      setIsDownloading(null)
    }
  }, [item.config, item.keyframes])

  const downloads = [
    { key: "lottie", label: "Lottie JSON", icon: FileJson, color: "text-[#6366F1]" },
    { key: "gif", label: "GIF", icon: FileImage, color: "text-emerald-500" },
    { key: "mp4", label: "MP4", icon: FileVideo, color: "text-rose-500" },
    { key: "css", label: "CSS", icon: FileCode, color: "text-amber-500" },
  ]

  return (
    <div className="group relative rounded-xl border border-[#222222] bg-[#111111]/60 hover:bg-[#111111] hover:border-[#333333] transition-all overflow-hidden">
      <div className="aspect-[16/9] relative bg-[#0A0A0A] overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.prompt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/70 text-[#888888] border border-white/10 uppercase tracking-wider">
            {ASPECT_LABELS[item.canvasSize] || item.canvasSize}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-[#888888] border border-white/10">
            {item.duration.toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs text-white leading-relaxed line-clamp-2">
          {truncate(item.prompt, 120)}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-[#666666]">
          <Clock className="w-3 h-3" />
          <span>{formatDate(item.timestamp)}</span>
          <span className="mx-1">·</span>
          <span className="capitalize">{item.provider}</span>
        </div>
      </div>

      <div className="flex border-t border-[#222222] divide-x divide-[#222222]">
        <button
          onClick={handleLoad}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          Load & Edit
        </button>

        <div className="relative" ref={downloadRef}>
          <button
            onClick={() => setDownloadOpen(!downloadOpen)}
            disabled={isDownloading !== null}
            className="flex items-center justify-center gap-1 px-3 py-2 text-[11px] text-[#888888] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            <ChevronDown className="w-2.5 h-2.5" />
          </button>

          {downloadOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDownloadOpen(false)} />
              <div className="absolute bottom-full right-0 mb-1 z-20 w-36 rounded-lg border border-[#222222] bg-[#111111] shadow-xl overflow-hidden">
                {downloads.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => handleDownload(d.key)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <d.icon className={`w-3.5 h-3.5 ${d.color}`} />
                    {d.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] text-[#888888] hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
