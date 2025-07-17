"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";

export default function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !userType) {
      setError("Please fill out all fields, including user type.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, userType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
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
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Join the Waitlist</h2>
        {submitted ? (
          <div style={{ color: "green", textAlign: "center", fontWeight: 500, fontSize: 18 }}>
            Thank you for joining the waitlist!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
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
                placeholder="Enter your name"
              />
            </div>
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
                I am a...
              </label>
              <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
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
              >
                <option value="" disabled>
                  Select one...
                </option>
                <option value="Landlord">Landlord</option>
                <option value="Tenant">Tenant</option>
                <option value="Service provider">Service provider</option>
              </select>
            </div>
            <button
              type="submit"
              className={styles.primary}
              style={{ width: "100%", padding: 12, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
            {error && (
              <div style={{ color: "red", marginTop: 16, textAlign: "center" }}>{error}</div>
            )}
          </form>
        )}
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