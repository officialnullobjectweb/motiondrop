import { BookOpen, Code, Download, Image, Settings, Zap } from "lucide-react"

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#6366F1]" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-4 overflow-x-auto text-xs text-[#BBBBBB] font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Documentation</h1>
            <p className="text-sm text-[#666666]">How to use MotionDrop</p>
          </div>
        </div>

        <div className="space-y-12">
          <Section icon={Zap} title="Quick Start">
            <p className="text-sm text-[#888888] leading-relaxed">
              MotionDrop generates animated splash screens from text prompts. You need an API key from one of the supported AI providers.
            </p>
            <ol className="list-decimal list-inside text-sm text-[#888888] space-y-2 leading-relaxed">
              <li>Get a free API key from your chosen provider (Gemini, OpenRouter, Groq, OpenAI, or Anthropic)</li>
              <li>Open the MotionDrop app and paste your API key in the API Key section</li>
              <li>Select your provider from the dropdown</li>
              <li>Type a description of the animation you want</li>
              <li>Choose a canvas size (Portrait 9:16, Square 1:1, or Desktop 16:9)</li>
              <li>Click Generate and wait a few seconds</li>
            </ol>
          </Section>

          <Section icon={Settings} title="Configuration">
            <p className="text-sm text-[#888888] leading-relaxed">
              After generation, the Editor panel lets you fine-tune your animation in real time.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Speed</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Adjust playback speed from 0.5x to 2x. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Energy</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Controls how dynamic the motion feels. Lower values produce calm, gentle animations. Higher values create explosive, dramatic motion.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Colors</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Click any color swatch to open a picker. You can also type a hex value directly for precise control.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Text & Particles</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Edit your brand name and tagline inline. Toggle particles on or off, and adjust their intensity.
                </p>
              </div>
            </div>
          </Section>

          <Section icon={Download} title="Export Formats">
            <p className="text-sm text-[#888888] leading-relaxed">
              MotionDrop supports four export formats for different use cases.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Lottie JSON</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Lightweight vector animation format. Import into After Effects (via Bodymovin), LottieFiles, or use with Lottie-web on the web. Best for production use where file size matters.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">GIF</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Universal format for social media, presentations, and anywhere that requires maximum compatibility. Larger file size but works everywhere.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">MP4</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Video format using the MediaRecorder API. Good for embedding in websites, demos, and video editing pipelines.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">CSS</h4>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Self-contained CSS animation. Drop the generated CSS into any HTML page for a working animation with zero JavaScript.
                </p>
              </div>
            </div>
          </Section>

          <Section icon={Code} title="Keyboard Shortcuts">
            <p className="text-sm text-[#888888] leading-relaxed">
              When the app page is focused (and no input field is active), these shortcuts control playback.
            </p>
            <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">Space</span>
              <span className="text-[#888888]">Play / Pause</span>
              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">R</span>
              <span className="text-[#888888]">Restart animation</span>
              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">L</span>
              <span className="text-[#888888]">Toggle loop</span>
            </div>
          </Section>

          <Section icon={Image} title="Usage Example">
            <p className="text-sm text-[#888888] leading-relaxed">
              Here is a complete example of embedding a MotionDrop CSS export in HTML:
            </p>
            <CodeBlock
              code={`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="animation.css">
</head>
<body>
  <div class="md-animation">
    <div class="md-background"></div>
    <div class="md-particles"></div>
    <div class="md-logo">
      <img src="logo.png" alt="Logo" />
    </div>
    <div class="md-text-primary">FitPro</div>
    <div class="md-text-secondary">Transform Your Body</div>
  </div>
</body>
</html>`}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}
