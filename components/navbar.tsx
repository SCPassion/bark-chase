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
import { Trophy, ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const BUY_CHASE_URL =
  "https://valiant.trade/token/GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz";

const navLinkClass = (active: boolean) =>
  `text-sm md:text-base font-medium transition-colors ${
    active ? "text-chase-accent" : "text-chase-muted hover:text-chase-accent"
  }`;

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

  const [rankOpen, setRankOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const rankRef = useRef<HTMLDivElement>(null);
  const shouldFetchRank = isLoggedIn && (rankOpen || mobileMenuOpen);
  const rankData = useQuery(
    api.users.getUserRank,
    shouldFetchRank && solanaAddress ? { solanaAddress } : "skip",
  );

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close rank dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rankRef.current && !rankRef.current.contains(event.target as Node)) {
        setRankOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
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
          {/* Desktop nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            <Link href="/play" className={navLinkClass(isPlay)}>
              Play
            </Link>
            <Link href="/ranking" className={navLinkClass(isRanking)}>
              Global Ranking
            </Link>
            <a
              href={BUY_CHASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-chase-muted hover:text-chase-accent transition-colors text-sm md:text-base font-medium"
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
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isLoggedIn && (
            <div className="relative hidden md:block" ref={rankRef}>
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
                  className={`w-4 h-4 transition-transform ${
                    rankOpen ? "rotate-180" : ""
                  }`}
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
          {/* Hamburger - visible only on mobile (always show menu icon; close via panel X or overlay) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-chase-muted hover:text-chase-accent hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            <SessionButton />
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - fades in */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobileMenu}
      />

      {/* Mobile menu panel - slides in from left */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 max-w-[85vw] md:hidden bg-chase-bg border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
          <Link
            href="/"
            onClick={closeMobileMenu}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${navLinkClass(
              isHome
            )}`}
          >
            What is this?
          </Link>
          <Link
            href="/play"
            onClick={closeMobileMenu}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${navLinkClass(
              isPlay
            )}`}
          >
            Play
          </Link>
          <Link
            href="/ranking"
            onClick={closeMobileMenu}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${navLinkClass(
              isRanking
            )}`}
          >
            Global Ranking
          </Link>
          <a
            href={BUY_CHASE_URL}
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
          {isLoggedIn && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="px-4 py-2 text-xs font-semibold text-chase-muted uppercase tracking-wider">
                My Rank
              </p>
              {rankData === undefined ? (
                <div className="px-4 py-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : rankData === null ? (
                <p className="px-4 py-3 text-sm text-chase-muted">
                  No rank yet
                </p>
              ) : (
                <div className="px-4 py-3 text-sm text-chase-text space-y-1">
                  <p className="font-bold text-chase-accent">
                    #{rankData.rank} of {rankData.totalUsers}
                  </p>
                  <p className="text-chase-muted">
                    {rankData.clickCount.toLocaleString()} barks
                  </p>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
