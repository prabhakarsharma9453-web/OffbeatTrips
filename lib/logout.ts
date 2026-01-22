"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

/**
 * Utility function to handle logout with proper redirect to home page
 * Works for both admin and regular users
 */
export async function handleLogout() {
  try {
    // Sign out and redirect to home page
    await signOut({
      callbackUrl: "/",
      redirect: true,
    })
  } catch (error) {
    console.error("Error during logout:", error)
    // Fallback: redirect manually if signOut fails
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }
}
