"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ExternalLink, X } from "lucide-react";

const SessionButton = dynamic(
  () =>
    import("@fogo/sessions-sdk-react").then((mod) => ({
      default: mod.SessionButton,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-full rounded-md bg-white/10 animate-pulse" />
    ),
  },
);

const NavbarRankSummary = dynamic(
  () =>
    import("@/components/navbar-rank-summary").then((mod) => ({
      default: mod.NavbarRankSummary,
    })),
  { ssr: false },
);

interface NavbarMobilePanelProps {
  closeMobileMenu: () => void;
  isHome: boolean;
  isPlay: boolean;
  isRanking: boolean;
  isLoggedIn: boolean;
  solanaAddress: string | null;
  buyChaseUrl: string;
  chaseBalanceUi: string;
  totalBurnedUi: string;
  isBalanceLoading: boolean;
}

const navLinkClass = (active: boolean) =>
  `px-4 py-3 rounded-lg font-medium transition-colors ${
    active ? "text-chase-accent" : "text-chase-muted hover:text-chase-accent"
  }`;

export function NavbarMobilePanel({
  closeMobileMenu,
  isHome,
  isPlay,
  isRanking,
  isLoggedIn,
  solanaAddress,
  buyChaseUrl,
  chaseBalanceUi,
  totalBurnedUi,
  isBalanceLoading,
}: NavbarMobilePanelProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-sm"
        aria-hidden={false}
        onClick={closeMobileMenu}
      />

      <div className="fixed top-0 left-0 bottom-0 z-40 w-72 max-w-[85vw] md:hidden bg-chase-bg border-r border-white/10 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 shrink-0">
          <span className="font-bold text-chase-text uppercase tracking-tight">
            Menu
          </span>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-2 rounded-lg text-chase-muted hover:text-chase-accent hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
          <div className="pb-4 mb-4 border-b border-white/10">
            <SessionButton />
          </div>
          <div className="mx-2 mb-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-chase-muted">
                Burned
              </span>
              <div className="flex items-end gap-1.5">
                <span className="text-lg font-black leading-none tabular-nums text-chase-accent">
                  {totalBurnedUi}
                </span>
                <span className="text-xs font-medium text-chase-muted">
                  $CHASE
                </span>
              </div>
            </div>
            {isLoggedIn && (
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-sm font-medium text-chase-muted">$CHASE</span>
                <span
                  className={`text-2xl font-black leading-none tabular-nums text-chase-accent transition-all duration-200 ${
                    isBalanceLoading ? "blur-[1px] opacity-80" : "blur-0 opacity-100"
                  }`}
                >
                  {chaseBalanceUi}
                </span>
              </div>
            )}
          </div>
          <Link href="/" onClick={closeMobileMenu} className={navLinkClass(isHome)}>
            What is this?
          </Link>
          <Link
            href="/play"
            onClick={closeMobileMenu}
            className={navLinkClass(isPlay)}
          >
            Play
          </Link>
          <Link
            href="/ranking"
            onClick={closeMobileMenu}
            className={navLinkClass(isRanking)}
          >
            Global Ranking
          </Link>
          <a
            href={buyChaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-chase-muted hover:text-chase-accent hover:bg-white/5 transition-colors"
          >
            <Image
              src="/valiant.jpg"
              alt="ValiantTrade"
              width={20}
              height={20}
              className="rounded object-contain shrink-0"
            />
            Buy $CHASE on Valiant
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {isLoggedIn && solanaAddress && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="px-4 py-2 text-xs font-semibold text-chase-muted uppercase tracking-wider">
                My Rank
              </p>
              <NavbarRankSummary solanaAddress={solanaAddress} mobile />
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
