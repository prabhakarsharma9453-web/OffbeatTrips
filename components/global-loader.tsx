"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const hideLoader = () => {
      setFadeOut(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500) // Match fade out duration
    }

    // Hide loader when page is fully loaded
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        // Page already loaded
        setTimeout(hideLoader, 800) // Minimum display time
      } else {
        window.addEventListener("load", hideLoader)
      }
    }

    // Fallback: hide loader after maximum wait time
    const fallbackTimer = setTimeout(() => {
      hideLoader()
    }, 3000)

    return () => {
      clearTimeout(fallbackTimer)
      if (typeof window !== "undefined") {
        window.removeEventListener("load", hideLoader)
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo with Animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          {/* Rotating Ring */}
          <div
            className="absolute -inset-2 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin"
            style={{ animationDuration: "1s" }}
          />
          {/* Outer Glow */}
          <div
            className="absolute -inset-4 rounded-full bg-primary/20 animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold text-white">
            Offbeat<span className="text-primary">Trips</span>
          </h2>
          <p className="text-sm text-muted-foreground">Loading your adventures...</p>
          <div className="flex gap-1.5 mt-2">
            <div
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-secondary animate-bounce"
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
