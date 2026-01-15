import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import GlobalLoader from "@/components/global-loader"
import PageLoader from "@/components/page-loader"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" })
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "OffbeatTrips - Your Reason to Travel",
  description:
    "Explore extraordinary travel experiences with curated adventure packages for hiking, camping, and more. Discover international and domestic destinations.",
  keywords: ["travel", "adventure", "hiking", "camping", "tours", "packages", "destinations"],
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#1a3a4a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GlobalLoader />
        <PageLoader />
        <AuthSessionProvider>
          {children}
          <Analytics />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
