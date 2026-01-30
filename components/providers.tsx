"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { FogoSessionProvider, Network } from "@fogo/sessions-sdk-react";
import { Analytics } from "@vercel/analytics/next";
import { ConvexFogoSync } from "@/components/convex-fogo-sync";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <FogoSessionProvider
        network={Network.Mainnet}
        domain={
          process.env.NODE_ENV === "production"
            ? undefined
            : "https://sessions-example.fogo.io"
        }
        tokens={[
          NATIVE_MINT.toBase58(),
          "fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry",
        ]}
        defaultRequestedLimits={{
          [NATIVE_MINT.toBase58()]: BigInt(1_500_000_000),
          fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry: BigInt(1_000_000_000),
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
