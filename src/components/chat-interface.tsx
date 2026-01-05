"use client";

import {
  useState,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
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

interface ChatInterfaceProps {
  onInputChange?: (setter: Dispatch<SetStateAction<string>>) => void;
}

export function ChatInterface({ onInputChange }: ChatInterfaceProps = {}) {
  const [input, setInput] = useState("");
  const prevStatusRef = useRef<string | null>(null);

  const { messages, sendMessage, setMessages, status, error } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  let errorMsg = status === "error" ? "Failed to fetch response" : null;

  useEffect(() => {
    if (status === "error" && prevStatusRef.current !== "error") {
      console.error("Error fetching AI response");
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (onInputChange) {
      onInputChange(setInput);
    }
  }, [onInputChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  const clearHistory = async () => {
    setMessages([]);
    errorMsg = null;
  };

  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex h-[680px] w-full flex-col rounded-xl border border-white/30 bg-white/60 shadow-lg backdrop-blur-md">
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
              Error: {errorMsg}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-white/20 p-4"
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
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
