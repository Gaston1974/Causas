"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient, API_CONFIG } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: any
}

export default function DiagnosticoPage() {
  const { isAuthenticated, token, user } = useAuth()
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const results: DiagnosticResult[] = []

    // 1. Verificar autenticación
    results.push({
      name: "Autenticación",
      status: isAuthenticated ? "success" : "error",
      message: isAuthenticated ? "Usuario autenticado" : "No hay sesión activa",
      details: {
        tokenPresente: !!token,
        tokenLength: token?.length || 0,
        usuario: user?.email || "N/A"
      }
    })

    // 2. Verificar token en localStorage
    const savedToken = localStorage.getItem('authToken')
    results.push({
      name: "Token en localStorage",
      status: savedToken ? "success" : "error",
      message: savedToken ? "Token guardado en localStorage" : "No hay token guardado",
      details: {
        tokenLength: savedToken?.length || 0,
        primeros20: savedToken?.substring(0, 20) || "N/A"
      }
    })

    // 3. Verificar token en apiClient
    const apiToken = apiClient.getAuthToken()
    results.push({
      name: "Token en API Client",
      status: apiToken ? "success" : "error",
      message: apiToken ? "Token configurado en API Client" : "No hay token en API Client",
      details: {
        tokenLength: apiToken?.length || 0,
        primeros20: apiToken?.substring(0, 20) || "N/A"
      }
    })

    // 4. Verificar conexión con el servidor
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/causas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiToken || ''
        },
        body: JSON.stringify({})
      })

      results.push({
        name: "Conexión con API",
        status: response.ok ? "success" : "error",
        message: response.ok
          ? `Servidor respondió: ${response.status} ${response.statusText}`
          : `Error del servidor: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: API_CONFIG.BASE_URL + '/causas'
        }
      })

      // 5. Intentar parsear la respuesta
      if (response.ok) {
        try {
          const data = await response.json()
          results.push({
            name: "Respuesta del API",
            status: "success",
            message: `Datos recibidos correctamente`,
            details: {
              esArray: Array.isArray(data),
              tienePropiedad: data.causas ? 'causas' : data.length ? 'array directo' : 'objeto',
              cantidad: Array.isArray(data) ? data.length : data.causas?.length || 0
            }
          })
        } catch (parseError: any) {
          results.push({
            name: "Parseo de respuesta",
            status: "error",
            message: `Error al parsear JSON: ${parseError.message}`,
            details: parseError
          })
        }
      }
    } catch (networkError: any) {
      results.push({
        name: "Conexión con API",
        status: "error",
        message: `Error de red: ${networkError.message}`,
        details: {
          error: networkError.message,
          url: API_CONFIG.BASE_URL
        }
      })
    }

    setDiagnostics(results)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
      pending: "outline"
    }
    return (
      <Badge variant={variants[status] as any}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico del Sistema</h1>
          <p className="text-muted-foreground">
            Verifica el estado de autenticación y conexión con la API
          </p>
        </div>
        <Button onClick={runDiagnostics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de la API</CardTitle>
          <CardDescription>Información sobre el endpoint y configuración</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-semibold">URL Base:</dt>
              <dd className="text-muted-foreground">{API_CONFIG.BASE_URL}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">Endpoint Causas:</dt>
              <dd className="text-muted-foreground">{API_CONFIG.ENDPOINTS.CAUSAS}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">URL Completa:</dt>
              <dd className="text-muted-foreground">{API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CAUSAS}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Resultados de Diagnóstico</h2>
        {diagnostics.map((diagnostic, index) => (
          <Card key={diagnostic.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostic.status)}
                  <CardTitle className="text-lg">{diagnostic.name}</CardTitle>
                </div>
                {getStatusBadge(diagnostic.status)}
              </div>
              <CardDescription>{diagnostic.message}</CardDescription>
            </CardHeader>
            {diagnostic.details && (
              <CardContent>
                <details className="cursor-pointer">
                  <summary className="font-semibold mb-2">Ver detalles</summary>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                    {JSON.stringify(diagnostic.details, null, 2)}
                  </pre>
                </details>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {diagnostics.length === 0 && !loading && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Haz clic en "Ejecutar Diagnóstico" para comenzar
          </CardContent>
        </Card>
      )}
    </div>
  )
}

