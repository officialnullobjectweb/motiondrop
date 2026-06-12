"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileImage } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"

const ALLOWED_TYPES = [
  "image/png",
  "image/svg+xml",
  "image/jpeg",
  "application/json",
]
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = [".png", ".svg", ".jpg", ".jpeg", ".json"]

export default function FileUpload() {
  const file = useAppStore((s) => s.uploadedFile)
  const setFile = useAppStore((s) => s.setUploadedFile)
  const setFileType = useAppStore((s) => s.setUploadedFileType)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validateAndSet(f: File) {
    const ext = "." + f.name.split(".").pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError("Unsupported format")
      return
    }
    if (f.size > MAX_SIZE) {
      setError("File too large")
      return
    }
    setError(null)
    setFile(f)
    setFileType(f.type)
  }

  function handleRemove() {
    setFile(null)
    setFileType("")
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSet(f)
  }, [])

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  function getPreviewUrl(f: File): string {
    return URL.createObjectURL(f)
  }

  const borderColor = error
    ? "border-red-500"
    : dragOver
      ? "border-[#6366F1] bg-[#6366F1]/5"
      : "border-[#222222]"

  return (
    <div className="space-y-2">
      <label className="text-sm text-white font-medium">Logo (optional)</label>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.svg,.jpg,.jpeg,.json"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) validateAndSet(f)
        }}
        className="hidden"
      />

      {file ? (
        <div className={`bg-[#111111] border ${error ? "border-red-500" : "border-[#222222]"} rounded-lg p-4`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center overflow-hidden shrink-0">
              {file.type.startsWith("image/") ? (
                <img
                  src={getPreviewUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FileImage className="w-6 h-6 text-[#888888]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{file.name}</p>
              <p className="text-xs text-[#666666]">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemove}
              className="text-[#888888] hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed ${borderColor} rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors`}
        >
          <Upload className={`w-6 h-6 ${dragOver ? "text-[#6366F1]" : "text-[#666666]"}`} />
          <p className={`text-sm ${dragOver ? "text-white" : "text-[#888888]"}`}>
            {dragOver ? "Drop to upload" : "Drop your logo here"}
          </p>
          <p className="text-xs text-[#555555]">PNG, SVG, JPG, JSON, Lottie &bull; Max 5MB</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.click()
            }}
            className="text-xs text-[#888888] border border-[#333333] hover:border-[#555555] hover:text-white rounded-full px-4 py-1 transition-colors mt-1"
          >
            Browse Files
          </button>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      )}
    </div>
  )
}
