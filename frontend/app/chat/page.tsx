"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { sendRAGMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ filename: string; page?: number }>;
}

export default function ChatPage() {
  const { language, dir, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: t("chat.welcome"),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewChat = () => {
    setMessages([
      {
        id: `welcome-${language}`,
        role: "assistant",
        content: t("chat.welcome"),
      },
    ]);
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendRAGMessage({
        message: content,
        language,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "ar"
            ? "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
            : "Sorry, a connection error occurred. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-e border-gray-200 bg-gray-50 p-4 md:block">
        <button
          type="button"
          onClick={startNewChat}
          className="mb-4 w-full rounded-lg bg-[#006633] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#005528]"
        >
          + {t("chat.newChat")}
        </button>
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
            {t("chat.history")}
          </h3>
          <p className="text-xs text-gray-400 italic">
            {language === "ar" ? "لا توجد محادثات سابقة" : "No previous chats"}
          </p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 chat-scroll">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="rounded-2xl bg-gray-100 px-4 py-3 rounded-bl-sm">
                <div className="thinking-dots flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#006633]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#006633]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#006633]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} language={language} />
      </div>
    </div>
  );
}
