const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface ChatRequest {
  message: string;
  language: string;
  conversation_id?: string;
}

interface ChatResponse {
  response: string;
  language: string;
  sources?: Array<{ filename: string; page?: number; chunk?: string }>;
}

interface TranscriptionResponse {
  text: string;
  language?: string;
}

export async function sendMessage(data: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  return res.json();
}

export async function sendRAGMessage(data: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/rag/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Fallback to basic chat if RAG is not available
    return sendMessage(data);
  }

  return res.json();
}

export interface HealthResponse {
  status: "ok" | "partial" | "down";
  service: string;
  version: string;
  services: {
    backend?: "ok" | "down";
    ai?: "ok" | "down";
    stt?: "ok" | "down";
  };
}

export async function healthCheck(signal?: AbortSignal): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`, { signal });
  if (!res.ok) throw new Error(`Health request failed: ${res.status}`);
  return res.json();
}

export async function transcribeAudio(
  audio: Blob,
  language: string,
): Promise<TranscriptionResponse> {
  const formData = new FormData();
  formData.append("file", audio, "voice-input.webm");
  formData.append("language", language);

  const res = await fetch(`${API_BASE}/audio/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Transcription request failed: ${res.status}`);
  }

  return res.json();
}

interface TitleRequest {
  user_message: string;
  assistant_response: string;
  language: string;
}

interface TitleResponse {
  title: string;
}

export async function generateTitle(
  data: TitleRequest,
  signal?: AbortSignal,
): Promise<TitleResponse> {
  const res = await fetch(`${API_BASE}/chat/title`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Title request failed: ${res.status}`);
  }
  return res.json();
}

export { API_BASE };
