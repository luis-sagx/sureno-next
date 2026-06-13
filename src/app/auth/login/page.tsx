"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="bg-surface-container rounded-lg shadow-lg p-8 space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Link href="/" className="inline-block">
          <h1 className="font-headline text-2xl italic text-secondary">
            Licorería Sureño
          </h1>
        </Link>
      </div>

      <h2 className="font-headline text-2xl text-on-surface text-center">
        Iniciar Sesión
      </h2>

      {error && (
        <div className="bg-error/10 border border-error text-error rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="tu@email.com"
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 px-6 rounded-md bg-secondary text-on-secondary font-semibold uppercase tracking-wider hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        ¿No tienes cuenta?{" "}
        <Link
          href="/auth/register"
          className="text-secondary hover:underline font-medium"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
