"use client";

import { useLanguage } from "@/lib/i18n";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ filename: string; page?: number }>;
}

export default function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const { dir } = useLanguage();
  const isUser = role === "user";

  return (
    <div dir={dir} className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#006633] text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {/* Avatar indicator */}
        <div className="mb-1 flex items-center gap-2">
          <div
            className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isUser ? "bg-white/20 text-white" : "bg-[#006633]/10 text-[#006633]"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>
          <span className={`text-xs ${isUser ? "text-white/70" : "text-gray-400"}`}>
            {isUser ? (dir === "rtl" ? "أنت" : "You") : (dir === "rtl" ? "المساعد" : "Assistant")}
          </span>
        </div>

        {/* Message content */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="mt-2 border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500 mb-1">
              {dir === "rtl" ? "المصادر:" : "Sources:"}
            </p>
            {sources.map((source, idx) => (
              <span
                key={idx}
                className="inline-block mr-2 mb-1 rounded bg-white/80 px-2 py-0.5 text-xs text-gray-600"
              >
                {source.filename}
                {source.page && ` (p.${source.page})`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
