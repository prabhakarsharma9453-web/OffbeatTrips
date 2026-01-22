"use client"

import { useEffect, useState, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const SESSION_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Component that automatically logs out users after 1 hour
 * Works for both regular users and admins
 * Tracks both session creation time and activity
 */
export default function SessionTimeout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const sessionStartTime = useRef<number | null>(null)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  const hasLoggedOut = useRef(false)

  // Track session start time when user logs in
  useEffect(() => {
    if (status === "authenticated" && session && !sessionStartTime.current) {
      sessionStartTime.current = Date.now()
      setLastActivity(Date.now())
    } else if (status !== "authenticated") {
      // Reset when logged out
      sessionStartTime.current = null
      hasLoggedOut.current = false
    }
  }, [status, session])

  // Update last activity on user interaction
  useEffect(() => {
    if (status !== "authenticated" || !session) return

    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity)
      })
    }
  }, [status, session])

  // Check session timeout
  useEffect(() => {
    if (status !== "authenticated" || !session || hasLoggedOut.current) return
    if (!sessionStartTime.current) return

    const checkTimeout = () => {
      const now = Date.now()
      const timeSinceSessionStart = now - (sessionStartTime.current || now)
      const timeSinceActivity = now - lastActivity

      // Log out if:
      // 1. 1 hour has passed since session started, OR
      // 2. 1 hour has passed since last activity
      if (timeSinceSessionStart >= SESSION_TIMEOUT_MS || timeSinceActivity >= SESSION_TIMEOUT_MS) {
        if (hasLoggedOut.current) return
        
        hasLoggedOut.current = true
        toast({
          title: "Session Expired",
          description: "Your session has expired after 1 hour. Please log in again.",
          variant: "destructive",
        })

        // Sign out and redirect to login
        signOut({ 
          callbackUrl: "/login",
          redirect: true 
        })
      }
    }

    // Check every minute
    const interval = setInterval(checkTimeout, 60 * 1000)

    // Also check immediately
    checkTimeout()

    return () => clearInterval(interval)
  }, [status, session, lastActivity, toast])

  // Also check on page visibility change (when user returns to tab)
  useEffect(() => {
    if (status !== "authenticated" || !session) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && sessionStartTime.current) {
        const now = Date.now()
        const timeSinceSessionStart = now - sessionStartTime.current
        const timeSinceActivity = now - lastActivity

        if (timeSinceSessionStart >= SESSION_TIMEOUT_MS || timeSinceActivity >= SESSION_TIMEOUT_MS) {
          if (hasLoggedOut.current) return
          
          hasLoggedOut.current = true
          toast({
            title: "Session Expired",
            description: "Your session has expired after 1 hour. Please log in again.",
            variant: "destructive",
          })

          signOut({ 
            callbackUrl: "/login",
            redirect: true 
          })
        } else {
          // Update activity when user returns to tab
          setLastActivity(now)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [status, session, lastActivity, toast])

  return null // This component doesn't render anything
}
