"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 100;

function truncateAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function RankingPage() {
  const [page, setPage] = useState(1);
  const result = useQuery(api.users.getLeaderboardPage, { page });

  const totalPages = result
    ? Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE))
    : 1;
  const startRank = (page - 1) * PAGE_SIZE + 1;
  const endRank = Math.min(page * PAGE_SIZE, result?.totalCount ?? 0);

  return (
    <main className="min-h-screen bg-chase-bg pt-20 md:pt-24 pb-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
          <Trophy className="w-8 h-8 text-chase-accent" />
          <h1 className="text-3xl md:text-4xl font-black text-chase-text tracking-tight uppercase">
            Global Ranking
          </h1>
        </div>

        <p className="text-center text-chase-muted text-sm md:text-base mb-6">
          Total barks ranked by user's svm address.
        </p>

        {result === undefined ? (
          <div className="rounded-lg overflow-hidden border-2 border-chase-accent/30 bg-gray-900/50">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-white/10 bg-chase-accent/10">
                    <th className="py-3 px-4 text-center w-24">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </th>
                    <th className="py-3 px-4 text-center">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </th>
                    <th className="py-3 px-4 text-center w-28">
                      <Skeleton className="h-4 w-14 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 px-4 text-center">
                        <Skeleton className="h-4 w-10 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : result.entries.length === 0 ? (
          <div className="rounded-lg bg-gray-900/50 border-2 border-chase-accent/30 p-8 text-center text-chase-muted">
            No rankings yet.{" "}
            <Link href="/" className="text-chase-accent hover:underline">
              Play Chase Dog
            </Link>{" "}
            to get on the board!
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-hidden border-2 border-chase-accent/30 bg-gray-900/50">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-white/10 bg-chase-accent/10">
                      <th className="py-3 px-4 text-center text-xs font-semibold text-chase-muted uppercase tracking-wider w-24">
                        Rank
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-chase-muted uppercase tracking-wider">
                        Address
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-chase-muted uppercase tracking-wider w-28">
                        Barks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.entries.map((row) => (
                      <tr
                        key={row.solanaAddress}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-chase-accent tabular-nums">
                          #{row.rank}
                        </td>
                        <td className="py-3 px-4 text-center text-chase-text font-mono text-sm">
                          {truncateAddress(row.solanaAddress)}
                        </td>
                        <td className="py-3 px-4 text-center text-chase-text tabular-nums font-medium">
                          {row.clickCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <p className="text-sm text-chase-muted text-center">
                Showing {startRank}–{endRank} of{" "}
                {result.totalCount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border-2 border-chase-accent/30 text-chase-text hover:bg-chase-accent/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-chase-text min-w-[120px] text-center">
                  {startRank}–{endRank}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border-2 border-chase-accent/30 text-chase-text hover:bg-chase-accent/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {totalPages > 1 && totalPages <= 15 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-w-12 py-1.5 px-2 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-chase-accent text-white"
                          : "border border-chase-accent/30 text-chase-text hover:bg-chase-accent/10"
                      }`}
                    >
                      {(p - 1) * PAGE_SIZE + 1}–
                      {Math.min(p * PAGE_SIZE, result.totalCount)}
                    </button>
                  ),
                )}
              </div>
            )}
            {totalPages > 15 && (
              <p className="text-center text-sm text-chase-muted mt-4">
                Page {page} of {totalPages}
              </p>
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-chase-accent font-medium hover:underline"
          >
            ← Back to Chase Dog
          </Link>
        </div>
      </div>
    </main>
  );
}
