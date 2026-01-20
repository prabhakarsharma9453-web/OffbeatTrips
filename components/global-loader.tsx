"use client"

import { useState, useEffect } from "react"

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
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-[#0D0D0D] transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
     {/* <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 relative z-10 text-center">
      <h1
    className={`flex items-center justify-center gap-2 sm:gap-3 md:gap-4 font-cormorant-semibold text-[#D4AF37] whitespace-nowrap ${
      !fadeOut ? "animate-luxury-reveal" : ""
    }`}
  >
    <span className="text-[10px] sm:text-sm md:text-base lg:text-lg tracking-[0.2em] uppercase">
      You're stepping into the world's most loved Offbeat space
    </span>
      
  </h1>
    </div> */}

<div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center">
  <h1
    className={`flex items-center justify-center font-cormorant-semibold text-[#D4AF37]
      whitespace-normal sm:whitespace-nowrap
      ${
        !fadeOut ? "animate-luxury-reveal" : ""
      }`}
  >
    <span
      className="
        text-[11px]
        sm:text-sm
        md:text-base
        lg:text-lg
        tracking-[0.18em]
        uppercase
        leading-relaxed sm:leading-none
        text-center
      "
    >
      You're stepping into the world's most loved Offbeat space
    </span>
  </h1>
</div>


    </div>
  )
}
