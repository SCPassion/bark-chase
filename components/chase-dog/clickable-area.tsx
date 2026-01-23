"use client"

import type { ReactNode } from "react"

interface ClickableAreaProps {
  children: ReactNode
  onInteractionStart: () => void
  onInteractionEnd: () => void
}

export function ClickableArea({
  children,
  onInteractionStart,
  onInteractionEnd,
}: ClickableAreaProps) {
  return (
    <button
      type="button"
      className="relative cursor-pointer select-none transition-transform active:scale-95 focus:outline-none rounded-2xl overflow-hidden shadow-2xl ring-4 ring-chase-accent/30 hover:ring-chase-accent/50 transition-all duration-200"
      onMouseDown={onInteractionStart}
      onMouseUp={onInteractionEnd}
      onMouseLeave={onInteractionEnd}
      onTouchStart={onInteractionStart}
      onTouchEnd={onInteractionEnd}
      aria-label="Click Chase Dog to make him bark"
    >
      {children}
    </button>
  )
}
