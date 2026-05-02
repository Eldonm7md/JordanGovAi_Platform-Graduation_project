// Conversation persistence in localStorage.
// Single key holds the full list; capped at MAX_CONVERSATIONS with FIFO
// eviction by updatedAt. SSR-safe: every accessor returns an empty default
// when window is undefined.

export interface StoredSource {
  filename: string;
  page?: number;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
  sources?: StoredSource[];
}

export interface Conversation {
  id: string;
  title: string;
  titleStatus: "placeholder" | "generated";
  language: "ar" | "en";
  serviceId?: string;
  messages: StoredMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "jordangov-conversations";
const STORAGE_VERSION_KEY = "jordangov-conversations-v";
const STORAGE_VERSION = 1;
const MAX_CONVERSATIONS = 50;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function loadConversations(): Conversation[] {
  if (!isClient()) return [];
  try {
    const v = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (v && Number(v) !== STORAGE_VERSION) {
      // Future migrations would live here. For now: bail.
      return [];
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && typeof c.id === "string")
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function persistAll(list: Conversation[]) {
  if (!isClient()) return;
  try {
    const trimmed = list
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CONVERSATIONS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
  } catch {
    // Quota exceeded etc — non-fatal.
  }
}

export function getConversation(id: string): Conversation | null {
  return loadConversations().find((c) => c.id === id) ?? null;
}

export function upsertConversation(c: Conversation) {
  const list = loadConversations();
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) list[idx] = c;
  else list.push(c);
  persistAll(list);
}

export function deleteConversation(id: string) {
  persistAll(loadConversations().filter((c) => c.id !== id));
}

export function newConversationId(): string {
  // Short, sortable, collision-resistant enough for client-only IDs.
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${rand}`;
}

// "14:22" / "Yesterday" / "Mar 12" — for sidebar history rows.
export function formatRelativeTime(updatedAt: number, language: "ar" | "en"): string {
  const now = new Date();
  const then = new Date(updatedAt);
  const sameDay =
    now.getFullYear() === then.getFullYear() &&
    now.getMonth() === then.getMonth() &&
    now.getDate() === then.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    yesterday.getFullYear() === then.getFullYear() &&
    yesterday.getMonth() === then.getMonth() &&
    yesterday.getDate() === then.getDate();

  const locale = language === "ar" ? "ar-EG" : "en-GB";
  if (sameDay) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(then);
  }
  if (isYesterday) return language === "ar" ? "أمس" : "Yest.";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(then);
}
