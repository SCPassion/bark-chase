import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smilechase.scptech.xyz"),
  title: "Chase Dog | $CHASE Burn Game on Fogo",
  description:
    "$CHASE is a community-driven memecoin on Fogo. Burn 1 $CHASE per click — deflationary fun, no insiders, 100% airdropped. Trade on ValiantTrade, chart on Birdeye.",
  openGraph: {
    title: "Chase Dog | $CHASE Burn Game on Fogo",
    description:
      "$CHASE is a community-driven memecoin on Fogo. Burn 1 $CHASE per click — deflationary fun, no insiders, 100% airdropped.",
    type: "website",
    siteName: "Chase Dog",
    images: [{ url: "/Dog.jpg", width: 1200, height: 1200, alt: "Chase Dog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chase Dog | $CHASE Burn Game on Fogo",
    description:
      "$CHASE is a community-driven memecoin on Fogo. Burn 1 $CHASE per click.",
    images: ["/Dog.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
