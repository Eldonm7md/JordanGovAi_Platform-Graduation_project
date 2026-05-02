"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useLanguage } from "@/lib/i18n";
import { transcribeAudio } from "@/lib/api";
import Mono from "@/components/ui/Mono";
import Btn from "@/components/ui/Btn";

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
  const ar = dir === "rtl";

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
    if (disabled || isTranscribing) return;

    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsTranscribing(true);
        try {
          const audio = new Blob(chunksRef.current, { type: "audio/webm" });
          const result = await transcribeAudio(audio, language);
          const transcript = result.text.trim();
          if (transcript) setMessage(transcript);
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
      className="flex items-center gap-3"
      style={{
        padding: "14px 20px",
        background: "var(--color-panel)",
      }}
    >
      <button
        type="button"
        onClick={handleVoiceInput}
        disabled={disabled || isTranscribing}
        className="grid place-items-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          width: 38,
          height: 38,
          background: isRecording ? "var(--color-gold)" : "var(--color-bg)",
          border: `1px solid ${isRecording ? "var(--color-gold)" : "var(--color-rule-soft)"}`,
        }}
        aria-label={t("chat.voiceLabel")}
        title={t("chat.voiceLabel")}
      >
        {isRecording ? (
          <span
            className="recording-dot rounded-full"
            style={{ width: 10, height: 10, background: "#fff" }}
          />
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeWidth="1.8"
            aria-hidden
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isTranscribing ? t("chat.transcribing") : t("chat.placeholder")}
        disabled={disabled || isTranscribing}
        className="flex-1 bg-transparent border-0 outline-none disabled:opacity-50"
        style={{
          fontSize: 15,
          fontFamily: ar ? "var(--font-arabic)" : "var(--font-sans)",
          padding: "8px 4px",
          color: "var(--color-ink)",
        }}
      />

      <Mono style={{ fontSize: 9.5, color: "var(--color-ink-mute)" }}>⏎</Mono>

      <Btn
        type="submit"
        kind="primary"
        disabled={!message.trim() || disabled || isTranscribing}
        style={{ padding: "10px 18px", fontSize: 13 }}
      >
        {t("chat.send")}
      </Btn>
    </form>
  );
}
