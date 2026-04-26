"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("Login failed. Check the admin password.");
      return;
    }

    router.push("/admin/home");
    router.refresh();
  }

  return (
    <form className="admin-form section-stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="password">Admin password</label>
        <input
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter the admin password"
          type="password"
          value={password}
        />
      </div>

      <div className="meta-row">
        <button className="button-primary" disabled={status === "saving"} type="submit">
          {status === "saving" ? "Signing in..." : "Sign in"}
        </button>
        {message ? <span>{message}</span> : null}
      </div>
    </form>
  );
}
