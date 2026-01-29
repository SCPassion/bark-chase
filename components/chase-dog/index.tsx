"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, isEstablished } from "@fogo/sessions-sdk-react";
import { DogImage } from "./dog-image";
import { ClickableArea } from "./clickable-area";
import { BarkCounter } from "./bark-counter";

export function ChaseDog() {
  const sessionState = useSession();
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoggedIn = isEstablished(sessionState);

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
    if (!isLoggedIn) return;

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
  }, [isLoggedIn]);

  const handleInteractionEnd = useCallback(() => {
    setIsMouthOpen(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-4xl mx-auto">
      {!isLoggedIn && (
        <p className="text-center text-sm sm:text-base text-white font-medium px-4 py-3 rounded-lg bg-gray-900 border-2 border-chase-accent shadow-2xl max-w-md">
          Sign in with your Fogo wallet (top right) to start playing and make Chase smile!
        </p>
      )}
      <ClickableArea
        onInteractionStart={handleInteractionStart}
        onInteractionEnd={handleInteractionEnd}
        disabled={!isLoggedIn}
      >
        <DogImage isMouthOpen={isMouthOpen} />
      </ClickableArea>

      <BarkCounter count={clickCount} />
    </div>
  );
}
