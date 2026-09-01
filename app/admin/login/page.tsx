"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HandCoins, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        email === "admin@kreditpensiun.com" &&
        password === "admin123"
      ) {
        document.cookie =
          "admin_session=authenticated; path=/admin; max-age=1800";
        router.push("/admin");
      } else {
        setError("Email atau password salah");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <HandCoins weight="bold" />
          </div>
          <div>
            <div className="login-title">Admin Panel</div>
            <div className="login-subtitle">Kredit Pensiun Indonesia</div>
          </div>
        </div>

        <h1>Masuk</h1>
        <p className="login-desc">
          Gunakan akun admin untuk mengakses panel.
        </p>

        {error && (
          <div className="note note-error">
            <WarningCircle weight="bold" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@kreditpensiun.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="login-footer">
          <Link href="/">Kembali ke website</Link>
        </div>
      </div>
    </div>
  );
}
