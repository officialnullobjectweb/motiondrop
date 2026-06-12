import { BookOpen, Key, Smartphone, Code2, Download, Lightbulb, ExternalLink } from "lucide-react"

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, "-")}>
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

function ProviderCard({ name, icon, url, steps }: { name: string; icon: string; url: string; steps: string[] }) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h4 className="text-sm font-semibold text-white">{name}</h4>
      </div>
      <ol className="list-decimal list-inside space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="text-xs text-[#888888] leading-relaxed">{s}</li>
        ))}
      </ol>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors"
      >
        Open {name} console <ExternalLink className="w-3 h-3" />
      </a>
    </div>
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
            <p className="text-sm text-[#666666]">Everything you need to use MotionDrop</p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-[#222222]">
          {[
            { href: "#getting-your-free-api-key", label: "API Keys" },
            { href: "#how-to-use-your-lottie-file", label: "Lottie Usage" },
            { href: "#understanding-the-output-formats", label: "Formats" },
            { href: "#tips-for-better-results", label: "Tips" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-[#888888] hover:text-white border border-[#222222] hover:border-[#444444] rounded-full px-3.5 py-1.5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="space-y-16">

          {/* Getting Your Free API Key */}
          <Section icon={Key} title="Getting Your Free API Key">
            <p className="text-sm text-[#888888] leading-relaxed">
              MotionDrop needs an API key from an AI provider to generate animations. Your key stays in your browser and is never sent anywhere except directly to the provider you choose.
            </p>

            <div className="grid gap-4">
              <ProviderCard
                name="Gemini"
                icon="✦"
                url="https://aistudio.google.com/apikey"
                steps={[
                  "Go to Google AI Studio and sign in with your Google account",
                  "Click 'Get API Key' in the left sidebar",
                  "Click 'Create API Key' and select your Google Cloud project",
                  "Copy the generated key (starts with AIzaSy)",
                  "Paste it into MotionDrop's API Key modal selecting 'Gemini' as provider",
                ]}
              />

              <ProviderCard
                name="Groq"
                icon="⚡"
                url="https://console.groq.com/keys"
                steps={[
                  "Go to the Groq console and sign in or create an account",
                  "Navigate to API Keys in the sidebar",
                  "Click 'Create API Key'",
                  "Copy the key (starts with gsk_)",
                  "Select 'Groq' in MotionDrop and paste your key",
                ]}
              />

              <ProviderCard
                name="OpenRouter"
                icon="◎"
                url="https://openrouter.ai/keys"
                steps={[
                  "Visit OpenRouter and sign in with your Google or GitHub account",
                  "Go to Keys page",
                  "Click 'Create Key'",
                  "Copy the key (starts with sk-or-v1-)",
                  "Select 'OpenRouter' in MotionDrop and paste your key",
                ]}
              />

              <ProviderCard
                name="OpenAI"
                icon="◆"
                url="https://platform.openai.com/api-keys"
                steps={[
                  "Go to the OpenAI platform and sign in",
                  "Navigate to API Keys in the left sidebar",
                  "Click 'Create new secret key'",
                  "Copy the key (starts with sk-proj- or sk-)",
                  "Select 'OpenAI' in MotionDrop and paste your key",
                  "Note: OpenAI requires a paid account with credits",
                ]}
              />

              <ProviderCard
                name="Anthropic"
                icon="▲"
                url="https://console.anthropic.com/settings/keys"
                steps={[
                  "Go to the Anthropic console and sign in",
                  "Navigate to Settings > API Keys",
                  "Click 'Create Key'",
                  "Copy the key (starts with sk-ant-)",
                  "Select 'Anthropic' in MotionDrop and paste your key",
                ]}
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-2">
              <p className="text-xs text-yellow-400 leading-relaxed">
                <strong>Security note:</strong> API keys are stored in plain text in your browser&apos;s localStorage.
                They are never sent to any server except the AI provider you select.
                For maximum security, generate a new key just for MotionDrop and revoke it when not in use.
              </p>
            </div>
          </Section>

          {/* How to Use Your Lottie File */}
          <Section icon={Smartphone} title="How to Use Your Lottie File">
            <p className="text-sm text-[#888888] leading-relaxed">
              Lottie is a lightweight, scalable animation format that works across all platforms.
              Here is how to integrate your exported .json file in different environments.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-2">React / Next.js (Web)</h3>
                <p className="text-xs text-[#888888] mb-2">Using the lottie-web library:</p>
                <CodeBlock
                  code={`npm install lottie-web

import { useEffect, useRef } from "react"
import lottie from "lottie-web"

export default function SplashScreen() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/splash.json", // your exported file
    })
    return () => anim.destroy()
  }, [])

  return <div ref={container} className="w-full h-full" />
}`}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-2">React Native</h3>
                <p className="text-xs text-[#888888] mb-2">Using the lottie-react-native library:</p>
                <CodeBlock
                  code={`npm install lottie-react-native

import LottieView from "lottie-react-native"
import { useRef } from "react"

export default function SplashScreen() {
  const animation = useRef<LottieView>(null)

  return (
    <LottieView
      ref={animation}
      source={require("./splash.json")}
      autoPlay
      loop
      style={{ width: "100%", height: "100%" }}
    />
  )
}`}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-2">iOS (Swift)</h3>
                <p className="text-xs text-[#888888] mb-2">Using Lottie for iOS via Swift Package Manager:</p>
                <CodeBlock
                  code={`import Lottie

class SplashViewController: UIViewController {
  private var animationView: LottieAnimationView?

  override func viewDidLoad() {
    super.viewDidLoad()

    animationView = .init(name: "splash")
    animationView?.frame = view.bounds
    animationView?.contentMode = .scaleAspectFit
    animationView?.loopMode = .loop
    animationView?.animationSpeed = 1.0

    view.addSubview(animationView!)
    animationView?.play()
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-2">Android (Kotlin)</h3>
                <p className="text-xs text-[#888888] mb-2">Using Lottie for Android via Gradle:</p>
                <CodeBlock
                  code={`// build.gradle.kts
dependencies {
  implementation("com.airbnb.android:lottie:6.6.0")
}

// activity_splash.xml
<com.airbnb.lottie.LottieAnimationView
  android:id="@+id/animationView"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:lottie_rawRes="@raw/splash"
  app:lottie_loop="true"
  app:lottie_autoPlay="true" />`}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-2">Plain HTML / Vanilla JS</h3>
                <CodeBlock
                  code={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"><\/script>
</head>
<body>
  <div id="animation" style="width:100vw;height:100vh"></div>
  <script>
    lottie.loadAnimation({
      container: document.getElementById("animation"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "./splash.json"
    })
  <\/script>
</body>
</html>`}
                />
              </div>
            </div>
          </Section>

          {/* Understanding the Output Formats */}
          <Section icon={Download} title="Understanding the Output Formats">
            <p className="text-sm text-[#888888] leading-relaxed">
              MotionDrop supports four export formats, each best suited for different use cases.
            </p>

            <div className="grid gap-3">
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#6366F1] text-sm font-bold">{ }</span>
                  <h4 className="text-sm font-semibold text-white">Lottie JSON</h4>
                  <span className="text-[10px] bg-[#6366F1]/20 text-[#6366F1] px-2 py-0.5 rounded-full font-medium">RECOMMENDED</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Best for production mobile and web apps. Vector-based so it scales perfectly to any screen size.
                  Extremely small file size. Can be edited in After Effects via the Bodymovin plugin.
                </p>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-500 text-sm font-bold">GIF</span>
                  <h4 className="text-sm font-semibold text-white">Animated GIF</h4>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Works everywhere with zero setup — no libraries, no code. Best for social media,
                  presentations, and places where you can&apos;t install anything. Larger file size and lower quality.
                </p>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-500 text-sm font-bold">MP4</span>
                  <h4 className="text-sm font-semibold text-white">MP4 Video</h4>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Best for video editing pipelines, demo reels, and social media ads. Compatible with
                  Premiere Pro, Final Cut, CapCut, and all video players. Small file size with good quality.
                </p>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500 text-sm font-bold">CSS</span>
                  <h4 className="text-sm font-semibold text-white">CSS Animation</h4>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Self-contained CSS file with @keyframes. Drop it into any HTML page for a working animation
                  with zero JavaScript. Best for web-only projects where you want maximum simplicity.
                </p>
              </div>
            </div>
          </Section>

          {/* Tips for Better Results */}
          <Section icon={Lightbulb} title="Tips for Better Results">
            <p className="text-sm text-[#888888] leading-relaxed">
              The more information you give, the better the result. Here is how to write prompts that produce stunning animations.
            </p>

            <div className="space-y-4">
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Include these details for best results:</h4>
                <ul className="space-y-1.5">
                  {[
                    "Brand name: \"FitPro\", \"PayFlow\", \"Serenity\" — capitalize it clearly",
                    "Industry: \"fitness app\", \"fintech\", \"meditation app\" — helps set the right mood",
                    "Colors: \"blue and white\", \"dark purple\", \"neon green\" — or let AI choose for the industry",
                    "Energy: \"energetic\", \"calm\", \"professional\", \"playful\" — sets the motion feel",
                    "Reference: \"like Nike ads\", \"Apple-style\", \"minimal\" — helps style matching",
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-[#888888] flex items-start gap-2">
                      <span className="text-[#6366F1] mt-0.5">✦</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Example prompts that work well:</h4>
                <div className="space-y-2">
                  {[
                    { prompt: "Fitness app called FitPro, blue and white color scheme, energetic and motivating", result: "High-energy fitness splash with bold typography and dynamic particles" },
                    { prompt: "Meditation app called Serenity, purple and gold, calm and peaceful", result: "Slow, gentle animation with soft gradient and floating particles" },
                    { prompt: "Fintech app PayFlow, dark blue, professional trustworthy feel", result: "Clean, precise animation with grid background and sharp transitions" },
                    { prompt: "Gaming app, neon green and black, explosive energy", result: "Fast-paced animation with elastic easing and confetti particles" },
                    { prompt: "Luxury fashion brand, gold on black, elegant minimal", result: "Minimal animation with sharp easing and subtle glow effects" },
                  ].map((ex, i) => (
                    <div key={i} className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-3">
                      <p className="text-xs text-white font-medium mb-1">&ldquo;{ex.prompt}&rdquo;</p>
                      <p className="text-[10px] text-[#666666]">→ {ex.result}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-1">Pro Tips</h4>
                <ul className="space-y-1 text-xs text-[#888888]">
                  <li>• Upload a logo file (PNG/SVG) — the animation will center it and animate it in</li>
                  <li>• Use Gemini (free) or Groq (free) for testing, then switch to a paid provider for production quality</li>
                  <li>• After generation, tweak the speed and energy sliders — small changes make a big difference</li>
                  <li>• Click Regenerate if you do not love the result — each generation is unique</li>
                  <li>• Export as Lottie for apps, GIF for sharing, MP4 for video, CSS for web-only projects</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Keyboard Shortcuts */}
          <Section icon={Code2} title="Keyboard Shortcuts">
            <p className="text-sm text-[#888888] leading-relaxed">
              When the app page is focused (and no input field is active), these shortcuts control the experience.
            </p>
            <div className="grid grid-cols-[130px_1fr] gap-x-6 gap-y-2.5 text-sm">
              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">Space</span>
              <span className="text-[#888888]">Play / Pause animation</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">R</span>
              <span className="text-[#888888]">Restart animation</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">L</span>
              <span className="text-[#888888]">Toggle loop</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">1</span>
              <span className="text-[#888888]">Switch to Portrait canvas</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">2</span>
              <span className="text-[#888888]">Switch to Square canvas</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">3</span>
              <span className="text-[#888888]">Switch to Desktop canvas</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">G</span>
              <span className="text-[#888888]">Generate animation (when prompt is filled)</span>

              <span className="font-mono text-xs text-[#6366F1] bg-[#6366F1]/10 rounded px-2 py-1 inline-block text-center">Escape</span>
              <span className="text-[#888888]">Close modals and color picker</span>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
