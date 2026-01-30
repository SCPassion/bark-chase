import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chaseUsers: defineTable({
    solanaAddress: v.string(),
    clickCount: v.number(),
  }).index("by_solana_address", ["solanaAddress"]),
  countryClicks: defineTable({
    countryCode: v.string(),
    countryName: v.string(),
    clickCount: v.number(),
  }).index("by_country_code", ["countryCode"]),
});
