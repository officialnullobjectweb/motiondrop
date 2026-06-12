# MotionDrop

AI-powered splash screen animation generator. Describe your brand in plain English and get a production-ready Lottie animation in seconds. Supports export to Lottie JSON, GIF, MP4, and CSS. Built with Next.js, TypeScript, and Tailwind CSS. No design skills needed.

## How to Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting API Keys

MotionDrop uses AI providers to generate animations. You need a free API key from one of these services:

| Provider | Get Key |
|----------|---------|
| **Gemini** (recommended) | [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenRouter** | [https://openrouter.ai/keys](https://openrouter.ai/keys) |
| **Groq** | [https://console.groq.com/keys](https://console.groq.com/keys) |
| **OpenAI** | [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic** | [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |

Keys are stored in your browser's localStorage and are never sent to our servers.

## Using Lottie Output

The Lottie JSON export can be used with:

- **LottieFiles** — upload to [lottiefiles.com](https://lottiefiles.com) for preview and sharing
- **Lottie-web** — render with the [lottie-web](https://github.com/airbnb/lottie-web) player
- **After Effects** — import via the [Bodymovin](https://aescripts.com/bodymovin/) extension
- **React Native** — use [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native)
- **Rive** — convert via [rive.app](https://rive.app)

## Tech Stack

- [Next.js](https://nextjs.org) — React framework
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [lottie-web](https://github.com/airbnb/lottie-web) — Lottie rendering
- [gif.js](https://github.com/jnordberg/gif.js) — GIF export
- [Sonner](https://sonner.emilkowal.ski) — Toast notifications

## License

MIT
