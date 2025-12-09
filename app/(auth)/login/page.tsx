'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.')
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'founder@kiwiparty.in',
      password: 'Password123!',
    },
  })

  const onSubmit = async (values: LoginForm) => {
    setError(null)
    setLoading(true)
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    })
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }
    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/70">
        <div className="mb-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Control Shoopy</p>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in to continue</h1>
          <p className="text-sm text-slate-500">Demo credentials are pre-filled for convenience.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="founder@kiwiparty.in"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          {successMessage && (
            <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600 border border-green-100">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-slate-900 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

