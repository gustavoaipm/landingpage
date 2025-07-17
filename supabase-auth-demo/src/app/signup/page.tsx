"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ minWidth: 320, maxWidth: 400, width: "100%" }}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Sign Up</h2>
        <form onSubmit={handleSignUp} style={{ width: "100%" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 16,
                fontFamily: "inherit",
                background: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 16,
                fontFamily: "inherit",
                background: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={styles.primary}
            style={{ width: "100%", padding: 12, fontSize: 16 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && (
            <div style={{ color: "red", marginTop: 16, textAlign: "center" }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginTop: 16, textAlign: "center" }}>
              Check your email to confirm your account!
            </div>
          )}
        </form>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
