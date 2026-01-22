"use client"

import { useState, useEffect } from "react"
import { getPreferences, setPreferences, UserPreferences } from "@/lib/cookies-client"

/**
 * Hook to manage user preferences
 */
export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => getPreferences())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load preferences from cookie
    setPreferencesState(getPreferences())
    setIsLoading(false)
  }, [])

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    setPreferencesState(updated)
  }

  return {
    preferences,
    updatePreferences,
    isLoading,
  }
}
