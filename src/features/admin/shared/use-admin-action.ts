"use client";

import { useState } from "react";

export type AdminActionState = "idle" | "pending" | "success" | "error";

export function useAdminAction(initialMessage = "Idle") {
  const [message, setMessage] = useState(initialMessage);
  const [state, setState] = useState<AdminActionState>("idle");

  async function run<T>(action: () => Promise<T>, options: {
    pending: string;
    success: string;
    error: string;
  }) {
    setState("pending");
    setMessage(options.pending);

    try {
      const result = await action();
      setState("success");
      setMessage(options.success);
      return result;
    } catch {
      setState("error");
      setMessage(options.error);
      return null;
    }
  }

  function reset(nextMessage = initialMessage) {
    setState("idle");
    setMessage(nextMessage);
  }

  return {
    message,
    reset,
    run,
    state,
  };
}
