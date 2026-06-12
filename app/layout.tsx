import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MotionDrop",
  description: "AI-powered splash screen animation generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A]">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid #222222",
              color: "#ffffff",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
