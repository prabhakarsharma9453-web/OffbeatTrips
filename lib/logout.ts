"use client"

import { signOut } from "next-auth/react"

/**
 * Utility function to handle logout with proper redirect to home page
 * Works for both admin and regular users, including mobile browsers
 */
export async function handleLogout() {
  try {
    // Sign out without redirect first (better for mobile)
    await signOut({
      redirect: false,
    })
    
    // Then manually redirect to home page (works better on mobile)
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  } catch (error) {
    console.error("Error during logout:", error)
    // Fallback: force redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }
}
