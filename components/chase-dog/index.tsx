"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, isEstablished } from "@fogo/sessions-sdk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  burnOneChaseToken,
  prewarmBurnContext,
} from "@/lib/burn-chase-token";
import { getCountryFromIp } from "@/lib/get-country-from-ip";
import { CHASE_DECIMALS } from "@/lib/chase-token";
import { emitChaseBalanceDelta } from "@/lib/chase-balance-events";
import { DogImage } from "./dog-image";
import { ClickableArea } from "./clickable-area";
import { BarkCounter } from "./bark-counter";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "react-toastify";

const CHASE_ONE_TOKEN_RAW = BigInt(10 ** CHASE_DECIMALS);
const UNKNOWN_COUNTRY = {
  countryCode: "ZZ",
  countryName: "Unknown",
} as const;

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
  const incrementClickCountBatch = useMutation(api.users.incrementClickCountBatch);
  const incrementCountryClickCountBatch = useMutation(
    api.users.incrementCountryClickCountBatch,
  );
  const [localUnseenIncrements, setLocalUnseenIncrements] = useState(0);
  const lastServerCountRef = useRef(0);
  const countryDocIdRef = useRef<Id<"countryClicks"> | null>(null);
  const pendingDbIncrementsRef = useRef(0);
  const pendingCountryIncrementsRef = useRef(0);
  const flushInFlightRef = useRef(false);
  const countryFlushInFlightRef = useRef(false);
  const flushTimerRef = useRef<number | null>(null);
  const countryFlushTimerRef = useRef<number | null>(null);

  const clickCount = userRecord?.clickCount ?? 0;
  const displayCount = clickCount + localUnseenIncrements;
  const isConvexLoading = isLoggedIn && userRecord === undefined;
  const isCountLoading =
    isInitialLoad || (isConvexLoading && displayCount === 0);

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

  useEffect(() => {
    if (!isLoggedIn) return;
    void prewarmBurnContext(sessionState).catch((error) => {
      console.warn("Failed to prewarm burn context:", error);
    });
  }, [isLoggedIn, sessionState]);

  const flushPendingDbIncrements = useCallback(async () => {
    if (!isLoggedIn || !solanaAddress || flushInFlightRef.current) return;
    const pending = pendingDbIncrementsRef.current;
    if (pending <= 0) return;

    flushInFlightRef.current = true;
    pendingDbIncrementsRef.current = 0;
    try {
      const result = await incrementClickCountBatch({
        solanaAddress,
        ...(userRecord?._id && { userId: userRecord._id }),
        incrementBy: pending,
      });
      if (result?.userId && userRecord?._id == null) {
        // keep TS happy; source of truth remains Convex query
      }
    } catch (error) {
      pendingDbIncrementsRef.current += pending;
      setLocalUnseenIncrements((current) => Math.max(0, current - pending));
      console.warn("Failed to persist batched click increments:", error);
    } finally {
      flushInFlightRef.current = false;
      if (pendingDbIncrementsRef.current > 0) {
        if (flushTimerRef.current != null) window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = window.setTimeout(() => {
          void flushPendingDbIncrements();
        }, 60);
      }
    }
  }, [incrementClickCountBatch, isLoggedIn, solanaAddress, userRecord?._id]);

  const flushPendingCountryIncrements = useCallback(async () => {
    if (!isLoggedIn || countryFlushInFlightRef.current) return;
    const country = countryRef.current ?? UNKNOWN_COUNTRY;
    const pending = pendingCountryIncrementsRef.current;
    if (pending <= 0) return;

    countryFlushInFlightRef.current = true;
    pendingCountryIncrementsRef.current = 0;
    try {
      const result = await incrementCountryClickCountBatch({
        incrementBy: pending,
        countryCode: country.countryCode,
        countryName: country.countryName,
        ...(countryDocIdRef.current && { countryDocId: countryDocIdRef.current }),
      });
      if (result?.countryDocId) {
        countryDocIdRef.current = result.countryDocId;
      }
    } catch (error) {
      pendingCountryIncrementsRef.current += pending;
      console.warn("Failed to persist batched country increments:", error);
    } finally {
      countryFlushInFlightRef.current = false;
      if (pendingCountryIncrementsRef.current > 0) {
        if (countryFlushTimerRef.current != null) {
          window.clearTimeout(countryFlushTimerRef.current);
        }
        countryFlushTimerRef.current = window.setTimeout(() => {
          void flushPendingCountryIncrements();
        }, 200);
      }
    }
  }, [incrementCountryClickCountBatch, isLoggedIn]);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current != null) return;
    flushTimerRef.current = window.setTimeout(() => {
      flushTimerRef.current = null;
      void flushPendingDbIncrements();
    }, 40);
  }, [flushPendingDbIncrements]);

  const scheduleCountryFlush = useCallback(() => {
    if (countryFlushTimerRef.current != null) return;
    countryFlushTimerRef.current = window.setTimeout(() => {
      countryFlushTimerRef.current = null;
      void flushPendingCountryIncrements();
    }, 40);
  }, [flushPendingCountryIncrements]);

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

    // Speculative UI update for instant click feedback.
    setLocalUnseenIncrements((current) => current + 1);
    emitChaseBalanceDelta(-CHASE_ONE_TOKEN_RAW, "pending");

    const burnResult = await burnOneChaseToken(sessionState);
    if (burnResult.success) {
      emitChaseBalanceDelta(-CHASE_ONE_TOKEN_RAW, "confirmed");
      pendingDbIncrementsRef.current += 1;
      pendingCountryIncrementsRef.current += 1;
      const country = countryRef.current;
      if (!country) {
        void getCountryFromIp().then((resolved) => {
          if (resolved) {
            countryRef.current = resolved;
          }
        });
      }
      // Always flush country queue quickly; if geo is unavailable we attribute to Unknown.
      scheduleCountryFlush();
      scheduleFlush();
      toast.success("1 $CHASE has been burnt.");
    } else {
      // Burn failed: rollback speculative increment.
      setLocalUnseenIncrements((current) => Math.max(0, current - 1));
      emitChaseBalanceDelta(CHASE_ONE_TOKEN_RAW, "rollback");
    }
  }, [
    isLoggedIn,
    scheduleCountryFlush,
    scheduleFlush,
    sessionState,
    solanaAddress,
  ]);

  const handleInteractionEnd = useCallback(() => {
    setIsMouthOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current != null) {
        window.clearTimeout(flushTimerRef.current);
      }
      if (countryFlushTimerRef.current != null) {
        window.clearTimeout(countryFlushTimerRef.current);
      }
    };
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
