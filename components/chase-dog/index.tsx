"use client"

import { useState, useCallback } from "react"
import { Header } from "./header"
import { DogImage } from "./dog-image"
import { ClickableArea } from "./clickable-area"
import { BarkCounter } from "./bark-counter"

export function ChaseDog() {
  const [isMouthOpen, setIsMouthOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleInteractionStart = useCallback(() => {
    setIsMouthOpen(true)
    setClickCount((prev) => prev + 1)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    setIsMouthOpen(false)
  }, [])

  return (
    <div className="flex flex-col items-center gap-8">
      <Header />
      
      <ClickableArea
        onInteractionStart={handleInteractionStart}
        onInteractionEnd={handleInteractionEnd}
      >
        <DogImage isMouthOpen={isMouthOpen} />
      </ClickableArea>

      <BarkCounter count={clickCount} />
    </div>
  )
}
