'use client'

import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

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
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          account_type: accountType,
          company: accountType === 'EMPRESA' ? company : null,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    window.location.href = returnTo
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    })
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

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full h-11 px-4 rounded-md border border-outline-variant bg-surface-container flex items-center justify-center gap-3 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant" />
        <span className="text-xs text-tertiary font-medium">o con email</span>
        <div className="flex-1 h-px bg-outline-variant" />
      </div>

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
          disabled={loading || googleLoading}
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
