export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-10 px-4">
      <div className="flex items-center gap-4 sm:gap-6">
        {["4", "0", "4"].map((digit, i) => (
          <span
            key={i}
            className="text-[120px] sm:text-[180px] md:text-[220px] font-bold text-white leading-none tracking-tight"
            style={{
              display: "inline-block",
              animation: `drop-struggle 10s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {digit}
          </span>
        ))}
      </div>

      <p className="text-[#666666] text-base sm:text-lg text-center max-w-md">
        Page not found — it may have moved or never existed.
      </p>

      <a
        href="/"
        className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium rounded-full transition-colors"
      >
        Go Home
      </a>
    </div>
  )
}
