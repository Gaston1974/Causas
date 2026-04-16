import type {
  LoginResponse,
  CausaResponse,
  UsuarioResponse,
  CausasListResponse,
  UsuariosListResponse,
  ProvinciaResponse,
  LocalidadResponse,
  FiscaliaResponse,
  JuzgadoResponse,
  PreventorResponse,
  MesaEntradaResponse,
  MesaEntradasListResponse
} from "@/types/api"

// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: 'http://10.50.22.142:8000/v1',
  ENDPOINTS: {
    LOGIN: '/login',
    ALTAS: '/altas',
    BAJAS: '/bajas',
    CAUSAS: '/causas',
    CAUSAS_ALTA: '/causas/alta',
    USUARIOS: '/usuarios',
    CAUSAS_HISTORICO: '/causas/historico',
    UPDATES: '/updates',
    COMBOS: {
      PROVINCIAS: '/combos/provincias',
      LOCALIDADES: '/combos/localidades',
      FISCALIAS: '/combos/fiscalias',
      JUZGADOS: '/combos/juzgados',
      PREVENTORES: '/combos/preventores',
    },
    MESA: '/mesa',
    MESA_ALTA: '/mesa/alta',
    // ── Nuevos módulos (Fase 2) ──────────────────────────────
    CAUSA_ORIGEN: (id: number | string) => `/causas/${id}/origen`,
    CAUSA_TELEFONOS: (id: number | string) => `/causas/${id}/telefonos`,
    CAUSA_TECNICAS: (id: number | string) => `/causas/${id}/tecnicas`,
    CAUSA_OFICIOS: (id: number | string) => `/causas/${id}/oficios`,
    CAUSA_ALLANAMIENTO: (id: number | string) => `/causas/${id}/allanamiento`,
    CAUSA_SGOS: (id: number | string) => `/causas/${id}/sgos`,
    // Bulk replace
    CAUSA_TELEFONOS_BULK: (id: number | string) => `/causas/${id}/telefonos/bulk`,
    CAUSA_TECNICAS_BULK: (id: number | string) => `/causas/${id}/tecnicas/bulk`,
    CAUSA_OFICIOS_BULK: (id: number | string) => `/causas/${id}/oficios/bulk`,
    CAUSA_SGOS_BULK: (id: number | string) => `/causas/${id}/sgos/bulk`,
  }
}

// Clase para manejar las llamadas a la API
export class ApiClient {
  private baseURL: string
  private authToken: string | null = null

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL
  }

  setAuthToken(token: string) {
    this.authToken = token
    if (token) {
      console.log('🔐 Token configurado en ApiClient:', token.substring(0, 20) + '...')
    } else {
      console.log('🔓 Token eliminado de ApiClient')
    }
  }

  getAuthToken(): string | null {
    return this.authToken
  }

  private getHeaders(contentType: string = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    }

    if (this.authToken) {
      headers['Authorization'] = this.authToken
      console.log('🔑 Header Authorization agregado:', this.authToken.substring(0, 20) + '...')
    } else {
      console.log('⚠️ No hay token de autenticación disponible')
    }

    return headers
  }

  async post<T>(endpoint: string, data?: any, skipAuth: boolean = false): Promise<T> {
    try {
      // Si data es undefined o null, enviar un objeto vacío
      const bodyData = data !== undefined && data !== null ? data : {}
      const bodyString = JSON.stringify(bodyData)

      console.log(`📤 Enviando POST a ${this.baseURL}${endpoint}`)
      console.log(`📦 Body:`, bodyString)
      console.log(`🔐 Con autenticación:`, !skipAuth && !!this.authToken)
      console.log(`🔐 URL: ${this.baseURL}${endpoint}`)

      const headers = skipAuth ? {
        'Content-Type': 'application/json'
      } : this.getHeaders()


      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: bodyString,
        //mode: 'cors',
      })

      console.log(`📡 Status de respuesta:`, response.status, response.statusText)

      if (!response.ok) {
        let errorText = ''
        let errorDetails = ''
        try {
          errorText = await response.text()
          console.error(`❌ Error ${response.status} en ${endpoint}:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            contentType: response.headers.get('content-type'),
            url: `${this.baseURL}${endpoint}`
          })

          // Intentar parsear el error como JSON para obtener más detalles
          try {
            const errorJson = JSON.parse(errorText)
            console.error('📋 Detalles del error (JSON):', errorJson)

            // Extraer información específica de errores de validación
            if (errorJson.errors) {
              errorDetails = JSON.stringify(errorJson.errors, null, 2)
              console.error('🔍 Errores de validación:', errorJson.errors)
            } else if (errorJson.message) {
              errorDetails = errorJson.message
            } else if (errorJson.detail) {
              errorDetails = errorJson.detail
            }
          } catch (jsonError) {
            // Si no es JSON, usar el texto tal cual
            errorDetails = errorText
          }
        } catch (e) {
          console.error(`❌ No se pudo leer el cuerpo del error`)
        }

        const fullError = errorDetails || errorText
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}${fullError ? `: ${fullError}` : ''}`)
      }

      // Intentar parsear como JSON
      try {
        const result = await response.json()
        console.log(`✅ Respuesta exitosa de ${endpoint} (primeros elementos):`, Array.isArray(result) ? result.slice(0, 2) : result)
        return result
      } catch (parseError) {
        // Si falla el parseo JSON, intentar leer como texto
        const text = await response.text()
        console.error(`❌ Error parseando JSON de ${endpoint}:`, parseError)
        console.log(`📄 Respuesta como texto (primeros 500 caracteres):`, text.substring(0, 500))
        throw new Error(`Error parseando respuesta JSON: ${parseError}`)
      }
    } catch (error: any) {
      console.error(`❌ Error en la petición POST a ${endpoint}:`, error)
      // Si es un error de red, agregar más contexto
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error(`Failed to fetch: No se pudo conectar a ${this.baseURL}${endpoint}. Verifica que el servidor esté corriendo y sea accesible.`)
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error en ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const result = await response.json()
      console.log(`Respuesta exitosa de ${endpoint}:`, result)
      return result
    } catch (error) {
      console.error(`Error en la petición GET a ${endpoint}:`, error)
      throw error
    }
  }

  // Métodos específicos para cada endpoint
  async login(credentials: { email?: string; password: string; twoFactor?: string; ce?: string; username?: string; dni?: string }): Promise<LoginResponse> {
    return this.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials)
  }

  async getCausas(): Promise<CausasListResponse> {
    console.log('📋 Consultando causas con token:', this.authToken ? 'Sí' : 'No')

    try {
      // El backend NECESITA un body JSON (aunque sea vacío) para parsear correctamente
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CAUSAS}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({}), // Body vacío pero válido
      })

      console.log(`📡 Status de respuesta (getCausas):`, response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Error en getCausas:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      // Parsear la respuesta JSON
      const result = await response.json()

      if (Array.isArray(result)) {
        console.log(`✅ ${result.length} causas recibidas exitosamente`)
        console.log(`📋 Primeras 2 causas:`, result.slice(0, 2))

        return {
          causas: result,
          total: result.length
        }
      }

      // Si ya viene en el formato esperado con causas y total
      console.log(`✅ Respuesta en formato objeto:`, { causas: result.causas?.length || 0, total: result.total })
      return result

    } catch (error: any) {
      console.error(`❌ Error en getCausas:`, error.message || error)
      throw error
    }
  }

  async getCausasWithFilter(filterData: any): Promise<CausasListResponse> {
    return this.post<CausasListResponse>(API_CONFIG.ENDPOINTS.CAUSAS, filterData)
  }

  async getCausaHistorico(historicoData: any): Promise<CausaResponse[]> {
    return this.post<CausaResponse[]>(API_CONFIG.ENDPOINTS.CAUSAS_HISTORICO, historicoData)
  }

  async getUsuarios(): Promise<UsuariosListResponse> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.USUARIOS}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Error fetching usuarios: ${response.statusText}`)
    }
    const result = await response.json()
    if (Array.isArray(result)) {
      return { usuarios: result, total: result.length } as any
    }
    return result
  }

  async getUsuariosWithFilter(filterData: any): Promise<UsuariosListResponse> {
    return this.post<UsuariosListResponse>(API_CONFIG.ENDPOINTS.USUARIOS, filterData)
  }

  async createCausa(causaData: any) {
    return this.post(API_CONFIG.ENDPOINTS.CAUSAS_ALTA, causaData)
  }

  async createUsuario(usuarioData: any) {
    return this.post(API_CONFIG.ENDPOINTS.USUARIOS, usuarioData)
  }

  async registerUsuario(usuarioData: any) {
    // Registro público de usuario (sin autenticación)
    console.log(`📦  url:`, API_CONFIG.ENDPOINTS.USUARIOS)
    return this.post(API_CONFIG.ENDPOINTS.USUARIOS, usuarioData, true)
  }

  async updateCausa(causaData: any) {
    return this.post(API_CONFIG.ENDPOINTS.UPDATES, causaData)
  }

  async updateUsuario(usuarioData: any) {
    return this.post(API_CONFIG.ENDPOINTS.UPDATES, usuarioData)
  }

  async deleteCausa(causaData: any) {
    return this.post(API_CONFIG.ENDPOINTS.BAJAS, causaData)
  }

  async deleteUsuario(usuarioData: any) {
    return this.post(API_CONFIG.ENDPOINTS.BAJAS, usuarioData)
  }

  // Métodos para combos
  async getProvincias(): Promise<ProvinciaResponse[]> {
    return this.get<ProvinciaResponse[]>(API_CONFIG.ENDPOINTS.COMBOS.PROVINCIAS)
  }

  async getLocalidades(): Promise<LocalidadResponse[]> {
    return this.get<LocalidadResponse[]>(API_CONFIG.ENDPOINTS.COMBOS.LOCALIDADES)
  }

  async getFiscalias(): Promise<FiscaliaResponse[]> {
    return this.get<FiscaliaResponse[]>(API_CONFIG.ENDPOINTS.COMBOS.FISCALIAS)
  }

  async getJuzgados(): Promise<JuzgadoResponse[]> {
    return this.get<JuzgadoResponse[]>(API_CONFIG.ENDPOINTS.COMBOS.JUZGADOS)
  }

  async getPreventores(): Promise<PreventorResponse[]> {
    return this.get<PreventorResponse[]>(API_CONFIG.ENDPOINTS.COMBOS.PREVENTORES)
  }

  // Métodos para Mesa de Entradas
  async getMesaEntradas(): Promise<MesaEntradasListResponse> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.MESA}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({}),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }
    const result = await response.json()
    if (Array.isArray(result)) {
      return { entradas: result, total: result.length }
    }
    return result
  }

  async createMesaEntrada(data: any): Promise<MesaEntradaResponse> {
    return this.post<MesaEntradaResponse>(API_CONFIG.ENDPOINTS.MESA_ALTA, data)
  }

  async updateMesaEntrada(id: number, data: any): Promise<MesaEntradaResponse> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.MESA}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }
    return response.json()
  }

  async deleteMesaEntrada(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.MESA}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }
  }

  // ─── FASE 2: Nuevos módulos ──────────────────────────────────────────────

  // Origen
  async getOrigen(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_ORIGEN(causaId))
  }
  async upsertOrigen(causaId: number | string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_ORIGEN(causaId), data)
  }

  // Teléfonos
  async getTelefonos(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_TELEFONOS(causaId))
  }
  async saveTelefonosBulk(causaId: number | string, data: any[]) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_TELEFONOS_BULK(causaId), data)
  }

  // Técnicas
  async getTecnicas(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_TECNICAS(causaId))
  }
  async saveTecnicasBulk(causaId: number | string, data: any[]) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_TECNICAS_BULK(causaId), data)
  }

  // Oficios
  async getOficios(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_OFICIOS(causaId))
  }
  async saveOficiosBulk(causaId: number | string, data: any[]) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_OFICIOS_BULK(causaId), data)
  }

  // Allanamiento (upsert completo con sub-módulos)
  async getAllanamiento(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_ALLANAMIENTO(causaId))
  }
  async saveAllanamiento(causaId: number | string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_ALLANAMIENTO(causaId), data)
  }

  // SGOs
  async getSGOs(causaId: number | string) {
    return this.get(API_CONFIG.ENDPOINTS.CAUSA_SGOS(causaId))
  }
  async saveSGOsBulk(causaId: number | string, data: any[]) {
    return this.put(API_CONFIG.ENDPOINTS.CAUSA_SGOS_BULK(causaId), data)
  }

  // ── Método genérico PUT ────────────────────────────────────────────────────
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data ?? {}),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      const result = await response.json()
      return result
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error)
      throw error
    }
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient()
