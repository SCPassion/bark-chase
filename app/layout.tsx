import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { NATIVE_MINT } from "@solana/spl-token";
import {
  FogoSessionProvider,
  SessionButton,
  Network,
} from "@fogo/sessions-sdk-react";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chase Dog - Click to Bark!",
  description: "A fun PopCat-style clicker game featuring Chase Dog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
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
          <SessionButton />
          {children}
          <Analytics />
        </FogoSessionProvider>
      </body>
    </html>
  );
}
