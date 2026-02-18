import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Ensure a user record exists for the given Solana address (Fogo session login).
 * If a record already exists, do nothing. If first login, create a row with clickCount 0.
 */
export const ensureUserRecord = mutation({
  args: { solanaAddress: v.string() },
  handler: async (ctx, { solanaAddress }) => {
    const existing = await ctx.db
      .query("chaseUsers")
      .withIndex("by_solana_address", (q) =>
        q.eq("solanaAddress", solanaAddress),
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("chaseUsers", {
      solanaAddress,
      clickCount: 0,
    });
  },
});

/**
 * Increment click count for the user (call after a successful "burn" of 1 $CHASE).
 * Pass country from current IP at click time so each click is attributed to where the user is now.
 * Hong Kong today → 10 clicks to HK; Vienna tomorrow → 5 clicks to Austria; no retroactive change.
 */
export const incrementClickCount = mutation({
  args: {
    solanaAddress: v.string(),
    userId: v.optional(v.id("chaseUsers")),
    countryCode: v.optional(v.string()),
    countryName: v.optional(v.string()),
    countryDocId: v.optional(v.id("countryClicks")),
  },
  handler: async (
    ctx,
    { solanaAddress, userId, countryCode, countryName, countryDocId },
  ) => {
    const user = userId
      ? await ctx.db.get(userId)
      : await ctx.db
          .query("chaseUsers")
          .withIndex("by_solana_address", (q) =>
            q.eq("solanaAddress", solanaAddress),
          )
          .first();

    if (!user) return null;

    await ctx.db.patch(user._id, {
      clickCount: user.clickCount + 1,
    });

    let resolvedCountryDocId = countryDocId ?? null;
    if (countryCode != null && countryCode !== "") {
      const country = countryDocId
        ? await ctx.db.get(countryDocId)
        : await ctx.db
            .query("countryClicks")
            .withIndex("by_country_code", (q) => q.eq("countryCode", countryCode))
            .first();
      if (!country) {
        resolvedCountryDocId = await ctx.db.insert("countryClicks", {
          countryCode,
          countryName: countryName ?? countryCode,
          clickCount: 1,
        });
      } else {
        resolvedCountryDocId = country._id;
        await ctx.db.patch(country._id, {
          clickCount: country.clickCount + 1,
          ...(countryName != null && { countryName }),
        });
      }
    }

    return {
      userId: user._id,
      countryDocId: resolvedCountryDocId,
    };
  },
});

/**
 * Fast path for high-frequency clickers: apply multiple confirmed burns in one DB write.
 */
export const incrementClickCountBatch = mutation({
  args: {
    solanaAddress: v.string(),
    userId: v.optional(v.id("chaseUsers")),
    incrementBy: v.number(),
    countryCode: v.optional(v.string()),
    countryName: v.optional(v.string()),
    countryDocId: v.optional(v.id("countryClicks")),
  },
  handler: async (
    ctx,
    { solanaAddress, userId, incrementBy, countryCode, countryName, countryDocId },
  ) => {
    if (incrementBy <= 0) return null;

    const user = userId
      ? await ctx.db.get(userId)
      : await ctx.db
          .query("chaseUsers")
          .withIndex("by_solana_address", (q) =>
            q.eq("solanaAddress", solanaAddress),
          )
          .first();

    if (!user) return null;

    await ctx.db.patch(user._id, {
      clickCount: user.clickCount + incrementBy,
    });

    let resolvedCountryDocId = countryDocId ?? null;
    if (countryCode != null && countryCode !== "") {
      const country = countryDocId
        ? await ctx.db.get(countryDocId)
        : await ctx.db
            .query("countryClicks")
            .withIndex("by_country_code", (q) => q.eq("countryCode", countryCode))
            .first();
      if (!country) {
        resolvedCountryDocId = await ctx.db.insert("countryClicks", {
          countryCode,
          countryName: countryName ?? countryCode,
          clickCount: incrementBy,
        });
      } else {
        resolvedCountryDocId = country._id;
        await ctx.db.patch(country._id, {
          clickCount: country.clickCount + incrementBy,
          ...(countryName != null && { countryName }),
        });
      }
    }

    return {
      userId: user._id,
      countryDocId: resolvedCountryDocId,
    };
  },
});

/**
 * Get user record by Solana address (for reading click count).
 */
export const getBySolanaAddress = query({
  args: { solanaAddress: v.string() },
  handler: async (ctx, { solanaAddress }) => {
    return await ctx.db
      .query("chaseUsers")
      .withIndex("by_solana_address", (q) =>
        q.eq("solanaAddress", solanaAddress),
      )
      .first();
  },
});

/**
 * Get the current user's rank by click count (1 = highest). Returns null if user not found.
 */
export const getUserRank = query({
  args: { solanaAddress: v.string() },
  handler: async (ctx, { solanaAddress }) => {
    const all = await ctx.db.query("chaseUsers").collect();
    all.sort((a, b) => b.clickCount - a.clickCount);
    const index = all.findIndex((u) => u.solanaAddress === solanaAddress);
    if (index === -1) return null;
    const user = all[index];
    return {
      rank: index + 1,
      totalUsers: all.length,
      clickCount: user.clickCount,
    };
  },
});

const PAGE_SIZE = 100;

/**
 * Get one page of the global leaderboard (1-100, 101-200, etc.). Page is 1-based.
 */
export const getLeaderboardPage = query({
  args: { page: v.number() },
  handler: async (ctx, { page }) => {
    const all = await ctx.db.query("chaseUsers").collect();
    all.sort((a, b) => b.clickCount - a.clickCount);
    const totalCount = all.length;
    const start = (page - 1) * PAGE_SIZE;
    const slice = all.slice(start, start + PAGE_SIZE);
    const entries = slice.map((u, i) => ({
      rank: start + i + 1,
      solanaAddress: u.solanaAddress,
      clickCount: u.clickCount,
    }));
    return { entries, totalCount, page, pageSize: PAGE_SIZE };
  },
});

/**
 * Get one page of the country leaderboard (1-100, 101-200, etc.). Page is 1-based.
 */
export const getCountryLeaderboardPage = query({
  args: { page: v.number() },
  handler: async (ctx, { page }) => {
    const all = await ctx.db.query("countryClicks").collect();
    all.sort((a, b) => b.clickCount - a.clickCount);
    const totalCount = all.length;
    const start = (page - 1) * PAGE_SIZE;
    const slice = all.slice(start, start + PAGE_SIZE);
    const entries = slice.map((c, i) => ({
      rank: start + i + 1,
      countryCode: c.countryCode,
      countryName: c.countryName,
      clickCount: c.clickCount,
    }));
    return { entries, totalCount, page, pageSize: PAGE_SIZE };
  },
});
