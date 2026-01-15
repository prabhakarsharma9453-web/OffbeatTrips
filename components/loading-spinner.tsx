"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = "md",
  text,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  }

  const content = (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30",
            sizeClasses[size]
          )}
        >
          <MapPin className={cn("text-white", iconSizes[size])} />
        </div>
        <div
          className={cn(
            "absolute -inset-2 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin",
            sizeClasses[size]
          )}
          style={{ animationDuration: "0.8s" }}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      <div className="flex gap-1.5">
        <div
          className={cn("rounded-full bg-primary animate-bounce", dotSizes[size])}
          style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
        />
        <div
          className={cn("rounded-full bg-secondary animate-bounce", dotSizes[size])}
          style={{ animationDelay: "150ms", animationDuration: "0.8s" }}
        />
        <div
          className={cn("rounded-full bg-primary animate-bounce", dotSizes[size])}
          style={{ animationDelay: "300ms", animationDuration: "0.8s" }}
        />
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9997] bg-background/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}
