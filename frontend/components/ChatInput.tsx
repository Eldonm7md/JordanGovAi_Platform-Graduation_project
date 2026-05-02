"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useLanguage } from "@/lib/i18n";
import { transcribeAudio } from "@/lib/api";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  language: string;
  pendingValue?: string | null;
  onPendingConsumed?: () => void;
}

export default function ChatInput({
  onSend,
  disabled,
  language,
  pendingValue,
  onPendingConsumed,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dir, t } = useLanguage();

  useEffect(() => {
    if (pendingValue) {
      setMessage(pendingValue);
      onPendingConsumed?.();
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (el) {
          el.focus();
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      });
    }
  }, [pendingValue, onPendingConsumed]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isTranscribing) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleVoiceInput = async () => {
    if (disabled || isTranscribing) {
      return;
    }

    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsTranscribing(true);

        try {
          const audio = new Blob(chunksRef.current, { type: "audio/webm" });
          const result = await transcribeAudio(audio, language);
          const transcript = result.text.trim();

          if (transcript) {
            setMessage(transcript);
          }
        } finally {
          setIsTranscribing(false);
          recorderRef.current = null;
          chunksRef.current = [];
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir={dir}
      className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3"
    >
      <button
        type="button"
        onClick={handleVoiceInput}
        disabled={disabled || isTranscribing}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
          isRecording
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        } disabled:opacity-40`}
        title={dir === "rtl" ? "تسجيل صوتي" : "Voice input"}
        aria-label={dir === "rtl" ? "تسجيل صوتي" : "Voice input"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isTranscribing ? "Transcribing..." : t("chat.placeholder")}
        disabled={disabled || isTranscribing}
        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#006633] focus:ring-1 focus:ring-[#006633]/20 disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled || isTranscribing}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006633] text-white transition hover:bg-[#005528] disabled:opacity-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
