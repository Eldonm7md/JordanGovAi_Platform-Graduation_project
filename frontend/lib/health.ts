"use client";

import { useEffect, useState } from "react";
import { HealthResponse, healthCheck } from "./api";

export type HealthState =
  | { kind: "loading" }
  | { kind: "ok"; data: HealthResponse }
  | { kind: "partial"; data: HealthResponse }
  | { kind: "down" };

const POLL_MS = 30_000;

// Polls /health every 30s. On error or AI-down, transitions to "partial"
// (backend reachable but degraded) or "down" (backend unreachable).
export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();

    const tick = async () => {
      try {
        const data = await healthCheck(ctrl.signal);
        if (cancelled) return;
        if (data.status === "ok") setState({ kind: "ok", data });
        else setState({ kind: "partial", data });
      } catch {
        if (cancelled) return;
        setState({ kind: "down" });
      }
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      ctrl.abort();
      window.clearInterval(id);
    };
  }, []);

  return state;
}
