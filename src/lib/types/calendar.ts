export type CalendarEntry = {
    id: string;
    date: string;
    subject: string;
    type: "exam" | "assignment" | "lecture" | "study";
    description: string;
};