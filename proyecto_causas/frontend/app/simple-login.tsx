"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function SimpleLogin() {
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Estado para el formulario de crear usuario (alineado con backend)
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    ce: "",
    grado: "",
    password: "",
  })
  const [creating, setCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || email.length < 4) {
      setError("El CE debe tener al menos 4 dígitos.")
      setIsLoading(false)
      return
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Credenciales incorrectas. Verifique su CE y contraseña.")
      }
    } catch (err: any) {
      if (err.message.includes("400")) {
        setError("Los datos ingresados no son válidos. Intente nuevamente.")
      } else if (err.message.includes("401")) {
        setError("Credenciales incorrectas. Verifique su CE y contraseña.")
      } else if (err.message.includes("404")) {
        setError("Servicio no disponible. Contacte al administrador.")
      } else {
        setError("Error de conexión. Verifique su acceso a internet.")
      }
    }

    setIsLoading(false)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!newUser.nombre.trim()) {
      alert("⚠️ Por favor ingresa el nombre");
      return;
    }
    if (!newUser.apellido.trim()) {
      alert("⚠️ Por favor ingresa el apellido");
      return;
    }
    if (!newUser.ce || newUser.ce.length < 4) {
      alert("⚠️ El CE debe tener al menos 4 dígitos");
      return;
    }
    if (!newUser.grado.trim()) {
      alert("⚠️ Por favor ingresa el grado");
      return;
    }
    if (!newUser.password || newUser.password.length < 6) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCreating(true);
    try {
      const userData = {
        // Campos básicos
        first_name: newUser.nombre,
        last_name: newUser.apellido,
        clave: newUser.password,

        // Campo discriminador de tipo
        tipo: "usuario",

        // Identificadores
        ce: newUser.ce,
        dni: newUser.ce.toString(),
        username: newUser.ce,
        email: `${newUser.ce}`,

        // Ubicación por defecto
        provincia_id: "1",
        localidad_id: "1",

        // Otros datos
        grado: newUser.grado,
        rol: "normal",
        nombre_completo: `${newUser.nombre} ${newUser.apellido}`
      };

      console.log('📤 Enviando datos de usuario:', JSON.stringify(userData, null, 2));
      const response = await apiClient.registerUsuario(userData);
      console.log('✅ Respuesta del servidor:', response);

      // Limpiar y cerrar
      setNewUser({ nombre: "", apellido: "", ce: "", grado: "", password: "" });
      setIsDialogOpen(false);
      alert("✅ Usuario creado correctamente. Ahora puede iniciar sesión con su CE y contraseña.");

    } catch (err: any) {
      console.error('❌ Error creating user:', err);
      let errorMessage = "Error desconocido al crear usuario";

      if (err.message === "Failed to fetch" || err.message.includes("fetch")) {
        errorMessage = "❌ Error de conexión. No se puede conectar al servidor.";
      } else if (err.message.includes("401")) {
        errorMessage = "❌ No autorizado (401). El endpoint requiere autenticación.";
      } else if (err.message.includes("400")) {
        errorMessage = "❌ Datos inválidos (400). El servidor rechazó los datos enviados.\n\nDetalles: " + err.message;
      } else if (err.message.includes("404")) {
        errorMessage = "❌ Endpoint no encontrado (404).";
      } else if (err.message.includes("409") || err.message.includes("existe") || err.message.includes("duplicate")) {
        errorMessage = "❌ Este usuario ya existe. El CE ingresado ya está registrado.";
      } else if (err.message.includes("500")) {
        errorMessage = "❌ Error interno del servidor (500).\n\n" + err.message;
      } else {
        errorMessage = `❌ Error al crear usuario\n\n${err.message}`;
      }

      alert(errorMessage);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Departamento de Delitos Tecnologicos</CardTitle>
          <CardDescription className="text-gray-600">Gestión de Causas Judiciales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Usuario</Label>
              <Input
                id="email"
                type="text"
                placeholder="escriba su CE"
                value={email}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 15)
                  setEmail(value)
                }}
                className="h-11"
                maxLength={15}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="link" type="button" className="px-0 text-sm text-blue-600 hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Sección de Creación de Usuario / Soporte */}
          <div className="text-center pt-4 border-t space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="px-1 text-sm text-blue-600 hover:text-blue-800">
                    Crear usuario
                  </Button>
                </DialogTrigger>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Crear nuevo usuario</DialogTitle>
                    <DialogDescription>Completa los datos para registrar un nuevo usuario en el sistema.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="d-nombre">Nombre</Label>
                        <Input
                          id="d-nombre"
                          value={newUser.nombre}
                          onChange={e => setNewUser({ ...newUser, nombre: e.target.value })}
                          placeholder="Juan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d-apellido">Apellido</Label>
                        <Input
                          id="d-apellido"
                          value={newUser.apellido}
                          onChange={e => setNewUser({ ...newUser, apellido: e.target.value })}
                          placeholder="Pérez"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d-ce">Credencial (CE)</Label>
                        <Input
                          id="d-ce"
                          type="text"
                          value={newUser.ce}
                          onChange={e => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 15)
                            setNewUser({ ...newUser, ce: value })
                          }}
                          placeholder="123456"
                          maxLength={15}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d-grado">Grado</Label>
                        <Input
                          id="d-grado"
                          value={newUser.grado}
                          onChange={e => setNewUser({ ...newUser, grado: e.target.value })}
                          placeholder="Cabo Primero"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="d-password">Contraseña</Label>
                        <Input
                          id="d-password"
                          type="password"
                          value={newUser.password}
                          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="pt-4 mt-2 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={creating}>
                        {creating ? "Registrando..." : "Confirmar Registro"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}