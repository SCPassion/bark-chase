"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, isEstablished } from "@fogo/sessions-sdk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { burnOneChaseToken } from "@/lib/burn-chase-token";
import { getCountryFromIp } from "@/lib/get-country-from-ip";
import { DogImage } from "./dog-image";
import { ClickableArea } from "./clickable-area";
import { BarkCounter } from "./bark-counter";

export function ChaseDog() {
  const sessionState = useSession();
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countryRef = useRef<{
    countryCode: string;
    countryName: string;
  } | null>(null);
  const isLoggedIn = isEstablished(sessionState);
  const solanaAddress = isLoggedIn
    ? sessionState.walletPublicKey.toBase58()
    : null;

  const userRecord = useQuery(
    api.users.getBySolanaAddress,
    solanaAddress ? { solanaAddress } : "skip",
  );
  const incrementClickCount = useMutation(api.users.incrementClickCount);
  const [localUnseenIncrements, setLocalUnseenIncrements] = useState(0);
  const lastServerCountRef = useRef(0);

  const clickCount = userRecord?.clickCount ?? 0;
  const displayCount = clickCount + localUnseenIncrements;
  const isConvexLoading = isLoggedIn && userRecord === undefined;
  const isCountLoading = isInitialLoad || isConvexLoading;

  // Reconcile optimistic local increments when server count catches up.
  useEffect(() => {
    const previousServerCount = lastServerCountRef.current;
    if (clickCount > previousServerCount) {
      const acknowledged = clickCount - previousServerCount;
      setLocalUnseenIncrements((current) => Math.max(0, current - acknowledged));
    }
    lastServerCountRef.current = clickCount;
  }, [clickCount]);

  // Clear initial load blur after first paint / short delay
  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(t);
  }, []);

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

  // Warm country cache in background so the first successful click does not wait on IP lookup.
  useEffect(() => {
    if (!isLoggedIn || countryRef.current) return;
    let cancelled = false;
    getCountryFromIp()
      .then((country) => {
        if (!cancelled && country) {
          countryRef.current = country;
        }
      })
      .catch(() => {
        // Ignore country lookup failures; click flow must stay fast.
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleInteractionStart = useCallback(async () => {
    if (!isLoggedIn || !solanaAddress) return;

    setIsMouthOpen(true);

    // Play audio, restarting if already playing
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    }

    const burnSuccess = await burnOneChaseToken(sessionState);
    if (burnSuccess) {
      // Update UI immediately; reconcile with Convex query once server catches up.
      setLocalUnseenIncrements((current) => current + 1);
      const country = countryRef.current;
      if (!country) {
        void getCountryFromIp().then((resolved) => {
          if (resolved) countryRef.current = resolved;
        });
      }
      try {
        await incrementClickCount({
          solanaAddress,
          ...(country && {
            countryCode: country.countryCode,
            countryName: country.countryName,
          }),
        });
      } catch (error) {
        // Roll back optimistic increment if DB write fails.
        setLocalUnseenIncrements((current) => Math.max(0, current - 1));
        console.warn("Failed to persist click count increment:", error);
      }
    }
  }, [isLoggedIn, solanaAddress, incrementClickCount, sessionState]);

  const handleInteractionEnd = useCallback(() => {
    setIsMouthOpen(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-4xl mx-auto">
      {!isLoggedIn && (
        <p className="text-center text-sm sm:text-base text-white font-medium px-4 py-3 rounded-lg bg-gray-900 border-2 border-chase-accent shadow-2xl max-w-md">
          Sign in with your Fogo wallet (top right) to start playing and make
          Chase smile!
        </p>
      )}
      <ClickableArea
        onInteractionStart={handleInteractionStart}
        onInteractionEnd={handleInteractionEnd}
        disabled={!isLoggedIn}
      >
        <DogImage isMouthOpen={isMouthOpen} />
      </ClickableArea>

      {isLoggedIn && (
        <BarkCounter count={displayCount} isLoading={isCountLoading} />
      )}
    </div>
  );
}
