"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavbarRankSummaryProps {
  solanaAddress: string;
  mobile?: boolean;
}

export function NavbarRankSummary({
  solanaAddress,
  mobile = false,
}: NavbarRankSummaryProps) {
  const rankData = useQuery(api.users.getUserRank, { solanaAddress });

  if (rankData === undefined) {
    return (
      <div className={mobile ? "space-y-2 px-4 py-3" : "space-y-2"}>
        <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (rankData === null) {
    return (
      <p className={mobile ? "px-4 py-3 text-sm text-chase-muted" : "text-sm text-white/70"}>
        No rank yet
      </p>
    );
  }

  return (
    <div
      className={
        mobile ? "px-4 py-3 text-sm text-chase-text space-y-1" : "text-sm text-white space-y-1"
      }
    >
      <p className="font-bold text-chase-accent">
        #{rankData.rank} of {rankData.totalUsers}
      </p>
      <p className={mobile ? "text-chase-muted" : "text-white/80"}>
        {rankData.clickCount.toLocaleString()} barks
      </p>
    </div>
  );
}
