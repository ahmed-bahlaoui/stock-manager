export type UserRole = 'admin' | 'warehouse' | 'sales'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type AuthResponse = {
  message: string
  token: string
  data: AuthUser
}
