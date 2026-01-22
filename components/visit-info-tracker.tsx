"use client"

import { useEffect, useState } from "react"

interface VisitInfo {
  count: number
  firstVisit: string
  lastVisit: string
}

/**
 * Component to track and display visit information
 * This is optional - you can use this to show visit stats to users
 */
export default function VisitInfoTracker() {
  const [visitInfo, setVisitInfo] = useState<VisitInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisitInfo = async () => {
      try {
        const response = await fetch("/api/cookies/visit")
        const result = await response.json()

        if (result.success) {
          setVisitInfo(result.data)
        }
      } catch (error) {
        console.error("Error fetching visit info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisitInfo()
  }, [])

  // This component doesn't render anything by default
  // You can uncomment the return statement below to display visit info
  // Or use the visitInfo state in your own components

  return null

  // Uncomment to display visit info:
  /*
  if (isLoading) return null

  return (
    <div className="text-xs text-muted-foreground">
      Visit #{visitInfo?.count || 0}
    </div>
  )
  */
}
