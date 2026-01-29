"use client";

import { useSession, isEstablished } from "@fogo/sessions-sdk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";

/**
 * When a user logs in via Fogo session, ensure a Convex record exists for them.
 * If a record already exists, do nothing. If first login, create a row with clickCount 0.
 */
export function ConvexFogoSync() {
  const sessionState = useSession();
  const ensureUserRecord = useMutation(api.users.ensureUserRecord);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isEstablished(sessionState)) return;

    const solanaAddress = sessionState.walletPublicKey.toBase58();
    if (syncedRef.current === solanaAddress) return;

    syncedRef.current = solanaAddress;
    ensureUserRecord({ solanaAddress }).catch((err) => {
      console.warn("Convex ensureUserRecord failed:", err);
      syncedRef.current = null;
    });
  }, [sessionState, ensureUserRecord]);

  return null;
}
