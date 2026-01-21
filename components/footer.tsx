import Link from "next/link"
import { MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Destinations", href: "/destinations/international" },
    { name: "Packages", href: "/packages" },
    { name: "Blog", href: "/#blog" },
  ]

  const activityLinks = [
    { name: "Hiking", href: "/activities/hiking" },
    { name: "Camping", href: "/activities/camping" },
    { name: "Water Sports", href: "/activities/water-sports" },
    { name: "Paragliding", href: "/activities/paragliding" },
    { name: "Skiing", href: "/activities/skiing" },
  ]

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/p/OffbeatTrips-100086920822238/#Thank", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/offbeattrips.official/", label: "Instagram" },
    { icon: Twitter, href: "https://x.com/OffbeatTrips_", label: "Twitter" },
    { icon: Youtube, href: "https://www.youtube.com/@offbeattrips.official", label: "YouTube" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: centered social links */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-muted-foreground text-center">
            Let&apos;s become friend
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand & offices */}
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
            {/* <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner for extraordinary travel experiences worldwide.
            </p> */}

           

            {/* Office Locations */}
            <div className="mb-4 space-y-2">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-muted-foreground">
                Offices
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/80 cursor-default transition-colors"
                  title="Raj Nagar Part 1, New Delhi, Shiv Mandir Marg, Palam Colony, Delhi-110045"
                >
                  Delhi
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/80 cursor-default transition-colors"
                  title="Plot No. 93, Sector 44, Gurugram, Haryana - 122003"
                >
                  Gurugram
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/80 cursor-default transition-colors"
                  title="Near Kumbhar Wada Police Station, Opp:. Central Bank Of India, Bhiwandi, Mumbai: 421302"
                >
                  Mumbai
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/80 cursor-default transition-colors"
                  title="Mayapuri, Near Meera Ghati, Karnal-132001"
                >
                  Karnal
                </span>
              </div>
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
