"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { FogoSessionProvider, Network } from "@fogo/sessions-sdk-react";
import { Analytics } from "@vercel/analytics/next";
import { ConvexFogoSync } from "@/components/convex-fogo-sync";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const DEFAULT_FOGO_SESSION_DOMAIN = "https://smilechase.scptech.xyz";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <FogoSessionProvider
        network={Network.Mainnet}
        domain={
          process.env.NEXT_PUBLIC_FOGO_SESSION_DOMAIN ??
          DEFAULT_FOGO_SESSION_DOMAIN
        }
        // Keep SDK token tracking minimal to avoid noisy CHASE price polling failures
        // from the current public Fogo token-price endpoint.
        // Gameplay burn + CHASE balance logic is handled by app-side code.
        tokens={[NATIVE_MINT.toBase58()]}
        defaultRequestedLimits={{
          [NATIVE_MINT.toBase58()]: BigInt(1_500_000_000),
        }}
        enableUnlimited
      >
        <ConvexFogoSync />
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={2200}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="dark"
        />
        <Analytics />
      </FogoSessionProvider>
    </ConvexProvider>
  );
}
