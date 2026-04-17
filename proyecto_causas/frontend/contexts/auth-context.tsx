"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  nombre_completo: string
  rol: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string, twoFactor?: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    token: string | null;
    isLoading: boolean;
  }>({
    user: null,
    token: null,
    isLoading: true,
  })

  // Destructure for easy access
  const { user, token, isLoading } = state

  // For compatibility with the context interface
  const setUser = (newUser: User | null) => setState(prev => ({ ...prev, user: newUser }))

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')

    console.log('🔐 Verificando token guardado:', savedToken ? 'Token encontrado' : 'No hay token')

    if (savedToken) {
      apiClient.setAuthToken(savedToken)
      console.log('✅ Token establecido en apiClient')

      let restoredUser = null
      if (savedUser) {
        try {
          restoredUser = JSON.parse(savedUser)
          console.log('👤 Usuario restaurado:', restoredUser.email)
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error)
        }
      }

      // Update state in one single call to prevent cascading renders
      setState({
        token: savedToken,
        user: restoredUser,
        isLoading: false
      })
    } else {
      console.log('⚠️ No hay token guardado')
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (identifier: string, password: string, twoFactor?: string): Promise<boolean> => {
    try {
      console.log('🔑 Intentando login para:', identifier)

      // Enviamos el identificador en todos los campos posibles
      // para compatibilizar con el backend (email, ce, dni, username)
      const response = await apiClient.login({
        email: identifier,
        ce: identifier,
        dni: identifier,
        username: identifier,
        password,
        twoFactor,
      })

      console.log('📥 Respuesta de login:', response)

      if (response.token) {
        console.log('✅ Token recibido:', response.token.substring(0, 20) + '...')

        apiClient.setAuthToken(response.token)
        localStorage.setItem('authToken', response.token)

        // Si el response incluye datos del usuario, los guardamos
        if (response.user) {
          localStorage.setItem('authUser', JSON.stringify(response.user))
          console.log('👤 Usuario guardado:', response.user.email)
        }

        setState({
          token: response.token,
          user: response.user || null,
          isLoading: false
        })

        return true
      }

      console.log('❌ No se recibió token en la respuesta')
      return false
    } catch (error) {
      console.error('❌ Error en login:', error)
      return false
    }
  }

  const logout = () => {
    console.log('🚪 Cerrando sesión')
    setState({ token: null, user: null, isLoading: false })
    apiClient.setAuthToken('')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    setUser: (u: User) => setState(prev => ({ ...prev, user: u })),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

