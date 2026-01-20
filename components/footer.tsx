import Link from "next/link"
import { MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Destinations", href: "/destinations/international" },
    { name: "Packages", href: "/packages" },
    { name: "Blog", href: "/#blog" },
  ]

  const activityLinks = [
    { name: "Hiking", href: "/#activities" },
    { name: "Camping", href: "/#activities" },
    { name: "Water Sports", href: "/#activities" },
    { name: "Paragliding", href: "/#activities" },
    { name: "Skiing", href: "/#activities" },
  ]

  const supportLinks = [
    { name: "Contact Us", href: "/#contact" },
    { name: "FAQs", href: "/#faq" },
    { name: "Privacy Policy", href: "/#privacy" },
    { name: "Terms of Service", href: "/#terms" },
    { name: "Refund Policy", href: "/#refund" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  Offbeat<span className="text-primary">Trips</span>
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner for extraordinary travel experiences worldwide.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-white font-semibold mb-4">Activities</h4>
            <ul className="space-y-2">
              {activityLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border space-y-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <p className="text-muted-foreground text-sm text-center">
              Secure Payments Powered by <span className="text-white font-semibold">Airpay</span>, <span className="text-white font-semibold">Razorpay</span> and <span className="text-white font-semibold">PhonePe</span>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© 2026 OffbeatTrips. All rights reserved.</p>
            <p className="text-muted-foreground text-sm">Made with ❤️ for adventurers worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
