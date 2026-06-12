import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link href="/" className="text-white text-base font-bold tracking-tight">
              Motion<span className="text-[#6366F1]">&nbsp;Drop</span>
            </Link>
            <span className="text-[#888888] text-xs">Free and open source forever</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/app" className="text-[#888888] hover:text-white transition-colors text-sm">
              App
            </Link>
            <Link href="/docs" className="text-[#888888] hover:text-white transition-colors text-sm">
              Docs
            </Link>
            <Link
            href="https://github.com/officialnullobjectweb/motiondrop"
            target="_blank"
            className="text-[#888888] hover:text-white transition-colors text-sm"
          >
            GitHub
            </Link>
            <Link
            href="https://github.com/officialnullobjectweb/motiondrop/issues"
            target="_blank"
            className="text-[#888888] hover:text-white transition-colors text-sm"
          >
            Report Bug
            </Link>
          </div>

          <div className="text-[#888888] text-xs">
            Made with <span className="text-[#6366F1]">✦</span> for developers
          </div>
        </div>
      </div>
    </footer>
  )
}
