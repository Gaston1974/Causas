// ============================================================
// TIPOS — MÓDULOS EXTRAS DE CAUSA
// ============================================================

// --- ORIGEN DE LA CAUSA ---

export type OrigenTipo = "UNIDAD" | "JUDICATURA"
export type OrigenSubtipoUnidad = "NOTITIA_CRIMINIS" | "REGISTRO_INFORMANTE" | "OTRA"

export interface CausaOrigen {
  id?: string
  causa_id: string
  origen_tipo: OrigenTipo          // UNIDAD o JUDICATURA
  // Si origen es UNIDAD:
  subtipo_unidad?: OrigenSubtipoUnidad
  descripcion_unidad?: string
  // Si origen es JUDICATURA:
  denuncia_anonima?: boolean
  descripcion_judicatura?: string
  observaciones?: string
}

// --- TELÉFONOS INTERVENIDOS ---

export type ModalidadLinea = "DIRECTA" | "DIFERIDA"

export interface CausaTelefono {
  _id?: string
  id?: string
  causa_id: string
  numero_linea: string
  titular: string
  modalidad: ModalidadLinea
  observaciones?: string
  fecha_inicio?: string
  fecha_fin?: string
}

// --- TÉCNICAS ESPECIALES INVESTIGATIVAS ---

export type TecnicaTipo =
  | "AGENTE_ENCUBIERTO"
  | "AGENTE_REVELADOR"
  | "AGENTE_REVELADOR_DIGITAL"
  | "COTEJO_VOCES"
  | "OTRA"

export interface CausaTecnica {
  _id?: string
  id?: string
  causa_id: string
  tipo: TecnicaTipo
  descripcion?: string
  fecha_inicio?: string
  fecha_fin?: string
  resultado?: string
  observaciones?: string
}

// Labels descriptivos para las técnicas
export const TECNICA_LABELS: Record<TecnicaTipo, string> = {
  AGENTE_ENCUBIERTO: "Agente Encubierto",
  AGENTE_REVELADOR: "Agente Revelador",
  AGENTE_REVELADOR_DIGITAL: "Agente Revelador Digital",
  COTEJO_VOCES: "Cotejo de Voces",
  OTRA: "Otra",
}

// --- OFICIOS / ELEVACIÓN ---

export type OficioTipo =
  | "ELEVACION"
  | "INFORME"
  | "NOTIFICACION"
  | "REQUERIMIENTO"
  | "OTRO"

export interface CausaOficio {
  _id?: string
  id?: string
  causa_id: string
  tipo: OficioTipo
  numero_oficio?: string
  fecha_oficio?: string
  destinatario: string
  descripcion: string
  // Campos específicos de Elevación:
  nota_elevacion?: string
  fecha_elevacion?: string
  observaciones?: string
}

// --- VINCULACIÓN SGO ---

export interface CausaSGO {
  _id?: string
  id?: string
  causa_id: string
  nro_sgo: string
  descripcion?: string
  fecha_vinculacion?: string
  observaciones?: string
}
