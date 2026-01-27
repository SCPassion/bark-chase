"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DogImage } from "./dog-image";
import { ClickableArea } from "./clickable-area";
import { BarkCounter } from "./bark-counter";

export function ChaseDog() {
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/clickaudio.wav");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleInteractionStart = useCallback(() => {
    setIsMouthOpen(true);
    setClickCount((prev) => prev + 1);

    // Play audio, restarting if already playing
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Handle autoplay restrictions gracefully
        console.warn("Audio playback failed:", error);
      });
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsMouthOpen(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-4xl mx-auto">
      <ClickableArea
        onInteractionStart={handleInteractionStart}
        onInteractionEnd={handleInteractionEnd}
      >
        <DogImage isMouthOpen={isMouthOpen} />
      </ClickableArea>

      <BarkCounter count={clickCount} />
    </div>
  );
}
