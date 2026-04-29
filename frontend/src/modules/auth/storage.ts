import type { AuthUser } from './types'

const TOKEN_KEY = 'stock-manager-token'
const USER_KEY = 'stock-manager-user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  const value = localStorage.getItem(USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    return null
  }
}

export function storeAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
