import type { AnimationConfig, KeyframeData } from "@/lib/types/animation"
import { AnimationRenderer } from "@/lib/animation/renderer"

export async function exportToMP4(
  config: AnimationConfig,
  keyframes: KeyframeData,
  canvas: HTMLCanvasElement,
  onProgress: (percent: number) => void,
): Promise<Blob> {
  const offscreen = document.createElement("canvas")
  offscreen.width = config.canvas.width
  offscreen.height = config.canvas.height

  const renderer = new AnimationRenderer()
  renderer.init(offscreen)
  renderer.load(config, keyframes)

  const stream = offscreen.captureStream(60)

  const mimeTypes = [
    "video/mp4;codecs=h264",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ]

  let mimeType = ""
  for (const mt of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mt)) {
      mimeType = mt
      break
    }
  }
  if (!mimeType) {
    renderer.destroy()
    throw new Error("No supported video mime type found")
  }

  return new Promise<Blob>((resolve, reject) => {
    const chunks: Blob[] = []
    const recorder = new MediaRecorder(stream, { mimeType })

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.onstop = () => {
      renderer.destroy()
      const blob = new Blob(chunks, { type: mimeType })
      resolve(blob)
    }

    recorder.onerror = () => {
      renderer.destroy()
      reject(new Error("MediaRecorder error"))
    }

    const durationMs = config.timing.totalDuration * 1000
    const progressInterval = setInterval(() => {
      const pct = Math.round((renderer.currentTime / config.timing.totalDuration) * 100)
      onProgress(Math.min(pct, 99))
    }, 100)

    recorder.start()

    renderer.play()

    const checkDone = setInterval(() => {
      if (!renderer.isPlaying || renderer.currentTime >= config.timing.totalDuration) {
        clearInterval(checkDone)
        clearInterval(progressInterval)
        setTimeout(() => {
          recorder.stop()
        }, 100)
      }
    }, 50)
  })
}
