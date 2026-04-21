import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import Header from "./sections/Header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ashley Motsie | Software Developer",
  description: "Full-Stack Developer & AI Engineer based in Rustenburg, South Africa. Building production-ready web apps and AI-powered tools.",
  openGraph: {
    title: "Ashley Motsie | Software Developer",
    description: "Full-Stack Developer & AI Engineer based in South Africa.",
    url: "https://chatdevhub.netlify.app",
    siteName: "Ashley Motsie Portfolio",
    images: [{ url: "/og-preview.png.jpeg" }],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <TooltipProvider>
          <Header />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
