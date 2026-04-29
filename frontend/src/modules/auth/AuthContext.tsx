import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setAuthToken } from '../../shared/api/client'
import { clearStoredAuth, getStoredToken, getStoredUser, storeAuth } from './storage'
import type { AuthResponse, AuthUser } from './types'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        await refreshMeInternal()
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }

    void boot()
  }, [])

  const clearSession = () => {
    setToken(null)
    setUser(null)
    setAuthToken(null)
    clearStoredAuth()
  }

  const applySession = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken)
    setUser(nextUser)
    setAuthToken(nextToken)
    storeAuth(nextToken, nextUser)
  }

  const refreshMeInternal = async () => {
    const response = await api.get<{ data: AuthUser }>('/me')
    const currentToken = getStoredToken()

    if (currentToken) {
      applySession(currentToken, response.data.data)
    } else {
      setUser(response.data.data)
    }
  }

  const login = async (payload: LoginPayload) => {
    const response = await api.post<AuthResponse>('/login', payload)
    applySession(response.data.token, response.data.data)
  }

  const register = async (payload: RegisterPayload) => {
    const response = await api.post<AuthResponse>('/register', payload)
    applySession(response.data.token, response.data.data)
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } finally {
      clearSession()
    }
  }

  const refreshMe = async () => {
    await refreshMeInternal()
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshMe,
    }),
    [loading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
