"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function ContentRefreshListener() {
  const router = useRouter();
  const latestVersion = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/content/version", { cache: "no-store" });
        const payload = (await response.json()) as { version?: number };
        const version = payload.version ?? 0;

        if (latestVersion.current === null) {
          latestVersion.current = version;
          return;
        }

        if (version > latestVersion.current) {
          latestVersion.current = version;
          router.refresh();
        }
      } catch {
        return;
      }
    }

    poll();
    const interval = window.setInterval(() => {
      if (!cancelled) {
        void poll();
      }
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [router]);

  return null;
}
