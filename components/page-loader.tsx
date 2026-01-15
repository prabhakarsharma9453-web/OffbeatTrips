"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { MapPin } from "lucide-react"

export default function PageLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show loader on route change
    setLoading(true)

    // Hide loader after a short delay (simulates page loading)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div
            className="absolute -inset-2 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin"
            style={{ animationDuration: "0.8s" }}
          />
        </div>
        <div className="flex gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-secondary animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "0.8s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "0.8s" }}
          />
        </div>
      </div>
    </div>
  )
}
