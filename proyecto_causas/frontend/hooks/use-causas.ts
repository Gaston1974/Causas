"use client"

import { useCallback } from "react"
import { useCausasContext } from "@/contexts/causas-context"
import type { Causa, CausaFormData } from "@/types/causa"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import type { CausaResponse } from "@/types/api"

// Función auxiliar para transformar CausaResponse a Causa
function transformCausaResponse(causaResponse: any): Causa {
  // Helper para convertir valores "NULL", "VACIO", "" a valores reales
  const cleanValue = (value: any): string => {
    if (!value || value === 'NULL' || value === 'VACIO' || value === 'null') {
      return ''
    }
    return String(value)
  }

  // El backend puede devolver campos con mayúsculas o minúsculas
  const getData = (key: string): string => {
    // Intentar con la key original y con variaciones
    const value = causaResponse[key] ||
      causaResponse[key.charAt(0).toUpperCase() + key.slice(1)] ||
      causaResponse[key.toUpperCase()] ||
      causaResponse[key.toLowerCase()]
    return cleanValue(value)
  }

  // Parsear fecha
  const parseDate = (dateValue: any): Date => {
    if (!dateValue || dateValue === 'NULL' || dateValue === 'VACIO') {
      return new Date()
    }
    return typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  }

  // Normalizar estado
  const normalizeEstado = (estado: string): "activa" | "archivada" | "en_proceso" | "finalizada" => {
    const estadoLower = (estado || 'activa').toLowerCase()
    if (estadoLower === 'activa') return 'activa'
    if (estadoLower === 'archivada') return 'archivada'
    if (estadoLower === 'en_proceso' || estadoLower === 'en proceso') return 'en_proceso'
    if (estadoLower === 'finalizada') return 'finalizada'
    return 'activa' // default
  }

  return {
    id: getData('id') || String(Math.random()), // Generar ID si no existe
    numero_causa: getData('Nro_causa') || getData('numero_causa'),
    caratula: getData('Caratula') || getData('caratula'),
    juzgado: getData('Juzgado') || getData('juzgado'),
    fiscalia: getData('Fiscalia') || getData('fiscalia'),
    magistrado: getData('Magistrado') || getData('magistrado'),
    preventor: getData('Preventor') || getData('preventor'),
    preventor_auxiliar: getData('Preventor_auxiliar') || getData('preventor_auxiliar'),
    provincia_id: getData('Provincia_id') || getData('provincia_id'),
    localidad_id: getData('Localidad_id') || getData('localidad_id'),
    provincia: getData('Provincia') || getData('provincia'),
    localidad: getData('Localidad') || getData('localidad'),
    domicilio: getData('Domicilio') || getData('domicilio'),
    nro_sgo: getData('Nro_sgo') || getData('nro_sgo'),
    nro_mto: getData('Nro_mto') || getData('nro_mto'),
    tipo_delito: getData('Tipo_delito') || getData('tipo_delito'),
    nombre_fantasia: getData('Nombre_fantasia') || getData('nombre_fantasia'),
    providencia: getData('Providencia') || getData('providencia'),
    estado: normalizeEstado(getData('Estado') || getData('estado')),
    ip_address: getData('IpAdress') || getData('ip_address'),
    nombre_archivo: getData('Nombre_archivo') || getData('nombre_archivo'),
    ruta_archivo: getData('Ruta_archivo') || getData('ruta_archivo'),
    tipo_archivo: getData('Tipo_documento') || getData('tipo_archivo'),
    peso_archivo: getData('Tamano') || getData('peso_archivo'),
    subido_por: getData('UsuarioId') || getData('subido_por'),
    contenido_nota: getData('Nota_causas') || getData('contenido_nota'),
    fecha_creacion: parseDate(causaResponse.Fecha || causaResponse.fecha_creacion),
    fecha_actualizacion: parseDate(causaResponse.Fecha || causaResponse.Providencia || causaResponse.fecha_actualizacion),
  }
}

export function useCausas() {
  const { state, dispatch } = useCausasContext()

  const fetchCausas = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Verificar si hay token de autenticación
      const token = apiClient.getAuthToken()
      if (!token) {
        const errorMsg = "No se encontró token de autenticación. Por favor, inicia sesión."
        console.error('❌', errorMsg)
        dispatch({ type: "SET_ERROR", payload: errorMsg })
        toast.error(errorMsg)
        dispatch({ type: "SET_LOADING", payload: false })
        return
      }

      console.log('🔍 Iniciando carga de causas...')
      const response = await apiClient.getCausas()
      console.log('✅ Respuesta de la API:', response)

      // Transformar las causas
      const causasData = response.causas || response
      const transformedCausas = Array.isArray(causasData)
        ? causasData.map(transformCausaResponse)
        : []

      console.log(`📊 ${transformedCausas.length} causas transformadas correctamente`)

      dispatch({ type: "SET_CAUSAS", payload: transformedCausas })
      dispatch({
        type: "SET_PAGINATION", payload: {
          total: response.total || transformedCausas.length
        }
      })

      if (transformedCausas.length === 0) {
        toast.info("No hay causas para mostrar")
      }
    } catch (error: any) {
      console.error('❌ Error fetching causas:', error)

      let errorMessage = "Error al cargar las causas"

      // Mejorar el mensaje de error según el tipo
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente."
      } else if (error.message?.includes('404')) {
        errorMessage = "Endpoint no encontrado. Verifica la configuración de la API."
      } else if (error.message?.includes('500')) {
        errorMessage = "Error del servidor. Intenta nuevamente más tarde."
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = "Error de conexión. Verifica tu red o la disponibilidad del servidor."
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }

      dispatch({ type: "SET_ERROR", payload: errorMessage })
      toast.error(errorMessage)
    }
  }, [dispatch])

  const createCausa = useCallback(
    async (data: CausaFormData) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        console.log("📝 Preparando datos para crear causa:", data)

        // Construir payload compatible con backend Go (/altas)
        const payload = {
          ...data,
          tipo: "causa", // Discriminador requerido por el backend polimórfico

          // Mapeo temporal de provincias a IDs (el backend espera strings numéricos)
          provincia_id: data.provincia_id?.toLowerCase().includes("formosa") ? "2" : "1",
          localidad_id: data.localidad_id || "1", // Default id

          // Asegurar campos requeridos
          usuario_id: "1", // ID del creador (TODO: sacar de useAuth)
          estado: data.estado || "activa",
        }

        console.log("📤 Enviando payload a /altas:", payload)

        const response = await apiClient.createCausa(payload) as any
        console.log('Respuesta al crear causa:', response)

        const causaData = response?.causa || response
        const newCausa = transformCausaResponse(causaData)

        dispatch({ type: "ADD_CAUSA", payload: newCausa })
        toast.success("Causa creada exitosamente")
        return newCausa
      } catch (error) {
        console.error('Error creating causa:', error)
        dispatch({ type: "SET_ERROR", payload: "Error al crear la causa" })
        toast.error("Error al crear la causa")
        throw error
      }
    },
    [dispatch],
  )

  const updateCausa = useCallback(
    async (id: string, data: CausaFormData) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const updateData = { id, ...data }
        const response = await apiClient.updateCausa(updateData) as any
        console.log('Respuesta al actualizar causa:', response)

        const causaData = response?.causa || response
        const updatedCausa = transformCausaResponse(causaData)

        dispatch({ type: "UPDATE_CAUSA", payload: updatedCausa })
        toast.success("Causa actualizada exitosamente")
        return updatedCausa
      } catch (error) {
        console.error('Error updating causa:', error)
        dispatch({ type: "SET_ERROR", payload: "Error al actualizar la causa" })
        toast.error("Error al actualizar la causa")
        throw error
      }
    },
    [dispatch],
  )

  const deleteCausa = useCallback(
    async (id: string) => {
      try {
        await apiClient.deleteCausa({ id })
        dispatch({ type: "DELETE_CAUSA", payload: id })
        toast.success("Causa eliminada exitosamente")
      } catch (error) {
        console.error('Error deleting causa:', error)
        dispatch({ type: "SET_ERROR", payload: "Error al eliminar la causa" })
        toast.error("Error al eliminar la causa")
        throw error
      }
    },
    [dispatch],
  )

  const setFilters = useCallback(
    (filters: Partial<typeof state.filters>) => {
      dispatch({ type: "SET_FILTERS", payload: filters })
    },
    [dispatch],
  )

  const setPagination = useCallback(
    (pagination: Partial<typeof state.pagination>) => {
      dispatch({ type: "SET_PAGINATION", payload: pagination })
    },
    [dispatch],
  )

  return {
    causas: state.causas,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    fetchCausas,
    createCausa,
    updateCausa,
    deleteCausa,
    setFilters,
    setPagination,
  }
}
