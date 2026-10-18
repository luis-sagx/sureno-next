'use client'

import { AuthPanel } from '@/components/auth/AuthPanel'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase/client'
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
      <AuthPanel
        eyebrow="Casi listo"
        title="Revisa tu correo"
        description={`Te enviamos un enlace de confirmación a ${email}. Ábrelo para activar tu cuenta y luego inicia sesión.`}
        footer={
          <>
            ¿Ya confirmaste tu correo?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-secondary underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </>
        }
      >
        <p className="border-l border-secondary/60 pl-4 text-sm leading-relaxed text-on-surface-variant">
          El enlace caduca por seguridad. Si no llega en unos minutos, revisa
          la carpeta de spam.
        </p>
      </AuthPanel>
    )
  }

  return (
    <AuthPanel
      eyebrow="Tu cuenta"
      title="Crear Cuenta"
      description="Crea tu cuenta para comprar por unidad o al mayoreo, y seguir tus pedidos desde la misma ficha."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-secondary underline-offset-4 hover:underline"
          >
            Iniciar Sesión
          </Link>
        </>
      }
    >
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
          label="Nombre completo"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Tu nombre completo"
        />

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
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
        />

        <Select
          label="Tipo de cuenta"
          id="accountType"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="INDIVIDUAL">Individual</option>
          <option value="EMPRESA">Empresa</option>
        </Select>

        {accountType === 'EMPRESA' && (
          <Input
            label="Nombre de empresa"
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            placeholder="Razón social"
          />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthPanel>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="craft h-96 animate-pulse rounded" />}>
      <RegisterForm />
    </Suspense>
  )
}
