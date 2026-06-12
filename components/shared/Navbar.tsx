"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"

const navLinks = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#examples", label: "Examples" },
  { href: "/history", label: "History" },
  { href: "/docs", label: "Docs" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-white text-lg font-bold tracking-tight group">
          <span className="inline-block animate-motion-slide">Motion</span>
          <span className="inline-block w-1">&nbsp;</span>
          <span className="inline-block text-[#6366F1] animate-drop-lands animate-logo-idle">Drop</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://github.com/officialnullobjectweb/motiondrop"
            target="_blank"
            className="text-[#888888] hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </Link>
          <Link
            href="/app"
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-5 py-2 rounded-full inline-flex items-center gap-2 transition-colors"
          >
            Open App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#888888] hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#222222] bg-[#0A0A0A]">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[#888888] hover:text-white transition-colors text-sm py-2"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#222222] my-2" />
            <Link
              href="/app"
              onClick={() => setMobileOpen(false)}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-5 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors"
            >
              Open App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
