"use client";

import { useState, useEffect, useRef } from "react";
import {
  Message,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "~/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { UIMessage } from "ai";

// Helper to extract text content from UIMessage parts
function getMessageContent(message: {
  parts?: Array<{ type: string; text?: string }>;
}): string {
  if (!message.parts || !Array.isArray(message.parts)) {
    return "";
  }
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const prevStatusRef = useRef<string | null>(null);

  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  const clearHistory = async () => {};

  const error = null; // Replace with actual error state if needed

  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <div className="mx-auto flex h-[600px] w-full max-w-2xl flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
      <Conversation className="flex-1">
        <ConversationContent className="space-y-4">
          {messageList.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No messages yet. Start a conversation!
            </div>
          )}
          {messageList.map((message, i) => {
            const content = getMessageContent(message);
            const from = message.role === "user" ? "user" : "assistant";

            return (
              <Message from={from} key={message.id ?? i}>
                <MessageContent>
                  {from === "assistant" ? (
                    <div>
                      <p className="font-bold">🤖 Study buddy</p>
                      <MessageResponse>{content}</MessageResponse>
                    </div>
                  ) : (
                    content
                  )}
                </MessageContent>
                {from === "assistant" && <MessageActions></MessageActions>}
              </Message>
            );
          })}

          {isLoading && (
            <div className="text-gray-500 italic">AI is typing...</div>
          )}
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              Error: {error}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 p-4"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isLoading || !input}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </Button>
        <Button
          type="button"
          onClick={clearHistory}
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
        >
          Clear
        </Button>
      </form>
    </div>
  );
}
