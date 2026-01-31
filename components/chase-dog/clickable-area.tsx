"use client"

import type { ReactNode } from "react"

interface ClickableAreaProps {
  children: ReactNode
  onInteractionStart: () => void
  onInteractionEnd: () => void
  disabled?: boolean
}

export function ClickableArea({
  children,
  onInteractionStart,
  onInteractionEnd,
  disabled = false,
}: ClickableAreaProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="relative select-none transition-all duration-200 focus:outline-none rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-2 sm:ring-4 disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none cursor-pointer active:scale-95 ring-chase-accent/30 hover:ring-chase-accent/50 focus-visible:ring-chase-accent/70 disabled:ring-chase-muted/20"
      onMouseDown={disabled ? undefined : onInteractionStart}
      onMouseUp={disabled ? undefined : onInteractionEnd}
      onMouseLeave={disabled ? undefined : onInteractionEnd}
      onTouchStart={disabled ? undefined : onInteractionStart}
      onTouchEnd={disabled ? undefined : onInteractionEnd}
      aria-label={disabled ? "Sign in with Fogo to make Chase bark" : "Click Chase Dog to make him bark"}
    >
      {children}
    </button>
  )
}
