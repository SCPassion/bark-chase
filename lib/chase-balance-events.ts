const CHASE_BALANCE_DELTA_EVENT = "chase:balance-delta";

interface ChaseBalanceDeltaDetail {
  deltaRaw: string;
  phase: "pending" | "rollback" | "confirmed";
}

export function emitChaseBalanceDelta(
  deltaRaw: bigint,
  phase: "pending" | "rollback" | "confirmed",
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ChaseBalanceDeltaDetail>(CHASE_BALANCE_DELTA_EVENT, {
      detail: { deltaRaw: deltaRaw.toString(), phase },
    }),
  );
}

export function onChaseBalanceDelta(
  callback: (
    deltaRaw: bigint,
    phase: "pending" | "rollback" | "confirmed",
  ) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const custom = event as CustomEvent<ChaseBalanceDeltaDetail>;
    const raw = custom.detail?.deltaRaw;
    const phase = custom.detail?.phase;
    if (!raw || !phase) return;
    try {
      callback(BigInt(raw), phase);
    } catch {
      // ignore invalid payloads
    }
  };

  window.addEventListener(CHASE_BALANCE_DELTA_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener(
      CHASE_BALANCE_DELTA_EVENT,
      handler as EventListener,
    );
  };
}
