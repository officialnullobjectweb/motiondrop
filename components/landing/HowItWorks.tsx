import { Key, Sparkles, Download } from "lucide-react"

const steps = [
  {
    icon: Key,
    number: "01",
    title: "Add Your API Key",
    description:
      "Paste your free Gemini or Groq API key. Stored only in your browser, never on our servers.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Describe Your Brand",
    description:
      "Type your app name, colors, and feeling. Our AI understands even vague descriptions.",
  },
  {
    icon: Download,
    number: "03",
    title: "Download & Use",
    description:
      "Get Lottie JSON, GIF, MP4, or CSS. Ready to use in any project immediately.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-white text-3xl sm:text-4xl font-bold text-center mb-16">
          Three Steps to Premium Animation
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#111111] border border-[#222222] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#6366F1]/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-[#6366F1]" />
              </div>

              <span className="text-[#444444] text-sm font-mono mb-2">{step.number}</span>

              <h3 className="text-white text-lg font-semibold mb-3">{step.title}</h3>

              <p className="text-[#888888] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
