import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: { id: string; name: string; email: string } | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string, user: { id: string; name: string; email: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!accessToken,
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(getInitialState)

  const login = (
    accessToken: string,
    refreshToken: string,
    user: { id: string; name: string; email: string },
  ) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    setState({ accessToken, refreshToken, user, isAuthenticated: true })
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setState({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
