"use client";

import { useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { generateTitle, sendRAGMessage } from "@/lib/api";
import {
  Conversation,
  StoredMessage,
  deleteConversation,
  formatRelativeTime,
  getConversation,
  loadConversations,
  newConversationId,
  upsertConversation,
} from "@/lib/storage";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Crest from "@/components/ui/Crest";
import Mono from "@/components/ui/Mono";
import Pill from "@/components/ui/Pill";
import Btn from "@/components/ui/Btn";

function serviceNameFor(id: string | undefined, language: "ar" | "en"): string | null {
  if (!id) return null;
  const s = SERVICE_CATEGORIES.find((x) => x.id === id);
  if (!s) return null;
  return language === "ar" ? s.name_ar : s.name_en;
}

function welcomeMessage(welcomeText: string): StoredMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: welcomeText,
    ts: Date.now(),
  };
}

function ChatPageInner() {
  const { language, dir, t } = useLanguage();
  const ar = dir === "rtl";
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlId = searchParams.get("id");
  const urlServiceId = searchParams.get("service") ?? undefined;
  const urlPrompt = searchParams.get("prompt");

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [titleStatus, setTitleStatus] = useState<"placeholder" | "generated">("placeholder");
  const [createdAt, setCreatedAt] = useState<number>(() => Date.now());
  const [messages, setMessages] = useState<StoredMessage[]>(() => [welcomeMessage(t("chat.welcome"))]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [history, setHistory] = useState<Conversation[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consumedPromptRef = useRef<string | null>(null);
  const titleAbortRef = useRef<AbortController | null>(null);

  // Load conversation list on mount and when storage changes (cross-tab sync).
  const refreshHistory = useCallback(() => {
    setHistory(loadConversations());
  }, []);

  useEffect(() => {
    refreshHistory();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "jordangov-conversations") refreshHistory();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshHistory]);

  // Sync state from URL: id → load conversation; absent → fresh draft.
  useEffect(() => {
    titleAbortRef.current?.abort();
    titleAbortRef.current = null;

    if (urlId) {
      const conv = getConversation(urlId);
      if (conv) {
        setCurrentId(conv.id);
        setServiceId(conv.serviceId);
        setTitle(conv.title);
        setTitleStatus(conv.titleStatus);
        setCreatedAt(conv.createdAt);
        setMessages(conv.messages.length ? conv.messages : [welcomeMessage(t("chat.welcome"))]);
        return;
      }
      // Stale id → treat as draft with that id reserved.
    }

    setCurrentId(null);
    setServiceId(urlServiceId);
    setTitle("");
    setTitleStatus("placeholder");
    setCreatedAt(Date.now());
    setMessages([welcomeMessage(t("chat.welcome"))]);
    // We rebuild welcome on language change too; t() depends on language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId, urlServiceId, language]);

  // Pre-fill input with starter prompt and clean up the URL param.
  useEffect(() => {
    if (!urlPrompt || consumedPromptRef.current === urlPrompt) return;
    consumedPromptRef.current = urlPrompt;
    setPendingPrompt(urlPrompt);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("prompt");
    const qs = params.toString();
    router.replace(qs ? `/chat?${qs}` : "/chat");
  }, [urlPrompt, searchParams, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const persist = useCallback(
    (next: {
      id: string;
      title: string;
      titleStatus: "placeholder" | "generated";
      messages: StoredMessage[];
      serviceId?: string;
      createdAt: number;
    }) => {
      const conv: Conversation = {
        id: next.id,
        title: next.title,
        titleStatus: next.titleStatus,
        language,
        serviceId: next.serviceId,
        messages: next.messages,
        createdAt: next.createdAt,
        updatedAt: Date.now(),
      };
      upsertConversation(conv);
      refreshHistory();
    },
    [language, refreshHistory],
  );

  const startNewChat = useCallback(() => {
    titleAbortRef.current?.abort();
    titleAbortRef.current = null;
    router.push("/chat");
  }, [router]);

  const handleDeleteConversation = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      deleteConversation(id);
      refreshHistory();
      if (id === currentId) router.push("/chat");
    },
    [currentId, refreshHistory, router],
  );

  const handleSend = useCallback(
    async (content: string) => {
      const isFirstUserMessage = !messages.some((m) => m.role === "user");
      const sessionId = currentId ?? newConversationId();
      const sessionCreatedAt = currentId ? createdAt : Date.now();

      const userMsg: StoredMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content,
        ts: Date.now(),
      };

      const placeholderTitle = title || content.slice(0, 40);
      const initialStatus: "placeholder" | "generated" = isFirstUserMessage ? "placeholder" : titleStatus;

      const afterUser = [...messages, userMsg];
      setMessages(afterUser);
      setIsLoading(true);
      if (!currentId) {
        setCurrentId(sessionId);
        setCreatedAt(sessionCreatedAt);
      }
      if (!title) setTitle(placeholderTitle);

      persist({
        id: sessionId,
        title: title || placeholderTitle,
        titleStatus: initialStatus,
        messages: afterUser,
        serviceId,
        createdAt: sessionCreatedAt,
      });

      // Reflect id in URL so reload/back-button works (replace, not push).
      if (!currentId) {
        const p = new URLSearchParams(searchParams.toString());
        p.delete("service");
        p.delete("prompt");
        p.set("id", sessionId);
        router.replace(`/chat?${p.toString()}`);
      }

      let assistantContent = "";
      let assistantSources: StoredMessage["sources"];
      let isError = false;

      try {
        const response = await sendRAGMessage({ message: content, language });
        assistantContent = response.response;
        assistantSources = response.sources;
      } catch {
        assistantContent = t("chat.errorMsg");
        isError = true;
      }

      const assistantMsg: StoredMessage = {
        id: `${Date.now() + 1}-a`,
        role: "assistant",
        content: assistantContent,
        sources: assistantSources,
        ts: Date.now(),
      };
      const afterAssistant = [...afterUser, assistantMsg];
      setMessages(afterAssistant);
      setIsLoading(false);

      persist({
        id: sessionId,
        title: title || placeholderTitle,
        titleStatus: initialStatus,
        messages: afterAssistant,
        serviceId,
        createdAt: sessionCreatedAt,
      });

      // Generate a real title in the background after the first exchange.
      if (isFirstUserMessage && !isError) {
        const ctrl = new AbortController();
        titleAbortRef.current = ctrl;
        try {
          const res = await generateTitle(
            {
              user_message: content,
              assistant_response: assistantContent,
              language,
            },
            ctrl.signal,
          );
          const generated = res.title?.trim();
          if (generated) {
            setTitle(generated);
            setTitleStatus("generated");
            persist({
              id: sessionId,
              title: generated,
              titleStatus: "generated",
              messages: afterAssistant,
              serviceId,
              createdAt: sessionCreatedAt,
            });
          }
        } catch {
          // Title gen failed — leave the placeholder.
        }
      }
    },
    [
      messages,
      currentId,
      createdAt,
      title,
      titleStatus,
      serviceId,
      language,
      persist,
      router,
      searchParams,
      t,
    ],
  );

  const activeService = useMemo(() => SERVICE_CATEGORIES.find((s) => s.id === serviceId) ?? null, [serviceId]);
  const activeServiceName = activeService
    ? language === "ar"
      ? activeService.name_ar
      : activeService.name_en
    : ar
      ? "الأحوال المدنية والجوازات"
      : "Civil Status & Passports";

  const sessionId = currentId ?? "0042";
  const isWelcome = messages.length === 1;

  return (
    <div
      dir={dir}
      className="grid"
      style={{
        background: "var(--color-bg)",
        gridTemplateColumns: "280px 1fr",
        height: "calc(100vh - 174px)",
        minHeight: 720,
      }}
    >
      {/* SIDEBAR */}
      <aside
        className="flex flex-col overflow-hidden"
        style={{
          borderInlineEnd: "1px solid var(--color-rule-soft)",
          padding: 22,
          background: "var(--color-bg-alt)",
        }}
      >
        <Btn
          kind="primary"
          onClick={startNewChat}
          style={{ width: "100%", padding: "11px 14px", fontSize: 13 }}
        >
          ＋ {t("chat.newChat")}
        </Btn>

        <Mono
          as="div"
          className="block mt-7 mb-3"
          style={{ fontSize: 10, color: "var(--color-ink-mute)" }}
        >
          {t("chat.history")} · {String(history.length).padStart(2, "0")}
        </Mono>

        <div className="flex-1 overflow-y-auto chat-scroll -mx-1 px-1">
          {history.length === 0 ? (
            <p
              style={{
                fontSize: 12,
                color: "var(--color-ink-mute)",
                fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                fontStyle: "italic",
              }}
            >
              {t("chat.historyEmpty")}
            </p>
          ) : (
            history.map((c, i) => {
              const active = c.id === currentId;
              const tag = serviceNameFor(c.serviceId, language);
              const time = formatRelativeTime(c.updatedAt, language);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => router.push(`/chat?id=${c.id}`)}
                  className="block w-full text-start cursor-pointer group transition-colors relative"
                  style={{
                    padding: "12px 8px",
                    margin: "0 -8px",
                    background: active ? "var(--color-primary-soft)" : "transparent",
                    borderBottom:
                      i < history.length - 1
                        ? "1px solid var(--color-rule-soft)"
                        : "none",
                  }}
                >
                  <div className="flex justify-between mb-1">
                    <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
                      {time}
                    </Mono>
                    {tag && (
                      <Mono style={{ fontSize: 9.5, color: "var(--color-primary)" }}>
                        {tag.length > 18 ? tag.slice(0, 16) + "…" : tag}
                      </Mono>
                    )}
                  </div>
                  <span
                    className="block truncate pe-5"
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--color-ink)",
                      fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                    }}
                    title={c.title}
                  >
                    {c.title || (ar ? "محادثة بدون عنوان" : "Untitled conversation")}
                  </span>
                  <span
                    role="button"
                    aria-label="Delete conversation"
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center"
                    style={{
                      top: 10,
                      insetInlineEnd: 4,
                      width: 20,
                      height: 20,
                      color: "var(--color-ink-mute)",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div
          className="flex items-center gap-2.5 pt-4 mt-2"
          style={{ borderTop: "1px solid var(--color-rule-soft)" }}
        >
          <Crest size={28} />
          <div className="leading-[1.3]">
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--color-primary)",
              }}
            >
              JordanGov AI
            </span>
            <Mono
              as="div"
              className="block"
              style={{ fontSize: 9, color: "var(--color-ink-mute)" }}
            >
              v1.0 · 2026
            </Mono>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className="flex flex-col min-w-0"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="flex justify-between items-center"
          style={{
            padding: "12px 28px",
            borderBottom: "1px solid var(--color-rule-soft)",
            background: "var(--color-panel)",
          }}
        >
          <div className="flex gap-4 items-center min-w-0">
            <Mono style={{ fontSize: 10, color: "var(--color-ink-mute)" }}>
              {t("chat.session")} · {sessionId.slice(-4).toUpperCase()}
            </Mono>
            <span
              className="block flex-shrink-0"
              style={{ width: 1, height: 14, background: "var(--color-rule-soft)" }}
            />
            <span
              className="truncate"
              style={{
                fontSize: 13,
                color: "var(--color-ink)",
                fontWeight: 500,
                fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              {title || activeServiceName}
            </span>
          </div>
          <Pill tone="primary">RAG · {ar ? "العربية" : "EN"}</Pill>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain chat-scroll grid"
          style={{ padding: "32px 56px", gap: 24, alignContent: "start" }}
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              ts={msg.ts}
              sources={msg.sources}
            />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3.5">
              <div
                className="grid place-items-center flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--color-primary)",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                AI
              </div>
              <div className="thinking-dots flex gap-1.5 items-center pt-3">
                <span className="block" style={{ width: 6, height: 6, background: "var(--color-primary)" }} />
                <span className="block" style={{ width: 6, height: 6, background: "var(--color-primary)" }} />
                <span className="block" style={{ width: 6, height: 6, background: "var(--color-primary)" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ borderTop: "1px solid var(--color-rule-soft)" }}>
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            language={language}
            pendingValue={pendingPrompt}
            onPendingConsumed={() => setPendingPrompt(null)}
          />

          {isWelcome && !isLoading && (
            <div
              className="flex gap-2 flex-wrap items-center"
              style={{ padding: "0 20px 16px", background: "var(--color-panel)" }}
            >
              <Mono style={{ fontSize: 9.5, color: "var(--color-ink-mute)" }}>
                {t("chat.suggestionsTitle")}
              </Mono>
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
                  className="cursor-pointer transition-colors"
                  style={{
                    fontSize: 12,
                    padding: "5px 11px",
                    border: "1px solid var(--color-rule-soft)",
                    background: "var(--color-bg)",
                    color: "var(--color-ink-soft)",
                    fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.background = "var(--color-primary-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-rule-soft)";
                    e.currentTarget.style.background = "var(--color-bg)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
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
