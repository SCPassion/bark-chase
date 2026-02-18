"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useConnection,
  useSession,
  isEstablished,
} from "@fogo/sessions-sdk-react";
import { Trophy, ChevronDown, ExternalLink, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CHASE_DECIMALS, CHASE_MINT_PUBLIC_KEY } from "@/lib/chase-token";
import { onChaseBalanceDelta } from "@/lib/chase-balance-events";

const BUY_CHASE_URL =
  "https://valiant.trade/token/GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz";

const SessionButton = dynamic(
  () =>
    import("@fogo/sessions-sdk-react").then((mod) => ({
      default: mod.SessionButton,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-28 rounded-md bg-white/10 animate-pulse" />
    ),
  },
);

const NavbarRankSummary = dynamic(
  () =>
    import("@/components/navbar-rank-summary").then((mod) => ({
      default: mod.NavbarRankSummary,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
      </div>
    ),
  },
);

const NavbarMobilePanel = dynamic(
  () =>
    import("@/components/navbar-mobile-panel").then((mod) => ({
      default: mod.NavbarMobilePanel,
    })),
  { ssr: false },
);

const navLinkClass = (active: boolean) =>
  `text-sm md:text-base font-medium transition-colors ${
    active ? "text-chase-accent" : "text-chase-muted hover:text-chase-accent"
  }`;

export function Navbar() {
  const pathname = usePathname();
  const connection = useConnection();
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
  const [chaseBalanceRaw, setChaseBalanceRaw] = useState<bigint>(BigInt(0));
  const [optimisticDeltaRaw, setOptimisticDeltaRaw] = useState<bigint>(
    BigInt(0),
  );
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isBalanceUpdating, setIsBalanceUpdating] = useState(false);
  const [pendingConfirmations, setPendingConfirmations] = useState(0);
  const rankRef = useRef<HTMLDivElement>(null);
  const balanceUpdateTimerRef = useRef<number | null>(null);

  const triggerBalanceUpdateEffect = () => {
    setIsBalanceUpdating(true);
    if (balanceUpdateTimerRef.current != null) {
      window.clearTimeout(balanceUpdateTimerRef.current);
    }
    balanceUpdateTimerRef.current = window.setTimeout(() => {
      setIsBalanceUpdating(false);
      balanceUpdateTimerRef.current = null;
    }, 220);
  };

  const formatBalance = (rawAmount: bigint) => {
    const divisor = BigInt(10 ** CHASE_DECIMALS);
    const whole = rawAmount / divisor;
    const fractional = rawAmount % divisor;
    const fractionalStr = fractional
      .toString()
      .padStart(CHASE_DECIMALS, "0")
      .slice(0, 2);
    return `${whole.toString()}.${fractionalStr}`;
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setChaseBalanceRaw(BigInt(0));
      setOptimisticDeltaRaw(BigInt(0));
      setPendingConfirmations(0);
      setIsBalanceLoading(false);
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      if (!isEstablished(sessionState)) return;
      setIsBalanceLoading(true);
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          sessionState.walletPublicKey,
          { mint: CHASE_MINT_PUBLIC_KEY },
          "confirmed",
        );
        const totalRaw = tokenAccounts.value.reduce((sum, account) => {
          const amount =
            account.account.data.parsed.info.tokenAmount.amount ?? "0";
          return sum + BigInt(amount);
        }, BigInt(0));
        if (!cancelled) {
          setChaseBalanceRaw(totalRaw);
          setOptimisticDeltaRaw(BigInt(0));
          triggerBalanceUpdateEffect();
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Failed to fetch CHASE balance:", error);
        }
      } finally {
        if (!cancelled) setIsBalanceLoading(false);
      }
    };

    void refresh();
    const intervalId = setInterval(() => {
      void refresh();
    }, 12_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [connection, isLoggedIn, sessionState]);

  useEffect(() => {
    const unsubscribe = onChaseBalanceDelta((deltaRaw, phase) => {
      if (phase === "pending") {
        setOptimisticDeltaRaw((current) => current + deltaRaw);
        setPendingConfirmations((current) => current + 1);
      } else if (phase === "rollback") {
        setOptimisticDeltaRaw((current) => current + deltaRaw);
        setPendingConfirmations((current) => Math.max(0, current - 1));
      } else if (phase === "confirmed") {
        setChaseBalanceRaw((current) => current + deltaRaw);
        setOptimisticDeltaRaw((current) => current - deltaRaw);
        setPendingConfirmations((current) => Math.max(0, current - 1));
      }
      triggerBalanceUpdateEffect();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    return () => {
      if (balanceUpdateTimerRef.current != null) {
        window.clearTimeout(balanceUpdateTimerRef.current);
      }
    };
  }, []);

  const displayBalanceRaw = (() => {
    const value = chaseBalanceRaw + optimisticDeltaRaw;
    return value < BigInt(0) ? BigInt(0) : value;
  })();
  const chaseBalanceUi = formatBalance(displayBalanceRaw);
  const amountIsTransitioning = pendingConfirmations > 0;

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
            <div className="hidden md:flex h-10 items-center rounded-xl border border-white/10 bg-black/30 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="mr-1.5 text-sm font-medium text-chase-muted">
                $CHASE
              </span>
              <span
                className={`text-2xl font-black leading-none tabular-nums text-chase-accent transition-all duration-200 ${
                  amountIsTransitioning
                    ? "blur-[1px] opacity-80"
                    : "blur-0 opacity-100"
                }`}
              >
                {chaseBalanceUi}
              </span>
            </div>
          )}
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
                  {solanaAddress ? (
                    <NavbarRankSummary solanaAddress={solanaAddress} />
                  ) : (
                    <p className="text-sm text-white/70">No rank yet</p>
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
      {mobileMenuOpen && (
        <NavbarMobilePanel
          closeMobileMenu={closeMobileMenu}
          isHome={isHome}
          isPlay={isPlay}
          isRanking={isRanking}
          isLoggedIn={isLoggedIn}
          solanaAddress={solanaAddress}
          buyChaseUrl={BUY_CHASE_URL}
          chaseBalanceUi={chaseBalanceUi}
          isBalanceLoading={amountIsTransitioning}
        />
      )}
    </>
  );
}
