import Navbar from "@/components/shared/Navbar"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import Footer from "@/components/shared/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}
