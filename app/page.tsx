import Navbar from "@/components/shared/Navbar"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import ExampleAnimations from "@/components/landing/ExampleAnimations"
import SitemapSection from "@/components/landing/SitemapSection"
import Footer from "@/components/shared/Footer"

export default function Home() {
  return (
    <>
      {/* Skip-to-content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#6366F1] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        <Hero />
        <ExampleAnimations />
        <HowItWorks />
        <SitemapSection />
      </main>
      <Footer />
    </>
  )
}
