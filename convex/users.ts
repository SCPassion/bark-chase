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
      .withIndex("by_solana_address", (q) => q.eq("solanaAddress", solanaAddress))
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
 */
export const incrementClickCount = mutation({
  args: { solanaAddress: v.string() },
  handler: async (ctx, { solanaAddress }) => {
    const user = await ctx.db
      .query("chaseUsers")
      .withIndex("by_solana_address", (q) => q.eq("solanaAddress", solanaAddress))
      .first();

    if (!user) return null;

    await ctx.db.patch(user._id, {
      clickCount: user.clickCount + 1,
    });
    return user._id;
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
      .withIndex("by_solana_address", (q) => q.eq("solanaAddress", solanaAddress))
      .first();
  },
});
