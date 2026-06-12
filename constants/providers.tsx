import type { ProviderName } from "@/lib/types/animation"

interface ProviderBrand {
  id: ProviderName
  name: string
  label: string
  gradient: string
  url: string
  Icon: React.FC<{ className?: string }>
  description: string
  model: string
}

/* ── Provider SVG Icons ── */

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gemini-a" x1="14" y1="2" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#34A853" />
          <stop offset="1" stopColor="#FBBC05" />
        </linearGradient>
        <linearGradient id="gemini-b" x1="14" y1="26" x2="2" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EA4335" />
          <stop offset="0.5" stopColor="#FBBC05" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      <path d="M14 2C14 2 16.5 10 19 12.5C22 15.5 26 14 26 14C26 14 22 17 19 19.5C16.5 22 14 26 14 26" stroke="url(#gemini-a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 26C14 26 11.5 18 9 15.5C6 12.5 2 14 2 14C2 14 6 11 9 8.5C11.5 6 14 2 14 2" stroke="url(#gemini-b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GroqIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="22" height="18" rx="4" stroke="#F97316" strokeWidth="2" />
      <path d="M10 18L14 10L18 18" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15H16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 10V8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 18L8 20" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 18L20 20" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function OpenRouterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="6" r="3.5" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="6" cy="21" r="3.5" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="22" cy="21" r="3.5" stroke="#8B5CF6" strokeWidth="2" />
      <path d="M14 9.5L9 18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 9.5L19 18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 21H19" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  )
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3L25 14L14 25L3 14L14 3Z" stroke="#10A37F" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14L12 11L16 15L19 12" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="4" stroke="#10A37F" strokeWidth="1.5" strokeDasharray="2 3" />
    </svg>
  )
}

function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="20" height="20" rx="5" stroke="#D97706" strokeWidth="1.8" />
      <path d="M9 20L12.5 8H15.5L19 20" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 16.5H17" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2" stroke="#D97706" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.3" />
    </svg>
  )
}

/* ── Provider Brand Data ── */

export const PROVIDERS: ProviderBrand[] = [
  {
    id: "gemini",
    name: "Gemini",
    label: "Gemini",
    gradient: "from-[#4285F4] via-[#34A853] to-[#FBBC05]",
    url: "https://aistudio.google.com/apikey",
    Icon: GeminiIcon,
    description: "Free API key. Best for testing and prototyping.",
    model: "gemini-2.0-flash",
  },
  {
    id: "groq",
    name: "Groq",
    label: "Groq",
    gradient: "from-[#F97316] to-[#FDBA74]",
    url: "https://console.groq.com/keys",
    Icon: GroqIcon,
    description: "Free tier available. Fast inference.",
    model: "llama-3.1-70b-versatile",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    label: "OpenRouter",
    gradient: "from-[#8B5CF6] to-[#A78BFA]",
    url: "https://openrouter.ai/keys",
    Icon: OpenRouterIcon,
    description: "Access many models with one key.",
    model: "gpt-4o-mini",
  },
  {
    id: "openai",
    name: "OpenAI",
    label: "OpenAI",
    gradient: "from-[#10A37F] to-[#2EC4B6]",
    url: "https://platform.openai.com/api-keys",
    Icon: OpenAIIcon,
    description: "Industry standard. Paid credits required.",
    model: "gpt-4o-mini",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    label: "Anthropic",
    gradient: "from-[#D97706] to-[#F59E0B]",
    url: "https://console.anthropic.com/settings/keys",
    Icon: AnthropicIcon,
    description: "Excellent for creative tasks.",
    model: "claude-3-haiku-20240307",
  },
]

export function getProvider(id: string): ProviderBrand | undefined {
  return PROVIDERS.find((p) => p.id === id)
}
