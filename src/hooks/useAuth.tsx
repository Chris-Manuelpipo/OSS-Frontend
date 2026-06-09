'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { login as loginService, type AuthUser } from '@/lib/services/auth'
import { TOKEN_KEY, USER_KEY } from '@/lib/api/config'

interface AuthContextType {
  user: AuthUser | null
  login: (login: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  /** true tant que la session n'a pas été restaurée depuis le localStorage. */
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restaure la session persistée au montage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY)
      const token = window.localStorage.getItem(TOKEN_KEY)
      if (raw && token) setUser(JSON.parse(raw) as AuthUser)
    } catch {
      // stockage corrompu : on repart déconnecté
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (loginValue: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await loginService(loginValue, password)
      window.localStorage.setItem(TOKEN_KEY, token)
      window.localStorage.setItem(USER_KEY, JSON.stringify(user))
      setUser(user)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user !== null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
