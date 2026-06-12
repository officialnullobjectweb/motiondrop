"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import AppContent from "@/components/app/AppContent"
import { ChevronLeft, Upload } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"

const ALLOWED_EXTENSIONS = [".png", ".svg", ".jpg", ".jpeg", ".json"]
const MAX_SIZE = 5 * 1024 * 1024

export default function AppPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dropAnim, setDropAnim] = useState<"idle" | "hover" | "success" | "error">("idle")
  const dropTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const setFile = useAppStore((s) => s.setUploadedFile)
  const setFileType = useAppStore((s) => s.setUploadedFileType)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragOver) {
      setIsDragOver(true)
      setDropAnim("hover")
    }
  }, [isDragOver])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only hide if leaving the whole page, not a child element
    if (e.currentTarget === e.target || e.relatedTarget === null) {
      setIsDragOver(false)
      setDropAnim("idle")
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const f = e.dataTransfer.files[0]
    if (!f) return

    const ext = "." + f.name.split(".").pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setDropAnim("error")
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current)
      dropTimeoutRef.current = setTimeout(() => setDropAnim("idle"), 2000)
      return
    }
    if (f.size > MAX_SIZE) {
      setDropAnim("error")
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current)
      dropTimeoutRef.current = setTimeout(() => setDropAnim("idle"), 2000)
      return
    }

    setDropAnim("success")
    setFile(f)
    setFileType(f.type)

    if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current)
    dropTimeoutRef.current = setTimeout(() => setDropAnim("idle"), 2000)
  }, [setFile, setFileType])

  return (
    <div
      className="relative min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Back navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-[10px] text-[#555555] hidden sm:block">
            Drop files anywhere to upload
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-12">
        <AppContent />
      </div>

      {/* ── Full-page Drag Overlay ── */}
      {(dropAnim !== "idle" || isDragOver) && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-all duration-300 ${
            dropAnim === "success"
              ? "bg-emerald-500/5 backdrop-blur-sm"
              : dropAnim === "error"
                ? "bg-red-500/5 backdrop-blur-sm"
                : "bg-[#6366F1]/5 backdrop-blur-sm"
          }`}
        >
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-300 ${
              dropAnim === "hover"
                ? "scale-110 opacity-100"
                : dropAnim === "success"
                  ? "scale-90 opacity-100"
                  : dropAnim === "error"
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
            }`}
          >
            {/* Animated drop icon */}
            <div
              className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                dropAnim === "success"
                  ? "border-emerald-500 bg-emerald-500/10 animate-bounce"
                  : dropAnim === "error"
                    ? "border-red-500 bg-red-500/10 animate-[shake_0.5s_ease-in-out]"
                    : "border-[#6366F1] bg-[#6366F1]/10 animate-[pulse-ring_2s_ease-in-out_infinite]"
              }`}
            >
              {dropAnim === "success" ? (
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : dropAnim === "error" ? (
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <Upload className="w-10 h-10 text-[#6366F1] animate-bounce" />
              )}
            </div>

            {/* Text */}
            {dropAnim === "hover" && (
              <div className="text-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-white text-lg font-bold">Drop your file here</p>
                <p className="text-[#888888] text-sm mt-1">PNG, SVG, JPG, or Lottie JSON</p>
              </div>
            )}
            {dropAnim === "success" && (
              <div className="text-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-emerald-400 text-lg font-bold">File added!</p>
                <p className="text-emerald-400/70 text-sm mt-1">Ready to use in your animation</p>
              </div>
            )}
            {dropAnim === "error" && (
              <div className="text-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-red-400 text-lg font-bold">Invalid file</p>
                <p className="text-red-400/70 text-sm mt-1">Use PNG, SVG, JPG, or JSON (max 5MB)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS keyframes for shake and fadeIn */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-2deg); }
          40% { transform: translateX(8px) rotate(2deg); }
          60% { transform: translateX(-5px) rotate(-1deg); }
          80% { transform: translateX(5px) rotate(1deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
