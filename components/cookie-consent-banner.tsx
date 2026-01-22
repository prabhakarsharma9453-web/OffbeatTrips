"use client"

import { useState, useEffect } from "react"
import { X, Cookie, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { setCookieConsent, hasCookieConsent, setPreferences, getPreferences } from "@/lib/cookies-client"

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferencesState] = useState(getPreferences())
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has already given consent
    if (!hasCookieConsent()) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    setCookieConsent(true)
    setShowBanner(false)
    toast({
      title: "Cookies Accepted",
      description: "Your preferences have been saved.",
    })
  }

  const handleRejectAll = () => {
    setCookieConsent(false)
    setShowBanner(false)
    toast({
      title: "Cookies Rejected",
      description: "Only essential cookies will be used.",
    })
  }

  const handleSavePreferences = () => {
    setPreferences(preferences)
    setCookieConsent(true)
    setShowBanner(false)
    setShowSettings(false)
    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been saved.",
    })
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-card border-t border-border shadow-2xl p-4 sm:p-6 pr-20 sm:pr-24 md:pr-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies.{" "}
                <a
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10 whitespace-nowrap"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              Cookie Settings
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Essential Cookies (Always Active) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function properly
                  </p>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">
                  Always Active
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Currency Preference
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferencesState({
                      ...preferences,
                      currency: e.target.value as 'USD' | 'INR' | 'EUR',
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Theme Preference
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) =>
                    setPreferencesState({
                      ...preferences,
                      theme: e.target.value as 'light' | 'dark' | 'system',
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Language
                </label>
                <select
                  value={preferences.language || 'en'}
                  onChange={(e) =>
                    setPreferencesState({
                      ...preferences,
                      language: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences} className="bg-primary hover:bg-primary/90">
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
