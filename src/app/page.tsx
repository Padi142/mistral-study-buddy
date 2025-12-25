"use client";

import { ChatInterface } from "../components/chat-interface";
import { CalendarEvents } from "~/components/calendar-events";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-bold">Study Buddy Agent</h1>

        <CalendarEvents />

        <ChatInterface />
      </div>
    </main>
  );
}
