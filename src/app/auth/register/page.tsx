"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("INDIVIDUAL");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          account_type: accountType,
          company: accountType === "EMPRESA" ? company : null,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccessMessage("Revisa tu email para confirmar tu cuenta");
    setLoading(false);
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
        Crear Cuenta
      </h2>

      {error && (
        <div className="bg-error/10 border border-error text-error rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-secondary/10 border border-secondary text-secondary rounded-md px-4 py-3 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Tu nombre completo"
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label
            htmlFor="accountType"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Tipo de cuenta
          </label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="EMPRESA">Empresa</option>
          </select>
        </div>

        {accountType === "EMPRESA" && (
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-on-surface-variant mb-1"
            >
              Nombre de empresa
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Razón social"
              className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 px-6 rounded-md bg-secondary text-on-secondary font-semibold uppercase tracking-wider hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/auth/login"
          className="text-secondary hover:underline font-medium"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
