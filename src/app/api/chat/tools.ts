import { tool } from "ai";
import z from "zod";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

const getUsersCalendar = tool({
    description: "Get all entries the user has in their calendar",
    inputSchema: z.object({}),
    execute: async ({ }) => {
        console.log('Running getUsersCalendar tool')
        const entries = await fetchQuery(api.calendar_entries.get, {});
        return entries;
    }
});

const createEventInCalendar = tool({
    description: "Create a new entry in the users calendar. Returns all the entries.",
    inputSchema: z.object({
        id: z.string().describe('Unique id'),
        date: z.string().describe('Date of the entry in the format "2026-01-14T10:00"'),
        subject: z.string().describe('Name of the university subject the entry relates to'),
        type: z.string().describe('Type of the calendar entry. Allowed values: "exam" | "assignment" | "lecture" | "study"'),
        description: z.string().describe('Optional description of the entry')
    }),
    execute: async ({ id, date, subject, type, description }) => {
        console.log('Running createEventInCalendar tool')

        await fetchMutation(api.calendar_entries.createEntry, {
            id: id,
            date: date,
            subject: subject,
            type: type as "exam" | "assignment" | "lecture" | "study",
            description: description
        }
        )

        const entries = await fetchQuery(api.calendar_entries.get, {});
        return entries;
    }
});

const updateEventInCalendar = tool({
    description: "Update an existing entry in the users calendar. Returns all the entries.",
    inputSchema: z.object({
        id: z.string().describe('Unique id of the entry to update'),
        date: z.string().optional().describe('Date of the entry in the format "2026-01-14T10:00"'),
        subject: z.string().optional().describe('Name of the university subject the entry relates to'),
        type: z.string().optional().describe('Type of the calendar entry. Allowed values: "exam" | "assignment" | "lecture" | "study"'),
        description: z.string().optional().describe('Optional description of the entry')
    }),
    execute: async ({ id, date, subject, type, description }) => {
        console.log('Running updateEventInCalendar tool');

        // Update the entry in the database
        await fetchMutation(api.calendar_entries.updateEntry, {
            id: id as Id<"calendar_entries">,
            patch: {
                date,
                subject,
                type,
                description,
            },
        });

        // Return the updated list of entries
        const entries = await fetchQuery(api.calendar_entries.get, {});
        return entries;
    }
});

const deleteEventInCalendar = tool({
    description: "Delete an entry from the users calendar. Returns all the entries.",
    inputSchema: z.object({
        id: z.string().describe('Unique id of the entry to delete')
    }),
    execute: async ({ id }) => {
        console.log('Running deleteEventInCalendar tool')

        await fetchMutation(api.calendar_entries.deleteEntry, {
            id: id as Id<"calendar_entries">
        }
        )
        const entries = await fetchQuery(api.calendar_entries.get, {});
        return entries;
    }
});

export const calendarTools = {
    getUsersCalendar,
    createEventInCalendar,
    updateEventInCalendar,
    deleteEventInCalendar
};