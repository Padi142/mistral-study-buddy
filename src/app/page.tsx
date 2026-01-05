"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";
import { ChatInterface } from "../components/chat-interface";
import { CalendarEvents } from "~/components/calendar-events";
import { AgentInfo } from "~/components/agent-info";
import { GithubLink } from "~/components/github-link";
import { Button } from "~/components/ui/button";

const quick_messages = [
  "Schedule an exam in 2 weeks",
  "When is my next exam?",
  "Add a study session tomorrow at 3 PM",
  "Whats on my calendar next week?",
];

export default function HomePage() {
  const setInputRef = useRef<Dispatch<SetStateAction<string>> | null>(null);

  const handleInputChange = (setter: Dispatch<SetStateAction<string>>) => {
    setInputRef.current = setter;
  };

  const handleQuickMessage = (message: string) => {
    if (setInputRef.current) {
      setInputRef.current(message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Study Buddy Agent
      </h1>
      <div className="flex w-full max-w-6xl items-start gap-6">
        <div className="flex-1">
          <ChatInterface onInputChange={handleInputChange} />
          <div className="mt-6 rounded-xl border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-md">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Quick Messages
            </h2>
            <div className="flex flex-wrap gap-2">
              {quick_messages.map((message, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickMessage(message)}
                  variant="outline"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-100"
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
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
