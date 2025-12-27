import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    calendar_entries: defineTable({
        date: v.string(),
        description: v.string(),
        id: v.string(),
        subject: v.string(),
        type: v.string(),
    }).index("by_date", ["date"]),
});