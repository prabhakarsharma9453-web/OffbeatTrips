"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Menu, X, MapPin, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  // Determine if we're on the home page
  const isHomePage = pathname === "/"

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: isHomePage ? "#destinations" : "/destinations" },
    { name: "Packages", href: isHomePage ? "#packages" : "/packages" },
    { name: "Activities", href: isHomePage ? "#activities" : "/activities/hiking" },
    { name: "Yachts", href: "/yachts" },
    { name: "Blog", href: isHomePage ? "#blog" : "/blog" },
    { name: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">
                Offbeat<span className="text-primary">Trips</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Your Reason to Travel</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {session.user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 top-20"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <div className="md:hidden fixed top-20 left-0 right-0 bottom-0 bg-background z-50 overflow-y-auto animate-fade-in-up">
              <div className="px-4 py-6 space-y-4 h-full flex flex-col">
                <div className="flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-white/80 hover:text-white py-3 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-border space-y-3 pb-6">
                  {session ? (
                    <>
                      <Link href="/dashboard" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-white/20 text-white bg-transparent hover:bg-white/10">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      {session.user.role === "admin" && (
                        <Link href="/admin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full border-white/20 text-white bg-transparent hover:bg-white/10">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-white/20 text-white bg-transparent hover:bg-white/10">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
