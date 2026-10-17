'use client'

import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountType, setAccountType] = useState('INDIVIDUAL')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
        data: {
          full_name: name,
          account_type: accountType,
          company: accountType === 'EMPRESA' ? company : null,
        },
      },
    })

    if (authError) {
      if (authError.code === 'user_already_exists') {
        setError('Ya existe una cuenta con este correo electrónico. Inicia sesión.')
      } else if (authError.code === 'weak_password') {
        setError('La contraseña es muy débil. Usa al menos 6 caracteres.')
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    // Si la confirmación por email está desactivada, Supabase devuelve
    // una sesión activa y el usuario queda logueado de inmediato.
    if (data.session) {
      window.location.href = returnTo
      return
    }

    // Confirmación por email activada: todavía no hay sesión.
    setEmailSent(true)
    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="bg-surface rounded-lg shadow-lg border border-outline-variant border-t-2 border-t-tertiary p-8 space-y-6">
        <div className="text-center">
          <Image
            src="/logo-text.webp"
            alt="Licorería Sureño"
            width={180}
            height={50}
            className="h-28 w-auto mx-auto"
            priority
          />
        </div>

        <h2 className="font-headline text-2xl text-on-surface text-center">
          Revisa tu correo
        </h2>

        <div className="bg-secondary/10 border border-secondary/30 text-secondary rounded-md px-4 py-3 text-sm">
          Te enviamos un enlace de confirmación a{' '}
          <span className="font-semibold">{email}</span>. Ábrelo para activar tu
          cuenta y luego inicia sesión.
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          ¿Ya confirmaste tu correo?{' '}
          <Link
            href="/auth/login"
            className="text-tertiary hover:underline font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg border border-outline-variant border-t-2 border-t-tertiary p-8 space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-tertiary hover:text-tertiary/80 font-medium transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
        </svg>
        Volver a la tienda
      </Link>

      {/* Logo */}
      <div className="text-center">
        <Image
          src="/logo-text.webp"
          alt="Licorería Sureño"
          width={180}
          height={50}
          className="h-28 w-auto mx-auto"
          priority
        />
      </div>

      <h2 className="font-headline text-2xl text-on-surface text-center">
        Crear Cuenta
      </h2>

      {error && (
        <div className="bg-error/10 border border-error text-error rounded-md px-4 py-3 text-sm">
          {error}
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
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-tertiary"
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
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-tertiary"
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
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-tertiary"
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
            className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="EMPRESA">Empresa</option>
          </select>
        </div>

        {accountType === 'EMPRESA' && (
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
              className="w-full h-11 px-4 rounded-md bg-surface-container-highest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 px-6 rounded-md bg-secondary text-on-secondary font-semibold uppercase tracking-wider hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/auth/login"
          className="text-tertiary hover:underline font-medium"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="bg-surface rounded-lg shadow-lg border border-outline-variant p-8 h-96 animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  )
}
