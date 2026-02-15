"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { FogoSessionProvider, Network } from "@fogo/sessions-sdk-react";
import { Analytics } from "@vercel/analytics/next";
import { ConvexFogoSync } from "@/components/convex-fogo-sync";
import { CHASE_MINT } from "@/lib/chase-token";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const FUSD_MINT = "fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <FogoSessionProvider
        network={Network.Mainnet}
        domain={
          process.env.NODE_ENV === "production"
            ? "https://barkchase.scptech.xyz" // This is the domain of the actual website
            : "https://sessions-example.fogo.io"
        }
        tokens={[
          NATIVE_MINT.toBase58(),
          FUSD_MINT,
          CHASE_MINT,
        ]}
        defaultRequestedLimits={{
          [NATIVE_MINT.toBase58()]: BigInt(1_500_000_000),
          [FUSD_MINT]: BigInt(1_000_000_000),
          [CHASE_MINT]: BigInt(10_000_000_000),
        }}
        enableUnlimited
      >
        <ConvexFogoSync />
        {children}
        <Analytics />
      </FogoSessionProvider>
    </ConvexProvider>
  );
}
