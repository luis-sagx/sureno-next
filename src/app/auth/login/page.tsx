'use client'

import { AuthPanel } from '@/components/auth/AuthPanel'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'sagxluis@gmail.com'

function LoginForm() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/'
  const message = searchParams.get('message')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      if (authError.code === 'email_not_confirmed') {
        setError(
          'Tu correo aún no está confirmado. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.'
        )
      } else if (authError.code === 'invalid_credentials') {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    if (email === ADMIN_EMAIL) {
      window.location.href = '/admin'
    } else {
      window.location.href = returnTo
    }
  }

  return (
    <AuthPanel
      eyebrow="Tu cuenta"
      title="Iniciar Sesión"
      description="Accede para seguir tus pedidos y comprar al mayoreo con tarjeta de cliente."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-secondary underline-offset-4 hover:underline"
          >
            Regístrate
          </Link>
        </>
      }
    >
      {message && (
        <p className="border-l border-line-strong pl-4 text-sm leading-relaxed text-on-surface-variant">
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="border-l border-error pl-4 text-sm leading-relaxed text-error"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />

        <Input
          label="Contraseña"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </Button>
      </form>
    </AuthPanel>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="craft h-96 animate-pulse rounded" />}>
      <LoginForm />
    </Suspense>
  )
}
