export interface Causa {
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
  tipo_delito_id?: number | string
  nombre_fantasia: string
  providencia: string
  estado: "activa" | "archivada" | "en_proceso" | "finalizada"
  ip_address?: string
  nombre_archivo?: string
  ruta_archivo?: string
  tipo_archivo?: string
  peso_archivo?: string
  subido_por?: string
  contenido_nota?: string
  fecha_creacion: Date
  fecha_actualizacion: Date
}

export interface CausaFormData {
  numero_causa: string
  caratula: string
  juzgado: string
  fiscalia: string
  magistrado?: string
  preventor: string
  preventor_auxiliar: string
  provincia_id: string
  localidad_id?: string
  domicilio?: string
  nro_sgo: string
  nro_mto: string
  tipo_delito: string
  nombre_fantasia: string
  providencia: string
  estado: "activa" | "archivada" | "en_proceso" | "finalizada"
  contenido_nota?: string
}

export interface CausaFilters {
  search: string
  fiscalia: string
  provincia: string
  estado: string
  preventor_auxiliar: string
}
