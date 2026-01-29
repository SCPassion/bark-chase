import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chaseUsers: defineTable({
    solanaAddress: v.string(),
    clickCount: v.number(),
  }).index("by_solana_address", ["solanaAddress"]),
});
