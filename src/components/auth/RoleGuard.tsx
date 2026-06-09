'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@/lib/types'

export default function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role !== role) {
      router.push('/')
    }
  }, [loading, isAuthenticated, user, role, router])

  if (loading || !isAuthenticated || user?.role !== role) return null

  return <>{children}</>
}
