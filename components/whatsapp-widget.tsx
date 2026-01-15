"use client"

import { useState, useEffect, useRef } from "react"

interface WhatsAppWidgetProps {
  phoneNumber?: string
  messageInterval?: number
  hideTooltipOnMobile?: boolean
}

const tooltipMessages = [
  "✈️ Planning your next trip? Chat with us!",
  "🏝️ Want exclusive holiday packages?",
  "🚆 Book flights, hotels & cabs easily",
  "💬 Need travel assistance? We're on WhatsApp",
  "🌍 Best deals available — connect now!",
  "🎒 Customize your travel package today",
]

export default function WhatsAppWidget({
  phoneNumber = "918588855935",
  messageInterval = 12000, // 12 seconds default
  hideTooltipOnMobile = false,
}: WhatsAppWidgetProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Rotate messages automatically with smooth transition
  useEffect(() => {
    const rotateMessages = () => {
      setIsTransitioning(true)
      
      // Fade out current message
      timeoutRef.current = setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % tooltipMessages.length)
        setIsTransitioning(false)
      }, 300) // Half of transition duration for smooth fade
    }

    intervalRef.current = setInterval(rotateMessages, messageInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [messageInterval])

  // Check if tooltip should be hidden on mobile
  useEffect(() => {
    if (hideTooltipOnMobile) {
      const checkScreenSize = () => {
        setIsVisible(window.innerWidth >= 768)
      }

      checkScreenSize()
      window.addEventListener("resize", checkScreenSize)

      return () => window.removeEventListener("resize", checkScreenSize)
    } else {
      setIsVisible(true)
    }
  }, [hideTooltipOnMobile])

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3">
      {/* Tooltip Message */}
      {isVisible && (
        <div
          className={`bg-white text-gray-800 px-3 py-2 md:px-4 md:py-2.5 rounded-lg shadow-lg border border-gray-200 max-w-[calc(100vw-5rem)] md:max-w-xs relative transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#25D366] rounded-full animate-pulse" />
            <p
              key={currentMessageIndex}
              className="text-xs md:text-sm font-medium transition-opacity duration-300"
              style={{
                animation: isTransitioning
                  ? "none"
                  : "fadeInSlide 0.6s ease-in-out forwards",
              }}
            >
              {tooltipMessages[currentMessageIndex]}
            </p>
          </div>
          {/* Tooltip Arrow - Only show on desktop */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-white border-b-8 border-b-transparent" />
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-300" />

        {/* WhatsApp Icon SVG */}
        <svg
          className="w-8 h-8 md:w-9 md:h-9 text-white relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Pulse animation ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" style={{ animationDuration: "3s" }} />
      </button>
    </div>
  )
}
