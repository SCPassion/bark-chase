"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Zap,
  Trophy,
  ExternalLink,
  Dog,
  Coins,
  Quote,
} from "lucide-react";

export default function IntroPage() {
  return (
    <main className="min-h-screen bg-chase-bg pt-20 md:pt-24 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-chase-text tracking-tight uppercase mb-3">
            What is Chase Dog?
          </h1>
          <p className="text-lg sm:text-xl text-chase-muted font-medium">
            Burn $CHASE. Join the pack. Wag the chart.
          </p>
        </div>

        {/* Chase Dog mascot + intro */}
        <section className="rounded-2xl border-2 border-chase-accent/30 bg-gray-900/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-chase-accent/40 shrink-0">
              <Image
                src="/Dog.jpg"
                alt="Chase Dog – Fogo mascot"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, 160px"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-chase-text uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <Dog className="w-6 h-6 text-chase-accent" />
                Chase Dog
              </h2>
              <p className="text-chase-muted mt-2 text-sm md:text-base">
                Robert&apos;s loyal canine, the mascot of Fogo. Chase hypes the
                ecosystem with bullish calls, exclusive holder perks (e.g. early
                $OIL testnet access), and promotions like ValiantTrade pools.
              </p>
            </div>
          </div>
          <p className="text-chase-muted text-sm md:text-base">
            <span className="text-chase-text font-semibold">
              $CHASE (Chase Dog)
            </span>{" "}
            is a community-driven memecoin on the{" "}
            <span className="text-chase-accent font-medium">Fogo</span>{" "}
            blockchain — an SVM Layer 1 on Solana. It was fully airdropped to
            over 10,000 early Fogo adopters with no insiders, VCs, or team
            allocation. It rewards ongoing engagement (e.g. $USDC holders
            farming more $CHASE via Flames), positioning it as Fogo&apos;s
            flagship fun token.
          </p>
        </section>

        {/* Burn mechanic */}
        <section className="rounded-2xl border-2 border-chase-accent/30 bg-gray-900/50 p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-chase-text uppercase tracking-tight flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-chase-accent" />
            Burn mechanic
          </h2>
          <p className="text-chase-muted text-sm md:text-base mb-4">
            This site is a Popcat-style clicker: every time you tap Chase, you{" "}
            <strong className="text-chase-accent">burn 1 $CHASE</strong> from
            your wallet. That reduces circulating supply, makes $CHASE
            deflationary, and keeps the vibes high. Robert&apos;s loyal doggo
            approves. No mercy for weak hands.
          </p>
          <blockquote className="border-l-4 border-chase-accent pl-4 py-2 text-chase-muted italic flex items-start gap-2">
            <Quote className="w-5 h-5 text-chase-accent shrink-0 mt-0.5" />
            <span>
              &quot;No need to understand. You just need to believe.&quot; —{" "}
              <a
                href="https://x.com/ChaseFogo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chase-accent hover:underline"
              >
                @ChaseFogo
              </a>
            </span>
          </blockquote>
        </section>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-chase-accent" />
              <h3 className="font-bold text-chase-text uppercase text-sm">
                Chase loyalty
              </h3>
            </div>
            <p className="text-chase-muted text-sm">
              Powered by $CHASE — Fogo&apos;s OG memecoin, 100% airdropped to
              early adopters.
            </p>
          </div>
          <div className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-chase-accent" />
              <h3 className="font-bold text-chase-text uppercase text-sm">
                Instant burns
              </h3>
            </div>
            <p className="text-chase-muted text-sm">
              Fogo&apos;s lightning-fast SVM — burns confirm in milliseconds.
              Low fees, max chaos.
            </p>
          </div>
          <div className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-chase-accent" />
              <h3 className="font-bold text-chase-text uppercase text-sm">
                Leaderboard
              </h3>
            </div>
            <p className="text-chase-muted text-sm">
              Top burners get Flames boosts, $FOGO airdrops, and whale shouts.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-chase-accent text-white font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-chase-accent focus:ring-offset-2 focus:ring-offset-chase-bg transition-opacity shadow-[0_0_20px_rgba(242,101,34,0.4)]"
          >
            Connect wallet & start burning
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer links */}
        <footer className="text-center text-sm text-chase-muted border-t border-white/10 pt-8">
          <p className="mb-3">Built for the $CHASE pack.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://valiant.trade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chase-accent hover:underline inline-flex items-center gap-1"
            >
              Trade on ValiantTrade
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://birdeye.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chase-accent hover:underline inline-flex items-center gap-1"
            >
              Charts (Birdeye)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://x.com/ChaseFogo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chase-accent hover:underline inline-flex items-center gap-1"
            >
              @ChaseFogo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
