"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm({
  callbackFailed,
}: {
  callbackFailed: boolean;
}) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(
    callbackFailed
      ? "We couldn't sign you in. Please request a new sign-in link."
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);

    try {
      const { error } = await supabaseBrowser().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      setMsg(error ? error.message : "Check your email for the sign-in link.");
    } catch (error) {
      setMsg(
        error instanceof Error
          ? error.message
          : "Unable to send the sign-in link. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 360 }}>
      <h1>Sign in to Vaultex</h1>
      <form onSubmit={signIn}>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send link"}
        </button>
      </form>
      <p role="status" aria-live="polite">{msg}</p>
    </main>
  );
}
