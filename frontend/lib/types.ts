export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: string;
  input_type?: "text" | "voice";
  sources?: SourceInfo[];
  timestamp: string;
}

export interface SourceInfo {
  filename: string;
  page?: number;
  chunk?: string;
}

export interface Conversation {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  service_category: string;
  created_at: string;
}

export interface AdminOverview {
  total_questions: number;
  total_conversations: number;
  total_reviews: number;
  avg_rating: number;
  indexed_documents: number;
  rag_status: boolean;
  cerebras_status: boolean;
  stt_status: boolean;
}
