'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { loginSchema, type LoginFormData } from '@/lib/schemas'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    const success = await login(data.login, data.motDePasse)
    if (success) {
      router.push('/')
    } else {
      setError('Identifiant ou mot de passe incorrect')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 border border-sable-gold/40 mb-4">
          <span className="text-2xl font-bold text-prune-main">OSS</span>
        </div>
        <h1 className="text-lg font-semibold text-prune-main">Connexion</h1>
      </div>

      <Input
        label="Identifiant"
        type="text"
        {...register('login')}
        placeholder="admin, drmbarga, drndongo"
        error={errors.login?.message}
        required
      />

      <Input
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        {...register('motDePasse')}
        placeholder="••••••••"
        error={errors.motDePasse?.message}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-text-anthracite/60 hover:text-prune-main transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      {error && (
        <p className="text-xs text-alert-red text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Se connecter
      </Button>

      <p className="text-xs text-text-anthracite/60 text-center">
        Identifiants de démo : admin / drmbarga / drndongo
      </p>
    </form>
  )
}
