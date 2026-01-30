"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useSession,
  isEstablished,
  SessionButton,
} from "@fogo/sessions-sdk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trophy, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const BUY_CHASE_URL =
  "https://valiant.trade/token/GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz";

export function Navbar() {
  const pathname = usePathname();
  const sessionState = useSession();
  const isLoggedIn = isEstablished(sessionState);
  const isHome = pathname === "/";
  const isPlay = pathname === "/play";
  const isRanking = pathname === "/ranking";
  const solanaAddress = isLoggedIn
    ? sessionState.walletPublicKey.toBase58()
    : null;

  const rankData = useQuery(
    api.users.getUserRank,
    solanaAddress ? { solanaAddress } : "skip",
  );
  const [rankOpen, setRankOpen] = useState(false);
  const rankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rankRef.current && !rankRef.current.contains(event.target as Node)) {
        setRankOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 md:px-6 bg-chase-bg/95 backdrop-blur border-b border-white/10">
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className={`text-lg md:text-xl font-bold tracking-tight uppercase transition-colors ${
            isHome
              ? "text-chase-accent"
              : "text-chase-text hover:text-chase-accent"
          }`}
        >
          Chase Dog
        </Link>
        <Link
          href="/play"
          className={`text-sm md:text-base font-medium transition-colors ${
            isPlay
              ? "text-chase-accent"
              : "text-chase-muted hover:text-chase-accent"
          }`}
        >
          Play
        </Link>
        <Link
          href="/ranking"
          className={`text-sm md:text-base font-medium transition-colors ${
            isRanking
              ? "text-chase-accent"
              : "text-chase-muted hover:text-chase-accent"
          }`}
        >
          Global Ranking
        </Link>
        <a
          href={BUY_CHASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-base font-medium text-chase-muted hover:text-chase-accent transition-colors inline-flex items-center gap-1.5"
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
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {isLoggedIn && (
          <div className="relative" ref={rankRef}>
            <button
              type="button"
              onClick={() => setRankOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-chase-muted hover:text-chase-accent hover:bg-white/5 transition-colors"
              aria-expanded={rankOpen}
              aria-haspopup="true"
            >
              <Trophy className="w-4 h-4" />
              <span>My Rank</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${rankOpen ? "rotate-180" : ""}`}
              />
            </button>
            {rankOpen && (
              <div className="absolute right-0 top-full mt-1 py-3 px-4 min-w-[200px] rounded-lg bg-gray-900 border-2 border-chase-accent shadow-2xl">
                {rankData === undefined ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : rankData === null ? (
                  <p className="text-sm text-white/70">No rank yet</p>
                ) : (
                  <div className="text-sm text-white space-y-1">
                    <p className="font-bold text-chase-accent">
                      #{rankData.rank} of {rankData.totalUsers}
                    </p>
                    <p className="text-white/80">
                      {rankData.clickCount.toLocaleString()} barks
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <SessionButton />
      </div>
    </nav>
  );
}
