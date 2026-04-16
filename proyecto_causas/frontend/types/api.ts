// Tipos para las respuestas de la API

export interface LoginResponse {
  token?: string
  requires2FA?: boolean
  user?: {
    id: string
    email: string
    nombre_completo: string
    rol: string
  }
  message?: string
}

export interface CausaResponse {
  id: string
  numero_causa: string
  caratula: string
  juzgado: string
  fiscalia: string
  magistrado: string
  preventor: string
  preventor_auxiliar: string
  provincia_id: string
  localidad_id: string
  provincia?: string
  localidad?: string
  domicilio: string
  nro_sgo: string
  nro_mto: string
  tipo_delito: string
  nombre_fantasia: string
  providencia: string
  estado: string
  ip_address?: string
  nombre_archivo?: string
  ruta_archivo?: string
  tipo_archivo?: string
  peso_archivo?: string
  subido_por?: string
  contenido_nota?: string
  fecha_creacion: string | Date
  fecha_actualizacion: string | Date
}

export interface UsuarioResponse {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  nombre_completo: string
  rol: string
  dni: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface CausasListResponse {
  causas: CausaResponse[]
  total: number
  page?: number
  limit?: number
}

export interface UsuariosListResponse {
  usuarios: UsuarioResponse[]
  total: number
  page?: number
  limit?: number
}

export interface ComboResponse {
  id: string
  nombre: string
  codigo?: string
}

export interface ProvinciaResponse extends ComboResponse { }
export interface LocalidadResponse extends ComboResponse { }
export interface FiscaliaResponse extends ComboResponse { }
export interface JuzgadoResponse extends ComboResponse { }
export interface PreventorResponse extends ComboResponse { }

export interface MesaEntradaResponse {
  id: number
  fecha: string | Date
  procedencia: string
  remitente: string
  juzgado?: string
  fiscalia?: string
  descripcion: string
  nro_causa: string
  obs?: string
  fecha_creacion: string | Date
}

export interface MesaEntradasListResponse {
  entradas: MesaEntradaResponse[]
  total: number
}






