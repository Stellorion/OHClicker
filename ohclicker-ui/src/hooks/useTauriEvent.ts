// Subscribes to a backend event for as long as the component is mounted.
import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";

/** Calls `handler(payload)` every time the backend emits `event` (always uses the latest handler). */
export function useTauriEvent<T>(event: string, handler: (payload: T) => void) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    let cancelled = false;
    let unlisten: (() => void) | undefined;
    void listen<T>(event, (e) => handlerRef.current(e.payload)).then((off) => {
      if (cancelled) off();
      else unlisten = off;
    });
    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [event]);
}
