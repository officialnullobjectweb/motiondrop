export type ExportFormat = "lottie" | "gif" | "mp4" | "css"

export interface ExportOptions {
  format: ExportFormat
  quality?: number
  fps?: number
  onProgress?: (percent: number) => void
}

export interface ExportResult {
  blob?: Blob
  content?: string
  filename: string
  format: ExportFormat
  size: number
}

export const EXPORT_FORMATS: { key: ExportFormat; label: string; mime: string; extension: string }[] = [
  { key: "lottie", label: "Lottie JSON", mime: "application/json", extension: "json" },
  { key: "gif", label: "GIF", mime: "image/gif", extension: "gif" },
  { key: "mp4", label: "MP4", mime: "video/mp4", extension: "mp4" },
  { key: "css", label: "CSS", mime: "text/css", extension: "css" },
]
