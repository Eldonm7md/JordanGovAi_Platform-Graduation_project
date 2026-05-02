"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function ChatPageInner() {
  const { language, dir, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: t("chat.welcome"),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consumedPromptRef = useRef<string | null>(null);

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

  // Pre-fill input with a starter prompt from /services?prompt=...
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt || consumedPromptRef.current === prompt) return;
    consumedPromptRef.current = prompt;
    setPendingPrompt(prompt);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("prompt");
    params.delete("service");
    const qs = params.toString();
    router.replace(qs ? `/chat?${qs}` : "/chat");
  }, [searchParams, router]);

  return (
    <div dir={dir} className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-e border-gray-200 bg-gray-50 p-4 md:flex">
        <button
          type="button"
          onClick={startNewChat}
          className="mb-4 w-full cursor-pointer rounded-lg bg-[#006633] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#005528]"
        >
          + {t("chat.newChat")}
        </button>
        <div className="flex-1">
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
            {t("chat.history")}
          </h3>
          <p className="text-xs text-gray-400 italic">
            {language === "ar" ? "لا توجد محادثات سابقة" : "No previous chats"}
          </p>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#006633]">
              <span className="text-[10px] font-bold text-white">JG</span>
            </div>
            <span className="text-xs font-semibold text-[#006633]">
              JordanGov AI Assistant
            </span>
          </div>
          <p className="text-[11px] text-gray-500">{t("footer.project")}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">
            &copy; 2026 {t("footer.rights")}
          </p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 chat-scroll">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
            />
          ))}

          {messages.length === 1 && !isLoading && (
            <div className="mt-2 mb-4">
              <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
                {t("chat.suggestionsTitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  t("chat.suggestion1"),
                  t("chat.suggestion2"),
                  t("chat.suggestion3"),
                  t("chat.suggestion4"),
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:border-[#006633] hover:bg-[#006633]/5 hover:text-[#006633]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

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
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
          language={language}
          pendingValue={pendingPrompt}
          onPendingConsumed={() => setPendingPrompt(null)}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
