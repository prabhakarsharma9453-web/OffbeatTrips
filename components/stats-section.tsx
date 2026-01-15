"use client"

import { useState, useEffect, useRef } from "react"

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Where Every Journey Creates <span className="text-primary">Happy Travelers</span>
          </h2>
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {[
            { value: "10K+", label: "Happy Travelers" },
            { value: "500+", label: "Destinations" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-primary/50 transition-all duration-300"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1 sm:mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
