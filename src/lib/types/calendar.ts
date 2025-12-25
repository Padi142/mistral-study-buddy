import type { Id } from "../../../convex/_generated/dataModel";
export type CalendarEntry = {
    _id: Id<"calendar_entries">;
    id: string; // user-facing id, but not used for mutations
    date: string;
    subject: string;
    type: "exam" | "assignment" | "lecture" | "study";
    description: string;
};