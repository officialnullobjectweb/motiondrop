"use client"

import { useCallback, useRef } from "react"
import { useAppStore } from "@/store/useAppStore"
import { exportToLottie } from "@/lib/export/toLottie"
import { exportToGIF } from "@/lib/export/toGIF"
import { exportToMP4 } from "@/lib/export/toMP4"
import { exportToCSS } from "@/lib/export/toCSS"
import { toastSuccess, toastError } from "@/lib/toast"

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

export function useExport(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const isExportingRef = useRef(false)

  const setIsExporting = useAppStore((s) => s.setIsExporting)
  const setExportFormat = useAppStore((s) => s.setExportFormat)
  const setExportProgress = useAppStore((s) => s.setExportProgress)
  const isExporting = useAppStore((s) => s.isExporting)
  const exportProgress = useAppStore((s) => s.exportProgress)
  const currentFormat = useAppStore((s) => s.exportFormat)

  const wrap = useCallback(
    (format: string, fn: () => Promise<void>) => async () => {
      if (isExportingRef.current) return
      isExportingRef.current = true
      setIsExporting(true)
      setExportFormat(format)
      setExportProgress(0)
      try {
        await fn()
        toastSuccess(`${format.toUpperCase()} exported successfully`)
      } catch (e) {
        setExportProgress(-1)
        toastError(e instanceof Error ? e.message : `${format.toUpperCase()} export failed`)
      } finally {
        isExportingRef.current = false
        setIsExporting(false)
        setExportFormat("")
      }
    },
    [setIsExporting, setExportFormat, setExportProgress],
  )

  const exportLottie = useCallback(
    wrap("lottie", async () => {
      const state = useAppStore.getState()
      if (!state.currentConfig || !state.currentKeyframes) throw new Error("No animation to export")
      const json = exportToLottie(state.currentConfig, state.currentKeyframes)
      setExportProgress(100)
      downloadString(json, `${state.currentConfig.brand.name || "animation"}.json`, "application/json")
    }),
    [wrap, setExportProgress],
  )

  const exportGIF = useCallback(
    wrap("gif", async () => {
      const state = useAppStore.getState()
      if (!state.currentConfig || !state.currentKeyframes) throw new Error("No animation to export")
      if (!canvasRef.current) throw new Error("Canvas not available")
      const blob = await exportToGIF(state.currentConfig, state.currentKeyframes, canvasRef.current, (pct) =>
        setExportProgress(pct),
      )
      downloadBlob(blob, `${state.currentConfig.brand.name || "animation"}.gif`)
    }),
    [wrap, setExportProgress, canvasRef],
  )

  const exportMP4 = useCallback(
    wrap("mp4", async () => {
      const state = useAppStore.getState()
      if (!state.currentConfig || !state.currentKeyframes) throw new Error("No animation to export")
      if (!canvasRef.current) throw new Error("Canvas not available")
      const blob = await exportToMP4(state.currentConfig, state.currentKeyframes, canvasRef.current, (pct) =>
        setExportProgress(pct),
      )
      const ext = blob.type.includes("mp4") ? "mp4" : "webm"
      downloadBlob(blob, `${state.currentConfig.brand.name || "animation"}.${ext}`)
    }),
    [wrap, setExportProgress, canvasRef],
  )

  const exportCSS = useCallback(
    wrap("css", async () => {
      const state = useAppStore.getState()
      if (!state.currentConfig || !state.currentKeyframes) throw new Error("No animation to export")
      const css = exportToCSS(state.currentConfig, state.currentKeyframes)
      setExportProgress(100)
      downloadString(css, `${state.currentConfig.brand.name || "animation"}.css`, "text/css")
    }),
    [wrap, setExportProgress],
  )

  return {
    exportLottie,
    exportGIF,
    exportMP4,
    exportCSS,
    isExporting,
    exportProgress,
    currentFormat,
  }
}
