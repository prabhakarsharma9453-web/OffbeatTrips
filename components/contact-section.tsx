"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult({ type: null, message: "" })

    try {
      const formDataToSend = new FormData(e.currentTarget)
      formDataToSend.append("access_key", "c67e1eb0-bb63-4f34-9bdf-dc096d24c9d8")

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: "success",
          message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
        // Clear result message after 5 seconds
        setTimeout(() => {
          setResult({ type: null, message: "" })
        }, 5000)
      } else {
        setResult({
          type: "error",
          message: data.message || "Something went wrong. Please try again later.",
        })
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "Failed to send message. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="py-8 sm:py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Have questions about our packages? Want a custom itinerary? We are here to help plan your perfect adventure.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}>
            <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8 border border-border">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-5 lg:mb-6">Contact Information</h3>
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white text-sm sm:text-base font-medium">Email Us</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">hello@offbeattrips.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white text-sm sm:text-base font-medium">Call Us</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white text-sm sm:text-base font-medium">Visit Us</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">123 Adventure Street, Travel City, TC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
              <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">Need Quick Help?</h3>
              <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4">
                Our travel experts are available 24/7 to assist you with any queries.
              </p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 text-xs sm:text-sm px-4 sm:px-6">
                Start Live Chat
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`bg-card rounded-2xl p-4 sm:p-6 lg:p-8 border border-border ${
              isVisible ? "animate-fade-in-right" : "opacity-0"
            }`}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-5 lg:mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 911148444"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background border-border text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your dream trip..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-background border-border text-white resize-none"
                  required
                />
              </div>

              {/* Result Message */}
              {result.type && (
                <div
                  className={`p-4 rounded-lg border ${
                    result.type === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  <p className="text-sm font-medium">{result.message}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
