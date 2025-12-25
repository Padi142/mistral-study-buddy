"use client";

import { ChatInterface } from "../components/chat-interface";
import { CalendarEvents } from "~/components/calendar-events";
import { AgentInfo } from "~/components/agent-info";
import { GithubLink } from "~/components/github-link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Study Buddy Agent
      </h1>
      <div className="flex w-full max-w-6xl items-start gap-6">
        <div className="flex-1">
          <ChatInterface />
        </div>
        <aside className="w-80 shrink-0">
          <CalendarEvents />
        </aside>
      </div>
      <div className="mt-8 w-full max-w-6xl">
        <AgentInfo />
      </div>
      <div className="mt-8">
        <GithubLink />
      </div>
    </main>
  );
}
