"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Scale, Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function SecureLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    twoFactor: "",
  })
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [attempts, setAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const maxAttempts = 3

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Primero intentamos login con credenciales básicas
      const response = await apiClient.login({
        email: loginData.email,
        password: loginData.password
      })
      
      // Si el login es exitoso pero requiere 2FA
      if (response.requires2FA) {
        setStep("2fa")
      } else if (response.token) {
        // Login exitoso sin 2FA
        apiClient.setAuthToken(response.token)
        localStorage.setItem('authToken', response.token)
        router.push('/dashboard')
      }
    } catch (error) {
      setError("Credenciales inválidas")
      setAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await apiClient.login({
        email: loginData.email,
        password: loginData.password,
        twoFactor: loginData.twoFactor
      })
      
      if (response.token) {
        apiClient.setAuthToken(response.token)
        localStorage.setItem('authToken', response.token)
        router.push('/dashboard')
      }
    } catch (error) {
      setError("Código de verificación inválido")
      setAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Security Badge */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Conexión Segura SSL
          </Badge>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Sistema Libros </CardTitle>
            <CardDescription className="text-gray-600">
              {step === "credentials" ? "Autenticación de dos factores requerida" : "Ingresa tu código de verificación"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attempts >= maxAttempts && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Cuenta bloqueada temporalmente. Contacta al administrador.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Usuario Autorizado
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juez@tribunal.gob"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-11"
                    disabled={attempts >= maxAttempts}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Contraseña Segura
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="h-11 pr-10"
                      disabled={attempts >= maxAttempts}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={attempts >= maxAttempts}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={attempts >= maxAttempts || isLoading}
                >
                  {isLoading ? "Verificando..." : "Continuar con 2FA"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Código enviado a tu dispositivo móvil registrado
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="twoFactor" className="text-sm font-medium text-gray-700">
                    Código de Verificación (6 dígitos)
                  </Label>
                  <Input
                    id="twoFactor"
                    type="text"
                    placeholder="123456"
                    value={loginData.twoFactor}
                    onChange={(e) => setLoginData({ ...loginData, twoFactor: e.target.value })}
                    className="h-11 text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setStep("credentials")}
                  >
                    Volver
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verificando..." : "Verificar Acceso"}
                  </Button>
                </div>
                <Button variant="link" className="w-full text-sm text-gray-600">
                  Reenviar código
                </Button>
              </form>
            )}

            <div className="pt-4 border-t text-center space-y-2">
              <p className="text-xs text-gray-500">Sistema protegido por encriptación de 256 bits</p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>Política de Privacidad</span>
                <span>•</span>
                <span>Términos de Uso</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Sistema Judicial. Todos los derechos reservados.</p>
          <p>Versión 2.1.0 - Última actualización: Diciembre 2024</p>
        </div>
      </div>
    </div>
  )
} 