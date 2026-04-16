'use client'

import React, { useState } from 'react'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function NuevoUsuarioPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dni: '',
    username: '',
    clave: '',
    rol: 'normal'
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { user, isLoading } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiClient.createUsuario(form)
      router.push('/usuarios')
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center pt-24 text-gray-500">Verificando permisos...</div>
  }

  if (user?.rol !== 'admin') {
    return (
      <div className="p-8 text-center pt-24">
        <div className="bg-red-50 text-red-700 p-8 rounded-xl max-w-md mx-auto shadow ring-1 ring-red-100">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-6">Solo los administradores pueden registrar nuevos usuarios en el sistema.</p>
          <Link href="/usuarios">
            <button className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors">
              Volver Atrás
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto pt-24">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Alta de Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow ring-1 ring-gray-200">
        
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
            <p className="font-medium">Ha ocurrido un error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium text-gray-700">Nombre</label>
            <input 
              id="first_name" 
              name="first_name" 
              required 
              value={form.first_name} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium text-gray-700">Apellido</label>
            <input 
              id="last_name" 
              name="last_name" 
              required 
              value={form.last_name} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              type="email" 
              name="email" 
              required 
              value={form.email} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="dni" className="text-sm font-medium text-gray-700">DNI</label>
            <input 
              id="dni" 
              name="dni" 
              required 
              value={form.dni} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <input 
              id="username" 
              name="username" 
              required 
              value={form.username} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="clave" className="text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              id="clave" 
              type="password" 
              name="clave" 
              required 
              value={form.clave} 
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="rol" className="text-sm font-medium text-gray-700">Rol del Sistema</label>
          <select 
            id="rol" 
            name="rol" 
            value={form.rol} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          >
            <option value="normal">Usuario Normal</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
          <Link href="/usuarios">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Crear Usuario'}
          </button>
        </div>

      </form>
    </div>
  )
}
