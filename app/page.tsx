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
  Wallet,
  MousePointer,
  BarChart3,
  BookOpen,
} from "lucide-react";

const BUY_CHASE_URL =
  "https://valiant.trade/token/GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-chase-bg">
      {/* Live on Fogo pill */}
      <div className="pt-20 md:pt-24 pb-6 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-chase-accent border-2 border-chase-accent/50 bg-chase-accent/10">
            Live on Fogo Mainnet
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-chase-text tracking-tight uppercase leading-tight mb-4">
            Click Chase.
            <br />
            Burn $CHASE.
          </h1>
          <p className="text-lg sm:text-xl text-chase-muted font-medium max-w-2xl mx-auto mb-8">
            Popcat-style deflationary fun on Fogo. Every tap burns 1 $CHASE.
            Join the pack. Wag the chart.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/play"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-chase-accent text-white font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-chase-accent focus:ring-offset-2 focus:ring-offset-chase-bg transition-opacity shadow-[0_0_20px_rgba(242,101,34,0.4)] w-full sm:w-auto"
            >
              Play Chase Dog
            </Link>
            <a
              href="#why-chase-dog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-chase-accent/50 text-chase-accent font-semibold text-lg hover:bg-chase-accent/10 transition-colors w-full sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "<1s", label: "Transactions" },
              { value: "$0", label: "Gas Fees" },
              { value: "100%", label: "On-Chain" },
              { value: "1", label: "$CHASE per click" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 px-5 py-4 text-center"
              >
                <p className="text-2xl md:text-3xl font-black text-chase-accent tabular-nums">
                  {value}
                </p>
                <p className="text-sm font-medium text-chase-muted mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Chase Dog? */}
      <section
        id="why-chase-dog"
        className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-chase-text uppercase tracking-tight text-center mb-3">
            Why Chase Dog?
          </h2>
          <p className="text-chase-muted text-center max-w-2xl mx-auto mb-10">
            Built for fun, designed for the pack. Here&apos;s what makes Chase
            special.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Zap,
                title: "Completely Gasless",
                desc: "Powered by Fogo Sessions. No native tokens required. Just connect and burn — your transaction fees are covered.",
              },
              {
                icon: Flame,
                title: "Real Burns",
                desc: "Every click sends 1 $CHASE to a burn address. Deflationary supply, real on-chain scarcity.",
              },
              {
                icon: BarChart3,
                title: "Fully On-Chain",
                desc: "Every burn is recorded on chain. Your barks and rank are verifiable and permanent.",
              },
              {
                icon: Wallet,
                title: "Session Keys",
                desc: "Sign once, bark for hours. No transaction popups interrupting your flow — pure clicker bliss.",
              },
              {
                icon: Coins,
                title: "Chase Loyalty",
                desc: "Powered by $CHASE — Fogo's OG memecoin, 100% airdropped to early adopters. No insiders, no VCs.",
              },
              {
                icon: Trophy,
                title: "Leaderboard",
                desc: "Top burners get Flames boosts, $FOGO airdrops, and whale shouts. Compete by address or country.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chase-accent/20 text-chase-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-chase-text uppercase text-sm md:text-base">
                    {title}
                  </h3>
                </div>
                <p className="text-chase-muted text-sm md:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-chase-text uppercase tracking-tight text-center mb-3">
            Burn in Minutes
          </h2>
          <p className="text-chase-muted text-center max-w-2xl mx-auto mb-10">
            No complicated setup. Connect, tap, burn.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                step: "1",
                title: "Connect Your Wallet",
                desc: "Link any Solana wallet. No signup, no email — just connect and you're ready to burn.",
              },
              {
                step: "2",
                title: "Get $CHASE",
                desc: "Grab $CHASE on ValiantTrade (Fogo's DEX). You need tokens in your wallet to play.",
              },
              {
                step: "3",
                title: "Click Chase",
                desc: "Tap the dog. Each click burns 1 $CHASE and makes Chase smile. That's it.",
              },
              {
                step: "4",
                title: "Climb the Ranks",
                desc: "Your barks count on the global leaderboard. Compete by address or by country.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-5 md:p-6 h-full">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-chase-accent text-white font-black text-lg mb-4">
                    {step}
                  </span>
                  <h3 className="font-bold text-chase-text uppercase text-sm md:text-base mb-2">
                    {title}
                  </h3>
                  <p className="text-chase-muted text-sm">{desc}</p>
                </div>
                {step !== "4" && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-chase-accent/30 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chase Dog mascot + token lore */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border-2 border-chase-accent/30 bg-gray-900/50 p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-chase-accent/40 shrink-0">
              <Image
                src="/Dog.jpg"
                alt="Chase Dog – Fogo mascot"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 192px"
                priority
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-chase-text uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 mb-3">
                <Dog className="w-6 h-6 text-chase-accent" />
                Chase Dog
              </h2>
              <p className="text-chase-muted text-sm md:text-base mb-4">
                Robert&apos;s loyal canine, the mascot of Fogo. Chase hypes the
                ecosystem with bullish calls, exclusive holder perks (e.g. early
                $OIL testnet access), and promotions like ValiantTrade pools.
              </p>
              <p className="text-chase-muted text-sm md:text-base mb-4">
                <span className="text-chase-text font-semibold">$CHASE</span> is
                a community-driven memecoin on the{" "}
                <span className="text-chase-accent font-medium">Fogo</span>{" "}
                blockchain — an SVM Layer 1 on Solana. Fully airdropped to over
                10,000 early Fogo adopters with no insiders, VCs, or team
                allocation.
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-chase-text uppercase tracking-tight mb-3">
            Ready to Burn?
          </h2>
          <p className="text-chase-muted mb-8">
            Join the pack. Connect your wallet and start burning $CHASE on Fogo.
          </p>
          <Link
            href="/play"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-chase-accent text-white font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-chase-accent focus:ring-offset-2 focus:ring-offset-chase-bg transition-opacity shadow-[0_0_20px_rgba(242,101,34,0.4)]"
          >
            Play Chase Dog Now
            <MousePointer className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Dive Deeper */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-chase-text uppercase tracking-tight text-center mb-10">
            Dive Deeper
          </h2>
          <p className="text-chase-muted text-center mb-8">
            See who&apos;s burning and how the game works.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href="/#why-chase-dog"
              className="group rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-6 md:p-8 hover:border-chase-accent/50 hover:bg-gray-900/70 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chase-accent/20 text-chase-accent group-hover:bg-chase-accent/30 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-chase-text uppercase">
                  What is $CHASE?
                </h3>
              </div>
              <p className="text-chase-muted text-sm md:text-base mb-4">
                Token lore, burn mechanic, and Fogo ecosystem. Scroll up or read
                the full intro.
              </p>
              <span className="text-chase-accent font-medium text-sm inline-flex items-center gap-1">
                Read more
                <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/ranking"
              className="group rounded-xl border-2 border-chase-accent/30 bg-gray-900/50 p-6 md:p-8 hover:border-chase-accent/50 hover:bg-gray-900/70 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chase-accent/20 text-chase-accent group-hover:bg-chase-accent/30 transition-colors">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-chase-text uppercase">
                  Global Ranking
                </h3>
              </div>
              <p className="text-chase-muted text-sm md:text-base mb-4">
                Top burners by address and by country. Real-time leaderboard
                updated every bark.
              </p>
              <span className="text-chase-accent font-medium text-sm inline-flex items-center gap-1">
                View leaderboard
                <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-8 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center text-sm text-chase-muted">
          <p className="mb-4">Built for the $CHASE pack.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={BUY_CHASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-chase-accent hover:underline inline-flex items-center gap-1.5"
            >
              <Image
                src="/valiant.jpg"
                alt="ValiantTrade"
                width={18}
                height={18}
                className="rounded object-contain shrink-0"
              />
              Buy $CHASE on ValiantTrade
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://birdeye.so/fogo/token/GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz"
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
        </div>
      </footer>
    </main>
  );
}
