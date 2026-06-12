import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <span className="inline-block text-xs font-medium text-[#888888] border border-[#222222] rounded-full px-4 py-1.5 mb-8">
          Free & Open Source <span className="text-[#6366F1]">✦</span>
        </span>

        <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
          Turn Words Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#A78BFA]">
            Premium Animations
          </span>
        </h1>

        <p className="text-[#888888] text-lg sm:text-xl mt-6 max-w-2xl leading-relaxed">
          Describe your brand. Get a production-ready Lottie animation in seconds. No design skills needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            href="/app"
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-base font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating Free
          </Link>
          <Link
            href="https://github.com/officialnullobjectweb/motiondrop"
            target="_blank"
            className="text-white border border-white/20 hover:border-white/40 text-base font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </Link>
        </div>

        <div className="mt-16 w-full max-w-sm mx-auto">
          <div className="relative aspect-[9/16] max-h-[480px] mx-auto rounded-[24px] border border-[#222222] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-[#6366F1]/10">
            <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-br from-[#6366F1]/30 via-[#8B5CF6]/20 to-[#A78BFA]/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1] animate-pulse-ring" />
              </div>
              <div className="w-3/4 h-3 bg-white/10 rounded-full mb-3" />
              <div className="w-1/2 h-2 bg-white/5 rounded-full" />
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  style={{ animationDelay: `${i * 1.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
