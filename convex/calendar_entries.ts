import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const entries = await ctx.db.query("calendar_entries").withIndex("by_date")
            .order("asc").collect();
        return entries;
    },
});

export const getById = query({
    args: { id: v.id("calendar_entries") },
    handler: async (ctx, args) => {
        const entry = await ctx.db.get(args.id);
        return entry;
    },
});

export const deleteEntry = mutation({
    args: { id: v.id("calendar_entries") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});


export const updateEntry = mutation({
    args: {
        id: v.id("calendar_entries"),
        patch: v.object({
            date: v.optional(v.string()),
            description: v.optional(v.string()),
            id: v.optional(v.string()),
            subject: v.optional(v.string()),
            type: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const { id, patch } = args;
        await ctx.db.patch(id, patch);
    },
});

export const createEntry = mutation({
    args: {
        date: v.string(),
        description: v.string(),
        id: v.string(),
        subject: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        // Insert a new document into the "calendar_entries" table
        const newId = await ctx.db.insert("calendar_entries", args);
        return newId;
    },
});